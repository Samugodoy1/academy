import type { StudyKey } from '../../../utils/studyTopics';
import { hashSeed } from '../engine';

export type CharacterId = 'val' | 'kaio' | 'nina' | 'teo' | 'zaira' | 'duda';

export type Mood = 'idle' | 'happy' | 'cheer' | 'sad' | 'wow';

export interface CharacterLines {
  /** Said when the exercise has no clinical case of its own. */
  intro: string[];
  right: string[];
  wrong: string[];
  /** Results screen, lesson without a single miss. */
  perfect: string;
  /** Results screen, everything else. */
  done: string;
  /** Shown when the hearts run out. */
  fail: string;
  /** One line under the unit header on the trail. */
  trail: string;
}

export interface Character {
  id: CharacterId;
  name: string;
  role: string;
  /** Outfit colour, also used on chips and bubbles. */
  accent: string;
  wash: string;
  lines: CharacterLines;
}

export const CAST: Record<CharacterId, Character> = {
  val: {
    id: 'val',
    name: 'Dra. Val',
    role: 'professora orientadora',
    accent: '#0a84ff',
    wash: '#eaf4ff',
    lines: {
      intro: [
        'Raciocínio primeiro, resposta depois.',
        'Se cair na prova prática, você responde igual?',
        'Essa é das que separam a turma.',
      ],
      right: ['Correto.', 'É isso. Anotado.', 'Boa. Segue.'],
      wrong: [
        'Errar aqui é melhor que errar na cadeira.',
        'Volta no raciocínio comigo.',
        'Essa eu vou cobrar de novo.',
      ],
      perfect: 'Zero erro. Pode assinar embaixo.',
      done: 'Concluído. Semana que vem eu cobro.',
      fail: 'Sem vidas. Descansa e volta — eu espero.',
      trail: 'Aqui eu cobro conduta, não decoreba.',
    },
  },
  kaio: {
    id: 'kaio',
    name: 'Kaio',
    role: 'residente',
    accent: '#00a37a',
    wash: '#e8f8f3',
    lines: {
      intro: [
        'Tem um macete nessa. Olha o detalhe.',
        'Princípio primeiro; o resto é consequência.',
        'Essa eu errei no primeiro ano.',
      ],
      right: ['Exato.', 'É por aí.', 'Perfeito.'],
      wrong: ['Quase. Olha o detalhe.', 'Erro clássico — guarda esse.', 'Repete o raciocínio.'],
      perfect: 'Limpo do começo ao fim. Isso é técnica.',
      done: 'Boa sessão. O resto vem com repetição.',
      fail: 'Zerou as vidas. Amanhã sai melhor.',
      trail: 'Comigo é passo a passo, sem pular etapa.',
    },
  },
  nina: {
    id: 'nina',
    name: 'Nina',
    role: 'monitora da disciplina',
    accent: '#ff375f',
    wash: '#ffedf1',
    lines: {
      intro: [
        'Vou te dar a dica: pensa no porquê.',
        'Essa cai direto na avaliação.',
        'Se travar, volta no básico.',
      ],
      right: ['Isso mesmo!', 'Você pegou o conceito.', 'Show!'],
      wrong: ['Calma, vamos junto.', 'Quase lá — falta um detalhe.', 'Anota essa no caderno.'],
      perfect: 'Impecável. Monitora aprovada.',
      done: 'Boa! Já melhorou desde a última.',
      fail: 'Fim das vidas. Bora revisar sem pressão?',
      trail: 'Eu explico devagar quantas vezes precisar.',
    },
  },
  teo: {
    id: 'teo',
    name: 'Téo',
    role: 'colega de dupla',
    accent: '#ff9500',
    wash: '#fff3e0',
    lines: {
      intro: [
        'Se você errar, a gente erra junto.',
        'Eu chutei essa ontem. Não faz igual.',
        'Vai que é sua.',
      ],
      right: ['Isso! Anotei aqui.', 'Você é bom nisso.', 'Salvou a dupla.'],
      wrong: ['Eu também errei essa.', 'Ufa, não fui só eu.', 'Bora rever antes do box.'],
      perfect: 'Sem erro nenhum? Me ensina.',
      done: 'Boa, dupla. Já é mais que ontem.',
      fail: 'Acabou a vida. Pausa pro café?',
      trail: 'Aqui eu já apanhei bastante. Vem comigo.',
    },
  },
  zaira: {
    id: 'zaira',
    name: 'Dona Zaíra',
    role: 'auxiliar da clínica',
    accent: '#8e5cf7',
    wash: '#f2ecff',
    lines: {
      intro: [
        'Na clínica, isso aqui é o que mais aparece.',
        'Teoria é linda, mas o box é assim.',
        'Já vi essa cena umas mil vezes.',
      ],
      right: ['Esse aí sabe das coisas.', 'Boa, doutor(a).', 'Tá com jeito da coisa.'],
      wrong: ['Calma que a gente conserta.', 'Todo mundo tropeça nessa.', 'Erra aqui, não na cadeira.'],
      perfect: 'Nenhum errinho. Vou contar pra clínica inteira.',
      done: 'Terminou bonito. Agora arruma a bancada.',
      fail: 'Sem vida nenhuma. Senta, respira, toma água.',
      trail: 'Eu preparo a bandeja; você prepara o raciocínio.',
    },
  },
  duda: {
    id: 'duda',
    name: 'Duda',
    role: 'estagiária da odontopediatria',
    accent: '#34c759',
    wash: '#e9fbee',
    lines: {
      intro: [
        'Com criança, a conduta muda. Repara.',
        'Pensa no que você diria pra mãe depois.',
        'Aqui manejo vale tanto quanto técnica.',
      ],
      right: ['Isso! A criança agradece.', 'Certinho.', 'Boa escolha.'],
      wrong: ['Quase. Pensa no manejo.', 'Essa confunde todo mundo.', 'Vamos de novo, com calma.'],
      perfect: 'Nenhum erro. Turma da tarde vai gostar.',
      done: 'Fechou. Paciência também se treina.',
      fail: 'Vidas no fim. Volta depois do intervalo.',
      trail: 'Aqui o paciente tem 6 anos e opinião própria.',
    },
  },
};

export const CAST_LIST: Character[] = [
  CAST.val,
  CAST.kaio,
  CAST.nina,
  CAST.teo,
  CAST.zaira,
  CAST.duda,
];

/** Who hosts each unit of the trail. */
export const HOST_BY_TOPIC: Record<StudyKey, CharacterId> = {
  'exame-clinico': 'val',
  radiologia: 'kaio',
  anestesia: 'nina',
  isolamento: 'teo',
  preventiva: 'nina',
  periodontia: 'zaira',
  dentistica: 'teo',
  endodontia: 'kaio',
  cirurgia: 'val',
  protese: 'zaira',
  odontopediatria: 'duda',
};

/** Quem fala pelo jogo fora de um tema: revisão, relâmpago, ofensiva, atalho. */
export const GUIDE_ID: CharacterId = 'nina';

export const guide = (): Character => CAST[GUIDE_ID];

export const hostFor = (topic: StudyKey | null | undefined): Character =>
  (topic ? CAST[HOST_BY_TOPIC[topic]] : undefined) ?? CAST[GUIDE_ID];

/**
 * Same seed, same line: the character does not change what it said when the
 * component re-renders mid answer.
 */
export const pickLine = (lines: string[], seed: string): string =>
  lines.length === 0 ? '' : lines[hashSeed(seed) % lines.length];
