-- ============================================================
-- Migration 004: Gamification System
-- Adds points, badges, leaderboard, and CO2e impact tracking
-- ============================================================

-- ============================================================
-- A. New columns on profiles for denormalized stats
-- ============================================================
ALTER TABLE profiles ADD COLUMN total_points INTEGER NOT NULL DEFAULT 0;
ALTER TABLE profiles ADD COLUMN total_kg_impact NUMERIC NOT NULL DEFAULT 0;

-- Leaderboard performance index
CREATE INDEX idx_profiles_role_points ON profiles(role, total_points DESC);

-- ============================================================
-- B. User badges table
-- ============================================================
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Badges are publicly viewable (leaderboard + profiles)
CREATE POLICY "Anyone can view badges" ON user_badges FOR SELECT USING (true);
-- Only SECURITY DEFINER RPCs can insert badges
CREATE POLICY "No direct badge inserts" ON user_badges FOR INSERT WITH CHECK (false);
CREATE POLICY "No badge updates" ON user_badges FOR UPDATE USING (false);
CREATE POLICY "No badge deletes" ON user_badges FOR DELETE USING (false);

-- ============================================================
-- C. Helper: Convert quantity+unit to kg
-- ============================================================
CREATE OR REPLACE FUNCTION fn_to_kg(
  p_quantity NUMERIC,
  p_unit donation_unit
) RETURNS NUMERIC AS $$
BEGIN
  CASE p_unit
    WHEN 'kg' THEN RETURN p_quantity;
    WHEN 'portions' THEN RETURN p_quantity * 0.4;
    WHEN 'pieces' THEN RETURN p_quantity * 0.3;
    WHEN 'cans' THEN RETURN p_quantity * 0.4;
  END CASE;
  RETURN p_quantity; -- fallback
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================
-- D. Helper: Calculate points from quantity+unit
-- ============================================================
CREATE OR REPLACE FUNCTION fn_calculate_points(
  p_quantity NUMERIC,
  p_unit donation_unit
) RETURNS INTEGER AS $$
DECLARE
  v_kg NUMERIC;
BEGIN
  v_kg := fn_to_kg(p_quantity, p_unit);
  -- 10 points per kg equivalent, minimum 5 points
  RETURN GREATEST(5, ROUND(v_kg * 10)::INTEGER);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================
-- E. Helper: Check and award badges
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
BEGIN
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
-- F. Extended mark_delivered RPC with gamification
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
  -- GAMIFICATION: Points + Badges
  -- ============================================================
  -- Set privileged flag so profile trigger allows points/kg updates
  PERFORM set_config('brightmeal.privileged', 'true', true);

  -- Calculate points and kg for this donation
  v_points := fn_calculate_points(v_donation.quantity, v_donation.unit);
  v_kg := fn_to_kg(v_donation.quantity, v_donation.unit);

  -- Award points and kg to donor
  UPDATE profiles
  SET total_points = total_points + v_points, total_kg_impact = total_kg_impact + v_kg
  WHERE id = v_donation.donor_id
  RETURNING total_points, total_kg_impact INTO v_new_donor_points, v_new_donor_kg;

  -- Award points and kg to charity
  IF v_donation.charity_id IS NOT NULL THEN
    UPDATE profiles
    SET total_points = total_points + v_points, total_kg_impact = total_kg_impact + v_kg
    WHERE id = v_donation.charity_id
    RETURNING total_points, total_kg_impact INTO v_new_charity_points, v_new_charity_kg;
  END IF;

  -- Award points and kg to driver
  UPDATE profiles
  SET total_points = total_points + v_points, total_kg_impact = total_kg_impact + v_kg
  WHERE id = auth.uid()
  RETURNING total_points, total_kg_impact INTO v_new_driver_points, v_new_driver_kg;

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
-- G. Protect total_points and total_kg_impact from direct changes
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
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- H. Backfill existing delivered donations
-- ============================================================
DO $$
BEGIN
  -- Set privileged flag for backfill
  PERFORM set_config('brightmeal.privileged', 'true', true);

  -- Backfill donor points/kg
  UPDATE profiles p SET
    total_points = p.total_points + agg.pts,
    total_kg_impact = p.total_kg_impact + agg.kg
  FROM (
    SELECT donor_id AS uid, SUM(fn_calculate_points(quantity, unit)) AS pts, SUM(fn_to_kg(quantity, unit)) AS kg
    FROM donations WHERE status = 'delivered' GROUP BY donor_id
  ) agg
  WHERE p.id = agg.uid;

  -- Backfill charity points/kg
  UPDATE profiles p SET
    total_points = p.total_points + agg.pts,
    total_kg_impact = p.total_kg_impact + agg.kg
  FROM (
    SELECT charity_id AS uid, SUM(fn_calculate_points(quantity, unit)) AS pts, SUM(fn_to_kg(quantity, unit)) AS kg
    FROM donations WHERE status = 'delivered' AND charity_id IS NOT NULL GROUP BY charity_id
  ) agg
  WHERE p.id = agg.uid;

  -- Backfill driver points/kg
  UPDATE profiles p SET
    total_points = p.total_points + agg.pts,
    total_kg_impact = p.total_kg_impact + agg.kg
  FROM (
    SELECT driver_id AS uid, SUM(fn_calculate_points(quantity, unit)) AS pts, SUM(fn_to_kg(quantity, unit)) AS kg
    FROM donations WHERE status = 'delivered' AND driver_id IS NOT NULL GROUP BY driver_id
  ) agg
  WHERE p.id = agg.uid;

  -- Backfill badges for all users with delivered donations
  DECLARE
    v_profile RECORD;
    v_delivered BIGINT;
  BEGIN
    FOR v_profile IN SELECT id, role, total_points, total_kg_impact FROM profiles LOOP
      IF v_profile.role = 'donor' THEN
        SELECT COUNT(*) INTO v_delivered FROM donations WHERE donor_id = v_profile.id AND status = 'delivered';
      ELSIF v_profile.role = 'charity' THEN
        SELECT COUNT(*) INTO v_delivered FROM donations WHERE charity_id = v_profile.id AND status = 'delivered';
      ELSE
        SELECT COUNT(*) INTO v_delivered FROM donations WHERE driver_id = v_profile.id AND status = 'delivered';
      END IF;

      IF v_delivered > 0 THEN
        PERFORM fn_check_and_award_badges(
          v_profile.id, v_profile.role,
          v_profile.total_points, v_delivered, v_profile.total_kg_impact
        );
      END IF;
    END LOOP;
  END;
END;
$$;

-- ============================================================
-- I. Revoke anon access on new functions
-- ============================================================
REVOKE EXECUTE ON FUNCTION fn_to_kg FROM anon;
REVOKE EXECUTE ON FUNCTION fn_calculate_points FROM anon;
REVOKE EXECUTE ON FUNCTION fn_check_and_award_badges FROM anon;
