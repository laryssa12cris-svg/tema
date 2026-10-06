import { ItemType, ItemGroup, ItemSubgroup, Article } from '../types/inventory';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  } catch {
    return isoString;
  }
}

export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(d);
  } catch {
    return isoString;
  }
}

// Generate sequential formatted unique codes for hierarchical levels
export function generateNextTypeCode(types: ItemType[]): string {
  const count = types.length + 1;
  const numStr = String(count).padStart(2, '0');
  return `TIP-${numStr}`;
}

export function generateNextGroupCode(typeCode: string, groupsOfType: ItemGroup[]): string {
  // typeCode is like "TIP-01" -> prefix is "01"
  const typePart = typeCode.replace('TIP-', '').trim() || '01';
  const count = groupsOfType.length + 1;
  const numStr = String(count).padStart(2, '0');
  return `GRP-${typePart}.${numStr}`;
}

export function generateNextSubgroupCode(groupCode: string, subgroupsOfGroup: ItemSubgroup[]): string {
  // groupCode is like "GRP-01.01" -> prefix is "01.01"
  const groupPart = groupCode.replace('GRP-', '').trim() || '01.01';
  const count = subgroupsOfGroup.length + 1;
  const numStr = String(count).padStart(2, '0');
  return `SUB-${groupPart}.${numStr}`;
}

export function generateNextArticleCode(subgroupCode: string, articlesOfSubgroup: Article[]): string {
  // subgroupCode is like "SUB-01.01.01" -> prefix is "01.01.01"
  const subPart = subgroupCode.replace('SUB-', '').trim() || '01.01.01';
  const count = articlesOfSubgroup.length + 1;
  const numStr = String(count).padStart(3, '0');
  return `ART-${subPart}.${numStr}`;
}
