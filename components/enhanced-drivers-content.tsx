
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Driver Performance Analysis</h1>
          <p className="text-gray-600">Loading driver data...</p>
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
      { id: 0, name: 'Moderate Risk', color: 'bg-orange-500' },
      { id: 1, name: 'Top Performers', color: 'bg-green-500' },
      { id: 2, name: 'Novice Drivers', color: 'bg-yellow-500' },
      { id: 3, name: 'High Risk', color: 'bg-red-500' }
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Driver Performance Analysis</h1>
        <p className="text-gray-600">
          Real-time analysis of driver behavior patterns, risk clusters, and outlier detection
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
          title="Total Active Drivers"
          value={data?.drivers?.length?.toString() || '0'}
          icon={Users}
          description="Currently delivering in Florida"
        />
        <KPICard
          title="High-Risk Drivers"
          value={highRiskDrivers?.toString()}
          change={`${((highRiskDrivers / (data?.drivers?.length || 1)) * 100).toFixed(0)}% of total drivers`}
          changeType="negative"
          icon={UserX}
          description="Cluster 3 - Immediate attention needed"
        />
        <KPICard
          title="Statistical Outliers"
          value={outliers?.toString()}
          change="All in high-risk cluster"
          changeType="negative"
          icon={AlertCircle}
          description=">3 std dev above mean"
        />
        <KPICard
          title="Top Performers"
          value={topPerformers?.toString()}
          change={`${((topPerformers / (data?.drivers?.length || 1)) * 100).toFixed(0)}% of total drivers`}
          changeType="positive"
          icon={TrendingUp}
          description="0.25% avg missing rate"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Cluster Analysis */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Driver Risk Clusters</h2>
          <div className="space-y-4">
            {getClusterStats()?.map((cluster, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${cluster?.color}`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{cluster?.name}</p>
                    <p className="text-sm text-gray-600">{cluster?.count} drivers</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{cluster?.avg_missing}</p>
                  <p className="text-xs text-gray-500">avg missing rate</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Problematic Drivers */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Top 10 Problematic Drivers</h2>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {getTopDriversByMissing()?.map((driver, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-red-200 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{driver?.driver_name}</p>
                  <p className="text-sm text-gray-600">{driver?.total_trips} trips completed</p>
                  {driver?.is_outlier && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 mt-1">
                      Statistical Outlier
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">{((driver?.missing_rate || 0) * 100).toFixed(1)}%</p>
                  <p className="text-xs text-gray-500">{driver?.total_missing} items missing</p>
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Driver Risk Distribution</h2>
          <DriverPerformanceChart type="cluster" />
          <p className="text-sm text-gray-600 mt-3">
            Clear separation between high-risk drivers (Cluster 3) and other performance groups
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Drivers by Missing Items</h2>
          <DriverPerformanceChart type="top-drivers" />
          <p className="text-sm text-gray-600 mt-3">
            Concentration of issues among a small group of drivers indicates targeted problems
          </p>
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Immediate Driver Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium text-red-700 mb-2">🚨 High Priority - Outlier Drivers</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Suspend {outliers} statistical outliers pending investigation</li>
              <li>• Mandatory retraining program implementation</li>
              <li>• Enhanced monitoring with GPS tracking</li>
              <li>• Photo verification for every delivery</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-orange-700 mb-2">🟡 Medium Priority - High Risk Cluster</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Weekly performance reviews for Cluster 3</li>
              <li>• Implement buddy system with top performers</li>
              <li>• Increased audit frequency</li>
              <li>• Performance improvement plans</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-green-700 mb-2">🟢 Best Practices - Top Performers</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Document successful strategies from Cluster 1</li>
              <li>• Mentor program for new drivers</li>
              <li>• Performance-based incentives</li>
              <li>• Regional training leadership roles</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
