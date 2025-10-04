import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Privacy = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2 mb-4 min-h-[44px] px-4 py-2 touch-target hover:bg-muted/50"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Privacy Policy</CardTitle>
            <p className="text-center text-muted-foreground">
              <strong>Effective Date:</strong> July 26, 2025 | <strong>Last Updated:</strong> July 26, 2025
            </p>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none space-y-6">
            <p>
              AI Complete Me ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use our services via www.aicompleteme.com (the "Site") and related platforms.
            </p>

            <section>
              <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
              <p className="font-semibold mb-2">We are transparent about every piece of data we collect:</p>
              
              <h3 className="font-semibold mt-4 mb-2">Data You Provide Directly:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Account Information:</strong> Email address (for login and communication), password (encrypted)</li>
                <li><strong>Profile Information:</strong> Name, age (calculated from date of birth), location (city/zip code), gender, sexual orientation, interests, bio</li>
                <li><strong>Photos:</strong> Profile pictures you choose to upload</li>
                <li><strong>Personality Quiz:</strong> Your answers to compatibility questions (optional)</li>
                <li><strong>Messages:</strong> Conversations with matches</li>
                <li><strong>Preferences:</strong> Search filters, notification settings, privacy settings</li>
              </ul>
              
              <h3 className="font-semibold mt-4 mb-2">Data Collected Automatically:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Usage Data:</strong> Features you use, time spent on app, interactions with profiles</li>
                <li><strong>Device Information:</strong> Device type, operating system, unique device identifiers</li>
                <li><strong>Location Data:</strong> Approximate location for matching (with your permission)</li>
                <li><strong>Technical Data:</strong> IP address, browser type, crash reports for debugging</li>
              </ul>
              
              <h3 className="font-semibold mt-4 mb-2">We Do NOT Collect:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>❌ Social Security Numbers or government IDs</li>
                <li>❌ Financial information (handled securely by payment processor)</li>
                <li>❌ Health information beyond what you choose to share</li>
                <li>❌ Precise location without explicit permission</li>
                <li>❌ Contacts from your phone</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
              <p className="mb-3">We only use your data for these specific purposes:</p>
              
              <h3 className="font-semibold mt-4 mb-2">Core Service Functionality:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>To create and manage your account</li>
                <li>To generate AI-powered matches based on compatibility</li>
                <li>To facilitate communication with your matches</li>
                <li>To display your profile to potential matches (based on your privacy settings)</li>
              </ul>
              
              <h3 className="font-semibold mt-4 mb-2">Service Improvement:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>To improve matching algorithms and user experience</li>
                <li>To detect and prevent fraud, abuse, and spam</li>
                <li>To provide customer support and respond to your inquiries</li>
                <li>To analyze usage patterns and app performance</li>
              </ul>
              
              <h3 className="font-semibold mt-4 mb-2">Legal & Safety:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>To enforce our Terms of Service and Community Guidelines</li>
                <li>To comply with legal obligations and law enforcement requests</li>
                <li>To protect the rights, property, and safety of our users</li>
              </ul>
              
              <p className="mt-4 font-semibold text-primary">
                ✓ We do NOT sell your data to third parties<br/>
                ✓ We do NOT use your data for advertising outside our app<br/>
                ✓ We do NOT share your personal information without your consent (except as required by law)
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. AI and Matchmaking</h2>
              <p>
                Our AI insights (Emotional Forecast, Connection DNA) are powered by OpenAI and internal algorithms. You control what inputs are used for matching, and can opt out of premium-only digests or features at any time.
              </p>
              <p>
                Your inputs may be temporarily processed by external services (OpenAI API) for compatibility scoring. No data is used for training external models.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Your Privacy Rights & Controls</h2>
              <p className="mb-3">You have complete control over your data:</p>
              
              <h3 className="font-semibold mt-4 mb-2">Access & Control:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>View Your Data:</strong> Access all information we have about you</li>
                <li><strong>Update Profile:</strong> Edit or delete your profile information anytime</li>
                <li><strong>Privacy Settings:</strong> Control who can see your profile and contact you</li>
                <li><strong>Block Users:</strong> Prevent specific users from contacting you or seeing your profile</li>
                <li><strong>Report Concerns:</strong> Flag inappropriate behavior or content</li>
              </ul>
              
              <h3 className="font-semibold mt-4 mb-2">Data Rights:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Export Data:</strong> Download a copy of all your data (email aicompleteme@aicompleteme.com)</li>
                <li><strong>Delete Account:</strong> Permanently delete your account and all associated data</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing emails (premium features only)</li>
                <li><strong>Withdraw Consent:</strong> Change permission for location or other data collection</li>
              </ul>
              
              <h3 className="font-semibold mt-4 mb-2">Communication Preferences:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Control push notifications (matches, messages, likes)</li>
                <li>Manage email preferences (important updates vs. optional newsletters)</li>
                <li>Choose privacy level (public, private, or incognito mode)</li>
              </ul>
              
              <p className="mt-4">
                <strong>How to exercise your rights:</strong> Contact us at aicompleteme@aicompleteme.com with your request. We'll respond within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Security Practices</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Hosted on secure Supabase infrastructure with RLS policies</li>
                <li>All secrets, keys, and match logic are protected using least privilege access</li>
                <li>Stripe billing and subscription data is managed securely via encrypted tokens</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Changes to This Policy</h2>
              <p>
                We may update this policy to reflect evolving laws or feature changes. We'll notify users through in-app alerts or homepage banners if changes are significant.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Data Sharing for App Store Compliance</h2>
              <p>
                For Google Play Store billing and subscription management, we may share minimal necessary data with Google:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>User ID and subscription status for billing verification</li>
                <li>Purchase confirmation data required by Google Play Store policies</li>
                <li>Anonymous usage analytics to improve app store recommendations (optional)</li>
              </ul>
              <p>
                This data sharing is limited to what's required for app store functionality and billing. No personal dating or profile information is shared with Google or other third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Contact Us</h2>
              <p>
                For questions or privacy requests:<br />
                Email: aicompleteme@aicompleteme.com<br />
                🌐 www.aicompleteme.com/privacy
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;