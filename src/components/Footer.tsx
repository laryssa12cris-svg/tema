import React from 'react';
import { ShieldCheck, UserCheck, Heart, Terminal, Database } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-950 text-neutral-400 border-t-4 border-[#E30613] pt-8 pb-6 px-4 sm:px-6 print:hidden mt-12 text-xs">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-neutral-800">
          {/* Institutional SENAI */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#E30613] text-white text-xs font-black px-2 py-0.5 rounded tracking-widest uppercase">
                SENAI-SP
              </span>
              <span className="text-white font-black text-sm">
                Sistema de Gestão de Estoques (SGE)
              </span>
            </div>
            <p className="text-neutral-400 text-[11px] leading-relaxed">
              Plataforma desenvolvida para o controle de suprimentos técnicos, consumíveis e ferramentas das oficinas de aprendizagem industrial e centros de formação profissional de São Paulo.
            </p>
          </div>

          {/* Technical Responsibility (Prominent Carlos Eduardo Silva) */}
          <div className="bg-neutral-900 p-3.5 rounded-xl border border-neutral-800 space-y-1.5">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <UserCheck className="w-4 h-4 text-red-500" />
              <span>Responsável Técnico do Sistema</span>
            </div>
            <div className="text-neutral-200 font-black text-sm">
              Carlos Eduardo Silva
            </div>
            <div className="text-neutral-400 text-[11px]">
              Engenheiro de Software &bull; Especialista em Sistemas de Inventário Industrial
            </div>
            <div className="text-neutral-500 text-[10px] font-mono">
              CREA-SP / Registro Técnico SENAI: #862046-SP
            </div>
          </div>

          {/* Architecture & Persistence */}
          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center gap-2 text-neutral-200 font-bold">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Persistência &amp; Arquitetura</span>
            </div>
            <p className="text-neutral-400">
              Banco de dados estruturado em 4 níveis (Tipo &rarr; Grupo &rarr; Subgrupo &rarr; Artigo).
            </p>
            <p className="text-neutral-400">
              Sincronização com Google Drive API &amp; GitHub Gist REST com tolerância a falhas e cache local persistente.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-neutral-500 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} SENAI-SP &bull; Serviço Nacional de Aprendizagem Industrial. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-2">
            <span>Versão 1.0.0 (Produção &amp; Validação)</span>
            <span>&bull;</span>
            <span className="text-neutral-400">Paleta Oficial SENAI: Branco, Vermelho e Preto</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
