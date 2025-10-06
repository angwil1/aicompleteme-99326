import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';

// Apple App Store product IDs - these must match your App Store Connect configuration
const PRODUCT_IDS = {
  monthly: 'com.aicompleteme.monthly',
  quarterly: 'com.aicompleteme.quarterly',
  annual: 'com.aicompleteme.annual'
};

export const useInAppPurchases = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const { toast } = useToast();
  const platform = Capacitor.getPlatform();
  const isIOS = platform === 'ios';
  const isAndroid = platform === 'android';
  const isNative = isIOS || isAndroid;

  useEffect(() => {
    if (isNative && Capacitor.isNativePlatform()) {
      initializeIAP();
    } else {
      setLoading(false);
    }
  }, [isNative]);

  const initializeIAP = async () => {
    try {
      // Only import Purchases on native platforms
      const { Purchases } = await import('@revenuecat/purchases-capacitor');
      
      // Configure RevenueCat with platform-specific API key
      const apiKey = isIOS 
        ? 'appl_YOUR_REVENUECAT_IOS_API_KEY' 
        : 'goog_YOUR_REVENUECAT_ANDROID_API_KEY';
      
      await Purchases.configure({
        apiKey,
      });

      // Get available offerings
      const offerings = await Purchases.getOfferings();
      if (offerings.current) {
        setProducts(offerings.current.availablePackages);
      }
      
      setLoading(false);
    } catch (error: any) {
      console.error('Failed to initialize IAP:', error);
      toast({
        title: "Setup Error",
        description: "Failed to load purchase options",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const processPurchase = async (purchaseResult: any) => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Extract subscription info from RevenueCat
      const customerInfo = purchaseResult.customerInfo;
      const activeSubscriptions = customerInfo.activeSubscriptions;
      
      if (activeSubscriptions.length > 0) {
        const subscription = activeSubscriptions[0];
        
        // Determine plan tier
        let tier = 'monthly';
        if (subscription.includes('annual')) tier = 'annual';
        else if (subscription.includes('quarterly')) tier = 'quarterly';

        // Update subscription in database
        const { error } = await supabase.from('subscribers').upsert({
          user_id: user.id,
          email: user.email!,
          subscribed: true,
          subscription_tier: tier,
          subscribed_at: new Date().toISOString(),
          subscription_end: customerInfo.expirationDate || null,
          updated_at: new Date().toISOString()
        });

        if (error) throw error;

        toast({
          title: "Subscription Active!",
          description: `Your ${tier} subscription is now active.`,
        });
      }

      setPurchasing(false);
    } catch (error: any) {
      console.error('Failed to process purchase:', error);
      toast({
        title: "Processing Error",
        description: "Purchase succeeded but failed to activate. Contact support.",
        variant: "destructive"
      });
    }
  };

  const purchase = async (productId: string) => {
    if (!isNative || !Capacitor.isNativePlatform()) {
      toast({
        title: "Not Available",
        description: "In-App Purchases are only available on mobile apps",
        variant: "destructive"
      });
      return;
    }

    setPurchasing(true);
    try {
      const { Purchases } = await import('@revenuecat/purchases-capacitor');
      
      const packageToPurchase = products.find((p: any) => 
        p.product.identifier === productId
      );
      
      if (!packageToPurchase) {
        throw new Error('Product not found');
      }

      const purchaseResult = await Purchases.purchasePackage({
        aPackage: packageToPurchase
      });

      await processPurchase(purchaseResult);
    } catch (error: any) {
      console.error('Purchase failed:', error);
      if (!error.userCancelled) {
        toast({
          title: "Purchase Failed",
          description: error.message || "Could not complete purchase",
          variant: "destructive"
        });
      }
      setPurchasing(false);
    }
  };

  const restorePurchases = async () => {
    if (!isNative || !Capacitor.isNativePlatform()) return;

    try {
      setLoading(true);
      const { Purchases } = await import('@revenuecat/purchases-capacitor');
      
      const customerInfo = await Purchases.restorePurchases();
      await processPurchase({ customerInfo });
      toast({
        title: "Restore Complete",
        description: "Your purchases have been restored",
      });
    } catch (error: any) {
      toast({
        title: "Restore Failed",
        description: error.message || "Could not restore purchases",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    isIOS,
    isAndroid,
    isNative,
    products,
    loading,
    purchasing,
    purchase,
    restorePurchases,
    PRODUCT_IDS
  };
};
