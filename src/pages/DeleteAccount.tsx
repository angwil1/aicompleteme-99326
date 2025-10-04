import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "sonner";

const DeleteAccount = () => {
  const [reason, setReason] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleDeleteRequest = async () => {
    setIsDeleting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to delete your account");
        navigate("/auth");
        return;
      }

      // Note: In production, you'd log this to a database or send to support email
      console.log("Deletion requested for user:", user.email, "Reason:", reason);

      // Sign out the user
      await supabase.auth.signOut();

      toast.success("Account deletion requested. You will receive confirmation via email within 24 hours.");
      navigate("/");
    } catch (error) {
      console.error("Error requesting deletion:", error);
      toast.error("Failed to submit deletion request. Please contact support.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Trash2 className="h-6 w-6 text-destructive" />
              Delete AI Complete Me Account
            </CardTitle>
            <CardDescription>
              Request permanent deletion of your account and associated data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This action cannot be undone. All your data will be permanently deleted.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">What will be deleted:</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Your profile information (name, bio, photos)</li>
                <li>All messages and conversations</li>
                <li>Match history and preferences</li>
                <li>Premium subscription data</li>
                <li>Location and activity data</li>
                <li>All user-generated content</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Data retention period:</h3>
              <p className="text-muted-foreground">
                Your account will be deactivated immediately. All personal data will be permanently deleted within 30 days. 
                Some data may be retained for legal compliance (transaction records) for up to 7 years as required by law.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Steps to delete your account:</h3>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Optionally, tell us why you're leaving (helps us improve)</li>
                <li>Click "Request Account Deletion" below</li>
                <li>You'll receive a confirmation email within 24 hours</li>
                <li>Your account will be deactivated immediately</li>
                <li>All data will be permanently deleted within 30 days</li>
              </ol>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Why are you deleting your account? (Optional)
              </label>
              <Textarea
                placeholder="Your feedback helps us improve AI Complete Me..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteRequest}
                disabled={isDeleting}
                className="flex-1"
              >
                {isDeleting ? "Processing..." : "Request Account Deletion"}
              </Button>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Need help? Contact us at{" "}
                <a href="mailto:aicompleteme@aicompleteme.com" className="text-primary hover:underline">
                  aicompleteme@aicompleteme.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeleteAccount;