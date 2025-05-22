
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`flex items-center ${className}`}>
      <span className={`font-oceanshore font-bold ${sizeClasses[size]}`}>
        <span className="text-go3-primary">Go3</span>
        <span className="text-go3-accent">Axe</span>
        <span className="text-go3-primary">Pay</span>
      </span>
    </div>
  );
};

export default Logo;
