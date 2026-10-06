import { InventoryDatabase, ItemType, ItemGroup, ItemSubgroup, Article, StockMovement } from '../types/inventory';

export const INITIAL_TYPES: ItemType[] = [
  {
    id: 'type-01',
    code: 'TIP-01',
    name: 'Eletroeletrônica e Automação',
    description: 'Componentes elétricos, condutores, chaves e dispositivos de comando'
  },
  {
    id: 'type-02',
    code: 'TIP-02',
    name: 'Mecânica e Usinagem',
    description: 'Ferramental de corte, insertos, medição dimensional e usinagem'
  },
  {
    id: 'type-03',
    code: 'TIP-03',
    name: 'Soldagem e Caldeiraria',
    description: 'Consumíveis de soldagem SMAW, GMAW/MIG e elementos de caldeiraria'
  },
  {
    id: 'type-04',
    code: 'TIP-04',
    name: 'Segurança e EPI',
    description: 'Equipamentos de proteção individual e coletiva para oficinas'
  },
  {
    id: 'type-05',
    code: 'TIP-05',
    name: 'Pneumática e Hidráulica Industrial',
    description: 'Atuadores, válvulas direcionais e conexões para linhas de ar comprimido'
  }
];

export const INITIAL_GROUPS: ItemGroup[] = [
  // Type 01
  {
    id: 'grp-01-01',
    typeId: 'type-01',
    code: 'GRP-01.01',
    name: 'Condutores e Cabos',
    description: 'Cabos elétricos flexíveis e condutores para quadros'
  },
  {
    id: 'grp-01-02',
    typeId: 'type-01',
    code: 'GRP-01.02',
    name: 'Manobra e Proteção',
    description: 'Disjuntores, contatores, relés e fusíveis'
  },
  // Type 02
  {
    id: 'grp-02-01',
    typeId: 'type-02',
    code: 'GRP-02.01',
    name: 'Ferramental de Corte e Desbaste',
    description: 'Brocas, machos, fresas e pastilhas de metal duro'
  },
  {
    id: 'grp-02-02',
    typeId: 'type-02',
    code: 'GRP-02.02',
    name: 'Instrumentação e Metrologia',
    description: 'Paquímetros, micrômetros, relógios comparadores'
  },
  // Type 03
  {
    id: 'grp-03-01',
    typeId: 'type-03',
    code: 'GRP-03.01',
    name: 'Consumíveis de Solda',
    description: 'Eletrodos revestidos, arames sólidos e tubulares'
  },
  // Type 04
  {
    id: 'grp-04-01',
    typeId: 'type-04',
    code: 'GRP-04.01',
    name: 'Proteção Visual e Auditiva',
    description: 'Óculos de proteção, protetores auriculares tipo concha e plug'
  },
  // Type 05
  {
    id: 'grp-05-01',
    typeId: 'type-05',
    code: 'GRP-05.01',
    name: 'Válvulas e Atuadores Pneumáticos',
    description: 'Válvulas eletropneumáticas, cilindros e reguladores de pressão'
  }
];

export const INITIAL_SUBGROUPS: ItemSubgroup[] = [
  // Group 01.01
  {
    id: 'sub-01-01-01',
    groupId: 'grp-01-01',
    code: 'SUB-01.01.01',
    name: 'Cabos Flexíveis de Cobre 750V',
    description: 'Condutores unipolar antichama classe 4/5'
  },
  // Group 01.02
  {
    id: 'sub-01-02-01',
    groupId: 'grp-01-02',
    code: 'SUB-01.02.01',
    name: 'Disjuntores Termomagnéticos DIN',
    description: 'Mini-disjuntores padrão DIN curva C'
  },
  {
    id: 'sub-01-02-02',
    groupId: 'grp-01-02',
    code: 'SUB-01.02.02',
    name: 'Contatores de Potência AC-3',
    description: 'Contatores industriais com bobina 24Vcc/220V'
  },
  // Group 02.01
  {
    id: 'sub-02-01-01',
    groupId: 'grp-02-01',
    code: 'SUB-02.01.01',
    name: 'Brocas Helicoidais HSS',
    description: 'Brocas aço rápido norma DIN 338'
  },
  {
    id: 'sub-02-01-02',
    groupId: 'grp-02-01',
    code: 'SUB-02.01.02',
    name: 'Pastilhas de Metal Duro (Insertos)',
    description: 'Insertos intercambiáveis para torneamento e fresamento'
  },
  // Group 02.02
  {
    id: 'sub-02-02-01',
    groupId: 'grp-02-02',
    code: 'SUB-02.02.01',
    name: 'Paquímetros de Precisão',
    description: 'Paquímetros universais e digitais com leitura centesimal'
  },
  // Group 03.01
  {
    id: 'sub-03-01-01',
    groupId: 'grp-03-01',
    code: 'SUB-03.01.01',
    name: 'Eletrodos Revestidos Básicos e Rutílicos',
    description: 'Eletrodos AWS E7018 e E6013'
  },
  {
    id: 'sub-03-01-02',
    groupId: 'grp-03-01',
    code: 'SUB-03.01.02',
    name: 'Arames Sólidos MIG/MAG',
    description: 'Arames cobreados carretel 15kg norma AWS ER70S-6'
  },
  // Group 04.01
  {
    id: 'sub-04-01-01',
    groupId: 'grp-04-01',
    code: 'SUB-04.01.01',
    name: 'Óculos de Segurança Contra Impacto',
    description: 'Lentes incolor e fumê com CA ativo'
  },
  // Group 05.01
  {
    id: 'sub-05-01-01',
    groupId: 'grp-05-01',
    code: 'SUB-05.01.01',
    name: 'Válvulas Direcionais Solenoide 5/2 Vias',
    description: 'Válvulas pneumáticas piloto 24Vcc'
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-001',
    code: 'ART-01.01.01.001',
    typeId: 'type-01',
    groupId: 'grp-01-01',
    subgroupId: 'sub-01-01-01',
    name: 'Cabo Flexível de Cobre 2,5mm² 750V Vermelho',
    description: 'Cabo flexível condutor em cobre eletrolítico têmpera mole, isolação antichama em PVC 70°C, tensão nominal 750V, seção nominal 2,5mm², rolo contendo 100 metros contínuos, padronizado NBR NM 247-3 para comandos e circuitos prediais e industriais - Carlos',
    unit: 'Rolo (100m)',
    currentQuantity: 15,
    minQuantity: 5,
    location: 'Almoxarifado Central - Prateleira E02, Gaveta 04',
    unitCost: 189.50,
    createdAt: '2026-10-01T08:00:00.000Z',
    updatedAt: '2026-10-06T10:15:00.000Z'
  },
  {
    id: 'art-002',
    code: 'ART-01.02.01.001',
    typeId: 'type-01',
    groupId: 'grp-01-02',
    subgroupId: 'sub-01-02-01',
    name: 'Disjuntor Termomagnético Bipolar 20A Curva C',
    description: 'Disjuntor termomagnético miniatura modelo bipolar, corrente nominal 20A, curva de disparo C (5 a 10 In), capacidade de interrupção 5kA em 230/400Vca, fixação padrão trilho DIN 35mm para proteção de painéis didáticos de comandos elétricos - Carlos',
    unit: 'Unidade',
    currentQuantity: 42,
    minQuantity: 10,
    location: 'Almoxarifado Central - Prateleira E03, Gaveta 12',
    unitCost: 38.90,
    createdAt: '2026-10-01T08:15:00.000Z',
    updatedAt: '2026-10-06T10:20:00.000Z'
  },
  {
    id: 'art-003',
    code: 'ART-01.02.02.001',
    typeId: 'type-01',
    groupId: 'grp-01-02',
    subgroupId: 'sub-01-02-02',
    name: 'Contator Tripolar de Potência 18A 24Vcc',
    description: 'Contator eletromagnético tripolar para acionamento de motores elétricos trifásicos, regime AC-3 corrente 18A (até 10cv/7.5kW em 380V), tensão de bobina 24Vcc com supressor de surtos integrado, contatos auxiliares 1NA+1NC integrados modelo padrão industrial - Carlos',
    unit: 'Unidade',
    currentQuantity: 18,
    minQuantity: 6,
    location: 'Almoxarifado Central - Prateleira E04, Box 02',
    unitCost: 115.00,
    createdAt: '2026-10-01T08:30:00.000Z',
    updatedAt: '2026-10-06T10:25:00.000Z'
  },
  {
    id: 'art-004',
    code: 'ART-02.01.01.001',
    typeId: 'type-02',
    groupId: 'grp-02-01',
    subgroupId: 'sub-02-01-01',
    name: 'Broca Helicoidal Aço Rápido HSS-G Diâmetro 8,5mm',
    description: 'Broca helicoidal em aço rápido retificado HSS-G usinada com precisão segundo norma DIN 338, diâmetro nominal 8,5mm (pré-furação de rosca métrica M10), haste cilíndrica, ângulo de ponta de 118 graus com afiação em cruz autocentrante para aços laminados e ferros fundidos - Carlos',
    unit: 'Peça',
    currentQuantity: 35,
    minQuantity: 8,
    location: 'Oficina de Usinagem - Armário Ferramentaria M01, Gaveteiro 03',
    unitCost: 22.40,
    createdAt: '2026-10-01T09:00:00.000Z',
    updatedAt: '2026-10-06T10:30:00.000Z'
  },
  {
    id: 'art-005',
    code: 'ART-02.01.02.001',
    typeId: 'type-02',
    groupId: 'grp-02-01',
    subgroupId: 'sub-02-01-02',
    name: 'Inserto Pastilha Metal Duro Torneamento WNMG 080408-PM',
    description: 'Inserto intercambiável de metal duro formato trigonal WNMG tamanho 08 espessura 04 raio 0.8mm com quebra-cavaco tipo PM para desbaste médio e semiacabamento em aços carbono e ligados, cobertura multicamada CVD TiCN+Al2O3 classe ISO P25 para torno CNC e convencional - Carlos',
    unit: 'Caixa (10 un)',
    currentQuantity: 8,
    minQuantity: 3,
    location: 'Oficina de Usinagem - Sala de Controle de Ferramentas, Gaveta F05',
    unitCost: 245.00,
    createdAt: '2026-10-01T09:20:00.000Z',
    updatedAt: '2026-10-06T10:35:00.000Z'
  },
  {
    id: 'art-006',
    code: 'ART-02.02.01.001',
    typeId: 'type-02',
    groupId: 'grp-02-02',
    subgroupId: 'sub-02-02-01',
    name: 'Paquímetro Digital de Precisão 150mm / 6"',
    description: 'Paquímetro digital com haste em aço inoxidável temperado, capacidade de medição de 0 a 150mm (0 a 6 polegadas), resolução milesimal de 0,01mm / 0,0005 pol, display de cristal líquido de alta visibilidade, tecla zero e conversão mm/pol rápida, calibrado rastreável RBC com estojo protetor rígido - Carlos',
    unit: 'Unidade',
    currentQuantity: 12,
    minQuantity: 4,
    location: 'Laboratório de Metrologia - Estante Blindada L01, Compartimento 01',
    unitCost: 285.00,
    createdAt: '2026-10-01T09:40:00.000Z',
    updatedAt: '2026-10-06T10:40:00.000Z'
  },
  {
    id: 'art-007',
    code: 'ART-03.01.01.001',
    typeId: 'type-03',
    groupId: 'grp-03-01',
    subgroupId: 'sub-03-01-01',
    name: 'Eletrodo Revestido AWS E7018 Diâmetro 3,25mm',
    description: 'Eletrodo revestido de revestimento básico com pó de ferro de baixo teor de hidrogênio difusível (H4), classificação AWS A5.1 E7018, diâmetro nominal 3,25mm x comprimento 350mm, para união e enchimento de estruturas metálicas de alta solicitação mecânica em todas as posições, lata lacrada com 5kg - Carlos',
    unit: 'Lata (5kg)',
    currentQuantity: 24,
    minQuantity: 5,
    location: 'Galpão de Solda - Almoxarifado de Consumíveis, Palete S03',
    unitCost: 88.00,
    createdAt: '2026-10-01T10:00:00.000Z',
    updatedAt: '2026-10-06T10:45:00.000Z'
  },
  {
    id: 'art-008',
    code: 'ART-03.01.02.001',
    typeId: 'type-03',
    groupId: 'grp-03-01',
    subgroupId: 'sub-03-01-02',
    name: 'Arame Sólido Cobreado Solda MIG/MAG ER70S-6 1,0mm',
    description: 'Arame sólido em aço carbono com banho superficial de cobre uniforme para processos de soldagem sob proteção gasosa MIG/MAG (Ar+CO2), classificação AWS A5.18 ER70S-6 diâmetro nominal 1,0mm bobinado capa-a-capa carretel plástico de precisão contendo 15kg para serralheria e fabricação mecânica - Carlos',
    unit: 'Carretel (15kg)',
    currentQuantity: 9,
    minQuantity: 3,
    location: 'Galpão de Solda - Almoxarifado de Consumíveis, Palete S01',
    unitCost: 219.00,
    createdAt: '2026-10-01T10:20:00.000Z',
    updatedAt: '2026-10-06T10:50:00.000Z'
  },
  {
    id: 'art-009',
    code: 'ART-04.01.01.001',
    typeId: 'type-04',
    groupId: 'grp-04-01',
    subgroupId: 'sub-04-01-01',
    name: 'Óculos de Proteção e Segurança Lente Incolor Antirrisco',
    description: 'Óculos de proteção individual contra impactos de partículas volantes frontais e laterais, lente única panorâmica moldada em policarbonato óptico incolor com tratamento resistente a riscos e proteção UV 99,9%, hastes ergonômicas flexíveis tipo espátula com cordão, certificado de aprovação CA ativo expedido pelo MTE - Carlos',
    unit: 'Par',
    currentQuantity: 60,
    minQuantity: 20,
    location: 'Almoxarifado Central - Estante EPI-01, Prateleira 02',
    unitCost: 14.50,
    createdAt: '2026-10-01T10:40:00.000Z',
    updatedAt: '2026-10-06T10:55:00.000Z'
  },
  {
    id: 'art-010',
    code: 'ART-05.01.01.001',
    typeId: 'type-05',
    groupId: 'grp-05-01',
    subgroupId: 'sub-05-01-01',
    name: 'Válvula Direcional Solenoide Pneumática 5/2 Vias 24Vcc',
    description: 'Válvula direcional eletropneumática de carretel balanceado, configuração 5 vias e 2 posições (5/2), conexão roscada padrão G 1/8 polegada, acionamento elétrico por bobina solenoide 24Vcc 3W com led de sinalização e retorno por mola mecânica, faixa de trabalho de 1,5 a 8 bar para bancadas didáticas Festo/SMC - Carlos',
    unit: 'Unidade',
    currentQuantity: 14,
    minQuantity: 4,
    location: 'Laboratório de Mecatrônica - Bancada P04, Gaveteiro Inferior',
    unitCost: 175.00,
    createdAt: '2026-10-01T11:00:00.000Z',
    updatedAt: '2026-10-06T11:00:00.000Z'
  }
];

export const INITIAL_MOVEMENTS: StockMovement[] = [
  {
    id: 'mov-001',
    articleId: 'art-001',
    articleCode: 'ART-01.01.01.001',
    articleName: 'Cabo Flexível de Cobre 2,5mm² 750V Vermelho',
    type: 'ENTRADA',
    quantity: 20,
    previousQuantity: 0,
    newQuantity: 20,
    location: 'Almoxarifado Central - Prateleira E02, Gaveta 04',
    date: '2026-10-02T08:30:00.000Z',
    documentNumber: 'NF-e 048912',
    reason: 'Compra de Suprimentos Semestrais - Fornecedor EletroSP',
    departmentOrLab: 'Almoxarifado Central',
    requester: 'Almoxarife Carlos',
    notes: 'Material conferido e inspecionado conforme especificações técnicas SENAI.'
  },
  {
    id: 'mov-002',
    articleId: 'art-001',
    articleCode: 'ART-01.01.01.001',
    articleName: 'Cabo Flexível de Cobre 2,5mm² 750V Vermelho',
    type: 'SAIDA',
    quantity: 5,
    previousQuantity: 20,
    newQuantity: 15,
    location: 'Almoxarifado Central - Prateleira E02, Gaveta 04',
    date: '2026-10-03T14:15:00.000Z',
    documentNumber: 'REQ-2026/104',
    reason: 'Aula Prática: Instalação de Quadros de Distribuição Residencial',
    departmentOrLab: 'Laboratório de Eletroeletrônica II',
    requester: 'Prof. André Martins (Instrutor SENAI)',
    notes: 'Retirado para montagem das bancadas didáticas da turma T-ELE-202.'
  },
  {
    id: 'mov-003',
    articleId: 'art-004',
    articleCode: 'ART-02.01.01.001',
    articleName: 'Broca Helicoidal Aço Rápido HSS-G Diâmetro 8,5mm',
    type: 'ENTRADA',
    quantity: 40,
    previousQuantity: 0,
    newQuantity: 40,
    location: 'Oficina de Usinagem - Armário Ferramentaria M01, Gaveteiro 03',
    date: '2026-10-02T09:10:00.000Z',
    documentNumber: 'NF-e 048920',
    reason: 'Reposição de Ferramental de Corte de Usinagem',
    departmentOrLab: 'Oficina Mecânica de Usinagem',
    requester: 'Almoxarife Carlos',
    notes: 'Inspeção dimensional e de dureza aprovada pela metrologia.'
  },
  {
    id: 'mov-004',
    articleId: 'art-004',
    articleCode: 'ART-02.01.01.001',
    articleName: 'Broca Helicoidal Aço Rápido HSS-G Diâmetro 8,5mm',
    type: 'SAIDA',
    quantity: 5,
    previousQuantity: 40,
    newQuantity: 35,
    location: 'Oficina de Usinagem - Armário Ferramentaria M01, Gaveteiro 03',
    date: '2026-10-04T10:00:00.000Z',
    documentNumber: 'REQ-2026/118',
    reason: 'Projeto Mecânico Semestral: Fabricação de Flanges e Mancais',
    departmentOrLab: 'Oficina Mecânica de Usinagem',
    requester: 'Prof. Marcelo Camargo',
    notes: 'Distribuído aos postos de furação vertical das bancadas 1 a 5.'
  },
  {
    id: 'mov-005',
    articleId: 'art-009',
    articleCode: 'ART-04.01.01.001',
    articleName: 'Óculos de Proteção e Segurança Lente Incolor Antirrisco',
    type: 'ENTRADA',
    quantity: 80,
    previousQuantity: 0,
    newQuantity: 80,
    location: 'Almoxarifado Central - Estante EPI-01, Prateleira 02',
    date: '2026-10-01T11:00:00.000Z',
    documentNumber: 'NF-e 048890',
    reason: 'Aquisição de EPIs para Início de Semestre Letivo',
    departmentOrLab: 'Almoxarifado Central',
    requester: 'Coordenação Pedagógica SENAI',
    notes: 'CA 34.082 verificado no sistema do MTE.'
  },
  {
    id: 'mov-006',
    articleId: 'art-009',
    articleCode: 'ART-04.01.01.001',
    articleName: 'Óculos de Proteção e Segurança Lente Incolor Antirrisco',
    type: 'SAIDA',
    quantity: 20,
    previousQuantity: 80,
    newQuantity: 60,
    location: 'Almoxarifado Central - Estante EPI-01, Prateleira 02',
    date: '2026-10-05T08:00:00.000Z',
    documentNumber: 'REQ-2026/132',
    reason: 'Entrega de EPI individual para alunos novos do curso de Solda',
    departmentOrLab: 'Galpão de Solda e Caldeiraria',
    requester: 'Instrutor Roberto Costa',
    notes: 'Assinatura em ficha individual de entrega de EPI recolhida.'
  }
];

export const INITIAL_DATABASE: InventoryDatabase = {
  version: '1.0.0',
  updatedAt: new Date().toISOString(),
  types: INITIAL_TYPES,
  groups: INITIAL_GROUPS,
  subgroups: INITIAL_SUBGROUPS,
  articles: INITIAL_ARTICLES,
  movements: INITIAL_MOVEMENTS,
  syncSettings: {
    autoSync: false,
    googleDriveFileName: 'senai_sp_estoque_backup.json'
  }
};

export const EMPTY_DATABASE: InventoryDatabase = {
  version: '1.0.0',
  updatedAt: new Date().toISOString(),
  types: [],
  groups: [],
  subgroups: [],
  articles: [],
  movements: [],
  syncSettings: {
    autoSync: false,
    googleDriveFileName: 'senai_sp_estoque_backup.json'
  }
};
