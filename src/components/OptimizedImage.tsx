'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string
  fallbackSrc?: string
  enableWebP?: boolean
}

/**
 * Get WebP version of an image path
 */
function getWebPPath(src: string): string {
  const lastDot = src.lastIndexOf('.')
  if (lastDot === -1) return src
  return src.slice(0, lastDot) + '.webp'
}

/**
 * Get responsive image path for a given size
 */
function getResponsivePath(src: string, size: number): string {
  const lastDot = src.lastIndexOf('.')
  if (lastDot === -1) return src
  const ext = src.slice(lastDot)
  const base = src.slice(0, lastDot)
  return `${base}-${size}${ext}`
}

/**
 * OptimizedImage component with WebP support and fallback
 *
 * Features:
 * - Automatic WebP version detection
 * - Fallback to original format if WebP fails
 * - Responsive srcset generation
 * - Error handling with fallback image
 */
export function OptimizedImage({
  src,
  fallbackSrc,
  enableWebP = true,
  alt,
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(enableWebP ? getWebPPath(src) : src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      // Try original format if WebP failed
      if (imgSrc.endsWith('.webp') && !src.endsWith('.webp')) {
        setImgSrc(src)
      } else if (fallbackSrc) {
        // Try fallback if provided
        setImgSrc(fallbackSrc)
      }
      setHasError(true)
    }
  }

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={handleError}
    />
  )
}

/**
 * Picture component with WebP source and fallback
 * Uses native <picture> element for better browser support
 */
interface PictureProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  sizes?: string
  loading?: 'lazy' | 'eager'
  priority?: boolean
}

export function Picture({
  src,
  alt,
  width,
  height,
  className,
  sizes,
  loading = 'lazy',
}: PictureProps) {
  const webpSrc = getWebPPath(src)
  const ext = src.slice(src.lastIndexOf('.') + 1)
  const mimeType = ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`

  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <source srcSet={src} type={mimeType} />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        sizes={sizes}
        loading={loading}
      />
    </picture>
  )
}

/**
 * Generate srcset string for responsive images
 */
export function generateSrcSet(
  basePath: string,
  sizes: number[],
  format: 'original' | 'webp' = 'original'
): string {
  return sizes
    .map(size => {
      const path = getResponsivePath(basePath, size)
      const finalPath = format === 'webp' ? getWebPPath(path) : path
      return `${finalPath} ${size}w`
    })
    .join(', ')
}

/**
 * Avatar sizes for responsive images
 */
export const AVATAR_SIZES = [32, 48, 64, 96, 128, 256]

/**
 * Media sizes for responsive images
 */
export const MEDIA_SIZES = [320, 640, 960, 1280]

/**
 * Hook for getting optimized image URLs
 */
export function useOptimizedImage(src: string) {
  return {
    original: src,
    webp: getWebPPath(src),
    getSize: (size: number) => getResponsivePath(src, size),
    getSizeWebP: (size: number) => getWebPPath(getResponsivePath(src, size)),
    srcSet: (sizes: number[]) => generateSrcSet(src, sizes),
    srcSetWebP: (sizes: number[]) => generateSrcSet(src, sizes, 'webp'),
  }
}
