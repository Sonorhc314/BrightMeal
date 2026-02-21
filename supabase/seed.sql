-- BrightMeal Seed Data
-- Run this after creating accounts via the auth system.
-- This script provides demo data for the presentation.
--
-- Demo Accounts (create these via the signup page first):
-- DONOR 1: sunrise@demo.com / demo1234 (Sunrise Bakery)
-- DONOR 2: greenleaf@demo.com / demo1234 (Green Leaf Cafe)
-- DONOR 3: bellacucina@demo.com / demo1234 (Bella Cucina)
-- CHARITY 1: bathfoodbank@demo.com / demo1234 (Bath Food Bank)
-- CHARITY 2: stmarys@demo.com / demo1234 (St Mary's Shelter)
-- CHARITY 3: hopekitchen@demo.com / demo1234 (Hope Kitchen)
-- DRIVER 1: james@demo.com / demo1234 (James Wilson)
-- DRIVER 2: sarah@demo.com / demo1234 (Sarah Ahmed)
-- DRIVER 3: mike@demo.com / demo1234 (Mike Chen)
--
-- After creating accounts via signup, update the UUIDs below with the actual
-- auth.users IDs from Supabase, then run this SQL.

-- =====================================================
-- STEP 1: Replace these placeholder UUIDs with real ones
-- =====================================================
-- Get the UUIDs from: SELECT id, email FROM auth.users;

-- Donors
-- donor1_id = <UUID for sunrise@demo.com>
-- donor2_id = <UUID for greenleaf@demo.com>
-- donor3_id = <UUID for bellacucina@demo.com>

-- Charities
-- charity1_id = <UUID for bathfoodbank@demo.com>
-- charity2_id = <UUID for stmarys@demo.com>
-- charity3_id = <UUID for hopekitchen@demo.com>

-- Drivers
-- driver1_id = <UUID for james@demo.com>
-- driver2_id = <UUID for sarah@demo.com>
-- driver3_id = <UUID for mike@demo.com>

-- =====================================================
-- STEP 2: Run the INSERT statements below
-- (Replace placeholder UUIDs with real ones first)
-- =====================================================

-- Example: To seed after signup, run something like this
-- (adjusting UUIDs to match your actual Supabase auth.users):

/*
-- DELIVERED donations (complete golden path)
INSERT INTO donations (donor_id, charity_id, driver_id, item_name, category, quantity, unit, storage, allergens, packaging, ready_by, use_by, pickup_window_start, pickup_window_end, pickup_location, additional_notes, status, created_at)
VALUES
-- Delivered donation 1
('DONOR1_UUID', 'CHARITY1_UUID', 'DRIVER1_UUID', 'Assorted Sandwiches', 'cooked_meals', 20, 'portions', 'chilled', '{"Gluten", "Dairy"}', 'boxed', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days' + INTERVAL '2 hours', '12 High Street, Bath, BA1 1AA', 'Use side entrance', 'delivered', NOW() - INTERVAL '3 days'),

-- Delivered donation 2
('DONOR2_UUID', 'CHARITY2_UUID', 'DRIVER2_UUID', 'Fresh Vegetable Box', 'fresh_produce', 15, 'kg', 'chilled', '{}', 'boxed', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '3 hours', '45 Milsom Street, Bath, BA1 1DN', NULL, 'delivered', NOW() - INTERVAL '2 days'),

-- Delivered donation 3
('DONOR3_UUID', 'CHARITY1_UUID', 'DRIVER1_UUID', 'Pasta & Sauce Batch', 'cooked_meals', 30, 'portions', 'ambient', '{"Gluten"}', 'containers', NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days' + INTERVAL '2 hours', '8 George Street, Bath, BA1 2EH', 'Vegetarian', 'delivered', NOW() - INTERVAL '5 days'),

-- Delivered donation 4
('DONOR1_UUID', 'CHARITY3_UUID', 'DRIVER3_UUID', 'Croissants & Pastries', 'bakery', 40, 'pieces', 'ambient', '{"Gluten", "Dairy", "Eggs"}', 'bagged', NOW() - INTERVAL '1 day', NOW() - INTERVAL '12 hours', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '1 hour', '12 High Street, Bath, BA1 1AA', 'Best consumed same day', 'delivered', NOW() - INTERVAL '1 day'),

-- Delivered donation 5
('DONOR2_UUID', 'CHARITY1_UUID', 'DRIVER2_UUID', 'Soup of the Day', 'cooked_meals', 10, 'portions', 'chilled', '{}', 'containers', NOW() - INTERVAL '4 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days' + INTERVAL '2 hours', '45 Milsom Street, Bath, BA1 1DN', 'Tomato basil, vegan-friendly', 'delivered', NOW() - INTERVAL '4 days'),

-- PICKED UP donation (in transit)
('DONOR3_UUID', 'CHARITY2_UUID', 'DRIVER1_UUID', 'Risotto Portions', 'cooked_meals', 15, 'portions', 'chilled', '{"Dairy"}', 'containers', NOW() - INTERVAL '2 hours', NOW() + INTERVAL '1 day', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '1 hour', '8 George Street, Bath, BA1 2EH', 'Mushroom risotto, keep refrigerated', 'picked_up', NOW() - INTERVAL '4 hours'),

-- DRIVER ASSIGNED donations
('DONOR1_UUID', 'CHARITY1_UUID', 'DRIVER3_UUID', 'Mixed Salad Bowls', 'fresh_produce', 12, 'portions', 'chilled', '{"Nuts"}', 'containers', NOW() - INTERVAL '1 hour', NOW() + INTERVAL '6 hours', NOW(), NOW() + INTERVAL '2 hours', '12 High Street, Bath, BA1 1AA', 'Contains walnuts and pine nuts', 'driver_assigned', NOW() - INTERVAL '2 hours'),

('DONOR2_UUID', 'CHARITY3_UUID', 'DRIVER2_UUID', 'Fruit Platter', 'fresh_produce', 5, 'kg', 'chilled', '{}', 'boxed', NOW(), NOW() + INTERVAL '2 days', NOW() + INTERVAL '1 hour', NOW() + INTERVAL '3 hours', '45 Milsom Street, Bath, BA1 1DN', 'Seasonal fruit selection', 'driver_assigned', NOW() - INTERVAL '1 hour'),

-- ACCEPTED donations (waiting for driver)
('DONOR1_UUID', 'CHARITY2_UUID', NULL, 'Bread Loaves', 'bakery', 25, 'pieces', 'ambient', '{"Gluten"}', 'bagged', NOW() + INTERVAL '1 hour', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 hours', NOW() + INTERVAL '4 hours', '12 High Street, Bath, BA1 1AA', 'Sourdough and wholemeal mix', 'accepted', NOW() - INTERVAL '30 minutes'),

('DONOR3_UUID', 'CHARITY1_UUID', NULL, 'Yoghurt Cups', 'dairy', 30, 'pieces', 'chilled', '{"Dairy"}', 'boxed', NOW() + INTERVAL '30 minutes', NOW() + INTERVAL '3 days', NOW() + INTERVAL '1 hour', NOW() + INTERVAL '3 hours', '8 George Street, Bath, BA1 2EH', 'Assorted flavours, check dates', 'accepted', NOW() - INTERVAL '45 minutes'),

-- POSTED donations (available for charities)
('DONOR1_UUID', NULL, NULL, 'Cake Slices', 'bakery', 18, 'pieces', 'ambient', '{"Gluten", "Dairy", "Eggs"}', 'boxed', NOW() + INTERVAL '2 hours', NOW() + INTERVAL '1 day', NOW() + INTERVAL '3 hours', NOW() + INTERVAL '5 hours', '12 High Street, Bath, BA1 1AA', 'Victoria sponge and chocolate cake', 'posted', NOW() - INTERVAL '10 minutes'),

('DONOR2_UUID', NULL, NULL, 'Canned Tomatoes', 'other', 20, 'cans', 'ambient', '{}', 'boxed', NOW(), NOW() + INTERVAL '60 days', NOW() + INTERVAL '1 hour', NOW() + INTERVAL '6 hours', '45 Milsom Street, Bath, BA1 1DN', 'Surplus stock, long shelf life', 'posted', NOW() - INTERVAL '5 minutes'),

('DONOR3_UUID', NULL, NULL, 'Frozen Pizza Bases', 'bakery', 15, 'pieces', 'frozen', '{"Gluten"}', 'boxed', NOW(), NOW() + INTERVAL '30 days', NOW() + INTERVAL '2 hours', NOW() + INTERVAL '5 hours', '8 George Street, Bath, BA1 2EH', 'Keep frozen until use', 'posted', NOW() - INTERVAL '15 minutes'),

('DONOR1_UUID', NULL, NULL, 'Milk Cartons', 'dairy', 10, 'pieces', 'chilled', '{"Dairy"}', 'boxed', NOW() + INTERVAL '1 hour', NOW() + INTERVAL '3 days', NOW() + INTERVAL '2 hours', NOW() + INTERVAL '4 hours', '12 High Street, Bath, BA1 1AA', 'Semi-skimmed, 1L cartons', 'posted', NOW() - INTERVAL '2 minutes');

-- NOTIFICATIONS (sample notifications for demo)
-- For Donor 1
INSERT INTO notifications (user_id, donation_id, type, title, message, read, created_at)
SELECT 'DONOR1_UUID', d.id, 'order_accepted', 'Donation Accepted!', 'Your donation of ' || d.item_name || ' has been accepted by a charity.', true, d.created_at + INTERVAL '30 minutes'
FROM donations d WHERE d.donor_id = 'DONOR1_UUID' AND d.status IN ('accepted', 'driver_assigned', 'picked_up', 'delivered')
LIMIT 3;

INSERT INTO notifications (user_id, donation_id, type, title, message, read, created_at)
SELECT 'DONOR1_UUID', d.id, 'driver_assigned', 'Driver Assigned', 'A driver has been assigned to pick up your ' || d.item_name || '.', false, d.created_at + INTERVAL '1 hour'
FROM donations d WHERE d.donor_id = 'DONOR1_UUID' AND d.status IN ('driver_assigned', 'picked_up', 'delivered')
LIMIT 2;

INSERT INTO notifications (user_id, donation_id, type, title, message, read, created_at)
SELECT 'DONOR1_UUID', d.id, 'delivery_complete', 'Delivery Complete!', 'Your ' || d.item_name || ' has been successfully delivered to the charity.', false, d.created_at + INTERVAL '2 hours'
FROM donations d WHERE d.donor_id = 'DONOR1_UUID' AND d.status = 'delivered'
LIMIT 2;
*/

-- =====================================================
-- QUICK START: Use the app's signup flow to create
-- accounts, then use the Post Surplus Food form to
-- create donations for the demo.
-- =====================================================
