import Link from 'next/link';
import {
  ArrowLeft,
  ShieldCheck,
  Thermometer,
  AlertTriangle,
  Package,
  Heart,
  Snowflake,
} from 'lucide-react';

export default function FoodSafetyPage() {
  return (
    <div className="max-w-5xl mx-auto px-5 pt-4 pb-8 lg:px-8 lg:pt-8">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <Link
          href="/jobs"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-full bg-brand-green-light">
            <ShieldCheck className="h-5 w-5 lg:h-6 lg:w-6 text-brand-green" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Food Safety Guidelines
            </h1>
            <p className="text-sm text-muted-foreground">
              Essential guidance for volunteer drivers
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 lg:space-y-5">
        {/* General Food Handling */}
        <div className="rounded-2xl border border-border bg-white p-5 lg:p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-green-light">
              <Package className="h-5 w-5 text-brand-green" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              General Food Handling
            </h2>
          </div>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
              Always wash hands before and after handling food
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
              Use clean, food-safe containers for transport
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
              Never mix raw and cooked foods
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
              Check all items against the donation details before collection
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
              Report any discrepancies to the donor immediately
            </li>
          </ul>
        </div>

        {/* Temperature Control */}
        <div className="rounded-2xl border border-border bg-white p-5 lg:p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100">
              <Thermometer className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              Temperature Control
            </h2>
          </div>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
              <span>
                <strong className="text-foreground">Chilled items (0-5°C):</strong>{' '}
                Must be delivered within 2 hours of collection
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
              <span>
                <strong className="text-foreground">
                  Frozen items (-18°C or below):
                </strong>{' '}
                Must remain frozen during transport — use insulated bags
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
              <span>
                <strong className="text-foreground">Ambient items:</strong> Keep
                dry and protected from contamination
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
              Never leave temperature-sensitive food unattended in a warm vehicle
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
              <span>
                <strong className="text-foreground">The two-hour rule:</strong>{' '}
                Food left at room temperature for more than 2 hours must not be
                redistributed
              </span>
            </li>
          </ul>
        </div>

        {/* Allergen Awareness */}
        <div className="rounded-2xl border border-border bg-white p-5 lg:p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              Allergen Awareness
            </h2>
          </div>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
              Every donation on BrightMeal includes allergen information
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
              Do not open or modify sealed packaging
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
              Ensure allergen labels remain visible and intact during transport
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
              If packaging is damaged and allergen labels are compromised, report
              the issue immediately
            </li>
          </ul>
          <div className="mt-4 rounded-xl bg-amber-50 p-3.5">
            <p className="mb-2 text-xs font-semibold text-amber-800">
              The 14 Major Allergens (UK Law)
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[
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
              ].map((allergen) => (
                <span
                  key={allergen}
                  className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-amber-800 border border-amber-200"
                >
                  {allergen}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Safe Lifting & Manual Handling */}
        <div className="rounded-2xl border border-border bg-white p-5 lg:p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100">
              <Heart className="h-5 w-5 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              Safe Lifting & Manual Handling
            </h2>
          </div>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-600" />
              Assess the weight before lifting — ask for help if items are heavy
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-600" />
              Bend at the knees, not the waist
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-600" />
              Keep loads close to your body
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-600" />
              Use trolleys or carts for multiple or heavy items
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-600" />
              Report any injury immediately
            </li>
          </ul>
        </div>

        {/* What To Do If Something Goes Wrong */}
        <div className="rounded-2xl border border-border bg-white p-5 lg:p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100">
              <Snowflake className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              What To Do If Something Goes Wrong
            </h2>
          </div>
          <div className="space-y-3">
            <div className="rounded-xl bg-red-50 p-3.5">
              <p className="text-sm font-medium text-red-900">
                Food looks or smells unsafe
              </p>
              <p className="mt-0.5 text-sm text-red-700">
                Do NOT deliver. Report the issue in the app.
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3.5">
              <p className="text-sm font-medium text-amber-900">
                Packaging is damaged
              </p>
              <p className="mt-0.5 text-sm text-amber-700">
                Check if contents are compromised. Report if in doubt.
              </p>
            </div>
            <div className="rounded-xl bg-blue-50 p-3.5">
              <p className="text-sm font-medium text-blue-900">
                Vehicle breakdown
              </p>
              <p className="mt-0.5 text-sm text-blue-700">
                Contact the charity and donor. Keep food in insulated storage.
              </p>
            </div>
            <div className="rounded-xl bg-purple-50 p-3.5">
              <p className="text-sm font-medium text-purple-900">
                Accident or injury
              </p>
              <p className="mt-0.5 text-sm text-purple-700">
                Ensure personal safety first. Report the incident.
              </p>
            </div>
            <div className="rounded-xl bg-cyan-50 p-3.5">
              <p className="text-sm font-medium text-cyan-900">
                Temperature concern
              </p>
              <p className="mt-0.5 text-sm text-cyan-700">
                If chilled/frozen items have been out of temperature for too
                long, do not deliver.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
