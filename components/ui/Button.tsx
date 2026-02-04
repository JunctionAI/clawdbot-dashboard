import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  fullWidth = false,
  children, 
  className = '',
  disabled,
  ...props 
}: ButtonProps) {
  // Base classes include min-h-[44px] for touch accessibility on mobile
  const baseClasses = "font-semibold rounded-lg transition-all duration-200 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 active:from-purple-700 active:to-purple-800 text-white shadow-lg hover:shadow-glow",
    secondary: "bg-gray-700 hover:bg-gray-600 active:bg-gray-800 text-white",
    outline: "border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10 active:bg-purple-500/20",
    ghost: "text-gray-400 hover:text-white hover:bg-gray-800/50 active:bg-gray-800/70",
    danger: "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-lg",
  };
  
  // Ensure minimum 44px height for touch targets on all sizes
  const sizeClasses = {
    sm: "px-3 py-2 text-sm min-h-[44px]",
    md: "px-4 py-2.5 text-base min-h-[44px]",
    lg: "px-6 py-3 text-lg min-h-[48px]",
  };

  const widthClass = fullWidth ? "w-full" : "";
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
}
