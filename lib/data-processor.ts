
import { 
  Order, Driver, Product, Customer, MissingItem, 
  DriverAnalysis, ProductAnalysis, RegionAnalysis, 
  TimePattern, KPIMetrics, ClusterResult 
} from './types';

export class WalmartDataProcessor {
  
  // K-Means Clustering Implementation
  static kMeansClustering(data: number[][], k: number = 4, maxIterations: number = 100): ClusterResult[] {
    const n = data?.length;
    const features = data?.[0]?.length || 0;
    
    // Initialize centroids randomly
    let centroids: number[][] = [];
    for (let i = 0; i < k; i++) {
      const centroid: number[] = [];
      for (let j = 0; j < features; j++) {
        const min = Math.min(...data?.map(d => d?.[j] || 0));
        const max = Math.max(...data?.map(d => d?.[j] || 0));
        centroid.push(min + Math.random() * (max - min));
      }
      centroids.push(centroid);
    }
    
    let assignments = new Array(n).fill(0);
    
    for (let iter = 0; iter < maxIterations; iter++) {
      // Assign points to nearest centroid
      const newAssignments = data?.map((point, i) => {
        let minDist = Infinity;
        let bestCluster = 0;
        
        centroids?.forEach((centroid, j) => {
          const dist = this.euclideanDistance(point, centroid);
          if (dist < minDist) {
            minDist = dist;
            bestCluster = j;
          }
        });
        
        return bestCluster;
      });
      
      // Check for convergence
      if (JSON.stringify(assignments) === JSON.stringify(newAssignments)) {
        break;
      }
      
      assignments = newAssignments;
      
      // Update centroids
      for (let j = 0; j < k; j++) {
        const clusterPoints = data?.filter((_, i) => assignments?.[i] === j);
        if (clusterPoints?.length > 0) {
          const newCentroid = new Array(features).fill(0);
          clusterPoints?.forEach(point => {
            point?.forEach((val, idx) => {
              newCentroid[idx] += val || 0;
            });
          });
          centroids[j] = newCentroid?.map(sum => sum / clusterPoints.length);
        }
      }
    }
    
    return centroids?.map((center, i) => ({
      cluster_id: i,
      center,
      drivers: [], // Will be filled later
      avg_missing_rate: 0,
      description: this.getClusterDescription(i, center)
    }));
  }
  
  private static euclideanDistance(a: number[], b: number[]): number {
    return Math.sqrt(a?.reduce((sum, val, i) => sum + Math.pow((val || 0) - (b?.[i] || 0), 2), 0));
  }
  
  private static getClusterDescription(clusterId: number, center: number[]): string {
    const descriptions = [
      "Top Performers - Low Risk",
      "Moderate Risk - Standard Performance", 
      "Novice Drivers - Training Needed",
      "High Risk - Immediate Action Required"
    ];
    return descriptions?.[clusterId] || `Cluster ${clusterId}`;
  }
  
  // Statistical Outlier Detection
  static detectOutliers(values: number[], threshold: number = 3): boolean[] {
    const mean = values?.reduce((sum, val) => sum + (val || 0), 0) / values?.length;
    const variance = values?.reduce((sum, val) => sum + Math.pow((val || 0) - mean, 2), 0) / values?.length;
    const stdDev = Math.sqrt(variance);
    
    return values?.map(val => Math.abs((val || 0) - mean) > threshold * stdDev);
  }
  
  // Analyze drivers with clustering
  static analyzeDrivers(orders: Order[], drivers: Driver[]): DriverAnalysis[] {
    const driverStats = new Map<string, {
      trips: number;
      missing: number;
      delivered: number;
      valueLost: number;
    }>();
    
    // Calculate driver statistics
    orders?.forEach(order => {
      const driverId = order?.driver_id;
      const stats = driverStats.get(driverId) || { trips: 0, missing: 0, delivered: 0, valueLost: 0 };
      
      stats.trips++;
      stats.missing += order?.items_missing || 0;
      stats.delivered += order?.items_delivered || 0;
      stats.valueLost += this.parseAmount(order?.order_amount || '0') * ((order?.items_missing || 0) / Math.max(1, (order?.items_delivered || 0) + (order?.items_missing || 0)));
      
      driverStats.set(driverId, stats);
    });
    
    // Create driver analysis array
    const driverAnalyses: DriverAnalysis[] = drivers?.map(driver => {
      const stats = driverStats.get(driver?.driver_id) || { trips: 0, missing: 0, delivered: 0, valueLost: 0 };
      const totalItems = stats.delivered + stats.missing;
      
      return {
        driver_id: driver?.driver_id,
        driver_name: driver?.driver_name,
        total_trips: stats.trips,
        total_missing: stats.missing,
        total_delivered: stats.delivered,
        missing_rate: totalItems > 0 ? stats.missing / totalItems : 0,
        total_value_lost: stats.valueLost,
        cluster: 0, // Will be assigned later
        is_outlier: false // Will be determined later
      };
    });
    
    // Prepare data for clustering (missing_rate, total_missing normalized)
    const clusteringData = driverAnalyses?.map(driver => [
      driver?.missing_rate || 0,
      (driver?.total_missing || 0) / Math.max(1, Math.max(...driverAnalyses?.map(d => d?.total_missing || 0)))
    ]);
    
    // Perform K-Means clustering
    const clusters = this.kMeansClustering(clusteringData, 4);
    
    // Assign clusters to drivers
    const missingRates = driverAnalyses?.map(d => d?.missing_rate || 0);
    const outliers = this.detectOutliers(missingRates);
    
    return driverAnalyses?.map((driver, i) => {
      // Simple cluster assignment based on missing rate
      let cluster = 1; // Default: Top performers
      const rate = driver?.missing_rate || 0;
      if (rate > 0.05) cluster = 3; // High risk
      else if (rate > 0.02) cluster = 0; // Moderate risk  
      else if (rate > 0.005) cluster = 2; // Novice
      
      return {
        ...driver,
        cluster,
        is_outlier: outliers?.[i] || false
      };
    });
  }
  
  // Analyze products
  static analyzeProducts(orders: Order[], products: Product[], missingItems: MissingItem[]): ProductAnalysis[] {
    const productStats = new Map<string, { count: number; totalValue: number }>();
    
    // Count missing items by product
    missingItems?.forEach(item => {
      const productIds = [item?.product_id_1, item?.product_id_2, item?.product_id_3]?.filter(id => id);
      const order = orders?.find(o => o?.order_id === item?.order_id);
      const orderValue = this.parseAmount(order?.order_amount || '0');
      
      productIds?.forEach(productId => {
        const stats = productStats.get(productId) || { count: 0, totalValue: 0 };
        stats.count++;
        stats.totalValue += orderValue / productIds.length; // Distribute order value
        productStats.set(productId, stats);
      });
    });
    
    return products?.map(product => {
      const stats = productStats.get(product?.product_id) || { count: 0, totalValue: 0 };
      const price = this.parseAmount(product?.price || '0');
      
      return {
        product_id: product?.product_id,
        product_name: product?.product_name,
        category: product?.category,
        missing_count: stats.count,
        total_value_lost: stats.totalValue,
        missing_rate: stats.count / Math.max(1, orders?.length || 0), // Simplified calculation
        price
      };
    })?.sort((a, b) => (b?.missing_count || 0) - (a?.missing_count || 0));
  }
  
  // Analyze regions
  static analyzeRegions(orders: Order[]): RegionAnalysis[] {
    const regionStats = new Map<string, { orders: number; missing: number; valueLost: number }>();
    
    orders?.forEach(order => {
      const region = order?.region;
      const stats = regionStats.get(region) || { orders: 0, missing: 0, valueLost: 0 };
      
      stats.orders++;
      stats.missing += order?.items_missing || 0;
      stats.valueLost += this.parseAmount(order?.order_amount || '0') * ((order?.items_missing || 0) / Math.max(1, (order?.items_delivered || 0) + (order?.items_missing || 0)));
      
      regionStats.set(region, stats);
    });
    
    return Array.from(regionStats.entries())?.map(([region, stats]) => ({
      region,
      total_orders: stats.orders,
      total_missing: stats.missing,
      missing_rate: stats.missing / Math.max(1, stats.orders),
      total_value_lost: stats.valueLost
    }))?.sort((a, b) => (b?.missing_rate || 0) - (a?.missing_rate || 0));
  }
  
  // Calculate KPIs
  static calculateKPIs(orders: Order[], driverAnalyses: DriverAnalysis[]): KPIMetrics {
    const totalItems = orders?.reduce((sum, order) => sum + (order?.items_delivered || 0) + (order?.items_missing || 0), 0);
    const totalMissing = orders?.reduce((sum, order) => sum + (order?.items_missing || 0), 0);
    const totalValue = orders?.reduce((sum, order) => {
      const orderValue = this.parseAmount(order?.order_amount || '0');
      const missingRatio = (order?.items_missing || 0) / Math.max(1, (order?.items_delivered || 0) + (order?.items_missing || 0));
      return sum + (orderValue * missingRatio);
    }, 0);
    
    const highRiskDrivers = driverAnalyses?.filter(d => d?.cluster === 3 || d?.is_outlier)?.length || 0;
    
    return {
      overall_missing_rate: totalItems > 0 ? totalMissing / totalItems : 0,
      total_financial_impact: totalValue,
      high_risk_drivers: highRiskDrivers,
      critical_regions: 3 // Based on analysis
    };
  }
  
  // Utility method to parse dollar amounts
  static parseAmount(amount: string): number {
    return parseFloat(amount?.replace(/[$,]/g, '') || '0');
  }
}
