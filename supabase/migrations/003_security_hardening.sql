-- ============================================================
-- Migration 003: Security Hardening
-- Adds triggers, hardened RLS policies, and atomic RPCs
-- ============================================================

-- ============================================================
-- A. Profile protection trigger
-- ============================================================
CREATE OR REPLACE FUNCTION fn_prevent_role_and_email_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'Cannot change role after profile creation';
  END IF;
  IF NEW.email IS DISTINCT FROM OLD.email THEN
    RAISE EXCEPTION 'Cannot change email after profile creation';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_role_and_email_change
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION fn_prevent_role_and_email_change();

-- Drop redundant SELECT policy (subsumed by the USING(true) policy)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

-- ============================================================
-- A2. Enforce new donations must have status = 'posted'
-- ============================================================
CREATE OR REPLACE FUNCTION fn_enforce_initial_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status != 'posted' THEN
    RAISE EXCEPTION 'New donations must have status = posted';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_enforce_initial_status
  BEFORE INSERT ON donations
  FOR EACH ROW
  EXECUTE FUNCTION fn_enforce_initial_status();

-- ============================================================
-- B. Donation status transition trigger
-- ============================================================
CREATE OR REPLACE FUNCTION fn_enforce_status_transition()
RETURNS TRIGGER AS $$
BEGIN
  -- No status change, allow through
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  -- Terminal states: no transitions out
  IF OLD.status IN ('delivered', 'cancelled') THEN
    RAISE EXCEPTION 'Cannot transition from terminal status: %', OLD.status;
  END IF;

  -- Valid transitions
  CASE OLD.status
    WHEN 'posted' THEN
      IF NEW.status NOT IN ('accepted', 'cancelled') THEN
        RAISE EXCEPTION 'Invalid transition from posted to %', NEW.status;
      END IF;
    WHEN 'accepted' THEN
      IF NEW.status NOT IN ('driver_assigned', 'cancelled') THEN
        RAISE EXCEPTION 'Invalid transition from accepted to %', NEW.status;
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

CREATE TRIGGER trg_enforce_status_transition
  BEFORE UPDATE ON donations
  FOR EACH ROW
  EXECUTE FUNCTION fn_enforce_status_transition();

-- ============================================================
-- C. Donation field restriction trigger
-- ============================================================
CREATE OR REPLACE FUNCTION fn_enforce_field_restrictions()
RETURNS TRIGGER AS $$
DECLARE
  v_role user_role;
BEGIN
  SELECT role INTO v_role FROM profiles WHERE id = auth.uid();

  IF v_role IS NULL THEN
    RAISE EXCEPTION 'Could not determine user role';
  END IF;

  CASE v_role
    WHEN 'donor' THEN
      -- Donors cannot change charity_id or driver_id
      IF NEW.charity_id IS DISTINCT FROM OLD.charity_id THEN
        RAISE EXCEPTION 'Donors cannot change charity_id';
      END IF;
      IF NEW.driver_id IS DISTINCT FROM OLD.driver_id THEN
        RAISE EXCEPTION 'Donors cannot change driver_id';
      END IF;
      -- Can only edit content fields when status = 'posted'
      IF OLD.status != 'posted' THEN
        IF NEW.item_name IS DISTINCT FROM OLD.item_name
          OR NEW.category IS DISTINCT FROM OLD.category
          OR NEW.quantity IS DISTINCT FROM OLD.quantity
          OR NEW.unit IS DISTINCT FROM OLD.unit
          OR NEW.storage IS DISTINCT FROM OLD.storage
          OR NEW.allergens IS DISTINCT FROM OLD.allergens
          OR NEW.packaging IS DISTINCT FROM OLD.packaging
          OR NEW.ready_by IS DISTINCT FROM OLD.ready_by
          OR NEW.use_by IS DISTINCT FROM OLD.use_by
          OR NEW.pickup_window_start IS DISTINCT FROM OLD.pickup_window_start
          OR NEW.pickup_window_end IS DISTINCT FROM OLD.pickup_window_end
          OR NEW.pickup_location IS DISTINCT FROM OLD.pickup_location
          OR NEW.additional_notes IS DISTINCT FROM OLD.additional_notes
        THEN
          RAISE EXCEPTION 'Donors can only edit content fields when status is posted';
        END IF;
      END IF;

    WHEN 'charity' THEN
      -- Can only change status and charity_id
      IF NEW.item_name IS DISTINCT FROM OLD.item_name
        OR NEW.category IS DISTINCT FROM OLD.category
        OR NEW.quantity IS DISTINCT FROM OLD.quantity
        OR NEW.unit IS DISTINCT FROM OLD.unit
        OR NEW.storage IS DISTINCT FROM OLD.storage
        OR NEW.allergens IS DISTINCT FROM OLD.allergens
        OR NEW.packaging IS DISTINCT FROM OLD.packaging
        OR NEW.ready_by IS DISTINCT FROM OLD.ready_by
        OR NEW.use_by IS DISTINCT FROM OLD.use_by
        OR NEW.pickup_window_start IS DISTINCT FROM OLD.pickup_window_start
        OR NEW.pickup_window_end IS DISTINCT FROM OLD.pickup_window_end
        OR NEW.pickup_location IS DISTINCT FROM OLD.pickup_location
        OR NEW.additional_notes IS DISTINCT FROM OLD.additional_notes
        OR NEW.donor_id IS DISTINCT FROM OLD.donor_id
        OR NEW.driver_id IS DISTINCT FROM OLD.driver_id
      THEN
        RAISE EXCEPTION 'Charities can only change status and charity_id';
      END IF;
      -- charity_id must be set to own uid
      IF NEW.charity_id IS DISTINCT FROM OLD.charity_id AND NEW.charity_id != auth.uid() THEN
        RAISE EXCEPTION 'Charities must set charity_id to their own ID';
      END IF;

    WHEN 'driver' THEN
      -- Can only change status and driver_id
      IF NEW.item_name IS DISTINCT FROM OLD.item_name
        OR NEW.category IS DISTINCT FROM OLD.category
        OR NEW.quantity IS DISTINCT FROM OLD.quantity
        OR NEW.unit IS DISTINCT FROM OLD.unit
        OR NEW.storage IS DISTINCT FROM OLD.storage
        OR NEW.allergens IS DISTINCT FROM OLD.allergens
        OR NEW.packaging IS DISTINCT FROM OLD.packaging
        OR NEW.ready_by IS DISTINCT FROM OLD.ready_by
        OR NEW.use_by IS DISTINCT FROM OLD.use_by
        OR NEW.pickup_window_start IS DISTINCT FROM OLD.pickup_window_start
        OR NEW.pickup_window_end IS DISTINCT FROM OLD.pickup_window_end
        OR NEW.pickup_location IS DISTINCT FROM OLD.pickup_location
        OR NEW.additional_notes IS DISTINCT FROM OLD.additional_notes
        OR NEW.donor_id IS DISTINCT FROM OLD.donor_id
        OR NEW.charity_id IS DISTINCT FROM OLD.charity_id
      THEN
        RAISE EXCEPTION 'Drivers can only change status and driver_id';
      END IF;
      -- driver_id must be set to own uid
      IF NEW.driver_id IS DISTINCT FROM OLD.driver_id AND NEW.driver_id != auth.uid() THEN
        RAISE EXCEPTION 'Drivers must set driver_id to their own ID';
      END IF;
  END CASE;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_enforce_field_restrictions
  BEFORE UPDATE ON donations
  FOR EACH ROW
  EXECUTE FUNCTION fn_enforce_field_restrictions();

-- ============================================================
-- D. Hardened RLS policies on donations (UPDATE)
-- ============================================================
DROP POLICY IF EXISTS "Donors can update own donations" ON donations;
DROP POLICY IF EXISTS "Charities can accept donations" ON donations;
DROP POLICY IF EXISTS "Drivers can update donations" ON donations;

-- Donor: can only update their own donations
CREATE POLICY "Donors can update own donations"
  ON donations FOR UPDATE
  USING (auth.uid() = donor_id)
  WITH CHECK (auth.uid() = donor_id);

-- Charity: can update posted donations (to accept) or ones they've accepted
CREATE POLICY "Charities can update donations"
  ON donations FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'charity')
    AND (status = 'posted' OR charity_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'charity')
  );

-- Driver: can update accepted unassigned donations or ones assigned to them
CREATE POLICY "Drivers can update donations"
  ON donations FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'driver')
    AND ((status = 'accepted' AND driver_id IS NULL) OR driver_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'driver')
  );

-- ============================================================
-- E. Hardened donation_events INSERT policy
-- ============================================================
DROP POLICY IF EXISTS "Users can create events" ON donation_events;

CREATE POLICY "Users can create events for involved donations"
  ON donation_events FOR INSERT
  WITH CHECK (
    auth.uid() = actor_id
    AND EXISTS (
      SELECT 1 FROM donations d
      WHERE d.id = donation_id
      AND (d.donor_id = auth.uid() OR d.charity_id = auth.uid() OR d.driver_id = auth.uid())
    )
  );

-- ============================================================
-- F. Hardened notifications INSERT policy
-- ============================================================
DROP POLICY IF EXISTS "Authenticated users can create notifications" ON notifications;

CREATE POLICY "Users can create notifications for involved donations"
  ON notifications FOR INSERT
  WITH CHECK (
    donation_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM donations d
      WHERE d.id = donation_id
      AND (d.donor_id = auth.uid() OR d.charity_id = auth.uid() OR d.driver_id = auth.uid())
    )
    AND EXISTS (
      SELECT 1 FROM donations d
      WHERE d.id = donation_id
      AND (d.donor_id = user_id OR d.charity_id = user_id OR d.driver_id = user_id)
    )
  );

-- ============================================================
-- G. Stored procedures (RPCs) — SECURITY DEFINER
-- ============================================================

-- 1. create_donation
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
  p_additional_notes TEXT DEFAULT NULL
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
    additional_notes, status
  ) VALUES (
    auth.uid(), p_item_name, p_category, p_quantity, p_unit, p_storage,
    p_allergens, p_packaging, p_ready_by, p_use_by,
    p_pickup_window_start, p_pickup_window_end, p_pickup_location,
    p_additional_notes, 'posted'
  ) RETURNING id INTO v_donation_id;

  INSERT INTO donation_events (donation_id, status, actor_id)
  VALUES (v_donation_id, 'posted', auth.uid());

  RETURN v_donation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. accept_donation
CREATE OR REPLACE FUNCTION accept_donation(p_donation_id UUID)
RETURNS VOID AS $$
DECLARE
  v_role user_role;
  v_donation donations%ROWTYPE;
BEGIN
  SELECT role INTO v_role FROM profiles WHERE id = auth.uid();
  IF v_role IS DISTINCT FROM 'charity' THEN
    RAISE EXCEPTION 'Only charities can accept donations';
  END IF;

  SELECT * INTO v_donation FROM donations WHERE id = p_donation_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Donation not found';
  END IF;

  IF v_donation.status != 'posted' THEN
    RAISE EXCEPTION 'Donation is no longer available (status: %)', v_donation.status;
  END IF;

  UPDATE donations
  SET status = 'accepted', charity_id = auth.uid()
  WHERE id = p_donation_id;

  INSERT INTO donation_events (donation_id, status, actor_id)
  VALUES (p_donation_id, 'accepted', auth.uid());

  INSERT INTO notifications (user_id, donation_id, type, title, message)
  VALUES (
    v_donation.donor_id, p_donation_id, 'order_accepted',
    'Donation Accepted!',
    'Your donation of ' || v_donation.item_name || ' has been accepted by a charity.'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. assign_driver
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

  -- Notify donor
  INSERT INTO notifications (user_id, donation_id, type, title, message)
  VALUES (
    v_donation.donor_id, p_donation_id, 'driver_assigned',
    'Driver Assigned',
    'A driver has been assigned to pick up your ' || v_donation.item_name || '.'
  );

  -- Notify charity
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

-- 4. mark_picked_up
CREATE OR REPLACE FUNCTION mark_picked_up(p_donation_id UUID)
RETURNS VOID AS $$
DECLARE
  v_role user_role;
  v_donation donations%ROWTYPE;
BEGIN
  SELECT role INTO v_role FROM profiles WHERE id = auth.uid();
  IF v_role IS DISTINCT FROM 'driver' THEN
    RAISE EXCEPTION 'Only drivers can mark pickups';
  END IF;

  SELECT * INTO v_donation FROM donations WHERE id = p_donation_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Donation not found';
  END IF;

  IF v_donation.driver_id != auth.uid() THEN
    RAISE EXCEPTION 'You are not the assigned driver';
  END IF;

  IF v_donation.status != 'driver_assigned' THEN
    RAISE EXCEPTION 'Cannot mark as picked up from status: %', v_donation.status;
  END IF;

  UPDATE donations SET status = 'picked_up' WHERE id = p_donation_id;

  INSERT INTO donation_events (donation_id, status, actor_id)
  VALUES (p_donation_id, 'picked_up', auth.uid());

  -- Notify donor
  INSERT INTO notifications (user_id, donation_id, type, title, message)
  VALUES (
    v_donation.donor_id, p_donation_id, 'driver_en_route',
    'Food Picked Up',
    'Your ' || v_donation.item_name || ' has been picked up and is on the way to the charity.'
  );

  -- Notify charity
  IF v_donation.charity_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, donation_id, type, title, message)
    VALUES (
      v_donation.charity_id, p_donation_id, 'driver_en_route',
      'Driver En Route',
      'The driver has picked up ' || v_donation.item_name || ' and is heading your way.'
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 5. mark_delivered
CREATE OR REPLACE FUNCTION mark_delivered(p_donation_id UUID)
RETURNS VOID AS $$
DECLARE
  v_role user_role;
  v_donation donations%ROWTYPE;
BEGIN
  SELECT role INTO v_role FROM profiles WHERE id = auth.uid();
  IF v_role IS DISTINCT FROM 'driver' THEN
    RAISE EXCEPTION 'Only drivers can mark deliveries';
  END IF;

  SELECT * INTO v_donation FROM donations WHERE id = p_donation_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Donation not found';
  END IF;

  IF v_donation.driver_id != auth.uid() THEN
    RAISE EXCEPTION 'You are not the assigned driver';
  END IF;

  IF v_donation.status != 'picked_up' THEN
    RAISE EXCEPTION 'Cannot mark as delivered from status: %', v_donation.status;
  END IF;

  UPDATE donations SET status = 'delivered' WHERE id = p_donation_id;

  INSERT INTO donation_events (donation_id, status, actor_id)
  VALUES (p_donation_id, 'delivered', auth.uid());

  -- Notify donor
  INSERT INTO notifications (user_id, donation_id, type, title, message)
  VALUES (
    v_donation.donor_id, p_donation_id, 'delivery_complete',
    'Delivery Complete!',
    'Your ' || v_donation.item_name || ' has been successfully delivered to the charity.'
  );

  -- Notify charity
  IF v_donation.charity_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, donation_id, type, title, message)
    VALUES (
      v_donation.charity_id, p_donation_id, 'delivery_complete',
      'Delivery Complete!',
      v_donation.item_name || ' has been delivered successfully.'
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 6. cancel_donation
CREATE OR REPLACE FUNCTION cancel_donation(p_donation_id UUID)
RETURNS VOID AS $$
DECLARE
  v_role user_role;
  v_donation donations%ROWTYPE;
BEGIN
  SELECT role INTO v_role FROM profiles WHERE id = auth.uid();
  IF v_role IS DISTINCT FROM 'donor' THEN
    RAISE EXCEPTION 'Only donors can cancel donations';
  END IF;

  SELECT * INTO v_donation FROM donations WHERE id = p_donation_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Donation not found';
  END IF;

  IF v_donation.donor_id != auth.uid() THEN
    RAISE EXCEPTION 'You can only cancel your own donations';
  END IF;

  IF v_donation.status IN ('delivered', 'cancelled') THEN
    RAISE EXCEPTION 'Cannot cancel a donation that is already %', v_donation.status;
  END IF;

  UPDATE donations SET status = 'cancelled' WHERE id = p_donation_id;

  INSERT INTO donation_events (donation_id, status, actor_id)
  VALUES (p_donation_id, 'cancelled', auth.uid());

  -- Notify charity if assigned
  IF v_donation.charity_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, donation_id, type, title, message)
    VALUES (
      v_donation.charity_id, p_donation_id, 'order_accepted',
      'Donation Cancelled',
      'The donation "' || v_donation.item_name || '" has been cancelled by the donor.'
    );
  END IF;

  -- Notify driver if assigned
  IF v_donation.driver_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, donation_id, type, title, message)
    VALUES (
      v_donation.driver_id, p_donation_id, 'new_job',
      'Job Cancelled',
      'The delivery job for "' || v_donation.item_name || '" has been cancelled.'
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================
-- H. Explicit DELETE deny policies
-- ============================================================
CREATE POLICY "No deletes on donations" ON donations FOR DELETE USING (false);
CREATE POLICY "No deletes on donation_events" ON donation_events FOR DELETE USING (false);
CREATE POLICY "No deletes on notifications" ON notifications FOR DELETE USING (false);
CREATE POLICY "No deletes on profiles" ON profiles FOR DELETE USING (false);

-- ============================================================
-- I. Revoke RPC access from anon role
-- ============================================================
REVOKE EXECUTE ON FUNCTION create_donation FROM anon;
REVOKE EXECUTE ON FUNCTION accept_donation FROM anon;
REVOKE EXECUTE ON FUNCTION assign_driver FROM anon;
REVOKE EXECUTE ON FUNCTION mark_picked_up FROM anon;
REVOKE EXECUTE ON FUNCTION mark_delivered FROM anon;
REVOKE EXECUTE ON FUNCTION cancel_donation FROM anon;
