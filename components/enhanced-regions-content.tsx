
'use client';

import { useState } from 'react';
import RegionAnalysisChart from '@/components/region-analysis-chart';
import DashboardFilters from '@/components/dashboard-filters';
import { useWalmartData } from '@/hooks/use-walmart-data';
import { MapPin, DollarSign, AlertTriangle, Clock } from 'lucide-react';
import type { FilterOptions } from '@/lib/types';

export default function EnhancedRegionsContent() {
  const [filters, setFilters] = useState<FilterOptions>({});
  const { data, loading } = useWalmartData(filters);

  if (loading) {
    return (
      <main className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Análise Regional & Temporal</h1>
          <p className="text-gray-600">Carregando dados regionais...</p>
        </div>
      </main>
    );
  }

  if (!data) return null;

  const getTimePatterns = () => {
    // Group time patterns into meaningful periods
    const periods = [
      { name: 'Morning (6-12)', start: 6, end: 12 },
      { name: 'Afternoon (12-18)', start: 12, end: 18 },
      { name: 'Evening (18-22)', start: 18, end: 22 },
      { name: 'Night (22-6)', start: 22, end: 24 } // Simplified for now
    ];

    return periods?.map(period => {
      const periodData = data?.timePatterns?.filter(tp => 
        tp?.hour >= period.start && tp?.hour < period.end
      );
      
      const totalMissing = periodData?.reduce((sum, tp) => sum + (tp?.missing_count || 0), 0) || 0;
      const totalOrders = periodData?.reduce((sum, tp) => sum + (tp?.total_orders || 0), 0) || 0;
      
      return {
        period: period.name,
        count: totalMissing,
        total: totalOrders,
        percentage: totalOrders > 0 ? Math.round((totalMissing / totalOrders) * 100) : 0
      };
    });
  };

  const regions = data?.regions?.slice(0, 10) || [];
  const timePatterns = getTimePatterns();
  const topRegion = regions?.[0];
  const totalRegionalMissing = regions?.reduce((sum, r) => sum + (r?.total_missing || 0), 0) || 0;
  
  // Calculate afternoon/evening percentage
  const afternoonEvening = timePatterns?.find(tp => tp?.period?.includes('Afternoon')) || 
                           timePatterns?.find(tp => tp?.period?.includes('Evening'));
  
  return (
    <main className="flex-1 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Análise Regional & Temporal</h1>
        <p className="text-gray-600">
          Distribuição geográfica de incidentes e análise de padrões temporais para implementação estratégica
        </p>
      </div>

      {/* Filters */}
      <DashboardFilters 
        currentFilters={filters}
        onFiltersChange={setFilters}
      />

      {/* Regional Performance Overview */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Visão Geral da Performance Regional</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600 mb-1">
              {topRegion ? `${((topRegion.total_missing / Math.max(totalRegionalMissing, 1)) * 100).toFixed(0)}%` : '0%'}
            </div>
            <div className="text-sm text-gray-600">Participação {topRegion?.region || 'Top Região'}</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {((topRegion?.missing_rate || 0) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Taxa de Faltas {topRegion?.region || 'Top Região'}</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              {timePatterns?.reduce((sum, tp) => sum + (tp?.count || 0), 0) || 0}
            </div>
            <div className="text-sm text-gray-600">Total de Itens Faltantes</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {((regions?.find(r => r?.missing_rate === Math.min(...regions.map(r => r?.missing_rate || 0)))?.missing_rate || 0) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Taxa da Melhor Região</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Análise da Taxa de Faltas por Região</h2>
          <RegionAnalysisChart />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Distribuição Temporal</h2>
          <div className="space-y-4">
            {timePatterns?.map((pattern, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{pattern?.period?.replace('Morning', 'Manhã').replace('Afternoon', 'Tarde').replace('Evening', 'Noite').replace('Night', 'Madrugada')}</p>
                  <p className="text-sm text-gray-600">{pattern?.count} incidentes</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${pattern?.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{pattern?.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Regiões por Número de Incidentes</h2>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {regions?.map((region, index) => {
              const riskLevel = (region?.missing_rate || 0) > 0.04 ? 'red' : 
                               (region?.missing_rate || 0) > 0.025 ? 'orange' : 'blue';
              
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-8 rounded ${
                      riskLevel === 'red' ? 'bg-red-500' : 
                      riskLevel === 'orange' ? 'bg-orange-500' : 'bg-blue-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{region?.region}</p>
                      <p className="text-sm text-gray-600">
                        Taxa de Faltas: {((region?.missing_rate || 0) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{region?.total_missing} itens</p>
                    <p className="text-xs text-gray-500">
                      R$ {(region?.total_value_lost || 0).toLocaleString()} perdido
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Métricas de Performance Regional</h2>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="font-medium text-red-800">Regiões de Alto Risco</span>
              </div>
              <div className="text-sm text-gray-600">
                {regions?.filter(r => (r?.missing_rate || 0) > 0.04)?.length || 0} regiões com &gt;4% de taxa de faltas
              </div>
            </div>
            
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="w-4 h-4 text-orange-600" />
                <span className="font-medium text-orange-800">Regiões de Risco Médio</span>
              </div>
              <div className="text-sm text-gray-600">
                {regions?.filter(r => (r?.missing_rate || 0) > 0.025 && (r?.missing_rate || 0) <= 0.04)?.length || 0} regiões com taxa de faltas entre 2,5-4%
              </div>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-800">Melhor Região</span>
              </div>
              <div className="text-sm text-gray-600">
                {regions?.find(r => r?.missing_rate === Math.min(...regions.map(r => r?.missing_rate || 0)))?.region || 'N/A'} com {((regions?.find(r => r?.missing_rate === Math.min(...regions.map(r => r?.missing_rate || 0)))?.missing_rate || 0) * 100).toFixed(1)}% de taxa
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Plans */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Plano de Ação Específico por Região</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4 border border-red-200">
            <h3 className="font-medium text-red-700 mb-2">🔴 Regiões de Alta Prioridade</h3>
            <div className="mb-3 text-sm font-medium text-gray-700">
              {regions?.filter(r => (r?.missing_rate || 0) > 0.04)?.map(r => r?.region)?.join(', ') || 'Nenhuma identificada'}
            </div>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Implementar supervisores adicionais</li>
              <li>• Implementar alertas de rastreamento GPS</li>
              <li>• Triagem aprimorada de motoristas</li>
              <li>• Protocolos de verificação de clientes</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4 border border-orange-200">
            <h3 className="font-medium text-orange-700 mb-2">🟡 Regiões de Prioridade Média</h3>
            <div className="mb-3 text-sm font-medium text-gray-700">
              {regions?.filter(r => (r?.missing_rate || 0) > 0.025 && (r?.missing_rate || 0) <= 0.04)?.slice(0, 3)?.map(r => r?.region)?.join(', ') || 'Nenhuma identificada'}
            </div>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Aumentar frequência de auditoria</li>
              <li>• Sistema de verificação por foto</li>
              <li>• Monitoramento de performance dos motoristas</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <h3 className="font-medium text-green-700 mb-2">🟢 Estudo de Melhores Práticas</h3>
            <div className="mb-3 text-sm font-medium text-gray-700">
              {regions?.filter(r => (r?.missing_rate || 0) <= 0.025)?.slice(0, 3)?.map(r => r?.region)?.join(', ') || 'Múltiplas regiões'}
            </div>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Documentar processos bem-sucedidos</li>
              <li>• Entrevistar equipes de gestão</li>
              <li>• Replicar estratégias de sucesso</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
