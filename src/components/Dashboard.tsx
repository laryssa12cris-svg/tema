import React from 'react';
import { 
  Boxes, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  ArrowDownLeft, 
  ArrowUpRight, 
  PlusCircle, 
  FileText, 
  RotateCcw,
  Sparkles,
  MapPin,
  Building2
} from 'lucide-react';
import { InventoryDatabase } from '../types/inventory';
import { formatCurrency, formatDateTime } from '../utils/formatters';

interface DashboardProps {
  database: InventoryDatabase;
  onNavigateToStock: () => void;
  onNavigateToHierarchy: () => void;
  onNavigateToReports: () => void;
  onOpenNewMovement: () => void;
  onResetEmpty: () => void;
  onLoadInitial10: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  database,
  onNavigateToStock,
  onNavigateToHierarchy,
  onNavigateToReports,
  onOpenNewMovement,
  onResetEmpty,
  onLoadInitial10
}) => {
  const { articles, movements, types } = database;

  const totalArticles = articles.length;
  const totalUnits = articles.reduce((acc, curr) => acc + (curr.currentQuantity || 0), 0);
  const totalValue = articles.reduce((acc, curr) => acc + ((curr.currentQuantity || 0) * (curr.unitCost || 0)), 0);
  
  const criticalItems = articles.filter(
    (a) => a.currentQuantity <= a.minQuantity
  );

  const outOfStockItems = articles.filter((a) => a.currentQuantity <= 0);

  const recentMovements = [...movements].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 5);

  // Group count by type
  const typeCounts = types.map((t) => {
    const arts = articles.filter((a) => a.typeId === t.id);
    const qty = arts.reduce((sum, item) => sum + item.currentQuantity, 0);
    const val = arts.reduce((sum, item) => sum + (item.currentQuantity * item.unitCost), 0);
    return {
      type: t,
      count: arts.length,
      qty,
      val
    };
  });

  return (
    <div className="space-y-6">
      {/* Institutional Alert / Status Header */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 text-white rounded-xl p-5 border-l-8 border-[#E30613] shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#E30613] text-white text-xs font-black px-2 py-0.5 rounded tracking-wider uppercase">
              SENAI-SP
            </span>
            <span className="text-xs text-neutral-400 font-medium">
              Almoxarifado Central &bull; Gestão Integrada
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black mt-1 text-white">
            Painel de Controle e Balanço de Estoque
          </h2>
          <p className="text-sm text-neutral-300 mt-1 max-w-2xl">
            Ambiente pronto para verificação. Responsável Técnico: <strong className="text-red-400">Carlos Eduardo Silva</strong>.
            Hierarquia de 4 níveis automatizada e persistência com Google Drive e GitHub.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={onLoadInitial10}
            className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-xs font-bold px-3 py-2 rounded-lg border border-neutral-700 transition-colors shadow-sm"
            title="Carrega os 10 materiais com descrição detalhada assinada por Carlos"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Carregar 10 Itens Padrão</span>
          </button>

          <button
            onClick={onResetEmpty}
            className="flex items-center gap-1.5 bg-neutral-800 hover:bg-red-950 text-neutral-300 hover:text-red-300 text-xs font-bold px-3 py-2 rounded-lg border border-neutral-700 transition-colors"
            title="Esvazia o banco de dados para testes do zero"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpar Banco (Vazio)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Articles */}
        <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-neutral-700">Artigos Cadastrados</span>
            <div className="p-2.5 rounded-lg bg-neutral-100 text-neutral-800">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-neutral-900">{totalArticles}</div>
            <div className="text-xs text-neutral-700 mt-1 flex items-center justify-between">
              <span>{types.length} Tipos Hierárquicos</span>
              <button
                onClick={onNavigateToHierarchy}
                className="text-[#E30613] hover:underline font-bold text-xs"
              >
                Gerenciar &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Total Physical Stock Units */}
        <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-neutral-700">Saldo Total Físico</span>
            <div className="p-2.5 rounded-lg bg-red-50 text-[#E30613]">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-neutral-900">{totalUnits.toLocaleString('pt-BR')}</div>
            <div className="text-xs text-neutral-700 mt-1 flex items-center justify-between">
              <span>Unidades / Peças / Rolos</span>
              <button
                onClick={onNavigateToStock}
                className="text-[#E30613] hover:underline font-bold text-xs"
              >
                Ver Estoque &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Total Value */}
        <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-neutral-700">Valor Inventariado</span>
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-neutral-900">{formatCurrency(totalValue)}</div>
            <div className="text-xs text-neutral-700 mt-1">
              Avaliação a custo de reposição
            </div>
          </div>
        </div>

        {/* Critical / Out of Stock Alert */}
        <div className={`rounded-xl p-5 border shadow-sm transition-shadow ${
          criticalItems.length > 0 
            ? 'bg-red-50/70 border-red-200' 
            : 'bg-white border-neutral-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-neutral-700">Alerta de Reposição</span>
            <div className={`p-2.5 rounded-lg ${
              criticalItems.length > 0 ? 'bg-red-100 text-[#E30613]' : 'bg-neutral-100 text-neutral-600'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className={`text-3xl font-black ${criticalItems.length > 0 ? 'text-[#E30613]' : 'text-neutral-900'}`}>
              {criticalItems.length}
            </div>
            <div className="text-xs text-neutral-700 mt-1 flex items-center justify-between">
              <span>{outOfStockItems.length} com saldo zerado</span>
              {criticalItems.length > 0 && (
                <button
                  onClick={onNavigateToStock}
                  className="text-[#E30613] font-bold hover:underline"
                >
                  Filtrar &rarr;
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Categories Distribution & Critical Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hierarchy Categories Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-neutral-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div>
              <h3 className="font-black text-base text-neutral-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#E30613]" />
                Distribuição por Tipo de Material (Nível 1)
              </h3>
              <p className="text-xs text-neutral-700">Visão consolidada de saldo e valor por divisão técnica</p>
            </div>
            <button
              onClick={onNavigateToHierarchy}
              className="text-xs font-bold text-[#E30613] hover:underline"
            >
              Estrutura Completa
            </button>
          </div>

          {typeCounts.length === 0 ? (
            <div className="text-center py-8 text-neutral-700 text-sm">
              Nenhuma categoria cadastrada no momento. Clique em &ldquo;Carregar 10 Itens Padrão&rdquo; ou acesse o Cadastro Hierárquico.
            </div>
          ) : (
            <div className="space-y-3">
              {typeCounts.map(({ type, count, qty, val }) => {
                const percentage = totalUnits > 0 ? Math.round((qty / totalUnits) * 100) : 0;
                return (
                  <div key={type.id} className="p-3 rounded-lg bg-neutral-50 border border-neutral-200/70 hover:bg-neutral-100/70 transition-colors">
                    <div className="flex justify-between items-center text-sm font-bold text-neutral-900">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-neutral-200 text-neutral-800">
                          {type.code}
                        </span>
                        <span>{type.name}</span>
                      </div>
                      <div className="text-right">
                        <span>{qty} unidades</span>
                        <span className="text-xs text-neutral-700 ml-2 font-normal">({formatCurrency(val)})</span>
                      </div>
                    </div>
                    
                    {/* Visual Progress bar */}
                    <div className="w-full bg-neutral-200 rounded-full h-2 mt-2.5 overflow-hidden">
                      <div
                        className="bg-[#E30613] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(percentage, 3)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-neutral-700 mt-1">
                      <span>{count} artigo(s) vinculado(s)</span>
                      <span>{percentage}% do volume total</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions & Alerta de Estoque Baixo */}
        <div className="space-y-6">
          {/* Quick Actions Panel */}
          <div className="bg-neutral-900 text-white rounded-xl p-5 border border-neutral-800 shadow-sm space-y-3">
            <h3 className="font-black text-sm tracking-wide uppercase text-neutral-300">
              Ações Rápidas de Almoxarifado
            </h3>
            <div className="space-y-2">
              <button
                onClick={onOpenNewMovement}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-[#E30613] hover:bg-[#C4122F] text-white font-bold text-sm transition-all"
              >
                <span className="flex items-center gap-2">
                  <ArrowDownLeft className="w-4 h-4" />
                  Registrar Entrada / Saída
                </span>
                <span className="text-xs bg-black/30 px-2 py-0.5 rounded">Rápido</span>
              </button>

              <button
                onClick={onNavigateToHierarchy}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-semibold text-sm transition-all border border-neutral-700"
              >
                <span className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-red-400" />
                  Cadastrar Novo Artigo
                </span>
                <span className="text-xs text-neutral-400">Código Auto</span>
              </button>

              <button
                onClick={onNavigateToReports}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-semibold text-sm transition-all border border-neutral-700"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  Emitir Relatório Oficial
                </span>
                <span className="text-xs text-neutral-400">PDF / Imprimir</span>
              </button>
            </div>
          </div>

          {/* Attention Items */}
          <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-sm">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
              <h3 className="font-black text-sm text-neutral-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Estoque Mínimo / Reposição
              </h3>
              <span className="text-xs font-bold text-neutral-700">{criticalItems.length} alerta(s)</span>
            </div>

            <div className="mt-3 space-y-2.5">
              {criticalItems.length === 0 ? (
                <div className="text-xs text-emerald-800 bg-emerald-50 p-3 rounded-lg text-center font-medium">
                  &check; Todos os itens estão com estoque acima do nível mínimo de segurança!
                </div>
              ) : (
                criticalItems.slice(0, 4).map((item) => (
                  <div key={item.id} className="p-2.5 rounded-lg border border-red-200 bg-red-50/50 text-xs flex justify-between items-center">
                    <div className="pr-2">
                      <div className="font-bold text-neutral-900">{item.name}</div>
                      <div className="text-neutral-700 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-red-700 shrink-0" />
                        <span className="truncate max-w-[170px]">{item.location}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-black text-[#E30613] text-sm">
                        {item.currentQuantity} {item.unit}
                      </div>
                      <div className="text-[10px] text-neutral-700">Mín: {item.minQuantity}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Movements Section */}
      <div className="bg-white rounded-xl p-5 border border-neutral-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-100 gap-2">
          <div>
            <h3 className="font-black text-base text-neutral-900">
              Últimas Movimentações no Almoxarifado
            </h3>
            <p className="text-xs text-neutral-700">Histórico cronológico de entradas e saídas de materiais</p>
          </div>
          <button
            onClick={onNavigateToStock}
            className="text-xs font-bold text-[#E30613] hover:underline self-start sm:self-auto"
          >
            Ver Todas as Movimentações &rarr;
          </button>
        </div>

        {recentMovements.length === 0 ? (
          <div className="text-center py-6 text-neutral-700 text-sm">
            Nenhuma movimentação registrada até o momento.
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-700">
              <thead className="bg-neutral-100 text-neutral-800 uppercase font-black tracking-wider text-[11px]">
                <tr>
                  <th className="py-2.5 px-3 rounded-l">Tipo</th>
                  <th className="py-2.5 px-3">Data / Hora</th>
                  <th className="py-2.5 px-3">Material / Código</th>
                  <th className="py-2.5 px-3 text-right">Qtd</th>
                  <th className="py-2.5 px-3">Motivo / Destino</th>
                  <th className="py-2.5 px-3 rounded-r">Responsável</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {recentMovements.map((mov) => {
                  const isEntrada = mov.type === 'ENTRADA';
                  return (
                    <tr key={mov.id} className="hover:bg-neutral-50">
                      <td className="py-2.5 px-3">
                        <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded text-[11px] ${
                          isEntrada
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-[#E30613]'
                        }`}>
                          {isEntrada ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                          {isEntrada ? 'ENTRADA' : 'SAÍDA'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-neutral-800">
                        {formatDateTime(mov.date)}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-neutral-900">{mov.articleName}</div>
                        <div className="text-[10px] font-mono text-neutral-700">{mov.articleCode}</div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-black text-sm">
                        <span className={isEntrada ? 'text-emerald-700' : 'text-neutral-900'}>
                          {isEntrada ? '+' : '-'}{mov.quantity}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-medium text-neutral-800">{mov.reason}</div>
                        {mov.departmentOrLab && (
                          <div className="text-[11px] text-neutral-700">{mov.departmentOrLab}</div>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-neutral-800 font-medium">
                        {mov.requester || 'Carlos'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
