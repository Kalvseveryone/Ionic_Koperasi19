# 🚀 Panduan Deployment KoperasiFix

## 📋 Prasyarat

### 1. **Development Environment**
- Node.js 18+ 
- Ionic CLI 7+
- Android Studio
- Java JDK 11+
- Gradle 7+

### 2. **API Backend**
- Laravel API sudah berjalan di production
- SSL certificate aktif
- Database production sudah siap

## 🔧 Langkah-langkah Deployment

### 1. **Persiapan Environment**
```bash
# Install dependencies
npm install

# Build untuk production
ionic build --prod
```

### 2. **Konfigurasi Environment**
Pastikan file `src/environments/environment.prod.ts` sudah benar:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api',
  // ... konfigurasi lainnya
};
```

### 3. **Build Android APK**
```bash
# Jalankan script build
chmod +x build-android.sh
./build-android.sh

# Atau manual:
ionic build --prod
npx cap sync android
npx cap build android
```

### 4. **Generate Release APK**
```bash
cd android
./gradlew assembleRelease
```

APK akan tersedia di: `android/app/build/outputs/apk/release/app-release.apk`

## 📱 Konfigurasi Android

### 1. **App ID & Package Name**
- App ID: `com.koperasifix.app`
- Package: `com.koperasifix.app`

### 2. **Permissions**
Aplikasi memerlukan permission berikut:
- `INTERNET` - Untuk koneksi API
- `CAMERA` - Untuk scan dokumen (opsional)
- `READ_EXTERNAL_STORAGE` - Untuk upload file (opsional)

### 3. **Keamanan**
- HTTPS enforcement aktif
- Certificate pinning untuk production
- Debug mode dinonaktifkan

## 🔐 Keamanan Production

### 1. **API Security**
- Gunakan HTTPS untuk semua komunikasi
- Implementasikan rate limiting
- Validasi input di server side
- Gunakan JWT dengan expiry time yang wajar

### 2. **App Security**
- ProGuard/R8 obfuscation aktif
- Debug mode dinonaktifkan
- Certificate pinning untuk API calls
- Secure storage untuk sensitive data

## 📊 Monitoring & Analytics

### 1. **Error Tracking**
- Firebase Crashlytics aktif
- Error logging ke server
- User feedback mechanism

### 2. **Performance Monitoring**
- Firebase Performance Monitoring
- API response time tracking
- App startup time optimization

## 🚨 Troubleshooting

### 1. **Build Errors**
```bash
# Clean dan rebuild
ionic build --prod --clean
npx cap sync android --clean
```

### 2. **API Connection Issues**
- Periksa URL API di environment
- Pastikan CORS sudah dikonfigurasi
- Test API endpoint secara manual

### 3. **Android Build Issues**
```bash
# Clean Android build
cd android
./gradlew clean
./gradlew assembleRelease
```

## 📈 Post-Deployment Checklist

### 1. **Testing**
- [ ] Login/Register berfungsi
- [ ] Simpanan features berfungsi
- [ ] Pinjaman features berfungsi
- [ ] Notifikasi berfungsi
- [ ] Offline mode berfungsi

### 2. **Performance**
- [ ] App startup time < 3 detik
- [ ] API response time < 2 detik
- [ ] Memory usage optimal
- [ ] Battery usage normal

### 3. **Security**
- [ ] HTTPS enforcement aktif
- [ ] Sensitive data terenkripsi
- [ ] API authentication berfungsi
- [ ] Session management aman

## 📞 Support

Untuk bantuan deployment, hubungi:
- Email: support@koperasifix.com
- WhatsApp: +62-xxx-xxx-xxxx
- Documentation: https://docs.koperasifix.com

---

**Versi**: 1.0.0  
**Update**: $(date)  
**Author**: KoperasiFix Team 