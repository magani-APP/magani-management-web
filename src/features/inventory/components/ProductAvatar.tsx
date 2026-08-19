'use client';

import { useState, useEffect } from 'react';
import { Pill } from 'lucide-react';
import { TOKENS } from '../../../constants/design-tokens.constants';

interface ProductAvatarProps {
  name: string;
  imageUrl?: string;
  size?: number;
}

export function ProductAvatar({ name, imageUrl, size = 36 }: ProductAvatarProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [imageUrl]);

  const showImage = Boolean(imageUrl) && !hasError;

  if (showImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={name}
        width={size}
        height={size}
        onError={() => setHasError(true)}
        className="rounded-full flex-shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: 'rgba(11,143,104,0.08)',
        color: TOKENS.primary,
      }}
      aria-hidden="true"
    >
      <Pill size={size * 0.42} />
    </div>
  );
}