'use client';

import React, { useState, createContext, useContext } from 'react';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
  onChange?: (value: string) => void;
}

export function Tabs({ defaultValue, children, className = '', onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleChange = (value: string) => {
    setActiveTab(value);
    onChange?.(value);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
  vertical?: boolean;
}

export function TabsList({ children, className = '', vertical = false }: TabsListProps) {
  return (
    <div
      role="tablist"
      className={`
        ${vertical ? 'flex flex-col space-y-1' : 'flex space-x-1'} 
        bg-gray-800/50 p-1 rounded-lg
        ${className}
      `}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function TabsTrigger({ value, children, icon, disabled = false, className = '' }: TabsTriggerProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => !disabled && setActiveTab(value)}
      className={`
        flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
        ${isActive 
          ? 'bg-purple-600 text-white shadow-lg' 
          : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className = '' }: TabsContentProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');

  const { activeTab } = context;

  if (activeTab !== value) return null;

  return (
    <div role="tabpanel" className={`animate-fade-in ${className}`}>
      {children}
    </div>
  );
}

// Vertical sidebar navigation for settings
interface SettingsNavProps {
  items: { id: string; label: string; icon: React.ReactNode; badge?: string }[];
  activeItem: string;
  onSelect: (id: string) => void;
  className?: string;
}

export function SettingsNav({ items, activeItem, onSelect, className = '' }: SettingsNavProps) {
  return (
    <nav className={`space-y-1 ${className}`}>
      {items.map((item) => {
        const isActive = activeItem === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`
              w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
              ${isActive 
                ? 'bg-purple-600/20 text-purple-400 border-l-2 border-purple-500' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }
            `}
          >
            <span className="w-5 h-5">{item.icon}</span>
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <span className="px-2 py-0.5 text-xs font-semibold bg-purple-600 text-white rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
