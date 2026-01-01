#!/usr/bin/env node

/**
 * Generate Open Graph images for social media sharing
 *
 * Usage: node scripts/generate-og-images.js
 *
 * Generates:
 * - Default site OG image
 * - Era-specific OG images
 * - Generic post/profile/thread OG images
 */

const fs = require('fs');
const path = require('path');

async function generateOGImages() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch (e) {
    console.log('Sharp not installed. Please run: npm install sharp --save-dev');
    process.exit(1);
  }

  const outputDir = path.join(__dirname, '../public/og');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // OG image dimensions (1200x630 is standard)
  const width = 1200;
  const height = 630;

  // Color schemes for different contexts
  const themes = {
    default: { bg: '#0a0a0a', accent: '#3b82f6', text: '#ffffff' },
    'american-revolution': { bg: '#1e3a5f', accent: '#c9a227', text: '#ffffff' },
    'ancient-rome': { bg: '#722f37', accent: '#d4af37', text: '#ffffff' },
    'world-war-2': { bg: '#2d2d2d', accent: '#8b0000', text: '#ffffff' },
    'renaissance': { bg: '#2c1810', accent: '#c9a227', text: '#f5f5dc' },
    'civil-rights': { bg: '#1a1a2e', accent: '#e94560', text: '#ffffff' },
    'french-revolution': { bg: '#1e3d59', accent: '#ff6e40', text: '#ffffff' },
    'ancient-greece': { bg: '#1a3c40', accent: '#87ceeb', text: '#ffffff' },
    'world-war-1': { bg: '#3d3d3d', accent: '#8b4513', text: '#ffffff' },
    'industrial-revolution': { bg: '#2f2f2f', accent: '#cd853f', text: '#ffffff' },
    'viking-age': { bg: '#1c2833', accent: '#5dade2', text: '#ffffff' },
    post: { bg: '#0a0a0a', accent: '#3b82f6', text: '#ffffff' },
    profile: { bg: '#0a0a0a', accent: '#10b981', text: '#ffffff' },
    thread: { bg: '#0a0a0a', accent: '#8b5cf6', text: '#ffffff' },
  };

  // Era display names
  const eraNames = {
    'american-revolution': 'American Revolution',
    'ancient-rome': 'Ancient Rome',
    'world-war-2': 'World War II',
    'renaissance': 'Renaissance',
    'civil-rights': 'Civil Rights Movement',
    'french-revolution': 'French Revolution',
    'ancient-greece': 'Ancient Greece',
    'world-war-1': 'World War I',
    'industrial-revolution': 'Industrial Revolution',
    'viking-age': 'Viking Age',
  };

  // Era date ranges
  const eraRanges = {
    'american-revolution': '1775-1783',
    'ancient-rome': '753 BCE - 476 CE',
    'world-war-2': '1939-1945',
    'renaissance': '1400-1700',
    'civil-rights': '1954-1968',
    'french-revolution': '1789-1799',
    'ancient-greece': '800-31 BCE',
    'world-war-1': '1914-1918',
    'industrial-revolution': '1760-1840',
    'viking-age': '793-1066',
  };

  /**
   * Create an SVG for the OG image
   */
  function createSVG(options) {
    const {
      title,
      subtitle,
      bgColor,
      accentColor,
      textColor,
      showHourglass = true,
      showLogo = true,
    } = options;

    // Escape special characters for SVG
    const escapeXml = (str) => str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

    const safeTitle = escapeXml(title);
    const safeSubtitle = subtitle ? escapeXml(subtitle) : '';

    return `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${bgColor}"/>
            <stop offset="100%" style="stop-color:${adjustColor(bgColor, -20)}"/>
          </linearGradient>
          <linearGradient id="accent-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:${accentColor}"/>
            <stop offset="100%" style="stop-color:${adjustColor(accentColor, 20)}"/>
          </linearGradient>
        </defs>

        <!-- Background -->
        <rect width="${width}" height="${height}" fill="url(#bg-gradient)"/>

        <!-- Decorative elements -->
        <rect x="0" y="0" width="${width}" height="8" fill="url(#accent-gradient)"/>
        <rect x="0" y="${height - 8}" width="${width}" height="8" fill="url(#accent-gradient)"/>

        <!-- Grid pattern overlay -->
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="${textColor}" stroke-opacity="0.03" stroke-width="1"/>
        </pattern>
        <rect width="${width}" height="${height}" fill="url(#grid)"/>

        ${showHourglass ? `
        <!-- Hourglass icon -->
        <g transform="translate(60, ${height / 2 - 80})">
          <path d="M0 0 L100 0 L50 60 Z" fill="${accentColor}" opacity="0.8"/>
          <path d="M50 80 L0 160 L100 160 Z" fill="${accentColor}" opacity="0.8"/>
          <rect x="40" y="60" width="20" height="20" fill="${accentColor}" opacity="0.8"/>
        </g>
        ` : ''}

        ${showLogo ? `
        <!-- Logo text -->
        <text x="180" y="${height / 2 - 40}" font-family="system-ui, -apple-system, sans-serif" font-size="72" font-weight="700" fill="${textColor}">
          TEMPUS
        </text>
        <text x="180" y="${height / 2 + 10}" font-family="system-ui, -apple-system, sans-serif" font-size="24" fill="${textColor}" opacity="0.8">
          Where the Past Posts Back
        </text>
        ` : ''}

        <!-- Main title -->
        <text x="${showLogo ? 180 : 80}" y="${height / 2 + 80}" font-family="system-ui, -apple-system, sans-serif" font-size="48" font-weight="600" fill="${textColor}">
          ${safeTitle}
        </text>

        ${safeSubtitle ? `
        <!-- Subtitle -->
        <text x="${showLogo ? 180 : 80}" y="${height / 2 + 130}" font-family="system-ui, -apple-system, sans-serif" font-size="28" fill="${textColor}" opacity="0.7">
          ${safeSubtitle}
        </text>
        ` : ''}

        <!-- URL -->
        <text x="${width - 60}" y="${height - 30}" font-family="system-ui, -apple-system, sans-serif" font-size="20" fill="${textColor}" opacity="0.5" text-anchor="end">
          tempus.app
        </text>
      </svg>
    `;
  }

  /**
   * Adjust color brightness
   */
  function adjustColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, Math.min(255, (num >> 16) + amt));
    const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
    const B = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
  }

  console.log('Generating Open Graph images...\n');

  // 1. Default site OG image
  console.log('Creating default OG image...');
  const defaultSVG = createSVG({
    title: 'Experience History as Social Media',
    subtitle: '917 posts across 10 historical eras',
    bgColor: themes.default.bg,
    accentColor: themes.default.accent,
    textColor: themes.default.text,
  });

  await sharp(Buffer.from(defaultSVG))
    .png()
    .toFile(path.join(outputDir, 'default.png'));
  console.log('  ✓ default.png');

  // 2. Era-specific OG images
  console.log('\nCreating era OG images...');
  for (const [eraId, eraName] of Object.entries(eraNames)) {
    const theme = themes[eraId];
    const dateRange = eraRanges[eraId];

    const eraSVG = createSVG({
      title: eraName,
      subtitle: dateRange,
      bgColor: theme.bg,
      accentColor: theme.accent,
      textColor: theme.text,
    });

    await sharp(Buffer.from(eraSVG))
      .png()
      .toFile(path.join(outputDir, `era-${eraId}.png`));
    console.log(`  ✓ era-${eraId}.png`);
  }

  // 3. Generic post OG image
  console.log('\nCreating generic OG images...');
  const postSVG = createSVG({
    title: 'Historical Post',
    subtitle: 'A moment from history, as it was lived',
    bgColor: themes.post.bg,
    accentColor: themes.post.accent,
    textColor: themes.post.text,
  });

  await sharp(Buffer.from(postSVG))
    .png()
    .toFile(path.join(outputDir, 'post.png'));
  console.log('  ✓ post.png');

  // 4. Generic profile OG image
  const profileSVG = createSVG({
    title: 'Historical Figure',
    subtitle: 'Their story, in their own words',
    bgColor: themes.profile.bg,
    accentColor: themes.profile.accent,
    textColor: themes.profile.text,
  });

  await sharp(Buffer.from(profileSVG))
    .png()
    .toFile(path.join(outputDir, 'profile.png'));
  console.log('  ✓ profile.png');

  // 5. Generic thread OG image
  const threadSVG = createSVG({
    title: 'Historical Thread',
    subtitle: 'A connected story from the past',
    bgColor: themes.thread.bg,
    accentColor: themes.thread.accent,
    textColor: themes.thread.text,
  });

  await sharp(Buffer.from(threadSVG))
    .png()
    .toFile(path.join(outputDir, 'thread.png'));
  console.log('  ✓ thread.png');

  // 6. On This Day OG image
  const onThisDaySVG = createSVG({
    title: 'On This Day in History',
    subtitle: 'See what happened on any day across time',
    bgColor: '#1a1a2e',
    accentColor: '#fbbf24',
    textColor: '#ffffff',
  });

  await sharp(Buffer.from(onThisDaySVG))
    .png()
    .toFile(path.join(outputDir, 'on-this-day.png'));
  console.log('  ✓ on-this-day.png');

  // 7. Search OG image
  const searchSVG = createSVG({
    title: 'Search History',
    subtitle: 'Find posts, people, and events across time',
    bgColor: '#0a0a0a',
    accentColor: '#06b6d4',
    textColor: '#ffffff',
  });

  await sharp(Buffer.from(searchSVG))
    .png()
    .toFile(path.join(outputDir, 'search.png'));
  console.log('  ✓ search.png');

  // 8. Explore OG image
  const exploreSVG = createSVG({
    title: 'Explore Historical Eras',
    subtitle: '10 eras spanning thousands of years',
    bgColor: '#0a0a0a',
    accentColor: '#ec4899',
    textColor: '#ffffff',
  });

  await sharp(Buffer.from(exploreSVG))
    .png()
    .toFile(path.join(outputDir, 'explore.png'));
  console.log('  ✓ explore.png');

  console.log('\n✅ All OG images generated successfully!');
  console.log(`   Output directory: ${outputDir}`);
}

generateOGImages().catch(console.error);
