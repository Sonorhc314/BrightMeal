-- ============================================================
-- Migration 005: Streaks & Efficiency
-- Adds streak tracking and donation count for efficiency metric
-- ============================================================

-- ============================================================
-- A. New columns on profiles for streaks and efficiency
-- ============================================================
ALTER TABLE profiles ADD COLUMN current_streak INTEGER NOT NULL DEFAULT 0;
ALTER TABLE profiles ADD COLUMN best_streak INTEGER NOT NULL DEFAULT 0;
ALTER TABLE profiles ADD COLUMN last_active_week TEXT NOT NULL DEFAULT '';
ALTER TABLE profiles ADD COLUMN total_donations_completed INTEGER NOT NULL DEFAULT 0;

-- ============================================================
-- B. Protect new columns in the existing trigger
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

  -- Protect gamification fields (only SECURITY DEFINER RPCs set the privileged flag)
  IF coalesce(current_setting('brightmeal.privileged', true), '') != 'true' THEN
    IF NEW.total_points IS DISTINCT FROM OLD.total_points THEN
      RAISE EXCEPTION 'Cannot directly modify total_points';
    END IF;
    IF NEW.total_kg_impact IS DISTINCT FROM OLD.total_kg_impact THEN
      RAISE EXCEPTION 'Cannot directly modify total_kg_impact';
    END IF;
    IF NEW.current_streak IS DISTINCT FROM OLD.current_streak THEN
      RAISE EXCEPTION 'Cannot directly modify current_streak';
    END IF;
    IF NEW.best_streak IS DISTINCT FROM OLD.best_streak THEN
      RAISE EXCEPTION 'Cannot directly modify best_streak';
    END IF;
    IF NEW.last_active_week IS DISTINCT FROM OLD.last_active_week THEN
      RAISE EXCEPTION 'Cannot directly modify last_active_week';
    END IF;
    IF NEW.total_donations_completed IS DISTINCT FROM OLD.total_donations_completed THEN
      RAISE EXCEPTION 'Cannot directly modify total_donations_completed';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- C. Streak helper function
-- ============================================================
CREATE OR REPLACE FUNCTION fn_update_streak(
  p_user_id UUID
) RETURNS VOID AS $$
DECLARE
  v_current_week TEXT;
  v_profile RECORD;
BEGIN
  -- ISO week string (e.g., '2026-W14')
  v_current_week := to_char(NOW(), 'IYYY') || '-W' || to_char(NOW(), 'IW');

  SELECT current_streak, best_streak, last_active_week
  INTO v_profile
  FROM profiles WHERE id = p_user_id;

  -- Already active this week, nothing to update
  IF v_profile.last_active_week = v_current_week THEN
    RETURN;
  END IF;

  -- Check if last activity was the previous week (consecutive)
  IF v_profile.last_active_week = (
    to_char(NOW() - INTERVAL '7 days', 'IYYY') || '-W' || to_char(NOW() - INTERVAL '7 days', 'IW')
  ) THEN
    -- Continue streak
    UPDATE profiles SET
      current_streak = current_streak + 1,
      best_streak = GREATEST(best_streak, current_streak + 1),
      last_active_week = v_current_week
    WHERE id = p_user_id;
  ELSE
    -- Reset streak to 1
    UPDATE profiles SET
      current_streak = 1,
      best_streak = GREATEST(best_streak, 1),
      last_active_week = v_current_week
    WHERE id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================
-- D. Add streak badges to badge checking function
-- ============================================================
CREATE OR REPLACE FUNCTION fn_check_and_award_badges(
  p_user_id UUID,
  p_role user_role,
  p_new_total_points INTEGER,
  p_delivered_count BIGINT,
  p_new_total_kg NUMERIC
) RETURNS VOID AS $$
DECLARE
  v_badge TEXT;
  v_badges TEXT[] := '{}';
  v_streak INTEGER;
BEGIN
  -- Get current streak
  SELECT current_streak INTO v_streak FROM profiles WHERE id = p_user_id;

  -- Delivery count milestones (all roles)
  IF p_delivered_count >= 1 THEN v_badges := array_append(v_badges, 'first_delivery'); END IF;
  IF p_delivered_count >= 10 THEN v_badges := array_append(v_badges, 'deliveries_10'); END IF;
  IF p_delivered_count >= 25 THEN v_badges := array_append(v_badges, 'deliveries_25'); END IF;
  IF p_delivered_count >= 50 THEN v_badges := array_append(v_badges, 'deliveries_50'); END IF;
  IF p_delivered_count >= 100 THEN v_badges := array_append(v_badges, 'deliveries_100'); END IF;

  -- Point milestones (all roles)
  IF p_new_total_points >= 50 THEN v_badges := array_append(v_badges, 'points_50'); END IF;
  IF p_new_total_points >= 100 THEN v_badges := array_append(v_badges, 'points_100'); END IF;
  IF p_new_total_points >= 500 THEN v_badges := array_append(v_badges, 'points_500'); END IF;
  IF p_new_total_points >= 1000 THEN v_badges := array_append(v_badges, 'points_1000'); END IF;

  -- Kg impact milestones (donor and charity)
  IF p_role IN ('donor', 'charity') THEN
    IF p_new_total_kg >= 100 THEN v_badges := array_append(v_badges, 'kg_100'); END IF;
    IF p_new_total_kg >= 500 THEN v_badges := array_append(v_badges, 'kg_500'); END IF;
    IF p_new_total_kg >= 1000 THEN v_badges := array_append(v_badges, 'kg_1000'); END IF;
  END IF;

  -- Streak milestones (all roles)
  IF v_streak >= 2 THEN v_badges := array_append(v_badges, 'streak_2'); END IF;
  IF v_streak >= 4 THEN v_badges := array_append(v_badges, 'streak_4'); END IF;
  IF v_streak >= 8 THEN v_badges := array_append(v_badges, 'streak_8'); END IF;
  IF v_streak >= 12 THEN v_badges := array_append(v_badges, 'streak_12'); END IF;

  -- Role-specific badges
  IF p_role = 'donor' AND p_delivered_count >= 5 THEN
    v_badges := array_append(v_badges, 'generous_donor');
  END IF;
  IF p_role = 'charity' AND p_delivered_count >= 5 THEN
    v_badges := array_append(v_badges, 'community_hero');
  END IF;
  IF p_role = 'driver' AND p_delivered_count >= 5 THEN
    v_badges := array_append(v_badges, 'road_warrior');
  END IF;

  -- Insert badges (ON CONFLICT DO NOTHING handles duplicates)
  FOREACH v_badge IN ARRAY v_badges LOOP
    INSERT INTO user_badges (user_id, badge_id)
    VALUES (p_user_id, v_badge)
    ON CONFLICT (user_id, badge_id) DO NOTHING;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================
-- E. Update mark_delivered to include streaks and donation count
-- ============================================================
CREATE OR REPLACE FUNCTION mark_delivered(p_donation_id UUID)
RETURNS VOID AS $$
DECLARE
  v_role user_role;
  v_donation donations%ROWTYPE;
  v_points INTEGER;
  v_kg NUMERIC;
  v_new_donor_points INTEGER;
  v_new_charity_points INTEGER;
  v_new_driver_points INTEGER;
  v_new_donor_kg NUMERIC;
  v_new_charity_kg NUMERIC;
  v_new_driver_kg NUMERIC;
  v_donor_delivered BIGINT;
  v_charity_delivered BIGINT;
  v_driver_delivered BIGINT;
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

  -- ============================================================
  -- GAMIFICATION: Points + Streaks + Badges
  -- ============================================================
  PERFORM set_config('brightmeal.privileged', 'true', true);

  -- Calculate points and kg for this donation
  v_points := fn_calculate_points(v_donation.quantity, v_donation.unit);
  v_kg := fn_to_kg(v_donation.quantity, v_donation.unit);

  -- Award points, kg, and increment donation count for donor
  UPDATE profiles
  SET total_points = total_points + v_points,
      total_kg_impact = total_kg_impact + v_kg,
      total_donations_completed = total_donations_completed + 1
  WHERE id = v_donation.donor_id
  RETURNING total_points, total_kg_impact INTO v_new_donor_points, v_new_donor_kg;

  -- Award points, kg, and increment donation count for charity
  IF v_donation.charity_id IS NOT NULL THEN
    UPDATE profiles
    SET total_points = total_points + v_points,
        total_kg_impact = total_kg_impact + v_kg,
        total_donations_completed = total_donations_completed + 1
    WHERE id = v_donation.charity_id
    RETURNING total_points, total_kg_impact INTO v_new_charity_points, v_new_charity_kg;
  END IF;

  -- Award points, kg, and increment donation count for driver
  UPDATE profiles
  SET total_points = total_points + v_points,
      total_kg_impact = total_kg_impact + v_kg,
      total_donations_completed = total_donations_completed + 1
  WHERE id = auth.uid()
  RETURNING total_points, total_kg_impact INTO v_new_driver_points, v_new_driver_kg;

  -- Update streaks for all participants
  PERFORM fn_update_streak(v_donation.donor_id);
  IF v_donation.charity_id IS NOT NULL THEN
    PERFORM fn_update_streak(v_donation.charity_id);
  END IF;
  PERFORM fn_update_streak(auth.uid());

  -- Count delivered donations for badge checks
  SELECT COUNT(*) INTO v_donor_delivered
  FROM donations WHERE donor_id = v_donation.donor_id AND status = 'delivered';

  IF v_donation.charity_id IS NOT NULL THEN
    SELECT COUNT(*) INTO v_charity_delivered
    FROM donations WHERE charity_id = v_donation.charity_id AND status = 'delivered';
  END IF;

  SELECT COUNT(*) INTO v_driver_delivered
  FROM donations WHERE driver_id = auth.uid() AND status = 'delivered';

  -- Check and award badges
  PERFORM fn_check_and_award_badges(
    v_donation.donor_id, 'donor',
    v_new_donor_points, v_donor_delivered, v_new_donor_kg
  );

  IF v_donation.charity_id IS NOT NULL THEN
    PERFORM fn_check_and_award_badges(
      v_donation.charity_id, 'charity',
      v_new_charity_points, v_charity_delivered, v_new_charity_kg
    );
  END IF;

  PERFORM fn_check_and_award_badges(
    auth.uid(), 'driver',
    v_new_driver_points, v_driver_delivered, v_new_driver_kg
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================
-- F. Backfill donation counts and streaks
-- ============================================================
DO $$
BEGIN
  PERFORM set_config('brightmeal.privileged', 'true', true);

  -- Backfill total_donations_completed for donors
  UPDATE profiles p SET total_donations_completed = agg.cnt
  FROM (
    SELECT donor_id AS uid, COUNT(*) AS cnt
    FROM donations WHERE status = 'delivered' GROUP BY donor_id
  ) agg
  WHERE p.id = agg.uid;

  -- Backfill total_donations_completed for charities
  UPDATE profiles p SET total_donations_completed = GREATEST(p.total_donations_completed, agg.cnt)
  FROM (
    SELECT charity_id AS uid, COUNT(*) AS cnt
    FROM donations WHERE status = 'delivered' AND charity_id IS NOT NULL GROUP BY charity_id
  ) agg
  WHERE p.id = agg.uid;

  -- Backfill total_donations_completed for drivers
  UPDATE profiles p SET total_donations_completed = GREATEST(p.total_donations_completed, agg.cnt)
  FROM (
    SELECT driver_id AS uid, COUNT(*) AS cnt
    FROM donations WHERE status = 'delivered' AND driver_id IS NOT NULL GROUP BY driver_id
  ) agg
  WHERE p.id = agg.uid;
END;
$$;

-- ============================================================
-- G. Revoke anon access on new function
-- ============================================================
REVOKE EXECUTE ON FUNCTION fn_update_streak FROM anon;
