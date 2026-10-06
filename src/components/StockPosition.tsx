import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  AlertTriangle, 
  ArrowLeftRight, 
  Eye, 
  Edit3, 
  CheckCircle2, 
  Plus, 
  X,
  History
} from 'lucide-react';
import { InventoryDatabase, Article, StockMovement } from '../types/inventory';
import { formatCurrency, formatDateTime } from '../utils/formatters';

interface StockPositionProps {
  database: InventoryDatabase;
  onOpenMovementWithArticle: (article: Article, type?: 'ENTRADA' | 'SAIDA') => void;
  onUpdateArticleLocation: (articleId: string, newLocation: string) => void;
  onNavigateToHierarchy: () => void;
}

export const StockPosition: React.FC<StockPositionProps> = ({
  database,
  onOpenMovementWithArticle,
  onUpdateArticleLocation,
  onNavigateToHierarchy
}) => {
  const { articles, types, groups, subgroups, movements } = database;

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CRITICAL' | 'EMPTY' | 'OK'>('ALL');
  const [sortField, setSortField] = useState<'code' | 'name' | 'quantity' | 'value'>('code');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Modal states
  const [inspectArticle, setInspectArticle] = useState<Article | null>(null);
  const [editingLocationArticle, setEditingLocationArticle] = useState<Article | null>(null);
  const [newLocationInput, setNewLocationInput] = useState('');

  // Filtered & Sorted articles
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      // Text search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        art.name.toLowerCase().includes(q) ||
        art.code.toLowerCase().includes(q) ||
        art.location.toLowerCase().includes(q) ||
        art.description.toLowerCase().includes(q)
      );

      // Type filter
      const matchesType = selectedType === 'ALL' || art.typeId === selectedType;

      // Status filter
      let matchesStatus = true;
      if (statusFilter === 'CRITICAL') {
        matchesStatus = art.currentQuantity <= art.minQuantity && art.currentQuantity > 0;
      } else if (statusFilter === 'EMPTY') {
        matchesStatus = art.currentQuantity <= 0;
      } else if (statusFilter === 'OK') {
        matchesStatus = art.currentQuantity > art.minQuantity;
      }

      return matchesSearch && matchesType && matchesStatus;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortField === 'code') {
        comparison = a.code.localeCompare(b.code);
      } else if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'quantity') {
        comparison = a.currentQuantity - b.currentQuantity;
      } else if (sortField === 'value') {
        comparison = (a.currentQuantity * a.unitCost) - (b.currentQuantity * b.unitCost);
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [articles, searchQuery, selectedType, statusFilter, sortField, sortDirection]);

  // Lookup helpers
  const getType = (typeId: string) => types.find((t) => t.id === typeId);
  const getGroup = (groupId: string) => groups.find((g) => g.id === groupId);
  const getSubgroup = (subId: string) => subgroups.find((s) => s.id === subId);

  // Movements of inspected article
  const inspectedMovements = useMemo(() => {
    if (!inspectArticle) return [];
    return movements
      .filter((m) => m.articleId === inspectArticle.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [inspectArticle, movements]);

  const handleStartEditLocation = (art: Article) => {
    setEditingLocationArticle(art);
    setNewLocationInput(art.location);
  };

  const handleSaveLocation = () => {
    if (editingLocationArticle && newLocationInput.trim()) {
      onUpdateArticleLocation(editingLocationArticle.id, newLocationInput.trim());
      setEditingLocationArticle(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-neutral-900 flex items-center gap-2">
            <span>Posição Atual do Estoque em Tempo Real</span>
            <span className="bg-[#E30613] text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {filteredArticles.length} de {articles.length} Artigos
            </span>
          </h2>
          <p className="text-xs text-neutral-700 mt-1">
            Controle de saldo, localização física de armazenagem e movimentações por artigo
          </p>
        </div>

        <button
          onClick={onNavigateToHierarchy}
          className="flex items-center gap-1.5 bg-[#E30613] hover:bg-[#C4122F] text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Artigo</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Text Search */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-neutral-600 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar por código, nome, localização ou descrição..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E30613] focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full py-2 px-3 border border-neutral-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E30613]"
            >
              <option value="ALL">Todos os Tipos de Material</option>
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.code} - {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full py-2 px-3 border border-neutral-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E30613]"
            >
              <option value="ALL">Status: Todos</option>
              <option value="OK">Estoque Adequado</option>
              <option value="CRITICAL">&le; Mínimo (Crítico)</option>
              <option value="EMPTY">Estoque Zerado</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-2 flex gap-1">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as any)}
              className="w-full py-2 px-2.5 border border-neutral-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#E30613]"
            >
              <option value="code">Código</option>
              <option value="name">Nome</option>
              <option value="quantity">Saldo</option>
              <option value="value">Valor Total</option>
            </select>
            <button
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              className="px-2.5 py-2 border border-neutral-300 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-xs font-bold"
              title="Alternar ordem crescente / decrescente"
            >
              {sortDirection === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Quick status pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-100 text-xs text-neutral-700">
          <span className="font-semibold text-neutral-800">Filtro rápido:</span>
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              statusFilter === 'ALL' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700'
            }`}
          >
            Todos ({articles.length})
          </button>
          <button
            onClick={() => setStatusFilter('CRITICAL')}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              statusFilter === 'CRITICAL' ? 'bg-[#E30613] text-white' : 'bg-red-100 text-[#E30613]'
            }`}
          >
            Abaixo do Mínimo ({articles.filter((a) => a.currentQuantity <= a.minQuantity && a.currentQuantity > 0).length})
          </button>
          <button
            onClick={() => setStatusFilter('EMPTY')}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              statusFilter === 'EMPTY' ? 'bg-neutral-800 text-white' : 'bg-neutral-200 text-neutral-800'
            }`}
          >
            Zerados ({articles.filter((a) => a.currentQuantity <= 0).length})
          </button>
        </div>
      </div>

      {/* Main Stock Table */}
      {filteredArticles.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-neutral-200 shadow-sm space-y-3">
          <div className="w-12 h-12 bg-neutral-100 text-neutral-600 rounded-full flex items-center justify-center mx-auto">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-neutral-800 text-base">Nenhum artigo encontrado com os filtros atuais</h3>
          <p className="text-xs text-neutral-700 max-w-md mx-auto">
            {articles.length === 0 
              ? 'O banco de dados está vazio no momento. Você pode iniciar os cadastros na aba Cadastro Hierárquico ou carregar os 10 itens padrão do SENAI.' 
              : 'Experimente limpar a pesquisa ou mudar os filtros de Tipo e Status acima.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-700">
              <thead className="bg-neutral-900 text-white uppercase text-[11px] font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Código Único</th>
                  <th className="py-3 px-4">Artigo / Descrição Técnica</th>
                  <th className="py-3 px-4">Classificação (Tipo &rsaquo; Grupo)</th>
                  <th className="py-3 px-4">Localização de Armazenagem</th>
                  <th className="py-3 px-4 text-center">Mín.</th>
                  <th className="py-3 px-4 text-right">Saldo Atual</th>
                  <th className="py-3 px-4 text-right">Valor Unitário</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredArticles.map((art) => {
                  const typeObj = getType(art.typeId);
                  const groupObj = getGroup(art.groupId);
                  const isCritical = art.currentQuantity <= art.minQuantity && art.currentQuantity > 0;
                  const isEmpty = art.currentQuantity <= 0;

                  return (
                    <tr key={art.id} className="hover:bg-neutral-50/80 transition-colors">
                      {/* Code */}
                      <td className="py-3 px-4 font-mono font-bold text-neutral-900 whitespace-nowrap">
                        <span className="bg-neutral-100 border border-neutral-300 text-neutral-900 px-2 py-1 rounded text-[11px]">
                          {art.code}
                        </span>
                      </td>

                      {/* Name & Description Preview */}
                      <td className="py-3 px-4 max-w-xs sm:max-w-md">
                        <div className="font-bold text-neutral-950 text-sm">
                          {art.name}
                        </div>
                        <div className="text-[11px] text-neutral-700 line-clamp-2 mt-0.5 leading-relaxed font-normal">
                          {art.description}
                        </div>
                      </td>

                      {/* Hierarchy path */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-neutral-800">
                          {typeObj?.name || 'Tipo Geral'}
                        </div>
                        <div className="text-[11px] text-neutral-700">
                          &rsaquo; {groupObj?.name || 'Grupo'}
                        </div>
                      </td>

                      {/* Location with quick edit */}
                      <td className="py-3 px-4">
                        <div className="flex items-start gap-1.5 group cursor-pointer" onClick={() => handleStartEditLocation(art)}>
                          <MapPin className="w-3.5 h-3.5 text-[#E30613] shrink-0 mt-0.5" />
                          <span className="font-medium text-neutral-800 group-hover:text-[#E30613] transition-colors">
                            {art.location}
                          </span>
                          <Edit3 className="w-3 h-3 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </div>
                      </td>

                      {/* Minimum Quantity */}
                      <td className="py-3 px-4 text-center font-medium text-neutral-700">
                        {art.minQuantity}
                      </td>

                      {/* Current Quantity Balance */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className={`text-base font-black ${
                          isEmpty ? 'text-red-700' : isCritical ? 'text-[#E30613]' : 'text-neutral-900'
                        }`}>
                          {art.currentQuantity} <span className="text-xs font-normal text-neutral-700">{art.unit}</span>
                        </div>
                        <div className="text-[10px] text-neutral-700 font-medium">
                          Total: {formatCurrency(art.currentQuantity * art.unitCost)}
                        </div>
                      </td>

                      {/* Unit Cost */}
                      <td className="py-3 px-4 text-right font-medium text-neutral-800 whitespace-nowrap">
                        {formatCurrency(art.unitCost)}
                      </td>

                      {/* Status badge */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {isEmpty ? (
                          <span className="inline-flex items-center gap-1 bg-red-950 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Zerado
                          </span>
                        ) : isCritical ? (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            Crítico
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Normal
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onOpenMovementWithArticle(art, 'ENTRADA')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white p-1.5 rounded-md transition-colors"
                            title="Registrar Entrada (+)"
                          >
                            <span className="text-xs font-bold px-1">+</span>
                          </button>

                          <button
                            onClick={() => onOpenMovementWithArticle(art, 'SAIDA')}
                            className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-md transition-colors"
                            title="Registrar Saída (-)"
                          >
                            <span className="text-xs font-bold px-1">-</span>
                          </button>

                          <button
                            onClick={() => setInspectArticle(art)}
                            className="bg-neutral-800 hover:bg-neutral-700 text-white p-1.5 rounded-md transition-colors"
                            title="Ver Ficha Completa e Histórico de Movimentações"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Edit Location */}
      {editingLocationArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border-t-4 border-[#E30613] space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-black text-lg text-neutral-900">Atualizar Localização Física</h3>
                <p className="text-xs text-neutral-700 mt-0.5">
                  Artigo: <span className="font-bold text-neutral-800">{editingLocationArticle.name}</span> ({editingLocationArticle.code})
                </p>
              </div>
              <button
                onClick={() => setEditingLocationArticle(null)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                Nova Localização de Armazenamento:
              </label>
              <input
                type="text"
                value={newLocationInput}
                onChange={(e) => setNewLocationInput(e.target.value)}
                placeholder="Ex: Almoxarifado Central - Prateleira B3, Box 10"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E30613]"
                autoFocus
              />
              <p className="text-[11px] text-neutral-700 mt-1">
                Identifique claramente o galpão, estante, prateleira ou gaveta correspondente na oficina do SENAI.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
              <button
                onClick={() => setEditingLocationArticle(null)}
                className="px-4 py-2 border border-neutral-300 rounded-lg text-xs font-bold text-neutral-700 hover:bg-neutral-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveLocation}
                className="px-4 py-2 bg-[#E30613] hover:bg-[#C4122F] text-white rounded-lg text-xs font-bold shadow-sm"
              >
                Salvar Localização
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Article Inspection & Specific Movements */}
      {inspectArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl border-t-4 border-[#E30613] space-y-5 my-8">
            <div className="flex justify-between items-start border-b border-neutral-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-neutral-900 text-white text-xs font-bold px-2 py-0.5 rounded">
                    {inspectArticle.code}
                  </span>
                  <span className="text-xs bg-red-100 text-[#E30613] font-bold px-2 py-0.5 rounded">
                    Ficha Técnica de Estoque
                  </span>
                </div>
                <h3 className="font-black text-lg text-neutral-900 mt-1">{inspectArticle.name}</h3>
              </div>
              <button
                onClick={() => setInspectArticle(null)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Detailed Description */}
            <div className="bg-neutral-50 p-3.5 rounded-lg border border-neutral-200">
              <span className="text-[11px] font-bold uppercase text-neutral-700 block mb-1">
                Descrição Técnica Oficial:
              </span>
              <p className="text-xs text-neutral-800 leading-relaxed font-mono">
                {inspectArticle.description}
              </p>
            </div>

            {/* Spec Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-neutral-100 rounded-lg">
                <span className="text-neutral-700 block text-[10px] uppercase font-bold">Saldo em Estoque</span>
                <span className="text-lg font-black text-neutral-900">
                  {inspectArticle.currentQuantity} {inspectArticle.unit}
                </span>
              </div>
              <div className="p-3 bg-neutral-100 rounded-lg">
                <span className="text-neutral-700 block text-[10px] uppercase font-bold">Estoque Mínimo</span>
                <span className="text-lg font-bold text-neutral-800">{inspectArticle.minQuantity} {inspectArticle.unit}</span>
              </div>
              <div className="p-3 bg-neutral-100 rounded-lg">
                <span className="text-neutral-700 block text-[10px] uppercase font-bold">Custo Unitário</span>
                <span className="text-lg font-bold text-neutral-800">{formatCurrency(inspectArticle.unitCost)}</span>
              </div>
              <div className="p-3 bg-neutral-100 rounded-lg">
                <span className="text-neutral-700 block text-[10px] uppercase font-bold">Total Avaliado</span>
                <span className="text-lg font-bold text-emerald-800">
                  {formatCurrency(inspectArticle.currentQuantity * inspectArticle.unitCost)}
                </span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E30613]" />
                <div>
                  <span className="text-neutral-700 font-bold block text-[10px] uppercase">Local de Armazenagem</span>
                  <span className="font-bold text-neutral-900">{inspectArticle.location}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  const art = inspectArticle;
                  setInspectArticle(null);
                  handleStartEditLocation(art);
                }}
                className="text-xs font-bold text-[#E30613] hover:underline"
              >
                Alterar
              </button>
            </div>

            {/* Movements of this article */}
            <div>
              <h4 className="font-black text-xs uppercase tracking-wider text-neutral-700 mb-2 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-[#E30613]" />
                Histórico de Movimentações deste Material ({inspectedMovements.length})
              </h4>

              {inspectedMovements.length === 0 ? (
                <div className="text-xs text-neutral-700 py-4 text-center border rounded-lg bg-neutral-50">
                  Nenhuma movimentação de entrada ou saída registrada para este artigo.
                </div>
              ) : (
                <div className="max-h-48 overflow-y-auto border border-neutral-200 rounded-lg divide-y divide-neutral-100 text-xs">
                  {inspectedMovements.map((m) => {
                    const isEntrada = m.type === 'ENTRADA';
                    return (
                      <div key={m.id} className="p-2.5 flex justify-between items-center hover:bg-neutral-50">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                              isEntrada ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-[#E30613]'
                            }`}>
                              {isEntrada ? '+ ENTRADA' : '- SAÍDA'}
                            </span>
                            <span className="font-bold text-neutral-800">{m.reason}</span>
                          </div>
                          <div className="text-[11px] text-neutral-700 mt-0.5">
                            {formatDateTime(m.date)} &bull; {m.requester || 'Carlos'} {m.departmentOrLab ? `(${m.departmentOrLab})` : ''}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`font-black text-sm ${isEntrada ? 'text-emerald-700' : 'text-neutral-900'}`}>
                            {isEntrada ? '+' : '-'}{m.quantity}
                          </span>
                          <div className="text-[10px] text-neutral-700">Saldo: {m.newQuantity}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-between items-center pt-3 border-t border-neutral-100">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const art = inspectArticle;
                    setInspectArticle(null);
                    onOpenMovementWithArticle(art, 'ENTRADA');
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  + Entrada
                </button>
                <button
                  onClick={() => {
                    const art = inspectArticle;
                    setInspectArticle(null);
                    onOpenMovementWithArticle(art, 'SAIDA');
                  }}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  - Saída
                </button>
              </div>

              <button
                onClick={() => setInspectArticle(null)}
                className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
