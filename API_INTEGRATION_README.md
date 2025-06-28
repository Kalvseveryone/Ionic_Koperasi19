# KoperasiFix - API Integration Setup

## Overview
This document describes the complete API integration infrastructure that has been set up for the KoperasiFix Ionic application, including HTTP interceptors, services, and models for REST API integration.

## 🏗️ Infrastructure Components

### 1. Environment Configuration
- **Development**: `src/environments/environment.ts`
- **Production**: `src/environments/environment.prod.ts`

**Configuration includes:**
- API URLs for different environments
- Feature flags
- App versioning

### 2. Models/Interfaces
Located in `src/app/models/`

#### Core Models:
- **`user.model.ts`**: User authentication and profile interfaces
- **`simpanan.model.ts`**: Savings-related interfaces
- **`pinjaman.model.ts`**: Loan-related interfaces
- **`common.model.ts`**: Shared interfaces (API responses, transactions, etc.)

### 3. HTTP Interceptors
Located in `src/app/interceptors/`

#### Available Interceptors:
- **`auth.interceptor.ts`**: Handles JWT tokens and authentication
- **`error.interceptor.ts`**: Global error handling with user-friendly messages
- **`loading.interceptor.ts`**: Automatic loading indicators for API calls

### 4. Services
Located in `src/app/services/`

#### Core Services:
- **`auth.service.ts`**: Authentication (REST API only)
- **`simpanan.service.ts`**: Savings management
- **`pinjaman.service.ts`**: Loan management
- **`notification.service.ts`**: Push and in-app notifications
- **`utility.service.ts`**: Common utilities and formatting

## 🔧 Setup Instructions

### 1. Configure Environment Variables
Update `src/environments/environment.ts` with your actual values:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://your-api-url.com/api',
  apiVersion: 'v1',
  appName: 'KoperasiFix',
  appVersion: '1.0.0'
};
```

### 2. Update App Module
The `app.module.ts` has been updated to include:
- HttpClientModule
- HTTP interceptors
- Ionic Storage

## 📡 API Endpoints Structure

### Authentication
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh
POST /api/auth/reset-password
POST /api/auth/logout
GET  /api/auth/profile
PUT  /api/auth/profile
```

### Simpanan (Savings)
```
GET    /api/simpanan
GET    /api/simpanan/summary
GET    /api/simpanan/{type}
POST   /api/simpanan
GET    /api/simpanan/transactions
POST   /api/simpanan/transactions
POST   /api/simpanan/wajib/pay
POST   /api/simpanan/sukarela/deposit
POST   /api/simpanan/sukarela/withdraw
```

### Pinjaman (Loans)
```
GET    /api/pinjaman
GET    /api/pinjaman/summary
GET    /api/pinjaman/{id}
POST   /api/pinjaman/applications
GET    /api/pinjaman/applications
POST   /api/pinjaman/payments
GET    /api/pinjaman/calculator
GET    /api/pinjaman/terms
```

### Notifications
```
GET    /api/notifications
GET    /api/notifications/unread
PUT    /api/notifications/{id}/read
PUT    /api/notifications/read-all
DELETE /api/notifications/{id}
```

### File Upload
```
POST   /api/upload
POST   /api/upload/multiple
```

## 🔐 Authentication Flow

### REST API Authentication
1. User logs in with email/password
2. Server returns JWT token + refresh token
3. Token stored in localStorage
4. AuthInterceptor adds token to all requests
5. Automatic token refresh on 401 errors
6. Auto-login on app startup if valid token exists

## 🚀 Usage Examples

### Using Auth Service
```typescript
import { AuthService } from '../services/auth.service';

constructor(private authService: AuthService) {}

// Login
async login() {
  try {
    const response = await this.authService.login({
      email: 'user@example.com',
      password: 'password'
    }).toPromise();
    console.log('Login successful:', response);
  } catch (error) {
    console.error('Login failed:', error);
  }
}

// Register
async register() {
  try {
    const response = await this.authService.register({
      email: 'user@example.com',
      password: 'password',
      name: 'John Doe',
      phone: '+628123456789',
      ktpNumber: '1234567890123456',
      address: 'Jl. Example No. 123',
      birthDate: new Date('1990-01-01'),
      gender: 'male',
      occupation: 'Employee',
      monthlyIncome: 5000000,
      emergencyContact: {
        name: 'Jane Doe',
        phone: '+628123456788',
        relationship: 'Spouse'
      }
    }).toPromise();
    console.log('Registration successful:', response);
  } catch (error) {
    console.error('Registration failed:', error);
  }
}

// Check authentication status
isLoggedIn(): boolean {
  return this.authService.isAuthenticated();
}

// Auto-login on app startup
async ngOnInit() {
  await this.authService.autoLogin();
}
```

### Using Simpanan Service
```typescript
import { SimpananService } from '../services/simpanan.service';

constructor(private simpananService: SimpananService) {}

// Get simpanan summary
async getSummary() {
  try {
    const summary = await this.simpananService.getSimpananSummary().toPromise();
    console.log('Simpanan summary:', summary);
  } catch (error) {
    console.error('Failed to get summary:', error);
  }
}

// Pay simpanan wajib
async payWajib(amount: number) {
  try {
    const transaction = await this.simpananService.paySimpananWajib(amount).toPromise();
    console.log('Payment successful:', transaction);
  } catch (error) {
    console.error('Payment failed:', error);
  }
}
```

### Using Utility Service
```typescript
import { UtilityService } from '../services/utility.service';

constructor(private utilityService: UtilityService) {}

// Format currency
const formatted = this.utilityService.formatCurrency(1000000); // "Rp 1.000.000"

// Validate email
const isValid = this.utilityService.validateEmail('user@example.com'); // true

// Upload file
async uploadFile(file: File) {
  try {
    const result = await this.utilityService.uploadFile(file, 'image').toPromise();
    console.log('Upload successful:', result);
  } catch (error) {
    console.error('Upload failed:', error);
  }
}
```

## 🔧 Error Handling

### Global Error Handling
- Automatic error messages via ErrorInterceptor
- User-friendly error messages in Indonesian
- Development vs production error handling
- Automatic logout on authentication errors

### Service-Level Error Handling
- Consistent error response format
- Proper error propagation
- Retry mechanisms for network errors

## 🧪 Testing

### Unit Testing
- All services are injectable and testable
- Mock HTTP responses for testing
- Test authentication flows

### Integration Testing
- Test API endpoints with real data
- Test error scenarios
- Test token refresh functionality

## 📋 Checklist for Production

- [ ] Update environment variables with production values
- [ ] Set up SSL certificates for API
- [ ] Configure CORS policies
- [ ] Set up monitoring and logging
- [ ] Test all API endpoints
- [ ] Validate error handling
- [ ] Test authentication flows
- [ ] Verify file upload functionality
- [ ] Test push notifications
- [ ] Test token refresh mechanism

## 🚨 Security Considerations

### API Security:
- JWT token validation
- HTTPS enforcement
- Rate limiting
- Input validation
- SQL injection prevention
- Token expiration handling

## 📞 Support

For questions or issues with the API integration:
1. Check the console for error messages
2. Verify environment configuration
3. Test API endpoints independently
4. Check network connectivity

## 🔄 Updates and Maintenance

### Regular Maintenance:
- Monitor API performance
- Review security configurations
- Update environment variables as needed
- Test token refresh functionality

### Version Control:
- All configuration files are version controlled
- Environment-specific configurations
- Feature flags for gradual rollouts 