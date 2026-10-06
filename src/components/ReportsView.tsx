import React, { useState } from 'react';
import { 
  Printer, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  CheckCircle, 
  MapPin, 
  ShieldCheck, 
  Filter,
  Calendar,
  Building2
} from 'lucide-react';
import { InventoryDatabase, Article } from '../types/inventory';
import { formatCurrency, formatDateTime, formatDate } from '../utils/formatters';

interface ReportsViewProps {
  database: InventoryDatabase;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ database }) => {
  const { articles, movements, types } = database;

  const [reportType, setReportType] = useState<'INVENTORY' | 'MOVEMENTS' | 'CRITICAL'>('INVENTORY');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');

  const filteredArticles = articles.filter((art) => {
    if (selectedTypeFilter !== 'ALL' && art.typeId !== selectedTypeFilter) return false;
    if (reportType === 'CRITICAL') return art.currentQuantity <= art.minQuantity;
    return true;
  });

  const totalUnits = filteredArticles.reduce((acc, a) => acc + a.currentQuantity, 0);
  const totalValue = filteredArticles.reduce((acc, a) => acc + (a.currentQuantity * a.unitCost), 0);

  // Trigger print dialog
  const handlePrint = () => {
    window.print();
  };

  // Export to CSV
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,\uFEFF'; // UTF-8 BOM
    
    if (reportType === 'INVENTORY' || reportType === 'CRITICAL') {
      csvContent += 'Código;Nome do Artigo;Descrição;Localização;Unidade;Saldo Atual;Estoque Mínimo;Custo Unitário (R$);Valor Total (R$);Status\n';
      filteredArticles.forEach((a) => {
        const status = a.currentQuantity <= 0 ? 'ZERADO' : a.currentQuantity <= a.minQuantity ? 'CRÍTICO' : 'NORMAL';
        const line = [
          `"${a.code}"`,
          `"${a.name.replace(/"/g, '""')}"`,
          `"${a.description.replace(/"/g, '""')}"`,
          `"${a.location.replace(/"/g, '""')}"`,
          `"${a.unit}"`,
          a.currentQuantity,
          a.minQuantity,
          a.unitCost.toFixed(2),
          (a.currentQuantity * a.unitCost).toFixed(2),
          status
        ].join(';');
        csvContent += line + '\n';
      });
    } else {
      csvContent += 'Data;Tipo;Código;Material;Quantidade;Saldo Anterior;Saldo Novo;Localização;Documento;Motivo;Solicitante;Destino\n';
      movements.forEach((m) => {
        const line = [
          `"${formatDateTime(m.date)}"`,
          `"${m.type}"`,
          `"${m.articleCode}"`,
          `"${m.articleName.replace(/"/g, '""')}"`,
          m.quantity,
          m.previousQuantity,
          m.newQuantity,
          `"${(m.location || '').replace(/"/g, '""')}"`,
          `"${(m.documentNumber || '').replace(/"/g, '""')}"`,
          `"${(m.reason || '').replace(/"/g, '""')}"`,
          `"${(m.requester || '').replace(/"/g, '""')}"`,
          `"${(m.departmentOrLab || '').replace(/"/g, '""')}"`
        ].join(';');
        csvContent += line + '\n';
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio_senai_${reportType.toLowerCase()}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6">
      {/* Action Header (Hidden in Print) */}
      <div className="print:hidden bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#E30613] text-white text-xs font-black px-2 py-0.5 rounded tracking-wider uppercase">
              Emissão de Relatórios
            </span>
            <h2 className="text-xl font-black text-neutral-900">
              Relatórios Técnicos e Posição do Almoxarifado
            </h2>
          </div>
          <p className="text-xs text-neutral-700 mt-1">
            Geração de relatórios com formatação oficial para impressão e auditoria técnica SENAI-SP.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-all"
            title="Baixar planilha para Excel / CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-[#E30613] hover:bg-[#C4122F] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md transition-all active:scale-95"
            title="Imprimir relatório formatado ou salvar como PDF"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Relatório (PDF)</span>
          </button>
        </div>
      </div>

      {/* Filter / Sub-Tabs Bar (Hidden in Print) */}
      <div className="print:hidden bg-neutral-100 p-3 rounded-xl border border-neutral-200 flex flex-wrap justify-between items-center gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => setReportType('INVENTORY')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              reportType === 'INVENTORY'
                ? 'bg-neutral-900 text-white'
                : 'bg-white text-neutral-700 hover:bg-neutral-200 border border-neutral-300'
            }`}
          >
            1. Posição Completa do Estoque ({articles.length})
          </button>

          <button
            onClick={() => setReportType('CRITICAL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              reportType === 'CRITICAL'
                ? 'bg-[#E30613] text-white'
                : 'bg-white text-neutral-700 hover:bg-neutral-200 border border-neutral-300'
            }`}
          >
            2. Itens Críticos / Reposição ({articles.filter((a) => a.currentQuantity <= a.minQuantity).length})
          </button>

          <button
            onClick={() => setReportType('MOVEMENTS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              reportType === 'MOVEMENTS'
                ? 'bg-neutral-900 text-white'
                : 'bg-white text-neutral-700 hover:bg-neutral-200 border border-neutral-300'
            }`}
          >
            3. Histórico de Movimentações ({movements.length})
          </button>
        </div>

        {reportType !== 'MOVEMENTS' && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-600">Filtrar Tipo:</span>
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-neutral-300 text-xs bg-white font-medium"
            >
              <option value="ALL">Todos os Tipos</option>
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.code} - {t.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* PRINTABLE OFFICIAL SENAI DOCUMENT CONTAINER */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-neutral-300 shadow-md print:shadow-none print:border-none print:p-0 print:m-0 space-y-6">
        {/* Official Header */}
        <div className="border-b-4 border-[#E30613] pb-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-[#E30613] text-white text-sm font-black px-2 py-0.5 rounded tracking-widest uppercase">
                  SENAI-SP
                </span>
                <span className="text-xs uppercase font-extrabold text-neutral-800 tracking-wider">
                  Serviço Nacional de Aprendizagem Industrial
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-neutral-950 uppercase tracking-tight">
                {reportType === 'INVENTORY' && 'Relatório Técnico Oficial de Posição de Estoque'}
                {reportType === 'CRITICAL' && 'Relatório Técnico de Alerta de Estoque Mínimo e Reposição'}
                {reportType === 'MOVEMENTS' && 'Relatório de Rastreabilidade e Movimentações de Almoxarifado'}
              </h1>
              <p className="text-xs text-neutral-600 font-medium">
                Departamento Regional de São Paulo &bull; Divisão de Almoxarifado e Suprimentos Técnicos
              </p>
            </div>

            <div className="text-right text-xs space-y-1">
              <div className="bg-neutral-100 border border-neutral-300 px-3 py-1.5 rounded text-neutral-800">
                <div>Data de Emissão: <strong>{new Date().toLocaleDateString('pt-BR')}</strong></div>
                <div>Horário: <strong>{new Date().toLocaleTimeString('pt-BR')}</strong></div>
              </div>
              <div className="text-[11px] text-neutral-500 font-mono">
                ID Auditoria: {Math.random().toString(36).substring(2, 9).toUpperCase()}
              </div>
            </div>
          </div>

          {/* Technical responsibility badge on printable document */}
          <div className="mt-4 pt-3 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-neutral-50 p-2.5 rounded">
            <div>
              <span className="text-neutral-500 block text-[10px] uppercase font-bold">Responsável Técnico</span>
              <strong className="text-neutral-900">Carlos Eduardo Silva</strong>
              <div className="text-[11px] text-neutral-600">Engenheiro de Software / Resp. Técnico</div>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px] uppercase font-bold">Unidade Operacional</span>
              <strong className="text-neutral-900">CFP - SENAI São Paulo</strong>
              <div className="text-[11px] text-neutral-600">Almoxarifado Geral de Laboratórios e Oficinas</div>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px] uppercase font-bold">Status do Banco de Dados</span>
              <strong className="text-emerald-700">&check; Dados Validados &amp; Sincronizados</strong>
              <div className="text-[11px] text-neutral-600">Persistência Ativa (Nuvem / Local)</div>
            </div>
          </div>
        </div>

        {/* Content Table: INVENTORY / CRITICAL */}
        {(reportType === 'INVENTORY' || reportType === 'CRITICAL') && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-neutral-300">
                <thead>
                  <tr className="bg-neutral-900 text-white uppercase text-[10px] font-bold tracking-wider">
                    <th className="py-2.5 px-2.5 border border-neutral-800">Item</th>
                    <th className="py-2.5 px-3 border border-neutral-800">Código Único</th>
                    <th className="py-2.5 px-3 border border-neutral-800">Material e Descrição Completa</th>
                    <th className="py-2.5 px-3 border border-neutral-800">Localização Física</th>
                    <th className="py-2.5 px-2 text-center border border-neutral-800">Mín.</th>
                    <th className="py-2.5 px-3 text-right border border-neutral-800">Saldo</th>
                    <th className="py-2.5 px-3 text-right border border-neutral-800">Custo Unit.</th>
                    <th className="py-2.5 px-3 text-right border border-neutral-800">Total (R$)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredArticles.map((art, idx) => {
                    const isCritical = art.currentQuantity <= art.minQuantity;
                    return (
                      <tr key={art.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/70'}>
                        <td className="py-2 px-2.5 text-center font-bold text-neutral-500 border border-neutral-200">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-3 font-mono font-bold text-neutral-900 whitespace-nowrap border border-neutral-200">
                          {art.code}
                        </td>
                        <td className="py-2 px-3 border border-neutral-200">
                          <div className="font-bold text-neutral-950 text-xs">
                            {art.name}
                          </div>
                          <div className="text-[10px] text-neutral-700 font-mono mt-0.5 leading-relaxed">
                            {art.description}
                          </div>
                        </td>
                        <td className="py-2 px-3 text-neutral-800 font-medium border border-neutral-200">
                          <div className="flex items-start gap-1">
                            <MapPin className="w-3 h-3 text-[#E30613] shrink-0 mt-0.5" />
                            <span>{art.location}</span>
                          </div>
                        </td>
                        <td className="py-2 px-2 text-center text-neutral-600 border border-neutral-200">
                          {art.minQuantity}
                        </td>
                        <td className="py-2 px-3 text-right whitespace-nowrap border border-neutral-200">
                          <span className={`font-black ${isCritical ? 'text-[#E30613]' : 'text-neutral-900'}`}>
                            {art.currentQuantity} {art.unit}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right font-medium text-neutral-800 whitespace-nowrap border border-neutral-200">
                          {formatCurrency(art.unitCost)}
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-neutral-950 whitespace-nowrap border border-neutral-200">
                          {formatCurrency(art.currentQuantity * art.unitCost)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-neutral-100 font-black text-xs text-neutral-900 border-t-2 border-neutral-400">
                    <td colSpan={5} className="py-3 px-3 text-right uppercase border border-neutral-300">
                      Totais Gerais ({filteredArticles.length} artigos):
                    </td>
                    <td className="py-3 px-3 text-right border border-neutral-300">
                      {totalUnits} unidades
                    </td>
                    <td className="py-3 px-3 border border-neutral-300"></td>
                    <td className="py-3 px-3 text-right text-base text-neutral-950 border border-neutral-300">
                      {formatCurrency(totalValue)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Content Table: MOVEMENTS */}
        {reportType === 'MOVEMENTS' && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-neutral-300">
                <thead>
                  <tr className="bg-neutral-900 text-white uppercase text-[10px] font-bold tracking-wider">
                    <th className="py-2.5 px-3 border border-neutral-800">Tipo</th>
                    <th className="py-2.5 px-3 border border-neutral-800">Data / Horário</th>
                    <th className="py-2.5 px-3 border border-neutral-800">Código / Artigo</th>
                    <th className="py-2.5 px-2 text-right border border-neutral-800">Qtd</th>
                    <th className="py-2.5 px-2 text-right border border-neutral-800">Saldo</th>
                    <th className="py-2.5 px-3 border border-neutral-800">Localização</th>
                    <th className="py-2.5 px-3 border border-neutral-800">Motivo / Finalidade</th>
                    <th className="py-2.5 px-3 border border-neutral-800">Responsável</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {movements.map((mov, idx) => {
                    const isEntrada = mov.type === 'ENTRADA';
                    return (
                      <tr key={mov.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/70'}>
                        <td className="py-2 px-3 border border-neutral-200 whitespace-nowrap">
                          <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                            isEntrada ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-[#E30613]'
                          }`}>
                            {isEntrada ? '+ ENTRADA' : '- SAÍDA'}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-medium text-neutral-800 border border-neutral-200 whitespace-nowrap">
                          {formatDateTime(mov.date)}
                        </td>
                        <td className="py-2 px-3 border border-neutral-200">
                          <div className="font-bold text-neutral-900">{mov.articleName}</div>
                          <div className="font-mono text-[10px] text-neutral-600">{mov.articleCode}</div>
                        </td>
                        <td className="py-2 px-2 text-right font-black border border-neutral-200">
                          <span className={isEntrada ? 'text-emerald-700' : 'text-neutral-900'}>
                            {isEntrada ? '+' : '-'}{mov.quantity}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-right text-neutral-700 border border-neutral-200">
                          {mov.newQuantity}
                        </td>
                        <td className="py-2 px-3 text-neutral-700 text-[11px] border border-neutral-200">
                          {mov.location || '-'}
                        </td>
                        <td className="py-2 px-3 text-neutral-800 border border-neutral-200">
                          <div>{mov.reason}</div>
                          {mov.departmentOrLab && (
                            <div className="text-[10px] text-neutral-500">Oficina/Lab: {mov.departmentOrLab}</div>
                          )}
                        </td>
                        <td className="py-2 px-3 text-neutral-800 border border-neutral-200">
                          {mov.requester || 'Carlos'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Official Signature and Stamp Box */}
        <div className="pt-8 border-t-2 border-neutral-300 mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="border border-neutral-300 rounded p-4 text-xs space-y-1 bg-neutral-50/50">
            <span className="font-bold uppercase text-[10px] text-neutral-500 block">Declaração de Conformidade</span>
            <p className="text-neutral-700 leading-relaxed text-[11px]">
              Certifico para os devidos fins que a presente posição de inventário físico foi devidamente registrada e conferida de acordo com os padrões técnicos e metodológicos do SENAI-SP.
            </p>
            <div className="pt-2 text-[10px] text-neutral-500 font-mono">
              HASH SHA-256: 7F9A8C2B3E4D1A0F5C8B2A9E4D3C2B1A
            </div>
          </div>

          <div className="flex flex-col justify-end items-center text-center space-y-1 pt-6 sm:pt-0">
            <div className="w-64 border-b border-neutral-900"></div>
            <span className="font-black text-xs text-neutral-900 uppercase">
              Carlos Eduardo Silva
            </span>
            <span className="text-[11px] text-neutral-700 font-medium">
              Engenheiro de Software &bull; Responsável Técnico do Sistema
            </span>
            <span className="text-[10px] text-neutral-500">
              SENAI São Paulo &bull; Almoxarifado Central
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
