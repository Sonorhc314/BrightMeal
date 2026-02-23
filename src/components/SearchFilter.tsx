'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DonationCard } from '@/components/DonationCard';
import type { Donation, DonationCategory } from '@/lib/types';

const categoryOptions: { value: DonationCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'cooked_meals', label: 'Cooked Meals' },
  { value: 'fresh_produce', label: 'Fresh Produce' },
  { value: 'bakery', label: 'Bakery' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'other', label: 'Other' },
];

interface SearchFilterProps {
  donations: Donation[];
  hrefPrefix: string;
  showDonor?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  gridClassName?: string;
}

export function SearchFilter({
  donations,
  hrefPrefix,
  showDonor,
  emptyMessage = 'No donations found',
  emptyIcon,
  gridClassName = 'grid gap-3 lg:grid-cols-2 lg:gap-4',
}: SearchFilterProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<DonationCategory | 'all'>('all');

  const filtered = useMemo(() => {
    return donations.filter((d) => {
      const matchesSearch = !search || d.item_name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || d.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [donations, search, categoryFilter]);

  return (
    <div>
      {/* Search bar */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by item name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 rounded-xl bg-white pl-9 shadow-sm"
        />
      </div>

      {/* Category pills */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {categoryOptions.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategoryFilter(c.value)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-all active:scale-[0.96] ${
              categoryFilter === c.value
                ? 'border-brand-green bg-brand-green-light text-brand-green'
                : 'border-border bg-white text-muted-foreground hover:border-border/80'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length > 0 ? (
        <div className={gridClassName}>
          {filtered.map((donation) => (
            <DonationCard
              key={donation.id}
              donation={donation}
              href={`${hrefPrefix}/${donation.id}`}
              showDonor={showDonor}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-white/50 p-8 text-center">
          {emptyIcon}
          <p className="font-medium text-muted-foreground">
            {search || categoryFilter !== 'all' ? 'No matching donations' : emptyMessage}
          </p>
          {(search || categoryFilter !== 'all') && (
            <p className="mt-1 text-sm text-muted-foreground/70">
              Try adjusting your search or filters
            </p>
          )}
        </div>
      )}
    </div>
  );
}
