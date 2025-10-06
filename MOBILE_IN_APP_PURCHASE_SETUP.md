# Mobile In-App Purchase Setup Guide (iOS & Android)

## Overview
This app now supports In-App Purchases (IAP) for both iOS and Android using RevenueCat. When users run the app on a mobile device, they can subscribe directly through the Apple App Store or Google Play Store.

## Setup Steps

### 1. RevenueCat Account Setup
1. Sign up for a free account at [RevenueCat](https://www.revenuecat.com/)
2. Create a new project in the RevenueCat dashboard
3. Get your API keys from the RevenueCat dashboard:
   - iOS API key (starts with `appl_`)
   - Android API key (starts with `goog_`)
4. Replace the keys in `src/hooks/useInAppPurchases.tsx`:
   - Replace `appl_YOUR_REVENUECAT_IOS_API_KEY` with your iOS key
   - Replace `goog_YOUR_REVENUECAT_ANDROID_API_KEY` with your Android key

### 2. iOS App Store Connect Configuration
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

### 3. Android Google Play Console Configuration
1. Log into [Google Play Console](https://play.google.com/console/)
2. Go to your app → Monetize → Products → Subscriptions
3. Create the following subscription products:

   **Monthly Subscription (Complete Plus)**
   - Product ID: `com.aicompleteme.monthly`
   - Price: $12.00/month
   - Auto-renewing subscription

   **Annual Subscription (Complete Beyond)**
   - Product ID: `com.aicompleteme.annual`
   - Price: $39.00/year
   - Auto-renewing subscription

4. For each product:
   - Set localized names and descriptions
   - Configure base plans and offers
   - Set up subscription benefits

### 4. RevenueCat Integration with App Stores
#### iOS Setup
1. In RevenueCat dashboard, go to Project Settings
2. Add your iOS app
3. Enter your Bundle ID: `com.aicompleteme.dating`
4. Upload your App Store Connect API key or App-Specific Shared Secret
5. Link your in-app purchase products:
   - Map `com.aicompleteme.monthly` to RevenueCat
   - Map `com.aicompleteme.annual` to RevenueCat

#### Android Setup
1. In RevenueCat dashboard, add your Android app
2. Enter your Package Name: `com.aicompleteme.dating`
3. Upload your Google Play Service Account JSON key
4. Link your subscription products:
   - Map `com.aicompleteme.monthly` to RevenueCat
   - Map `com.aicompleteme.annual` to RevenueCat

### 5. Create Offerings in RevenueCat
1. Go to Offerings in RevenueCat dashboard
2. Create an offering with two packages:
   - Monthly package → linked to `com.aicompleteme.monthly`
   - Annual package → linked to `com.aicompleteme.annual`

### 6. Testing
#### iOS Sandbox Testing
1. Create a Sandbox Apple ID in App Store Connect → Users and Access → Sandbox Testers
2. Build and deploy the iOS app
3. Sign out of your real Apple ID on the iOS device
4. When prompted during purchase, use your Sandbox Apple ID
5. Test the purchase flow

#### Android Testing
1. Add test accounts in Google Play Console → Setup → License testing
2. Add their Gmail accounts to the test list
3. Build and install the app on a test device
4. Test purchases with test accounts
5. Verify the purchase flow and subscription activation

#### Production Testing
1. Submit your apps for review with IAP enabled
2. After approval, test with real payments on both platforms
3. Remember to verify webhook integration for subscription management

### 7. Webhook Setup (Optional but Recommended)
Configure RevenueCat webhooks to notify your backend about subscription events:
1. Create a Supabase Edge Function to handle RevenueCat webhooks
2. Add the webhook URL in RevenueCat dashboard
3. Handle events: purchase, renewal, cancellation, refund

## How It Works

### User Flow (iOS & Android)
1. User navigates to the Pricing page
2. If on native app (iOS or Android), the "Subscribe" button triggers native IAP
3. Platform's native payment sheet appears (Apple Pay/Google Pay)
4. User completes payment with biometric authentication
5. RevenueCat validates the purchase
6. App updates the database with subscription status
7. User gains immediate access to premium features

### Restore Purchases
- Users can restore their purchases by clicking "Restore Purchases"
- This is required if they reinstall the app or switch devices
- Works on both iOS and Android
- RevenueCat syncs their subscription status automatically

## Important Notes

### iOS Requirements
1. **Apple Review**: Apple requires all digital content and subscriptions in iOS apps to use IAP, not web payments
2. **Commission**: Apple takes a 30% commission (15% for subscriptions after year 1)
3. **Price Tiers**: Use Apple's standard price tiers ($12 monthly, $39 annual are valid)
4. **Subscription Groups**: All subscriptions should be in the same group
5. **Free Trial**: You can add a free trial period in App Store Connect (e.g., 7 days)

### Android Requirements
1. **Google Play Billing**: Google requires all digital subscriptions in Android apps to use Google Play Billing
2. **Commission**: Google takes a 15% commission (for subscriptions)
3. **Base Plans**: Configure base plans for each subscription in Play Console
4. **Testing**: Thoroughly test with license testers before going live
5. **Free Trial**: Configure trial periods in Google Play Console

## Sync After Setup
After making these changes, run:
```bash
npx cap sync ios
npx cap sync android
```

Then rebuild and test both iOS and Android apps.

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
