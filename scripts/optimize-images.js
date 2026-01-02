#!/usr/bin/env node

/**
 * Image Optimization Pipeline
 *
 * This script optimizes images in the public directory:
 * - Compresses PNG/JPG images
 * - Generates WebP versions for modern browsers
 * - Creates responsive sizes for avatars and media
 * - Outputs optimization statistics
 *
 * Usage: node scripts/optimize-images.js [--dry-run]
 */

const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

// Configuration
const config = {
  publicDir: path.join(__dirname, '..', 'public'),
  outputDir: path.join(__dirname, '..', 'public', 'optimized'),

  // Quality settings
  quality: {
    png: 85,
    jpeg: 80,
    webp: 80,
    avif: 65,
  },

  // Responsive sizes for different image types
  sizes: {
    avatar: [32, 48, 64, 96, 128, 256],
    og: [1200], // OG images are fixed size
    icon: [], // Keep original sizes
    media: [320, 640, 960, 1280],
  },

  // Directories to process
  directories: ['og', 'icons', 'avatars', 'media'],

  // File extensions to process
  extensions: ['.png', '.jpg', '.jpeg'],
}

// Statistics tracking
const stats = {
  processed: 0,
  skipped: 0,
  errors: 0,
  originalSize: 0,
  optimizedSize: 0,
  webpSize: 0,
  filesCreated: [],
}

/**
 * Get file size in bytes
 */
function getFileSize(filePath) {
  try {
    return fs.statSync(filePath).size
  } catch {
    return 0
  }
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

/**
 * Determine image category from path
 */
function getImageCategory(filePath) {
  if (filePath.includes('/avatars/')) return 'avatar'
  if (filePath.includes('/og/')) return 'og'
  if (filePath.includes('/icons/')) return 'icon'
  if (filePath.includes('/media/')) return 'media'
  return 'other'
}

/**
 * Process a single image
 */
async function processImage(inputPath, dryRun = false) {
  const ext = path.extname(inputPath).toLowerCase()
  const basename = path.basename(inputPath, ext)
  const dirname = path.dirname(inputPath)
  const category = getImageCategory(inputPath)
  const relativePath = path.relative(config.publicDir, inputPath)

  const originalSize = getFileSize(inputPath)
  stats.originalSize += originalSize

  console.log(`\nProcessing: ${relativePath}`)
  console.log(`  Category: ${category}, Original: ${formatBytes(originalSize)}`)

  if (dryRun) {
    console.log('  [DRY RUN] Would optimize this image')
    stats.processed++
    return
  }

  try {
    const image = sharp(inputPath)
    const metadata = await image.metadata()

    // 1. Optimize original format
    let optimizedPath = inputPath
    let optimizedBuffer

    if (ext === '.png') {
      optimizedBuffer = await image
        .png({ quality: config.quality.png, compressionLevel: 9 })
        .toBuffer()
    } else if (ext === '.jpg' || ext === '.jpeg') {
      optimizedBuffer = await image
        .jpeg({ quality: config.quality.jpeg, mozjpeg: true })
        .toBuffer()
    }

    if (optimizedBuffer && optimizedBuffer.length < originalSize) {
      fs.writeFileSync(inputPath, optimizedBuffer)
      stats.optimizedSize += optimizedBuffer.length
      console.log(`  Optimized: ${formatBytes(optimizedBuffer.length)} (saved ${formatBytes(originalSize - optimizedBuffer.length)})`)
    } else {
      stats.optimizedSize += originalSize
      console.log(`  Already optimized, keeping original`)
    }

    // 2. Generate WebP version
    const webpPath = path.join(dirname, `${basename}.webp`)
    const webpBuffer = await sharp(inputPath)
      .webp({ quality: config.quality.webp })
      .toBuffer()

    fs.writeFileSync(webpPath, webpBuffer)
    stats.webpSize += webpBuffer.length
    stats.filesCreated.push(path.relative(config.publicDir, webpPath))
    console.log(`  WebP: ${formatBytes(webpBuffer.length)}`)

    // 3. Generate responsive sizes if applicable
    const sizes = config.sizes[category] || []
    for (const size of sizes) {
      if (size >= metadata.width) continue // Skip if larger than original

      // Optimized PNG/JPG at this size
      const resizedPath = path.join(dirname, `${basename}-${size}${ext}`)
      const resizedBuffer = await sharp(inputPath)
        .resize(size, size, { fit: 'cover' })
        [ext === '.png' ? 'png' : 'jpeg']({
          quality: ext === '.png' ? config.quality.png : config.quality.jpeg
        })
        .toBuffer()

      fs.writeFileSync(resizedPath, resizedBuffer)
      stats.filesCreated.push(path.relative(config.publicDir, resizedPath))

      // WebP at this size
      const resizedWebpPath = path.join(dirname, `${basename}-${size}.webp`)
      const resizedWebpBuffer = await sharp(inputPath)
        .resize(size, size, { fit: 'cover' })
        .webp({ quality: config.quality.webp })
        .toBuffer()

      fs.writeFileSync(resizedWebpPath, resizedWebpBuffer)
      stats.filesCreated.push(path.relative(config.publicDir, resizedWebpPath))

      console.log(`  ${size}px: ${formatBytes(resizedBuffer.length)} / WebP: ${formatBytes(resizedWebpBuffer.length)}`)
    }

    stats.processed++
  } catch (error) {
    console.error(`  Error: ${error.message}`)
    stats.errors++
  }
}

/**
 * Find all images in a directory recursively
 */
function findImages(dir) {
  const images = []

  if (!fs.existsSync(dir)) {
    return images
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      images.push(...findImages(fullPath))
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase()
      if (config.extensions.includes(ext)) {
        // Skip already optimized/resized versions
        if (!entry.name.includes('-32') &&
            !entry.name.includes('-48') &&
            !entry.name.includes('-64') &&
            !entry.name.includes('-96') &&
            !entry.name.includes('-128') &&
            !entry.name.includes('-256') &&
            !entry.name.includes('-320') &&
            !entry.name.includes('-640') &&
            !entry.name.includes('-960') &&
            !entry.name.includes('-1280')) {
          images.push(fullPath)
        }
      }
    }
  }

  return images
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')

  console.log('='.repeat(60))
  console.log('Image Optimization Pipeline')
  console.log('='.repeat(60))

  if (dryRun) {
    console.log('\n[DRY RUN MODE] No files will be modified\n')
  }

  // Find all images
  const allImages = []
  for (const dir of config.directories) {
    const dirPath = path.join(config.publicDir, dir)
    const images = findImages(dirPath)
    allImages.push(...images)
    console.log(`Found ${images.length} images in ${dir}/`)
  }

  // Also check root public directory for loose images
  const rootImages = fs.readdirSync(config.publicDir)
    .filter(f => config.extensions.includes(path.extname(f).toLowerCase()))
    .map(f => path.join(config.publicDir, f))
  allImages.push(...rootImages)

  console.log(`\nTotal images to process: ${allImages.length}`)

  // Process each image
  for (const imagePath of allImages) {
    await processImage(imagePath, dryRun)
  }

  // Print summary
  console.log('\n' + '='.repeat(60))
  console.log('Summary')
  console.log('='.repeat(60))
  console.log(`Processed: ${stats.processed}`)
  console.log(`Skipped: ${stats.skipped}`)
  console.log(`Errors: ${stats.errors}`)
  console.log(`Original total: ${formatBytes(stats.originalSize)}`)
  console.log(`Optimized total: ${formatBytes(stats.optimizedSize)}`)
  console.log(`Savings: ${formatBytes(stats.originalSize - stats.optimizedSize)} (${((1 - stats.optimizedSize / stats.originalSize) * 100).toFixed(1)}%)`)
  console.log(`WebP total: ${formatBytes(stats.webpSize)}`)
  console.log(`New files created: ${stats.filesCreated.length}`)

  if (stats.filesCreated.length > 0 && !dryRun) {
    console.log('\nCreated files:')
    stats.filesCreated.forEach(f => console.log(`  - ${f}`))
  }
}

main().catch(console.error)
