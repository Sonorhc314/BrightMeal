-- ============================================================
-- BrightMeal Demo Seed Data
-- CW2 Dragons' Den Presentation (28 April 2026)
-- ============================================================
-- HOW TO RUN:
-- 1. Open Supabase Dashboard > SQL Editor
-- 2. Paste this entire file
-- 3. Click "Run"
-- 4. Log in at brightmeal.vercel.app with any demo account below
--
-- All 10 accounts use password: demo1234
--
-- DONORS:
--   bathbuns@demo.com      — Bath Buns Bakery (5 Cheap Street)
--   greenrocket@demo.com   — The Green Rocket Cafe (1 Pierrepont Street)
--   noyaskitchen@demo.com  — Noya's Kitchen (1 Barton Street)
--   thirdspace@demo.com    — Third Space Cafe (7 Edgar Buildings)
--
-- CHARITIES:
--   julianhouse@demo.com   — Julian House (Manvers Street)
--   genesistrust@demo.com  — Genesis Trust (5 James Street West)
--   oasispantry@demo.com   — Oasis Pantry (City Centre)
--
-- DRIVERS:
--   james@demo.com         — James Wilson (car)
--   sarah@demo.com         — Sarah Ahmed (car)
--   mike@demo.com          — Mike Chen (bicycle)
-- ============================================================

BEGIN;

-- ============================================================
-- PHASE 1: Cleanup existing demo data
-- ============================================================
DELETE FROM notifications WHERE user_id IN (
  SELECT id FROM auth.users WHERE email IN (
    'bathbuns@demo.com','greenrocket@demo.com','noyaskitchen@demo.com','thirdspace@demo.com',
    'julianhouse@demo.com','genesistrust@demo.com','oasispantry@demo.com',
    'james@demo.com','sarah@demo.com','mike@demo.com'
  )
);

DELETE FROM user_badges WHERE user_id IN (
  SELECT id FROM auth.users WHERE email IN (
    'bathbuns@demo.com','greenrocket@demo.com','noyaskitchen@demo.com','thirdspace@demo.com',
    'julianhouse@demo.com','genesistrust@demo.com','oasispantry@demo.com',
    'james@demo.com','sarah@demo.com','mike@demo.com'
  )
);

DELETE FROM donation_events WHERE donation_id IN (
  SELECT id FROM donations WHERE donor_id IN (
    SELECT id FROM auth.users WHERE email IN (
      'bathbuns@demo.com','greenrocket@demo.com','noyaskitchen@demo.com','thirdspace@demo.com'
    )
  )
);

DELETE FROM donations WHERE donor_id IN (
  SELECT id FROM auth.users WHERE email IN (
    'bathbuns@demo.com','greenrocket@demo.com','noyaskitchen@demo.com','thirdspace@demo.com'
  )
);

DELETE FROM profiles WHERE id IN (
  SELECT id FROM auth.users WHERE email IN (
    'bathbuns@demo.com','greenrocket@demo.com','noyaskitchen@demo.com','thirdspace@demo.com',
    'julianhouse@demo.com','genesistrust@demo.com','oasispantry@demo.com',
    'james@demo.com','sarah@demo.com','mike@demo.com'
  )
);

DELETE FROM auth.identities WHERE user_id IN (
  SELECT id FROM auth.users WHERE email IN (
    'bathbuns@demo.com','greenrocket@demo.com','noyaskitchen@demo.com','thirdspace@demo.com',
    'julianhouse@demo.com','genesistrust@demo.com','oasispantry@demo.com',
    'james@demo.com','sarah@demo.com','mike@demo.com'
  )
);

DELETE FROM auth.users WHERE email IN (
  'bathbuns@demo.com','greenrocket@demo.com','noyaskitchen@demo.com','thirdspace@demo.com',
  'julianhouse@demo.com','genesistrust@demo.com','oasispantry@demo.com',
  'james@demo.com','sarah@demo.com','mike@demo.com'
);

-- ============================================================
-- PHASE 2: Create auth users (deterministic UUIDs for easy reference)
-- ============================================================
-- Using fixed UUIDs so we can reference them throughout the script

INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change)
VALUES
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated', 'bathbuns@demo.com', crypt('demo1234', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Bath Buns Bakery"}', NOW() - INTERVAL '30 days', NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated', 'greenrocket@demo.com', crypt('demo1234', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"The Green Rocket Cafe"}', NOW() - INTERVAL '28 days', NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333', 'authenticated', 'authenticated', 'noyaskitchen@demo.com', crypt('demo1234', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Noya''s Kitchen"}', NOW() - INTERVAL '25 days', NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '44444444-4444-4444-4444-444444444444', 'authenticated', 'authenticated', 'thirdspace@demo.com', crypt('demo1234', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Third Space Cafe"}', NOW() - INTERVAL '20 days', NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '55555555-5555-5555-5555-555555555555', 'authenticated', 'authenticated', 'julianhouse@demo.com', crypt('demo1234', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Julian House"}', NOW() - INTERVAL '30 days', NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '66666666-6666-6666-6666-666666666666', 'authenticated', 'authenticated', 'genesistrust@demo.com', crypt('demo1234', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Genesis Trust"}', NOW() - INTERVAL '28 days', NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '77777777-7777-7777-7777-777777777777', 'authenticated', 'authenticated', 'oasispantry@demo.com', crypt('demo1234', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Oasis Pantry"}', NOW() - INTERVAL '22 days', NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '88888888-8888-8888-8888-888888888888', 'authenticated', 'authenticated', 'james@demo.com', crypt('demo1234', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"James Wilson"}', NOW() - INTERVAL '30 days', NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '99999999-9999-9999-9999-999999999999', 'authenticated', 'authenticated', 'sarah@demo.com', crypt('demo1234', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Sarah Ahmed"}', NOW() - INTERVAL '26 days', NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'authenticated', 'authenticated', 'mike@demo.com', crypt('demo1234', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Mike Chen"}', NOW() - INTERVAL '18 days', NOW(), '', '', '', '');

-- Auth identities (required for email/password login)
INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'bathbuns@demo.com', '{"sub":"11111111-1111-1111-1111-111111111111","email":"bathbuns@demo.com"}', 'email', NOW(), NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'greenrocket@demo.com', '{"sub":"22222222-2222-2222-2222-222222222222","email":"greenrocket@demo.com"}', 'email', NOW(), NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'noyaskitchen@demo.com', '{"sub":"33333333-3333-3333-3333-333333333333","email":"noyaskitchen@demo.com"}', 'email', NOW(), NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'thirdspace@demo.com', '{"sub":"44444444-4444-4444-4444-444444444444","email":"thirdspace@demo.com"}', 'email', NOW(), NOW(), NOW()),
  ('55555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'julianhouse@demo.com', '{"sub":"55555555-5555-5555-5555-555555555555","email":"julianhouse@demo.com"}', 'email', NOW(), NOW(), NOW()),
  ('66666666-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', 'genesistrust@demo.com', '{"sub":"66666666-6666-6666-6666-666666666666","email":"genesistrust@demo.com"}', 'email', NOW(), NOW(), NOW()),
  ('77777777-7777-7777-7777-777777777777', '77777777-7777-7777-7777-777777777777', 'oasispantry@demo.com', '{"sub":"77777777-7777-7777-7777-777777777777","email":"oasispantry@demo.com"}', 'email', NOW(), NOW(), NOW()),
  ('88888888-8888-8888-8888-888888888888', '88888888-8888-8888-8888-888888888888', 'james@demo.com', '{"sub":"88888888-8888-8888-8888-888888888888","email":"james@demo.com"}', 'email', NOW(), NOW(), NOW()),
  ('99999999-9999-9999-9999-999999999999', '99999999-9999-9999-9999-999999999999', 'sarah@demo.com', '{"sub":"99999999-9999-9999-9999-999999999999","email":"sarah@demo.com"}', 'email', NOW(), NOW(), NOW()),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'mike@demo.com', '{"sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","email":"mike@demo.com"}', 'email', NOW(), NOW(), NOW());

-- ============================================================
-- PHASE 3: Create profiles
-- ============================================================
INSERT INTO profiles (id, role, name, email, phone, location, business_type, vehicle_type, license_plate, food_hygiene_rating, created_at)
VALUES
  -- Donors (with food hygiene ratings)
  ('11111111-1111-1111-1111-111111111111', 'donor', 'Bath Buns Bakery', 'bathbuns@demo.com', '01225 460000', '5 Cheap Street, Bath, BA1 1NE', 'bakery', NULL, NULL, 5, NOW() - INTERVAL '30 days'),
  ('22222222-2222-2222-2222-222222222222', 'donor', 'The Green Rocket Cafe', 'greenrocket@demo.com', '01225 330088', '1 Pierrepont Street, Bath, BA1 1LA', 'restaurant', NULL, NULL, 5, NOW() - INTERVAL '28 days'),
  ('33333333-3333-3333-3333-333333333333', 'donor', 'Noya''s Kitchen', 'noyaskitchen@demo.com', '01225 462000', '1 Barton Street, Bath, BA1 1HQ', 'takeaway', NULL, NULL, 4, NOW() - INTERVAL '25 days'),
  ('44444444-4444-4444-4444-444444444444', 'donor', 'Third Space Cafe', 'thirdspace@demo.com', '01225 477700', '7 Edgar Buildings, Bath, BA1 2EE', 'cafe', NULL, NULL, 4, NOW() - INTERVAL '20 days'),
  -- Charities
  ('55555555-5555-5555-5555-555555555555', 'charity', 'Julian House', 'julianhouse@demo.com', '01225 354650', '1 Manvers Street, Bath, BA1 1JW', NULL, NULL, NULL, NULL, NOW() - INTERVAL '30 days'),
  ('66666666-6666-6666-6666-666666666666', 'charity', 'Genesis Trust', 'genesistrust@demo.com', '01225 463549', '5 James Street West, Bath, BA1 2BT', NULL, NULL, NULL, NULL, NOW() - INTERVAL '28 days'),
  ('77777777-7777-7777-7777-777777777777', 'charity', 'Oasis Pantry', 'oasispantry@demo.com', '01225 480000', 'City Centre, Bath', NULL, NULL, NULL, NULL, NOW() - INTERVAL '22 days'),
  -- Drivers
  ('88888888-8888-8888-8888-888888888888', 'driver', 'James Wilson', 'james@demo.com', '07700 100001', 'Bath, BA1', NULL, 'car', 'AB12 CDE', NULL, NOW() - INTERVAL '30 days'),
  ('99999999-9999-9999-9999-999999999999', 'driver', 'Sarah Ahmed', 'sarah@demo.com', '07700 100002', 'Bath, BA2', NULL, 'car', 'FG34 HIJ', NULL, NOW() - INTERVAL '26 days'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'driver', 'Mike Chen', 'mike@demo.com', '07700 100003', 'Bath, BA1', NULL, 'bicycle', NULL, NULL, NOW() - INTERVAL '18 days');

-- ============================================================
-- PHASE 4: Disable donation triggers for direct inserts
-- ============================================================
ALTER TABLE donations DISABLE TRIGGER trg_enforce_initial_status;
ALTER TABLE donations DISABLE TRIGGER trg_enforce_status_transition;
ALTER TABLE donations DISABLE TRIGGER trg_enforce_field_restrictions;

-- ============================================================
-- PHASE 5: Insert 16 donations in various states
-- ============================================================

-- 6 DELIVERED (complete — show impact on leaderboard)
INSERT INTO donations (donor_id, charity_id, driver_id, item_name, category, quantity, unit, storage, allergens, packaging, ready_by, use_by, date_type, pickup_window_start, pickup_window_end, pickup_location, additional_notes, status, created_at)
VALUES
  -- D1: Bath Buns -> Julian House via James (8 kg bakery)
  ('11111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', '88888888-8888-8888-8888-888888888888',
   'Artisan Sourdough Loaves', 'bakery', 8, 'kg', 'ambient', '{"Gluten"}', 'bagged',
   NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days', 'use_by',
   NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days' + INTERVAL '2 hours',
   '5 Cheap Street, Bath, BA1 1NE', 'Mixed sourdough and rye', 'delivered', NOW() - INTERVAL '3 days'),

  -- D2: Green Rocket -> Genesis Trust via Sarah (20 portions curry)
  ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666666', '99999999-9999-9999-9999-999999999999',
   'Seasonal Vegetable Curry', 'cooked_meals', 20, 'portions', 'chilled', '{}', 'containers',
   NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day', 'use_by',
   NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '3 hours',
   '1 Pierrepont Street, Bath, BA1 1LA', 'Vegan-friendly, keep refrigerated', 'delivered', NOW() - INTERVAL '2 days'),

  -- D3: Noya's -> Julian House via James (15 portions falafel)
  ('33333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', '88888888-8888-8888-8888-888888888888',
   'Falafel & Hummus Platter', 'cooked_meals', 15, 'portions', 'chilled', '{"Sesame"}', 'containers',
   NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days', 'use_by',
   NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days' + INTERVAL '2 hours',
   '1 Barton Street, Bath, BA1 1HQ', 'Contains tahini', 'delivered', NOW() - INTERVAL '5 days'),

  -- D4: Bath Buns -> Oasis Pantry via Mike (40 pieces croissants)
  ('11111111-1111-1111-1111-111111111111', '77777777-7777-7777-7777-777777777777', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   'Croissants & Pain au Chocolat', 'bakery', 40, 'pieces', 'ambient', '{"Gluten","Dairy","Eggs"}', 'bagged',
   NOW() - INTERVAL '1 day', NOW() - INTERVAL '12 hours', 'best_before',
   NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '1 hour',
   '5 Cheap Street, Bath, BA1 1NE', 'Best consumed same day', 'delivered', NOW() - INTERVAL '1 day'),

  -- D5: Green Rocket -> Julian House via Sarah (10 kg salad)
  ('22222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', '99999999-9999-9999-9999-999999999999',
   'Fresh Salad Boxes', 'fresh_produce', 10, 'kg', 'chilled', '{"Nuts"}', 'boxed',
   NOW() - INTERVAL '4 days', NOW() - INTERVAL '3 days', 'use_by',
   NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days' + INTERVAL '2 hours',
   '1 Pierrepont Street, Bath, BA1 1LA', 'Contains walnuts, seasonal leaves', 'delivered', NOW() - INTERVAL '4 days'),

  -- D6: Third Space -> Genesis Trust via James (25 portions sandwich)
  ('44444444-4444-4444-4444-444444444444', '66666666-6666-6666-6666-666666666666', '88888888-8888-8888-8888-888888888888',
   'Sandwich Platter', 'cooked_meals', 25, 'portions', 'chilled', '{"Gluten","Dairy"}', 'boxed',
   NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days', 'use_by',
   NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days' + INTERVAL '2 hours',
   '7 Edgar Buildings, Bath, BA1 2EE', 'Mixed fillings, labelled individually', 'delivered', NOW() - INTERVAL '6 days');

-- 1 PICKED UP (in transit — shows active delivery)
INSERT INTO donations (donor_id, charity_id, driver_id, item_name, category, quantity, unit, storage, allergens, packaging, ready_by, use_by, date_type, pickup_window_start, pickup_window_end, pickup_location, additional_notes, status, created_at)
VALUES
  ('33333333-3333-3333-3333-333333333333', '66666666-6666-6666-6666-666666666666', '88888888-8888-8888-8888-888888888888',
   'Lamb Shawarma Wraps', 'cooked_meals', 12, 'portions', 'chilled', '{"Gluten","Dairy"}', 'containers',
   NOW() - INTERVAL '2 hours', NOW() + INTERVAL '1 day', 'use_by',
   NOW() - INTERVAL '3 hours', NOW() - INTERVAL '1 hour',
   '1 Barton Street, Bath, BA1 1HQ', 'Keep refrigerated, yoghurt sauce separate', 'picked_up', NOW() - INTERVAL '4 hours');

-- 2 DRIVER ASSIGNED (shows driver workflow)
INSERT INTO donations (donor_id, charity_id, driver_id, item_name, category, quantity, unit, storage, allergens, packaging, ready_by, use_by, date_type, pickup_window_start, pickup_window_end, pickup_location, additional_notes, status, created_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   'Cinnamon Rolls', 'bakery', 24, 'pieces', 'ambient', '{"Gluten","Dairy","Eggs"}', 'boxed',
   NOW() - INTERVAL '1 hour', NOW() + INTERVAL '6 hours', 'best_before',
   NOW(), NOW() + INTERVAL '2 hours',
   '5 Cheap Street, Bath, BA1 1NE', 'Freshly baked this morning', 'driver_assigned', NOW() - INTERVAL '2 hours'),

  ('44444444-4444-4444-4444-444444444444', '77777777-7777-7777-7777-777777777777', '99999999-9999-9999-9999-999999999999',
   'Fruit & Yoghurt Pots', 'dairy', 15, 'pieces', 'chilled', '{"Dairy"}', 'containers',
   NOW(), NOW() + INTERVAL '2 days', 'best_before',
   NOW() + INTERVAL '1 hour', NOW() + INTERVAL '3 hours',
   '7 Edgar Buildings, Bath, BA1 2EE', 'Granola topping on the side', 'driver_assigned', NOW() - INTERVAL '1 hour');

-- 2 ACCEPTED (waiting for driver — shows available jobs)
INSERT INTO donations (donor_id, charity_id, driver_id, item_name, category, quantity, unit, storage, allergens, packaging, ready_by, use_by, date_type, pickup_window_start, pickup_window_end, pickup_location, additional_notes, status, created_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', NULL,
   'Cheese Scones', 'bakery', 30, 'pieces', 'ambient', '{"Gluten","Dairy"}', 'bagged',
   NOW() + INTERVAL '1 hour', NOW() + INTERVAL '2 days', 'best_before',
   NOW() + INTERVAL '2 hours', NOW() + INTERVAL '4 hours',
   '5 Cheap Street, Bath, BA1 1NE', 'Cheddar and herb, still warm', 'accepted', NOW() - INTERVAL '30 minutes'),

  ('33333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', NULL,
   'Frozen Flatbreads', 'bakery', 20, 'pieces', 'frozen', '{"Gluten"}', 'bagged',
   NOW() + INTERVAL '30 minutes', NOW() + INTERVAL '30 days', 'best_before',
   NOW() + INTERVAL '1 hour', NOW() + INTERVAL '3 hours',
   '1 Barton Street, Bath, BA1 1HQ', 'Handmade, keep frozen', 'accepted', NOW() - INTERVAL '45 minutes');

-- 5 POSTED (available for charities — shows browse flow)
INSERT INTO donations (donor_id, charity_id, driver_id, item_name, category, quantity, unit, storage, allergens, packaging, ready_by, use_by, date_type, pickup_window_start, pickup_window_end, pickup_location, additional_notes, status, created_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', NULL, NULL,
   'Victoria Sponge Slices', 'bakery', 18, 'pieces', 'ambient', '{"Gluten","Dairy","Eggs"}', 'boxed',
   NOW() + INTERVAL '2 hours', NOW() + INTERVAL '1 day', 'use_by',
   NOW() + INTERVAL '3 hours', NOW() + INTERVAL '5 hours',
   '5 Cheap Street, Bath, BA1 1NE', 'Cut and boxed, best today', 'posted', NOW() - INTERVAL '10 minutes'),

  ('22222222-2222-2222-2222-222222222222', NULL, NULL,
   'Roasted Vegetable Medley', 'fresh_produce', 8, 'kg', 'chilled', '{}', 'containers',
   NOW(), NOW() + INTERVAL '2 days', 'best_before',
   NOW() + INTERVAL '1 hour', NOW() + INTERVAL '4 hours',
   '1 Pierrepont Street, Bath, BA1 1LA', 'Peppers, courgette, aubergine — vegan', 'posted', NOW() - INTERVAL '5 minutes'),

  ('33333333-3333-3333-3333-333333333333', NULL, NULL,
   'Frozen Chicken Skewers', 'cooked_meals', 5, 'kg', 'frozen', '{}', 'boxed',
   NOW(), NOW() + INTERVAL '30 days', 'best_before',
   NOW() + INTERVAL '2 hours', NOW() + INTERVAL '5 hours',
   '1 Barton Street, Bath, BA1 1HQ', 'Pre-cooked, keep frozen, reheat thoroughly', 'posted', NOW() - INTERVAL '15 minutes'),

  ('44444444-4444-4444-4444-444444444444', NULL, NULL,
   'Milk & Oat Milk Cartons', 'dairy', 12, 'pieces', 'chilled', '{"Dairy"}', 'boxed',
   NOW() + INTERVAL '1 hour', NOW() + INTERVAL '3 days', 'best_before',
   NOW() + INTERVAL '2 hours', NOW() + INTERVAL '4 hours',
   '7 Edgar Buildings, Bath, BA1 2EE', 'Mix of dairy and oat milk, 1L cartons', 'posted', NOW() - INTERVAL '2 minutes'),

  ('22222222-2222-2222-2222-222222222222', NULL, NULL,
   'Mushroom Risotto', 'cooked_meals', 10, 'portions', 'chilled', '{"Dairy"}', 'containers',
   NOW() + INTERVAL '1 hour', NOW() + INTERVAL '1 day', 'use_by',
   NOW() + INTERVAL '2 hours', NOW() + INTERVAL '4 hours',
   '1 Pierrepont Street, Bath, BA1 1LA', 'Contains parmesan, keep chilled', 'posted', NOW() - INTERVAL '1 minute');

-- ============================================================
-- PHASE 6: Re-enable donation triggers
-- ============================================================
ALTER TABLE donations ENABLE TRIGGER trg_enforce_initial_status;
ALTER TABLE donations ENABLE TRIGGER trg_enforce_status_transition;
ALTER TABLE donations ENABLE TRIGGER trg_enforce_field_restrictions;

-- ============================================================
-- PHASE 7: Insert donation events (status history)
-- ============================================================

-- For delivered donations: full history (posted -> accepted -> driver_assigned -> picked_up -> delivered)
INSERT INTO donation_events (donation_id, status, actor_id, created_at)
SELECT d.id, 'posted', d.donor_id, d.created_at
FROM donations d WHERE d.donor_id IN ('11111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222','33333333-3333-3333-3333-333333333333','44444444-4444-4444-4444-444444444444')
AND d.status IN ('accepted','driver_assigned','picked_up','delivered');

INSERT INTO donation_events (donation_id, status, actor_id, created_at)
SELECT d.id, 'accepted', d.charity_id, d.created_at + INTERVAL '20 minutes'
FROM donations d WHERE d.donor_id IN ('11111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222','33333333-3333-3333-3333-333333333333','44444444-4444-4444-4444-444444444444')
AND d.status IN ('accepted','driver_assigned','picked_up','delivered')
AND d.charity_id IS NOT NULL;

INSERT INTO donation_events (donation_id, status, actor_id, created_at)
SELECT d.id, 'driver_assigned', d.driver_id, d.created_at + INTERVAL '40 minutes'
FROM donations d WHERE d.donor_id IN ('11111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222','33333333-3333-3333-3333-333333333333','44444444-4444-4444-4444-444444444444')
AND d.status IN ('driver_assigned','picked_up','delivered')
AND d.driver_id IS NOT NULL;

INSERT INTO donation_events (donation_id, status, actor_id, created_at)
SELECT d.id, 'picked_up', d.driver_id, d.created_at + INTERVAL '1 hour'
FROM donations d WHERE d.donor_id IN ('11111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222','33333333-3333-3333-3333-333333333333','44444444-4444-4444-4444-444444444444')
AND d.status IN ('picked_up','delivered')
AND d.driver_id IS NOT NULL;

INSERT INTO donation_events (donation_id, status, actor_id, created_at)
SELECT d.id, 'delivered', d.driver_id, d.created_at + INTERVAL '2 hours'
FROM donations d WHERE d.donor_id IN ('11111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222','33333333-3333-3333-3333-333333333333','44444444-4444-4444-4444-444444444444')
AND d.status = 'delivered'
AND d.driver_id IS NOT NULL;

-- Posted donations get a 'posted' event
INSERT INTO donation_events (donation_id, status, actor_id, created_at)
SELECT d.id, 'posted', d.donor_id, d.created_at
FROM donations d WHERE d.donor_id IN ('11111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222','33333333-3333-3333-3333-333333333333','44444444-4444-4444-4444-444444444444')
AND d.status = 'posted';

-- ============================================================
-- PHASE 8: Insert notifications
-- ============================================================

-- Donor notifications (order accepted, driver assigned, delivery complete)
INSERT INTO notifications (user_id, donation_id, type, title, message, read, created_at)
SELECT d.donor_id, d.id, 'order_accepted', 'Donation Accepted!',
  'Your ' || d.item_name || ' has been accepted by a charity.',
  true, d.created_at + INTERVAL '20 minutes'
FROM donations d
WHERE d.status IN ('accepted','driver_assigned','picked_up','delivered')
AND d.charity_id IS NOT NULL
AND d.donor_id IN ('11111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222','33333333-3333-3333-3333-333333333333','44444444-4444-4444-4444-444444444444');

INSERT INTO notifications (user_id, donation_id, type, title, message, read, created_at)
SELECT d.donor_id, d.id, 'driver_assigned', 'Driver Assigned',
  'A driver is on the way to collect your ' || d.item_name || '.',
  true, d.created_at + INTERVAL '40 minutes'
FROM donations d
WHERE d.status IN ('driver_assigned','picked_up','delivered')
AND d.driver_id IS NOT NULL
AND d.donor_id IN ('11111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222','33333333-3333-3333-3333-333333333333','44444444-4444-4444-4444-444444444444');

INSERT INTO notifications (user_id, donation_id, type, title, message, read, created_at)
SELECT d.donor_id, d.id, 'delivery_complete', 'Delivery Complete!',
  'Your ' || d.item_name || ' has been delivered. Thank you for your generosity!',
  false, d.created_at + INTERVAL '2 hours'
FROM donations d
WHERE d.status = 'delivered'
AND d.donor_id IN ('11111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222','33333333-3333-3333-3333-333333333333','44444444-4444-4444-4444-444444444444');

-- Charity notifications (new offers for posted, delivery complete)
INSERT INTO notifications (user_id, donation_id, type, title, message, read, created_at)
SELECT d.charity_id, d.id, 'delivery_complete', 'Delivery Complete!',
  d.item_name || ' has been delivered successfully.',
  false, d.created_at + INTERVAL '2 hours'
FROM donations d
WHERE d.status = 'delivered' AND d.charity_id IS NOT NULL
AND d.donor_id IN ('11111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222','33333333-3333-3333-3333-333333333333','44444444-4444-4444-4444-444444444444');

-- Driver notifications (new jobs)
INSERT INTO notifications (user_id, donation_id, type, title, message, read, created_at)
SELECT d.driver_id, d.id, 'new_job', 'New Job Available',
  'Pickup: ' || d.item_name || ' from ' || d.pickup_location,
  true, d.created_at + INTERVAL '30 minutes'
FROM donations d
WHERE d.driver_id IS NOT NULL AND d.status IN ('driver_assigned','picked_up','delivered')
AND d.donor_id IN ('11111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222','33333333-3333-3333-3333-333333333333','44444444-4444-4444-4444-444444444444');

-- ============================================================
-- PHASE 9: Set gamification stats
-- ============================================================
-- Points calculation per delivered donation (fn_to_kg * 10, min 5):
--   D1: 8 kg        -> 8 kg    -> 80 pts
--   D2: 20 portions -> 8 kg    -> 80 pts
--   D3: 15 portions -> 6 kg    -> 60 pts
--   D4: 40 pieces   -> 12 kg   -> 120 pts
--   D5: 10 kg       -> 10 kg   -> 100 pts
--   D6: 25 portions -> 10 kg   -> 100 pts
--
-- Per user totals:
--   Bath Buns (D1+D4):     20 kg, 200 pts, 2 deliveries
--   Green Rocket (D2+D5):  18 kg, 180 pts, 2 deliveries
--   Noya's (D3):            6 kg,  60 pts, 1 delivery
--   Third Space (D6):      10 kg, 100 pts, 1 delivery
--   Julian House (D1+D3+D5): 24 kg, 240 pts, 3 deliveries
--   Genesis Trust (D2+D6): 18 kg, 180 pts, 2 deliveries
--   Oasis Pantry (D4):     12 kg, 120 pts, 1 delivery
--   James (D1+D3+D6):      24 kg, 240 pts, 3 deliveries
--   Sarah (D2+D5):         18 kg, 180 pts, 2 deliveries
--   Mike (D4):             12 kg, 120 pts, 1 delivery

DO $$
DECLARE
  v_current_week TEXT;
BEGIN
  PERFORM set_config('brightmeal.privileged', 'true', true);
  v_current_week := to_char(NOW(), 'IYYY') || '-W' || to_char(NOW(), 'IW');

  -- Donors
  UPDATE profiles SET total_points = 200, total_kg_impact = 20, total_donations_completed = 2,
    current_streak = 2, best_streak = 2, last_active_week = v_current_week
  WHERE id = '11111111-1111-1111-1111-111111111111';

  UPDATE profiles SET total_points = 180, total_kg_impact = 18, total_donations_completed = 2,
    current_streak = 2, best_streak = 2, last_active_week = v_current_week
  WHERE id = '22222222-2222-2222-2222-222222222222';

  UPDATE profiles SET total_points = 60, total_kg_impact = 6, total_donations_completed = 1,
    current_streak = 1, best_streak = 1, last_active_week = v_current_week
  WHERE id = '33333333-3333-3333-3333-333333333333';

  UPDATE profiles SET total_points = 100, total_kg_impact = 10, total_donations_completed = 1,
    current_streak = 1, best_streak = 1, last_active_week = v_current_week
  WHERE id = '44444444-4444-4444-4444-444444444444';

  -- Charities
  UPDATE profiles SET total_points = 240, total_kg_impact = 24, total_donations_completed = 3,
    current_streak = 3, best_streak = 3, last_active_week = v_current_week
  WHERE id = '55555555-5555-5555-5555-555555555555';

  UPDATE profiles SET total_points = 180, total_kg_impact = 18, total_donations_completed = 2,
    current_streak = 2, best_streak = 2, last_active_week = v_current_week
  WHERE id = '66666666-6666-6666-6666-666666666666';

  UPDATE profiles SET total_points = 120, total_kg_impact = 12, total_donations_completed = 1,
    current_streak = 1, best_streak = 1, last_active_week = v_current_week
  WHERE id = '77777777-7777-7777-7777-777777777777';

  -- Drivers
  UPDATE profiles SET total_points = 240, total_kg_impact = 24, total_donations_completed = 3,
    current_streak = 3, best_streak = 3, last_active_week = v_current_week
  WHERE id = '88888888-8888-8888-8888-888888888888';

  UPDATE profiles SET total_points = 180, total_kg_impact = 18, total_donations_completed = 2,
    current_streak = 2, best_streak = 2, last_active_week = v_current_week
  WHERE id = '99999999-9999-9999-9999-999999999999';

  UPDATE profiles SET total_points = 120, total_kg_impact = 12, total_donations_completed = 1,
    current_streak = 1, best_streak = 1, last_active_week = v_current_week
  WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
END;
$$;

-- ============================================================
-- PHASE 10: Insert badges
-- ============================================================
-- Running as postgres bypasses the RLS "No direct badge inserts" policy

-- first_delivery (all 10 users)
INSERT INTO user_badges (user_id, badge_id) VALUES
  ('11111111-1111-1111-1111-111111111111', 'first_delivery'),
  ('22222222-2222-2222-2222-222222222222', 'first_delivery'),
  ('33333333-3333-3333-3333-333333333333', 'first_delivery'),
  ('44444444-4444-4444-4444-444444444444', 'first_delivery'),
  ('55555555-5555-5555-5555-555555555555', 'first_delivery'),
  ('66666666-6666-6666-6666-666666666666', 'first_delivery'),
  ('77777777-7777-7777-7777-777777777777', 'first_delivery'),
  ('88888888-8888-8888-8888-888888888888', 'first_delivery'),
  ('99999999-9999-9999-9999-999999999999', 'first_delivery'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'first_delivery');

-- points_50 (all 10 users have >= 50 pts)
INSERT INTO user_badges (user_id, badge_id) VALUES
  ('11111111-1111-1111-1111-111111111111', 'points_50'),
  ('22222222-2222-2222-2222-222222222222', 'points_50'),
  ('33333333-3333-3333-3333-333333333333', 'points_50'),
  ('44444444-4444-4444-4444-444444444444', 'points_50'),
  ('55555555-5555-5555-5555-555555555555', 'points_50'),
  ('66666666-6666-6666-6666-666666666666', 'points_50'),
  ('77777777-7777-7777-7777-777777777777', 'points_50'),
  ('88888888-8888-8888-8888-888888888888', 'points_50'),
  ('99999999-9999-9999-9999-999999999999', 'points_50'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'points_50');

-- points_100 (all except Noya's Kitchen at 60 pts)
INSERT INTO user_badges (user_id, badge_id) VALUES
  ('11111111-1111-1111-1111-111111111111', 'points_100'),
  ('22222222-2222-2222-2222-222222222222', 'points_100'),
  ('44444444-4444-4444-4444-444444444444', 'points_100'),
  ('55555555-5555-5555-5555-555555555555', 'points_100'),
  ('66666666-6666-6666-6666-666666666666', 'points_100'),
  ('77777777-7777-7777-7777-777777777777', 'points_100'),
  ('88888888-8888-8888-8888-888888888888', 'points_100'),
  ('99999999-9999-9999-9999-999999999999', 'points_100'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'points_100');

-- streak_2 (users with current_streak >= 2)
INSERT INTO user_badges (user_id, badge_id) VALUES
  ('11111111-1111-1111-1111-111111111111', 'streak_2'),
  ('22222222-2222-2222-2222-222222222222', 'streak_2'),
  ('55555555-5555-5555-5555-555555555555', 'streak_2'),
  ('66666666-6666-6666-6666-666666666666', 'streak_2'),
  ('88888888-8888-8888-8888-888888888888', 'streak_2'),
  ('99999999-9999-9999-9999-999999999999', 'streak_2');

-- streak_4 badge: Julian House and James have streak 3, not 4 — so no one qualifies

COMMIT;

-- ============================================================
-- VERIFICATION: Run these queries to check the seed worked
-- ============================================================
-- SELECT email, role, name, total_points, total_kg_impact, current_streak, food_hygiene_rating FROM profiles ORDER BY total_points DESC;
-- SELECT item_name, status, created_at FROM donations ORDER BY created_at DESC;
-- SELECT COUNT(*) AS badge_count FROM user_badges;
-- SELECT COUNT(*) AS notification_count FROM notifications;
-- SELECT COUNT(*) AS event_count FROM donation_events;
