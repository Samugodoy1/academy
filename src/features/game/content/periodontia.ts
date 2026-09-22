import type { ExerciseSeed } from '../types';
import { choice, gap, multi, order, pairs, truth } from './authoring';

export const PERIODONTIA_EXERCISES: ExerciseSeed[] = [
  choice(
    'perio-01',
    'O que a profundidade de sondagem mede?',
    ['Da margem gengival ao fundo do sulco', 'Da junção amelocementária ao fundo do sulco', 'Da cúspide ao ápice', 'Do contato ao osso'],
    'Profundidade de sondagem começa na margem. Se a margem migrou ou inchou, o número muda sem a inserção mudar.',
    { difficulty: 1 }
  ),
  choice(
    'perio-02',
    'O que o nível clínico de inserção mede?',
    ['Da junção amelocementária ao fundo do sulco', 'Da margem gengival ao fundo do sulco', 'Da margem gengival ao osso', 'Da papila ao contato'],
    'O nível de inserção usa um ponto fixo do dente (a JAC). É ele que mostra perda real de suporte.',
    { difficulty: 2 }
  ),
  gap(
    'perio-03',
    'Em saúde periodontal, o sulco tem até ___ mm.',
    '3',
    ['1', '5', '7'],
    'Até 3 mm sem sangramento é saúde. Acima disso, com sangramento, começa a investigação.',
    1
  ),
  truth(
    'perio-04',
    'Sangramento à sondagem indica inflamação.',
    true,
    'Vaso frágil sangra ao toque da sonda. Ausência de sangramento é o melhor sinal de estabilidade.'
  ),
  choice(
    'perio-05',
    'Qual é o diagnóstico mais provável?',
    ['Gengivite induzida por biofilme', 'Periodontite estágio I', 'Saúde periodontal', 'Abscesso periodontal'],
    'Sangramento com sulco raso e sem perda de inserção é gengivite: inflamação reversível.',
    { scenario: 'Sangramento em 40% dos sítios, sondagem até 3 mm, sem perda de inserção.', difficulty: 2 }
  ),
  choice(
    'perio-06',
    'O que define periodontite (e não gengivite)?',
    ['Perda de inserção clínica', 'Sangramento à sondagem', 'Halitose', 'Cálculo supragengival'],
    'Gengivite inflama sem destruir. Periodontite destrói: perda de inserção e de osso.',
    { difficulty: 2 }
  ),
  gap(
    'perio-07',
    'Quantos pontos por dente são sondados no exame periodontal completo? ___',
    'seis',
    ['dois', 'quatro', 'oito'],
    'Três por vestibular e três por lingual. Menos que isso deixa bolsa sem registro.',
    1
  ),
  truth(
    'perio-08',
    'A força ideal de sondagem é cerca de 0,25 N (25 gramas).',
    true,
    'Força leve, o suficiente para sentir resistência. Mais que isso fura o epitélio e superestima a bolsa.',
    2
  ),
  choice(
    'perio-09',
    'Qual é a causa da doença periodontal inflamatória?',
    ['Biofilme dental', 'Cálculo', 'Escova dura', 'Idade'],
    'Cálculo retém biofilme, mas quem inflama é o biofilme. Por isso o controle de placa é a base do tratamento.',
    { difficulty: 1 }
  ),
  pairs(
    'perio-10',
    'Relacione o grau de mobilidade à descrição',
    [
      ['Grau 1', 'Até 1 mm horizontal'],
      ['Grau 2', 'Mais de 1 mm horizontal'],
      ['Grau 3', 'Horizontal e vertical (intrusão)'],
    ],
    'Mobilidade cresce com perda de suporte e trauma oclusal. Registrar sempre para acompanhar a evolução.',
    2
  ),
  pairs(
    'perio-11',
    'Relacione o envolvimento de furca (Hamp) à descrição',
    [
      ['Classe I', 'Sonda entra até 3 mm'],
      ['Classe II', 'Entra mais de 3 mm, não atravessa'],
      ['Classe III', 'Atravessa de lado a lado'],
    ],
    'Furca aberta muda prognóstico e higiene. Classe III raramente se controla só com raspagem.',
    3
  ),
  order(
    'perio-12',
    'Ordene as fases do tratamento periodontal',
    ['Diagnóstico e orientação de higiene', 'Raspagem e alisamento radicular', 'Reavaliação em 6 a 8 semanas', 'Terapia cirúrgica se necessário', 'Manutenção periódica'],
    'Sem controle de biofilme, nenhuma fase seguinte funciona. Reavaliar antes de operar.',
    { difficulty: 2 }
  ),
  choice(
    'perio-13',
    'Quando reavaliar após raspagem e alisamento radicular?',
    ['Em 6 a 8 semanas', 'No dia seguinte', 'Em 1 semana', 'Em 1 ano'],
    'A cicatrização do tecido conjuntivo leva semanas. Reavaliar antes disso subestima o resultado.',
    { difficulty: 2 }
  ),
  choice(
    'perio-14',
    'Qual é o principal fator de risco modificável para periodontite?',
    ['Tabagismo', 'Sexo', 'Idade', 'Altura'],
    'Fumante tem mais perda óssea, responde pior ao tratamento e sangra menos, o que esconde a inflamação.',
    { difficulty: 1 }
  ),
  truth(
    'perio-15',
    'Diabetes descompensado piora a periodontite, e a periodontite dificulta o controle glicêmico.',
    true,
    'Relação de mão dupla. Tratar o periodonto ajuda a baixar a hemoglobina glicada.',
    2
  ),
  choice(
    'perio-16',
    'Qual é o diagnóstico?',
    ['Aumento gengival com pseudobolsa', 'Periodontite estágio III', 'Recessão gengival', 'Saúde'],
    'Margem que cresceu para cima aumenta a sondagem sem perda de inserção: pseudobolsa.',
    { scenario: 'Sondagem de 5 mm, mas a junção amelocementária está no nível do fundo do sulco.', difficulty: 3 }
  ),
  multi(
    'perio-17',
    'O que caracteriza um abscesso periodontal?',
    ['Aumento de volume na gengiva', 'Dor e supuração à pressão', 'Bolsa periodontal pré-existente'],
    ['Dente sem resposta ao frio obrigatoriamente', 'Ausência de biofilme'],
    'Abscesso periodontal nasce de uma bolsa. A polpa costuma estar vital, diferente do abscesso endodôntico.',
    { difficulty: 3 }
  ),
  choice(
    'perio-18',
    'Qual é a conduta inicial no abscesso periodontal?',
    ['Drenar via bolsa e raspar', 'Antibiótico isolado', 'Extrair na hora', 'Só bochecho'],
    'Drenagem e remoção da causa vêm primeiro. Antibiótico só com sinais sistêmicos.',
    { difficulty: 2 }
  ),
  gap(
    'perio-19',
    'O intervalo típico de manutenção periodontal é de ___ meses.',
    '3 a 4',
    ['12', '24', '1'],
    'O biofilme subgengival se reorganiza em cerca de 3 meses. Quem falta à manutenção perde o que ganhou.',
    2
  ),
  truth(
    'perio-20',
    'A perda óssea da periodontite é revertida com raspagem.',
    false,
    'A raspagem para a destruição; o osso perdido não volta sozinho. Por isso diagnosticar cedo.',
    2
  ),
  choice(
    'perio-21',
    'Qual imagem avalia melhor a crista óssea interproximal?',
    ['Interproximal (bite-wing)', 'Panorâmica', 'Oclusal', 'Telerradiografia'],
    'Bite-wing tem pouca distorção vertical e mostra bem a perda óssea horizontal inicial.',
    { difficulty: 2 }
  ),
  choice(
    'perio-22',
    'Antibiótico sistêmico na periodontite é indicado?',
    ['Em casos selecionados, sempre junto com a raspagem', 'Em todos os pacientes', 'No lugar da raspagem', 'Nunca'],
    'Antibiótico não remove biofilme. É adjuvante em casos específicos, nunca substituto da terapia mecânica.',
    { difficulty: 3 }
  ),
  multi(
    'perio-23',
    'Quais achados indicam gengiva saudável?',
    ['Cor rosa coral', 'Sem sangramento à sondagem', 'Margem em lâmina de faca'],
    ['Aspecto brilhante e edemaciado', 'Sangramento ao passar o fio'],
    'Saudável é firme, rosa e sem sangue. Brilho e edema são sinais de inflamação.',
    { difficulty: 1 }
  ),
  truth(
    'perio-24',
    'Cálculo supragengival é a causa direta da inflamação gengival.',
    false,
    'O cálculo é poroso e retém biofilme; ele é fator retentivo. Quem inflama é o biofilme sobre ele.',
    2
  ),
];
