import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Shield, Info } from 'lucide-react';

interface DataCollectionConsentProps {
  isOpen: boolean;
  onConsent: (permissions: ConsentPermissions) => void;
  onDecline: () => void;
}

export interface ConsentPermissions {
  essential: boolean; // Always true, required for app
  analytics: boolean;
  personalization: boolean;
  notifications: boolean;
  location: boolean;
}

export const DataCollectionConsent = ({ isOpen, onConsent, onDecline }: DataCollectionConsentProps) => {
  const [permissions, setPermissions] = useState<ConsentPermissions>({
    essential: true,
    analytics: false,
    personalization: true,
    notifications: true,
    location: false,
  });

  const handleToggle = (key: keyof ConsentPermissions) => {
    if (key === 'essential') return; // Can't toggle essential
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAcceptAll = () => {
    onConsent({
      essential: true,
      analytics: true,
      personalization: true,
      notifications: true,
      location: true,
    });
  };

  const handleAcceptSelected = () => {
    onConsent(permissions);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-primary" />
            <DialogTitle className="text-2xl">Your Privacy Matters</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            We're committed to transparency. Choose what data you're comfortable sharing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Essential Data */}
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start gap-3">
              <Checkbox
                id="essential"
                checked={permissions.essential}
                disabled
                className="mt-1"
              />
              <div className="flex-1">
                <Label htmlFor="essential" className="text-base font-semibold cursor-pointer">
                  Essential Data (Required)
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Account info, profile data, and messages. Required for the app to function.
                </p>
                <div className="text-xs text-muted-foreground mt-2 space-y-1">
                  <div>• Email address (for login)</div>
                  <div>• Profile information (name, age, photos)</div>
                  <div>• Messages with matches</div>
                  <div>• Basic security data</div>
                </div>
              </div>
            </div>
          </div>

          {/* Personalization */}
          <div className="space-y-3 p-4 border rounded-lg hover:border-primary/50 transition-colors">
            <div className="flex items-start gap-3">
              <Checkbox
                id="personalization"
                checked={permissions.personalization}
                onCheckedChange={() => handleToggle('personalization')}
                className="mt-1"
              />
              <div className="flex-1">
                <Label htmlFor="personalization" className="text-base font-semibold cursor-pointer">
                  Personalization & Matching
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Helps us create better matches and personalize your experience with AI.
                </p>
                <div className="text-xs text-muted-foreground mt-2 space-y-1">
                  <div>• Personality quiz answers</div>
                  <div>• Interaction patterns (likes, messages)</div>
                  <div>• Match preferences and filters</div>
                  <div>• AI-powered compatibility analysis</div>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics */}
          <div className="space-y-3 p-4 border rounded-lg hover:border-primary/50 transition-colors">
            <div className="flex items-start gap-3">
              <Checkbox
                id="analytics"
                checked={permissions.analytics}
                onCheckedChange={() => handleToggle('analytics')}
                className="mt-1"
              />
              <div className="flex-1">
                <Label htmlFor="analytics" className="text-base font-semibold cursor-pointer">
                  Usage Analytics
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Anonymous data to help us improve the app. Never sold to third parties.
                </p>
                <div className="text-xs text-muted-foreground mt-2 space-y-1">
                  <div>• App usage statistics (anonymous)</div>
                  <div>• Feature engagement metrics</div>
                  <div>• Performance and crash reports</div>
                  <div>• User feedback responses</div>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-3 p-4 border rounded-lg hover:border-primary/50 transition-colors">
            <div className="flex items-start gap-3">
              <Checkbox
                id="notifications"
                checked={permissions.notifications}
                onCheckedChange={() => handleToggle('notifications')}
                className="mt-1"
              />
              <div className="flex-1">
                <Label htmlFor="notifications" className="text-base font-semibold cursor-pointer">
                  Push Notifications
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Get notified about new matches, messages, and important updates.
                </p>
                <div className="text-xs text-muted-foreground mt-2 space-y-1">
                  <div>• New match alerts</div>
                  <div>• Message notifications</div>
                  <div>• Like notifications</div>
                  <div>• Important account updates</div>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-3 p-4 border rounded-lg hover:border-primary/50 transition-colors">
            <div className="flex items-start gap-3">
              <Checkbox
                id="location"
                checked={permissions.location}
                onCheckedChange={() => handleToggle('location')}
                className="mt-1"
              />
              <div className="flex-1">
                <Label htmlFor="location" className="text-base font-semibold cursor-pointer">
                  Location Data
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Show matches near you. Only approximate location is used (city-level).
                </p>
                <div className="text-xs text-muted-foreground mt-2 space-y-1">
                  <div>• Approximate location (city/region)</div>
                  <div>• Distance to potential matches</div>
                  <div>• Local events and recommendations</div>
                  <div>• Not tracked when app is closed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-semibold mb-1">Your data, your choice</p>
                <p>
                  You can change these preferences anytime in your account settings. 
                  We never sell your personal information, and we're transparent about 
                  how we use your data.
                </p>
                <a 
                  href="/privacy" 
                  target="_blank"
                  className="underline font-medium hover:text-blue-600 dark:hover:text-blue-300 mt-2 inline-block"
                >
                  Read our full Privacy Policy →
                </a>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={onDecline}
            className="w-full sm:w-auto"
          >
            Decline All (Essential Only)
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleAcceptSelected}
            className="w-full sm:w-auto"
          >
            Accept Selected
          </Button>
          <Button 
            onClick={handleAcceptAll}
            className="w-full sm:w-auto"
          >
            Accept All
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
