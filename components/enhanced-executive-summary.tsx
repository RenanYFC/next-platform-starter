'use client';

import { useState } from 'react';
import InteractiveKPICards from '@/components/interactive-kpi-cards';
import DriverPerformanceChart from '@/components/driver-performance-chart';
import DashboardFilters from '@/components/dashboard-filters';
import { useWalmartData } from '@/hooks/use-walmart-data';
import { 
  AlertTriangle,
  Clock,
  TrendingUp,
  Users
} from 'lucide-react';
import type { FilterOptions } from '@/lib/types';

export default function EnhancedExecutiveSummary() {
  const [filters, setFilters] = useState<FilterOptions>({});
  const { data, loading } = useWalmartData(filters);

  if (loading) {
    return (
      <main className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Resumo Executivo</h1>
          <p className="text-gray-600">Carregando análise abrangente...</p>
        </div>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-32"></div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  const getTopDriversByMissing = (limit: number = 5) => {
    return data?.drivers
      ?.sort((a, b) => (b?.total_missing || 0) - (a?.total_missing || 0))
      ?.slice(0, limit)
      ?.map(driver => ({
        name: driver?.driver_name,
        missing_rate: `${((driver?.missing_rate || 0) * 100).toFixed(1)}%`,
        trips: driver?.total_trips || 0,
        total_missing: driver?.total_missing || 0,
        cluster: driver?.cluster
      })) || [];
  };

  const getTopProductsByMissing = (limit: number = 4) => {
    return data?.products
      ?.sort((a, b) => (b?.missing_count || 0) - (a?.missing_count || 0))
      ?.slice(0, limit) || [];
  };

  const criticalFindings = [
    {
      title: "Detecção de Fraude de Motoristas",
      description: `${data?.drivers?.filter(d => d?.is_outlier)?.length || 0} motoristas identificados como outliers estatísticos com taxas de itens faltantes anormalmente altas. Todos pertencem ao cluster de alto risco que requer auditoria imediata.`,
      borderColor: "border-red-500"
    },
    {
      title: "Categorias Alvo de Alto Valor",
      description: `As categorias ${getTopProductsByMissing(2)?.map(p => p?.category)?.join(' e ')} apresentam as maiores taxas de itens faltantes com impacto financeiro significativo.`,
      borderColor: "border-orange-500"
    },
    {
      title: "Concentração Geográfica",
      description: `${data?.regions?.[0]?.region || 'A principal região'} representa ${(((data?.regions?.[0]?.total_missing || 0) / (data?.drivers?.reduce((sum, d) => sum + (d?.total_missing || 0), 0) || 1)) * 100).toFixed(0)}% de todos os itens faltantes.`,
      borderColor: "border-yellow-500"
    }
  ];

  return (
    <main className="flex-1 p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resumo Executivo</h1>
        <p className="text-gray-600">
          Análise em tempo real do desempenho de entregas com filtros interativos e recomendações estratégicas
        </p>
      </div>

      {/* Filters */}
      <DashboardFilters 
        currentFilters={filters}
        onFiltersChange={setFilters}
      />

      {/* Interactive KPI Grid */}
      <InteractiveKPICards />

      {/* Key Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Critical Findings */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Descobertas Críticas</h2>
          </div>
          
          <div className="space-y-4">
            {criticalFindings?.map((finding, index) => (
              <div key={index} className={`border-l-4 ${finding?.borderColor} pl-4`}>
                <h3 className="font-medium text-gray-900 mb-1">{finding?.title}</h3>
                <p className="text-sm text-gray-600">{finding?.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Overview Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Distribuição de Risco dos Motoristas</h2>
          <DriverPerformanceChart type="cluster" />
          <p className="text-sm text-gray-600 mt-3">
            A clusterização K-Means identificou 4 perfis distintos de motoristas com uma clara separação de risco.
          </p>
        </div>
      </div>

      {/* Data Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Problematic Drivers */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-900">Motoristas de Maior Risco</h2>
          </div>
          <div className="space-y-3">
            {getTopDriversByMissing()?.map((driver, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-red-200 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{driver?.name}</p>
                  <p className="text-sm text-gray-600">{driver?.trips} viagens concluídas</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">{driver?.missing_rate}</p>
                  <p className="text-xs text-gray-500">{driver?.total_missing} itens faltantes</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Metrics */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Análises em Tempo Real</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {data?.drivers?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Motoristas Ativos</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {data?.regions?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Regiões Monitoradas</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {data?.products?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Linhas de Produto</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {data?.drivers?.filter(d => d?.cluster === 1)?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Melhores Desempenhos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Items */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Ações Imediatas Necessárias</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h3 className="font-medium text-gray-900 mb-1">Semana 1</h3>
                <p className="text-sm text-gray-600">
                  Auditar {data?.drivers?.filter(d => d?.is_outlier)?.length || 17} motoristas de alto risco e implementar sistema de verificação por foto
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h3 className="font-medium text-gray-900 mb-1">Semanas 2-3</h3>
                <p className="text-sm text-gray-600">
                  Implementar verificação aprimorada para itens de alto valor em {data?.regions?.slice(0, 3)?.map(r => r?.region)?.join(', ')}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h3 className="font-medium text-gray-900 mb-1">Mês 1</h3>
                <p className="text-sm text-gray-600">
                  Lançar dashboard de monitoramento em tempo real e sistema de sinalização de clientes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}