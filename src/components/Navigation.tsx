import React from 'react';
import { 
  LayoutDashboard, 
  Boxes, 
  Network, 
  ArrowLeftRight, 
  FileSpreadsheet, 
  Cloud,
  AlertTriangle
} from 'lucide-react';
import { InventoryDatabase } from '../types/inventory';

export type TabType = 'dashboard' | 'stock' | 'hierarchy' | 'movements' | 'reports' | 'cloud';

interface NavigationProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  database: InventoryDatabase;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  database
}) => {
  const criticalItemsCount = database.articles.filter(
    (a) => a.currentQuantity <= a.minQuantity
  ).length;

  const totalArticles = database.articles.length;
  const totalMovements = database.movements.length;

  const navItems = [
    {
      id: 'dashboard' as TabType,
      label: 'Visão Geral & Indicadores',
      shortLabel: 'Indicadores',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'stock' as TabType,
      label: 'Posição do Estoque',
      shortLabel: 'Estoque',
      icon: Boxes,
      badge: totalArticles > 0 ? `${totalArticles} itens` : '0',
      alertBadge: criticalItemsCount > 0 ? `${criticalItemsCount} crítico(s)` : null
    },
    {
      id: 'hierarchy' as TabType,
      label: 'Cadastro Hierárquico',
      shortLabel: 'Hierarquia',
      icon: Network,
      badge: `${database.types.length} Tipos`
    },
    {
      id: 'movements' as TabType,
      label: 'Entradas & Saídas',
      shortLabel: 'Movimentações',
      icon: ArrowLeftRight,
      badge: `${totalMovements} reg.`
    },
    {
      id: 'reports' as TabType,
      label: 'Relatórios & Impressão',
      shortLabel: 'Relatórios',
      icon: FileSpreadsheet,
      badge: 'Oficial'
    },
    {
      id: 'cloud' as TabType,
      label: 'Nuvem & Persistência',
      shortLabel: 'Nuvem/Drive',
      icon: Cloud,
      badge: 'Drive / GitHub'
    }
  ];

  return (
    <nav className="bg-white border-b border-neutral-200 shadow-sm sticky top-0 z-30 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`group flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-lg font-bold text-sm sm:text-base whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#E30613] text-white shadow-md shadow-red-600/20 ring-1 ring-red-700'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 hover:text-black border border-neutral-200/80'
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-neutral-700'
                  }`}
                />
                <span>{item.label}</span>

                {item.alertBadge && (
                  <span
                    className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 ${
                      isActive
                        ? 'bg-white text-[#E30613]'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                    title="Itens com estoque abaixo do mínimo de segurança"
                  >
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    {item.alertBadge}
                  </span>
                )}

                {item.badge && !item.alertBadge && (
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-black/30 text-white'
                        : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
