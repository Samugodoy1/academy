import type { ExerciseSeed } from '../types';

export const PREVENTIVA_EXERCISES: ExerciseSeed[] = [
  {
    id: 'prev-01',
    kind: 'choice',
    difficulty: 2,
    prompt: 'O que significa esse achado?',
    scenario:
      'Após limpeza e secagem, observa-se mancha branca opaca e rugosa na cervical do 13, em área de acúmulo de biofilme e sem cavitação.',
    options: [
      'Lesão de cárie ativa não cavitada',
      'Lesão inativa, apenas cicatriz',
      'Fluorose severa',
      'Hipoplasia de esmalte',
    ],
    answer: 0,
    explanation:
      'Opacidade, rugosidade e localização em área de estagnação de biofilme sustentam atividade. A avaliação deve integrar limpeza, secagem, textura, brilho e localização. Lesões ativas não cavitadas são manejadas inicialmente com controle de biofilme, fluoreto e dieta.',
  },
  {
    id: 'prev-02',
    kind: 'boolean',
    difficulty: 1,
    prompt: 'Verdadeiro ou falso?',
    statement: 'Toda mancha branca precisa ser restaurada.',
    answer: false,
    explanation:
      'Uma lesão não cavitada pode ser inativada com medidas não restauradoras. A decisão depende da atividade, do risco de cárie e da possibilidade de controle do biofilme.',
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
    sentence: 'Maior ___ de exposição a açúcares livres aumenta o tempo de desafio cariogênico.',
    answer: 'frequência',
    bank: ['frequência', 'quantidade', 'marca', 'temperatura'],
    explanation:
      'A frequência é um componente importante, mas o risco de cárie é multifatorial e também envolve quantidade de açúcares livres, biofilme, saliva, fluoreto e fatores sociais e comportamentais.',
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
      'O selante pode proteger fóssulas e fissuras suscetíveis, especialmente em dentes recém-erupcionados e pacientes com risco de cárie. Contaminação durante a aplicação aumenta o risco de perda de retenção.',
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
      'A remoção profissional isolada tem efeito transitório. Prevenção duradoura exige autocuidado, uso de dentifrício fluoretado e acompanhamento conforme o risco.',
  },
  {
    id: 'prev-08',
    kind: 'order',
    difficulty: 2,
    prompt: 'Em um paciente com biofilme e cálculo supragengival, organize uma sequência possível',
    steps: [
      'Avaliar risco de cárie e hábitos',
      'Evidenciar e mostrar o biofilme ao paciente',
      'Remover biofilme e cálculo supragengival',
      'Aplicar fluoreto profissional se indicado pelo risco e pela idade',
      'Combinar uma meta de higiene e o retorno',
    ],
    explanation:
      'A sequência deve ser adaptada aos achados. Evidenciar o biofilme pode auxiliar a orientação, e a aplicação profissional de fluoreto depende do risco individual.',
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
      'As orientações após o verniz variam entre produtos. Devem ser seguidas as instruções do fabricante e o protocolo clínico adotado.',
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
      'O fluoreto reduz a desmineralização e favorece a remineralização, além de formar reservatórios superficiais que disponibilizam fluoreto durante novos desafios ácidos.',
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
      'Revisar causas, estimular ou substituir saliva, indicar fluoreto conforme o risco e restaurar quando necessário',
      'Suspender o medicamento do paciente',
      'Indicar apenas enxaguante com álcool',
    ],
    answer: 1,
    explanation:
      'O manejo inclui revisar medicamentos com o prescritor quando pertinente, estimular o fluxo residual, aliviar sintomas, controlar dieta e usar fluoreto adequado ao risco. Lesões cavitadas ou não higienizáveis podem exigir restauração em paralelo; produtos com álcool podem agravar o desconforto.',
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
      'A orientação deve ser demonstrada, individualizada e acompanhada de uma meta viável. Não se deve prometer ausência definitiva de novas lesões.',
  },
];
