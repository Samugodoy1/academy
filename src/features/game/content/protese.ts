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
      'O término precisa estar registrado sem defeitos para permitir uma peça adaptada. A área não deve ser reconstruída por estimativa no laboratório.',
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
    sentence: 'Quando o sulco impede a visualização e o registro do término, indica-se o ___ gengival.',
    answer: 'afastamento',
    bank: ['afastamento', 'condicionamento', 'polimento', 'selamento'],
    explanation:
      'Fio afastador ou outra técnica pode expor a margem e controlar o fluido sulcular. A necessidade depende da posição do término, da saúde do tecido e do método de moldagem ou escaneamento.',
  },
  {
    id: 'prot-04',
    kind: 'order',
    difficulty: 2,
    prompt: 'Em um caso que exige condicionamento gengival com provisório, organize a sequência',
    steps: [
      'Planejamento e avaliação do remanescente',
      'Preparo dentário com término definido',
      'Confecção e ajuste inicial do provisório',
      'Condicionamento tecidual, afastamento e moldagem definitiva',
      'Prova e cimentação da peça definitiva',
    ],
    explanation:
      'O fluxo varia conforme o caso. Quando o provisório é usado para condicionar tecidos, a moldagem definitiva ocorre depois de margens, contorno e saúde gengival estarem adequados.',
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
      'O contato prematuro pode causar desconforto, sobrecarga e falha do provisório. A oclusão deve ser verificada e ajustada na instalação.',
  },
  {
    id: 'prot-06',
    kind: 'match',
    difficulty: 3,
    prompt: 'Relacione o conceito com a definição',
    pairs: [
      { left: 'Máxima intercuspidação', right: 'Intercuspidação completa dos dentes antagonistas' },
      {
        left: 'Relação cêntrica',
        right: 'Relação maxilomandibular reproduzível e independente de contato dentário',
      },
      { left: 'Guia anterior', right: 'Desoclusão dos posteriores na protrusão' },
      { left: 'Espaço funcional livre', right: 'Diferença entre repouso e oclusão' },
    ],
    explanation:
      'A máxima intercuspidação é definida pelos contatos dentários, independentemente da posição condilar. A relação cêntrica é uma referência maxilomandibular e não depende do contato dos dentes.',
  },
  {
    id: 'prot-07',
    kind: 'boolean',
    difficulty: 2,
    prompt: 'Verdadeiro ou falso?',
    statement: 'A saúde periodontal deve estar controlada antes do preparo protético.',
    answer: true,
    explanation:
      'Inflamação gengival pode causar sangramento e alteração de contorno, prejudicando o registro e a adaptação marginal.',
  },
  {
    id: 'prot-08',
    kind: 'choice',
    difficulty: 3,
    prompt: 'Qual conduta é a correta?',
    scenario: 'Na prova da coroa metalocerâmica, o contato proximal está tão apertado que a peça não assenta.',
    options: [
      'Forçar a cimentação para que ela assente com o tempo',
      'Verificar o ajuste interno e ajustar o contato da peça até obter assentamento completo',
      'Desgastar o dente vizinho',
      'Cimentar assim mesmo e ajustar na próxima consulta',
    ],
    answer: 1,
    explanation:
      'Interferência interna ou contato proximal excessivo pode impedir o assentamento. Após o ajuste, a superfície deve ser acabada adequadamente e a adaptação marginal e a oclusão devem ser reavaliadas.',
  },
  {
    id: 'prot-09',
    kind: 'blank',
    difficulty: 2,
    prompt: 'Complete a frase',
    sentence: 'O término em ___ apresenta concavidade cervical e pode ser indicado para materiais específicos.',
    answer: 'chanfro',
    bank: ['chanfro', 'lâmina de faca', 'ombro reto', 'bisel'],
    explanation:
      'A profundidade e o desenho do chanfro dependem do material restaurador. Cerâmicas também podem exigir chanfro profundo ou ombro arredondado conforme espessura e orientação do fabricante.',
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
      'O molde deve ser avaliado antes da liberação do paciente. Defeitos no término impedem a reprodução confiável da margem.',
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
      'Contorno inadequado, excesso ou superfície rugosa podem reter biofilme. O provisório deve ser corrigido e a resposta gengival acompanhada.',
  },
  {
    id: 'prot-12',
    kind: 'order',
    difficulty: 3,
    prompt: 'Ordene a instalação da peça definitiva',
    steps: [
      'Prova em boca e avaliação do ajuste interno',
      'Conferência do contato proximal e do assentamento completo',
      'Avaliação da adaptação marginal',
      'Ajuste oclusal em máxima intercuspidação e nos movimentos excursivos',
      'Limpeza e cimentação conforme o material',
      'Remoção de excessos, verificação final e orientação',
    ],
    explanation:
      'Contato proximal excessivo pode impedir o assentamento e simular desadaptação marginal. Após a cimentação, todo excesso deve ser removido para proteger os tecidos periodontais.',
  },
];
