
import DashboardLayout from '@/components/dashboard-layout';

export default function TimelinePage() {
  return (
    <DashboardLayout>
      <main className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cronograma de Implementação</h1>
          <p className="text-gray-600">
            Roteiro detalhado para executar o plano estratégico com marcos, recursos e mitigação de riscos
          </p>
        </div>

        {/* Timeline Overview */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Visão Geral do Projeto</h2>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Concluído</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Em Progresso</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span>Planejado</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">24 semanas</div>
              <div className="text-sm text-gray-600">Duração Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">R$ 3,5M</div>
              <div className="text-sm text-gray-600">Orçamento Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">16</div>
              <div className="text-sm text-gray-600">Membros da Equipe</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">4</div>
              <div className="text-sm text-gray-600">Fases de Implementação</div>
            </div>
          </div>
        </div>

        {/* Detailed Timeline */}
        <div className="space-y-6 mb-8">
          {[
            {
              phase: 'Fase 1: Resposta à Crise',
              duration: 'Semanas 1-2',
              status: 'critical',
              budget: 'R$ 500K',
              milestones: [
                { task: 'Auditar 17 motoristas de alto risco', deadline: 'Semana 1' },
                { task: 'Implementar verificação de foto emergencial', deadline: 'Semana 1' },
                { task: 'Implementar monitoramento aprimorado em Orlando', deadline: 'Semana 2' },
                { task: 'Suspender motoristas problemáticos aguardando investigação', deadline: 'Semana 2' }
              ]
            },
            {
              phase: 'Fase 2: Implementação do Sistema',
              duration: 'Semanas 3-8',
              status: 'high',
              budget: 'R$ 1,25M',
              milestones: [
                { task: 'Implementar sistema abrangente de fotos', deadline: 'Semana 4' },
                { task: 'Implementar sistema de sinalização de clientes', deadline: 'Semana 5' },
                { task: 'Implementar alertas de rastreamento GPS', deadline: 'Semana 6' },
                { task: 'Lançar dashboard de monitoramento em tempo real', deadline: 'Semana 8' }
              ]
            },
            {
              phase: 'Fase 3: Otimização de Processos',
              duration: 'Semanas 9-16',
              status: 'medium',
              budget: 'R$ 1M',
              milestones: [
                { task: 'Implementar sistema de análise preditiva', deadline: 'Semana 12' },
                { task: 'Implementar programa de treinamento aprimorado', deadline: 'Semana 14' },
                { task: 'Padronização de melhores práticas regionais', deadline: 'Semana 16' },
                { task: 'Lançar programa de incentivos de performance', deadline: 'Semana 16' }
              ]
            },
            {
              phase: 'Fase 4: Melhoria Contínua',
              duration: 'Semanas 17-24',
              status: 'low',
              budget: 'R$ 750K',
              milestones: [
                { task: 'Otimização completa do sistema', deadline: 'Semana 20' },
                { task: 'Detecção avançada de fraude com ML', deadline: 'Semana 22' },
                { task: 'Planejamento de expansão regional', deadline: 'Semana 24' },
                { task: 'Avaliação de ROI e refinamento de estratégia', deadline: 'Semana 24' }
              ]
            }
          ].map((phase, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${
                    phase?.status === 'critical' ? 'bg-red-500' :
                    phase?.status === 'high' ? 'bg-orange-500' :
                    phase?.status === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <h3 className="text-lg font-semibold text-gray-900">{phase?.phase}</h3>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{phase?.duration}</span>
                  <span>{phase?.budget}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {phase?.milestones?.map((milestone, idx) => (
                  <div key={idx} className="p-3 rounded-lg border bg-gray-50 border-gray-200">
                    <div className="flex items-start space-x-2">
                      <div className="w-4 h-4 flex-shrink-0 mt-0.5 rounded-full bg-blue-200"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{milestone?.task}</p>
                        <p className="text-xs text-gray-600">Deadline: {milestone?.deadline}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Success Timeline */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Cronograma de Resultados Esperados</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600 mb-1">Semana 2</div>
              <div className="text-sm text-gray-600">Motoristas de alto risco suspensos</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600 mb-1">Semana 8</div>
              <div className="text-sm text-gray-600">50% de redução em itens faltantes</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600 mb-1">Semana 16</div>
              <div className="text-sm text-gray-600">Sistema totalmente operacional</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600 mb-1">Semana 24</div>
              <div className="text-sm text-gray-600">Performance alvo atingida</div>
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
