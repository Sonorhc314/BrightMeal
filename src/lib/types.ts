export type UserRole = 'donor' | 'charity' | 'driver';

export type DonationCategory = 'cooked_meals' | 'fresh_produce' | 'bakery' | 'dairy' | 'other';

export type DonationUnit = 'kg' | 'pieces' | 'portions' | 'cans';

export type StorageType = 'ambient' | 'chilled' | 'frozen';

export type PackagingType = 'boxed' | 'bagged' | 'loose' | 'containers';

export type DonationStatus = 'posted' | 'accepted' | 'driver_assigned' | 'picked_up' | 'delivered' | 'cancelled';

export type NotificationType =
  | 'order_accepted'
  | 'driver_assigned'
  | 'delivery_complete'
  | 'new_offer'
  | 'driver_en_route'
  | 'new_job'
  | 'pickup_reminder';

export interface Profile {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  business_type: string | null;
  vehicle_type: string | null;
  license_plate: string | null;
  avatar_url: string | null;
  total_points: number;
  total_kg_impact: number;
  current_streak: number;
  best_streak: number;
  last_active_week: string;
  total_donations_completed: number;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
}

export interface Donation {
  id: string;
  donor_id: string;
  charity_id: string | null;
  driver_id: string | null;
  item_name: string;
  category: DonationCategory;
  quantity: number;
  unit: DonationUnit;
  storage: StorageType;
  allergens: string[];
  packaging: PackagingType;
  ready_by: string;
  use_by: string;
  pickup_window_start: string;
  pickup_window_end: string;
  pickup_location: string;
  additional_notes: string | null;
  status: DonationStatus;
  created_at: string;
  // Joined fields
  donor?: Profile;
  charity?: Profile;
  driver?: Profile;
}

export interface DonationEvent {
  id: string;
  donation_id: string;
  status: DonationStatus;
  actor_id: string;
  created_at: string;
  actor?: Profile;
}

export interface Notification {
  id: string;
  user_id: string;
  donation_id: string | null;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}
