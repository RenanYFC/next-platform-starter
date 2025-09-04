
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Users, 
  Package, 
  MapPin, 
  Target,
  Calendar,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    title: 'Resumo Executivo',
    href: '/',
    icon: Home,
    description: 'Métricas principais e visão geral'
  },
  {
    title: 'Análise de Motoristas',
    href: '/drivers',
    icon: Users,
    description: 'Clusters de performance e outliers'
  },
  {
    title: 'Análise de Produtos',
    href: '/products',
    icon: Package,
    description: 'Itens faltantes e categorias'
  },
  {
    title: 'Insights Regionais',
    href: '/regions',
    icon: MapPin,
    description: 'Padrões geográficos'
  },
  {
    title: 'Plano Estratégico',
    href: '/strategy',
    icon: Target,
    description: 'Recomendações e ações'
  },
  {
    title: 'Implementação',
    href: '/timeline',
    icon: Calendar,
    description: 'Cronograma e marcos'
  }
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className={cn(
      'fixed left-0 top-0 z-40 h-screen bg-gradient-to-b from-blue-900 to-blue-800 border-r border-blue-700 transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-blue-700">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-900" />
            </div>
            <div>
              <h1 className="text-white font-bold text-sm">Walmart</h1>
              <p className="text-blue-200 text-xs">Insights de Entregas</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-md hover:bg-blue-800 text-blue-200 hover:text-white transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3">
        <div className="space-y-2">
          {navItems?.map((item) => {
            const isActive = pathname === item?.href;
            const Icon = item?.icon;

            return (
              <Link
                key={item?.href}
                href={item?.href}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-blue-700 text-white shadow-sm'
                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <div className="flex-1">
                    <div className="font-medium">{item?.title}</div>
                    <div className="text-xs text-blue-200 mt-0.5">{item?.description}</div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-blue-800 rounded-lg p-3 border border-blue-600">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span className="text-white font-medium text-xs">Critical Alert</span>
            </div>
            <p className="text-blue-100 text-xs">
              17 high-risk drivers identified requiring immediate action
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
