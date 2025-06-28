#!/bin/bash

echo "🚀 Memulai build aplikasi KoperasiFix untuk Android..."

# Clean previous builds
echo "🧹 Membersihkan build sebelumnya..."
ionic build --prod

# Sync with Capacitor
echo "🔄 Sinkronisasi dengan Capacitor..."
npx cap sync android

# Build Android
echo "📱 Building aplikasi Android..."
npx cap build android

echo "✅ Build selesai!"
echo "📁 APK tersedia di: android/app/build/outputs/apk/release/"
echo "🔧 Untuk menjalankan di emulator: npx cap run android"
echo "📦 Untuk build APK: cd android && ./gradlew assembleRelease" 