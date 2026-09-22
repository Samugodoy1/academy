import type { GestoKind } from './types';

/** One hands-on beat per lesson — lab, mini-caso, mapa mecânico ou reconstruir. */
export const GESTO_BY_LESSON: Record<string, GestoKind> = {
  'ad-notacao': { type: 'rebuild', disciplineId: 'anatomia-dental' },
  'ad-morfologia': { type: 'mechanistic', disciplineId: 'anatomia-dental' },
  'ad-cronologia': { type: 'lab', labId: 'eruption' },
  'ad-oclusao': { type: 'rebuild', disciplineId: 'anatomia-dental' },

  'acp-ossos': { type: 'lab', labId: 'alveolar-nerve' },
  'acp-trigemeo': { type: 'lab', labId: 'alveolar-nerve' },
  'acp-musculos-atm': { type: 'minicase', caseId: 'atm-clique' },

  'br-precaucoes': { type: 'minicase', caseId: 'perfurocorte' },
  'br-processamento': { type: 'rebuild', disciplineId: 'biosseguranca-radioprotecao' },
  'br-radioprotecao': { type: 'lab', labId: 'radiation' },

  'he-odontogenese': { type: 'mechanistic', disciplineId: 'histologia-embriologia' },
  'he-esmalte-dentina': { type: 'rebuild', disciplineId: 'histologia-embriologia' },
  'he-polpa-periodonto': { type: 'mechanistic', disciplineId: 'histologia-embriologia' },

  'fo-saliva': { type: 'rebuild', disciplineId: 'fisiologia-oral' },
  'fo-dor-dentinaria': { type: 'minicase', caseId: 'dor-frio' },
  'fo-mastigacao': { type: 'rebuild', disciplineId: 'fisiologia-oral' },

  'bf-desmineralizacao': { type: 'lab', labId: 'stephan' },
  'bf-mecanismos-fluor': { type: 'lab', labId: 'stephan' },
  'bf-fluorose-seguranca': { type: 'rebuild', disciplineId: 'bioquimica-fluor' },

  'mi-biofilme': { type: 'lab', labId: 'biofilm-chain' },
  'mi-ecologia-carie': { type: 'lab', labId: 'biofilm-chain' },
  'mi-imunologia-periodonto': { type: 'mechanistic', disciplineId: 'microbiologia-imunologia' },

  'ca-doenca-lesao': { type: 'lab', labId: 'stephan' },
  'ca-icdas': { type: 'minicase', caseId: 'lesao-esmalte' },
  'ca-nao-restaurador': { type: 'rebuild', disciplineId: 'cariologia' },

  'pg-inflamacao': { type: 'mechanistic', disciplineId: 'patologia-geral-oral' },
  'pg-reparo': { type: 'rebuild', disciplineId: 'patologia-geral-oral' },
  'pg-lesoes-potencialmente-malignas': { type: 'minicase', caseId: 'macula-branca' },

  'fa-anestesicos': { type: 'lab', labId: 'anesthetic' },
  'fa-analgesia': { type: 'minicase', caseId: 'anestesia-falhou' },
  'fa-antibioticos': { type: 'rebuild', disciplineId: 'farmacologia' },

  'md-adesao': { type: 'mechanistic', disciplineId: 'materiais-dentarios' },
  'md-resina-composta': { type: 'rebuild', disciplineId: 'materiais-dentarios' },
  'md-ionomero-bioativos': { type: 'minicase', caseId: 'ionomero-pediatria' },
};
