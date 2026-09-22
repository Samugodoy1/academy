import type { BaseReference } from '../types';

/**
 * How to study the basic cycle, with the evidence behind each habit. Shown on
 * the library home so the method is as referenced as the content.
 */
export interface StudyMethodTip {
  id: string;
  title: string;
  body: string;
  reference: BaseReference;
}

export const STUDY_METHOD_TIPS: StudyMethodTip[] = [
  {
    id: 'teste-se',
    title: 'Teste-se antes de reler',
    body: 'Responder às perguntas do "Fixar" com o resumo fechado retém mais do que ler de novo. Errar e conferir faz parte.',
    reference: {
      id: 'roediger-2006',
      authors: 'Roediger HL, Karpicke JD',
      title: 'Test-enhanced learning: taking memory tests improves long-term retention',
      journal: 'Psychological Science',
      year: 2006,
      doi: '10.1111/j.1467-9280.2006.01693.x',
      why: 'Experimento clássico: quem fez teste lembrou mais uma semana depois do que quem releu.',
    },
  },
  {
    id: 'espacar',
    title: 'Espaçar em vez de maratonar',
    body: 'Três sessões de 10 minutos em dias diferentes valem mais do que 30 minutos de uma vez. Volte ao resumo concluído depois de alguns dias.',
    reference: {
      id: 'cepeda-2006',
      authors: 'Cepeda NJ, Pashler H, Vul E, Wixted JT, Rohrer D',
      title: 'Distributed practice in verbal recall tasks: A review and quantitative synthesis',
      journal: 'Psychological Bulletin',
      year: 2006,
      doi: '10.1037/0033-2909.132.3.354',
      why: 'Meta-análise de 254 estudos: prática distribuída supera prática concentrada.',
    },
  },
  {
    id: 'mapa',
    title: 'Mapa mental para organizar, não para decorar',
    body: 'Use o mapa para ver como os conceitos se ligam e para se testar: esconda um ramo e tente reconstruí-lo.',
    reference: {
      id: 'farrand-2002',
      authors: 'Farrand P, Hussain F, Hennessy E',
      title: "The efficacy of the 'mind map' study technique",
      journal: 'Medical Education',
      year: 2002,
      doi: '10.1046/j.1365-2923.2002.01205.x',
      why: 'Ensaio com estudantes de medicina: mapas mentais melhoraram a retenção em uma semana.',
    },
  },
  {
    id: 'evidencia',
    title: 'Técnicas com evidência, não com fama',
    body: 'Grifar e reler têm baixa utilidade. Prática de recuperação e prática distribuída têm alta. Este aplicativo é construído sobre as duas.',
    reference: {
      id: 'dunlosky-2013',
      authors: 'Dunlosky J, Rawson KA, Marsh EJ, Nathan MJ, Willingham DT',
      title: "Improving students' learning with effective learning techniques: promising directions from cognitive and educational psychology",
      journal: 'Psychological Science in the Public Interest',
      year: 2013,
      doi: '10.1177/1529100612453266',
      why: 'Revisão de dez técnicas de estudo classificadas por utilidade.',
    },
  },
];
