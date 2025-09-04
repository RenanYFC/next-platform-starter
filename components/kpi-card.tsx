
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ElementType;
  className?: string;
  description?: string;
}

export default function KPICard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon, 
  className,
  description 
}: KPICardProps) {
  return (
    <div className={cn(
      'bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow',
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mb-2">{description}</p>
          )}
          {change && (
            <div className={cn(
              'text-sm font-medium flex items-center',
              changeType === 'positive' && 'text-green-600',
              changeType === 'negative' && 'text-red-600',
              changeType === 'neutral' && 'text-gray-600'
            )}>
              {change}
            </div>
          )}
        </div>
        <div className={cn(
          'w-12 h-12 rounded-lg flex items-center justify-center',
          'bg-gradient-to-br from-blue-50 to-blue-100'
        )}>
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );
}
