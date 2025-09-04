
'use client';

import KPICard from '@/components/kpi-card';
import { Users, UserX, AlertCircle, TrendingUp } from 'lucide-react';
import Image from 'next/image';

export default function DriversContent() {
  const topDrivers = [
    { name: 'Sarah Miller', missing_rate: '14.2%', trips: 45, total_missing: 127 },
    { name: 'Joseph Williams', missing_rate: '13.8%', trips: 52, total_missing: 134 },
    { name: 'Michael Rodriguez', missing_rate: '12.1%', trips: 38, total_missing: 98 },
    { name: 'Taylor Pope', missing_rate: '16.7%', trips: 23, total_missing: 89 },
    { name: 'David Johnson', missing_rate: '11.5%', trips: 41, total_missing: 92 }
  ];

  const clusters = [
    { name: 'Cluster 3 - Alto Risco', count: 42, avg_missing: '6,2%', color: 'bg-red-500' },
    { name: 'Cluster 0 - Risco Moderado', count: 128, avg_missing: '1,1%', color: 'bg-orange-500' },
    { name: 'Cluster 2 - Baixo Risco/Novatos', count: 95, avg_missing: '0,35%', color: 'bg-yellow-500' },
    { name: 'Cluster 1 - Top Performers', count: 156, avg_missing: '0,25%', color: 'bg-green-500' }
  ];

  return (
    <main className="flex-1 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Análise de Performance dos Motoristas</h1>
        <p className="text-gray-600">
          Análise detalhada dos padrões de comportamento dos motoristas, clusters de risco e detecção de outliers
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Motoristas Ativos"
          value="421"
          icon={Users}
          description="Fazendo entregas na Flórida"
        />
        <KPICard
          title="Motoristas Alto Risco"
          value="42"
          change="10% do total de motoristas"
          changeType="negative"
          icon={UserX}
          description="Cluster 3 - Atenção imediata necessária"
        />
        <KPICard
          title="Outliers Estatísticos"
          value="17"
          change="Todos no cluster de alto risco"
          changeType="negative"
          icon={AlertCircle}
          description=">3 desvios padrão acima da média"
        />
        <KPICard
          title="Top Performers"
          value="156"
          change="37% do total de motoristas"
          changeType="positive"
          icon={TrendingUp}
          description="0,25% taxa média de faltas"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Cluster Analysis */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Clusters de Risco dos Motoristas</h2>
          <div className="space-y-4">
            {clusters?.map((cluster, index) => (
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Top 5 Motoristas Problemáticos</h2>
          <div className="space-y-3">
            {topDrivers?.map((driver, index) => (
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
      </div>

      {/* Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Visualização de Clusters dos Motoristas</h2>
          <div className="relative aspect-[4/3]">
            <Image
              src="/charts/unnamed (2).png"
              alt="Clustering K-Means de motoristas por performance"
              fill
              className="rounded-lg object-contain"
            />
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Clara separação entre motoristas de alto risco (Cluster 3) e outros grupos de performance
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Motoristas por Itens Faltantes</h2>
          <div className="relative aspect-[4/3]">
            <Image
              src="/charts/unnamed (1).png"
              alt="Top 10 motoristas por total de itens faltantes"
              fill
              className="rounded-lg object-contain"
            />
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Concentração de problemas em um pequeno grupo de motoristas indica questões direcionadas
          </p>
        </div>
      </div>
    </main>
  );
}
