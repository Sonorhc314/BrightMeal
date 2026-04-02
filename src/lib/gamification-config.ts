import type { UserRole, DonationUnit } from '@/lib/types';

// ============================================================
// Badge Definitions
// ============================================================

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  roles: UserRole[];
}

export const badges: Record<string, BadgeDefinition> = {
  // Delivery count milestones (all roles)
  first_delivery: {
    id: 'first_delivery',
    name: 'First Steps',
    description: 'Complete your first successful donation',
    icon: '\u{1F331}',
    tier: 'bronze',
    roles: ['donor', 'charity', 'driver'],
  },
  deliveries_10: {
    id: 'deliveries_10',
    name: 'Making a Difference',
    description: 'Complete 10 successful donations',
    icon: '\u{2B50}',
    tier: 'silver',
    roles: ['donor', 'charity', 'driver'],
  },
  deliveries_25: {
    id: 'deliveries_25',
    name: 'Quarter Century',
    description: 'Complete 25 successful donations',
    icon: '\u{1F3C6}',
    tier: 'gold',
    roles: ['donor', 'charity', 'driver'],
  },
  deliveries_50: {
    id: 'deliveries_50',
    name: 'Half Century',
    description: 'Complete 50 successful donations',
    icon: '\u{1F48E}',
    tier: 'platinum',
    roles: ['donor', 'charity', 'driver'],
  },
  deliveries_100: {
    id: 'deliveries_100',
    name: 'Centurion',
    description: 'Complete 100 successful donations',
    icon: '\u{1F451}',
    tier: 'platinum',
    roles: ['donor', 'charity', 'driver'],
  },

  // Point milestones (all roles)
  points_50: {
    id: 'points_50',
    name: 'Getting Started',
    description: 'Earn 50 points',
    icon: '\u{1F525}',
    tier: 'bronze',
    roles: ['donor', 'charity', 'driver'],
  },
  points_100: {
    id: 'points_100',
    name: 'Point Hunter',
    description: 'Earn 100 points',
    icon: '\u{1F4AB}',
    tier: 'silver',
    roles: ['donor', 'charity', 'driver'],
  },
  points_500: {
    id: 'points_500',
    name: 'High Achiever',
    description: 'Earn 500 points',
    icon: '\u{1F31F}',
    tier: 'gold',
    roles: ['donor', 'charity', 'driver'],
  },
  points_1000: {
    id: 'points_1000',
    name: 'Legend',
    description: 'Earn 1,000 points',
    icon: '\u{1F3C5}',
    tier: 'platinum',
    roles: ['donor', 'charity', 'driver'],
  },

  // Kg impact milestones (donor/charity)
  kg_100: {
    id: 'kg_100',
    name: 'Waste Warrior',
    description: 'Save 100kg of food from waste',
    icon: '\u{267B}\u{FE0F}',
    tier: 'silver',
    roles: ['donor', 'charity'],
  },
  kg_500: {
    id: 'kg_500',
    name: 'Eco Champion',
    description: 'Save 500kg of food from waste',
    icon: '\u{1F30D}',
    tier: 'gold',
    roles: ['donor', 'charity'],
  },
  kg_1000: {
    id: 'kg_1000',
    name: 'Planet Saver',
    description: 'Save 1,000kg of food from waste',
    icon: '\u{1F30E}',
    tier: 'platinum',
    roles: ['donor', 'charity'],
  },

  // Streak / consistency badges (all roles)
  streak_2: {
    id: 'streak_2',
    name: 'On a Roll',
    description: 'Active 2 weeks in a row',
    icon: '\u{1F525}',
    tier: 'bronze',
    roles: ['donor', 'charity', 'driver'],
  },
  streak_4: {
    id: 'streak_4',
    name: 'Consistent',
    description: 'Active 4 weeks in a row',
    icon: '\u{26A1}',
    tier: 'silver',
    roles: ['donor', 'charity', 'driver'],
  },
  streak_8: {
    id: 'streak_8',
    name: 'Dedicated',
    description: 'Active 8 weeks in a row',
    icon: '\u{1F4AA}',
    tier: 'gold',
    roles: ['donor', 'charity', 'driver'],
  },
  streak_12: {
    id: 'streak_12',
    name: 'Unstoppable',
    description: 'Active 12 weeks in a row',
    icon: '\u{1F310}',
    tier: 'platinum',
    roles: ['donor', 'charity', 'driver'],
  },

  // Role-specific badges
  generous_donor: {
    id: 'generous_donor',
    name: 'Generous Donor',
    description: 'Successfully donate 5 times',
    icon: '\u{1F91D}',
    tier: 'silver',
    roles: ['donor'],
  },
  community_hero: {
    id: 'community_hero',
    name: 'Community Hero',
    description: 'Receive 5 donations for your community',
    icon: '\u{1F49C}',
    tier: 'silver',
    roles: ['charity'],
  },
  road_warrior: {
    id: 'road_warrior',
    name: 'Road Warrior',
    description: 'Complete 5 deliveries',
    icon: '\u{1F69A}',
    tier: 'silver',
    roles: ['driver'],
  },
};

export const tierColors: Record<string, { bg: string; border: string; text: string }> = {
  bronze: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
  silver: { bg: 'bg-slate-50', border: 'border-slate-300', text: 'text-slate-700' },
  gold: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700' },
  platinum: { bg: 'bg-violet-50', border: 'border-violet-300', text: 'text-violet-700' },
};

// ============================================================
// Impact Constants (WRAP UK data)
// ============================================================

export const IMPACT = {
  CO2E_PER_KG: 2.5,      // 1kg food waste = ~2.5kg CO2e
  MEALS_PER_KG: 2.5,     // 1kg food ~ 2.5 meals (1 meal ~ 0.4kg)
  KG_PER_PORTION: 0.4,
  KG_PER_PIECE: 0.3,
  KG_PER_CAN: 0.4,
} as const;

export function toKg(quantity: number, unit: DonationUnit): number {
  switch (unit) {
    case 'kg': return quantity;
    case 'portions': return quantity * IMPACT.KG_PER_PORTION;
    case 'pieces': return quantity * IMPACT.KG_PER_PIECE;
    case 'cans': return quantity * IMPACT.KG_PER_CAN;
  }
}

export function formatCO2e(totalKg: number): string {
  const co2 = totalKg * IMPACT.CO2E_PER_KG;
  if (co2 >= 1000) return `${(co2 / 1000).toFixed(1)}t`;
  return `${co2.toFixed(0)}kg`;
}

export function formatMeals(totalKg: number): string {
  const meals = totalKg * IMPACT.MEALS_PER_KG;
  if (meals >= 1000) return `${(meals / 1000).toFixed(1)}k`;
  return `${Math.round(meals)}`;
}

export function formatKg(totalKg: number): string {
  if (totalKg >= 1000) return `${(totalKg / 1000).toFixed(1)}t`;
  return `${totalKg.toFixed(0)}kg`;
}

// Get badges available for a specific role
export function getBadgesForRole(role: UserRole): BadgeDefinition[] {
  return Object.values(badges).filter((b) => b.roles.includes(role));
}

// Efficiency: points per donation (addresses fairness for small vs large donors)
export function formatEfficiency(totalPoints: number, totalDonations: number): string {
  if (totalDonations === 0) return '0';
  return (totalPoints / totalDonations).toFixed(1);
}
