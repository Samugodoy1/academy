import type { BaseDiscipline, BasePeriod } from '../types';
import { anatomiaDental } from './anatomia-dental';
import { anatomiaCabecaPescoco } from './anatomia-cabeca-pescoco';
import { biossegurancaRadioprotecao } from './biosseguranca-radioprotecao';
import { histologiaEmbriologia } from './histologia-embriologia';
import { fisiologiaOral } from './fisiologia-oral';
import { bioquimicaFluor } from './bioquimica-fluor';
import { microbiologiaImunologia } from './microbiologia-imunologia';
import { cariologia } from './cariologia';
import { patologiaGeralOral } from './patologia-geral-oral';
import { farmacologia } from './farmacologia';
import { materiaisDentarios } from './materiais-dentarios';

/**
 * Catalogue order is the suggested study order: roughly the sequence in which
 * Brazilian curricula teach the basic cycle. The first discipline is the one
 * whose mind map stays open on Free.
 */
export const BASE_DISCIPLINES: BaseDiscipline[] = [
  anatomiaDental,
  anatomiaCabecaPescoco,
  biossegurancaRadioprotecao,
  histologiaEmbriologia,
  fisiologiaOral,
  bioquimicaFluor,
  microbiologiaImunologia,
  cariologia,
  patologiaGeralOral,
  farmacologia,
  materiaisDentarios,
];

export const PERIOD_LABEL: Record<BasePeriod, string> = {
  1: '1º período',
  2: '2º período',
  3: '3º período',
  4: '4º período',
};

export function getDiscipline(id: string) {
  return BASE_DISCIPLINES.find(discipline => discipline.id === id) || null;
}

export function getDisciplineIndex(id: string) {
  return BASE_DISCIPLINES.findIndex(discipline => discipline.id === id);
}

export function disciplinesByPeriod(disciplines = BASE_DISCIPLINES) {
  const groups = new Map<BasePeriod, BaseDiscipline[]>();
  for (const discipline of disciplines) {
    const list = groups.get(discipline.period) || [];
    list.push(discipline);
    groups.set(discipline.period, list);
  }
  return ([1, 2, 3, 4] as BasePeriod[])
    .filter(period => groups.has(period))
    .map(period => ({ period, label: PERIOD_LABEL[period], disciplines: groups.get(period)! }));
}

export function totalMinutes(discipline: BaseDiscipline) {
  return discipline.lessons.reduce((sum, lesson) => sum + lesson.minutes, 0);
}

export { STUDY_METHOD_TIPS } from './method';
