import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { SignupFlow } from '@/components/SignupFlow';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, UserPlus, LogIn, Smartphone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import logoImage from "@/assets/logo-transparent-new.png";

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignupFlow, setShowSignupFlow] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Simplified auth redirect for mobile compatibility
  useEffect(() => {
    // Don't redirect if we're on a password reset flow
    const urlParams = new URLSearchParams(window.location.search);
    const isPasswordReset = urlParams.get('type') === 'recovery';
    const redirectPath = urlParams.get('redirect');
    
    if (user && !showSignupFlow && !isPasswordReset) {
      // If there's a redirect parameter, go there, otherwise go to home
      const targetPath = redirectPath === 'browse' ? '/browse' : '/';
      navigate(targetPath);
    }
  }, [user, navigate, showSignupFlow]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (!error) {
      // Navigation will be handled by the useEffect hook that checks profile completion
    }
    
    setIsLoading(false);
  };

  const handleStartSignup = () => {
    setShowSignupFlow(true);
  };

  const handleSignupComplete = () => {
    setShowSignupFlow(false);
    // After signup, go directly to questions/quiz
    navigate('/questions');
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to reset your password.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Use the exact current domain with the reset path
    const resetUrl = `${window.location.protocol}//${window.location.host}/reset-password`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: resetUrl
    });

    if (error) {
      toast({
        title: "Reset Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Reset Email Sent",
        description: "Check your email for password reset instructions.",
      });
      setShowForgotPassword(false);
    }
    
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
    
    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const handleAppleSignIn = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
    
    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const handlePhoneSignIn = () => {
    toast({
      title: "Coming Soon",
      description: "Phone authentication will be available shortly. Please use email for now.",
    });
  };

  if (showSignupFlow) {
    return (
      <div className="min-h-screen bg-background">
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
        >
          Skip to main content
        </a>
        
        <Navbar />
        
        {/* Header with Back Button */}
        <header className="bg-card border-b" role="banner">
          <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Go back to homepage"
            >
              <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
              Back to Home
            </Button>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowSignupFlow(false)}
                className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Cancel signup and return to sign in"
              >
                <LogIn className="h-4 w-4 mr-1" aria-hidden="true" />
                Sign In Instead
              </Button>
            </div>
          </div>
        </header>
        
        <main id="main-content" className="flex flex-col items-center justify-center p-4 pt-20">
          <SignupFlow onComplete={handleSignupComplete} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>
      
      <Navbar />
      
      {/* Header with Back Button */}
      <header className="bg-card border-b" role="banner">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Go back to homepage"
          >
            <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
            Back to Home
          </Button>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/faq')}
              className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="View frequently asked questions"
            >
              Help & FAQ
            </Button>
          </div>
        </div>
      </header>
      <main 
        id="main-content" 
        className="flex flex-col items-center justify-center p-4 pt-20"
        role="main"
        aria-labelledby="auth-heading"
      >
        <h1 id="auth-heading" className="sr-only">Authentication</h1>
        
        {/* Top Sign In Area */}
        <section className="w-full max-w-md mb-6" aria-labelledby="signin-section">
          <h2 id="signin-section" className="sr-only">Sign In to Existing Account</h2>
          
          {!showSignIn ? (
            <Button 
              onClick={() => setShowSignIn(true)}
              variant="outline" 
              className="w-full h-14 text-xl font-bold focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-describedby="signin-description"
            >
              Already have an account? Sign In
            </Button>
          ) : showForgotPassword ? (
            <Card role="form" aria-labelledby="forgot-password-title">
              <CardHeader className="pb-4">
                <CardTitle id="forgot-password-title" className="text-lg">Reset Password</CardTitle>
                <CardDescription>Enter your email to receive reset instructions</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="forgot-email">Email Address</Label>
                    <Input
                      id="forgot-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      autoComplete="email"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      type="submit" 
                      className="flex-1 focus:ring-2 focus:ring-primary focus:ring-offset-2" 
                      disabled={isLoading}
                    >
                      {isLoading ? 'Sending...' : 'Send Reset Email'}
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setShowForgotPassword(false)}
                      className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      Back
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card role="form" aria-labelledby="signin-card-title">
              <CardHeader className="pb-4">
                <CardTitle id="signin-card-title" className="text-lg">Welcome Back</CardTitle>
                <CardDescription>Choose your preferred sign-in method</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Primary OAuth Options */}
                  <div className="space-y-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePhoneSignIn}
                      disabled={isLoading}
                      className="w-full h-12 justify-start text-base font-medium"
                    >
                      <Smartphone className="h-5 w-5 mr-3" />
                      Continue with Phone Number
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGoogleSignIn}
                      disabled={isLoading}
                      className="w-full h-12 justify-start text-base font-medium"
                    >
                      <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAppleSignIn}
                      disabled={isLoading}
                      className="w-full h-12 justify-start text-base font-medium"
                    >
                      <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                      </svg>
                      Continue with Apple
                    </Button>
                  </div>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">or sign in with email</span>
                    </div>
                  </div>

                  {/* Email Form */}
                  <form onSubmit={handleSignIn} className="space-y-4" noValidate>
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email Address</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        aria-describedby="signin-email-error"
                        className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        autoComplete="email"
                      />
                      <div id="signin-email-error" className="sr-only" aria-live="polite">
                        {/* Error messages would go here */}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="Your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        aria-describedby="signin-password-error"
                        className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        autoComplete="current-password"
                      />
                       <div id="signin-password-error" className="sr-only" aria-live="polite">
                        {/* Error messages would go here */}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        type="submit" 
                        className="flex-1 focus:ring-2 focus:ring-primary focus:ring-offset-2" 
                        disabled={isLoading}
                        aria-describedby="signin-status"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        {isLoading ? 'Signing in...' : 'Sign In with Email'}
                      </Button>
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setShowSignIn(false)}
                        className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        aria-label="Cancel sign in"
                      >
                        Cancel
                      </Button>
                    </div>
                     <div id="signin-status" className="sr-only" aria-live="polite">
                       {isLoading ? 'Processing sign in...' : ''}
                     </div>
                     
                     <div className="text-center">
                       <Button 
                         type="button"
                         variant="link"
                         onClick={() => setShowForgotPassword(true)}
                         className="text-sm"
                       >
                         Forgot Password?
                       </Button>
                     </div>
                  </form>
                </div>
              </CardContent>
            </Card>
          )}
          <p id="signin-description" className="sr-only">
            Sign in to access your existing AI Complete Me account and continue your journey to meaningful connections.
          </p>
        </section>
        
        <section className="w-full max-w-md" aria-labelledby="signup-section">
          <Card role="form" aria-labelledby="signup-card-title">
            <CardHeader className="text-center">
              <CardTitle id="signup-card-title" className="text-2xl font-bold">Join AI Complete Me</CardTitle>
              <CardDescription>Create your account and find meaningful connections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="quiet-start-card rounded-2xl p-6 text-center space-y-4"
                  role="region"
                  aria-labelledby="offer-title"
                >
                  {/* Centered Logo */}
                  <div className="flex justify-center mb-4">
                    <img 
                      src={logoImage} 
                      alt="AI Complete Me" 
                      className="h-12 w-12 md:h-16 md:w-16 opacity-90"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 id="offer-title" className="text-xl md:text-2xl font-light text-amber-900 keepsake-heading">
                      Begin quietly. Connect deeply.
                    </h3>
                    <div className="flex items-center justify-center gap-2 text-amber-800/80">
                      <span className="heart-accent">♡</span>
                      <span className="keepsake-heading italic">Founding hearts receive 60 days free</span>
                      <span className="heart-accent">♡</span>
                    </div>
                  </div>
                  <p className="text-sm text-amber-800/70 keepsake-heading">
                    Join the founding members:
                  </p>
                  <ul className="space-y-2 text-sm text-amber-800/80 keepsake-heading" role="list">
                    <li className="flex items-center justify-center gap-2">
                      <span className="heart-accent">♡</span>
                      <span>60 days of Complete Plus free</span>
                    </li>
                    <li className="flex items-center justify-center gap-2">
                      <span className="heart-accent">♡</span>
                      <span>Priority matching & premium features</span>
                    </li>
                  </ul>
                </div>
                
                <Button 
                  onClick={handleStartSignup}
                  className="shimmer-button w-full h-12 text-lg font-medium keepsake-heading bg-white/80 text-amber-900 hover:bg-white border-2 border-gold/30 hover:border-gold/60 rounded-xl"
                  aria-describedby="signup-description"
                >
                  <span className="heart-accent mr-2">♡</span>
                  Begin Your Soul Quest Journey
                  <span className="heart-accent ml-2">♡</span>
                </Button>
                
                <p id="signup-description" className="text-xs text-muted-foreground text-center">
                  Complete our guided signup to claim your benefits and begin creating meaningful connections through AI-powered compatibility.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-12 max-w-2xl text-center" aria-labelledby="accessibility-info">
          <h2 id="accessibility-info" className="text-lg font-semibold mb-3 text-foreground">
            Accessible for Everyone
          </h2>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            AI Complete Me is accessible to everyone, no matter your abilities or the technology you use. 
            We support screen readers, keyboard navigation, and follow WCAG accessibility guidelines.
          </p>
          <div className="grid gap-2 text-xs text-muted-foreground">
            <div>🔍 Screen reader compatible • ⌨️ Full keyboard navigation • 🎯 High contrast support</div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Auth;