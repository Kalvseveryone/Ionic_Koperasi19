const fs = require('fs');
const path = require('path');

// Paths
const sourceLogo = path.join(__dirname, 'src/assets/img/logo_.png');
const androidResPath = path.join(__dirname, 'android/app/src/main/res');

// Check if source logo exists
if (!fs.existsSync(sourceLogo)) {
  console.error('❌ Source logo not found:', sourceLogo);
  process.exit(1);
}

console.log('🎨 Updating KitaAda Android app icons...');

// Copy logo to different mipmap directories
const mipmapDirs = [
  'mipmap-mdpi',
  'mipmap-hdpi', 
  'mipmap-xhdpi',
  'mipmap-xxhdpi',
  'mipmap-xxxhdpi'
];

mipmapDirs.forEach(dir => {
  const targetDir = path.join(androidResPath, dir);
  if (fs.existsSync(targetDir)) {
    const targetFile = path.join(targetDir, 'ic_launcher.png');
    try {
      fs.copyFileSync(sourceLogo, targetFile);
      console.log(`✅ Updated ${dir}/ic_launcher.png`);
    } catch (error) {
      console.error(`❌ Failed to update ${dir}/ic_launcher.png:`, error.message);
    }
  }
});

console.log('🎉 KitaAda icon update completed!');
console.log('💡 Run "npx cap sync android" to apply changes'); 