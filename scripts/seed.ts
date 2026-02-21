import { createClient } from '@supabase/supabase-js';

// ── Config ──────────────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    '❌  Missing env vars. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.\n' +
    '   Run: source .env.local && npx tsx scripts/seed.ts'
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Demo users ──────────────────────────────────────────────────────────────
const PASSWORD = 'demo1234';

const donors = [
  { email: 'sunrise@demo.com', name: 'Sunrise Bakery', location: '12 Milsom St, Bath BA1 1DN', business_type: 'Bakery' },
  { email: 'greenleaf@demo.com', name: 'Green Leaf Cafe', location: '5 Kingsmead Square, Bath BA1 2AB', business_type: 'Cafe' },
  { email: 'bellacucina@demo.com', name: 'Bella Cucina', location: '22 George St, Bath BA1 2EN', business_type: 'Restaurant' },
];

const charities = [
  { email: 'bathfoodbank@demo.com', name: 'Bath Food Bank', location: '8 Lower Borough Walls, Bath BA1 1QR', business_type: 'Food Bank' },
  { email: 'stmarys@demo.com', name: "St Mary's Shelter", location: '15 Julian Rd, Bath BA1 2RH', business_type: 'Shelter' },
  { email: 'hopekitchen@demo.com', name: 'Hope Kitchen', location: '3 Walcot St, Bath BA1 5BG', business_type: 'Community Kitchen' },
];

const drivers = [
  { email: 'james@demo.com', name: 'James Wilson', vehicle_type: 'Van', license_plate: 'BA19 XYZ' },
  { email: 'sarah@demo.com', name: 'Sarah Chen', vehicle_type: 'Car', license_plate: 'BA21 ABC' },
  { email: 'mike@demo.com', name: 'Mike Thompson', vehicle_type: 'Van', license_plate: 'BA20 DEF' },
];

// ── Helpers ─────────────────────────────────────────────────────────────────
function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3600_000).toISOString();
}

function hoursFromNow(h: number): string {
  return new Date(Date.now() + h * 3600_000).toISOString();
}

async function createUser(email: string, meta: Record<string, unknown>) {
  // Check if user already exists by listing users and filtering
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existing = existingUsers?.users.find((u) => u.email === email);

  if (existing) {
    console.log(`  ↩  ${email} already exists (${existing.id})`);
    return existing.id;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: meta,
  });

  if (error) throw new Error(`Failed to create ${email}: ${error.message}`);
  console.log(`  ✅ ${email} → ${data.user.id}`);
  return data.user.id;
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🌱 BrightMeal Seed Script\n');

  // ── 1. Clean existing demo data ──────────────────────────────────────────
  console.log('🧹 Cleaning existing demo data...');
  const demoEmails = [...donors, ...charities, ...drivers].map((u) => u.email);
  const { data: allUsers } = await supabase.auth.admin.listUsers();
  const demoUserIds: string[] = [];

  for (const u of allUsers?.users ?? []) {
    if (u.email && demoEmails.includes(u.email)) {
      demoUserIds.push(u.id);
    }
  }

  if (demoUserIds.length > 0) {
    // Delete in order: notifications → events → donations → profiles → auth users
    await supabase.from('notifications').delete().in('user_id', demoUserIds);
    await supabase.from('donation_events').delete().in('actor_id', demoUserIds);
    await supabase.from('donations').delete().in('donor_id', demoUserIds);
    await supabase.from('profiles').delete().in('id', demoUserIds);
    for (const uid of demoUserIds) {
      await supabase.auth.admin.deleteUser(uid);
    }
    console.log(`  Removed ${demoUserIds.length} existing demo users\n`);
  }

  // ── 2. Create auth users ─────────────────────────────────────────────────
  console.log('👤 Creating donor accounts...');
  const donorIds: string[] = [];
  for (const d of donors) {
    const id = await createUser(d.email, { name: d.name, role: 'donor' });
    donorIds.push(id);
  }

  console.log('\n🤝 Creating charity accounts...');
  const charityIds: string[] = [];
  for (const c of charities) {
    const id = await createUser(c.email, { name: c.name, role: 'charity' });
    charityIds.push(id);
  }

  console.log('\n🚗 Creating driver accounts...');
  const driverIds: string[] = [];
  for (const d of drivers) {
    const id = await createUser(d.email, { name: d.name, role: 'driver' });
    driverIds.push(id);
  }

  // ── 3. Insert profiles ───────────────────────────────────────────────────
  console.log('\n📝 Inserting profiles...');
  const profiles = [
    ...donors.map((d, i) => ({
      id: donorIds[i],
      role: 'donor' as const,
      name: d.name,
      email: d.email,
      phone: `0122590000${i + 1}`,
      location: d.location,
      business_type: d.business_type,
    })),
    ...charities.map((c, i) => ({
      id: charityIds[i],
      role: 'charity' as const,
      name: c.name,
      email: c.email,
      phone: `0122580000${i + 1}`,
      location: c.location,
      business_type: c.business_type,
    })),
    ...drivers.map((d, i) => ({
      id: driverIds[i],
      role: 'driver' as const,
      name: d.name,
      email: d.email,
      phone: `0778500000${i + 1}`,
      vehicle_type: d.vehicle_type,
      license_plate: d.license_plate,
    })),
  ];

  const { error: profileError } = await supabase.from('profiles').upsert(profiles);
  if (profileError) throw new Error(`Profiles: ${profileError.message}`);
  console.log(`  ✅ ${profiles.length} profiles inserted`);

  // ── 4. Insert donations ──────────────────────────────────────────────────
  console.log('\n📦 Inserting donations...');

  type DonationSeed = {
    donor_id: string;
    charity_id: string | null;
    driver_id: string | null;
    item_name: string;
    category: string;
    quantity: number;
    unit: string;
    storage: string;
    allergens: string[];
    packaging: string;
    ready_by: string;
    use_by: string;
    pickup_window_start: string;
    pickup_window_end: string;
    pickup_location: string;
    additional_notes: string | null;
    status: string;
    created_at: string;
  };

  const donationData: DonationSeed[] = [
    // ── 5 DELIVERED ────────────────────────────────────────────────────────
    {
      donor_id: donorIds[0], charity_id: charityIds[0], driver_id: driverIds[0],
      item_name: 'Sourdough Loaves', category: 'bakery', quantity: 20, unit: 'pieces',
      storage: 'ambient', allergens: ['gluten', 'wheat'], packaging: 'bagged',
      ready_by: hoursAgo(48), use_by: hoursAgo(24),
      pickup_window_start: hoursAgo(47), pickup_window_end: hoursAgo(45),
      pickup_location: '12 Milsom St, Bath BA1 1DN',
      additional_notes: 'Day-old but still fresh', status: 'delivered', created_at: hoursAgo(48),
    },
    {
      donor_id: donorIds[1], charity_id: charityIds[1], driver_id: driverIds[1],
      item_name: 'Vegetable Soup Portions', category: 'cooked_meals', quantity: 15, unit: 'portions',
      storage: 'chilled', allergens: ['celery'], packaging: 'containers',
      ready_by: hoursAgo(72), use_by: hoursAgo(48),
      pickup_window_start: hoursAgo(71), pickup_window_end: hoursAgo(69),
      pickup_location: '5 Kingsmead Square, Bath BA1 2AB',
      additional_notes: null, status: 'delivered', created_at: hoursAgo(72),
    },
    {
      donor_id: donorIds[2], charity_id: charityIds[2], driver_id: driverIds[2],
      item_name: 'Margherita Pizzas', category: 'cooked_meals', quantity: 8, unit: 'pieces',
      storage: 'ambient', allergens: ['gluten', 'dairy'], packaging: 'boxed',
      ready_by: hoursAgo(96), use_by: hoursAgo(90),
      pickup_window_start: hoursAgo(95), pickup_window_end: hoursAgo(93),
      pickup_location: '22 George St, Bath BA1 2EN',
      additional_notes: 'Still warm in insulated bags', status: 'delivered', created_at: hoursAgo(96),
    },
    {
      donor_id: donorIds[0], charity_id: charityIds[1], driver_id: driverIds[0],
      item_name: 'Croissants & Pastries', category: 'bakery', quantity: 30, unit: 'pieces',
      storage: 'ambient', allergens: ['gluten', 'dairy', 'eggs'], packaging: 'boxed',
      ready_by: hoursAgo(120), use_by: hoursAgo(96),
      pickup_window_start: hoursAgo(119), pickup_window_end: hoursAgo(117),
      pickup_location: '12 Milsom St, Bath BA1 1DN',
      additional_notes: 'Assorted pastries from morning bake', status: 'delivered', created_at: hoursAgo(120),
    },
    {
      donor_id: donorIds[1], charity_id: charityIds[0], driver_id: driverIds[2],
      item_name: 'Fresh Fruit Salads', category: 'fresh_produce', quantity: 10, unit: 'portions',
      storage: 'chilled', allergens: [], packaging: 'containers',
      ready_by: hoursAgo(144), use_by: hoursAgo(120),
      pickup_window_start: hoursAgo(143), pickup_window_end: hoursAgo(141),
      pickup_location: '5 Kingsmead Square, Bath BA1 2AB',
      additional_notes: 'Keep refrigerated', status: 'delivered', created_at: hoursAgo(144),
    },
    // ── 1 PICKED_UP ────────────────────────────────────────────────────────
    {
      donor_id: donorIds[2], charity_id: charityIds[0], driver_id: driverIds[0],
      item_name: 'Pasta Bake Trays', category: 'cooked_meals', quantity: 5, unit: 'portions',
      storage: 'chilled', allergens: ['gluten', 'dairy'], packaging: 'containers',
      ready_by: hoursAgo(3), use_by: hoursFromNow(6),
      pickup_window_start: hoursAgo(2), pickup_window_end: hoursAgo(1),
      pickup_location: '22 George St, Bath BA1 2EN',
      additional_notes: 'Large aluminium trays', status: 'picked_up', created_at: hoursAgo(4),
    },
    // ── 2 DRIVER_ASSIGNED ──────────────────────────────────────────────────
    {
      donor_id: donorIds[0], charity_id: charityIds[2], driver_id: driverIds[1],
      item_name: 'Sandwich Platters', category: 'cooked_meals', quantity: 12, unit: 'pieces',
      storage: 'chilled', allergens: ['gluten', 'dairy', 'eggs'], packaging: 'boxed',
      ready_by: hoursAgo(1), use_by: hoursFromNow(8),
      pickup_window_start: hoursFromNow(0.5), pickup_window_end: hoursFromNow(2),
      pickup_location: '12 Milsom St, Bath BA1 1DN',
      additional_notes: 'Mixed fillings', status: 'driver_assigned', created_at: hoursAgo(2),
    },
    {
      donor_id: donorIds[1], charity_id: charityIds[0], driver_id: driverIds[2],
      item_name: 'Greek Yoghurt Pots', category: 'dairy', quantity: 20, unit: 'pieces',
      storage: 'chilled', allergens: ['dairy'], packaging: 'containers',
      ready_by: hoursAgo(1), use_by: hoursFromNow(24),
      pickup_window_start: hoursFromNow(1), pickup_window_end: hoursFromNow(3),
      pickup_location: '5 Kingsmead Square, Bath BA1 2AB',
      additional_notes: 'Near expiry but still good', status: 'driver_assigned', created_at: hoursAgo(3),
    },
    // ── 2 ACCEPTED ─────────────────────────────────────────────────────────
    {
      donor_id: donorIds[2], charity_id: charityIds[1], driver_id: null,
      item_name: 'Tiramisu Portions', category: 'bakery', quantity: 6, unit: 'portions',
      storage: 'chilled', allergens: ['gluten', 'dairy', 'eggs'], packaging: 'containers',
      ready_by: hoursFromNow(1), use_by: hoursFromNow(12),
      pickup_window_start: hoursFromNow(1.5), pickup_window_end: hoursFromNow(3.5),
      pickup_location: '22 George St, Bath BA1 2EN',
      additional_notes: 'Homemade, keep chilled', status: 'accepted', created_at: hoursAgo(1),
    },
    {
      donor_id: donorIds[0], charity_id: charityIds[2], driver_id: null,
      item_name: 'Whole Wheat Rolls', category: 'bakery', quantity: 40, unit: 'pieces',
      storage: 'ambient', allergens: ['gluten', 'wheat'], packaging: 'bagged',
      ready_by: hoursFromNow(0.5), use_by: hoursFromNow(24),
      pickup_window_start: hoursFromNow(1), pickup_window_end: hoursFromNow(3),
      pickup_location: '12 Milsom St, Bath BA1 1DN',
      additional_notes: null, status: 'accepted', created_at: hoursAgo(0.5),
    },
    // ── 5 POSTED ───────────────────────────────────────────────────────────
    {
      donor_id: donorIds[1], charity_id: null, driver_id: null,
      item_name: 'Avocado & Quinoa Bowls', category: 'cooked_meals', quantity: 8, unit: 'portions',
      storage: 'chilled', allergens: [], packaging: 'containers',
      ready_by: hoursFromNow(2), use_by: hoursFromNow(10),
      pickup_window_start: hoursFromNow(2.5), pickup_window_end: hoursFromNow(4.5),
      pickup_location: '5 Kingsmead Square, Bath BA1 2AB',
      additional_notes: 'Vegan, freshly prepared', status: 'posted', created_at: hoursAgo(0.25),
    },
    {
      donor_id: donorIds[2], charity_id: null, driver_id: null,
      item_name: 'Frozen Lasagne Trays', category: 'cooked_meals', quantity: 4, unit: 'pieces',
      storage: 'frozen', allergens: ['gluten', 'dairy'], packaging: 'containers',
      ready_by: hoursFromNow(1), use_by: hoursFromNow(168),
      pickup_window_start: hoursFromNow(1.5), pickup_window_end: hoursFromNow(4),
      pickup_location: '22 George St, Bath BA1 2EN',
      additional_notes: 'Frozen, needs cold transport', status: 'posted', created_at: hoursAgo(0.5),
    },
    {
      donor_id: donorIds[0], charity_id: null, driver_id: null,
      item_name: 'Banana Bread Loaves', category: 'bakery', quantity: 6, unit: 'pieces',
      storage: 'ambient', allergens: ['gluten', 'eggs', 'dairy'], packaging: 'bagged',
      ready_by: hoursFromNow(0.5), use_by: hoursFromNow(48),
      pickup_window_start: hoursFromNow(1), pickup_window_end: hoursFromNow(3),
      pickup_location: '12 Milsom St, Bath BA1 1DN',
      additional_notes: 'Freshly baked this morning', status: 'posted', created_at: hoursAgo(0.1),
    },
    {
      donor_id: donorIds[1], charity_id: null, driver_id: null,
      item_name: 'Mixed Salad Boxes', category: 'fresh_produce', quantity: 10, unit: 'pieces',
      storage: 'chilled', allergens: [], packaging: 'boxed',
      ready_by: hoursFromNow(1), use_by: hoursFromNow(12),
      pickup_window_start: hoursFromNow(1.5), pickup_window_end: hoursFromNow(3),
      pickup_location: '5 Kingsmead Square, Bath BA1 2AB',
      additional_notes: 'Includes dressing sachets', status: 'posted', created_at: hoursAgo(0.2),
    },
    {
      donor_id: donorIds[2], charity_id: null, driver_id: null,
      item_name: 'Focaccia Bread', category: 'bakery', quantity: 10, unit: 'pieces',
      storage: 'ambient', allergens: ['gluten'], packaging: 'bagged',
      ready_by: hoursFromNow(2), use_by: hoursFromNow(24),
      pickup_window_start: hoursFromNow(2), pickup_window_end: hoursFromNow(4),
      pickup_location: '22 George St, Bath BA1 2EN',
      additional_notes: 'Rosemary and sea salt', status: 'posted', created_at: hoursAgo(0.15),
    },
  ];

  const { data: insertedDonations, error: donationError } = await supabase
    .from('donations')
    .insert(donationData)
    .select('id, status, donor_id, charity_id, driver_id, item_name');

  if (donationError) throw new Error(`Donations: ${donationError.message}`);
  console.log(`  ✅ ${insertedDonations!.length} donations inserted`);

  // ── 5. Insert donation events ────────────────────────────────────────────
  console.log('\n📊 Inserting donation events...');

  const statusFlow: string[] = ['posted', 'accepted', 'driver_assigned', 'picked_up', 'delivered'];

  type EventSeed = { donation_id: string; status: string; actor_id: string; created_at: string };
  const events: EventSeed[] = [];

  for (const d of insertedDonations!) {
    const currentIdx = statusFlow.indexOf(d.status);
    for (let i = 0; i <= currentIdx; i++) {
      const status = statusFlow[i];
      let actor_id: string;
      if (status === 'posted') actor_id = d.donor_id;
      else if (status === 'accepted') actor_id = d.charity_id!;
      else actor_id = d.driver_id!;

      events.push({
        donation_id: d.id,
        status,
        actor_id,
        created_at: hoursAgo((currentIdx - i) * 2 + 1), // stagger events
      });
    }
  }

  const { error: eventsError } = await supabase.from('donation_events').insert(events);
  if (eventsError) throw new Error(`Events: ${eventsError.message}`);
  console.log(`  ✅ ${events.length} donation events inserted`);

  // ── 6. Insert notifications ──────────────────────────────────────────────
  console.log('\n🔔 Inserting notifications...');

  type NotifSeed = {
    user_id: string;
    donation_id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    created_at: string;
  };
  const notifications: NotifSeed[] = [];

  for (const d of insertedDonations!) {
    const statusIdx = statusFlow.indexOf(d.status);

    // Notify donor when accepted
    if (statusIdx >= 1) {
      notifications.push({
        user_id: d.donor_id, donation_id: d.id,
        type: 'order_accepted',
        title: 'Donation Accepted',
        message: `Your "${d.item_name}" has been accepted by a charity.`,
        read: statusIdx > 1, created_at: hoursAgo((statusIdx - 1) * 2 + 1),
      });
    }

    // Notify charity of new offer (for posted donations that are still posted)
    if (statusIdx === 0) {
      // Pick a random charity to notify
      notifications.push({
        user_id: charityIds[0], donation_id: d.id,
        type: 'new_offer',
        title: 'New Food Available',
        message: `"${d.item_name}" is available for pickup.`,
        read: false, created_at: hoursAgo(0.5),
      });
    }

    // Notify donor & charity when driver assigned
    if (statusIdx >= 2) {
      notifications.push({
        user_id: d.donor_id, donation_id: d.id,
        type: 'driver_assigned',
        title: 'Driver Assigned',
        message: `A driver has been assigned to pick up "${d.item_name}".`,
        read: statusIdx > 2, created_at: hoursAgo((statusIdx - 2) * 2 + 1),
      });
      notifications.push({
        user_id: d.charity_id!, donation_id: d.id,
        type: 'driver_en_route',
        title: 'Driver En Route',
        message: `Your driver is on the way to collect "${d.item_name}".`,
        read: statusIdx > 2, created_at: hoursAgo((statusIdx - 2) * 2 + 1),
      });
    }

    // Notify driver of new job (accepted donations)
    if (statusIdx === 1) {
      notifications.push({
        user_id: driverIds[0], donation_id: d.id,
        type: 'new_job',
        title: 'New Job Available',
        message: `"${d.item_name}" needs a driver for pickup.`,
        read: false, created_at: hoursAgo(0.5),
      });
    }

    // Notify all parties on delivery
    if (statusIdx >= 4) {
      notifications.push({
        user_id: d.donor_id, donation_id: d.id,
        type: 'delivery_complete',
        title: 'Delivery Complete',
        message: `"${d.item_name}" has been successfully delivered.`,
        read: true, created_at: hoursAgo(1),
      });
      notifications.push({
        user_id: d.charity_id!, donation_id: d.id,
        type: 'delivery_complete',
        title: 'Delivery Complete',
        message: `"${d.item_name}" has arrived at your location.`,
        read: true, created_at: hoursAgo(1),
      });
    }
  }

  const { error: notifError } = await supabase.from('notifications').insert(notifications);
  if (notifError) throw new Error(`Notifications: ${notifError.message}`);
  console.log(`  ✅ ${notifications.length} notifications inserted`);

  // ── 7. Summary ───────────────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(50));
  console.log('  🎉 Seed complete! Demo login credentials:');
  console.log('═'.repeat(50));
  console.log('\n  DONORS (password: demo1234)');
  donors.forEach((d) => console.log(`    ${d.email.padEnd(25)} ${d.name}`));
  console.log('\n  CHARITIES (password: demo1234)');
  charities.forEach((c) => console.log(`    ${c.email.padEnd(25)} ${c.name}`));
  console.log('\n  DRIVERS (password: demo1234)');
  drivers.forEach((d) => console.log(`    ${d.email.padEnd(25)} ${d.name}`));
  console.log('\n' + '═'.repeat(50) + '\n');
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
