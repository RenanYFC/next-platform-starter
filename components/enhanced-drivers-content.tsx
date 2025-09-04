'use client';

import { useState } from 'react';
import KPICard from '@/components/kpi-card';
import DriverPerformanceChart from '@/components/driver-performance-chart';
import DashboardFilters from '@/components/dashboard-filters';
import { useWalmartData } from '@/hooks/use-walmart-data';
import { Users, UserX, AlertCircle, TrendingUp } from 'lucide-react';
import type { FilterOptions } from '@/lib/types';

export default function EnhancedDriversContent() {
  const [filters, setFilters] = useState<FilterOptions>({});
  const { data, loading } = useWalmartData(filters);

  if (loading) {
    return (
      <main className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Análise de Desempenho dos Motoristas</h1>
          <p className="text-gray-600">Carregando dados dos motoristas...</p>
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

  if (!data) return null;

  const getTopDriversByMissing = (limit: number = 10) => {
    return data?.drivers
      ?.sort((a, b) => (b?.total_missing || 0) - (a?.total_missing || 0))
      ?.slice(0, limit) || [];
  };

  const getClusterStats = () => {
    const clusters = [
      { id: 0, name: 'Risco Moderado', color: 'bg-orange-500' },
      { id: 1, name: 'Melhores Desempenhos', color: 'bg-green-500' },
      { id: 2, name: 'Motoristas Novatos', color: 'bg-yellow-500' },
      { id: 3, name: 'Alto Risco', color: 'bg-red-500' }
    ];

    return clusters?.map(cluster => {
      const clusterDrivers = data?.drivers?.filter(d => d?.cluster === cluster.id);
      const avgMissingRate = clusterDrivers?.length > 0 
        ? clusterDrivers?.reduce((sum, d) => sum + (d?.missing_rate || 0), 0) / clusterDrivers.length
        : 0;

      return {
        ...cluster,
        count: clusterDrivers?.length || 0,
        avg_missing: `${(avgMissingRate * 100).toFixed(1)}%`
      };
    });
  };

  const highRiskDrivers = data?.drivers?.filter(d => d?.cluster === 3 || d?.is_outlier)?.length || 0;
  const topPerformers = data?.drivers?.filter(d => d?.cluster === 1)?.length || 0;
  const outliers = data?.drivers?.filter(d => d?.is_outlier)?.length || 0;

  return (
    <main className="flex-1 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Análise de Desempenho dos Motoristas</h1>
        <p className="text-gray-600">
          Análise em tempo real dos padrões de comportamento dos motoristas, clusters de risco e detecção de outliers
        </p>
      </div>

      {/* Filters */}
      <DashboardFilters 
        currentFilters={filters}
        onFiltersChange={setFilters}
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total de Motoristas Ativos"
          value={data?.drivers?.length?.toString() || '0'}
          icon={Users}
          description="Atualmente entregando na Flórida"
        />
        <KPICard
          title="Motoristas de Alto Risco"
          value={highRiskDrivers?.toString()}
          change={`${((highRiskDrivers / (data?.drivers?.length || 1)) * 100).toFixed(0)}% do total de motoristas`}
          changeType="negative"
          icon={UserX}
          description="Cluster 3 - Atenção imediata necessária"
        />
        <KPICard
          title="Outliers Estatísticos"
          value={outliers?.toString()}
          change="Todos no cluster de alto risco"
          changeType="negative"
          icon={AlertCircle}
          description=">3 desvios padrão acima da média"
        />
        <KPICard
          title="Melhores Desempenhos"
          value={topPerformers?.toString()}
          change={`${((topPerformers / (data?.drivers?.length || 1)) * 100).toFixed(0)}% do total de motoristas`}
          changeType="positive"
          icon={TrendingUp}
          description="0.25% de taxa média de faltas"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Cluster Analysis */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Clusters de Risco de Motoristas</h2>
          <div className="space-y-4">
            {getClusterStats()?.map((cluster, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${cluster?.color}`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{cluster?.name}</p>
                    <p className="text-sm text-gray-600">{cluster?.count} motoristas</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{cluster?.avg_missing}</p>
                  <p className="text-xs text-gray-500">taxa média de faltas</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Problematic Drivers */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Top 10 Motoristas Problemáticos</h2>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {getTopDriversByMissing()?.map((driver, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-red-200 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{driver?.driver_name}</p>
                  <p className="text-sm text-gray-600">{driver?.total_trips} viagens concluídas</p>
                  {driver?.is_outlier && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 mt-1">
                      Outlier Estatístico
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">{((driver?.missing_rate || 0) * 100).toFixed(1)}%</p>
                  <p className="text-xs text-gray-500">{driver?.total_missing} itens faltantes</p>
                  <p className="text-xs text-gray-500">Cluster {driver?.cluster}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Distribuição de Risco dos Motoristas</h2>
          <DriverPerformanceChart type="cluster" />
          <p className="text-sm text-gray-600 mt-3">
            Separação clara entre motoristas de alto risco (Cluster 3) e outros grupos de desempenho
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Principais Motoristas por Itens Faltantes</h2>
          <DriverPerformanceChart type="top-drivers" />
          <p className="text-sm text-gray-600 mt-3">
            A concentração de problemas em um pequeno grupo de motoristas indica questões pontuais
          </p>
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Imediatas para Motoristas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium text-red-700 mb-2">🚨 Alta Prioridade - Motoristas Outliers</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Suspender {outliers} outliers estatísticos enquanto se aguarda investigação</li>
              <li>• Implementação de programa de retreinamento obrigatório</li>
              <li>• Monitoramento aprimorado com rastreamento GPS</li>
              <li>• Verificação por foto para cada entrega</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-orange-700 mb-2">🟡 Média Prioridade - Cluster de Alto Risco</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Revisões semanais de desempenho para o Cluster 3</li>
              <li>• Implementar sistema de duplas com os melhores desempenhos</li>
              <li>• Aumento da frequência de auditorias</li>
              <li>• Planos de melhoria de desempenho</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-green-700 mb-2">🟢 Boas Práticas - Melhores Desempenhos</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Documentar estratégias de sucesso do Cluster 1</li>
              <li>• Programa de mentoria para novos motoristas</li>
              <li>• Incentivos baseados em desempenho</li>
              <li>• Funções de liderança em treinamento regional</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}