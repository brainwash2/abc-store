'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface AppImageProps {
    src?: string | null; // FIX: Allow null or undefined
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
    quality?: number;
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
    fill?: boolean;
    sizes?: string;
    onClick?: () => void;
    fallbackSrc?: string;
    [key: string]: any;
}

function AppImage({
    src,
    alt,
    width,
    height,
    className = '',
    priority = false,
    quality = 75,
    placeholder = 'empty',
    blurDataURL,
    fill = false,
    sizes,
    onClick,
    fallbackSrc = 'https://via.placeholder.com/400?text=No+Image', // Default fallback
    ...props
}: AppImageProps) {
    // FIX: Ensure we always have a string, even if src is null
    const initialSrc = src && src.trim() !== '' ? src : fallbackSrc;
    
    const [imageSrc, setImageSrc] = useState<string>(initialSrc);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // FIX: Update state if the parent prop changes (e.g. database loads)
    useEffect(() => {
        if (src && src.trim() !== '') {
            setImageSrc(src);
            setHasError(false);
        } else {
            setImageSrc(fallbackSrc);
        }
    }, [src, fallbackSrc]);

    // Safety check before running string methods
    if (!imageSrc) return null;

    const isExternal = imageSrc.startsWith('http://') || imageSrc.startsWith('https://');
    // Local check: starts with / or ./ or data:
    const isLocal = imageSrc.startsWith('/') || imageSrc.startsWith('./') || imageSrc.startsWith('data:');

    const handleError = () => {
        if (!hasError && imageSrc !== fallbackSrc) {
            setImageSrc(fallbackSrc);
            setHasError(true);
        }
        setIsLoading(false);
    };

    const handleLoad = () => {
        setIsLoading(false);
        setHasError(false);
    };

    const commonClassName = `${className} ${isLoading ? 'animate-pulse bg-gray-200' : ''} ${onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`;

    // CASE 1: External Image (Use standard <img> tag to avoid Next.js config issues)
    if (isExternal && !isLocal) {
        const imgStyle: React.CSSProperties = {};
        if (width) imgStyle.width = width;
        if (height) imgStyle.height = height;

        if (fill) {
            return (
                <div className={`relative ${className}`} style={{ width: width || '100%', height: height || '100%' }}>
                    <img
                        src={imageSrc}
                        alt={alt}
                        className={`${commonClassName} absolute inset-0 w-full h-full object-cover`}
                        onError={handleError}
                        onLoad={handleLoad}
                        onClick={onClick}
                        style={imgStyle}
                        {...props}
                    />
                </div>
            );
        }

        return (
            <img
                src={imageSrc}
                alt={alt}
                className={commonClassName}
                onError={handleError}
                onLoad={handleLoad}
                onClick={onClick}
                style={imgStyle}
                {...props}
            />
        );
    }

    // CASE 2: Local Image (Use Next.js <Image> for optimization)
    const imageProps = {
        src: imageSrc,
        alt,
        className: commonClassName,
        priority,
        quality,
        placeholder,
        blurDataURL,
        unoptimized: true, // Often safer for dynamic local paths
        onError: handleError,
        onLoad: handleLoad,
        onClick,
        ...props,
    };

    if (fill) {
        return (
            <div className={`relative ${className}`}>
                <Image
                    {...imageProps}
                    fill
                    sizes={sizes || '100vw'}
                    style={{ objectFit: 'cover' }}
                />
            </div>
        );
    }

    return (
        <Image
            {...imageProps}
            width={width || 400}
            height={height || 300}
        />
    );
}

export default AppImage;