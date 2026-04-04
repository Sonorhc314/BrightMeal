-- BrightMeal Demo Seed Data
-- For the CW2 Dragons' Den Presentation (28 April 2026)
--
-- SETUP INSTRUCTIONS:
-- 1. Create accounts via the signup page at the deployed URL
-- 2. Run: SELECT id, email FROM auth.users; to get UUIDs
-- 3. Replace the placeholder UUIDs below
-- 4. Run this SQL in the Supabase SQL Editor
--
-- Demo Accounts (create via signup page):
-- DONOR 1: bathbuns@demo.com / demo1234 (Bath Buns Bakery — bakery, 5 Cheap Street, Bath)
-- DONOR 2: greenrocket@demo.com / demo1234 (The Green Rocket Cafe — restaurant, 1 Pierrepont Street)
-- DONOR 3: noyaskitchen@demo.com / demo1234 (Noya's Kitchen — takeaway, 1 Barton Street)
-- DONOR 4: thirdspace@demo.com / demo1234 (Third Space Cafe — cafe, 7 Edgar Buildings)
-- CHARITY 1: julianhouse@demo.com / demo1234 (Julian House — homeless charity, Manvers Street)
-- CHARITY 2: genesistrust@demo.com / demo1234 (Genesis Trust — food bank, 5 James Street West)
-- CHARITY 3: oasispantry@demo.com / demo1234 (Oasis Pantry — community pantry, City Centre)
-- DRIVER 1: james@demo.com / demo1234 (James Wilson — car)
-- DRIVER 2: sarah@demo.com / demo1234 (Sarah Ahmed — car)
-- DRIVER 3: mike@demo.com / demo1234 (Mike Chen — bicycle)
--
-- After creating accounts via signup, update the UUIDs below with the actual
-- auth.users IDs from Supabase, then run this SQL.

-- =====================================================
-- STEP 1: Replace these placeholder UUIDs with real ones
-- =====================================================
-- Get the UUIDs from: SELECT id, email FROM auth.users;

-- Donors
-- donor1_id = <UUID for bathbuns@demo.com>       (Bath Buns Bakery)
-- donor2_id = <UUID for greenrocket@demo.com>    (The Green Rocket Cafe)
-- donor3_id = <UUID for noyaskitchen@demo.com>   (Noya's Kitchen)
-- donor4_id = <UUID for thirdspace@demo.com>     (Third Space Cafe)

-- Charities
-- charity1_id = <UUID for julianhouse@demo.com>  (Julian House)
-- charity2_id = <UUID for genesistrust@demo.com> (Genesis Trust)
-- charity3_id = <UUID for oasispantry@demo.com>  (Oasis Pantry)

-- Drivers
-- driver1_id = <UUID for james@demo.com>         (James Wilson)
-- driver2_id = <UUID for sarah@demo.com>         (Sarah Ahmed)
-- driver3_id = <UUID for mike@demo.com>          (Mike Chen)

-- =====================================================
-- STEP 2: Run the INSERT statements below
-- (Replace placeholder UUIDs with real ones first)
-- =====================================================

-- Example: To seed after signup, run something like this
-- (adjusting UUIDs to match your actual Supabase auth.users):

/*
-- DELIVERED donations (complete golden path — shows impact on leaderboard)
INSERT INTO donations (donor_id, charity_id, driver_id, item_name, category, quantity, unit, storage, allergens, packaging, ready_by, use_by, pickup_window_start, pickup_window_end, pickup_location, additional_notes, status, created_at)
VALUES
-- Delivered 1: Bath Buns -> Julian House via James
('DONOR1_UUID', 'CHARITY1_UUID', 'DRIVER1_UUID', 'Artisan Sourdough Loaves', 'bakery', 8, 'kg', 'ambient', '{"Gluten"}', 'bagged', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days' + INTERVAL '2 hours', '5 Cheap Street, Bath, BA1 1NE', 'Mixed sourdough and rye', 'delivered', NOW() - INTERVAL '3 days'),

-- Delivered 2: Green Rocket -> Genesis Trust via Sarah
('DONOR2_UUID', 'CHARITY2_UUID', 'DRIVER2_UUID', 'Seasonal Vegetable Curry', 'cooked_meals', 20, 'portions', 'chilled', '{}', 'containers', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '3 hours', '1 Pierrepont Street, Bath, BA1 1LA', 'Vegan-friendly, keep refrigerated', 'delivered', NOW() - INTERVAL '2 days'),

-- Delivered 3: Noya's Kitchen -> Julian House via James
('DONOR3_UUID', 'CHARITY1_UUID', 'DRIVER1_UUID', 'Falafel & Hummus Platter', 'cooked_meals', 15, 'portions', 'chilled', '{"Sesame"}', 'containers', NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days' + INTERVAL '2 hours', '1 Barton Street, Bath, BA1 1HQ', 'Contains tahini', 'delivered', NOW() - INTERVAL '5 days'),

-- Delivered 4: Bath Buns -> Oasis Pantry via Mike
('DONOR1_UUID', 'CHARITY3_UUID', 'DRIVER3_UUID', 'Croissants & Pain au Chocolat', 'bakery', 40, 'pieces', 'ambient', '{"Gluten", "Dairy", "Eggs"}', 'bagged', NOW() - INTERVAL '1 day', NOW() - INTERVAL '12 hours', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '1 hour', '5 Cheap Street, Bath, BA1 1NE', 'Best consumed same day', 'delivered', NOW() - INTERVAL '1 day'),

-- Delivered 5: Green Rocket -> Julian House via Sarah
('DONOR2_UUID', 'CHARITY1_UUID', 'DRIVER2_UUID', 'Fresh Salad Boxes', 'fresh_produce', 10, 'kg', 'chilled', '{"Nuts"}', 'boxed', NOW() - INTERVAL '4 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days' + INTERVAL '2 hours', '1 Pierrepont Street, Bath, BA1 1LA', 'Contains walnuts, seasonal leaves', 'delivered', NOW() - INTERVAL '4 days'),

-- Delivered 6: Third Space -> Genesis Trust via James
('DONOR4_UUID', 'CHARITY2_UUID', 'DRIVER1_UUID', 'Sandwich Platter', 'cooked_meals', 25, 'portions', 'chilled', '{"Gluten", "Dairy"}', 'boxed', NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days' + INTERVAL '2 hours', '7 Edgar Buildings, Bath, BA1 2EE', 'Mixed fillings, labelled individually', 'delivered', NOW() - INTERVAL '6 days'),

-- PICKED UP donation (in transit — shows active delivery during demo)
('DONOR3_UUID', 'CHARITY2_UUID', 'DRIVER1_UUID', 'Lamb Shawarma Wraps', 'cooked_meals', 12, 'portions', 'chilled', '{"Gluten", "Dairy"}', 'containers', NOW() - INTERVAL '2 hours', NOW() + INTERVAL '1 day', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '1 hour', '1 Barton Street, Bath, BA1 1HQ', 'Keep refrigerated, yoghurt sauce separate', 'picked_up', NOW() - INTERVAL '4 hours'),

-- DRIVER ASSIGNED donations (shows driver workflow)
('DONOR1_UUID', 'CHARITY1_UUID', 'DRIVER3_UUID', 'Cinnamon Rolls', 'bakery', 24, 'pieces', 'ambient', '{"Gluten", "Dairy", "Eggs"}', 'boxed', NOW() - INTERVAL '1 hour', NOW() + INTERVAL '6 hours', NOW(), NOW() + INTERVAL '2 hours', '5 Cheap Street, Bath, BA1 1NE', 'Freshly baked this morning', 'driver_assigned', NOW() - INTERVAL '2 hours'),

('DONOR4_UUID', 'CHARITY3_UUID', 'DRIVER2_UUID', 'Fruit & Yoghurt Pots', 'dairy', 15, 'pieces', 'chilled', '{"Dairy"}', 'containers', NOW(), NOW() + INTERVAL '2 days', NOW() + INTERVAL '1 hour', NOW() + INTERVAL '3 hours', '7 Edgar Buildings, Bath, BA1 2EE', 'Granola topping on the side', 'driver_assigned', NOW() - INTERVAL '1 hour'),

-- ACCEPTED donations (waiting for driver — shows available jobs)
('DONOR1_UUID', 'CHARITY2_UUID', NULL, 'Cheese Scones', 'bakery', 30, 'pieces', 'ambient', '{"Gluten", "Dairy"}', 'bagged', NOW() + INTERVAL '1 hour', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 hours', NOW() + INTERVAL '4 hours', '5 Cheap Street, Bath, BA1 1NE', 'Cheddar and herb, still warm', 'accepted', NOW() - INTERVAL '30 minutes'),

('DONOR3_UUID', 'CHARITY1_UUID', NULL, 'Frozen Flatbreads', 'bakery', 20, 'pieces', 'frozen', '{"Gluten"}', 'bagged', NOW() + INTERVAL '30 minutes', NOW() + INTERVAL '30 days', NOW() + INTERVAL '1 hour', NOW() + INTERVAL '3 hours', '1 Barton Street, Bath, BA1 1HQ', 'Handmade, keep frozen', 'accepted', NOW() - INTERVAL '45 minutes'),

-- POSTED donations (available for charities — shows charity browse flow)
('DONOR1_UUID', NULL, NULL, 'Victoria Sponge Slices', 'bakery', 18, 'pieces', 'ambient', '{"Gluten", "Dairy", "Eggs"}', 'boxed', NOW() + INTERVAL '2 hours', NOW() + INTERVAL '1 day', NOW() + INTERVAL '3 hours', NOW() + INTERVAL '5 hours', '5 Cheap Street, Bath, BA1 1NE', 'Cut and boxed, best today', 'posted', NOW() - INTERVAL '10 minutes'),

('DONOR2_UUID', NULL, NULL, 'Roasted Vegetable Medley', 'fresh_produce', 8, 'kg', 'chilled', '{}', 'containers', NOW(), NOW() + INTERVAL '2 days', NOW() + INTERVAL '1 hour', NOW() + INTERVAL '4 hours', '1 Pierrepont Street, Bath, BA1 1LA', 'Peppers, courgette, aubergine — vegan', 'posted', NOW() - INTERVAL '5 minutes'),

('DONOR3_UUID', NULL, NULL, 'Frozen Chicken Skewers', 'cooked_meals', 5, 'kg', 'frozen', '{}', 'boxed', NOW(), NOW() + INTERVAL '30 days', NOW() + INTERVAL '2 hours', NOW() + INTERVAL '5 hours', '1 Barton Street, Bath, BA1 1HQ', 'Pre-cooked, keep frozen, reheat thoroughly', 'posted', NOW() - INTERVAL '15 minutes'),

('DONOR4_UUID', NULL, NULL, 'Milk & Oat Milk Cartons', 'dairy', 12, 'pieces', 'chilled', '{"Dairy"}', 'boxed', NOW() + INTERVAL '1 hour', NOW() + INTERVAL '3 days', NOW() + INTERVAL '2 hours', NOW() + INTERVAL '4 hours', '7 Edgar Buildings, Bath, BA1 2EE', 'Mix of dairy and oat milk, 1L cartons', 'posted', NOW() - INTERVAL '2 minutes');

-- DONATION EVENTS (timeline history for delivered donations)
-- These would normally be created by RPCs, but for demo seed we insert directly
-- You'll need to create these after inserting donations, using the donation IDs

-- NOTIFICATIONS (sample notifications for demo)
-- For Donor 1 (Bath Buns Bakery)
INSERT INTO notifications (user_id, donation_id, type, title, message, read, created_at)
SELECT 'DONOR1_UUID', d.id, 'order_accepted', 'Donation Accepted!', 'Your ' || d.item_name || ' has been accepted by a charity.', true, d.created_at + INTERVAL '30 minutes'
FROM donations d WHERE d.donor_id = 'DONOR1_UUID' AND d.status IN ('accepted', 'driver_assigned', 'picked_up', 'delivered')
LIMIT 3;

INSERT INTO notifications (user_id, donation_id, type, title, message, read, created_at)
SELECT 'DONOR1_UUID', d.id, 'driver_assigned', 'Driver Assigned', 'A driver is on the way to collect your ' || d.item_name || '.', false, d.created_at + INTERVAL '1 hour'
FROM donations d WHERE d.donor_id = 'DONOR1_UUID' AND d.status IN ('driver_assigned', 'picked_up', 'delivered')
LIMIT 2;

INSERT INTO notifications (user_id, donation_id, type, title, message, read, created_at)
SELECT 'DONOR1_UUID', d.id, 'delivery_complete', 'Delivery Complete!', 'Your ' || d.item_name || ' has been delivered to the charity. You saved ' || ROUND(d.quantity * 2.5, 1) || ' kg CO₂e!', false, d.created_at + INTERVAL '2 hours'
FROM donations d WHERE d.donor_id = 'DONOR1_UUID' AND d.status = 'delivered'
LIMIT 2;

-- For Charity 1 (Julian House)
INSERT INTO notifications (user_id, donation_id, type, title, message, read, created_at)
SELECT 'CHARITY1_UUID', d.id, 'new_offer', 'New Donation Available', d.item_name || ' (' || d.quantity || ' ' || d.unit || ') is available for collection.', true, d.created_at + INTERVAL '5 minutes'
FROM donations d WHERE d.charity_id = 'CHARITY1_UUID'
LIMIT 3;

-- For Driver 1 (James Wilson)
INSERT INTO notifications (user_id, donation_id, type, title, message, read, created_at)
SELECT 'DRIVER1_UUID', d.id, 'new_job', 'New Job Available', 'Pickup: ' || d.item_name || ' from ' || d.pickup_location, false, d.created_at + INTERVAL '15 minutes'
FROM donations d WHERE d.driver_id = 'DRIVER1_UUID'
LIMIT 3;
*/

-- =====================================================
-- DEMO SETUP CHECKLIST (for presentation day):
-- =====================================================
-- 1. Create all 10 accounts via signup page (4 donors, 3 charities, 3 drivers)
-- 2. Get UUIDs: SELECT id, email FROM auth.users;
-- 3. Find-and-replace DONOR1_UUID through DRIVER3_UUID above
-- 4. Uncomment the INSERT block and run in Supabase SQL Editor
-- 5. Use mark_delivered RPC on the 6 delivered donations to trigger
--    gamification (points, badges, streaks) for realistic leaderboard data
-- 6. Verify: log in as each role and check dashboards look populated
--
-- For the LIVE DEMO during presentation:
-- - Log in as Bath Buns Bakery (donor) → post a new donation
-- - Log in as Julian House (charity) → accept the donation
-- - Log in as James Wilson (driver) → accept job, mark picked up, mark delivered
-- - Show leaderboard updating with points and badges
-- =====================================================
