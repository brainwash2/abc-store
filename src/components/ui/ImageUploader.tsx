'use client';

import React, { useCallback, useRef, useState } from 'react';
import { X, UploadCloud, AlertCircle } from 'lucide-react';

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  onClear: () => void;
  previewUrl?: string | null;
  error?: string | null;
  label?: string;
}

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export default function ImageUploader({
  onFileSelect,
  onClear,
  previewUrl,
  error,
  label = 'Image du produit',
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const validateAndSelect = (file: File) => {
    setLocalError(null);
    if (!ALLOWED_TYPES.includes(file.type)) {
      setLocalError('Format non supporté. Utilisez JPG, PNG ou WebP.');
      return;
    }
    if (file.size > MAX_SIZE) {
      setLocalError('Fichier trop volumineux (max 5 Mo).');
      return;
    }
    onFileSelect(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) validateAndSelect(file);
    },
    [onFileSelect]
  );

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>

      {previewUrl ? (
        <div className="relative w-full h-48 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
          <img src={previewUrl} alt="Aperçu" className="w-full h-full object-contain" />
          <button
            type="button"
            onClick={onClear}
            className="absolute top-2 right-2 bg-white/90 p-1 rounded-full shadow hover:bg-white transition"
          >
            <X size={18} className="text-slate-600" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer border-2 border-dashed rounded-lg p-8 text-center transition ${
            isDragging
              ? 'border-violet-500 bg-violet-50'
              : 'border-slate-300 bg-white hover:border-violet-300'
          }`}
        >
          <UploadCloud className="mx-auto h-10 w-10 text-slate-400" />
          <p className="mt-2 text-sm text-slate-600">
            Glissez-déposez l'image ici, ou <span className="text-violet-600 font-medium">cliquez</span> pour parcourir
          </p>
          <p className="mt-1 text-xs text-slate-400">JPG, PNG ou WebP, 5 Mo maximum</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) validateAndSelect(file);
          e.target.value = '';
        }}
      />

      {(localError || error) && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle size={14} /> {localError || error}
        </p>
      )}
    </div>
  );
}
