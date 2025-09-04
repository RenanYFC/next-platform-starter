'use client';

import { useState } from 'react';
import KPICard from '@/components/kpi-card';
import { useWalmartData } from '@/hooks/use-walmart-data';
import { 
  TrendingDown, 
  DollarSign, 
  UserX, 
  MapPin,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function InteractiveKPICards() {
  const { data, loading, error, refetch } = useWalmartData();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-red-800 font-medium">Erro ao carregar os dados</h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <Button onClick={refetch} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const criticalRegions = data?.regions?.slice(0, 3)?.map(r => r?.region)?.join(', ');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <KPICard
        title="Taxa Geral de Itens Faltantes"
        value={formatPercentage(data?.kpis?.overall_missing_rate || 0)}
        change={`↑ ${((data?.kpis?.overall_missing_rate || 0) * 100 / 2.7).toFixed(1)}% da linha de base`}
        changeType="negative"
        icon={TrendingDown}
        description="Itens não entregues por total de itens"
      />
      <KPICard
        title="Impacto Financeiro"
        value={formatCurrency(data?.kpis?.total_financial_impact || 0)}
        change="Valor total estimado perdido"
        changeType="negative"
        icon={DollarSign}
        description="Valor total dos itens faltantes"
      />
      <KPICard
        title="Motoristas de Alto Risco"
        value={data?.kpis?.high_risk_drivers?.toString() || '0'}
        change="Ação imediata necessária"
        changeType="negative"
        icon={UserX}
        description="Outliers estatísticos e cluster de alto risco"
      />
      <KPICard
        title="Regiões Críticas"
        value={data?.kpis?.critical_regions?.toString() || '0'}
        change={criticalRegions || 'Múltiplas regiões afetadas'}
        changeType="neutral"
        icon={MapPin}
        description="Maior concentração de incidentes"
      />
    </div>
  );
}