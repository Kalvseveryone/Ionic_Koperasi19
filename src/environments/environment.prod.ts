export const environment = {
  production: true,
  // API Configuration - Production
  apiUrl: 'https://kitaada.my.id/api', // Replace with your actual production API URL
  apiVersion: 'v1',
  
  // CSRF Configuration for Laravel
  csrfTokenUrl: 'https://kitaada.my.id/sanctum/csrf-cookie',
  
  // App Configuration
  appName: 'KoperasiFix',
  appVersion: '1.0.0',
  
  // Feature Flags - Production
  enableAnalytics: true,
  enableCrashlytics: true,
  
  // Debug Configuration - Disabled for production
  enableApiLogging: false,
  enableErrorLogging: false,
  
  // Security Configuration
  enableHttpsOnly: true,
  enableCertificatePinning: true
};
