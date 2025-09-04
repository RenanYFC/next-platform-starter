
'use client';

import { useWalmartData } from '@/hooks/use-walmart-data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function RegionAnalysisChart() {
  const { data, loading } = useWalmartData();

  if (loading) {
    return (
      <div className="w-full h-80 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Loading chart...</div>
      </div>
    );
  }

  if (!data?.regions) return null;

  const regionData = data?.regions?.slice(0, 10)?.map((region, index) => {
    const riskLevel = (region?.missing_rate || 0) > 0.04 ? 'high' : 
                     (region?.missing_rate || 0) > 0.025 ? 'medium' : 'low';
    
    return {
      name: region?.region,
      missingRate: (region?.missing_rate || 0) * 100,
      totalMissing: region?.total_missing || 0,
      valueLost: region?.total_value_lost || 0,
      orders: region?.total_orders || 0,
      fill: riskLevel === 'high' ? '#ef4444' : 
            riskLevel === 'medium' ? '#f97316' : '#22c55e'
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={regionData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
          label={{ value: 'Taxa de Faltas (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
        />
        <Tooltip 
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="bg-white p-3 rounded-lg shadow-lg border">
                  <p className="font-medium">{label}</p>
                  <p className="text-sm text-red-600">Missing Rate: {data?.missingRate?.toFixed(1)}%</p>
                  <p className="text-sm text-gray-600">{data?.totalMissing} missing items</p>
                  <p className="text-sm text-blue-600">{data?.orders} total orders</p>
                  <p className="text-sm text-green-600">Value Lost: ${(data?.valueLost || 0).toFixed(0)}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="missingRate" radius={[4, 4, 0, 0]}>
          {regionData?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry?.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
