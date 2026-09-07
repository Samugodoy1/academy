import type { ExerciseSeed } from '../types';

export const ENDODONTIA_EXERCISES: ExerciseSeed[] = [
  {
    id: 'endo-01',
    kind: 'choice',
    difficulty: 2,
    prompt: 'Qual é a hipótese diagnóstica?',
    scenario:
      'Dor espontânea, que acorda o paciente à noite, piora com o frio e demora vários minutos para passar.',
    options: [
      'Sensibilidade dentinária',
      'Pulpite irreversível',
      'Pericoronarite',
      'Bruxismo',
    ],
    answer: 1,
    explanation:
      'Dor espontânea, noturna e prolongada após o estímulo é o padrão da pulpite irreversível. Confirme com testes de vitalidade, percussão e imagem.',
  },
  {
    id: 'endo-02',
    kind: 'boolean',
    difficulty: 1,
    prompt: 'Verdadeiro ou falso?',
    statement: 'Pode-se instrumentar o canal a seco quando a irrigação atrapalha a visão.',
    answer: false,
    explanation:
      'Nunca. A irrigação é feita a cada troca de lima: remove debris, lubrifica e desinfeta. Canal seco fratura instrumento e empurra conteúdo para o ápice.',
  },
  {
    id: 'endo-03',
    kind: 'order',
    difficulty: 2,
    prompt: 'Ordene a sessão de endodontia',
    steps: [
      'Anestesia e teste da região',
      'Isolamento absoluto',
      'Acesso e localização dos canais',
      'Odontometria (comprimento de trabalho)',
      'Preparo químico-mecânico',
      'Medicação intracanal e selamento provisório',
    ],
    explanation:
      'Essa sequência é o esqueleto de qualquer sessão. Trocar a ordem (acessar antes de isolar, por exemplo) é onde o acidente acontece.',
  },
  {
    id: 'endo-04',
    kind: 'blank',
    difficulty: 2,
    prompt: 'Complete a frase',
    sentence: 'O irrigante mais usado no preparo químico-mecânico é o ___ de sódio.',
    answer: 'hipoclorito',
    bank: ['hipoclorito', 'bicarbonato', 'fluoreto', 'cloreto'],
    explanation:
      'Hipoclorito de sódio dissolve tecido orgânico e tem ação antimicrobiana. O EDTA complementa removendo a smear layer inorgânica.',
  },
  {
    id: 'endo-05',
    kind: 'choice',
    difficulty: 3,
    prompt: 'O que fazer na sessão de hoje?',
    scenario: 'A evolução anterior registra: "acesso realizado, odontometria concluída, CT 21 mm".',
    options: [
      'Refazer o acesso para conferir',
      'Continuar de onde parou: confirmar canais e comprimento e instrumentar',
      'Obturar direto sem instrumentar',
      'Recomeçar o caso do zero',
    ],
    answer: 1,
    explanation:
      'Refazer acesso só remove estrutura sadia e enfraquece o dente. Confirme os dados registrados e siga o preparo.',
  },
  {
    id: 'endo-06',
    kind: 'match',
    difficulty: 3,
    prompt: 'Relacione o termo com o significado',
    pairs: [
      { left: 'Patência apical', right: 'Foramen livre de debris' },
      { left: 'Glide path', right: 'Caminho inicial liso até o comprimento' },
      { left: 'Comprimento de trabalho', right: 'Limite apical do preparo' },
      { left: 'Smear layer', right: 'Camada de raspas na parede do canal' },
    ],
    explanation:
      'Dominar o vocabulário é o que permite acompanhar o professor no box sem perder o raciocínio.',
  },
  {
    id: 'endo-07',
    kind: 'multi',
    difficulty: 2,
    prompt: 'Selecione o que precisa constar na evolução da sessão',
    options: [
      'Dente e canais trabalhados',
      'Comprimento de trabalho',
      'Irrigante e medicação usados',
      'Marca do carro do paciente',
      'Tipo de selamento provisório',
    ],
    answers: [0, 1, 2, 4],
    explanation:
      'A próxima sessão (às vezes com outro aluno) depende inteiramente desse registro. Sem CT anotado, tudo recomeça.',
  },
  {
    id: 'endo-08',
    kind: 'choice',
    difficulty: 2,
    prompt: 'Qual acesso é o correto?',
    options: [
      'O menor possível, mesmo que a lima entre forçada',
      'Conservador, porém suficiente para instrumentar em linha reta e sem degraus',
      'O maior possível, para enxergar bem',
      'Pela face vestibular em molares, por ser mais direto',
    ],
    answer: 1,
    explanation:
      'Acesso pequeno demais gera desvio, degrau e fratura de instrumento; grande demais enfraquece o dente. O equilíbrio é o objetivo.',
  },
  {
    id: 'endo-09',
    kind: 'boolean',
    difficulty: 2,
    prompt: 'Verdadeiro ou falso?',
    statement: 'A odontometria pode ser feita apenas com o localizador foraminal, sem conferência radiográfica.',
    answer: false,
    explanation:
      'O localizador é preciso, mas a confirmação radiográfica segue como padrão na clínica escola. Os dois métodos se complementam.',
  },
  {
    id: 'endo-10',
    kind: 'choice',
    difficulty: 3,
    prompt: 'Qual é a conduta na urgência?',
    scenario: 'Necrose pulpar com abscesso periapical agudo, edema localizado e dor intensa no 45.',
    options: [
      'Só prescrever antibiótico e remarcar',
      'Acesso, drenagem via canal, preparo inicial e medicação intracanal',
      'Exodontia imediata',
      'Apenas analgésico e bolsa de gelo',
    ],
    answer: 1,
    explanation:
      'O tratamento da urgência endodôntica é drenar e desinfetar. Antibiótico entra quando há sinais sistêmicos ou disseminação, não como substituto do procedimento.',
  },
  {
    id: 'endo-11',
    kind: 'blank',
    difficulty: 2,
    prompt: 'Complete a frase',
    sentence: 'A medicação intracanal mais usada entre sessões é o ___ de cálcio.',
    answer: 'hidróxido',
    bank: ['hidróxido', 'sulfato', 'fosfato', 'carbonato'],
    explanation:
      'O hidróxido de cálcio mantém pH alcalino no interior do canal, dificultando a sobrevivência bacteriana entre as sessões.',
  },
  {
    id: 'endo-12',
    kind: 'choice',
    difficulty: 3,
    prompt: 'O que provavelmente aconteceu?',
    scenario:
      'Durante a irrigação, o paciente relata dor súbita e intensa, com edema aparecendo rapidamente.',
    options: [
      'Reação normal ao hipoclorito',
      'Possível acidente com extravasamento de hipoclorito para os tecidos periapicais',
      'Anestesia acabando',
      'Sinusite',
    ],
    answer: 1,
    explanation:
      'Dor súbita e edema rápido durante a irrigação sugerem extravasamento. Interrompa, comunique o professor e siga o protocolo: analgesia, acompanhamento e orientação ao paciente.',
  },
];
