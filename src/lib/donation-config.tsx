import { Snowflake, Thermometer, Sun, Truck, User } from 'lucide-react';
import type { DonationStatus, DonationCategory, DonationUnit, StorageType, PackagingType, DeliveryMethod } from '@/lib/types';

export const statusConfig: Record<DonationStatus, { label: string; className: string }> = {
  posted: { label: 'Available', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  accepted: { label: 'Accepted', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  driver_assigned: { label: 'Driver Assigned', className: 'bg-purple-100 text-purple-700 border-purple-200' },
  picked_up: { label: 'Picked Up', className: 'bg-orange-100 text-orange-700 border-orange-200' },
  delivered: { label: 'Delivered', className: 'bg-green-100 text-green-700 border-green-200' },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700 border-red-200' },
};

export const driverStatusConfig: Record<DonationStatus, { label: string; className: string }> = {
  ...statusConfig,
  accepted: { label: 'Needs Driver', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  driver_assigned: { label: 'Assigned to You', className: 'bg-purple-100 text-purple-700 border-purple-200' },
};

export const categoryConfig: Record<DonationCategory, { label: string; color: string }> = {
  cooked_meals: { label: 'Cooked Meals', color: 'bg-orange-100 text-orange-700' },
  fresh_produce: { label: 'Fresh Produce', color: 'bg-green-100 text-green-700' },
  bakery: { label: 'Bakery', color: 'bg-amber-100 text-amber-700' },
  dairy: { label: 'Dairy', color: 'bg-blue-100 text-blue-700' },
  other: { label: 'Other', color: 'bg-gray-100 text-gray-700' },
};

export const storageIcon: Record<StorageType, React.ReactNode> = {
  frozen: <Snowflake className="h-3.5 w-3.5 text-blue-500" />,
  chilled: <Thermometer className="h-3.5 w-3.5 text-cyan-500" />,
  ambient: <Sun className="h-3.5 w-3.5 text-amber-500" />,
};

export const storageLabel: Record<StorageType, string> = {
  frozen: 'Frozen',
  chilled: 'Chilled',
  ambient: 'Ambient',
};

// Form-specific constants shared between post and edit pages
export const formCategories: { value: DonationCategory; label: string; color: string }[] = [
  { value: 'cooked_meals', label: 'Cooked Meals', color: 'border-orange-400 bg-orange-50 text-orange-700' },
  { value: 'fresh_produce', label: 'Fresh Produce', color: 'border-green-400 bg-green-50 text-green-700' },
  { value: 'bakery', label: 'Bakery', color: 'border-amber-400 bg-amber-50 text-amber-700' },
  { value: 'dairy', label: 'Dairy', color: 'border-blue-400 bg-blue-50 text-blue-700' },
  { value: 'other', label: 'Other', color: 'border-gray-400 bg-gray-50 text-gray-700' },
];

export const formUnits: { value: DonationUnit; label: string }[] = [
  { value: 'kg', label: 'Kilograms' },
  { value: 'pieces', label: 'Pieces' },
  { value: 'portions', label: 'Portions' },
  { value: 'cans', label: 'Cans' },
];

export const formStorageTypes: { value: StorageType; label: string; icon: React.ReactNode; activeColor: string }[] = [
  { value: 'ambient', label: 'Ambient', icon: <Sun className="h-4 w-4" />, activeColor: 'border-amber-400 bg-amber-50 text-amber-700' },
  { value: 'chilled', label: 'Chilled', icon: <Thermometer className="h-4 w-4" />, activeColor: 'border-cyan-400 bg-cyan-50 text-cyan-700' },
  { value: 'frozen', label: 'Frozen', icon: <Snowflake className="h-4 w-4" />, activeColor: 'border-blue-400 bg-blue-50 text-blue-700' },
];

export const formPackagingTypes: { value: PackagingType; label: string }[] = [
  { value: 'boxed', label: 'Boxed' },
  { value: 'bagged', label: 'Bagged' },
  { value: 'loose', label: 'Loose' },
  { value: 'containers', label: 'Containers' },
];

export const deliveryMethodConfig: Record<DeliveryMethod, { label: string; icon: React.ReactNode; className: string }> = {
  driver_delivery: { label: 'Driver Delivery', icon: <Truck className="h-3.5 w-3.5" />, className: 'bg-blue-100 text-blue-700' },
  charity_pickup: { label: 'Charity Pickup', icon: <User className="h-3.5 w-3.5" />, className: 'bg-purple-100 text-purple-700' },
};

export const formDeliveryMethods: { value: DeliveryMethod; label: string; description: string }[] = [
  { value: 'driver_delivery', label: 'Driver Delivery', description: 'A volunteer driver will collect and deliver' },
  { value: 'charity_pickup', label: 'Charity Pickup', description: 'The charity will collect it themselves' },
];

// All 14 allergens mandated by UK Food Information Regulations 2014 (Natasha's Law)
export const allergenOptions = [
  'Celery',
  'Cereals containing gluten',
  'Crustaceans',
  'Eggs',
  'Fish',
  'Lupin',
  'Milk',
  'Molluscs',
  'Mustard',
  'Nuts',
  'Peanuts',
  'Sesame',
  'Soybeans',
  'Sulphur dioxide',
  'None',
];
