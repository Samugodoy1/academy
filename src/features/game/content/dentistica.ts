import type { ExerciseSeed } from '../types';

export const DENTISTICA_EXERCISES: ExerciseSeed[] = [
  {
    id: 'dent-01',
    kind: 'choice',
    difficulty: 1,
    prompt: 'Quando escolher a cor da resina?',
    options: [
      'Depois de isolar, com o dente seco',
      'Antes do isolamento, com o dente hidratado e boa iluminação',
      'No fim, comparando com a restauração pronta',
      'Tanto faz, a cor não muda',
    ],
    answer: 1,
    explanation:
      'Sob isolamento o dente desidrata e clareia. Cor escolhida nesse momento sai errada quando o dente reidrata.',
  },
  {
    id: 'dent-02',
    kind: 'choice',
    difficulty: 2,
    prompt: 'Qual é a conduta?',
    scenario: 'Saliva contaminou a cavidade depois de aplicado o adesivo.',
    options: [
      'Secar com ar e seguir',
      'Lavar, secar e repetir condicionamento e adesivo na área contaminada',
      'Aplicar mais uma camada de adesivo por cima',
      'Fotoativar por mais tempo',
    ],
    answer: 1,
    explanation:
      'A camada contaminada não adere. Refazer o protocolo é o único caminho — adesivo por cima de saliva falha em semanas.',
  },
  {
    id: 'dent-03',
    kind: 'blank',
    difficulty: 2,
    prompt: 'Complete a frase',
    sentence: 'Incrementos de resina composta devem ter no máximo cerca de ___ mm.',
    answer: '2',
    bank: ['2', '5', '8', '0,2'],
    explanation:
      'Até 2 mm garante fotoativação adequada e reduz o estresse de contração. Incremento grande deixa a base sem polimerizar.',
  },
  {
    id: 'dent-04',
    kind: 'order',
    difficulty: 2,
    prompt: 'Ordene o protocolo de condicionamento total',
    steps: [
      'Condicionar o esmalte com ácido fosfórico',
      'Lavar abundantemente',
      'Secar sem desidratar a dentina',
      'Aplicar o adesivo com fricção ativa',
      'Evaporar o solvente e fotoativar',
    ],
    explanation:
      'Dentina supersseca colapsa as fibras colágenas. "Úmida, mas sem poça" é a referência clássica do condicionamento total.',
  },
  {
    id: 'dent-05',
    kind: 'choice',
    difficulty: 3,
    prompt: 'Qual é a primeira suspeita?',
    scenario: 'Paciente volta com dor ao mastigar no dente restaurado ontem.',
    options: [
      'Necrose pulpar imediata',
      'Contato oclusal alto',
      'Alergia à resina',
      'Fratura de raiz',
    ],
    answer: 1,
    explanation:
      'Contato alto é a causa mais comum e a mais simples de resolver. Confira com papel articular antes de pensar em endodontia.',
  },
  {
    id: 'dent-06',
    kind: 'match',
    difficulty: 2,
    prompt: 'Relacione o material com a característica',
    pairs: [
      { left: 'Resina composta', right: 'Estética e adesão ao esmalte e dentina' },
      { left: 'Ionômero de vidro', right: 'Liberação de flúor e adesão química' },
      { left: 'Ácido fosfórico 37%', right: 'Condicionamento do esmalte' },
      { left: 'Matriz seccional com anel', right: 'Ponto de contato proximal adequado' },
    ],
    explanation:
      'Escolher o material certo é metade do resultado; a outra metade é a técnica de inserção e acabamento.',
  },
  {
    id: 'dent-07',
    kind: 'boolean',
    difficulty: 2,
    prompt: 'Verdadeiro ou falso?',
    statement: 'Excesso proximal de resina pode causar inflamação gengival crônica.',
    answer: true,
    explanation:
      'Excesso retém biofilme e impede a higiene interproximal. Muitos casos de "gengiva que não melhora" são só um excesso não removido.',
  },
  {
    id: 'dent-08',
    kind: 'choice',
    difficulty: 3,
    prompt: 'Como proceder na cavidade profunda?',
    scenario: 'Cárie profunda no 46, sem dor espontânea, com risco real de exposição pulpar.',
    options: [
      'Remover toda a dentina até ficar dura, mesmo expondo a polpa',
      'Remoção seletiva da dentina cariada, mantendo dentina afetada próxima à polpa e selando bem',
      'Abrir a câmara e iniciar endodontia preventiva',
      'Restaurar por cima da cárie sem remover nada',
    ],
    answer: 1,
    explanation:
      'Remoção seletiva preserva vitalidade: remove-se a dentina infectada da periferia, mantém-se a afetada sobre a polpa e sela-se bem a cavidade.',
  },
  {
    id: 'dent-09',
    kind: 'multi',
    difficulty: 2,
    prompt: 'Selecione o que confirmar antes de liberar o paciente',
    options: [
      'Oclusão conferida com papel articular',
      'Ponto de contato passando fio dental com resistência',
      'Ausência de excesso cervical',
      'Cor da parede da sala',
      'Polimento final realizado',
    ],
    answers: [0, 1, 2, 4],
    explanation:
      'Esse é o checklist que evita o retorno de urgência: oclusão, contato, excesso e polimento.',
  },
  {
    id: 'dent-10',
    kind: 'blank',
    difficulty: 3,
    prompt: 'Complete a frase',
    sentence: 'A contração de ___ da resina composta gera estresse na interface adesiva.',
    answer: 'polimerização',
    bank: ['polimerização', 'sinterização', 'cristalização', 'evaporação'],
    explanation:
      'Por isso usamos incrementos pequenos e técnicas de inserção que reduzem o fator C — para não descolar a margem.',
  },
  {
    id: 'dent-11',
    kind: 'choice',
    difficulty: 2,
    prompt: 'Qual matriz resolve melhor?',
    scenario: 'Restauração classe II no 36, com contato proximal aberto na tentativa anterior.',
    options: [
      'Matriz de poliéster reta',
      'Matriz seccional metálica com anel separador e cunha',
      'Sem matriz, esculpindo direto',
      'Tira de lixa como matriz',
    ],
    answer: 1,
    explanation:
      'A seccional com anel separa os dentes e reproduz a curvatura proximal — é o que devolve um contato de verdade.',
  },
  {
    id: 'dent-12',
    kind: 'order',
    difficulty: 2,
    prompt: 'Ordene o acabamento e polimento',
    steps: [
      'Remover excessos grosseiros com lâmina ou broca fina',
      'Conferir e ajustar a oclusão',
      'Definir textura e anatomia com discos',
      'Polir com borrachas e pastas',
      'Passar tiras proximais e checar o fio dental',
    ],
    explanation:
      'Ajustar oclusão antes do polimento evita perder o brilho já conquistado ao desgastar a superfície depois.',
  },
];
