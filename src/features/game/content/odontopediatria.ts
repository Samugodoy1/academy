import type { ExerciseSeed } from '../types';

export const ODONTOPEDIATRIA_EXERCISES: ExerciseSeed[] = [
  {
    id: 'odped-01',
    kind: 'choice',
    difficulty: 1,
    prompt: 'Qual é a técnica de manejo descrita?',
    scenario:
      'Você explica o sugador com palavras simples, mostra funcionando na mão da criança e só então usa na boca.',
    options: ['Dizer-mostrar-fazer', 'Controle de voz', 'Distração', 'Reforço negativo'],
    answer: 0,
    explanation:
      'Dizer-mostrar-fazer familiariza a criança com o procedimento e pode reduzir ansiedade relacionada ao desconhecido.',
  },
  {
    id: 'odped-02',
    kind: 'boolean',
    difficulty: 1,
    prompt: 'Verdadeiro ou falso?',
    statement:
      'Em crianças, a dose máxima do anestésico deve considerar o peso, o limite absoluto e a condição clínica.',
    answer: true,
    explanation:
      'O cálculo em mg/kg evita uma dose padronizada inadequada, mas representa um teto. Devem-se considerar massa corporal, condição médica, limite absoluto e a menor dose eficaz.',
  },
  {
    id: 'odped-03',
    kind: 'choice',
    difficulty: 3,
    prompt: 'Qual é a conduta?',
    scenario:
      'Molar decíduo com cárie extensa, mobilidade e sucessor permanente já próximo na radiografia.',
    options: [
      'Realizar tratamento endodôntico independentemente da reabsorção e da restaurabilidade',
      'Avaliar restaurabilidade, infecção e reabsorção; extrair se não restaurável ou próximo da esfoliação',
      'Restaurar com resina e liberar',
      'Ignorar, porque vai cair sozinho de qualquer forma',
    ],
    answer: 1,
    explanation:
      'A decisão depende de sintomas, infecção, restaurabilidade, reabsorção radicular e tempo até a esfoliação. Um dente não restaurável ou com infecção e esfoliação próxima pode exigir extração; um dente funcional por mais tempo pode receber terapia pulpar e restauração quando indicadas.',
  },
  {
    id: 'odped-04',
    kind: 'blank',
    difficulty: 2,
    prompt: 'Complete a frase',
    sentence: 'A dentição decídua completa tem ___ dentes.',
    answer: '20',
    bank: ['20', '24', '28', '32'],
    explanation:
      'A dentição decídua completa possui 20 dentes, distribuídos em cinco por hemiarco.',
  },
  {
    id: 'odped-05',
    kind: 'choice',
    difficulty: 2,
    prompt: 'A criança não tolera um procedimento eletivo apesar das técnicas comunicativas. Qual é a conduta?',
    options: [
      'Usar contenção sem consentimento para concluir todo o tratamento',
      'Interromper com segurança, reavaliar urgência e planejar adaptação, sedação ou encaminhamento',
      'Dispensar sem nenhuma orientação',
      'Repetir o mesmo procedimento até dar certo',
    ],
    answer: 1,
    explanation:
      'Em tratamento eletivo, pode-se adiar ou usar medidas provisórias após avaliar risco e benefício. Estabilização protetora é reservada a situações selecionadas, com indicação, consentimento, técnica segura e documentação.',
  },
  {
    id: 'odped-06',
    kind: 'match',
    difficulty: 3,
    prompt: 'Relacione o procedimento com a indicação',
    pairs: [
      {
        left: 'ART',
        right: 'Lesão cavitada acessível quando a abordagem manual com ionômero é apropriada',
      },
      { left: 'Selante', right: 'Fóssulas e fissuras com risco ou lesão não cavitada' },
      {
        left: 'Pulpotomia',
        right: 'Polpa radicular vital e saudável após remoção da polpa coronária',
      },
      {
        left: 'Mantenedor de espaço',
        right: 'Perda precoce com risco individual de redução do espaço',
      },
    ],
    explanation:
      'A indicação depende do diagnóstico, da restaurabilidade, da cronologia de erupção e da cooperação. Nenhum desses procedimentos é indicado apenas pela idade.',
  },
  {
    id: 'odped-07',
    kind: 'multi',
    difficulty: 2,
    prompt: 'Selecione o que deve ser abordado no planejamento com a criança e o responsável',
    options: [
      'Consentimento informado registrado',
      'Assentimento da criança quando ela puder participar',
      'Orientação de dieta e higiene',
      'Explicação do que será feito hoje',
      'Nota da prova do aluno',
      'Sinais de alerta e como retornar',
    ],
    answers: [0, 1, 2, 3, 5],
    explanation:
      'O responsável fornece consentimento, e a criança deve participar da decisão de modo compatível com sua maturidade. Plano, autocuidado, riscos e acesso ao retorno precisam ser compreendidos.',
  },
  {
    id: 'odped-08',
    kind: 'boolean',
    difficulty: 2,
    prompt: 'Verdadeiro ou falso?',
    statement: 'Cárie em dente decíduo não precisa de tratamento porque o dente vai cair.',
    answer: false,
    explanation:
      'Cárie em dente decíduo pode causar dor, infecção, perda de espaço e, em casos graves, afetar o sucessor permanente. A intervenção é escolhida conforme atividade, extensão e risco.',
  },
  {
    id: 'odped-09',
    kind: 'choice',
    difficulty: 3,
    prompt: 'Qual é a conduta imediata?',
    scenario: 'Criança de 8 anos chega com avulsão do incisivo central permanente há 30 minutos, dente em leite.',
    options: [
      'Descartar o dente e planejar prótese',
      'Manusear pela coroa, reimplantar rapidamente e seguir protocolo de contenção e acompanhamento',
      'Lavar o dente escovando a raiz antes de reimplantar',
      'Aguardar 24 horas para avaliar',
    ],
    answer: 1,
    explanation:
      'O tempo extra-alveolar e o meio de armazenamento influenciam o prognóstico. O dente deve ser segurado pela coroa e, se sujo, enxaguado suavemente sem esfregar a raiz; após reimplante, indicam-se contenção flexível, avaliação de tétano e antibiótico conforme protocolo e acompanhamento pulpar.',
  },
  {
    id: 'odped-10',
    kind: 'order',
    difficulty: 2,
    prompt: 'Ordene a primeira consulta infantil',
    steps: [
      'Acolher criança e responsável',
      'Anamnese com o responsável',
      'Exame clínico adaptado à idade',
      'Procedimento preventivo ou terapêutico curto, se necessário e tolerado',
      'Reforço positivo e combinação do retorno',
    ],
    explanation:
      'A primeira consulta deve priorizar avaliação, prevenção e construção de confiança. Um procedimento não é obrigatório quando não houver necessidade ou tolerância.',
  },
  {
    id: 'odped-11',
    kind: 'blank',
    difficulty: 3,
    prompt: 'Complete a frase',
    sentence: 'A perda precoce de um decíduo pode exigir um ___ de espaço.',
    answer: 'mantenedor',
    bank: ['mantenedor', 'expansor', 'contentor', 'levantador'],
    explanation:
      'A indicação depende do dente perdido, idade, estágio de erupção, espaço existente e oclusão. Nem toda perda precoce exige mantenedor.',
  },
  {
    id: 'odped-12',
    kind: 'choice',
    difficulty: 2,
    prompt: 'Qual orientação de higiene é a correta?',
    scenario: 'Mãe de criança de 4 anos pergunta como escovar os dentes do filho.',
    options: [
      'Deixar a criança escovar sozinha, sem supervisão',
      'Escovação pelo adulto, duas vezes ao dia, com uma ervilha de dentifrício fluoretado',
      'Usar apenas água até os 7 anos',
      'Escovar uma vez por semana',
    ],
    answer: 1,
    explanation:
      'Aos 4 anos, recomenda-se dentifrício com pelo menos 1.000 ppm de fluoreto em quantidade do tamanho de uma ervilha, com um adulto realizando ou completando a escovação e reduzindo a deglutição.',
  },
];
