
import DashboardLayout from '@/components/dashboard-layout';

export default function StrategyPage() {
  return (
    <DashboardLayout>
      <main className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Plano de Ação Estratégico</h1>
          <p className="text-gray-600">
            Estratégia abrangente para reduzir perdas de entrega e melhorar a integridade operacional
          </p>
        </div>

        {/* Executive Summary */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">R$ 4,2M</div>
              <div className="text-blue-100">Meta de Redução de Perdas Anuais</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">75%</div>
              <div className="text-blue-100">Melhoria Esperada em 6 Meses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">R$ 2,7M</div>
              <div className="text-blue-100">Investimento Total Necessário</div>
            </div>
          </div>
        </div>

        {/* Immediate Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Ações Imediatas (Próximos 30 Dias)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Auditoria de Motoristas Alto Risco',
                description: 'Investigação imediata de 17 outliers estatísticos',
                priority: 'Crítica',
                timeline: '1 semana',
                cost: 'R$ 125K',
                impact: 'Alto'
              },
              {
                title: 'Sistema de Verificação por Foto',
                description: 'Fotos obrigatórias de entrega para motoristas de alto risco',
                priority: 'Alta',
                timeline: '2 semanas',
                cost: 'R$ 375K',
                impact: 'Alto'
              },
              {
                title: 'Sistema de Sinalização de Clientes',
                description: 'Sinalizar clientes com altas taxas de reclamações',
                priority: 'Média',
                timeline: '3 semanas',
                cost: 'R$ 225K',
                impact: 'Médio'
              }
            ].map((action, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                  action?.priority === 'Crítica' ? 'bg-red-100 text-red-700' :
                  action?.priority === 'Alta' ? 'bg-orange-100 text-orange-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  Prioridade {action?.priority}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{action?.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{action?.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Prazo:</span>
                    <span className="font-medium">{action?.timeline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Custo:</span>
                    <span className="font-medium">{action?.cost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Impacto:</span>
                    <span className={`font-medium ${action?.impact === 'Alto' ? 'text-green-600' : 'text-blue-600'}`}>
                      {action?.impact}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Process Improvements */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Melhorias de Processo</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                category: 'Gestão de Motoristas',
                improvements: [
                  'Implementar sistema de pontuação de risco para motoristas',
                  'Verificações aprimoradas de antecedentes para novas contratações',
                  'Programas de incentivos baseados em performance',
                  'Atualizações regulares de treinamento e certificação'
                ]
              },
              {
                category: 'Segurança de Produtos',
                improvements: [
                  'Manuseio especial para eletrônicos de alto valor',
                  'Embalagens à prova de violação para itens premium',
                  'Rastreamento GPS para remessas valiosas',
                  'Requisitos de assinatura digital para pedidos caros'
                ]
              },
              {
                category: 'Operações Regionais',
                improvements: [
                  'Supervisão aumentada na região de Orlando',
                  'Protocolos de entrega baseados em tempo (evitar horários de pico de risco)',
                  'Métricas de responsabilidade do gerente regional',
                  'Compartilhamento de melhores práticas de regiões de baixo risco'
                ]
              }
            ].map((category, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">{category?.category}</h3>
                <ul className="space-y-3">
                  {category?.improvements?.map((improvement, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></div>
                      <span className="text-sm text-gray-600">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Success Metrics */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Métricas de Sucesso & KPIs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">&lt; 1,5%</div>
              <div className="text-sm text-gray-600">Taxa Meta de Itens Faltantes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">90%</div>
              <div className="text-sm text-gray-600">Taxa de Conformidade dos Motoristas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">&lt; 5</div>
              <div className="text-sm text-gray-600">Motoristas de Alto Risco</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">95%</div>
              <div className="text-sm text-gray-600">Satisfação do Cliente</div>
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
