export interface ItemType {
  id: string;
  code: string; // e.g. "TIP-01"
  name: string;
  description?: string;
}

export interface ItemGroup {
  id: string;
  typeId: string;
  code: string; // e.g. "GRP-01.01"
  name: string;
  description?: string;
}

export interface ItemSubgroup {
  id: string;
  groupId: string;
  code: string; // e.g. "SUB-01.01.01"
  name: string;
  description?: string;
}

export interface Article {
  id: string;
  code: string; // e.g. "ART-01.01.01.001"
  typeId: string;
  groupId: string;
  subgroupId: string;
  name: string;
  description: string; // Must end with " - Carlos"
  unit: string; // e.g. "Unidade", "Rolo", "Peça", "Lata", "Caixa", "Par"
  currentQuantity: number;
  minQuantity: number;
  location: string; // e.g. "Almoxarifado Central - Prateleira E02, Gaveta 04"
  unitCost: number; // In BRL (R$)
  createdAt: string;
  updatedAt: string;
}

export type MovementType = 'ENTRADA' | 'SAIDA';

export interface StockMovement {
  id: string;
  articleId: string;
  articleCode: string;
  articleName: string;
  type: MovementType;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  location: string;
  date: string; // ISO string
  documentNumber?: string; // NF-e, OS, Requisição
  reason: string;
  departmentOrLab?: string; // Oficina Mecânica, Laboratório de Eletroeletrônica, etc.
  requester?: string; // Solicitante / Instrutor / Aluno
  notes?: string;
}

export interface CloudSyncSettings {
  githubToken?: string;
  githubGistId?: string;
  lastSyncedAt?: string;
  autoSync: boolean;
  googleDriveFileName?: string;
}

export interface InventoryDatabase {
  version: string;
  updatedAt: string;
  types: ItemType[];
  groups: ItemGroup[];
  subgroups: ItemSubgroup[];
  articles: Article[];
  movements: StockMovement[];
  syncSettings?: CloudSyncSettings;
}
