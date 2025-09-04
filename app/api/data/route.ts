
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { WalmartDataProcessor } from '@/lib/data-processor';
import type { 
  Order, Driver, Product, Customer, MissingItem,
  DriverAnalysis, ProductAnalysis, RegionAnalysis, KPIMetrics
} from '@/lib/types';

export const dynamic = 'force-dynamic';

// CSV parsing utility - handles quoted fields with commas
function parseCSV(csvText: string): any[] {
  const lines = csvText?.trim()?.split('\n');
  const headers = parseCSVLine(lines?.[0] || '')?.map(h => h?.trim());
  
  return lines?.slice(1)?.map(line => {
    const values = parseCSVLine(line)?.map(v => v?.trim()?.replace(/^['"]|['"]$/g, ''));
    const obj: any = {};
    headers?.forEach((header, index) => {
      obj[header] = values?.[index] || '';
    });
    return obj;
  });
}

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"' && !inQuotes) {
      inQuotes = true;
    } else if (char === '"' && inQuotes && nextChar === '"') {
      current += char;
      i++; // skip next quote
    } else if (char === '"' && inQuotes) {
      inQuotes = false;
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current);
  return values;
}

export async function GET(request: Request) {
  try {
    const dataPath = path.join(process.cwd(), 'public', 'data');
    
    // Read all CSV files
    const ordersCSV = await fs.readFile(path.join(dataPath, 'p9fJDbyvQZOG0pR5mJHI_orders.csv'), 'utf8');
    const driversCSV = await fs.readFile(path.join(dataPath, 'ZrBjADYySY6YJpCS5xM8_drivers_data.csv'), 'utf8');
    const productsCSV = await fs.readFile(path.join(dataPath, '6etncolNRnueUWjhJpdU_products_data.csv'), 'utf8');
    const customersCSV = await fs.readFile(path.join(dataPath, 'YvR3oYtSRP60f2jU7pqM_customers_data.csv'), 'utf8');
    const missingItemsCSV = await fs.readFile(path.join(dataPath, '2P9sGZNKQCS1B2UDArRJ_missing_items_data.csv'), 'utf8');
    
    // Parse CSV data
    const rawOrders = parseCSV(ordersCSV);
    const rawDrivers = parseCSV(driversCSV);
    const rawProducts = parseCSV(productsCSV);
    const rawCustomers = parseCSV(customersCSV);
    const rawMissingItems = parseCSV(missingItemsCSV);
    
    // Transform data to proper types
    const orders: Order[] = rawOrders?.map(row => ({
      date: row?.date || '',
      order_id: row?.order_id || '',
      order_amount: row?.order_amount || '',
      region: row?.region || '',
      items_delivered: parseInt(row?.items_delivered || '0'),
      items_missing: parseInt(row?.items_missing || '0'),
      delivery_hour: row?.delivery_hour || '',
      driver_id: row?.driver_id || '',
      customer_id: row?.customer_id || ''
    }));
    
    const drivers: Driver[] = rawDrivers?.map(row => ({
      driver_id: row?.driver_id || '',
      driver_name: row?.driver_name || '',
      age: parseInt(row?.age || '0'),
      trips: parseInt(row?.Trips || '0') // Note: capital T in CSV
    }));
    
    const products: Product[] = rawProducts?.map(row => ({
      product_id: row?.produc_id || '', // Note: typo in CSV header
      product_name: row?.product_name || '',
      category: row?.category || '',
      price: row?.price || ''
    }));
    
    const customers: Customer[] = rawCustomers?.map(row => ({
      customer_id: row?.customer_id || '',
      customer_name: row?.customer_name || '',
      customer_age: parseInt(row?.customer_age || '0')
    }));
    
    const missingItems: MissingItem[] = rawMissingItems?.map(row => ({
      order_id: row?.order_id || '',
      product_id_1: row?.product_id_1 || '',
      product_id_2: row?.product_id_2 || '',
      product_id_3: row?.product_id_3 || ''
    }));
    
    // Perform analysis
    const driverAnalyses = WalmartDataProcessor.analyzeDrivers(orders, drivers);
    const productAnalyses = WalmartDataProcessor.analyzeProducts(orders, products, missingItems);
    const regionAnalyses = WalmartDataProcessor.analyzeRegions(orders);
    const kpis = WalmartDataProcessor.calculateKPIs(orders, driverAnalyses);
    
    // Time pattern analysis
    const timePatterns = orders?.reduce((acc: any, order) => {
      const hour = parseInt(order?.delivery_hour?.split(':')?.[0] || '0');
      if (!acc[hour]) {
        acc[hour] = { missing: 0, total: 0 };
      }
      acc[hour].total++;
      acc[hour].missing += order?.items_missing || 0;
      return acc;
    }, {});
    
    const hourlyPatterns = Object.entries(timePatterns)?.map(([hour, data]: [string, any]) => ({
      hour: parseInt(hour),
      missing_count: data?.missing || 0,
      total_orders: data?.total || 0,
      missing_rate: data?.total > 0 ? (data?.missing || 0) / (data?.total || 1) : 0
    }));
    
    return NextResponse.json({
      success: true,
      data: {
        raw: {
          orders,
          drivers,
          products,
          customers,
          missingItems
        },
        analysis: {
          drivers: driverAnalyses,
          products: productAnalyses,
          regions: regionAnalyses,
          timePatterns: hourlyPatterns,
          kpis
        },
        metadata: {
          totalOrders: orders?.length || 0,
          totalDrivers: drivers?.length || 0,
          totalProducts: products?.length || 0,
          totalCustomers: customers?.length || 0,
          processedAt: new Date().toISOString()
        }
      }
    });
    
  } catch (error) {
    console.error('Data processing error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process data' },
      { status: 500 }
    );
  }
}
