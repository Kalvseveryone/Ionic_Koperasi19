// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // API Configuration - Updated to match Laravel API routes
  apiUrl: 'https://kitaada.my.id/api', // Base URL with /api prefix for Laravel
  apiVersion: 'v1',
  
  // CSRF Configuration for Laravel (disabled for development due to CORS)
  csrfTokenUrl: null, // Set to null to disable CSRF token fetching
  
  // App Configuration
  appName: 'KoperasiFix',
  appVersion: '1.0.0',
  
  // Feature Flags
  enableAnalytics: false,
  enableCrashlytics: false,
  
  // Debug Configuration
  enableApiLogging: true,
  enableErrorLogging: true
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
