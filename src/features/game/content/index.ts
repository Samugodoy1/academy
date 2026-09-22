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
import { ANAT_EXERCISES } from './anatomia-aplicada';
import { FARM_EXERCISES } from './farmacologia';
import { PAT_EXERCISES } from './patologia-oral';
import { URG_EXERCISES } from './urgencias-medicas';
import { BIO_EXERCISES } from './biosseguranca';
import { MAT_EXERCISES } from './materiais-dentarios';
import { OCL_EXERCISES } from './oclusao';
import { IMPL_EXERCISES } from './implantodontia';
import { ORTO_EXERCISES } from './ortodontia';
import { GERI_EXERCISES } from './odontogeriatria';
import { REFERENCES_BY_TOPIC } from './references';
import { expandExerciseVariants } from './variants';

const stamp = (topic: StudyKey, seeds: ExerciseSeed[]): Exercise[] =>
  seeds.flatMap(seed =>
    expandExerciseVariants({
      ...seed,
      topic,
      conceptId: seed.id,
      references: REFERENCES_BY_TOPIC[topic],
    } as Exercise)
  );

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
  {
    topic: 'anatomia-aplicada',
    title: 'Anatomia aplicada',
    tagline: 'Reconhecer estruturas antes de tocar nelas.',
    exercises: ANAT_EXERCISES,
  },
  {
    topic: 'farmacologia',
    title: 'Farmacologia',
    tagline: 'Escolher e orientar medicamentos com critério.',
    exercises: FARM_EXERCISES,
  },
  {
    topic: 'patologia-oral',
    title: 'Patologia oral',
    tagline: 'Reconhecer sinais que não podem passar batidos.',
    exercises: PAT_EXERCISES,
  },
  {
    topic: 'urgencias-medicas',
    title: 'Urgências médicas',
    tagline: 'Reconhecer o quadro e agir sem improviso.',
    exercises: URG_EXERCISES,
  },
  {
    topic: 'biosseguranca',
    title: 'Biossegurança',
    tagline: 'Controlar risco antes, durante e depois do atendimento.',
    exercises: BIO_EXERCISES,
  },
  {
    topic: 'materiais-dentarios',
    title: 'Materiais dentários',
    tagline: 'Entender o material antes de pedir desempenho dele.',
    exercises: MAT_EXERCISES,
  },
  {
    topic: 'oclusao',
    title: 'Oclusão',
    tagline: 'Ler contatos, movimentos e função.',
    exercises: OCL_EXERCISES,
  },
  {
    topic: 'implantodontia',
    title: 'Implantodontia',
    tagline: 'Planejar o implante antes de pensar na broca.',
    exercises: IMPL_EXERCISES,
  },
  {
    topic: 'ortodontia',
    title: 'Ortodontia',
    tagline: 'Entender crescimento, relação e movimento dentário.',
    exercises: ORTO_EXERCISES,
  },
  {
    topic: 'odontogeriatria',
    title: 'Odontogeriatria',
    tagline: 'Adaptar o cuidado à pessoa, não só ao dente.',
    exercises: GERI_EXERCISES,
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
