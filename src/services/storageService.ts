import { InventoryDatabase } from '../types/inventory';
import { INITIAL_DATABASE, EMPTY_DATABASE } from '../data/initialData';

const STORAGE_KEY = 'senai_sp_inventory_database_v1';

export class StorageService {
  static loadDatabase(): InventoryDatabase {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // By default initialize with the 10 materials required by prompt
        this.saveDatabase(INITIAL_DATABASE);
        return INITIAL_DATABASE;
      }
      const parsed = JSON.parse(raw) as InventoryDatabase;
      if (!parsed.articles || !parsed.types) {
        return INITIAL_DATABASE;
      }
      return parsed;
    } catch (err) {
      console.error('Error loading inventory from localStorage:', err);
      return INITIAL_DATABASE;
    }
  }

  static saveDatabase(db: InventoryDatabase): boolean {
    try {
      const updated: InventoryDatabase = {
        ...db,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return true;
    } catch (err) {
      console.error('Error saving inventory to localStorage:', err);
      return false;
    }
  }

  static resetToEmpty(): InventoryDatabase {
    const empty: InventoryDatabase = {
      ...EMPTY_DATABASE,
      updatedAt: new Date().toISOString()
    };
    this.saveDatabase(empty);
    return empty;
  }

  static resetToInitial10(): InventoryDatabase {
    const initial: InventoryDatabase = {
      ...INITIAL_DATABASE,
      updatedAt: new Date().toISOString()
    };
    this.saveDatabase(initial);
    return initial;
  }

  // Export database to a JSON file (perfect for Google Drive manual or automated upload)
  static exportToJsonFile(db: InventoryDatabase) {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(db, null, 2));
    const downloadAnchor = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `senai-sp-estoque-backup-${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  // Parse JSON file uploaded by the user from Google Drive or local disk
  static async importFromJsonFile(file: File): Promise<InventoryDatabase> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const parsed = JSON.parse(content) as InventoryDatabase;
          if (!Array.isArray(parsed.articles) || !Array.isArray(parsed.types)) {
            throw new Error('Arquivo de backup inválido ou incompatível com o formato SENAI.');
          }
          resolve(parsed);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Falha ao ler o arquivo selecionado.'));
      reader.readAsText(file);
    });
  }

  // Sync with GitHub via GitHub REST API (Gist)
  static async syncWithGitHubGist(
    token: string,
    db: InventoryDatabase,
    existingGistId?: string
  ): Promise<{ gistId: string; gistUrl: string }> {
    const fileName = 'senai_sp_estoque_db.json';
    const payload = {
      description: 'SENAI-SP | Banco de Dados de Controle de Estoques (SGE)',
      public: false,
      files: {
        [fileName]: {
          content: JSON.stringify(db, null, 2)
        }
      }
    };

    const url = existingGistId
      ? `https://api.github.com/gists/${existingGistId}`
      : 'https://api.github.com/gists';

    const method = existingGistId ? 'PATCH' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Falha na API do GitHub (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return {
      gistId: data.id,
      gistUrl: data.html_url
    };
  }

  // Load from GitHub Gist
  static async loadFromGitHubGist(token: string, gistId: string): Promise<InventoryDatabase> {
    const url = `https://api.github.com/gists/${gistId.trim()}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        Accept: 'application/vnd.github+json'
      }
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar Gist no GitHub (${response.status})`);
    }

    const data = await response.json();
    const file = data.files['senai_sp_estoque_db.json'] || Object.values(data.files)[0];
    if (!file || !file.content) {
      throw new Error('Arquivo de estoque não encontrado dentro do Gist fornecido.');
    }

    const parsed = JSON.parse(file.content) as InventoryDatabase;
    return parsed;
  }
}
