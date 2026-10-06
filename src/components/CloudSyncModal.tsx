import React, { useState } from 'react';
import { 
  Cloud, 
  Github, 
  HardDrive, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Sparkles, 
  X,
  ExternalLink,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { InventoryDatabase } from '../types/inventory';
import { StorageService } from '../services/storageService';
import { formatDateTime } from '../utils/formatters';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  database: InventoryDatabase;
  onUpdateDatabase: (db: InventoryDatabase) => void;
  onResetEmpty: () => void;
  onLoadInitial10: () => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  database,
  onUpdateDatabase,
  onResetEmpty,
  onLoadInitial10
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'drive' | 'github' | 'local'>('drive');

  // GitHub state
  const [ghToken, setGhToken] = useState<string>(database.syncSettings?.githubToken || '');
  const [ghGistId, setGhGistId] = useState<string>(database.syncSettings?.githubGistId || '');
  const [isSyncingGh, setIsSyncingGh] = useState<boolean>(false);
  const [ghStatusMsg, setGhStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // File import state
  const [importStatus, setImportStatus] = useState<string>('');

  // Handle GitHub Save
  const handleSaveToGitHub = async () => {
    if (!ghToken.trim()) {
      setGhStatusMsg({ text: 'Por favor, informe seu Personal Access Token do GitHub.', type: 'error' });
      return;
    }
    setIsSyncingGh(true);
    setGhStatusMsg(null);

    try {
      const result = await StorageService.syncWithGitHubGist(ghToken, database, ghGistId || undefined);
      setGhGistId(result.gistId);

      const updatedDb: InventoryDatabase = {
        ...database,
        syncSettings: {
          ...database.syncSettings,
          githubToken: ghToken,
          githubGistId: result.gistId,
          lastSyncedAt: new Date().toISOString(),
          autoSync: true
        }
      };

      onUpdateDatabase(updatedDb);
      setGhStatusMsg({
        text: `Sincronizado com sucesso no GitHub Gist! ID: ${result.gistId}`,
        type: 'success'
      });
    } catch (err: any) {
      setGhStatusMsg({
        text: `Erro ao sincronizar com GitHub: ${err.message}`,
        type: 'error'
      });
    } finally {
      setIsSyncingGh(false);
    }
  };

  // Handle GitHub Load
  const handleLoadFromGitHub = async () => {
    if (!ghToken.trim() || !ghGistId.trim()) {
      setGhStatusMsg({ text: 'Informe o Token e o ID do Gist para carregar.', type: 'error' });
      return;
    }
    setIsSyncingGh(true);
    setGhStatusMsg(null);

    try {
      const loadedDb = await StorageService.loadFromGitHubGist(ghToken, ghGistId);
      onUpdateDatabase(loadedDb);
      setGhStatusMsg({
        text: `Banco de dados restaurado com sucesso do GitHub Gist! (${loadedDb.articles.length} artigos carregados)`,
        type: 'success'
      });
    } catch (err: any) {
      setGhStatusMsg({
        text: `Erro ao carregar do GitHub: ${err.message}`,
        type: 'error'
      });
    } finally {
      setIsSyncingGh(false);
    }
  };

  // Handle File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const parsed = await StorageService.importFromJsonFile(file);
      onUpdateDatabase(parsed);
      setImportStatus(`Backup importado com sucesso! ${parsed.articles.length} materiais carregados.`);
    } catch (err: any) {
      setImportStatus(`Erro ao importar arquivo: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border-t-4 border-[#E30613] overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 bg-neutral-950 text-white flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#E30613] text-white">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg">Persistência em Nuvem &amp; Armazenamento</h3>
              <p className="text-xs text-neutral-400">
                Sincronize com Google Drive, GitHub ou realize backups manuais persistentes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 px-5 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('drive')}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'drive'
                ? 'border-[#E30613] text-[#E30613]'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <HardDrive className="w-4 h-4 text-emerald-600" />
            <span>Google Drive</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'github'
                ? 'border-[#E30613] text-[#E30613]'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Github className="w-4 h-4 text-neutral-900" />
            <span>GitHub Gist / Repo</span>
          </button>

          <button
            onClick={() => setActiveTab('local')}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'local'
                ? 'border-[#E30613] text-[#E30613]'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <RotateCcw className="w-4 h-4 text-amber-600" />
            <span>Base de Dados &amp; Testes</span>
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 space-y-5">
          {/* TAB 1: GOOGLE DRIVE */}
          {activeTab === 'drive' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 space-y-2">
                <div className="font-bold flex items-center gap-2 text-sm text-emerald-950">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Persistência via Google Drive
                </div>
                <p>
                  O aplicativo mantém persistência automática no navegador e permite exportar e importar arquivos de backup estruturados diretamente para sua pasta do Google Drive.
                </p>
              </div>

              {/* Action buttons for Drive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-neutral-200 rounded-xl p-4 text-center space-y-3 bg-neutral-50/50">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-neutral-900">Salvar no Google Drive</h4>
                    <p className="text-[11px] text-neutral-700 mt-1">
                      Gera o arquivo JSON padronizado para salvar no Drive
                    </p>
                  </div>
                  <button
                    onClick={() => StorageService.exportToJsonFile(database)}
                    className="w-full bg-[#E30613] hover:bg-[#C4122F] text-white py-2 px-3 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Baixar Arquivo JSON do Drive</span>
                  </button>
                </div>

                <div className="border border-neutral-200 rounded-xl p-4 text-center space-y-3 bg-neutral-50/50">
                  <div className="w-10 h-10 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-neutral-900">Restaurar do Google Drive</h4>
                    <p className="text-[11px] text-neutral-700 mt-1">
                      Carregue um arquivo JSON salvo previamente no seu Drive
                    </p>
                  </div>
                  <label className="w-full bg-neutral-900 hover:bg-neutral-800 text-white py-2 px-3 rounded-lg font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4" />
                    <span>Carregar Arquivo do Drive</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {importStatus && (
                <div className="p-3 bg-neutral-100 border border-neutral-300 rounded-lg text-xs font-bold text-neutral-800">
                  {importStatus}
                </div>
              )}

              {/* Status info */}
              <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 text-xs text-neutral-700 flex justify-between items-center">
                <span>Última atualização local:</span>
                <span className="font-mono font-bold text-neutral-900">
                  {formatDateTime(database.updatedAt)}
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: GITHUB */}
          {activeTab === 'github' && (
            <div className="space-y-4">
              <div className="bg-neutral-100 border border-neutral-300 rounded-xl p-4 text-xs text-neutral-800 space-y-1">
                <div className="font-bold flex items-center gap-2 text-sm text-neutral-900">
                  <Github className="w-4 h-4" />
                  Sincronização Direta com GitHub (Gist Privado)
                </div>
                <p className="text-neutral-700">
                  Permite versionar e manter o arquivo <code className="font-mono bg-white px-1 py-0.5 rounded">senai_sp_estoque_db.json</code> armazenado em sua conta do GitHub através da API REST oficial.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                    GitHub Personal Access Token (PAT)
                  </label>
                  <input
                    type="password"
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    value={ghToken}
                    onChange={(e) => setGhToken(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs font-mono"
                  />
                  <p className="text-[11px] text-neutral-700 mt-1">
                    Token com escopo <code className="font-mono font-bold">gist</code> criado em github.com/settings/tokens.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                    Gist ID (Opcional - preenchido automaticamente ao salvar)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: a1b2c3d4e5f6..."
                    value={ghGistId}
                    onChange={(e) => setGhGistId(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs font-mono"
                  />
                </div>

                {ghStatusMsg && (
                  <div
                    className={`p-3 rounded-lg text-xs font-bold flex items-center gap-2 ${
                      ghStatusMsg.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {ghStatusMsg.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0" />
                    )}
                    <span>{ghStatusMsg.text}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleSaveToGitHub}
                    disabled={isSyncingGh || !ghToken}
                    className="bg-[#E30613] hover:bg-[#C4122F] text-white py-2 px-3 rounded-lg font-bold text-xs disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
                  >
                    {isSyncingGh ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    <span>Salvar no GitHub Gist</span>
                  </button>

                  <button
                    onClick={handleLoadFromGitHub}
                    disabled={isSyncingGh || !ghToken || !ghGistId}
                    className="bg-neutral-900 hover:bg-neutral-800 text-white py-2 px-3 rounded-lg font-bold text-xs disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
                  >
                    {isSyncingGh ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    <span>Carregar do GitHub Gist</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LOCAL & RESET/LOAD 10 ITENS */}
          {activeTab === 'local' && (
            <div className="space-y-4">
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-xs space-y-3">
                <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Estado do Banco de Dados para Testes &amp; Validação
                </div>
                <p className="text-neutral-700">
                  Você pode alternar entre os 10 materiais oficiais (com descrição detalhada assinada por Carlos) e um banco completamente vazio para cadastrar suas próprias peças do zero.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (confirm('Deseja recarregar os 10 itens padrão com descrição detalhada assinada por Carlos?')) {
                        onLoadInitial10();
                        onClose();
                      }
                    }}
                    className="p-3 border border-neutral-300 rounded-lg bg-white hover:bg-neutral-50 text-left transition-colors"
                  >
                    <div className="font-bold text-xs text-neutral-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      10 Materiais Padrão
                    </div>
                    <div className="text-[11px] text-neutral-700 mt-1">
                      Carrega Eletroeletrônica, Usinagem, Solda, EPI e Automação (Assinados por Carlos)
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Tem certeza que deseja esvaziar todo o estoque para iniciar testes vazios do zero?')) {
                        onResetEmpty();
                        onClose();
                      }
                    }}
                    className="p-3 border border-red-200 rounded-lg bg-red-50/40 hover:bg-red-50 text-left transition-colors"
                  >
                    <div className="font-bold text-xs text-[#E30613] flex items-center gap-1.5">
                      <RotateCcw className="w-4 h-4" />
                      Estrutura Vazia (Modo Teste)
                    </div>
                    <div className="text-[11px] text-neutral-700 mt-1">
                      Zera artigos e movimentações para testar o cadastro hierárquico do zero
                    </div>
                  </button>
                </div>
              </div>

              {/* System stats */}
              <div className="border border-neutral-200 rounded-lg p-3 text-xs divide-y divide-neutral-100">
                <div className="flex justify-between py-1.5">
                  <span className="text-neutral-700">Artigos armazenados:</span>
                  <span className="font-bold text-neutral-900">{database.articles.length}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-neutral-700">Tipos / Grupos / Subgrupos:</span>
                  <span className="font-bold text-neutral-900">
                    {database.types.length} / {database.groups.length} / {database.subgroups.length}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-neutral-700">Movimentações auditadas:</span>
                  <span className="font-bold text-neutral-900">{database.movements.length}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-neutral-100 border-t border-neutral-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
