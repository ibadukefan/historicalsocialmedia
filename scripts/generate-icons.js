#!/usr/bin/env node

/**
 * Generate PWA icons from the SVG source
 *
 * Usage: node scripts/generate-icons.js
 *
 * Requires: sharp (npm install sharp --save-dev)
 */

const fs = require('fs');
const path = require('path');

async function generateIcons() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch (e) {
    console.log('Sharp not installed. Installing...');
    const { execSync } = require('child_process');
    execSync('npm install sharp --save-dev', { stdio: 'inherit' });
    sharp = require('sharp');
  }

  const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
  const svgPath = path.join(__dirname, '../public/icons/icon.svg');
  const outputDir = path.join(__dirname, '../public/icons');

  // Read the SVG file
  const svgBuffer = fs.readFileSync(svgPath);

  console.log('Generating PWA icons...');

  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);

    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);

    console.log(`  Created: icon-${size}x${size}.png`);
  }

  // Generate favicon.ico (using 32x32)
  const faviconPath = path.join(__dirname, '../public/favicon.ico');
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(outputDir, 'favicon-32x32.png'));

  // Generate apple-touch-icon
  const appleTouchPath = path.join(__dirname, '../public/apple-touch-icon.png');
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(appleTouchPath);

  console.log('  Created: apple-touch-icon.png');
  console.log('\nDone! Icons generated successfully.');
}

generateIcons().catch(console.error);
