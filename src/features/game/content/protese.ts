import type { ExerciseSeed } from '../types';

export const PROTESE_EXERCISES: ExerciseSeed[] = [
  {
    id: 'prot-01',
    kind: 'choice',
    difficulty: 2,
    prompt: 'A moldagem serve?',
    scenario: 'O molde saiu com uma bolha exatamente sobre o término cervical do preparo.',
    options: [
      'Sim, o laboratório completa a margem',
      'Não: refazer a moldagem, o término precisa estar íntegro',
      'Sim, desde que se avise o técnico',
      'Sim, se a bolha for pequena',
    ],
    answer: 1,
    explanation:
      'O técnico não adivinha a margem. Término incompleto vira coroa desadaptada, infiltração e cárie secundária.',
  },
  {
    id: 'prot-02',
    kind: 'multi',
    difficulty: 2,
    prompt: 'Para que serve o provisório?',
    options: [
      'Proteger a dentina exposta',
      'Manter a posição do dente e o espaço protético',
      'Condicionar o tecido gengival',
      'Substituir a peça definitiva por anos',
      'Testar forma, função e estética',
    ],
    answers: [0, 1, 2, 4],
    explanation:
      'O provisório é um ensaio do resultado final. Ele não é peça definitiva, mas o que ele revela evita retrabalho depois.',
  },
  {
    id: 'prot-03',
    kind: 'blank',
    difficulty: 2,
    prompt: 'Complete a frase',
    sentence: 'Antes de moldar um término subgengival é necessário fazer o ___ gengival.',
    answer: 'afastamento',
    bank: ['afastamento', 'condicionamento', 'polimento', 'selamento'],
    explanation:
      'Fio afastador (ou outra técnica) expõe a margem e controla o fluido do sulco. Sem isso, o material não copia o término.',
  },
  {
    id: 'prot-04',
    kind: 'order',
    difficulty: 2,
    prompt: 'Ordene a sequência protética',
    steps: [
      'Planejamento e avaliação do remanescente',
      'Preparo dentário com término definido',
      'Afastamento gengival e moldagem',
      'Confecção e ajuste do provisório',
      'Prova e cimentação da peça definitiva',
    ],
    explanation:
      'Cada etapa depende da anterior. Preparo sem planejamento é desgaste irreversível feito no escuro.',
  },
  {
    id: 'prot-05',
    kind: 'choice',
    difficulty: 3,
    prompt: 'O que pode acontecer?',
    scenario: 'O provisório foi cimentado com contato oclusal claramente alto.',
    options: [
      'Nada, o paciente se acostuma',
      'Dor, mobilidade, fratura ou descimentação',
      'Melhora da mastigação',
      'Aceleração da cicatrização gengival',
    ],
    answer: 1,
    explanation:
      'Ajustar oclusão faz parte da instalação. Contato alto sobrecarrega o periodonto e costuma voltar como urgência.',
  },
  {
    id: 'prot-06',
    kind: 'match',
    difficulty: 3,
    prompt: 'Relacione o conceito com a definição',
    pairs: [
      { left: 'MIC', right: 'Máxima intercuspidação habitual' },
      { left: 'Relação cêntrica', right: 'Posição condilar de referência' },
      { left: 'Guia anterior', right: 'Desoclusão dos posteriores na protrusão' },
      { left: 'Espaço funcional livre', right: 'Diferença entre repouso e oclusão' },
    ],
    explanation:
      'Esses quatro conceitos aparecem em toda avaliação oclusal. Sem eles, o ajuste vira tentativa e erro com carbono.',
  },
  {
    id: 'prot-07',
    kind: 'boolean',
    difficulty: 2,
    prompt: 'Verdadeiro ou falso?',
    statement: 'A saúde periodontal deve estar controlada antes do preparo protético.',
    answer: true,
    explanation:
      'Gengiva inflamada sangra, muda de posição após o tratamento e inviabiliza tanto a moldagem quanto a margem da peça.',
  },
  {
    id: 'prot-08',
    kind: 'choice',
    difficulty: 3,
    prompt: 'Qual conduta é a correta?',
    scenario: 'Na prova da coroa metalocerâmica, o contato proximal está tão apertado que a peça não assenta.',
    options: [
      'Forçar a cimentação para que ela assente com o tempo',
      'Ajustar o contato proximal com ponta adequada até assentar e conferir a adaptação marginal',
      'Desgastar o dente vizinho',
      'Cimentar assim mesmo e ajustar na próxima consulta',
    ],
    answer: 1,
    explanation:
      'Peça que não assenta deixa margem aberta e oclusão alta. Ajusta-se a peça, não o dente vizinho hígido.',
  },
  {
    id: 'prot-09',
    kind: 'blank',
    difficulty: 2,
    prompt: 'Complete a frase',
    sentence: 'O término em ___ é o preparo com degrau arredondado bastante usado em coroas cerâmicas.',
    answer: 'chanfro',
    bank: ['chanfro', 'lâmina de faca', 'ombro reto', 'bisel'],
    explanation:
      'O chanfro dá espessura suficiente à cerâmica na cervical e é fácil de identificar na moldagem e no modelo.',
  },
  {
    id: 'prot-10',
    kind: 'multi',
    difficulty: 2,
    prompt: 'Selecione os defeitos que reprovam uma moldagem',
    options: [
      'Bolha no término',
      'Arrasto do material',
      'Rasgo na margem',
      'Cor do material de moldagem',
      'Término não copiado em toda a extensão',
    ],
    answers: [0, 1, 2, 4],
    explanation:
      'Avalie o molde com boa luz e lupa se possível, antes de dispensar o paciente. Refazer na hora custa muito menos.',
  },
  {
    id: 'prot-11',
    kind: 'choice',
    difficulty: 2,
    prompt: 'Qual é a melhor conduta?',
    scenario: 'O paciente relata que a gengiva ao redor do provisório está inflamada e sangra.',
    options: [
      'Prescrever anti-inflamatório e aguardar',
      'Revisar contorno, excesso cervical e polimento do provisório e reforçar higiene',
      'Remover o provisório e deixar o preparo exposto',
      'Cimentar a peça definitiva imediatamente',
    ],
    answer: 1,
    explanation:
      'Provisório mal contornado, com excesso ou sem polimento, retém biofilme. Corrigir o provisório resolve a inflamação na origem.',
  },
  {
    id: 'prot-12',
    kind: 'order',
    difficulty: 3,
    prompt: 'Ordene a instalação da peça definitiva',
    steps: [
      'Prova em boca e avaliação da adaptação marginal',
      'Conferência do contato proximal',
      'Ajuste oclusal em MIC e nos movimentos excursivos',
      'Limpeza e cimentação conforme o material',
      'Remoção de excessos de cimento e orientação final',
    ],
    explanation:
      'Excesso de cimento subgengival é causa frequente de inflamação persistente meses depois da entrega.',
  },
];
