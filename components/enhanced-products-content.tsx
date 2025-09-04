
'use client';

import { useState } from 'react';
import ProductAnalysisChart from '@/components/product-analysis-chart';
import DashboardFilters from '@/components/dashboard-filters';
import { useWalmartData } from '@/hooks/use-walmart-data';
import { Package, DollarSign, AlertTriangle, TrendingDown } from 'lucide-react';
import type { FilterOptions } from '@/lib/types';

export default function EnhancedProductsContent() {
  const [filters, setFilters] = useState<FilterOptions>({});
  const { data, loading } = useWalmartData(filters);

  if (loading) {
    return (
      <main className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Análise de Produtos & Categorias</h1>
          <p className="text-gray-600">Carregando dados de produtos...</p>
        </div>
      </main>
    );
  }

  if (!data) return null;

  const getTopCategories = () => {
    const categoryStats = data?.products?.reduce((acc: any, product) => {
      const category = product?.category || 'Unknown';
      if (!acc[category]) {
        acc[category] = { 
          category,
          missing: 0, 
          value: 0,
          count: 0,
          totalPrice: 0
        };
      }
      acc[category].missing += product?.missing_count || 0;
      acc[category].value += product?.total_value_lost || 0;
      acc[category].count += 1;
      acc[category].totalPrice += product?.price || 0;
      return acc;
    }, {});

    return Object.values(categoryStats || {})
      ?.sort((a: any, b: any) => b?.missing - a?.missing)
      ?.slice(0, 8);
  };

  const getTopProducts = (limit: number = 8) => {
    return data?.products
      ?.sort((a, b) => (b?.missing_count || 0) - (a?.missing_count || 0))
      ?.slice(0, limit) || [];
  };

  const categories = getTopCategories() as any[];
  const products = getTopProducts();
  
  const totalMissing = data?.products?.reduce((sum, p) => sum + (p?.missing_count || 0), 0) || 0;
  const totalValue = data?.products?.reduce((sum, p) => sum + (p?.total_value_lost || 0), 0) || 0;

  return (
    <main className="flex-1 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Análise de Produtos & Categorias</h1>
        <p className="text-gray-600">
          Análise em tempo real de itens faltantes por tipo de produto, tendências de categoria e avaliação de impacto financeiro
        </p>
      </div>

      {/* Filters */}
      <DashboardFilters 
        currentFilters={filters}
        onFiltersChange={setFilters}
      />

      {/* Key Insights */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Visão Geral da Performance dos Produtos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {categories?.[0] ? `${((categories[0].missing / Math.max(totalMissing, 1)) * 100).toFixed(1)}%` : '0%'}
            </div>
            <div className="text-sm text-gray-600">
              Taxa de Faltas {categories?.[0]?.category || 'Top Categoria'}
            </div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600 mb-1">{totalMissing?.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total de Itens Faltantes</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">
              R$ {(totalValue || 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Valor Total Perdido</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {data?.products?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Linhas de Produtos Afetadas</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Categorias com Mais Faltas</h2>
          <ProductAnalysisChart type="categories" />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Produtos com Mais Faltas</h2>
          <ProductAnalysisChart type="top-products" />
        </div>
      </div>

      {/* Detailed Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Detalhamento por Categoria</h2>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {categories?.map((category: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full bg-blue-500`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{category?.category}</p>
                    <p className="text-sm text-gray-600">
                      Taxa de Faltas: {((category?.missing || 0) / Math.max(totalMissing, 1) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{category?.missing} itens</p>
                  <p className="text-xs text-gray-500">
                    R$ {(category?.value || 0).toLocaleString()} perdido
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Produtos com Mais Faltas</h2>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {products?.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-orange-200 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{product?.product_name}</p>
                  <p className="text-sm text-gray-600">{product?.category}</p>
                  <p className="text-xs text-gray-500">
                    Preço Unitário: R$ {(product?.price || 0).toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-orange-600">{product?.missing_count} itens</p>
                  <p className="text-xs text-gray-500">
                    R$ {(product?.total_value_lost || 0).toFixed(0)} perdido
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recomendações Específicas por Produto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Protocolo para Itens de Alto Valor</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Verificação obrigatória por foto para itens acima de R$ {((categories?.[0]?.totalPrice || 0) / Math.max(categories?.[0]?.count || 1, 1)).toFixed(0)}</li>
              <li>• Assinatura digital obrigatória para categoria {categories?.[0]?.category || 'alto risco'}</li>
              <li>• Embalagem segura separada para itens premium</li>
              <li>• Rastreamento aprimorado para {products?.slice(0, 3)?.map(p => p?.product_name)?.join(', ')}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Medidas Específicas por Categoria</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Alertas de monitoramento de temperatura para itens perecíveis</li>
              <li>• Confirmação de entrega com timestamp para todas as categorias</li>
              <li>• Programas de treinamento de motoristas baseados por categoria</li>
              <li>• Protocolos especiais de manuseio para {categories?.slice(0, 2)?.map((c: any) => c?.category)?.join(' e ')}</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
