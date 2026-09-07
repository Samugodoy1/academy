import type { ExerciseSeed } from '../types';

export const PREVENTIVA_EXERCISES: ExerciseSeed[] = [
  {
    id: 'prev-01',
    kind: 'choice',
    difficulty: 2,
    prompt: 'O que significa esse achado?',
    scenario: 'Mancha branca opaca e rugosa na cervical do 13, sem cavitação.',
    options: [
      'Lesão de cárie ativa não cavitada',
      'Lesão inativa, apenas cicatriz',
      'Fluorose severa',
      'Hipoplasia de esmalte',
    ],
    answer: 0,
    explanation:
      'Opaca e rugosa = atividade. Brilhante e lisa = inativa. Lesão ativa não cavitada trata-se com biofilme, flúor e dieta, não com broca.',
  },
  {
    id: 'prev-02',
    kind: 'boolean',
    difficulty: 1,
    prompt: 'Verdadeiro ou falso?',
    statement: 'Toda mancha branca precisa ser restaurada.',
    answer: false,
    explanation:
      'Mancha branca sem cavitação é lesão inicial e pode remineralizar. Restaurar aqui é perder estrutura sadia sem tratar a causa.',
  },
  {
    id: 'prev-03',
    kind: 'multi',
    difficulty: 2,
    prompt: 'Selecione os fatores que aumentam o risco de cárie',
    options: [
      'Alta frequência de açúcar',
      'Higiene deficiente',
      'Xerostomia',
      'Uso de dentifrício fluoretado',
      'Exposição radicular',
    ],
    answers: [0, 1, 2, 4],
    explanation:
      'Frequência (não só quantidade) de açúcar, biofilme, pouca saliva e superfícies expostas aumentam o risco. Dentifrício fluoretado é fator de proteção.',
  },
  {
    id: 'prev-04',
    kind: 'blank',
    difficulty: 2,
    prompt: 'Complete a frase',
    sentence: 'O que mais determina o risco de cárie é a ___ de consumo de açúcar.',
    answer: 'frequência',
    bank: ['frequência', 'quantidade', 'marca', 'temperatura'],
    explanation:
      'Cada exposição derruba o pH por um tempo. Muitas exposições ao dia mantêm o esmalte em desmineralização quase contínua.',
  },
  {
    id: 'prev-05',
    kind: 'choice',
    difficulty: 2,
    prompt: 'Quando o selante está bem indicado?',
    options: [
      'Em qualquer dente, como rotina anual',
      'Em fóssulas e fissuras retentivas de paciente com risco, com campo seco',
      'Somente após restaurar todos os dentes',
      'Apenas em dentes decíduos anteriores',
    ],
    answer: 1,
    explanation:
      'Selante protege sulco retentivo em paciente de risco — sobretudo molar recém-erupcionado. Em campo contaminado, falha precocemente.',
  },
  {
    id: 'prev-06',
    kind: 'match',
    difficulty: 2,
    prompt: 'Relacione a medida com o objetivo',
    pairs: [
      { left: 'Verniz fluoretado', right: 'Remineralizar lesão inicial' },
      { left: 'Selante', right: 'Proteger fóssulas e fissuras' },
      { left: 'Escovação supervisionada', right: 'Controle mecânico do biofilme' },
      { left: 'Orientação de dieta', right: 'Reduzir a frequência de açúcar' },
    ],
    explanation:
      'Prevenção é um conjunto: química (flúor), física (selante), mecânica (escovação) e comportamental (dieta).',
  },
  {
    id: 'prev-07',
    kind: 'boolean',
    difficulty: 2,
    prompt: 'Verdadeiro ou falso?',
    statement: 'Profilaxia isolada, sem orientação, tem efeito duradouro na prevenção.',
    answer: false,
    explanation:
      'O biofilme se reorganiza em horas. Sem mudança de hábito, a limpeza profissional é só um recomeço do mesmo ciclo.',
  },
  {
    id: 'prev-08',
    kind: 'order',
    difficulty: 2,
    prompt: 'Ordene a consulta preventiva',
    steps: [
      'Avaliar risco de cárie e hábitos',
      'Evidenciar e mostrar o biofilme ao paciente',
      'Remover biofilme e cálculo supragengival',
      'Aplicar flúor conforme risco e idade',
      'Combinar uma meta de higiene e o retorno',
    ],
    explanation:
      'Mostrar o biofilme evidenciado muda o comportamento muito mais do que falar "escove melhor".',
  },
  {
    id: 'prev-09',
    kind: 'choice',
    difficulty: 3,
    prompt: 'Qual é a orientação correta?',
    scenario: 'Após aplicação de verniz fluoretado, o paciente pergunta o que pode comer.',
    options: [
      'Pode comer e escovar imediatamente',
      'Evitar alimentos duros e quentes e adiar a escovação conforme a orientação do produto',
      'Ficar 24 horas em jejum',
      'Bochechar com enxaguante logo em seguida',
    ],
    answer: 1,
    explanation:
      'O verniz precisa de tempo em contato com o esmalte. Siga sempre a bula do produto e o protocolo da disciplina.',
  },
  {
    id: 'prev-10',
    kind: 'blank',
    difficulty: 3,
    prompt: 'Complete a frase',
    sentence: 'O flúor age principalmente favorecendo a ___ do esmalte desmineralizado.',
    answer: 'remineralização',
    bank: ['remineralização', 'esfoliação', 'erosão', 'calcificação pulpar'],
    explanation:
      'O flúor desloca o equilíbrio para a remineralização e forma fluorapatita, mais resistente ao ácido.',
  },
  {
    id: 'prev-11',
    kind: 'choice',
    difficulty: 3,
    prompt: 'Qual é a conduta mais adequada?',
    scenario:
      'Paciente adulto com xerostomia por medicamento contínuo e três lesões cervicais ativas.',
    options: [
      'Restaurar as três lesões e liberar',
      'Controlar a doença: flúor de alta concentração, saliva artificial, dieta e reavaliação — depois restaurar',
      'Suspender o medicamento do paciente',
      'Indicar apenas enxaguante com álcool',
    ],
    answer: 1,
    explanation:
      'Sem tratar a causa (pouca saliva + dieta), as restaurações falham na margem. Enxaguante com álcool ainda piora a xerostomia.',
  },
  {
    id: 'prev-12',
    kind: 'multi',
    difficulty: 2,
    prompt: 'Selecione o que deve constar na orientação de higiene',
    options: [
      'Técnica de escovação demonstrada na boca do paciente',
      'Limpeza interdental (fio ou escova interdental)',
      'Uso de dentifrício fluoretado',
      'Promessa de que nunca mais terá cárie',
      'Uma meta simples e possível de cumprir',
    ],
    answers: [0, 1, 2, 4],
    explanation:
      'Orientação eficaz é demonstrada, individualizada e com meta pequena. Promessa de cura definitiva quebra a confiança na primeira recidiva.',
  },
];
