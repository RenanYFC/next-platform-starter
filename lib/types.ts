
// Walmart Delivery Analysis Types

export interface Order {
  date: string;
  order_id: string;
  order_amount: string;
  region: string;
  items_delivered: number;
  items_missing: number;
  delivery_hour: string;
  driver_id: string;
  customer_id: string;
}

export interface Driver {
  driver_id: string;
  driver_name: string;
  age: number;
  trips: number;
}

export interface Product {
  product_id: string;
  product_name: string;
  category: string;
  price: string;
}

export interface Customer {
  customer_id: string;
  customer_name: string;
  customer_age: number;
}

export interface MissingItem {
  order_id: string;
  product_id_1: string;
  product_id_2: string;
  product_id_3: string;
}

// Analysis Types
export interface DriverAnalysis {
  driver_id: string;
  driver_name: string;
  total_trips: number;
  total_missing: number;
  total_delivered: number;
  missing_rate: number;
  total_value_lost: number;
  cluster: number;
  is_outlier: boolean;
}

export interface ProductAnalysis {
  product_id: string;
  product_name: string;
  category: string;
  missing_count: number;
  total_value_lost: number;
  missing_rate: number;
  price: number;
}

export interface RegionAnalysis {
  region: string;
  total_orders: number;
  total_missing: number;
  missing_rate: number;
  total_value_lost: number;
}

export interface TimePattern {
  hour: number;
  missing_count: number;
  total_orders: number;
  missing_rate: number;
}

export interface KPIMetrics {
  overall_missing_rate: number;
  total_financial_impact: number;
  high_risk_drivers: number;
  critical_regions: number;
}

export interface ClusterResult {
  cluster_id: number;
  center: number[];
  drivers: DriverAnalysis[];
  avg_missing_rate: number;
  description: string;
}

// Filter Types
export interface FilterOptions {
  regions?: string[];
  dateRange?: DateRange;
  driverClusters?: number[];
  categories?: string[];
  minMissingRate?: number;
  maxMissingRate?: number;
}

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

// Chart Data Types
export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
  category?: string;
}
