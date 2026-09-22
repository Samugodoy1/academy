import type { Competency } from './types';
import type { SessionProgress } from './sessionProgress';
import { readReviewState, type ReviewState } from './review';

/** Habilidades do ciclo básico — desbloqueiam com sessão, lab, caso ou revisão. */
export const COMPETENCIES: Competency[] = [
  {
    id: 'fdi-orientacao',
    title: 'Orientação FDI',
    short: 'Quadrante, arcada e face sem hesitar.',
    requires: [{ kind: 'session', lessonId: 'ad-notacao', readiness: 'confident' }],
  },
  {
    id: 'oclusao-angle',
    title: 'Classes de Angle',
    short: 'Relaciona mordida com classe I–III.',
    requires: [{ kind: 'session', lessonId: 'ad-oclusao', readiness: 'review' }],
  },
  {
    id: 'stephan-curva',
    title: 'Curva de Stephan',
    short: 'Liga açúcar, pH e desmineralização.',
    requires: [{ kind: 'lab', labId: 'stephan' }],
  },
  {
    id: 'biofilme-cadeia',
    title: 'Cadeia do biofilme',
    short: 'Ordem lógica da placa à cárie.',
    requires: [{ kind: 'lab', labId: 'biofilm-chain' }],
  },
  {
    id: 'dor-hidrodinamica',
    title: 'Dor dentinária',
    short: 'Estímulo, fluido nos túbulos, alívio.',
    requires: [{ kind: 'case', caseId: 'dor-frio' }],
  },
  {
    id: 'icdas-leitura',
    title: 'ICDAS na prática',
    short: 'Mancha branca vs cavitação.',
    requires: [{ kind: 'case', caseId: 'lesao-esmalte' }],
  },
  {
    id: 'bloqueio-inferior',
    title: 'Bloqueio inferior',
    short: 'Forame, sinais e falha técnica.',
    requires: [
      { kind: 'lab', labId: 'alveolar-nerve' },
      { kind: 'case', caseId: 'anestesia-falhou' },
    ],
  },
  {
    id: 'anestesia-calculo',
    title: 'Dose de anestésico',
    short: 'Tubetes e teto mg/kg.',
    requires: [{ kind: 'lab', labId: 'anesthetic' }],
  },
  {
    id: 'erupcao-sequencia',
    title: 'Sequência de erupção',
    short: 'Ordem cronológica dos dentes.',
    requires: [{ kind: 'lab', labId: 'eruption' }],
  },
  {
    id: 'radioprotecao-alara',
    title: 'ALARA',
    short: 'Justifica filme e proteção.',
    requires: [{ kind: 'lab', labId: 'radiation' }],
  },
  {
    id: 'atm-clique',
    title: 'ATM · ruído articular',
    short: 'Diferencia ruído de dor.',
    requires: [{ kind: 'case', caseId: 'atm-clique' }],
  },
  {
    id: 'perfurocorte',
    title: 'Perfurocorte',
    short: 'Fluxo pós-exposição.',
    requires: [{ kind: 'case', caseId: 'perfurocorte' }],
  },
  {
    id: 'ionomero-ped',
    title: 'Ionomero em pediatria',
    short: 'Quando e por quê.',
    requires: [{ kind: 'case', caseId: 'ionomero-pediatria' }],
  },
  {
    id: 'macula-branca',
    title: 'Lesão branca',
    short: 'Remineralizar vs intervir.',
    requires: [{ kind: 'case', caseId: 'macula-branca' }],
  },
  {
    id: 'mapa-mecanico',
    title: 'Mapa mecânico',
    short: 'Liga causa e efeito na disciplina.',
    requires: [{ kind: 'session', lessonId: 'mi-biofilme', readiness: 'confident' }],
  },
  {
    id: 'revisao-7d',
    title: 'Ritmo de revisão',
    short: 'Três dias seguidos na fila.',
    requires: [{ kind: 'review', lessonId: 'ad-notacao', streak: 3 }],
  },
  {
    id: 'revisao-14d',
    title: 'Memória espaçada',
    short: 'Cartão com intervalo ≥ 14 dias.',
    requires: [{ kind: 'review', lessonId: 'bf-mecanismos-fluor', streak: 4 }],
  },
  {
    id: 'trigemeo-trajeto',
    title: 'Trigêmeo V3',
    short: 'Ramificações e forame.',
    requires: [{ kind: 'session', lessonId: 'acp-trigemeo', readiness: 'confident' }],
  },
  {
    id: 'camada-hibrida',
    title: 'Adesão dentinária',
    short: 'Condicionamento e híbrida.',
    requires: [{ kind: 'session', lessonId: 'md-adesao', readiness: 'review' }],
  },
  {
    id: 'gingivite-periodontite',
    title: 'Gengivite vs periodontite',
    short: 'Perda óssea como divisor.',
    requires: [{ kind: 'session', lessonId: 'mi-imunologia-periodonto', readiness: 'confident' }],
  },
];

export function isCompetencyUnlocked(
  competency: Competency,
  session: SessionProgress,
  review: ReviewState = readReviewState(),
): boolean {
  return competency.requires.every(req => {
    if (req.kind === 'session') {
      const rec = session.lessons[req.lessonId];
      if (!rec) return false;
      if (req.readiness === 'confident') return rec.readiness === 'confident';
      return true;
    }
    if (req.kind === 'lab') return Boolean(session.labsCompleted[req.labId]);
    if (req.kind === 'case') return Boolean(session.casesCompleted[req.caseId]);
    if (req.kind === 'review') {
      const card = review.cards[req.lessonId];
      return card ? card.streak >= req.streak : false;
    }
    return false;
  });
}

export function countUnlockedCompetencies(session: SessionProgress, review?: ReviewState) {
  const r = review ?? readReviewState();
  return COMPETENCIES.filter(c => isCompetencyUnlocked(c, session, r)).length;
}
