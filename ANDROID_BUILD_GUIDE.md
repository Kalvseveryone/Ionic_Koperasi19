# 🚀 Panduan Build Android APK KitaAda

## 📱 Nama Aplikasi
Aplikasi sudah dikonfigurasi dengan nama **"KitaAda"** yang akan muncul di:
- Launcher Android
- Settings > Apps
- Play Store (jika di-publish)
- **Nama File APK**: `KitaAda-debug-v1.0-1.apk`

## 🎨 Logo Aplikasi

### Cara 1: Otomatis (Recommended)
```bash
# Update logo dan build APK
npm run build-android-icon
```

### Cara 2: Manual dengan Android Studio
1. Buka folder `android/` di Android Studio
2. Klik kanan folder `res`
3. Pilih **New → Image Asset**
4. Pilih **Launcher Icons**
5. Upload logo dari `src/assets/img/logo_.png`
6. Generate dan Replace

### Cara 3: Manual Copy File
```bash
# Update logo saja
npm run update-icon

# Build APK
npm run build-android
```

## 🔧 Build APK

### Build Debug APK
```bash
cd android
./gradlew assembleDebug
```
APK akan tersimpan di: `android/app/build/outputs/apk/debug/KitaAda-debug-v1.0-1.apk`

### Build Release APK
```bash
cd android
./gradlew assembleRelease
```
APK akan tersimpan di: `android/app/build/outputs/apk/release/KitaAda-release-v1.0-1.apk`

## 📋 Konfigurasi Aplikasi

### Nama Aplikasi
- **Capacitor Config**: `capacitor.config.ts` → `appName: 'KitaAda'`
- **Android Strings**: `android/app/src/main/res/values/strings.xml` → `app_name`
- **APK Filename**: `KitaAda-{buildType}-v{version}-{code}.apk`

### Package Name
- **App ID**: `com.koperasifix.app`
- **Bundle ID**: `com.koperasifix.app`

### Logo Source
- **File**: `src/assets/img/logo_.png`
- **Format**: PNG (minimal 512x512px)
- **Background**: Transparent atau solid color

## 🎯 Tips Build

### 1. Pastikan Logo Berkualitas
- Resolusi minimal 512x512px
- Format PNG dengan background transparan
- Logo tidak blur atau pixelated

### 2. Test di Berbagai Device
- Test di device dengan resolusi berbeda
- Pastikan logo terlihat jelas di semua ukuran

### 3. Optimasi APK
```bash
# Build dengan optimasi
cd android
./gradlew assembleRelease --optimize
```

## 🔍 Troubleshooting

### Logo Tidak Berubah
1. Clear build cache: `cd android && ./gradlew clean`
2. Rebuild: `npm run build-android-icon`
3. Uninstall app dari device sebelum install ulang

### Nama Aplikasi Tidak Berubah
1. Check `strings.xml` dan `capacitor.config.ts`
2. Sync project: `npx cap sync android`
3. Rebuild APK

### Build Error
1. Update Gradle: `cd android && ./gradlew wrapper --gradle-version 7.6.1`
2. Clean project: `./gradlew clean`
3. Rebuild: `./gradlew assembleDebug`

## 📱 Install APK
1. Enable "Install from Unknown Sources" di Android
2. Transfer APK ke device
3. Install APK
4. Buka aplikasi "KitaAda"

## 📁 Format Nama File APK
- **Debug**: `KitaAda-debug-v1.0-1.apk`
- **Release**: `KitaAda-release-v1.0-1.apk`
- **Format**: `{AppName}-{BuildType}-v{Version}-{Code}.apk`

---
**Note**: Pastikan logo `src/assets/img/logo_.png` sudah sesuai sebelum build APK! 