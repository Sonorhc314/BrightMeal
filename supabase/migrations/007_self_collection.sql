-- ============================================================
-- Migration 007: Self-Collection + RPC Bug Fixes
-- Adds charity self-collection delivery method.
-- Also fixes create_donation RPC to persist photo_url and date_type.
-- ============================================================

-- ============================================================
-- A. Add delivery_method column
-- ============================================================
ALTER TABLE donations ADD COLUMN IF NOT EXISTS delivery_method TEXT DEFAULT 'driver_delivery'
  CHECK (delivery_method IN ('driver_delivery', 'charity_pickup'));

-- ============================================================
-- B. Update create_donation RPC (fixes photo_url + date_type bug, adds delivery_method)
-- ============================================================
CREATE OR REPLACE FUNCTION create_donation(
  p_item_name TEXT,
  p_category donation_category,
  p_quantity NUMERIC,
  p_unit donation_unit,
  p_storage storage_type,
  p_allergens TEXT[],
  p_packaging packaging_type,
  p_ready_by TIMESTAMPTZ,
  p_use_by TIMESTAMPTZ,
  p_pickup_window_start TIMESTAMPTZ,
  p_pickup_window_end TIMESTAMPTZ,
  p_pickup_location TEXT,
  p_additional_notes TEXT DEFAULT NULL,
  p_photo_url TEXT DEFAULT NULL,
  p_date_type TEXT DEFAULT 'use_by',
  p_delivery_method TEXT DEFAULT 'driver_delivery'
) RETURNS UUID AS $$
DECLARE
  v_role user_role;
  v_donation_id UUID;
BEGIN
  SELECT role INTO v_role FROM profiles WHERE id = auth.uid();
  IF v_role IS DISTINCT FROM 'donor' THEN
    RAISE EXCEPTION 'Only donors can create donations';
  END IF;

  INSERT INTO donations (
    donor_id, item_name, category, quantity, unit, storage,
    allergens, packaging, ready_by, use_by,
    pickup_window_start, pickup_window_end, pickup_location,
    additional_notes, photo_url, date_type, delivery_method, status
  ) VALUES (
    auth.uid(), p_item_name, p_category, p_quantity, p_unit, p_storage,
    p_allergens, p_packaging, p_ready_by, p_use_by,
    p_pickup_window_start, p_pickup_window_end, p_pickup_location,
    p_additional_notes, p_photo_url, p_date_type, p_delivery_method, 'posted'
  ) RETURNING id INTO v_donation_id;

  INSERT INTO donation_events (donation_id, status, actor_id)
  VALUES (v_donation_id, 'posted', auth.uid());

  RETURN v_donation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================
-- C. Update status transition trigger (allow accepted -> delivered for charity_pickup)
-- ============================================================
CREATE OR REPLACE FUNCTION fn_enforce_status_transition()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  IF OLD.status IN ('delivered', 'cancelled') THEN
    RAISE EXCEPTION 'Cannot transition from terminal status: %', OLD.status;
  END IF;

  CASE OLD.status
    WHEN 'posted' THEN
      IF NEW.status NOT IN ('accepted', 'cancelled') THEN
        RAISE EXCEPTION 'Invalid transition from posted to %', NEW.status;
      END IF;
    WHEN 'accepted' THEN
      IF NEW.delivery_method = 'charity_pickup' THEN
        IF NEW.status NOT IN ('driver_assigned', 'delivered', 'cancelled') THEN
          RAISE EXCEPTION 'Invalid transition from accepted to %', NEW.status;
        END IF;
      ELSE
        IF NEW.status NOT IN ('driver_assigned', 'cancelled') THEN
          RAISE EXCEPTION 'Invalid transition from accepted to %', NEW.status;
        END IF;
      END IF;
    WHEN 'driver_assigned' THEN
      IF NEW.status NOT IN ('picked_up', 'cancelled') THEN
        RAISE EXCEPTION 'Invalid transition from driver_assigned to %', NEW.status;
      END IF;
    WHEN 'picked_up' THEN
      IF NEW.status NOT IN ('delivered', 'cancelled') THEN
        RAISE EXCEPTION 'Invalid transition from picked_up to %', NEW.status;
      END IF;
  END CASE;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- D. New RPC: mark_charity_collected
-- ============================================================
CREATE OR REPLACE FUNCTION mark_charity_collected(p_donation_id UUID)
RETURNS VOID AS $$
DECLARE
  v_role user_role;
  v_donation donations%ROWTYPE;
  v_points INTEGER;
  v_kg NUMERIC;
  v_new_donor_points INTEGER;
  v_new_charity_points INTEGER;
  v_new_donor_kg NUMERIC;
  v_new_charity_kg NUMERIC;
  v_donor_delivered BIGINT;
  v_charity_delivered BIGINT;
BEGIN
  SELECT role INTO v_role FROM profiles WHERE id = auth.uid();
  IF v_role IS DISTINCT FROM 'charity' THEN
    RAISE EXCEPTION 'Only charities can mark self-collection';
  END IF;

  SELECT * INTO v_donation FROM donations WHERE id = p_donation_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Donation not found';
  END IF;

  IF v_donation.charity_id != auth.uid() THEN
    RAISE EXCEPTION 'You are not the assigned charity';
  END IF;

  IF v_donation.delivery_method != 'charity_pickup' THEN
    RAISE EXCEPTION 'This donation is not set for charity pickup';
  END IF;

  IF v_donation.status != 'accepted' THEN
    RAISE EXCEPTION 'Cannot mark as collected from status: %', v_donation.status;
  END IF;

  UPDATE donations SET status = 'delivered' WHERE id = p_donation_id;

  INSERT INTO donation_events (donation_id, status, actor_id)
  VALUES (p_donation_id, 'delivered', auth.uid());

  -- Notify donor
  INSERT INTO notifications (user_id, donation_id, type, title, message)
  VALUES (
    v_donation.donor_id, p_donation_id, 'delivery_complete',
    'Collection Complete!',
    'Your ' || v_donation.item_name || ' has been collected by the charity.'
  );

  -- GAMIFICATION (donor + charity only, no driver)
  PERFORM set_config('brightmeal.privileged', 'true', true);

  v_points := fn_calculate_points(v_donation.quantity, v_donation.unit);
  v_kg := fn_to_kg(v_donation.quantity, v_donation.unit);

  -- Award points to donor
  UPDATE profiles
  SET total_points = total_points + v_points,
      total_kg_impact = total_kg_impact + v_kg,
      total_donations_completed = total_donations_completed + 1
  WHERE id = v_donation.donor_id
  RETURNING total_points, total_kg_impact INTO v_new_donor_points, v_new_donor_kg;

  -- Award points to charity
  UPDATE profiles
  SET total_points = total_points + v_points,
      total_kg_impact = total_kg_impact + v_kg,
      total_donations_completed = total_donations_completed + 1
  WHERE id = auth.uid()
  RETURNING total_points, total_kg_impact INTO v_new_charity_points, v_new_charity_kg;

  -- Update streaks
  PERFORM fn_update_streak(v_donation.donor_id);
  PERFORM fn_update_streak(auth.uid());

  -- Count delivered donations for badge checks
  SELECT COUNT(*) INTO v_donor_delivered
  FROM donations WHERE donor_id = v_donation.donor_id AND status = 'delivered';

  SELECT COUNT(*) INTO v_charity_delivered
  FROM donations WHERE charity_id = auth.uid() AND status = 'delivered';

  -- Award badges
  PERFORM fn_check_and_award_badges(
    v_donation.donor_id, 'donor',
    v_new_donor_points, v_donor_delivered, v_new_donor_kg
  );

  PERFORM fn_check_and_award_badges(
    auth.uid(), 'charity',
    v_new_charity_points, v_charity_delivered, v_new_charity_kg
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================
-- E. Update assign_driver to block charity_pickup donations
-- ============================================================
CREATE OR REPLACE FUNCTION assign_driver(p_donation_id UUID)
RETURNS VOID AS $$
DECLARE
  v_role user_role;
  v_donation donations%ROWTYPE;
BEGIN
  SELECT role INTO v_role FROM profiles WHERE id = auth.uid();
  IF v_role IS DISTINCT FROM 'driver' THEN
    RAISE EXCEPTION 'Only drivers can accept jobs';
  END IF;

  SELECT * INTO v_donation FROM donations WHERE id = p_donation_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Donation not found';
  END IF;

  IF v_donation.delivery_method = 'charity_pickup' THEN
    RAISE EXCEPTION 'This donation is for charity self-collection, no driver needed';
  END IF;

  IF v_donation.status != 'accepted' THEN
    RAISE EXCEPTION 'Job is no longer available (status: %)', v_donation.status;
  END IF;

  IF v_donation.driver_id IS NOT NULL THEN
    RAISE EXCEPTION 'A driver has already been assigned';
  END IF;

  UPDATE donations
  SET status = 'driver_assigned', driver_id = auth.uid()
  WHERE id = p_donation_id;

  INSERT INTO donation_events (donation_id, status, actor_id)
  VALUES (p_donation_id, 'driver_assigned', auth.uid());

  INSERT INTO notifications (user_id, donation_id, type, title, message)
  VALUES (
    v_donation.donor_id, p_donation_id, 'driver_assigned',
    'Driver Assigned',
    'A driver has been assigned to pick up your ' || v_donation.item_name || '.'
  );

  IF v_donation.charity_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, donation_id, type, title, message)
    VALUES (
      v_donation.charity_id, p_donation_id, 'driver_assigned',
      'Driver Assigned',
      'A driver is on the way to pick up ' || v_donation.item_name || '.'
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================
-- F. Revoke anon access on new RPC
-- ============================================================
REVOKE EXECUTE ON FUNCTION mark_charity_collected FROM anon;
