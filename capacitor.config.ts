import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.koperasifix.app',
  appName: 'KitaAda',
  webDir: 'www',
  server: {
    cleartext: false,
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#14b8a6",
      showSpinner: true,
      spinnerColor: "#ffffff",
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: "dark",
      backgroundColor: "#14b8a6",
      overlaysWebView: false
    }
  },
  // Icon configuration
  icon: {
    android: {
      source: 'src/assets/img/logo_.png',
      foreground: 'src/assets/img/logo_.png',
      background: '#14b8a6'
    }
  }
};

export default config;
