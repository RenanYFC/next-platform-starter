
'use client';

import { useWalmartData } from '@/hooks/use-walmart-data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, Cell } from 'recharts';

interface DriverPerformanceChartProps {
  type?: 'cluster' | 'top-drivers' | 'scatter';
}

export default function DriverPerformanceChart({ type = 'cluster' }: DriverPerformanceChartProps) {
  const { data, loading } = useWalmartData();

  if (loading) {
    return (
      <div className="w-full h-80 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Loading chart...</div>
      </div>
    );
  }

  if (!data?.drivers) return null;

  if (type === 'cluster') {
    // Group drivers by cluster
    const clusterData = [0, 1, 2, 3].map(clusterId => {
      const clusterDrivers = data.drivers?.filter(d => d?.cluster === clusterId);
      const avgMissingRate = clusterDrivers?.length > 0 
        ? clusterDrivers.reduce((sum, d) => sum + (d?.missing_rate || 0), 0) / clusterDrivers.length
        : 0;
      
      const descriptions = [
        "Moderate Risk",
        "Top Performers", 
        "Novice Drivers",
        "High Risk"
      ];

      return {
        cluster: `Cluster ${clusterId}`,
        name: descriptions[clusterId],
        drivers: clusterDrivers?.length || 0,
        avgMissingRate: avgMissingRate * 100,
        fill: clusterId === 3 ? '#ef4444' : clusterId === 0 ? '#f97316' : clusterId === 2 ? '#eab308' : '#22c55e'
      };
    });

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={clusterData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            tickLine={false}
            tick={{ fontSize: 10 }}
            interval="preserveStartEnd"
          />
          <YAxis 
            tickLine={false}
            tick={{ fontSize: 10 }}
            label={{ value: 'Missing Rate (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
          />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 rounded-lg shadow-lg border">
                    <p className="font-medium">{label}</p>
                    <p className="text-sm text-gray-600">{data?.drivers} drivers</p>
                    <p className="text-sm text-blue-600">
                      Avg Missing Rate: {data?.avgMissingRate?.toFixed(1)}%
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="avgMissingRate" radius={[4, 4, 0, 0]}>
            {clusterData?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry?.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'top-drivers') {
    const topDrivers = data?.drivers
      ?.sort((a, b) => (b?.total_missing || 0) - (a?.total_missing || 0))
      ?.slice(0, 10)
      ?.map(driver => ({
        name: driver?.driver_name?.substring(0, 20) + (driver?.driver_name?.length > 20 ? '...' : ''),
        missing: driver?.total_missing || 0,
        rate: (driver?.missing_rate || 0) * 100,
        trips: driver?.total_trips || 0
      }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={topDrivers} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
                    <p className="text-sm text-gray-600">{data?.trips} trips</p>
                    <p className="text-sm text-orange-600">Rate: {data?.rate?.toFixed(1)}%</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="missing" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return null;
}
