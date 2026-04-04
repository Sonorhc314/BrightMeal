import Link from 'next/link';
import {
  ArrowLeft,
  Heart,
  ClipboardCheck,
  ShieldCheck,
  Package,
  Truck,
  AlertTriangle,
  Scale,
} from 'lucide-react';

export default function OnboardingPage() {
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
          <div className="flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-full bg-blue-100">
            <Truck className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Driver Onboarding
            </h1>
            <p className="text-sm text-muted-foreground">
              Everything you need to know before your first delivery
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 lg:space-y-5">
        {/* Welcome to BrightMeal */}
        <div className="rounded-2xl border border-border bg-white p-5 lg:p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100">
              <Heart className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              Welcome to BrightMeal
            </h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            As a volunteer driver, you play a vital role in connecting surplus
            food with the charities that need it. This guide covers everything
            you need to know before your first delivery.
          </p>
        </div>

        {/* Before You Start — Requirements */}
        <div className="rounded-2xl border border-border bg-white p-5 lg:p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100">
              <ClipboardCheck className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              Before You Start &mdash; Requirements
            </h2>
          </div>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
              A valid UK driving licence
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
              Vehicle with appropriate insurance (must cover charity deliveries
              &mdash; check with your insurer)
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
              A smartphone with the BrightMeal app
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
              Insulated bags for chilled/frozen deliveries (recommended)
            </li>
          </ul>
        </div>

        {/* Food Safety Basics */}
        <div className="rounded-2xl border border-border bg-white p-5 lg:p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              Food Safety Basics
            </h2>
          </div>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
              Always check donation details before collecting
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
              Verify allergen labels are intact and match the listing
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
              Use clean, food-grade containers
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
              Follow the two-hour rule for temperature-sensitive items
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
              Never taste or open sealed food items
            </li>
          </ul>
          <div className="mt-4">
            <Link
              href="/food-safety"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Read our full Food Safety Guidelines &rarr;
            </Link>
          </div>
        </div>

        {/* Safe Manual Handling */}
        <div className="rounded-2xl border border-border bg-white p-5 lg:p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              Safe Manual Handling
            </h2>
          </div>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
              Assess the weight before lifting
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
              Bend at the knees, keep your back straight
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
              Keep the load close to your body
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
              Use a trolley for heavy or multiple items
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
              Never rush &mdash; take multiple trips if needed
            </li>
          </ul>
        </div>

        {/* During a Delivery */}
        <div className="rounded-2xl border border-border bg-white p-5 lg:p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100">
              <Truck className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              During a Delivery
            </h2>
          </div>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
              Follow the suggested route but you are not required to
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
              Keep temperature-sensitive items in insulated storage
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
              Contact the charity if you expect to be late
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
              Verify the recipient before handing over food
            </li>
          </ul>
        </div>

        {/* If Something Goes Wrong */}
        <div className="rounded-2xl border border-border bg-white p-5 lg:p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              If Something Goes Wrong
            </h2>
          </div>
          <div className="space-y-3">
            <div className="rounded-xl bg-red-50 p-3.5">
              <p className="text-sm font-medium text-red-900">Unsafe food</p>
              <p className="mt-0.5 text-sm text-red-700">
                Do not deliver. Report the issue in the app.
              </p>
            </div>
            <div className="rounded-xl bg-blue-50 p-3.5">
              <p className="text-sm font-medium text-blue-900">
                Vehicle breakdown
              </p>
              <p className="mt-0.5 text-sm text-blue-700">
                Notify the charity and donor. Keep food stored safely.
              </p>
            </div>
            <div className="rounded-xl bg-purple-50 p-3.5">
              <p className="text-sm font-medium text-purple-900">
                Accident or injury
              </p>
              <p className="mt-0.5 text-sm text-purple-700">
                Ensure your safety first. Report the incident.
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3.5">
              <p className="text-sm font-medium text-amber-900">
                Damaged packaging
              </p>
              <p className="mt-0.5 text-sm text-amber-700">
                Assess if contents are safe. Report if in doubt.
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            All incidents must be reported &mdash; BrightMeal maintains an
            incident log as required by law.
          </p>
        </div>

        {/* Your Rights as a Volunteer */}
        <div className="rounded-2xl border border-border bg-white p-5 lg:p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100">
              <Scale className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              Your Rights as a Volunteer
            </h2>
          </div>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
              You are never obligated to accept any job
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
              You can decline any delivery at any time without penalty
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
              You will only receive genuine expense reimbursement
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
              BrightMeal does not control how you complete deliveries
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
              Your volunteering relationship is not a contract of employment
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
