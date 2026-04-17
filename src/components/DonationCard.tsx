import Link from 'next/link';
import { Clock, MapPin, Package, ArrowRight, Thermometer, Snowflake, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { statusConfig, driverStatusConfig, categoryConfig, storageIcon } from '@/lib/donation-config';
import type { Donation } from '@/lib/types';

interface DonationCardProps {
  donation: Donation;
  href: string;
  showDonor?: boolean;
  useDriverLabels?: boolean;
}

export function DonationCard({ donation, href, showDonor, useDriverLabels }: DonationCardProps) {
  const statusCfg = useDriverLabels ? driverStatusConfig : statusConfig;
  const status = statusCfg[donation.status];
  const category = categoryConfig[donation.category] || categoryConfig.other;
  const pickupTime = new Date(donation.pickup_window_start);
  const timeStr = pickupTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const dateStr = pickupTime.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  // Urgency: if pickup window is within 2 hours
  const hoursUntilPickup = (pickupTime.getTime() - Date.now()) / 3600_000;
  const isUrgent = hoursUntilPickup > 0 && hoursUntilPickup < 2 && donation.status === 'posted';

  return (
    <Link href={href}>
      <div className="group relative overflow-hidden rounded-2xl border border-border bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-brand-green/20 active:scale-[0.98]">
        {/* Hover gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-green/[0.02] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative">
          {donation.storage === 'chilled' && (
            <div className="mb-3 flex items-center gap-2 rounded-xl bg-cyan-50 border border-cyan-200 px-3 py-2">
              <Thermometer className="h-4 w-4 shrink-0 text-cyan-600" />
              <p className="text-xs font-medium text-cyan-700">Keep Chilled — deliver within pickup window</p>
            </div>
          )}
          {donation.storage === 'frozen' && (
            <div className="mb-3 flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-200 px-3 py-2">
              <Snowflake className="h-4 w-4 shrink-0 text-blue-600" />
              <p className="text-xs font-medium text-blue-700">Frozen — maintain cold chain during transport</p>
            </div>
          )}

          <div className="mb-3 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{donation.item_name}</h3>
              {showDonor && donation.donor && (
                <p className="text-sm text-muted-foreground">
                  {donation.donor.name}
                  {donation.donor.food_hygiene_rating != null && (
                    <span
                      title="FSA Food Hygiene Rating"
                      className={`ml-1.5 inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                        donation.donor.food_hygiene_rating >= 4 ? 'bg-green-100 text-green-700' :
                        donation.donor.food_hygiene_rating === 3 ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}
                    >
                      FSA {'\u2605'}{donation.donor.food_hygiene_rating}/5
                    </span>
                  )}
                </p>
              )}
            </div>
            <Badge variant="outline" className={`shrink-0 ${status.className}`}>
              {status.label}
            </Badge>
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium ${category.color}`}>
              {category.label}
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
              <Package className="h-3 w-3" />
              {donation.quantity} {donation.unit}
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-secondary px-2 py-1">
              {storageIcon[donation.storage]}
            </span>
            {donation.delivery_method === 'charity_pickup' && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700">
                <User className="h-3 w-3" />
                Self-collect
              </span>
            )}
            {isUrgent && (
              <span className="inline-flex items-center rounded-lg bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                Urgent
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {dateStr}, {timeStr}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {donation.pickup_location.length > 20
                  ? donation.pickup_location.slice(0, 20) + '...'
                  : donation.pickup_location}
              </span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground/50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand-green" />
          </div>
        </div>
      </div>
    </Link>
  );
}
