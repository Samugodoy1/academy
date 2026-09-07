import type { StudyKey } from '../../../utils/studyTopics';
import { countLessons } from '../engine';
import type { Exercise, ExerciseSeed, GameUnit } from '../types';
import { ANESTESIA_EXERCISES } from './anestesia';
import { CIRURGIA_EXERCISES } from './cirurgia';
import { DENTISTICA_EXERCISES } from './dentistica';
import { ENDODONTIA_EXERCISES } from './endodontia';
import { EXAME_CLINICO_EXERCISES } from './exameClinico';
import { ISOLAMENTO_EXERCISES } from './isolamento';
import { ODONTOPEDIATRIA_EXERCISES } from './odontopediatria';
import { PERIODONTIA_EXERCISES } from './periodontia';
import { PREVENTIVA_EXERCISES } from './preventiva';
import { PROTESE_EXERCISES } from './protese';
import { RADIOLOGIA_EXERCISES } from './radiologia';

const stamp = (topic: StudyKey, seeds: ExerciseSeed[]): Exercise[] =>
  seeds.map(seed => ({ ...seed, topic }) as Exercise);

interface UnitSeed {
  topic: StudyKey;
  title: string;
  tagline: string;
  exercises: ExerciseSeed[];
}

/** Trail order: from the fundamentals to the procedures that come later in the course. */
const UNIT_SEEDS: UnitSeed[] = [
  {
    topic: 'exame-clinico',
    title: 'Exame clínico',
    tagline: 'Ouvir, examinar e transformar achado em plano.',
    exercises: EXAME_CLINICO_EXERCISES,
  },
  {
    topic: 'radiologia',
    title: 'Radiologia',
    tagline: 'Pedir a tomada certa e ler sem pular etapa.',
    exercises: RADIOLOGIA_EXERCISES,
  },
  {
    topic: 'anestesia',
    title: 'Anestesia',
    tagline: 'Dose, técnica e o que fazer quando falha.',
    exercises: ANESTESIA_EXERCISES,
  },
  {
    topic: 'isolamento',
    title: 'Isolamento',
    tagline: 'Campo seco, grampo estável e paciente seguro.',
    exercises: ISOLAMENTO_EXERCISES,
  },
  {
    topic: 'preventiva',
    title: 'Preventiva',
    tagline: 'Risco de cárie, flúor e mudança de hábito.',
    exercises: PREVENTIVA_EXERCISES,
  },
  {
    topic: 'periodontia',
    title: 'Periodontia',
    tagline: 'Sondar, diagnosticar e manter o resultado.',
    exercises: PERIODONTIA_EXERCISES,
  },
  {
    topic: 'dentistica',
    title: 'Dentística',
    tagline: 'Adesão previsível, contato e oclusão.',
    exercises: DENTISTICA_EXERCISES,
  },
  {
    topic: 'endodontia',
    title: 'Endodontia',
    tagline: 'Do diagnóstico da dor ao preparo do canal.',
    exercises: ENDODONTIA_EXERCISES,
  },
  {
    topic: 'cirurgia',
    title: 'Cirurgia',
    tagline: 'Planejar, luxar com técnica e dar alta segura.',
    exercises: CIRURGIA_EXERCISES,
  },
  {
    topic: 'protese',
    title: 'Prótese',
    tagline: 'Preparo, moldagem e provisório que funciona.',
    exercises: PROTESE_EXERCISES,
  },
  {
    topic: 'odontopediatria',
    title: 'Odontopediatria',
    tagline: 'Manejo, prevenção e conduta conservadora.',
    exercises: ODONTOPEDIATRIA_EXERCISES,
  },
];

export const GAME_UNITS: GameUnit[] = UNIT_SEEDS.map(seed => {
  const exercises = stamp(seed.topic, seed.exercises);
  return {
    topic: seed.topic,
    title: seed.title,
    tagline: seed.tagline,
    lessons: countLessons(exercises.length),
    exercises,
  };
});

export const ALL_EXERCISES: Exercise[] = GAME_UNITS.flatMap(unit => unit.exercises);

export const getUnit = (topic: StudyKey): GameUnit | undefined =>
  GAME_UNITS.find(unit => unit.topic === topic);

export const TOTAL_GAME_EXERCISES = ALL_EXERCISES.length;
