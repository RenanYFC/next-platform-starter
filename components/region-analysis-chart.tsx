'use client';

import { useWalmartData } from '@/hooks/use-walmart-data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function GraficoAnaliseRegiao() {
  const { data, loading } = useWalmartData();

  if (loading) {
    return (
      <div className="w-full h-80 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Carregando gráfico...</div>
      </div>
    );
  }

  if (!data?.regions) return null;

  const dadosRegiao = data?.regions?.slice(0, 10)?.map((regiao, index) => {
    const nivelRisco = (regiao?.missing_rate || 0) > 0.04 ? 'alto' : 
                       (regiao?.missing_rate || 0) > 0.025 ? 'medio' : 'baixo';
    
    return {
      nome: regiao?.region,
      taxaFaltas: (regiao?.missing_rate || 0) * 100,
      totalFaltantes: regiao?.total_missing || 0,
      valorPerdido: regiao?.total_value_lost || 0,
      pedidos: regiao?.total_orders || 0,
      cor: nivelRisco === 'alto' ? '#ef4444' : 
           nivelRisco === 'medio' ? '#f97316' : '#22c55e'
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={dadosRegiao} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis 
          dataKey="nome" 
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
              const dadosItem = payload[0].payload;
              return (
                <div className="bg-white p-3 rounded-lg shadow-lg border">
                  <p className="font-medium">{label}</p>
                  <p className="text-sm text-red-600">Taxa de Faltas: {dadosItem?.taxaFaltas?.toFixed(1)}%</p>
                  <p className="text-sm text-gray-600">{dadosItem?.totalFaltantes} itens faltantes</p>
                  <p className="text-sm text-blue-600">{dadosItem?.pedidos} pedidos totais</p>
                  <p className="text-sm text-green-600">Valor Perdido: R$ {(dadosItem?.valorPerdido || 0).toFixed(0)}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="taxaFaltas" radius={[4, 4, 0, 0]}>
          {dadosRegiao?.map((item, index) => (
            <Cell key={`cell-${index}`} fill={item?.cor} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}