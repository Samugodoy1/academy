import type { ExerciseSeed } from '../types';

export const PERIODONTIA_EXERCISES: ExerciseSeed[] = [
  {
    id: 'perio-01',
    kind: 'choice',
    difficulty: 1,
    prompt: 'Qual é o diagnóstico?',
    scenario: 'Gengiva vermelha, edemaciada, sangrando à sondagem, profundidade de 3 mm e sem perda de inserção.',
    options: ['Gengivite', 'Periodontite estágio III', 'Abscesso periodontal', 'Recessão gengival'],
    answer: 0,
    explanation:
      'Inflamação sem perda de inserção é gengivite — e é reversível com controle de biofilme.',
  },
  {
    id: 'perio-02',
    kind: 'boolean',
    difficulty: 2,
    prompt: 'Verdadeiro ou falso?',
    statement: 'A diferença central entre gengivite e periodontite é a perda de inserção.',
    answer: true,
    explanation:
      'Gengivite: inflamação reversível, sem perda. Periodontite: perda de inserção e de osso, com necessidade de raspagem e manutenção permanente.',
  },
  {
    id: 'perio-03',
    kind: 'blank',
    difficulty: 1,
    prompt: 'Complete a frase',
    sentence: 'Um sulco gengival saudável tem até ___ mm de profundidade de sondagem.',
    answer: '3',
    bank: ['3', '5', '7', '10'],
    explanation:
      'Até cerca de 3 mm, sem sangramento, é compatível com saúde. Acima disso, investigue perda de inserção antes de chamar de "bolsa".',
  },
  {
    id: 'perio-04',
    kind: 'choice',
    difficulty: 2,
    prompt: 'Profilaxia com taça resolve?',
    scenario: 'Paciente com cálculo subgengival detectado na sondagem em molares inferiores.',
    options: [
      'Sim, o polimento remove o cálculo',
      'Não: é necessária raspagem e alisamento radicular',
      'Sim, desde que use pasta abrasiva',
      'Não, o caso é cirúrgico de imediato',
    ],
    answer: 1,
    explanation:
      'Polimento não alcança depósito subgengival. Sem raspagem, a causa permanece e a inflamação volta em poucos dias.',
  },
  {
    id: 'perio-05',
    kind: 'multi',
    difficulty: 2,
    prompt: 'Selecione o que deve ser registrado no periodontograma',
    options: [
      'Profundidade de sondagem por sítio',
      'Sangramento à sondagem',
      'Recessão gengival',
      'Cor da gravata do paciente',
      'Mobilidade e envolvimento de furca',
    ],
    answers: [0, 1, 2, 4],
    explanation:
      'Sem esses dados não existe comparação na reavaliação — e a evolução do caso vira impressão pessoal.',
  },
  {
    id: 'perio-06',
    kind: 'order',
    difficulty: 2,
    prompt: 'Ordene o tratamento periodontal básico',
    steps: [
      'Diagnóstico e periodontograma completo',
      'Orientação de higiene e controle de biofilme',
      'Raspagem e alisamento radicular por quadrante',
      'Reavaliação após a cicatrização',
      'Manutenção periódica',
    ],
    explanation:
      'Sem instruir higiene antes, a raspagem trabalha contra o biofilme que continua se formando todos os dias.',
  },
  {
    id: 'perio-07',
    kind: 'match',
    difficulty: 3,
    prompt: 'Relacione o achado com o significado',
    pairs: [
      { left: 'Sangramento à sondagem', right: 'Inflamação ativa' },
      { left: 'Perda de inserção', right: 'Periodontite' },
      { left: 'Furca grau II', right: 'Perda óssea horizontal parcial entre raízes' },
      { left: 'Mobilidade grau III', right: 'Deslocamento horizontal e vertical do dente' },
    ],
    explanation:
      'Traduzir achado em significado é o que permite explicar o prognóstico para o paciente com segurança.',
  },
  {
    id: 'perio-08',
    kind: 'blank',
    difficulty: 2,
    prompt: 'Complete a frase',
    sentence: 'A reavaliação periodontal costuma ser feita cerca de ___ dias após a raspagem.',
    answer: '30 a 45',
    bank: ['30 a 45', '2 a 3', '180 a 200', '365'],
    explanation:
      'Esse é o tempo médio de cicatrização dos tecidos. Confirme sempre o protocolo da sua disciplina.',
  },
  {
    id: 'perio-09',
    kind: 'choice',
    difficulty: 3,
    prompt: 'Qual fator local você deve corrigir?',
    scenario: 'Inflamação persistente apenas na mesial do 36, mesmo com boa higiene do paciente.',
    options: [
      'Nenhum: é característica individual',
      'Restauração com excesso ou margem mal adaptada retendo biofilme',
      'Cor da resina',
      'Tipo de escova',
    ],
    answer: 1,
    explanation:
      'Sítio isolado inflamado com higiene boa em toda a boca aponta fator retentivo local: excesso proximal, margem mal adaptada ou contato aberto.',
  },
  {
    id: 'perio-10',
    kind: 'boolean',
    difficulty: 2,
    prompt: 'Verdadeiro ou falso?',
    statement: 'Tabagismo mascara o sangramento gengival e piora a resposta ao tratamento.',
    answer: true,
    explanation:
      'A vasoconstrição reduz o sangramento visível, então a doença parece mais leve do que é — e a cicatrização responde pior.',
  },
  {
    id: 'perio-11',
    kind: 'choice',
    difficulty: 2,
    prompt: 'Como orientar o paciente após a raspagem?',
    options: [
      'Avisar que pode haver sensibilidade e retração e reforçar higiene e manutenção',
      'Garantir que a gengiva volta ao nível original em uma semana',
      'Recomendar suspender o fio dental por um mês',
      'Dizer que não é preciso retornar',
    ],
    answer: 0,
    explanation:
      'Depois da raspagem, o edema diminui e a retração pode aparecer, com sensibilidade. Explicar isso antes evita a sensação de que o tratamento piorou o quadro.',
  },
  {
    id: 'perio-12',
    kind: 'multi',
    difficulty: 3,
    prompt: 'Selecione as situações que pedem encaminhamento ao especialista',
    options: [
      'Bolsas profundas persistentes após tratamento básico',
      'Envolvimento de furca avançado',
      'Gengivite leve em paciente jovem',
      'Necessidade de cirurgia periodontal',
      'Mobilidade progressiva sem resposta ao tratamento inicial',
    ],
    answers: [0, 1, 3, 4],
    explanation:
      'O tratamento básico resolve boa parte dos casos. Persistência de bolsa, furca avançada e necessidade cirúrgica são o momento de compartilhar o caso.',
  },
];
