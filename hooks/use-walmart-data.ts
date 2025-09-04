
'use client';

import { useState, useEffect } from 'react';
import type { 
  DriverAnalysis, ProductAnalysis, RegionAnalysis, 
  TimePattern, KPIMetrics, FilterOptions 
} from '@/lib/types';

export interface WalmartData {
  drivers: DriverAnalysis[];
  products: ProductAnalysis[];
  regions: RegionAnalysis[];
  timePatterns: TimePattern[];
  kpis: KPIMetrics;
}

export interface UseWalmartDataReturn {
  data: WalmartData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useWalmartData(filters?: FilterOptions): UseWalmartDataReturn {
  const [data, setData] = useState<WalmartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/data');
      const result = await response.json();
      
      if (!result?.success) {
        throw new Error(result?.error || 'Failed to fetch data');
      }
      
      // Apply filters if provided
      let filteredData = result?.data?.analysis;
      
      if (filters) {
        // Filter drivers by clusters
        if (filters?.driverClusters?.length) {
          filteredData.drivers = filteredData?.drivers?.filter((driver: DriverAnalysis) => 
            filters?.driverClusters?.includes(driver?.cluster)
          );
        }
        
        // Filter by missing rate range
        if (filters?.minMissingRate !== undefined || filters?.maxMissingRate !== undefined) {
          filteredData.drivers = filteredData?.drivers?.filter((driver: DriverAnalysis) => {
            const rate = driver?.missing_rate || 0;
            return (filters?.minMissingRate === undefined || rate >= filters.minMissingRate) &&
                   (filters?.maxMissingRate === undefined || rate <= filters.maxMissingRate);
          });
        }
        
        // Filter products by categories
        if (filters?.categories?.length) {
          filteredData.products = filteredData?.products?.filter((product: ProductAnalysis) =>
            filters?.categories?.includes(product?.category)
          );
        }
        
        // Filter regions
        if (filters?.regions?.length) {
          filteredData.regions = filteredData?.regions?.filter((region: RegionAnalysis) =>
            filters?.regions?.includes(region?.region)
          );
        }
      }
      
      setData(filteredData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error fetching Walmart data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}
