'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Camera, MapPin, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';

export default function PermissionsPage() {
  const [notifications, setNotifications] = useState(true);
  const [camera, setCamera] = useState(false);
  const [location, setLocation] = useState(true);
  const router = useRouter();

  return (
    <div className="flex min-h-dvh flex-col bg-background px-6 pb-8 pt-4">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Permissions</h1>
        <p className="mt-1 text-muted-foreground">
          Manage app permissions to get the best experience
        </p>
      </div>

      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between rounded-2xl border border-border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-green-light">
              <Bell className="h-5 w-5 text-brand-green" />
            </div>
            <div>
              <p className="font-medium text-foreground">Notifications</p>
              <p className="text-sm text-muted-foreground">Get alerts for new offers & updates</p>
            </div>
          </div>
          <Switch checked={notifications} onCheckedChange={setNotifications} />
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-purple-light">
              <Camera className="h-5 w-5 text-brand-purple" />
            </div>
            <div>
              <p className="font-medium text-foreground">Camera</p>
              <p className="text-sm text-muted-foreground">Take photos of food donations</p>
            </div>
          </div>
          <Switch checked={camera} onCheckedChange={setCamera} />
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-foreground">Location</p>
              <p className="text-sm text-muted-foreground">Find nearby pickup locations</p>
            </div>
          </div>
          <Switch checked={location} onCheckedChange={setLocation} />
        </div>
      </div>

      <Button
        onClick={() => router.back()}
        className="mt-8 h-12 w-full rounded-xl bg-brand-green text-base font-semibold hover:bg-brand-green/90"
      >
        Continue
      </Button>
    </div>
  );
}
