import React, { useState, useEffect } from "react";
// Force rebuild - fixing server connection
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppWrapper } from "@/components/AppWrapper";
import { AgeGate } from "@/components/AgeGate";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import ScrollToTop from "@/components/ScrollToTop";
import { BetaWatermark } from "@/components/BetaWatermark";
import { VersionTracker } from "@/components/VersionTracker";
import { BetaProtection } from "@/components/BetaProtection";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { BETA_CONFIG } from "@/config/betaConfig";

// Page imports
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import ProfileSetup from "./pages/ProfileSetup";
import Search from "./pages/Search";
import Messages from "./pages/Messages";

import Questions from "./pages/Questions";
import QuizResults from "./pages/QuizResults";
import Pricing from "./pages/Pricing";
import PremiumDashboard from "./pages/PremiumDashboard";
import ConnectionDNA from "./pages/ConnectionDNA";
import MemoryVault from "./pages/MemoryVault";
import AIDigest from "./pages/AIDigest";
import Mission from "./pages/Mission";
import FAQ from "./pages/FAQ";
import QuickStart from "./pages/QuickStart";
import Privacy from "./pages/Privacy";
import TermsOfService from "./pages/TermsOfService";
import CookieStatement from "./pages/CookieStatement";
import AccessibilityStatement from "./pages/AccessibilityStatement";
import FeatureTest from "./pages/FeatureTest";
import SafetyCenter from "./pages/SafetyCenter";
import DeleteAccount from "./pages/DeleteAccount";
import SampleUserProfile from "./pages/SampleUserProfile";
import TestQuietStart from "./pages/TestQuietStart";
import TestSubscriptionFeatures from "./pages/TestSubscriptionFeatures";
import DatingTips from "./pages/DatingTips";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";
import PaymentSuccess from "./pages/PaymentSuccess";



const queryClient = new QueryClient();

const App = () => {
  const [ageVerified, setAgeVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 Checking age verification on app load...');
    
    try {
      const ageConfirmed = localStorage.getItem('ageConfirmed');
      const ageConfirmedDate = localStorage.getItem('ageConfirmedDate');
      const signupSession = sessionStorage.getItem('signupAgeVerified');
      
      console.log('📋 Age verification status:', { 
        ageConfirmed, 
        hasDate: !!ageConfirmedDate,
        signupSession 
      });
      
      // Check session-based verification first (for active signup sessions)
      if (signupSession === 'true') {
        console.log('✅ Session verification found - user verified');
        setAgeVerified(true);
        setLoading(false);
        return;
      }
      
      // Check localStorage for longer-term verification
      if (ageConfirmed === 'true' && ageConfirmedDate) {
        const confirmationDate = new Date(ageConfirmedDate);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        
        if (confirmationDate > thirtyDaysAgo) {
          console.log('✅ Valid age verification found in localStorage');
          setAgeVerified(true);
          sessionStorage.setItem('signupAgeVerified', 'true');
        } else {
          console.log('⚠️ Age verification expired - clearing');
          localStorage.removeItem('ageConfirmed');
          localStorage.removeItem('ageConfirmedDate');
          localStorage.removeItem('userDateOfBirth');
        }
      } else {
        console.log('❌ No valid age verification found - showing age gate');
      }
    } catch (error) {
      console.error('❌ Error checking age verification:', error);
    }
    
    setLoading(false);
  }, []);

  const handleAgeConfirmed = () => {
    try {
      // Set both localStorage and sessionStorage
      localStorage.setItem('ageConfirmed', 'true');
      localStorage.setItem('ageConfirmedDate', new Date().toISOString());
      sessionStorage.setItem('signupAgeVerified', 'true');
      setAgeVerified(true);
    } catch (error) {
      setAgeVerified(true); // Still proceed
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // ALWAYS show age gate if not verified (except for legal pages)
  if (!ageVerified) {
    const isLegalRoute = typeof window !== 'undefined' && (
      window.location.hash.includes('#/privacy') ||
      window.location.hash.includes('#/terms') ||
      window.location.hash.includes('#/cookie') ||
      window.location.hash.includes('#/accessibility')
    );
    
    // Show age gate for ALL routes except legal pages
    if (!isLegalRoute) {
      console.log('🚫 Age not verified - showing age gate');
      return <AgeGate onAgeConfirmed={handleAgeConfirmed} />;
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <ErrorBoundary>
          <HashRouter>
            <AppWrapper>
              <ScrollToTop />
              {/* Beta Testing Components */}
              {BETA_CONFIG.isTestBuild && (
                <>
                  <BetaProtection />
                  {BETA_CONFIG.showBetaWatermark && (
                    <BetaWatermark 
                      testerId={BETA_CONFIG.testerId}
                      buildVersion={BETA_CONFIG.getBuildId()}
                      businessName={BETA_CONFIG.businessName}
                    />
                  )}
                  {BETA_CONFIG.trackUsage && (
                    <VersionTracker 
                      testerId={BETA_CONFIG.testerId}
                      buildVersion={BETA_CONFIG.getBuildId()}
                      businessName={BETA_CONFIG.businessName}
                    />
                  )}
                </>
              )}
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/profile/edit" element={
                <ProtectedRoute>
                  <ProfileEdit />
                </ProtectedRoute>
              } />
              <Route path="/profile/setup" element={
                <ProtectedRoute>
                  <ProfileSetup />
                </ProtectedRoute>
              } />
              <Route path="/matches" element={<Navigate to="/search" replace />} />
              <Route path="/search" element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              } />
              <Route path="/messages" element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              } />
              <Route path="/browse" element={<Navigate to="/auth" replace />} />
              <Route path="/questions" element={
                <ProtectedRoute>
                  <Questions />
                </ProtectedRoute>
              } />
              <Route path="/quiz-results" element={
                <ProtectedRoute>
                  <QuizResults />
                </ProtectedRoute>
              } />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/premium-dashboard" element={
                <ProtectedRoute>
                  <PremiumDashboard />
                </ProtectedRoute>
              } />
              <Route path="/connection-dna" element={
                <ProtectedRoute>
                  <ConnectionDNA />
                </ProtectedRoute>
              } />
              <Route path="/memory-vault" element={
                <ProtectedRoute>
                  <MemoryVault />
                </ProtectedRoute>
              } />
              <Route path="/ai-digest" element={
                <ProtectedRoute>
                  <AIDigest />
                </ProtectedRoute>
              } />
              <Route path="/mission" element={<Mission />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/quick-start" element={<QuickStart />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/cookies" element={<CookieStatement />} />
              <Route path="/accessibility" element={<AccessibilityStatement />} />
              <Route path="/feature-test" element={<FeatureTest />} />
              <Route path="/test-quiet-start" element={<TestQuietStart />} />
              <Route path="/test-subscription-features" element={<TestSubscriptionFeatures />} />
              <Route path="/dating-tips" element={<DatingTips />} />
              <Route path="/safety" element={<SafetyCenter />} />
              <Route path="/delete-account" element={<DeleteAccount />} />
              <Route path="/sample-user-profile/:profileId" element={<SampleUserProfile />} />
              <Route path="/." element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFound />} />
              </Routes>
            </AppWrapper>
          </HashRouter>
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;