'use client';

import React, { useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface ProductImageGalleryProps {
  images: string[]; // Changed to string array
  productName: string;
}

const ProductImageGallery = ({ images, productName }: ProductImageGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // If no images, show placeholder
  const safeImages = images.length > 0 ? images : ['https://via.placeholder.com/600?text=No+Image'];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative bg-white border border-slate-200 rounded-xl overflow-hidden h-96 flex items-center justify-center">
        <AppImage
          src={safeImages[selectedImageIndex]}
          alt={productName}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {safeImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden ${
                index === selectedImageIndex ? 'border-violet-600' : 'border-slate-200'
              }`}
            >
              <AppImage
                src={img}
                alt={`${productName} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;