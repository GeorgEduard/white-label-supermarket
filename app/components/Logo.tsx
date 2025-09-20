import Image from 'next/image';
import React from 'react';

interface LogoProps {
  width?: number;
  height?: number;
  priority?: boolean;
  alt?: string;
}

export default function Logo({
  width = 120,
  height = 32,
  priority = true,
  alt = 'Supermarket logo',
}: LogoProps) {
  return (
    <div className="flex flex-col items-center">
      <Image
        src="/logo.svg"
        alt={alt}
        width={width}
        height={height}
        priority={priority}
      />
      <span className="font-bold uppercase text-sm">Supermarket</span>
    </div>
  );
}
