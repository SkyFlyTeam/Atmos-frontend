import React from 'react';
import Image from 'next/image';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ width = 120, height = 60, className = "w-auto h-12" }) => {
  return (
    <Image
      src="/images/logo.png"
      alt="Atmos Logo"
      width={width}
      height={height}
      className={className}
    />
  );
};

export default Logo;