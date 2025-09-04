
'use client';

import { useWalmartData } from '@/hooks/use-walmart-data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ProductAnalysisChartProps {
  type?: 'categories' | 'top-products';
}

export default function ProductAnalysisChart({ type = 'categories' }: ProductAnalysisChartProps) {
  const { data, loading } = useWalmartData();

  if (loading) {
    return (
      <div className="w-full h-80 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Loading chart...</div>
      </div>
    );
  }

  if (!data?.products) return null;

  const colors = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#FF6363', '#80D8C3', '#A19AD3', '#72BF78'];

  if (type === 'categories') {
    // Group by category
    const categoryStats = data?.products?.reduce((acc: any, product) => {
      const category = product?.category || 'Unknown';
      if (!acc[category]) {
        acc[category] = { 
          category,
          missing: 0, 
          value: 0,
          count: 0
        };
      }
      acc[category].missing += product?.missing_count || 0;
      acc[category].value += product?.total_value_lost || 0;
      acc[category].count += 1;
      return acc;
    }, {});

    const categoryData = Object.values(categoryStats || {})
      ?.sort((a: any, b: any) => b?.missing - a?.missing)
      ?.slice(0, 8);

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            dataKey="category" 
            tickLine={false}
            tick={{ fontSize: 10 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            tickLine={false}
            tick={{ fontSize: 10 }}
            label={{ value: 'Missing Items', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
          />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 rounded-lg shadow-lg border">
                    <p className="font-medium">{label}</p>
                    <p className="text-sm text-red-600">{data?.missing} missing items</p>
                    <p className="text-sm text-gray-600">
                      Value Lost: ${(data?.value || 0).toLocaleString()}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="missing" radius={[4, 4, 0, 0]}>
            {categoryData?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'top-products') {
    const topProducts = data?.products
      ?.sort((a, b) => (b?.missing_count || 0) - (a?.missing_count || 0))
      ?.slice(0, 10)
      ?.map((product, index) => ({
        name: product?.product_name?.length > 20 
          ? product?.product_name?.substring(0, 20) + '...'
          : product?.product_name,
        missing: product?.missing_count || 0,
        value: product?.total_value_lost || 0,
        category: product?.category,
        fill: colors[index % colors.length]
      }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={topProducts} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            tickLine={false}
            tick={{ fontSize: 9 }}
            angle={-45}
            textAnchor="end"
            interval={0}
            height={60}
          />
          <YAxis 
            tickLine={false}
            tick={{ fontSize: 10 }}
            label={{ value: 'Missing Count', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
          />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 rounded-lg shadow-lg border">
                    <p className="font-medium">{label}</p>
                    <p className="text-sm text-gray-600">{data?.category}</p>
                    <p className="text-sm text-red-600">{data?.missing} missing items</p>
                    <p className="text-sm text-green-600">
                      Value: ${(data?.value || 0).toFixed(0)}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="missing" radius={[4, 4, 0, 0]}>
            {topProducts?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry?.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return null;
}
