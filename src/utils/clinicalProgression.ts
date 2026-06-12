import { mapProcedureToTopic, StudyKey } from './studyTopics';

export type ClinicalSkill =
  | 'restauracao'
  | 'raspagem'
  | 'exodontia'
  | 'endodontia'
  | 'profilaxia'
  | 'clareamento'
  | 'isolamento'
  | 'anestesia'
  | 'consulta'
  | 'protese'
  | 'cirurgia';

export interface SkillCount {
  skill: ClinicalSkill;
  label: string;
  count: number;
}

export interface ClinicalGap {
  id: string;
  message: string;
  studyTopic?: StudyKey;
  priority: number;
}

export interface NextStepSuggestion {
  label: string;
  reason: string;
  studyTopic?: StudyKey;
}

const SKILL_META: Record<ClinicalSkill, { label: string; patterns: RegExp[] }> = {
  restauracao: {
    label: 'restaurações',
    patterns: [/restaura/i, /resina/i, /classe\s*(i{1,3}|1|2|3)/i, /obtura/i, /dentistic/i],
  },
  raspagem: {
    label: 'raspagens',
    patterns: [/raspag/i, /scaling/i, /destart/i],
  },
  exodontia: {
    label: 'exodontias',
    patterns: [/exodont/i, /extra/i, /siso/i, /remo[cç][aã]o/i],
  },
  endodontia: {
    label: 'endodontias',
    patterns: [/endodont/i, /canal/i, /pulpar/i],
  },
  profilaxia: {
    label: 'profilaxias',
    patterns: [/profilax/i, /limpeza/i, /polimento coronal/i],
  },
  clareamento: {
    label: 'clareamentos',
    patterns: [/clareament/i, /whitening/i],
  },
  isolamento: {
    label: 'casos com isolamento',
    patterns: [/isolamento/i, /dique de borracha/i, /l[eê]n[cç]ol/i, /grampo/i],
  },
  anestesia: {
    label: 'anestesias',
    patterns: [/anestes/i, /bloqueio/i, /infiltrativ/i],
  },
  consulta: {
    label: 'consultas',
    patterns: [/consulta/i, /avalia[cç][aã]o/i, /exame cl[ií]nico/i, /primeira consulta/i],
  },
  protese: {
    label: 'próteses',
    patterns: [/pr[oó]tese/i, /coroa/i, /moldagem/i, /provisor/i],
  },
  cirurgia: {
    label: 'cirurgias',
    patterns: [/cirurg/i, /implant/i, /enxert/i, /biópsia/i],
  },
};

const DISPLAY_ORDER: ClinicalSkill[] = [
  'restauracao',
  'raspagem',
  'exodontia',
  'endodontia',
  'profilaxia',
  'clareamento',
  'isolamento',
  'anestesia',
  'consulta',
  'protese',
  'cirurgia',
];

const normalizeText = (value: unknown): string => {
  if (!value) return '';
  return String(value).trim();
};

const classifyProcedure = (text: string): ClinicalSkill | null => {
  const normalized = text.toLowerCase();
  for (const skill of DISPLAY_ORDER) {
    if (SKILL_META[skill].patterns.some(pattern => pattern.test(normalized))) {
      return skill;
    }
  }
  return null;
};

const collectProcedureTexts = (patients: any[]): string[] => {
  const texts: string[] = [];

  for (const patient of patients) {
    const evolutions = patient?.evolution || patient?.clinicalEvolution || [];
    if (Array.isArray(evolutions)) {
      for (const item of evolutions) {
        const parts = [item?.procedure, item?.procedure_performed, item?.notes].map(normalizeText).filter(Boolean);
        texts.push(...parts);
      }
    }

    const treatmentPlan = patient?.treatmentPlan || patient?.treatment_plan || [];
    if (Array.isArray(treatmentPlan)) {
      for (const item of treatmentPlan) {
        if (String(item?.status || '').toUpperCase() === 'REALIZADO') {
          const proc = normalizeText(item?.procedure);
          if (proc) texts.push(proc);
        }
      }
    }
  }

  return texts;
};

/** Restaurações já incluem isolamento absoluto na prática clínica. */
const getEffectiveIsolamentoCount = (countMap: Map<ClinicalSkill, number>): number => {
  const explicit = countMap.get('isolamento') || 0;
  const fromRestorations = countMap.get('restauracao') || 0;
  return Math.max(explicit, fromRestorations);
};

export const countClinicalSkills = (patients: any[]): SkillCount[] => {
  const counts = new Map<ClinicalSkill, number>();

  for (const text of collectProcedureTexts(patients)) {
    const skill = classifyProcedure(text);
    if (!skill) continue;
    counts.set(skill, (counts.get(skill) || 0) + 1);
  }

  const effectiveIsolamento = getEffectiveIsolamentoCount(counts);
  if (effectiveIsolamento > 0) {
    counts.set('isolamento', effectiveIsolamento);
  }

  return DISPLAY_ORDER
    .filter(skill => (counts.get(skill) || 0) > 0)
    .map(skill => ({
      skill,
      label: SKILL_META[skill].label,
      count: counts.get(skill) || 0,
    }));
};

export const getTotalClinicalCases = (patients: any[]): number => {
  return collectProcedureTexts(patients).length;
};

export const getDaysSinceLastEvolution = (patients: any[], now = new Date()): number | null => {
  let latest: Date | null = null;

  for (const patient of patients) {
    const evolutions = patient?.evolution || patient?.clinicalEvolution || [];
    if (!Array.isArray(evolutions)) continue;

    for (const item of evolutions) {
      const raw = item?.date || item?.created_at;
      if (!raw) continue;
      const parsed = new Date(raw);
      if (Number.isNaN(parsed.getTime())) continue;
      if (!latest || parsed > latest) latest = parsed;
    }
  }

  if (!latest) return null;
  return Math.floor((now.getTime() - latest.getTime()) / 86400000);
};

export const getLastPerformedSkill = (patients: any[]): ClinicalSkill | null => {
  let latest: { date: Date; skill: ClinicalSkill } | null = null;

  for (const patient of patients) {
    const evolutions = patient?.evolution || patient?.clinicalEvolution || [];
    if (!Array.isArray(evolutions)) continue;

    for (const item of evolutions) {
      const raw = item?.date || item?.created_at;
      const text = [item?.procedure, item?.procedure_performed, item?.notes].map(normalizeText).filter(Boolean).join(' ');
      const skill = classifyProcedure(text);
      if (!skill || !raw) continue;

      const parsed = new Date(raw);
      if (Number.isNaN(parsed.getTime())) continue;
      if (!latest || parsed > latest.date) {
        latest = { date: parsed, skill };
      }
    }
  }

  return latest?.skill || null;
};

export const suggestNextClinicalStep = (skillCounts: SkillCount[]): NextStepSuggestion | null => {
  const countMap = new Map(skillCounts.map(item => [item.skill, item.count]));
  const restauracoes = countMap.get('restauracao') || 0;
  const raspagens = countMap.get('raspagem') || 0;
  const exodontias = countMap.get('exodontia') || 0;
  const endodontias = countMap.get('endodontia') || 0;
  const isolamentos = getEffectiveIsolamentoCount(countMap);
  const cirurgias = countMap.get('cirurgia') || 0;
  const total = skillCounts.reduce((sum, item) => sum + item.count, 0);

  if (total === 0) {
    return {
      label: 'Primeira consulta clínica',
      reason: 'Comece registrando um caso e sua evolução.',
      studyTopic: 'exame-clinico',
    };
  }

  if (restauracoes >= 3 && isolamentos === 0) {
    return {
      label: 'Praticar isolamento absoluto',
      reason: 'Você já tem base restauradora. Vale consolidar o isolamento.',
      studyTopic: 'isolamento',
    };
  }

  if (restauracoes >= 5 && endodontias === 0) {
    return {
      label: 'Primeira endodontia',
      reason: 'Seu histórico restaurador indica que pode ser hora de avançar.',
      studyTopic: 'endodontia',
    };
  }

  if (restauracoes >= 4 && exodontias === 0 && cirurgias === 0) {
    return {
      label: 'Primeira exodontia',
      reason: 'Boa base em dentística. Cirurgia básica pode ampliar seu repertório.',
      studyTopic: 'cirurgia',
    };
  }

  if (restauracoes >= 6) {
    return {
      label: 'Aprofundar acabamento e polimento',
      reason: 'Refinar detalhes faz diferença na qualidade clínica.',
      studyTopic: 'dentistica',
    };
  }

  if (raspagens >= 3 && restauracoes < 3) {
    return {
      label: 'Primeira restauração',
      reason: 'Você já tem experiência periodontal. Vale avançar em dentística.',
      studyTopic: 'dentistica',
    };
  }

  if (restauracoes > 0 && restauracoes < 3) {
    return {
      label: 'Consolidar restaurações',
      reason: 'Repetição com registro ajuda a ganhar segurança.',
      studyTopic: 'dentistica',
    };
  }

  if (raspagens === 0 && total >= 2) {
    return {
      label: 'Primeira raspagem',
      reason: 'Periodontia é base para muitos atendimentos.',
      studyTopic: 'periodontia',
    };
  }

  return {
    label: 'Registrar próximo caso clínico',
    reason: 'Cada evolução registrada ajuda o sistema a entender seu momento.',
  };
};

export const detectClinicalGaps = (skillCounts: SkillCount[]): ClinicalGap[] => {
  const countMap = new Map(skillCounts.map(item => [item.skill, item.count]));
  const gaps: ClinicalGap[] = [];
  const restauracoes = countMap.get('restauracao') || 0;
  const exodontias = (countMap.get('exodontia') || 0) + (countMap.get('cirurgia') || 0);
  const isolamentos = getEffectiveIsolamentoCount(countMap);
  const endodontias = countMap.get('endodontia') || 0;
  const total = skillCounts.reduce((sum, item) => sum + item.count, 0);

  if (total >= 3 && isolamentos === 0) {
    gaps.push({
      id: 'no-isolamento',
      message: 'Você ainda não registrou nenhum caso com isolamento absoluto.',
      studyTopic: 'isolamento',
      priority: 80,
    });
  }

  if (restauracoes >= 5 && exodontias <= 1) {
    gaps.push({
      id: 'restorative-vs-surgical',
      message: 'Você já realizou vários atendimentos restauradores, mas poucos casos cirúrgicos.',
      studyTopic: 'cirurgia',
      priority: 70,
    });
  }

  if (restauracoes >= 4 && endodontias === 0) {
    gaps.push({
      id: 'no-endo',
      message: 'Endodontia ainda não aparece no seu histórico clínico.',
      studyTopic: 'endodontia',
      priority: 60,
    });
  }

  if (total >= 4 && (countMap.get('anestesia') || 0) === 0) {
    gaps.push({
      id: 'no-anestesia',
      message: 'Faz sentido revisar técnica anestésica nas próximas semanas.',
      studyTopic: 'anestesia',
      priority: 50,
    });
  }

  if (total >= 6) {
    gaps.push({
      id: 'general-skill',
      message: 'Existe uma habilidade que pode valer sua atenção nas próximas semanas.',
      priority: 30,
    });
  }

  return gaps.sort((a, b) => b.priority - a.priority);
};

export const getTopSkillHighlights = (skillCounts: SkillCount[], limit = 3): SkillCount[] => {
  return [...skillCounts]
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

export const mapSkillToStudyTopic = (skill: ClinicalSkill): StudyKey | undefined => {
  const map: Partial<Record<ClinicalSkill, StudyKey>> = {
    restauracao: 'dentistica',
    raspagem: 'periodontia',
    exodontia: 'cirurgia',
    endodontia: 'endodontia',
    profilaxia: 'preventiva',
    clareamento: 'dentistica',
    isolamento: 'isolamento',
    anestesia: 'anestesia',
    consulta: 'exame-clinico',
    protese: 'protese',
    cirurgia: 'cirurgia',
  };
  return map[skill];
};

export const classifyProcedureText = classifyProcedure;
export const mapProcedureTextToTopic = mapProcedureToTopic;
