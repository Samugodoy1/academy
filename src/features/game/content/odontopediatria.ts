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
      'Dizer-mostrar-fazer é a base do manejo infantil: reduz o desconhecido, que é o que mais gera medo.',
  },
  {
    id: 'odped-02',
    kind: 'boolean',
    difficulty: 1,
    prompt: 'Verdadeiro ou falso?',
    statement: 'Em criança, a dose do anestésico é sempre calculada pelo peso.',
    answer: true,
    explanation:
      'Nada de "um tubete padrão". Peso × dose máxima em mg/kg, calculado antes da consulta, nunca durante.',
  },
  {
    id: 'odped-03',
    kind: 'choice',
    difficulty: 3,
    prompt: 'Qual é a conduta?',
    scenario:
      'Molar decíduo com cárie extensa, mobilidade e sucessor permanente já próximo na radiografia.',
    options: [
      'Tratamento endodôntico completo do decíduo',
      'Avaliar a cronologia de esfoliação: se está próxima, controlar dor e infecção e discutir com o professor',
      'Restaurar com resina e liberar',
      'Ignorar, porque vai cair sozinho de qualquer forma',
    ],
    answer: 1,
    explanation:
      'Tratamento invasivo em dente prestes a esfoliar raramente se justifica — mas abandonar dor e infecção também não é conduta.',
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
      'São 20 decíduos (5 por hemiarco) contra 32 permanentes. Saber isso de cabeça agiliza o odontograma infantil.',
  },
  {
    id: 'odped-05',
    kind: 'choice',
    difficulty: 2,
    prompt: 'A criança não colabora de jeito nenhum. E agora?',
    options: [
      'Contenção física para terminar tudo hoje',
      'Encurtar a consulta, resolver o essencial e replanejar as próximas',
      'Dispensar sem nenhuma orientação',
      'Repetir o mesmo procedimento até dar certo',
    ],
    answer: 1,
    explanation:
      'Forçar o atendimento compromete todas as consultas seguintes. Ganhar confiança é parte do tratamento, não perda de tempo.',
  },
  {
    id: 'odped-06',
    kind: 'match',
    difficulty: 3,
    prompt: 'Relacione o procedimento com a indicação',
    pairs: [
      { left: 'ART', right: 'Remoção de dentina infectada com instrumento manual e ionômero' },
      { left: 'Selante', right: 'Fóssulas e fissuras retentivas em risco' },
      { left: 'Pulpotomia', right: 'Polpa coronária comprometida e radicular vital' },
      { left: 'Mantenedor de espaço', right: 'Perda precoce de decíduo' },
    ],
    explanation:
      'Odontopediatria é conservadora por princípio: preservar estrutura, guiar erupção e manter a criança tranquila.',
  },
  {
    id: 'odped-07',
    kind: 'multi',
    difficulty: 2,
    prompt: 'Selecione o que precisa ser combinado com o responsável',
    options: [
      'Consentimento informado registrado',
      'Orientação de dieta e higiene',
      'Explicação do que será feito hoje',
      'Nota da prova do aluno',
      'Sinais de alerta e como retornar',
    ],
    answers: [0, 1, 2, 4],
    explanation:
      'O responsável é corresponsável pelo tratamento. Se ele não entende o plano, a adesão em casa não acontece.',
  },
  {
    id: 'odped-08',
    kind: 'boolean',
    difficulty: 2,
    prompt: 'Verdadeiro ou falso?',
    statement: 'Cárie em dente decíduo não precisa de tratamento porque o dente vai cair.',
    answer: false,
    explanation:
      'Cárie em decíduo causa dor, infecção, perda de espaço e afeta o germe do permanente. É doença, e doença se trata.',
  },
  {
    id: 'odped-09',
    kind: 'choice',
    difficulty: 3,
    prompt: 'Qual é a conduta imediata?',
    scenario: 'Criança de 8 anos chega com avulsão do incisivo central permanente há 30 minutos, dente em leite.',
    options: [
      'Descartar o dente e planejar prótese',
      'Reimplantar o quanto antes, com contenção e acompanhamento',
      'Lavar o dente escovando a raiz antes de reimplantar',
      'Aguardar 24 horas para avaliar',
    ],
    answer: 1,
    explanation:
      'Tempo extra-alveolar é o que define o prognóstico. Nunca esfregue a raiz: o ligamento periodontal aderido é o que permite a reinserção.',
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
      'Procedimento curto e possível para hoje',
      'Reforço positivo e combinação do retorno',
    ],
    explanation:
      'Terminar com reforço positivo faz a criança voltar querendo. Essa é a diferença entre paciente colaborador e paciente com trauma.',
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
      'Sem mantenedor, os dentes vizinhos migram e o sucessor perde espaço para erupcionar — o que vira problema ortodôntico depois.',
  },
  {
    id: 'odped-12',
    kind: 'choice',
    difficulty: 2,
    prompt: 'Qual orientação de higiene é a correta?',
    scenario: 'Mãe de criança de 4 anos pergunta como escovar os dentes do filho.',
    options: [
      'Deixar a criança escovar sozinha, sem supervisão',
      'Escovação supervisionada pelo adulto, com dentifrício fluoretado em quantidade adequada à idade',
      'Usar apenas água até os 7 anos',
      'Escovar uma vez por semana',
    ],
    answer: 1,
    explanation:
      'Até por volta dos 7-8 anos a criança não tem coordenação para uma escovação eficiente. Supervisão do adulto e quantidade correta de dentifrício são essenciais.',
  },
];
