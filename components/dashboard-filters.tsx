'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Filter, X, RotateCcw } from 'lucide-react';
import type { FilterOptions } from '@/lib/types';

interface DashboardFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

export default function DashboardFilters({ onFiltersChange, currentFilters }: DashboardFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const regions = ['Orlando', 'Kissimmee', 'Winter Park', 'Sanford', 'Altamonte Springs', 'Apopka', 'Clermont'];
  const clusters = [
    { id: 0, name: 'Risco Moderado' },
    { id: 1, name: 'Melhores Desempenhos' }, 
    { id: 2, name: 'Motoristas Novatos' },
    { id: 3, name: 'Alto Risco' }
  ];

  const handleRegionChange = (region: string) => {
    const currentRegions = currentFilters?.regions || [];
    const newRegions = region === 'all' ? [] : 
      currentRegions?.includes(region) 
        ? currentRegions?.filter(r => r !== region)
        : [...currentRegions, region];
    
    onFiltersChange({
      ...currentFilters,
      regions: newRegions?.length === 0 ? undefined : newRegions
    });
  };

  const handleClusterChange = (clusterId: string) => {
    const currentClusters = currentFilters?.driverClusters || [];
    const id = parseInt(clusterId);
    const newClusters = clusterId === 'all' ? [] :
      currentClusters?.includes(id)
        ? currentClusters?.filter(c => c !== id)
        : [...currentClusters, id];
    
    onFiltersChange({
      ...currentFilters,
      driverClusters: newClusters?.length === 0 ? undefined : newClusters
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = !!(
    currentFilters?.regions?.length || 
    currentFilters?.driverClusters?.length ||
    currentFilters?.minMissingRate !== undefined ||
    currentFilters?.maxMissingRate !== undefined
  );

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-gray-900">Filtros</span>
            {hasActiveFilters && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {(currentFilters?.regions?.length || 0) + 
                 (currentFilters?.driverClusters?.length || 0) +
                 (currentFilters?.minMissingRate !== undefined ? 1 : 0) +
                 (currentFilters?.maxMissingRate !== undefined ? 1 : 0)} ativos
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters}
                className="text-blue-600 hover:bg-blue-100"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Limpar Tudo
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 hover:bg-blue-100"
            >
              {isExpanded ? 'Ocultar' : 'Mostrar'} Filtros
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Region Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Regiões</label>
              <Select onValueChange={handleRegionChange}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Selecione as regiões" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Regiões</SelectItem>
                  {regions?.map(region => (
                    <SelectItem key={region} value={region}>
                      {region} {currentFilters?.regions?.includes(region) && '✓'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-2 flex flex-wrap gap-1">
                {currentFilters?.regions?.map(region => (
                  <Badge 
                    key={region} 
                    variant="secondary" 
                    className="text-xs bg-blue-100 text-blue-800"
                  >
                    {region}
                    <X 
                      className="w-3 h-3 ml-1 cursor-pointer" 
                      onClick={() => handleRegionChange(region)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Cluster Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Clusters de Motoristas</label>
              <Select onValueChange={handleClusterChange}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Selecione os clusters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Clusters</SelectItem>
                  {clusters?.map(cluster => (
                    <SelectItem key={cluster.id} value={cluster.id.toString()}>
                      {cluster.name} {currentFilters?.driverClusters?.includes(cluster.id) && '✓'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-2 flex flex-wrap gap-1">
                {currentFilters?.driverClusters?.map(clusterId => {
                  const cluster = clusters?.find(c => c.id === clusterId);
                  return (
                    <Badge 
                      key={clusterId} 
                      variant="secondary" 
                      className="text-xs bg-orange-100 text-orange-800"
                    >
                      {cluster?.name}
                      <X 
                        className="w-3 h-3 ml-1 cursor-pointer" 
                        onClick={() => handleClusterChange(clusterId.toString())}
                      />
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}