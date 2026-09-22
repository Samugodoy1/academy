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
      'Número e forma das raízes, osso e proximidade com estruturas anatômicas influenciam o planejamento. Odontossecção pode ser necessária, mas não é determinada apenas pela curvatura radicular.',
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
      'A sindesmotomia libera a inserção gengival, e a luxação progressiva amplia o alvéolo antes da preensão. Força excessiva aumenta o risco de fratura e lesão tecidual.',
  },
  {
    id: 'cir-03',
    kind: 'choice',
    difficulty: 3,
    prompt: 'Qual é a conduta?',
    scenario: 'Paciente em uso de anticoagulante oral precisa extrair o 34.',
    options: [
      'Orientar suspender o medicamento por três dias',
      'Identificar o fármaco e esquema, classificar o risco hemorrágico e seguir protocolo específico com hemostasia local',
      'Cancelar definitivamente a cirurgia',
      'Dobrar a dose de anestésico com vasoconstritor',
    ],
    answer: 1,
    explanation:
      'O medicamento não deve ser suspenso por iniciativa própria. Antagonistas da vitamina K, anticoagulantes diretos e antiagregantes têm recomendações diferentes conforme o procedimento; podem ser necessários INR, ajuste de horário ou contato com o prescritor em casos selecionados.',
  },
  {
    id: 'cir-04',
    kind: 'boolean',
    difficulty: 1,
    prompt: 'Verdadeiro ou falso?',
    statement: 'Aumentar a força compensa uma luxação insuficiente.',
    answer: false,
    explanation:
      'Força excessiva aumenta o risco de fratura radicular, dano ósseo e lesão de tecidos. Dificuldade exige reavaliação da luxação, acesso e necessidade de odontossecção.',
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
      'Bochecho vigoroso e sucção podem desorganizar o coágulo no período inicial. A alveolite é multifatorial, e orientações verbais e escritas devem incluir cuidados e sinais de alerta.',
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
      'Dor intensa que surge ou piora após alguns dias, com perda do coágulo e osso exposto, é compatível com alveolite. O manejo inclui irrigação suave, analgesia e revisão; curativo analgésico pode ser usado quando necessário, e antibiótico não é rotina sem disseminação.',
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
      { left: 'Cureta de Lucas', right: 'Remover tecido patológico quando indicado' },
    ],
    explanation:
      'A cureta não deve ser usada de modo indiscriminado em todo alvéolo, pois a manipulação desnecessária aumenta o trauma.',
  },
  {
    id: 'cir-08',
    kind: 'order',
    difficulty: 3,
    prompt: 'Ordene o manejo do sangramento persistente',
    steps: [
      'Iniciar compressão e avaliar gravidade e sinais vitais',
      'Revisar história médica, medicamentos e risco hemorrágico',
      'Inspecionar o alvéolo e identificar uma possível fonte local',
      'Usar sutura, material de empacotamento ou hemostático conforme a fonte',
      'Escalonar o atendimento se a hemostasia não for obtida',
    ],
    explanation:
      'A avaliação sistêmica ocorre desde o início. Persistência pode decorrer de causa local ou sistêmica; o paciente só deve ser liberado após hemostasia adequada ou encaminhamento seguro.',
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
      'Suspeite após extração de dentes posteriores superiores. Inspeção cuidadosa e, quando apropriado, Valsalva suave podem auxiliar, mas um resultado negativo não exclui defeito pequeno. Não se deve sondar nem ampliar a comunicação.',
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
      'Reavaliar com imagem e decidir entre remoção controlada ou proservação documentada',
      'Fechar e não registrar nada',
      'Encaminhar sem informar o paciente',
    ],
    answer: 1,
    explanation:
      'Um fragmento pequeno, profundo, sem infecção e cuja remoção aumente o risco pode ser acompanhado. A decisão deve considerar imagem, estruturas vizinhas, sintomas, informação ao paciente, registro e seguimento.',
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
