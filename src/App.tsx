/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { StockPosition } from './components/StockPosition';
import { HierarchyManager } from './components/HierarchyManager';
import { MovementsManager } from './components/MovementsManager';
import { ReportsView } from './components/ReportsView';
import { CloudSyncModal } from './components/CloudSyncModal';
import { Footer } from './components/Footer';
import { StorageService } from './services/storageService';
import { 
  InventoryDatabase, 
  ItemType, 
  ItemGroup, 
  ItemSubgroup, 
  Article, 
  StockMovement, 
  MovementType 
} from './types/inventory';
import { X, ArrowLeftRight } from 'lucide-react';

export default function App() {
  const [database, setDatabase] = useState<InventoryDatabase>(() => StorageService.loadDatabase());
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Modals
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isQuickMovementModalOpen, setIsQuickMovementModalOpen] = useState(false);
  const [selectedArticleForMovement, setSelectedArticleForMovement] = useState<Article | null>(null);
  const [preselectedMovementType, setPreselectedMovementType] = useState<MovementType>('ENTRADA');

  // Persist to storage whenever database changes
  const updateDatabase = (newDb: InventoryDatabase) => {
    setDatabase(newDb);
    StorageService.saveDatabase(newDb);
  };

  // Hierarchy CRUD
  const handleAddType = (type: ItemType) => {
    updateDatabase({
      ...database,
      types: [...database.types, type]
    });
  };

  const handleDeleteType = (id: string) => {
    updateDatabase({
      ...database,
      types: database.types.filter((t) => t.id !== id),
      groups: database.groups.filter((g) => g.typeId !== id),
      articles: database.articles.filter((a) => a.typeId !== id)
    });
  };

  const handleAddGroup = (group: ItemGroup) => {
    updateDatabase({
      ...database,
      groups: [...database.groups, group]
    });
  };

  const handleDeleteGroup = (id: string) => {
    updateDatabase({
      ...database,
      groups: database.groups.filter((g) => g.id !== id),
      subgroups: database.subgroups.filter((s) => s.groupId !== id),
      articles: database.articles.filter((a) => a.groupId !== id)
    });
  };

  const handleAddSubgroup = (subgroup: ItemSubgroup) => {
    updateDatabase({
      ...database,
      subgroups: [...database.subgroups, subgroup]
    });
  };

  const handleDeleteSubgroup = (id: string) => {
    updateDatabase({
      ...database,
      subgroups: database.subgroups.filter((s) => s.id !== id),
      articles: database.articles.filter((a) => a.subgroupId !== id)
    });
  };

  const handleAddArticle = (article: Article) => {
    updateDatabase({
      ...database,
      articles: [...database.articles, article]
    });
  };

  const handleDeleteArticle = (id: string) => {
    updateDatabase({
      ...database,
      articles: database.articles.filter((a) => a.id !== id),
      movements: database.movements.filter((m) => m.articleId !== id)
    });
  };

  // Update Article Location in real time
  const handleUpdateArticleLocation = (articleId: string, newLocation: string) => {
    const updatedArticles = database.articles.map((art) => {
      if (art.id === articleId) {
        return {
          ...art,
          location: newLocation,
          updatedAt: new Date().toISOString()
        };
      }
      return art;
    });

    updateDatabase({
      ...database,
      articles: updatedArticles
    });
  };

  // Register Stock Movement
  const handleRegisterMovement = (movement: StockMovement) => {
    // 1. Update article stock balance & location
    const updatedArticles = database.articles.map((art) => {
      if (art.id === movement.articleId) {
        return {
          ...art,
          currentQuantity: movement.newQuantity,
          location: movement.location || art.location,
          updatedAt: new Date().toISOString()
        };
      }
      return art;
    });

    // 2. Append movement to audit history
    updateDatabase({
      ...database,
      articles: updatedArticles,
      movements: [movement, ...database.movements]
    });

    // Close quick modal if open
    setIsQuickMovementModalOpen(false);
  };

  // Reset helpers
  const handleResetEmpty = () => {
    const emptyDb = StorageService.resetToEmpty();
    setDatabase(emptyDb);
  };

  const handleLoadInitial10 = () => {
    const initialDb = StorageService.resetToInitial10();
    setDatabase(initialDb);
  };

  // Open movement modal with specific article
  const handleOpenMovementWithArticle = (article: Article, type?: MovementType) => {
    setSelectedArticleForMovement(article);
    if (type) setPreselectedMovementType(type);
    setIsQuickMovementModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 flex flex-col font-sans">
      {/* Institutional SENAI-SP Header */}
      <Header
        database={database}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onOpenNewMovement={() => {
          setSelectedArticleForMovement(null);
          setIsQuickMovementModalOpen(true);
        }}
        onNavigateToReports={() => setActiveTab('reports')}
      />

      {/* Main Navigation Tabs */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        database={database}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            database={database}
            onNavigateToStock={() => setActiveTab('stock')}
            onNavigateToHierarchy={() => setActiveTab('hierarchy')}
            onNavigateToReports={() => setActiveTab('reports')}
            onOpenNewMovement={() => {
              setSelectedArticleForMovement(null);
              setIsQuickMovementModalOpen(true);
            }}
            onResetEmpty={handleResetEmpty}
            onLoadInitial10={handleLoadInitial10}
          />
        )}

        {activeTab === 'stock' && (
          <StockPosition
            database={database}
            onOpenMovementWithArticle={handleOpenMovementWithArticle}
            onUpdateArticleLocation={handleUpdateArticleLocation}
            onNavigateToHierarchy={() => setActiveTab('hierarchy')}
          />
        )}

        {activeTab === 'hierarchy' && (
          <HierarchyManager
            database={database}
            onAddType={handleAddType}
            onDeleteType={handleDeleteType}
            onAddGroup={handleAddGroup}
            onDeleteGroup={handleDeleteGroup}
            onAddSubgroup={handleAddSubgroup}
            onDeleteSubgroup={handleDeleteSubgroup}
            onAddArticle={handleAddArticle}
            onDeleteArticle={handleDeleteArticle}
          />
        )}

        {activeTab === 'movements' && (
          <MovementsManager
            database={database}
            onRegisterMovement={handleRegisterMovement}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView database={database} />
        )}

        {activeTab === 'cloud' && (
          <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm space-y-4">
            <h2 className="text-xl font-black text-neutral-900">
              Persistência de Dados e Armazenamento em Nuvem
            </h2>
            <p className="text-sm text-neutral-600">
              Gerencie a sincronização de dados entre Google Drive, GitHub e cache local persistente do navegador.
            </p>
            <button
              onClick={() => setIsSyncModalOpen(true)}
              className="bg-[#E30613] hover:bg-[#C4122F] text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow-md transition-all"
            >
              Abrir Painel de Nuvem &amp; Backup
            </button>
          </div>
        )}
      </main>

      {/* QUICK MOVEMENT MODAL */}
      {isQuickMovementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border-t-4 border-[#E30613] relative my-6">
            <button
              onClick={() => setIsQuickMovementModalOpen(false)}
              className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>

            <MovementsManager
              database={database}
              onRegisterMovement={handleRegisterMovement}
              preselectedArticle={selectedArticleForMovement}
              preselectedType={preselectedMovementType}
            />
          </div>
        </div>
      )}

      {/* CLOUD SYNC & PERSISTENCE MODAL */}
      <CloudSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        database={database}
        onUpdateDatabase={updateDatabase}
        onResetEmpty={handleResetEmpty}
        onLoadInitial10={handleLoadInitial10}
      />

      {/* Official Footer with Technical Responsibility (Carlos Eduardo Silva) */}
      <Footer />
    </div>
  );
}
