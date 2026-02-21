-- BrightMeal Database Schema

-- Custom types
CREATE TYPE user_role AS ENUM ('donor', 'charity', 'driver');
CREATE TYPE donation_category AS ENUM ('cooked_meals', 'fresh_produce', 'bakery', 'dairy', 'other');
CREATE TYPE donation_unit AS ENUM ('kg', 'pieces', 'portions', 'cans');
CREATE TYPE storage_type AS ENUM ('ambient', 'chilled', 'frozen');
CREATE TYPE packaging_type AS ENUM ('boxed', 'bagged', 'loose', 'containers');
CREATE TYPE donation_status AS ENUM ('posted', 'accepted', 'driver_assigned', 'picked_up', 'delivered');
CREATE TYPE notification_type AS ENUM ('order_accepted', 'driver_assigned', 'delivery_complete', 'new_offer', 'driver_en_route', 'new_job', 'pickup_reminder');

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  business_type TEXT,
  vehicle_type TEXT,
  license_plate TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Donations table
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  charity_id UUID REFERENCES profiles(id),
  driver_id UUID REFERENCES profiles(id),
  item_name TEXT NOT NULL,
  category donation_category NOT NULL,
  quantity NUMERIC NOT NULL,
  unit donation_unit NOT NULL,
  storage storage_type NOT NULL,
  allergens TEXT[] DEFAULT '{}',
  packaging packaging_type NOT NULL,
  ready_by TIMESTAMPTZ NOT NULL,
  use_by TIMESTAMPTZ NOT NULL,
  pickup_window_start TIMESTAMPTZ NOT NULL,
  pickup_window_end TIMESTAMPTZ NOT NULL,
  pickup_location TEXT NOT NULL,
  additional_notes TEXT,
  status donation_status DEFAULT 'posted' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Donation events (status timeline)
CREATE TABLE donation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id UUID NOT NULL REFERENCES donations(id) ON DELETE CASCADE,
  status donation_status NOT NULL,
  actor_id UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  donation_id UUID REFERENCES donations(id) ON DELETE SET NULL,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_donations_donor_id ON donations(donor_id);
CREATE INDEX idx_donations_charity_id ON donations(charity_id);
CREATE INDEX idx_donations_driver_id ON donations(driver_id);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donation_events_donation_id ON donation_events(donation_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to see other profiles (for donation details - donor name, etc.)
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  USING (true);

-- RLS Policies for donations
-- Donors can see their own donations
CREATE POLICY "Donors can view own donations"
  ON donations FOR SELECT
  USING (auth.uid() = donor_id);

-- Charities can see posted donations (available offers)
CREATE POLICY "Charities can view posted donations"
  ON donations FOR SELECT
  USING (
    status = 'posted'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'charity')
  );

-- Charities can see donations they've accepted
CREATE POLICY "Charities can view accepted donations"
  ON donations FOR SELECT
  USING (auth.uid() = charity_id);

-- Drivers can see accepted donations (available jobs)
CREATE POLICY "Drivers can view accepted donations"
  ON donations FOR SELECT
  USING (
    status = 'accepted'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'driver')
  );

-- Drivers can see donations assigned to them
CREATE POLICY "Drivers can view assigned donations"
  ON donations FOR SELECT
  USING (auth.uid() = driver_id);

-- Donors can create donations
CREATE POLICY "Donors can create donations"
  ON donations FOR INSERT
  WITH CHECK (
    auth.uid() = donor_id
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'donor')
  );

-- Donors can update their own donations
CREATE POLICY "Donors can update own donations"
  ON donations FOR UPDATE
  USING (auth.uid() = donor_id);

-- Charities can update donations (accept)
CREATE POLICY "Charities can accept donations"
  ON donations FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'charity')
  );

-- Drivers can update donations (assign/pickup/deliver)
CREATE POLICY "Drivers can update donations"
  ON donations FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'driver')
  );

-- RLS Policies for donation_events
CREATE POLICY "Users can view events for accessible donations"
  ON donation_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM donations d
      WHERE d.id = donation_id
      AND (d.donor_id = auth.uid() OR d.charity_id = auth.uid() OR d.driver_id = auth.uid())
    )
  );

CREATE POLICY "Users can create events"
  ON donation_events FOR INSERT
  WITH CHECK (auth.uid() = actor_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- Enable Realtime for donations table
ALTER PUBLICATION supabase_realtime ADD TABLE donations;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
