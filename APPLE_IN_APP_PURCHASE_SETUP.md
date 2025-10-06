# Apple In-App Purchase Setup Guide

## Overview
This app now supports Apple In-App Purchases (IAP) for iOS using RevenueCat. When users run the app on an iOS device, they can subscribe directly through the Apple App Store.

## Setup Steps

### 1. RevenueCat Account Setup
1. Sign up for a free account at [RevenueCat](https://www.revenuecat.com/)
2. Create a new project in the RevenueCat dashboard
3. Get your API key from the RevenueCat dashboard (it starts with `appl_`)
4. Replace `appl_YOUR_REVENUECAT_API_KEY` in `src/hooks/useInAppPurchases.tsx` with your actual key

### 2. App Store Connect Configuration
1. Log into [App Store Connect](https://appstoreconnect.apple.com/)
2. Go to your app → Features → In-App Purchases
3. Create the following subscription products:

   **Monthly Subscription (Complete Plus)**
   - Product ID: `com.aicompleteme.monthly`
   - Price: $12.00/month
   - Auto-renewable subscription

   **Annual Subscription (Complete Beyond)**
   - Product ID: `com.aicompleteme.annual`
   - Price: $39.00/year
   - Auto-renewable subscription

4. For each product:
   - Set localized names and descriptions
   - Upload product screenshots if required
   - Configure subscription group

### 3. RevenueCat Integration with App Store
1. In RevenueCat dashboard, go to Project Settings
2. Add your iOS app
3. Enter your Bundle ID: `com.aicompleteme.dating`
4. Upload your App Store Connect API key or App-Specific Shared Secret
5. Link your in-app purchase products:
   - Map `com.aicompleteme.monthly` to RevenueCat
   - Map `com.aicompleteme.annual` to RevenueCat

### 4. Create Offerings in RevenueCat
1. Go to Offerings in RevenueCat dashboard
2. Create an offering with two packages:
   - Monthly package → linked to `com.aicompleteme.monthly`
   - Annual package → linked to `com.aicompleteme.annual`

### 5. Testing
#### Sandbox Testing
1. Create a Sandbox Apple ID in App Store Connect → Users and Access → Sandbox Testers
2. Build and deploy the iOS app
3. Sign out of your real Apple ID on the iOS device
4. When prompted during purchase, use your Sandbox Apple ID
5. Test the purchase flow

#### Production Testing
1. Submit your app for review with IAP enabled
2. After approval, test with real payments
3. Remember to verify webhook integration for subscription management

### 6. Webhook Setup (Optional but Recommended)
Configure RevenueCat webhooks to notify your backend about subscription events:
1. Create a Supabase Edge Function to handle RevenueCat webhooks
2. Add the webhook URL in RevenueCat dashboard
3. Handle events: purchase, renewal, cancellation, refund

## How It Works

### User Flow
1. User navigates to the Pricing page
2. If on iOS native app, the "Subscribe" button triggers Apple IAP
3. Apple's native payment sheet appears
4. User completes payment with Face ID/Touch ID
5. RevenueCat validates the purchase
6. App updates the database with subscription status
7. User gains immediate access to premium features

### Restore Purchases
- Users can restore their purchases by clicking "Restore Purchases"
- This is required if they reinstall the app or switch devices
- RevenueCat syncs their subscription status automatically

## Important Notes

1. **Apple Review**: Apple requires all digital content and subscriptions in iOS apps to use IAP, not web payments
2. **Commission**: Apple takes a 30% commission (15% for subscriptions after year 1)
3. **Price Tiers**: Use Apple's standard price tiers ($12 monthly, $39 annual are valid)
4. **Subscription Groups**: All subscriptions should be in the same group
5. **Free Trial**: You can add a free trial period in App Store Connect (e.g., 7 days)

## Sync After Setup
After making these changes, run:
```bash
npx cap sync ios
```

Then rebuild and test the iOS app.

## Production Deployment
Before going live:
- [ ] Replace test API key with production key
- [ ] Test all purchase flows in sandbox
- [ ] Configure proper error handling
- [ ] Set up subscription webhooks
- [ ] Test restore purchases functionality
- [ ] Verify database updates on purchase
- [ ] Add subscription management UI

## Support
For issues with RevenueCat, check their documentation: https://docs.revenuecat.com/
