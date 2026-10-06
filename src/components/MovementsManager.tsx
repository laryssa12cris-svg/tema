import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Search, 
  Plus, 
  CheckCircle, 
  AlertCircle,
  FileText,
  MapPin,
  Building,
  User,
  Calendar
} from 'lucide-react';
import { 
  InventoryDatabase, 
  Article, 
  StockMovement, 
  MovementType 
} from '../types/inventory';
import { formatDateTime } from '../utils/formatters';

interface MovementsManagerProps {
  database: InventoryDatabase;
  onRegisterMovement: (movement: StockMovement) => void;
  preselectedArticle?: Article | null;
  preselectedType?: MovementType;
}

export const MovementsManager: React.FC<MovementsManagerProps> = ({
  database,
  onRegisterMovement,
  preselectedArticle,
  preselectedType = 'ENTRADA'
}) => {
  const { articles, movements } = database;

  // Form State
  const [movementType, setMovementType] = useState<MovementType>(preselectedType);
  const [selectedArticleId, setSelectedArticleId] = useState<string>(
    preselectedArticle?.id || articles[0]?.id || ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState<string>('');
  const [documentNumber, setDocumentNumber] = useState<string>('');
  const [departmentOrLab, setDepartmentOrLab] = useState<string>('Oficina Mecânica');
  const [requester, setRequester] = useState<string>('Prof. Instrutor SENAI');
  const [updateLocation, setUpdateLocation] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Search & Filter in movements history
  const [historySearch, setHistorySearch] = useState<string>('');
  const [historyFilterType, setHistoryFilterType] = useState<'ALL' | 'ENTRADA' | 'SAIDA'>('ALL');

  // Currently selected article object
  const currentArticle = articles.find((a) => a.id === selectedArticleId);

  // Sync updateLocation default if currentArticle changes
  React.useEffect(() => {
    if (currentArticle) {
      setUpdateLocation(currentArticle.location);
    }
  }, [currentArticle]);

  React.useEffect(() => {
    if (preselectedArticle) {
      setSelectedArticleId(preselectedArticle.id);
      setUpdateLocation(preselectedArticle.location);
    }
    if (preselectedType) {
      setMovementType(preselectedType);
    }
  }, [preselectedArticle, preselectedType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!currentArticle) {
      setErrorMsg('Selecione um artigo válido.');
      return;
    }

    if (!quantity || quantity <= 0) {
      setErrorMsg('A quantidade deve ser maior que zero.');
      return;
    }

    // Check stock for SAIDA
    if (movementType === 'SAIDA') {
      if (currentArticle.currentQuantity < quantity) {
        setErrorMsg(
          `Saldo insuficiente! Saldo atual: ${currentArticle.currentQuantity} ${currentArticle.unit}. Tentativa de retirada: ${quantity}.`
        );
        return;
      }
    }

    const previousQuantity = currentArticle.currentQuantity;
    const newQuantity =
      movementType === 'ENTRADA'
        ? previousQuantity + quantity
        : previousQuantity - quantity;

    const newMov: StockMovement = {
      id: `mov-${Date.now()}`,
      articleId: currentArticle.id,
      articleCode: currentArticle.code,
      articleName: currentArticle.name,
      type: movementType,
      quantity,
      previousQuantity,
      newQuantity,
      location: updateLocation.trim() || currentArticle.location,
      date: new Date().toISOString(),
      documentNumber: documentNumber.trim() || (movementType === 'ENTRADA' ? 'NF-e Balcão' : 'REQ-Interna'),
      reason: reason.trim() || (movementType === 'ENTRADA' ? 'Entrada para Reposição de Almoxarifado' : 'Consumo em Aulas Práticas'),
      departmentOrLab: departmentOrLab.trim() || undefined,
      requester: requester.trim() || 'Almoxarifado SENAI (Carlos)',
      notes: notes.trim() || undefined
    };

    onRegisterMovement(newMov);
    setSuccessMsg(
      `Movimentação de ${movementType} registrada com sucesso! Novo saldo do artigo: ${newQuantity} ${currentArticle.unit}.`
    );

    // Reset some fields
    setQuantity(1);
    setReason('');
    setNotes('');
  };

  // Filtered movements history
  const filteredHistory = movements
    .filter((m) => {
      const q = historySearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        m.articleName.toLowerCase().includes(q) ||
        m.articleCode.toLowerCase().includes(q) ||
        m.reason.toLowerCase().includes(q) ||
        (m.requester && m.requester.toLowerCase().includes(q)) ||
        (m.departmentOrLab && m.departmentOrLab.toLowerCase().includes(q));

      const matchesType = historyFilterType === 'ALL' || m.type === historyFilterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#E30613] text-white text-xs font-black px-2 py-0.5 rounded tracking-wider uppercase">
              Almoxarifado Ativo
            </span>
            <h2 className="text-xl font-black text-neutral-900">
              Registro e Controle de Movimentações
            </h2>
          </div>
          <p className="text-xs text-neutral-700 mt-1">
            Lance entradas de fornecedores e saídas para oficinas com atualização imediata do saldo físico.
          </p>
        </div>

        <div className="flex gap-2 text-xs font-bold">
          <span className="bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
            <ArrowDownLeft className="w-3.5 h-3.5" />
            Entradas: {movements.filter((m) => m.type === 'ENTRADA').length}
          </span>
          <span className="bg-red-100 text-[#E30613] px-3 py-1.5 rounded-lg border border-red-200 flex items-center gap-1.5">
            <ArrowUpRight className="w-3.5 h-3.5" />
            Saídas: {movements.filter((m) => m.type === 'SAIDA').length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Launch Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-neutral-200 shadow-sm p-6 space-y-5">
          <div className="border-b border-neutral-100 pb-3 flex justify-between items-center">
            <h3 className="font-black text-base text-neutral-900 flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-[#E30613]" />
              Nova Movimentação
            </h3>
            <span className="text-[11px] font-bold text-neutral-700">Tempo Real</span>
          </div>

          {/* Type Selector (ENTRADA vs SAÍDA) */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setMovementType('ENTRADA');
                setErrorMsg('');
              }}
              className={`py-2.5 rounded-md font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
                movementType === 'ENTRADA'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-neutral-700 hover:text-black'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>+ ENTRADA</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMovementType('SAIDA');
                setErrorMsg('');
              }}
              className={`py-2.5 rounded-md font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
                movementType === 'SAIDA'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-neutral-700 hover:text-black'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>- SAÍDA (Baixa)</span>
            </button>
          </div>

          {/* Form alert messages */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Article Select */}
            <div>
              <label className="block text-xs font-black uppercase text-neutral-700 mb-1">
                Selecione o Artigo / Material *
              </label>
              {articles.length === 0 ? (
                <div className="text-xs text-neutral-700 p-2 border rounded bg-neutral-50">
                  Nenhum artigo cadastrado. Cadastre artigos na aba &ldquo;Cadastro Hierárquico&rdquo;.
                </div>
              ) : (
                <select
                  value={selectedArticleId}
                  onChange={(e) => setSelectedArticleId(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs font-semibold bg-white focus:ring-2 focus:ring-[#E30613]"
                  required
                >
                  {articles.map((art) => (
                    <option key={art.id} value={art.id}>
                      {art.code} - {art.name} (Saldo: {art.currentQuantity} {art.unit})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Current Item Specs Snapshot */}
            {currentArticle && (
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs space-y-1">
                <div className="flex justify-between font-bold text-neutral-900">
                  <span>Saldo Atual:</span>
                  <span className="text-base text-neutral-900">
                    {currentArticle.currentQuantity} {currentArticle.unit}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-700 text-[11px]">
                  <span>Localização Atual:</span>
                  <span className="font-semibold">{currentArticle.location}</span>
                </div>
                <div className="flex justify-between text-neutral-700 text-[11px]">
                  <span>Estoque Mínimo de Segurança:</span>
                  <span>{currentArticle.minQuantity} {currentArticle.unit}</span>
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black uppercase text-neutral-700 mb-1">
                  Quantidade a {movementType === 'ENTRADA' ? 'Entrar' : 'Retirar'} *
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm font-bold focus:ring-2 focus:ring-[#E30613]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-neutral-700 mb-1">
                  Nº Documento / NF / OS
                </label>
                <input
                  type="text"
                  placeholder={movementType === 'ENTRADA' ? 'Ex: NF-e 49120' : 'Ex: REQ-089/26'}
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-[#E30613]"
                />
              </div>
            </div>

            {/* Department / Lab & Requester */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black uppercase text-neutral-700 mb-1">
                  {movementType === 'ENTRADA' ? 'Almoxarifado / Entrada' : 'Destino (Oficina/Lab)'} *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Laboratório de Elétrica"
                  value={departmentOrLab}
                  onChange={(e) => setDepartmentOrLab(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs focus:ring-2 focus:ring-[#E30613]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-neutral-700 mb-1">
                  {movementType === 'ENTRADA' ? 'Recebedor / Inspetor' : 'Solicitante / Docente'} *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Carlos (Resp. Almoxarifado)"
                  value={requester}
                  onChange={(e) => setRequester(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs focus:ring-2 focus:ring-[#E30613]"
                  required
                />
              </div>
            </div>

            {/* Storage Location update */}
            <div>
              <label className="block text-xs font-black uppercase text-neutral-700 mb-1">
                Localização Física de Armazenamento
              </label>
              <input
                type="text"
                value={updateLocation}
                onChange={(e) => setUpdateLocation(e.target.value)}
                placeholder="Ex: Almoxarifado Central - Prateleira E02, Gaveta 04"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs focus:ring-2 focus:ring-[#E30613]"
              />
              <p className="text-[11px] text-neutral-700 mt-1">
                Caso o material seja guardado em novo local, atualize aqui.
              </p>
            </div>

            {/* Motivo */}
            <div>
              <label className="block text-xs font-black uppercase text-neutral-700 mb-1">
                Motivo / Justificativa da Movimentação *
              </label>
              <input
                type="text"
                placeholder={movementType === 'ENTRADA' ? 'Ex: Aquisição emergencial para reposição de estoque' : 'Ex: Aula Prática de Instalações Elétricas - Turma T-202'}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs focus:ring-2 focus:ring-[#E30613]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={articles.length === 0}
              className={`w-full py-3 rounded-lg font-bold text-sm text-white shadow-md transition-all active:scale-95 ${
                movementType === 'ENTRADA'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-[#E30613] hover:bg-[#C4122F]'
              }`}
            >
              {movementType === 'ENTRADA' ? 'Confirmar Entrada (+)' : 'Confirmar Saída / Baixa (-)'}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Full Audit History (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-neutral-200 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-neutral-100 pb-3">
            <div>
              <h3 className="font-black text-base text-neutral-900">
                Histórico Geral de Movimentações
              </h3>
              <p className="text-xs text-neutral-700">Rastreabilidade completa de todas as transações</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setHistoryFilterType('ALL')}
                className={`px-2.5 py-1 rounded text-xs font-bold ${
                  historyFilterType === 'ALL' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setHistoryFilterType('ENTRADA')}
                className={`px-2.5 py-1 rounded text-xs font-bold ${
                  historyFilterType === 'ENTRADA' ? 'bg-emerald-600 text-white' : 'bg-neutral-100 text-neutral-700'
                }`}
              >
                Entradas
              </button>
              <button
                onClick={() => setHistoryFilterType('SAIDA')}
                className={`px-2.5 py-1 rounded text-xs font-bold ${
                  historyFilterType === 'SAIDA' ? 'bg-red-600 text-white' : 'bg-neutral-100 text-neutral-700'
                }`}
              >
                Saídas
              </button>
            </div>
          </div>

          {/* Search box for history */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-600 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filtrar histórico por material, código, motivo, solicitante..."
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-neutral-300 rounded-lg text-xs"
            />
          </div>

          {/* Movements Timeline/List */}
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-neutral-700 text-xs border border-dashed rounded-lg">
              Nenhuma movimentação encontrada com os filtros informados.
            </div>
          ) : (
            <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
              {filteredHistory.map((mov) => {
                const isEntrada = mov.type === 'ENTRADA';
                return (
                  <div
                    key={mov.id}
                    className="p-3.5 rounded-lg border border-neutral-200 bg-neutral-50/50 hover:bg-neutral-100/60 transition-colors space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-black text-[11px] px-2 py-0.5 rounded flex items-center gap-1 ${
                            isEntrada
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-[#E30613]'
                          }`}
                        >
                          {isEntrada ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                          {isEntrada ? 'ENTRADA' : 'SAÍDA'}
                        </span>
                        <span className="font-mono text-xs font-bold text-neutral-900 bg-white px-1.5 py-0.5 rounded border border-neutral-200">
                          {mov.articleCode}
                        </span>
                        <span className="font-bold text-neutral-950 text-xs">{mov.articleName}</span>
                      </div>

                      <div className="text-right">
                        <span
                          className={`font-black text-sm ${
                            isEntrada ? 'text-emerald-700' : 'text-neutral-900'
                          }`}
                        >
                          {isEntrada ? '+' : '-'}{mov.quantity}
                        </span>
                        <div className="text-[10px] text-neutral-700">
                          Saldo: {mov.previousQuantity} &rarr; <strong>{mov.newQuantity}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-neutral-800 font-medium">
                      Motivo: <span className="text-neutral-900">{mov.reason}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-neutral-700 pt-1 border-t border-neutral-200/60">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-neutral-600 shrink-0" />
                        <span>{formatDateTime(mov.date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Building className="w-3 h-3 text-neutral-600 shrink-0" />
                        <span className="truncate">{mov.departmentOrLab || 'Almoxarifado'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3 text-neutral-600 shrink-0" />
                        <span className="truncate">{mov.requester || 'Carlos'}</span>
                      </div>
                    </div>

                    {mov.location && (
                      <div className="flex items-center gap-1 text-[11px] text-neutral-700">
                        <MapPin className="w-3 h-3 text-[#E30613] shrink-0" />
                        <span>Local: {mov.location}</span>
                        {mov.documentNumber && (
                          <span className="ml-auto text-neutral-700 font-mono text-[10px]">
                            Doc: {mov.documentNumber}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
