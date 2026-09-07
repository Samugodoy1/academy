import type { ExerciseSeed } from '../types';

export const CIRURGIA_EXERCISES: ExerciseSeed[] = [
  {
    id: 'cir-01',
    kind: 'multi',
    difficulty: 2,
    prompt: 'O que conferir na radiografia antes da exodontia?',
    options: [
      'Número e curvatura das raízes',
      'Proximidade com o seio maxilar',
      'Proximidade com o canal mandibular',
      'Cor do dente',
      'Condição do osso ao redor',
    ],
    answers: [0, 1, 2, 4],
    explanation:
      'Essa leitura muda a técnica: raiz curva ou divergente pede odontossecção e a proximidade com estruturas nobres muda o plano inteiro.',
  },
  {
    id: 'cir-02',
    kind: 'order',
    difficulty: 2,
    prompt: 'Ordene a exodontia simples',
    steps: [
      'Anestesia e teste da região',
      'Sindesmotomia',
      'Luxação progressiva com extrator',
      'Preensão e avulsão com o fórceps',
      'Inspeção do alvéolo e hemostasia',
    ],
    explanation:
      'A luxação bem feita é o que faz o dente "vir sozinho". Pular a sindesmotomia é comprar laceração gengival.',
  },
  {
    id: 'cir-03',
    kind: 'choice',
    difficulty: 3,
    prompt: 'Qual é a conduta?',
    scenario: 'Paciente em uso de anticoagulante oral precisa extrair o 34.',
    options: [
      'Orientar suspender o medicamento por três dias',
      'Manter o medicamento, alinhar com professor e médico e planejar hemostasia local caprichada',
      'Cancelar definitivamente a cirurgia',
      'Dobrar a dose de anestésico com vasoconstritor',
    ],
    answer: 1,
    explanation:
      'Suspender anticoagulante por conta própria pode causar evento tromboembólico. O manejo padrão é hemostasia local: compressão, sutura e hemostático.',
  },
  {
    id: 'cir-04',
    kind: 'boolean',
    difficulty: 1,
    prompt: 'Verdadeiro ou falso?',
    statement: 'Força bruta compensa uma luxação insuficiente.',
    answer: false,
    explanation:
      'Força sem luxação fratura raiz, quebra tábua óssea e machuca o paciente. Se está difícil, revise a técnica: luxação, odontossecção ou acesso.',
  },
  {
    id: 'cir-05',
    kind: 'multi',
    difficulty: 2,
    prompt: 'Selecione o que entra na orientação pós-operatória',
    options: [
      'Morder gaze por compressão contínua no tempo orientado',
      'Compressa fria nas primeiras horas',
      'Evitar cuspir, fumar e usar canudo',
      'Bochechar com força para "limpar" o alvéolo',
      'Sinais de alerta para retornar',
    ],
    answers: [0, 1, 2, 4],
    explanation:
      'Bochecho vigoroso e sucção deslocam o coágulo — principal causa de alveolite. A orientação deve ser entregue por escrito.',
  },
  {
    id: 'cir-06',
    kind: 'choice',
    difficulty: 3,
    prompt: 'Qual é o diagnóstico?',
    scenario:
      'Três dias após a extração do 38, o paciente volta com dor intensa, halitose e alvéolo com aspecto vazio.',
    options: ['Alveolite seca', 'Pulpite', 'Reação alérgica à sutura', 'Parestesia'],
    answer: 0,
    explanation:
      'Perda do coágulo com dor intensa tardia é alveolite. Conduta: irrigação, curativo alveolar e analgesia — não é caso de antibiótico de rotina.',
  },
  {
    id: 'cir-07',
    kind: 'match',
    difficulty: 2,
    prompt: 'Relacione o instrumento com a função',
    pairs: [
      { left: 'Sindesmótomo', right: 'Descolar a inserção gengival' },
      { left: 'Extrator (alavanca)', right: 'Luxar o dente' },
      { left: 'Fórceps', right: 'Preender e avulsionar' },
      { left: 'Cureta de Lucas', right: 'Curetar o alvéolo' },
    ],
    explanation:
      'Pedir o instrumento pelo nome certo economiza tempo do box e mostra domínio da técnica.',
  },
  {
    id: 'cir-08',
    kind: 'order',
    difficulty: 3,
    prompt: 'Ordene o manejo do sangramento persistente',
    steps: [
      'Compressão prolongada com gaze',
      'Inspeção do alvéolo e remoção de tecido de granulação',
      'Sutura para aproximar os bordos',
      'Hemostático local se disponível',
      'Revisar história médica e medicamentos',
    ],
    explanation:
      'Comece pelo simples e escale. Se o sangramento persiste apesar da hemostasia local, a causa provavelmente é sistêmica.',
  },
  {
    id: 'cir-09',
    kind: 'blank',
    difficulty: 2,
    prompt: 'Complete a frase',
    sentence: 'A comunicação entre o alvéolo e o seio maxilar chama-se comunicação ___.',
    answer: 'buco-sinusal',
    bank: ['buco-sinusal', 'buco-nasal', 'periapical', 'interradicular'],
    explanation:
      'Suspeite após extração de molares superiores. A manobra de Valsalva ajuda a confirmar, e o manejo depende do tamanho da comunicação.',
  },
  {
    id: 'cir-10',
    kind: 'boolean',
    difficulty: 2,
    prompt: 'Verdadeiro ou falso?',
    statement: 'Parestesia do lábio inferior é risco a ser informado antes da exodontia de terceiro molar inferior.',
    answer: true,
    explanation:
      'A proximidade com o nervo alveolar inferior torna esse risco real. Ele deve constar do consentimento e da conversa antes do procedimento.',
  },
  {
    id: 'cir-11',
    kind: 'choice',
    difficulty: 2,
    prompt: 'Qual é a melhor conduta?',
    scenario: 'A raiz distal fraturou e restou um fragmento apical de 3 mm, sem infecção evidente.',
    options: [
      'Insistir com força até remover de qualquer jeito',
      'Reavaliar com imagem, discutir com o professor e decidir entre remoção controlada ou proservação',
      'Fechar e não registrar nada',
      'Encaminhar sem informar o paciente',
    ],
    answer: 1,
    explanation:
      'A decisão é clínica e compartilhada: às vezes remover causa mais dano que acompanhar. O que nunca se faz é omitir do paciente e do prontuário.',
  },
  {
    id: 'cir-12',
    kind: 'multi',
    difficulty: 3,
    prompt: 'Selecione os sinais de alerta que exigem retorno imediato',
    options: [
      'Sangramento que não cessa com compressão',
      'Febre e edema progressivo',
      'Dificuldade para engolir ou respirar',
      'Leve desconforto no primeiro dia',
      'Trismo intenso e progressivo',
    ],
    answers: [0, 1, 2, 4],
    explanation:
      'Esses são os sinais de infecção em disseminação ou hemorragia. Desconforto leve no primeiro dia é esperado.',
  },
];
