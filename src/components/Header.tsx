import React from 'react';
import { 
  Package, 
  ArrowLeftRight, 
  Cloud, 
  Printer, 
  UserCheck, 
  Database,
  CheckCircle2
} from 'lucide-react';
import { InventoryDatabase } from '../types/inventory';

interface HeaderProps {
  database: InventoryDatabase;
  onOpenSyncModal: () => void;
  onOpenNewMovement: () => void;
  onNavigateToReports: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  database,
  onOpenSyncModal,
  onOpenNewMovement,
  onNavigateToReports
}) => {
  const isGitHubActive = Boolean(database.syncSettings?.githubToken && database.syncSettings?.githubGistId);

  return (
    <header className="bg-neutral-950 text-white border-b-4 border-[#E30613] shadow-md print:hidden">
      {/* Top institutional strip */}
      <div className="bg-[#B91C1C] text-white text-xs py-1 px-4 flex flex-wrap justify-between items-center font-medium">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-wider uppercase">SENAI-SP</span>
          <span className="opacity-75">|</span>
          <span className="opacity-90">Serviço Nacional de Aprendizagem Industrial de São Paulo</span>
          <span className="hidden md:inline-block opacity-75">•</span>
          <span className="hidden md:inline-block opacity-90">CFP - Centro de Formação Profissional</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-black/25 px-2 py-0.5 rounded text-[11px]">
            <UserCheck className="w-3.5 h-3.5 text-white" />
            <span>Resp. Técnico: <strong>Carlos Eduardo Silva</strong></span>
          </div>
          <div className="flex items-center gap-1 text-[11px] bg-black/20 px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3 h-3 text-emerald-300" />
            <span>Base Persistida</span>
          </div>
        </div>
      </div>

      {/* Main header row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & System identity */}
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#E30613] text-white shadow-lg shadow-red-950/40 ring-2 ring-red-400/20 shrink-0">
            <Package className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#E30613] text-white text-xs font-black px-1.5 py-0.5 rounded tracking-widest uppercase">
                SENAI
              </span>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                SGE <span className="font-light text-neutral-300">| Sistema de Gestão de Estoques</span>
              </h1>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Controle de Materiais, Cadastro Hierárquico, Movimentações e Inventário em Tempo Real
            </p>
          </div>
        </div>

        {/* Action buttons with prominent SENAI red and dark contrast */}
        <div className="flex items-center flex-wrap gap-2.5 w-full md:w-auto justify-end">
          <button
            onClick={onOpenNewMovement}
            className="flex items-center gap-2 bg-[#E30613] hover:bg-[#C4122F] text-white px-3.5 py-2 rounded-lg font-bold text-sm shadow-md transition-all active:scale-95 focus:ring-2 focus:ring-red-400"
            title="Registrar nova entrada ou saída de material"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Movimentação</span>
          </button>

          <button
            onClick={onNavigateToReports}
            className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-3.5 py-2 rounded-lg font-semibold text-sm border border-neutral-700 transition-all active:scale-95"
            title="Visualizar e Imprimir Relatório Oficial"
          >
            <Printer className="w-4 h-4 text-red-400" />
            <span>Relatórios</span>
          </button>

          <button
            onClick={onOpenSyncModal}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold text-sm border transition-all active:scale-95 ${
              isGitHubActive 
                ? 'bg-neutral-800 border-emerald-500/60 text-emerald-300 hover:bg-neutral-700' 
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
            }`}
            title="Configurar persistência na nuvem (Google Drive / GitHub)"
          >
            <Cloud className="w-4 h-4 text-sky-400" />
            <span>Nuvem & Backup</span>
            <span className={`w-2 h-2 rounded-full ${isGitHubActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
