import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aicompleteme.dating',
  appName: 'AI Complete Me',
  webDir: 'dist',
  // Development live-reload: load from Lovable preview server
  server: {
    url: 'https://13536aaa-6bc6-47a3-9016-0088ccdcef90.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#8B5CF6',
      showSpinner: false,
      androidSpinnerStyle: 'small',
      iosSpinnerStyle: 'small',
      spinnerColor: '#ffffff'
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#8B5CF6'
    },
    Keyboard: {
      resize: 'body'
    }
  },
  ios: {
    contentInset: 'automatic'
  },
  android: {
    backgroundColor: '#8B5CF6',
    themeColor: '#8B5CF6',
    versionCode: 3,
    versionName: "3.0.0",
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: true
  }
};

export default config;