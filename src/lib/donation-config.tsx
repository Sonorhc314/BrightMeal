import { Snowflake, Thermometer, Sun } from 'lucide-react';
import type { DonationStatus, DonationCategory } from '@/lib/types';

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

export const storageIcon: Record<string, React.ReactNode> = {
  frozen: <Snowflake className="h-3.5 w-3.5 text-blue-500" />,
  chilled: <Thermometer className="h-3.5 w-3.5 text-cyan-500" />,
  ambient: <Sun className="h-3.5 w-3.5 text-amber-500" />,
};

export const storageLabel: Record<string, string> = {
  frozen: 'Frozen',
  chilled: 'Chilled',
  ambient: 'Ambient',
};
