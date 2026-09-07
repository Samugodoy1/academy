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
      { left: 'Oclusal', right: 'Extensão vestíbulo-lingual de lesões' },
    ],
    explanation:
      'Cada imagem responde uma pergunta clínica. Pedir a tomada errada custa dose de radiação e não resolve a dúvida.',
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
    statement: 'Sobreposição proximal invalida a avaliação de cárie interproximal.',
    answer: true,
    explanation:
      'Se os contatos estão sobrepostos, a lesão proximal fica escondida. A imagem precisa ser refeita com a angulação horizontal corrigida.',
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
      'Leitura sistemática impede o erro clássico: enxergar só a lesão óbvia e perder o resto da imagem.',
  },
  {
    id: 'radio-06',
    kind: 'blank',
    difficulty: 2,
    prompt: 'Complete a frase',
    sentence: 'Uma imagem escura, que deixa passar mais radiação, é chamada de ___.',
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
      'Localização, tamanho, limites, densidade e relação com dentes e estruturas. Sem isso, o laudo vira "manchinha escura".',
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
      'Fazer a periapical necessária com avental de chumbo e protetor de tireoide',
      'Fazer panorâmica para ver tudo de uma vez',
      'Adiar o diagnóstico para depois do parto',
    ],
    answer: 1,
    explanation:
      'Gestação não contraindica radiografia necessária: com proteção adequada e tomada direcionada, a dose é mínima. Deixar a infecção evoluir é o risco maior.',
  },
  {
    id: 'radio-09',
    kind: 'boolean',
    difficulty: 2,
    prompt: 'Verdadeiro ou falso?',
    statement: 'Radiografia substitui o teste de vitalidade pulpar.',
    answer: false,
    explanation:
      'A imagem não mostra se a polpa está viva. Necrose pulpar pode existir sem nenhuma alteração periapical visível.',
  },
  {
    id: 'radio-10',
    kind: 'choice',
    difficulty: 2,
    prompt: 'O que fazer com esta imagem?',
    scenario: 'A periapical do 21 ficou com o ápice cortado, mas a coroa está nítida.',
    options: [
      'Aceitar, porque a coroa está boa',
      'Repetir a tomada: o ápice é justamente a área de interesse',
      'Aumentar o brilho no software e concluir',
      'Pedir panorâmica em vez de repetir',
    ],
    answer: 1,
    explanation:
      'A imagem precisa responder à pergunta clínica. Se o ápice foi cortado em um caso endodôntico, a tomada não serve — repita com o posicionador correto.',
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
      'ALARA (As Low As Reasonably Achievable): toda tomada precisa de justificativa clínica, colimação e proteção adequadas.',
  },
  {
    id: 'radio-12',
    kind: 'order',
    difficulty: 3,
    prompt: 'Ordene a tomada radiográfica segura',
    steps: [
      'Definir a pergunta clínica',
      'Escolher a tomada e o posicionador',
      'Colocar avental de chumbo e protetor de tireoide',
      'Posicionar receptor e cabeçote e expor',
      'Avaliar a qualidade antes de dispensar o paciente',
    ],
    explanation:
      'Conferir a imagem antes de o paciente sair evita a segunda exposição desnecessária em outro dia — e a consulta perdida.',
  },
];
