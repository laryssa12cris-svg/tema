import React, { useState } from 'react';
import { 
  Network, 
  Plus, 
  Trash2, 
  Check, 
  Layers, 
  FolderTree, 
  Boxes, 
  Tag, 
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  InventoryDatabase, 
  ItemType, 
  ItemGroup, 
  ItemSubgroup, 
  Article 
} from '../types/inventory';
import { 
  generateNextTypeCode, 
  generateNextGroupCode, 
  generateNextSubgroupCode, 
  generateNextArticleCode,
  formatCurrency 
} from '../utils/formatters';

interface HierarchyManagerProps {
  database: InventoryDatabase;
  onAddType: (type: ItemType) => void;
  onDeleteType: (id: string) => void;
  onAddGroup: (group: ItemGroup) => void;
  onDeleteGroup: (id: string) => void;
  onAddSubgroup: (subgroup: ItemSubgroup) => void;
  onDeleteSubgroup: (id: string) => void;
  onAddArticle: (article: Article) => void;
  onDeleteArticle: (id: string) => void;
}

export const HierarchyManager: React.FC<HierarchyManagerProps> = ({
  database,
  onAddType,
  onDeleteType,
  onAddGroup,
  onDeleteGroup,
  onAddSubgroup,
  onDeleteSubgroup,
  onAddArticle,
  onDeleteArticle
}) => {
  const { types, groups, subgroups, articles } = database;

  // Active view tab: 'article-wizard' | 'types' | 'groups' | 'subgroups' | 'articles' | 'tree'
  const [activeSubTab, setActiveSubTab] = useState<'article-wizard' | 'types' | 'groups' | 'subgroups' | 'articles'>('article-wizard');

  // --- FORM STATES ---
  // New Type Form
  const [typeName, setTypeName] = useState('');
  const [typeDescription, setTypeDescription] = useState('');

  // New Group Form
  const [groupTypeId, setGroupTypeId] = useState(types[0]?.id || '');
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');

  // New Subgroup Form
  const [subgroupGroupId, setSubgroupGroupId] = useState(groups[0]?.id || '');
  const [subgroupName, setSubgroupName] = useState('');
  const [subgroupDescription, setSubgroupDescription] = useState('');

  // New Article Form
  const [wizardTypeId, setWizardTypeId] = useState(types[0]?.id || '');
  const [wizardGroupId, setWizardGroupId] = useState('');
  const [wizardSubgroupId, setWizardSubgroupId] = useState('');
  const [articleName, setArticleName] = useState('');
  const [articleDescription, setArticleDescription] = useState('');
  const [articleUnit, setArticleUnit] = useState('Unidade');
  const [articleQuantity, setArticleQuantity] = useState<number>(10);
  const [articleMinQuantity, setArticleMinQuantity] = useState<number>(5);
  const [articleLocation, setArticleLocation] = useState('Almoxarifado Central - Prateleira A1');
  const [articleUnitCost, setArticleUnitCost] = useState<number>(25.0);

  // Notification message
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Available groups for selected type
  const availableGroupsForType = groups.filter((g) => g.typeId === wizardTypeId);
  // Available subgroups for selected group
  const effectiveGroupId = wizardGroupId || availableGroupsForType[0]?.id || '';
  const availableSubgroupsForGroup = subgroups.filter((s) => s.groupId === effectiveGroupId);
  const effectiveSubgroupId = wizardSubgroupId || availableSubgroupsForGroup[0]?.id || '';

  // Auto generated codes preview
  const nextTypeCode = generateNextTypeCode(types);

  const selectedTypeForGroup = types.find((t) => t.id === groupTypeId);
  const groupsOfType = groups.filter((g) => g.typeId === groupTypeId);
  const nextGroupCode = selectedTypeForGroup ? generateNextGroupCode(selectedTypeForGroup.code, groupsOfType) : 'GRP-01.01';

  const selectedGroupForSubgroup = groups.find((g) => g.id === subgroupGroupId);
  const subgroupsOfGroup = subgroups.filter((s) => s.groupId === subgroupGroupId);
  const nextSubgroupCode = selectedGroupForSubgroup ? generateNextSubgroupCode(selectedGroupForSubgroup.code, subgroupsOfGroup) : 'SUB-01.01.01';

  const selectedSubgroupForArticle = subgroups.find((s) => s.id === effectiveSubgroupId);
  const articlesOfSubgroup = articles.filter((a) => a.subgroupId === effectiveSubgroupId);
  const nextArticleCode = selectedSubgroupForArticle ? generateNextArticleCode(selectedSubgroupForArticle.code, articlesOfSubgroup) : 'ART-01.01.01.001';

  // --- SUBMISSIONS ---
  const handleCreateType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeName.trim()) return;

    const newType: ItemType = {
      id: `type-${Date.now()}`,
      code: nextTypeCode,
      name: typeName.trim(),
      description: typeDescription.trim() || undefined
    };

    onAddType(newType);
    setTypeName('');
    setTypeDescription('');
    setNotification({ type: 'success', text: `Tipo ${newType.code} - ${newType.name} criado com sucesso!` });
    setActiveSubTab('types');
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || !groupTypeId) return;

    const newGroup: ItemGroup = {
      id: `grp-${Date.now()}`,
      typeId: groupTypeId,
      code: nextGroupCode,
      name: groupName.trim(),
      description: groupDescription.trim() || undefined
    };

    onAddGroup(newGroup);
    setGroupName('');
    setGroupDescription('');
    setNotification({ type: 'success', text: `Grupo ${newGroup.code} - ${newGroup.name} criado com sucesso!` });
    setActiveSubTab('groups');
  };

  const handleCreateSubgroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subgroupName.trim() || !subgroupGroupId) return;

    const newSub: ItemSubgroup = {
      id: `sub-${Date.now()}`,
      groupId: subgroupGroupId,
      code: nextSubgroupCode,
      name: subgroupName.trim(),
      description: subgroupDescription.trim() || undefined
    };

    onAddSubgroup(newSub);
    setSubgroupName('');
    setSubgroupDescription('');
    setNotification({ type: 'success', text: `Subgrupo ${newSub.code} - ${newSub.name} criado com sucesso!` });
    setActiveSubTab('subgroups');
  };

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleName.trim() || !wizardTypeId || !effectiveGroupId || !effectiveSubgroupId) {
      setNotification({ type: 'error', text: 'Por favor, selecione Tipo, Grupo, Subgrupo e preencha o nome do artigo.' });
      return;
    }

    // Ensure description ends with technical responsible first name if not already present
    let finalDesc = articleDescription.trim();
    if (!finalDesc.includes('Carlos')) {
      finalDesc = finalDesc ? `${finalDesc} - Carlos` : `${articleName.trim()} com especificações técnicas completas para atividades no SENAI - Carlos`;
    }

    const newArt: Article = {
      id: `art-${Date.now()}`,
      code: nextArticleCode,
      typeId: wizardTypeId,
      groupId: effectiveGroupId,
      subgroupId: effectiveSubgroupId,
      name: articleName.trim(),
      description: finalDesc,
      unit: articleUnit,
      currentQuantity: Number(articleQuantity) || 0,
      minQuantity: Number(articleMinQuantity) || 0,
      location: articleLocation.trim() || 'Almoxarifado Central - Prateleira Geral',
      unitCost: Number(articleUnitCost) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onAddArticle(newArt);
    setArticleName('');
    setArticleDescription('');
    setNotification({ type: 'success', text: `Artigo ${newArt.code} cadastrado com sucesso!` });
    setActiveSubTab('articles');
  };

  return (
    <div className="space-y-6">
      {/* Title & Hierarchy Concept Banner */}
      <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#E30613] text-white text-xs font-black px-2 py-0.5 rounded tracking-wider uppercase">
              Hierarquia Estruturada
            </span>
            <h2 className="text-xl font-black text-neutral-900">
              Cadastro Hierárquico de Materiais (4 Níveis)
            </h2>
          </div>
          <p className="text-xs text-neutral-700 mt-1">
            Padronização oficial SENAI: <strong>Tipo (N1)</strong> &rarr; <strong>Grupo (N2)</strong> &rarr; <strong>Subgrupo (N3)</strong> &rarr; <strong>Artigo (N4)</strong> com geração automática e sequencial de códigos.
          </p>
        </div>

        {/* Visual code representation */}
        <div className="bg-neutral-900 text-white px-4 py-2 rounded-lg font-mono text-xs flex items-center gap-1.5 shadow-xs">
          <span className="text-red-400 font-bold">TIP-01</span>
          <ChevronRight className="w-3 h-3 text-neutral-500" />
          <span className="text-amber-400 font-bold">GRP-01.01</span>
          <ChevronRight className="w-3 h-3 text-neutral-500" />
          <span className="text-sky-400 font-bold">SUB-01.01.01</span>
          <ChevronRight className="w-3 h-3 text-neutral-500" />
          <span className="text-emerald-400 font-bold">ART-01.01.01.001</span>
        </div>
      </div>

      {notification && (
        <div
          className={`p-3 rounded-lg text-xs font-bold flex items-center justify-between transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-[#E30613] border border-red-200'
          }`}
        >
          <span>{notification.text}</span>
          <button
            onClick={() => setNotification(null)}
            className="text-neutral-500 hover:text-neutral-900 ml-2"
          >
            &times;
          </button>
        </div>
      )}

      {/* Hierarchy Sub-Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-2">
        <button
          onClick={() => setActiveSubTab('article-wizard')}
          className={`px-4 py-2 rounded-lg font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
            activeSubTab === 'article-wizard'
              ? 'bg-[#E30613] text-white shadow-sm'
              : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>+ Cadastrar Artigo (Assistente N1-N4)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('types')}
          className={`px-3.5 py-2 rounded-lg font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
            activeSubTab === 'types'
              ? 'bg-neutral-900 text-white'
              : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          <Layers className="w-4 h-4 text-red-500" />
          <span>Tipos ({types.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('groups')}
          className={`px-3.5 py-2 rounded-lg font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
            activeSubTab === 'groups'
              ? 'bg-neutral-900 text-white'
              : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          <FolderTree className="w-4 h-4 text-amber-500" />
          <span>Grupos ({groups.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('subgroups')}
          className={`px-3.5 py-2 rounded-lg font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
            activeSubTab === 'subgroups'
              ? 'bg-neutral-900 text-white'
              : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          <Tag className="w-4 h-4 text-sky-500" />
          <span>Subgrupos ({subgroups.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('articles')}
          className={`px-3.5 py-2 rounded-lg font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
            activeSubTab === 'articles'
              ? 'bg-neutral-900 text-white'
              : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          <Boxes className="w-4 h-4 text-emerald-500" />
          <span>Artigos Cadastrados ({articles.length})</span>
        </button>
      </div>

      {/* TAB CONTENT 1: ARTICLE WIZARD (Cadastro de Artigo Hierárquico com Código Automático) */}
      {activeSubTab === 'article-wizard' && (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 space-y-6">
          <div className="border-b border-neutral-100 pb-4">
            <h3 className="text-base font-black text-neutral-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#E30613]" />
              Novo Artigo / Material de Consumo ou Ferramenta
            </h3>
            <p className="text-xs text-neutral-700 mt-0.5">
              Selecione os 3 níveis superiores. O código final do artigo será gerado automaticamente de acordo com o subgrupo selecionado.
            </p>
          </div>

          <form onSubmit={handleCreateArticle} className="space-y-6">
            {/* Step 1: Hierarchical Selection Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200">
              {/* Type Selection */}
              <div>
                <label className="block text-xs font-black uppercase text-neutral-700 mb-1">
                  1. Tipo de Material (Nível 1) *
                </label>
                {types.length === 0 ? (
                  <div className="text-xs text-red-700 bg-red-50 p-2 rounded">
                    Nenhum Tipo cadastrado. Crie um tipo na aba &ldquo;Tipos&rdquo; primeiro.
                  </div>
                ) : (
                  <select
                    value={wizardTypeId}
                    onChange={(e) => {
                      setWizardTypeId(e.target.value);
                      setWizardGroupId('');
                      setWizardSubgroupId('');
                    }}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs font-semibold bg-white focus:ring-2 focus:ring-[#E30613]"
                    required
                  >
                    {types.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.code} - {t.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Group Selection */}
              <div>
                <label className="block text-xs font-black uppercase text-neutral-700 mb-1">
                  2. Grupo (Nível 2) *
                </label>
                {availableGroupsForType.length === 0 ? (
                  <div className="text-xs text-amber-700 bg-amber-50 p-2 rounded">
                    Nenhum Grupo neste Tipo. Crie na aba &ldquo;Grupos&rdquo;.
                  </div>
                ) : (
                  <select
                    value={effectiveGroupId}
                    onChange={(e) => {
                      setWizardGroupId(e.target.value);
                      setWizardSubgroupId('');
                    }}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs font-semibold bg-white focus:ring-2 focus:ring-[#E30613]"
                    required
                  >
                    {availableGroupsForType.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.code} - {g.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Subgroup Selection */}
              <div>
                <label className="block text-xs font-black uppercase text-neutral-700 mb-1">
                  3. Subgrupo (Nível 3) *
                </label>
                {availableSubgroupsForGroup.length === 0 ? (
                  <div className="text-xs text-sky-700 bg-sky-50 p-2 rounded">
                    Nenhum Subgrupo neste Grupo. Crie na aba &ldquo;Subgrupos&rdquo;.
                  </div>
                ) : (
                  <select
                    value={effectiveSubgroupId}
                    onChange={(e) => setWizardSubgroupId(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs font-semibold bg-white focus:ring-2 focus:ring-[#E30613]"
                    required
                  >
                    {availableSubgroupsForGroup.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.code} - {s.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Step 2: Generated Code Preview */}
            <div className="bg-neutral-900 text-white p-3 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-neutral-300">Código Único Automático do Artigo (Nível 4):</span>
                <span className="font-mono text-sm font-bold text-emerald-300 px-2 py-0.5 rounded bg-black/40">
                  {nextArticleCode}
                </span>
              </div>
              <span className="text-[11px] text-neutral-400 hidden sm:inline-block">Geração sequencial protegida</span>
            </div>

            {/* Step 3: Article Properties */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase text-neutral-700 mb-1">
                  Nome do Artigo / Material *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Alicate Universal Isolado 1000V 8 Polegadas"
                  value={articleName}
                  onChange={(e) => setArticleName(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-[#E30613]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-neutral-700 mb-1">
                  Unidade de Medida *
                </label>
                <select
                  value={articleUnit}
                  onChange={(e) => setArticleUnit(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#E30613]"
                >
                  <option value="Unidade">Unidade (un)</option>
                  <option value="Peça">Peça (pç)</option>
                  <option value="Rolo (100m)">Rolo (100m)</option>
                  <option value="Lata (5kg)">Lata (5kg)</option>
                  <option value="Carretel (15kg)">Carretel (15kg)</option>
                  <option value="Caixa (10 un)">Caixa (10 un)</option>
                  <option value="Par">Par</option>
                  <option value="Metro">Metro (m)</option>
                  <option value="Kg">Quilograma (kg)</option>
                  <option value="Barra (6m)">Barra (6m)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-black uppercase text-neutral-700">
                    Descrição Técnica Detalhada *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (!articleDescription.includes('Carlos')) {
                        setArticleDescription(articleDescription ? `${articleDescription} - Carlos` : 'Especificação técnica conforme normas SENAI - Carlos');
                      }
                    }}
                    className="text-[11px] font-bold text-[#E30613] hover:underline"
                  >
                    + Adicionar assinatura &ldquo; - Carlos&rdquo;
                  </button>
                </div>
                <textarea
                  rows={3}
                  placeholder="Insira detalhes completos: dimensões, normas técnicas, tensão, material construtivo e o seu primeiro nome no final (ex: ... - Carlos)"
                  value={articleDescription}
                  onChange={(e) => setArticleDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs leading-relaxed font-mono focus:ring-2 focus:ring-[#E30613]"
                  required
                />
              </div>

              {/* Physical Location */}
              <div className="md:col-span-2">
                <label className="block text-xs font-black uppercase text-neutral-700 mb-1">
                  Localização Física de Armazenamento *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Almoxarifado Central - Prateleira B04, Gaveteiro 08"
                  value={articleLocation}
                  onChange={(e) => setArticleLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-[#E30613]"
                  required
                />
                <p className="text-[11px] text-neutral-700 mt-1">
                  Identificação do almoxarifado, galpão de oficina ou laboratório do SENAI.
                </p>
              </div>

              {/* Quantity, Min, Cost */}
              <div>
                <label className="block text-xs font-black uppercase text-neutral-700 mb-1">
                  Quantidade Inicial em Estoque
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={articleQuantity}
                  onChange={(e) => setArticleQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-[#E30613]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-neutral-700 mb-1">
                  Estoque Mínimo de Segurança
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={articleMinQuantity}
                  onChange={(e) => setArticleMinQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-[#E30613]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-neutral-700 mb-1">
                  Custo Unitário Estimado (R$)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={articleUnitCost}
                  onChange={(e) => setArticleUnitCost(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-[#E30613]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100 flex justify-end gap-3">
              <button
                type="submit"
                disabled={availableSubgroupsForGroup.length === 0}
                className="bg-[#E30613] hover:bg-[#C4122F] text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                Concluir Cadastro do Artigo
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB CONTENT 2: TIPOS (Nível 1) */}
      {activeSubTab === 'types' && (
        <div className="space-y-6">
          {/* New Type Form */}
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5">
            <h3 className="text-sm font-black text-neutral-900 mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#E30613]" />
              Novo Tipo de Material (Nível 1) &bull; Código Automático: <span className="font-mono text-[#E30613]">{nextTypeCode}</span>
            </h3>
            <form onSubmit={handleCreateType} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Nome do Tipo *</label>
                <input
                  type="text"
                  placeholder="Ex: Química e Bioprocessos"
                  value={typeName}
                  onChange={(e) => setTypeName(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Descrição</label>
                <input
                  type="text"
                  placeholder="Ex: Reagentes químicos, vidrarias e insumos"
                  value={typeDescription}
                  onChange={(e) => setTypeDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-[#E30613] hover:bg-[#C4122F] text-white py-2 px-4 rounded-lg font-bold text-xs"
                >
                  Adicionar Tipo
                </button>
              </div>
            </form>
          </div>

          {/* Types List */}
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-neutral-900 text-white font-bold text-xs uppercase tracking-wider flex justify-between">
              <span>Tipos Cadastrados ({types.length})</span>
              <span>Nível 1 da Hierarquia</span>
            </div>
            {types.length === 0 ? (
              <div className="p-6 text-center text-xs text-neutral-700">Nenhum tipo cadastrado.</div>
            ) : (
              <div className="divide-y divide-neutral-200">
                {types.map((t) => {
                  const groupsCount = groups.filter((g) => g.typeId === t.id).length;
                  const articlesCount = articles.filter((a) => a.typeId === t.id).length;
                  return (
                    <div key={t.id} className="p-4 flex items-center justify-between hover:bg-neutral-50">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded text-xs font-bold text-neutral-900">
                            {t.code}
                          </span>
                          <span className="font-bold text-neutral-900 text-sm">{t.name}</span>
                        </div>
                        {t.description && (
                          <p className="text-xs text-neutral-700 mt-1">{t.description}</p>
                        )}
                        <div className="flex gap-3 text-[11px] text-neutral-700 mt-1">
                          <span>{groupsCount} Grupo(s)</span>
                          <span>&bull;</span>
                          <span>{articlesCount} Artigo(s)</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          onDeleteType(t.id);
                          setNotification({ type: 'success', text: `Tipo ${t.name} removido.` });
                        }}
                        className="text-neutral-400 hover:text-red-600 p-2 rounded hover:bg-neutral-100"
                        title="Excluir Tipo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: GRUPOS (Nível 2) */}
      {activeSubTab === 'groups' && (
        <div className="space-y-6">
          {/* New Group Form */}
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5">
            <h3 className="text-sm font-black text-neutral-900 mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#E30613]" />
              Novo Grupo (Nível 2) &bull; Código Automático: <span className="font-mono text-[#E30613]">{nextGroupCode}</span>
            </h3>
            <form onSubmit={handleCreateGroup} className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Vincular ao Tipo (N1) *</label>
                <select
                  value={groupTypeId}
                  onChange={(e) => setGroupTypeId(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs bg-white"
                  required
                >
                  {types.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.code} - {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Nome do Grupo *</label>
                <input
                  type="text"
                  placeholder="Ex: Abrasivos e Lixas"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Descrição</label>
                <input
                  type="text"
                  placeholder="Ex: Discos de corte, desbaste e lixas"
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-[#E30613] hover:bg-[#C4122F] text-white py-2 px-4 rounded-lg font-bold text-xs"
                >
                  Adicionar Grupo
                </button>
              </div>
            </form>
          </div>

          {/* Groups List */}
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-neutral-900 text-white font-bold text-xs uppercase tracking-wider flex justify-between">
              <span>Grupos Cadastrados ({groups.length})</span>
              <span>Nível 2 da Hierarquia</span>
            </div>
            {groups.length === 0 ? (
              <div className="p-6 text-center text-xs text-neutral-700">Nenhum grupo cadastrado.</div>
            ) : (
              <div className="divide-y divide-neutral-200">
                {groups.map((g) => {
                  const parentType = types.find((t) => t.id === g.typeId);
                  const subCount = subgroups.filter((s) => s.groupId === g.id).length;
                  return (
                    <div key={g.id} className="p-4 flex items-center justify-between hover:bg-neutral-50">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded text-xs font-bold text-neutral-900">
                            {g.code}
                          </span>
                          <span className="font-bold text-neutral-900 text-sm">{g.name}</span>
                          <span className="text-[11px] bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded">
                            Tipo: {parentType?.name || 'Geral'}
                          </span>
                        </div>
                        {g.description && <p className="text-xs text-neutral-700 mt-1">{g.description}</p>}
                        <div className="text-[11px] text-neutral-700 mt-1">
                          {subCount} Subgrupo(s) vinculados
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          onDeleteGroup(g.id);
                          setNotification({ type: 'success', text: `Grupo ${g.name} removido.` });
                        }}
                        className="text-neutral-400 hover:text-red-600 p-2 rounded hover:bg-neutral-100"
                        title="Excluir Grupo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: SUBGRUPOS (Nível 3) */}
      {activeSubTab === 'subgroups' && (
        <div className="space-y-6">
          {/* New Subgroup Form */}
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5">
            <h3 className="text-sm font-black text-neutral-900 mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#E30613]" />
              Novo Subgrupo (Nível 3) &bull; Código Automático: <span className="font-mono text-[#E30613]">{nextSubgroupCode}</span>
            </h3>
            <form onSubmit={handleCreateSubgroup} className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Vincular ao Grupo (N2) *</label>
                <select
                  value={subgroupGroupId}
                  onChange={(e) => setSubgroupGroupId(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs bg-white"
                  required
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.code} - {g.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Nome do Subgrupo *</label>
                <input
                  type="text"
                  placeholder="Ex: Discos de Desbaste para Aço"
                  value={subgroupName}
                  onChange={(e) => setSubgroupName(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Descrição</label>
                <input
                  type="text"
                  placeholder="Ex: Discos 115mm e 180mm grão fino"
                  value={subgroupDescription}
                  onChange={(e) => setSubgroupDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-[#E30613] hover:bg-[#C4122F] text-white py-2 px-4 rounded-lg font-bold text-xs"
                >
                  Adicionar Subgrupo
                </button>
              </div>
            </form>
          </div>

          {/* Subgroups List */}
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-neutral-900 text-white font-bold text-xs uppercase tracking-wider flex justify-between">
              <span>Subgrupos Cadastrados ({subgroups.length})</span>
              <span>Nível 3 da Hierarquia</span>
            </div>
            {subgroups.length === 0 ? (
              <div className="p-6 text-center text-xs text-neutral-700">Nenhum subgrupo cadastrado.</div>
            ) : (
              <div className="divide-y divide-neutral-200">
                {subgroups.map((s) => {
                  const parentGroup = groups.find((g) => g.id === s.groupId);
                  const artsCount = articles.filter((a) => a.subgroupId === s.id).length;
                  return (
                    <div key={s.id} className="p-4 flex items-center justify-between hover:bg-neutral-50">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded text-xs font-bold text-neutral-900">
                            {s.code}
                          </span>
                          <span className="font-bold text-neutral-900 text-sm">{s.name}</span>
                          <span className="text-[11px] bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded">
                            Grupo: {parentGroup?.name || 'Geral'}
                          </span>
                        </div>
                        {s.description && <p className="text-xs text-neutral-700 mt-1">{s.description}</p>}
                        <div className="text-[11px] text-neutral-700 mt-1">
                          {artsCount} Artigo(s) neste subgrupo
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          onDeleteSubgroup(s.id);
                          setNotification({ type: 'success', text: `Subgrupo ${s.name} removido.` });
                        }}
                        className="text-neutral-400 hover:text-red-600 p-2 rounded hover:bg-neutral-100"
                        title="Excluir Subgrupo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: ARTIGOS (Nível 4) */}
      {activeSubTab === 'articles' && (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-neutral-900 text-white font-bold text-xs uppercase tracking-wider flex justify-between items-center">
            <span>Todos os Artigos Cadastrados ({articles.length})</span>
            <button
              onClick={() => setActiveSubTab('article-wizard')}
              className="bg-[#E30613] hover:bg-[#C4122F] text-white px-3 py-1 rounded text-xs font-bold"
            >
              + Novo Artigo
            </button>
          </div>

          {articles.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-700">
              Nenhum artigo cadastrado. Utilize o assistente de cadastro de artigos acima.
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {articles.map((art) => {
                const typeObj = types.find((t) => t.id === art.typeId);
                const subObj = subgroups.find((s) => s.id === art.subgroupId);
                return (
                  <div key={art.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-neutral-50">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded text-xs font-bold text-neutral-900">
                          {art.code}
                        </span>
                        <span className="font-black text-neutral-900 text-sm">{art.name}</span>
                        <span className="text-[11px] bg-red-50 text-[#E30613] font-semibold px-2 py-0.5 rounded border border-red-100">
                          {typeObj?.name} &rsaquo; {subObj?.name}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-700 mt-1 line-clamp-2 font-mono">
                        {art.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-[11px] text-neutral-700 mt-1 font-medium">
                        <span>Local: <strong className="text-neutral-800">{art.location}</strong></span>
                        <span>Saldo: <strong className="text-neutral-800">{art.currentQuantity} {art.unit}</strong></span>
                        <span>Mín: {art.minQuantity}</span>
                        <span>Unit: {formatCurrency(art.unitCost)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onDeleteArticle(art.id);
                        setNotification({ type: 'success', text: `Artigo ${art.name} (${art.code}) removido.` });
                      }}
                      className="text-neutral-400 hover:text-red-600 p-2 rounded hover:bg-neutral-100 self-end sm:self-center"
                      title="Excluir Artigo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
