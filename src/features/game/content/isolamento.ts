import type { ExerciseSeed } from '../types';

export const ISOLAMENTO_EXERCISES: ExerciseSeed[] = [
  {
    id: 'isol-01',
    kind: 'choice',
    difficulty: 1,
    prompt: 'Por que o fio dental é amarrado no grampo?',
    options: [
      'Para marcar o grampo do kit',
      'Para resgatar o grampo se ele soltar ou fraturar',
      'Para segurar o lençol de borracha',
      'Para afastar a língua',
    ],
    answer: 1,
    explanation:
      'É item de segurança: se o grampo escapar, o fio evita aspiração ou deglutição. Nunca é opcional.',
  },
  {
    id: 'isol-02',
    kind: 'boolean',
    difficulty: 1,
    prompt: 'Verdadeiro ou falso?',
    statement: 'Endodontia pode ser realizada sem isolamento absoluto quando o paciente colabora.',
    answer: false,
    explanation:
      'Isolamento absoluto em endodontia não se negocia: protege contra aspiração de instrumentos, contaminação salivar e extravasamento de irrigante.',
  },
  {
    id: 'isol-03',
    kind: 'order',
    difficulty: 2,
    prompt: 'Ordene a montagem do isolamento',
    steps: [
      'Selecionar e testar o grampo no dente',
      'Amarrar o fio dental de segurança no grampo',
      'Perfurar o lençol conforme os dentes a isolar',
      'Levar o conjunto e passar os contatos com fio dental',
      'Inverter a borracha no sulco e conferir a vedação',
    ],
    explanation:
      'Testar o grampo antes evita descobrir instabilidade com o campo já montado — que é quando o acidente acontece.',
  },
  {
    id: 'isol-04',
    kind: 'choice',
    difficulty: 2,
    prompt: 'Qual é a conduta?',
    scenario: 'O campo parece isolado, mas há umidade subindo pela cervical do dente 25.',
    options: [
      'Seguir com o adesivo e secar com ar antes',
      'Corrigir: inverter melhor a borracha, usar barreira gengival ou trocar o grampo',
      'Ignorar, porque adesivo moderno tolera umidade',
      'Aumentar o tempo de fotoativação para compensar',
    ],
    answer: 1,
    explanation:
      'Vazamento cervical contamina a margem e compromete a adesão. Corrigir o campo é mais rápido do que refazer a restauração daqui a seis meses.',
  },
  {
    id: 'isol-05',
    kind: 'match',
    difficulty: 2,
    prompt: 'Relacione o instrumento com a função',
    pairs: [
      { left: 'Perfurador de Ainsworth', right: 'Fazer os orifícios no lençol' },
      { left: 'Pinça de Palmer', right: 'Levar e remover o grampo' },
      { left: 'Arco de Young', right: 'Manter o lençol estendido' },
      { left: 'Barreira gengival fotopolimerizável', right: 'Selar vazamentos cervicais' },
    ],
    explanation:
      'Saber o nome e a função do instrumental é o mínimo para pedir o material certo no box sem travar o atendimento.',
  },
  {
    id: 'isol-06',
    kind: 'multi',
    difficulty: 2,
    prompt: 'Selecione as indicações claras de isolamento absoluto',
    options: [
      'Tratamento endodôntico',
      'Restauração adesiva',
      'Cimentação adesiva de peça indireta',
      'Consulta de anamnese',
      'Aplicação de selante',
    ],
    answers: [0, 1, 2, 4],
    explanation:
      'Sempre que houver adesão, irrigante ou risco de aspiração. Anamnese, obviamente, não precisa de campo operatório.',
  },
  {
    id: 'isol-07',
    kind: 'blank',
    difficulty: 2,
    prompt: 'Complete a frase',
    sentence: 'A ___ da borracha no sulco gengival é o que garante a vedação cervical.',
    answer: 'inversão',
    bank: ['inversão', 'perfuração', 'tração', 'fotoativação'],
    explanation:
      'Inversão com instrumento rombo e jato de ar (mais amarrilho quando necessário) é o detalhe que separa campo seco de campo "quase seco".',
  },
  {
    id: 'isol-08',
    kind: 'choice',
    difficulty: 3,
    prompt: 'Qual grampo é mais adequado?',
    scenario: 'Molar inferior parcialmente erupcionado, com pouca altura de coroa clínica.',
    options: [
      'Grampo de incisivo, por ser menor',
      'Grampo com aletas retentivas próprio para molar, testado quanto à estabilidade',
      'Qualquer grampo, desde que fique preso na gengiva',
      'Nenhum: usar apenas isolamento relativo com algodão',
    ],
    answer: 1,
    explanation:
      'O grampo é escolhido pela anatomia cervical, grau de erupção e retenção. Grampo apoiado em gengiva causa dor e sangramento — e escapa.',
  },
  {
    id: 'isol-09',
    kind: 'boolean',
    difficulty: 2,
    prompt: 'Verdadeiro ou falso?',
    statement: 'O isolamento absoluto também protege o paciente da aspiração de instrumentos.',
    answer: true,
    explanation:
      'Além de controlar umidade e melhorar visibilidade, o lençol é barreira física contra deglutição e aspiração de limas, grampos e fragmentos.',
  },
  {
    id: 'isol-10',
    kind: 'choice',
    difficulty: 2,
    prompt: 'O lençol rasgou ao passar o contato proximal. O que fazer?',
    options: [
      'Continuar: um rasgo pequeno não atrapalha',
      'Refazer a perfuração ou trocar o lençol antes de iniciar',
      'Colar o rasgo com adesivo dentinário',
      'Trocar para isolamento relativo',
    ],
    answer: 1,
    explanation:
      'Rasgo na cervical vira porta de entrada de saliva justamente onde a margem é mais crítica. Refazer custa dois minutos.',
  },
  {
    id: 'isol-11',
    kind: 'blank',
    difficulty: 1,
    prompt: 'Complete a frase',
    sentence: 'Além do dente a tratar, isolar os dentes ___ facilita o acesso e a matriz.',
    answer: 'vizinhos',
    bank: ['vizinhos', 'antagonistas', 'anteriores', 'decíduos'],
    explanation:
      'Ampliar o campo melhora a visão, a passagem da matriz e o afastamento — especialmente em restaurações proximais.',
  },
  {
    id: 'isol-12',
    kind: 'order',
    difficulty: 3,
    prompt: 'Ordene a remoção segura do isolamento',
    steps: [
      'Conferir se o procedimento está concluído',
      'Cortar os septos de borracha com tesoura protegendo o tecido',
      'Remover o grampo com a pinça',
      'Retirar lençol e arco em conjunto',
      'Inspecionar sulcos e conferir se nenhum fragmento ficou',
    ],
    explanation:
      'Cortar os septos antes de remover o grampo evita deixar borracha presa entre os dentes — causa silenciosa de inflamação gengival.',
  },
];
