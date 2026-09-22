import type { PretestItem } from './types';

/** Uma MCQ curada por lição — quando o chute automático não bastaria. */
export const EXTRA_MCQ_BY_LESSON: Partial<Record<string, Extract<PretestItem, { type: 'mcq' }>>> = {
  'ad-notacao': {
    type: 'mcq',
    id: 'ad-notacao-mcq',
    question: 'O dente 36 é…',
    options: [
      'Primeiro molar inferior esquerdo',
      'Primeiro molar inferior direito',
      'Sexto incisivo superior esquerdo',
      'Dente decíduo superior direito',
    ],
    correctIndex: 0,
    why: 'Quadrante 3 = inferior esquerdo; posição 6 = primeiro molar permanente.',
  },
  'acp-trigemeo': {
    type: 'mcq',
    id: 'acp-trigemeo-mcq',
    question: 'Bloqueio do nervo alveolar inferior anestesia, numa única injeção típica…',
    options: [
      'Hemimandíbule, língua ipsilateral e lábio inferior',
      'Só o dente alvo',
      'Maxila ipsilateral inteira',
      'Apenas a pele da face',
    ],
    correctIndex: 0,
    why: 'O alveolar inferior e o lingual saem do forame; o lábio inferior vem do mentoniano.',
  },
  'ca-icdas': {
    type: 'mcq',
    id: 'ca-icdas-mcq',
    question: 'ICDAS 3 significa…',
    options: [
      'Cavidade com esmalte intacto visualmente, possível lesão proximal',
      'Restauração fraturada',
      'Mancha branca ativa sem cavidade',
      'Pulpa exposta',
    ],
    correctIndex: 0,
    why: 'ICDAS separa mancha, cavidade superficial e envolvimento dentinário — código 3 entra na dentina com esmalte aparentemente fechado.',
  },
  'mi-biofilme': {
    type: 'mcq',
    id: 'mi-biofilme-mcq',
    question: 'Biofilme maduro na superfície dental se diferencia de placa jovem porque…',
    options: [
      'Tem matriz extracelular e espécies anaeróbias em profundidade',
      'É sempre visível a olho nu',
      'Não responde ao flúor',
      'Só existe em prótese',
    ],
    correctIndex: 0,
    why: 'Marsh descreve sucessão ecológica: matriz, oxigênio em gradiente, metabolismo ácido sustentado.',
  },
};
