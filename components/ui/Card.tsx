import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function Card({ children, className = '', hover = false, gradient = false, onClick, style }: CardProps) {
  const baseClasses = "bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-gray-700/50 transition-all duration-300";
  const hoverClasses = hover ? "hover:border-purple-500/50 hover:shadow-glow cursor-pointer hover:-translate-y-1" : "";
  const gradientClasses = gradient ? "bg-gradient-to-br from-gray-800/50 to-gray-900/50" : "";
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${gradientClasses} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return (
    <h3 className={`text-lg font-semibold text-white ${className}`}>
      {children}
    </h3>
  );
}

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function CardDescription({ children, className = '' }: CardDescriptionProps) {
  return (
    <p className={`text-sm text-gray-400 ${className}`}>
      {children}
    </p>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
