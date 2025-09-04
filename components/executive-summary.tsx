
'use client';

import KPICard from '@/components/kpi-card';
import { 
  TrendingDown, 
  DollarSign, 
  UserX, 
  MapPin,
  AlertTriangle,
  Clock
} from 'lucide-react';
import Image from 'next/image';

export default function ExecutiveSummary() {
  return (
    <main className="flex-1 p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resumo Executivo</h1>
        <p className="text-gray-600">
          Análise abrangente do desempenho de entregas e recomendações estratégicas para ação imediata
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Taxa de Itens Faltantes"
          value="3,2%"
          change="↑ 0,5% do mês anterior"
          changeType="negative"
          icon={TrendingDown}
          description="Itens não entregues por total de itens"
        />
        <KPICard
          title="Impacto Financeiro"
          value="R$ 4,2M"
          change="↑ R$ 780K do mês anterior"
          changeType="negative"
          icon={DollarSign}
          description="Valor total dos itens faltantes"
        />
        <KPICard
          title="Motoristas de Alto Risco"
          value="17"
          change="Ação imediata necessária"
          changeType="negative"
          icon={UserX}
          description="Outliers estatísticos (>6,2% taxa de faltas)"
        />
        <KPICard
          title="Regiões Críticas"
          value="3"
          change="Orlando, Kissimmee, Winter Park"
          changeType="neutral"
          icon={MapPin}
          description="Maior concentração de incidentes"
        />
      </div>

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
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="font-medium text-gray-900 mb-1">Detecção de Fraude de Motoristas</h3>
              <p className="text-sm text-gray-600">
                17 motoristas identificados como outliers estatísticos com taxas de faltas de até 16,7% 
                (10x a média). Todos pertencem ao cluster de alto risco que requer auditoria imediata.
              </p>
            </div>
            
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-medium text-gray-900 mb-1">Itens Alvo de Alto Valor</h3>
              <p className="text-sm text-gray-600">
                Categorias de Eletrônicos e Carnes & Frutos do Mar apresentam as maiores taxas de faltas. 
                Consoles de videogame e Smart TVs são os alvos principais.
              </p>
            </div>
            
            <div className="border-l-4 border-yellow-500 pl-4">
              <h3 className="font-medium text-gray-900 mb-1">Concentração Geográfica</h3>
              <p className="text-sm text-gray-600">
                A região de Orlando representa 23% de todos os itens faltantes, apesar de ser 
                apenas 15% do total de entregas.
              </p>
            </div>
          </div>
        </div>

        {/* Performance Overview Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Distribuição de Risco dos Motoristas</h2>
          <div className="relative aspect-[4/3]">
            <Image
              src="/charts/unnamed (2).png"
              alt="Clusters de motoristas mostrando distribuição de risco"
              fill
              className="rounded-lg object-contain"
            />
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Clustering K-Means identificou 4 perfis distintos de motoristas com Cluster 3 
            apresentando níveis críticos de risco (6,2% taxa de faltas).
          </p>
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
                  Auditar 17 motoristas de alto risco e implementar sistema de verificação por foto
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h3 className="font-medium text-gray-900 mb-1">Semana 2-3</h3>
                <p className="text-sm text-gray-600">
                  Implementar verificação aprimorada para itens de alto valor em regiões críticas
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
