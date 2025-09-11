import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md', 
  showText = true 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Dancing Skeleton SVG */}
      <svg 
        className={`${sizeClasses[size]} text-gray-900`}
        viewBox="0 0 100 120" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Skeleton Body */}
        {/* Skull */}
        <circle cx="50" cy="25" r="12" stroke="currentColor" strokeWidth="2" fill="none"/>
        <circle cx="46" cy="22" r="1.5" fill="currentColor"/>
        <circle cx="54" cy="22" r="1.5" fill="currentColor"/>
        <path d="M46 28 Q50 32 54 28" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        
        {/* Spine */}
        <line x1="50" y1="37" x2="50" y2="65" stroke="currentColor" strokeWidth="2"/>
        
        {/* Rib Cage */}
        <ellipse cx="50" cy="45" rx="8" ry="12" stroke="currentColor" strokeWidth="2" fill="none"/>
        
        {/* Pelvis */}
        <ellipse cx="50" cy="70" rx="6" ry="8" stroke="currentColor" strokeWidth="2" fill="none"/>
        
        {/* Left Arm - Raised */}
        <line x1="42" y1="40" x2="30" y2="25" stroke="currentColor" strokeWidth="2"/>
        <line x1="30" y1="25" x2="25" y2="15" stroke="currentColor" strokeWidth="2"/>
        {/* Left Hand */}
        <circle cx="25" cy="15" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <line x1="23" y1="13" x2="22" y2="10" stroke="currentColor" strokeWidth="1"/>
        <line x1="25" y1="12" x2="24" y2="9" stroke="currentColor" strokeWidth="1"/>
        <line x1="27" y1="13" x2="28" y2="10" stroke="currentColor" strokeWidth="1"/>
        
        {/* Right Arm - Higher */}
        <line x1="58" y1="40" x2="70" y2="20" stroke="currentColor" strokeWidth="2"/>
        <line x1="70" y1="20" x2="75" y2="10" stroke="currentColor" strokeWidth="2"/>
        {/* Right Hand */}
        <circle cx="75" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <line x1="73" y1="8" x2="72" y2="5" stroke="currentColor" strokeWidth="1"/>
        <line x1="75" y1="7" x2="74" y2="4" stroke="currentColor" strokeWidth="1"/>
        <line x1="77" y1="8" x2="78" y2="5" stroke="currentColor" strokeWidth="1"/>
        
        {/* Left Leg - Bent/Kicking */}
        <line x1="46" y1="78" x2="40" y2="95" stroke="currentColor" strokeWidth="2"/>
        <line x1="40" y1="95" x2="35" y2="110" stroke="currentColor" strokeWidth="2"/>
        {/* Left Foot */}
        <ellipse cx="35" cy="115" rx="4" ry="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        
        {/* Right Leg - Supporting */}
        <line x1="54" y1="78" x2="60" y2="100" stroke="currentColor" strokeWidth="2"/>
        <line x1="60" y1="100" x2="65" y2="115" stroke="currentColor" strokeWidth="2"/>
        {/* Right Foot */}
        <ellipse cx="65" cy="118" rx="4" ry="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      </svg>
      
      {/* MACABRE Text */}
      {showText && (
        <span className={`font-bold text-gray-900 tracking-tight ${textSizes[size]}`}>
          MACABRE
        </span>
      )}
    </div>
  );
};

export default Logo;
