import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Copy, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const InviteKindredSoul = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const defaultMessage = "I found this quiet space for meaningful connections. Thought you might appreciate it too.";
  
  // Generate referral link with user ID if available
  const shareLink = user 
    ? `${window.location.origin}?ref=${user.id}`
    : window.location.origin;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Share this link via text, social media, or anywhere you like",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying link:", error);
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const handleInvite = async () => {
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter an email address to send the invitation.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase.functions.invoke('send-invite-email', {
        body: {
          recipientEmail: email.trim(),
          personalMessage: message.trim() || undefined,
        }
      });

      if (error) throw error;
      
      toast({
        title: "Quiet invite sent",
        description: `Your invitation has been sent to ${email}`,
      });
      
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Error sending invite:", error);
      toast({
        title: "Failed to send quiet invite",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-secondary/5 shadow-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50 pointer-events-none"></div>
      
      <CardHeader className="relative z-10 text-center pb-4">
        <div className="flex justify-center mb-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <span className="text-4xl">💌</span>
          </div>
        </div>
        <CardTitle className="text-2xl font-serif">
          Send a Quiet Invite
        </CardTitle>
        <p className="text-muted-foreground text-sm mt-2">
          Share this quiet space with someone who values authentic connections
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4 relative z-10">
        {/* Share Link Section */}
        <div className="space-y-3 pb-4 border-b border-border/50">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Quick Share
            </label>
            <p className="text-xs text-muted-foreground">
              Copy and share this link via text, social media, or anywhere
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              readOnly
              value={shareLink}
              className="bg-background/80 backdrop-blur-sm text-sm"
            />
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Email Invite Section */}
        <div className="space-y-3 pt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Or Send via Email
            </label>
          </div>
          
          <div className="space-y-2">
            <Input
              id="invite-email"
              type="email"
              placeholder="friend@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background/80 backdrop-blur-sm"
            />
          </div>
          
          <div className="space-y-2">
            <textarea
              id="invite-message"
              placeholder={defaultMessage}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full min-h-[100px] p-3 text-sm border border-input bg-background/80 backdrop-blur-sm rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
            />
          </div>
          
          <Button 
            onClick={handleInvite}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-md hover:shadow-lg transition-all duration-300 text-lg py-6"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                Sending...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>✨</span>
                Send Email Invite
              </span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};