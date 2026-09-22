import type { ExerciseSeed } from '../types';

export const RADIOLOGIA_EXERCISES: ExerciseSeed[] = [
  {
    id: 'radio-01',
    kind: 'choice',
    difficulty: 1,
    prompt: 'Qual tomada você pede?',
    scenario: 'Suspeita de cárie proximal pequena entre os pré-molares superiores.',
    options: ['Panorâmica', 'Bite-wing (interproximal)', 'Periapical do canino', 'Telerradiografia'],
    answer: 1,
    explanation:
      'Bite-wing é a tomada da cárie proximal: mostra coroas dos dois arcos e a crista óssea, sem sobreposição do ápice.',
  },
  {
    id: 'radio-02',
    kind: 'match',
    difficulty: 2,
    prompt: 'Relacione a tomada com a indicação',
    pairs: [
      { left: 'Periapical', right: 'Lesão periapical e endodontia' },
      { left: 'Bite-wing', right: 'Cárie proximal e crista óssea' },
      { left: 'Panorâmica', right: 'Visão geral e terceiros molares' },
      { left: 'Oclusal', right: 'Localização em conjunto com outra incidência' },
    ],
    explanation:
      'Cada imagem deve responder a uma pergunta clínica. A radiografia oclusal pode auxiliar na localização, mas a extensão tridimensional pode exigir incidências complementares ou tomografia quando justificada.',
  },
  {
    id: 'radio-03',
    kind: 'choice',
    difficulty: 2,
    prompt: 'Que erro aconteceu?',
    scenario: 'Na técnica da bissetriz, o dente saiu maior que o tamanho real na radiografia.',
    options: [
      'Angulação vertical excessiva',
      'Angulação vertical insuficiente',
      'Angulação horizontal errada',
      'Tempo de exposição alto',
    ],
    answer: 1,
    explanation:
      'Angulação vertical insuficiente alonga a imagem; angulação excessiva encurta. Angulação horizontal errada causa sobreposição proximal.',
  },
  {
    id: 'radio-04',
    kind: 'boolean',
    difficulty: 1,
    prompt: 'Verdadeiro ou falso?',
    statement:
      'Se a sobreposição impedir a avaliação da superfície proximal de interesse, a imagem não responde à pergunta clínica.',
    answer: true,
    explanation:
      'A sobreposição pode ocultar uma lesão proximal. A repetição só é indicada quando a região necessária não puder ser interpretada e o benefício diagnóstico justificar uma nova exposição.',
  },
  {
    id: 'radio-05',
    kind: 'order',
    difficulty: 2,
    prompt: 'Coloque a leitura radiográfica na ordem',
    steps: [
      'Conferir qualidade técnica da imagem',
      'Identificar a anatomia normal',
      'Avaliar coroa, câmara e raiz',
      'Avaliar lâmina dura, espaço periodontal e osso',
      'Descrever o achado e correlacionar com a clínica',
    ],
    explanation:
      'A leitura sistemática reduz o risco de concentrar a análise em um único achado e omitir outras regiões da imagem.',
  },
  {
    id: 'radio-06',
    kind: 'blank',
    difficulty: 2,
    prompt: 'Complete a frase',
    sentence: 'Uma área escura associada a menor atenuação dos raios X é chamada de ___.',
    answer: 'radiolúcida',
    bank: ['radiolúcida', 'radiopaca', 'isodensa', 'esclerótica'],
    explanation:
      'Radiolúcida = escura (cárie, lesão periapical, osso reabsorvido). Radiopaca = clara (esmalte, restauração metálica, osso denso).',
  },
  {
    id: 'radio-07',
    kind: 'multi',
    difficulty: 2,
    prompt: 'Selecione o que descreve um achado radiográfico',
    options: ['Localização', 'Limites', 'Densidade', 'Nome comercial do aparelho', 'Relação com estruturas vizinhas'],
    answers: [0, 1, 2, 4],
    explanation:
      'Uma descrição útil inclui localização, tamanho, limites, densidade e relação com dentes e estruturas vizinhas.',
  },
  {
    id: 'radio-08',
    kind: 'choice',
    difficulty: 3,
    prompt: 'Qual é a conduta?',
    scenario:
      'Gestante no segundo trimestre com dor intensa no 36 e suspeita de lesão periapical.',
    options: [
      'Nenhuma radiografia pode ser feita durante a gestação',
      'Fazer a periapical justificada, com técnica e parâmetros de exposição otimizados',
      'Fazer panorâmica para ver tudo de uma vez',
      'Adiar o diagnóstico para depois do parto',
    ],
    answer: 1,
    explanation:
      'A gestação não contraindica uma radiografia necessária. Deve-se limitar o campo, usar receptor e parâmetros apropriados e evitar repetições. A blindagem rotineira não é recomendada por diretrizes atuais, mas a regulamentação local deve ser observada.',
  },
  {
    id: 'radio-09',
    kind: 'boolean',
    difficulty: 2,
    prompt: 'Verdadeiro ou falso?',
    statement: 'Radiografia substitui os testes clínicos de sensibilidade pulpar.',
    answer: false,
    explanation:
      'A imagem não determina a resposta neural nem o fluxo sanguíneo da polpa. O diagnóstico pulpar combina história, testes de sensibilidade, exame clínico e imagem.',
  },
  {
    id: 'radio-10',
    kind: 'choice',
    difficulty: 2,
    prompt: 'O que fazer com esta imagem?',
    scenario:
      'Em uma avaliação endodôntica do 21, a radiografia periapical ficou com o ápice cortado, embora a coroa esteja nítida.',
    options: [
      'Aceitar, porque a coroa está boa',
      'Repetir a tomada: o ápice é justamente a área de interesse',
      'Aumentar o brilho no software e concluir',
      'Pedir panorâmica em vez de repetir',
    ],
    answer: 1,
    explanation:
      'A região apical é necessária para a avaliação endodôntica. Nesse contexto, a repetição é justificada e deve corrigir o posicionamento para evitar nova exposição inadequada.',
  },
  {
    id: 'radio-11',
    kind: 'blank',
    difficulty: 3,
    prompt: 'Complete o princípio de radioproteção',
    sentence: 'O princípio ___ orienta usar a menor dose razoavelmente possível.',
    answer: 'ALARA',
    bank: ['ALARA', 'ALADA', 'ASEPSE', 'ADA'],
    explanation:
      'ALARA significa manter a exposição tão baixa quanto razoavelmente possível. A proteção efetiva inclui justificativa, otimização dos parâmetros, colimação e posicionamento correto.',
  },
  {
    id: 'radio-12',
    kind: 'order',
    difficulty: 3,
    prompt: 'Ordene a tomada radiográfica segura',
    steps: [
      'Definir a pergunta clínica',
      'Escolher a tomada e o posicionador',
      'Selecionar receptor, colimação e parâmetros de exposição apropriados',
      'Posicionar receptor e cabeçote e expor',
      'Avaliar a qualidade antes de dispensar o paciente',
    ],
    explanation:
      'A imagem deve ser conferida antes da liberação para verificar se responde à pergunta clínica. Blindagem não deve ser tratada como requisito universal; devem ser seguidas as normas locais vigentes.',
  },
];
