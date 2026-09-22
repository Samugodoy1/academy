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
      'Sob isolamento, o dente pode desidratar e parecer mais claro. A seleção prévia, com o dente hidratado, reduz esse viés.',
  },
  {
    id: 'dent-02',
    kind: 'choice',
    difficulty: 2,
    prompt: 'Qual é a conduta geral mais segura?',
    scenario: 'Saliva contaminou a cavidade após a aplicação do sistema adesivo.',
    options: [
      'Secar com ar e seguir',
      'Interromper, descontaminar e reaplicar o sistema conforme o estágio e o fabricante',
      'Aplicar mais uma camada de adesivo por cima',
      'Fotoativar por mais tempo',
    ],
    answer: 1,
    explanation:
      'A conduta depende de a contaminação ter ocorrido antes ou depois da fotoativação e do sistema empregado. Secar ou prolongar a luz não restaura previsivelmente a interface; deve-se seguir o protocolo de descontaminação do fabricante, evitando condicionamento adicional indiscriminado da dentina.',
  },
  {
    id: 'dent-03',
    kind: 'blank',
    difficulty: 2,
    prompt: 'Complete a frase',
    sentence: 'Para muitas resinas compostas convencionais, os incrementos têm no máximo cerca de ___ mm.',
    answer: '2',
    bank: ['2', '5', '8', '0,2'],
    explanation:
      'A espessura depende da irradiância, do tempo, da translucidez e do material. Resinas bulk-fill podem permitir incrementos maiores, conforme as instruções do fabricante.',
  },
  {
    id: 'dent-04',
    kind: 'order',
    difficulty: 2,
    prompt: 'Ordene o protocolo de condicionamento total',
    steps: [
      'Condicionar esmalte e dentina com ácido fosfórico nos tempos recomendados',
      'Lavar abundantemente',
      'Secar sem desidratar a dentina',
      'Aplicar o adesivo com fricção ativa',
      'Evaporar o solvente e fotoativar',
    ],
    explanation:
      'Em sistemas etch-and-rinse, esmalte e dentina são condicionados, geralmente por tempos distintos. O controle de umidade e as etapas de aplicação devem seguir o sistema utilizado.',
  },
  {
    id: 'dent-05',
    kind: 'choice',
    difficulty: 3,
    prompt: 'Qual é a primeira avaliação clínica?',
    scenario: 'Paciente volta com dor ao mastigar no dente restaurado ontem.',
    options: [
      'Indicar tratamento endodôntico sem testes',
      'Verificar oclusão e examinar polpa, periodonto e possíveis trincas',
      'Registrar alergia à resina',
      'Prescrever antibiótico',
    ],
    answer: 1,
    explanation:
      'Um contato prematuro é uma possibilidade, mas a dor à mastigação também pode ter origem pulpar, periodontal ou estrutural. A conduta começa por exame dirigido e testes, não por uma conclusão presumida.',
  },
  {
    id: 'dent-06',
    kind: 'match',
    difficulty: 2,
    prompt: 'Relacione o material com a característica',
    pairs: [
      { left: 'Resina composta', right: 'Estética e adesão ao esmalte e dentina' },
      { left: 'Ionômero de vidro', right: 'Liberação de flúor e adesão química' },
      { left: 'Ácido fosfórico', right: 'Condicionamento em sistemas etch-and-rinse' },
      { left: 'Matriz seccional com anel', right: 'Ponto de contato proximal adequado' },
    ],
    explanation:
      'A seleção do material deve ser compatível com a indicação e acompanhada de técnica adequada de inserção, acabamento e controle de umidade.',
  },
  {
    id: 'dent-07',
    kind: 'boolean',
    difficulty: 2,
    prompt: 'Verdadeiro ou falso?',
    statement: 'Excesso proximal de resina pode causar inflamação gengival crônica.',
    answer: true,
    explanation:
      'O excesso pode reter biofilme, dificultar a higiene interproximal e contribuir para inflamação localizada.',
  },
  {
    id: 'dent-08',
    kind: 'choice',
    difficulty: 3,
    prompt: 'Como proceder na cavidade profunda?',
    scenario:
      'Lesão cariosa profunda no 46, com polpa sensível e compatível com normalidade ou pulpite reversível, sem alteração apical e com risco de exposição.',
    options: [
      'Remover toda a dentina até ficar dura, mesmo expondo a polpa',
      'Remover seletivamente até dentina mole ou firme na parede pulpar e obter periferia adequada ao selamento',
      'Abrir a câmara e iniciar endodontia preventiva',
      'Restaurar por cima da cárie sem remover nada',
    ],
    answer: 1,
    explanation:
      'Em lesões profundas de dentes vitais com diagnóstico favorável, a remoção seletiva reduz o risco de exposição. A periferia deve permitir selamento durável, enquanto dentina mais macia pode permanecer apenas na região pulpar.',
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
      'Oclusão, contato proximal, ausência de excessos e polimento devem ser verificados antes da liberação.',
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
      'O fator C é a relação entre superfícies aderidas e livres da cavidade e não é eliminado pelo uso de incrementos. O estresse também depende do volume, material, geometria e protocolo de fotoativação.',
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
      'A matriz seccional contornada, associada à cunha e ao anel, favorece anatomia proximal e contato adequados.',
  },
  {
    id: 'dent-12',
    kind: 'order',
    difficulty: 2,
    prompt: 'Ordene o acabamento e polimento',
    steps: [
      'Remover excessos grosseiros com lâmina ou broca fina',
      'Definir textura e anatomia com discos',
      'Acabar as áreas proximais com tiras adequadas',
      'Polir com borrachas e pastas',
      'Conferir contato proximal e ajustar a oclusão',
    ],
    explanation:
      'O acabamento proximal deve anteceder o polimento final para evitar deixar a superfície rugosa. Ao final, verificam-se contato proximal, excessos e oclusão.',
  },
];
