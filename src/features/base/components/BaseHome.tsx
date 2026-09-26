import React from 'react';
import { ChevronRight, Lock } from '../../../icons';
import type { BaseDiscipline } from '../types';
import { BASE_DISCIPLINES, disciplinesByPeriod, totalMinutes } from '../content';
import { BASE_STUDENT_PERKS, countLessons, countUnlockedLessons, type BasePlan } from '../plan';
import { countAllDone, countDone, type BaseContinueSuggestion, type BaseProgress } from '../progress';
import { BaseSection, ProgressBar } from './ui';

interface BaseHomeProps {
  plan: BasePlan;
  progress: BaseProgress;
  suggestion: BaseContinueSuggestion | null;
  /** Semester the student is in, when the profile says so. Highlights that shelf. */
  currentSemester?: number | null;
  onOpenDiscipline: (discipline: BaseDiscipline) => void;
  onOpenLesson: (discipline: BaseDiscipline, lessonIndex: number) => void;
  onOpenCola: () => void;
  onUpgrade?: () => void;
}

const SUGGESTION_KICKER: Record<BaseContinueSuggestion['reason'], string> = {
  resume: 'Continuar de onde parou',
  next: 'Próximo resumo',
  start: 'Comece por aqui',
};

export function BaseHome({
  plan,
  progress,
  suggestion,
  currentSemester,
  onOpenDiscipline,
  onOpenLesson,
  onOpenCola,
  onUpgrade,
}: BaseHomeProps) {
  const total = countLessons(BASE_DISCIPLINES);
  const done = countAllDone(progress, BASE_DISCIPLINES);
  const unlocked = countUnlockedLessons(plan, BASE_DISCIPLINES);
  const groups = disciplinesByPeriod();

  return (
    <div className="page-shell space-y-10">
      <header>
        <p className="text-[13px] tracking-[-0.011em] text-[var(--neo-gray)]">Estudos · Ciclo básico</p>
        <h1 className="mt-2 max-w-[18ch] text-[28px] font-semibold leading-[1.05] tracking-[-0.025em] text-[var(--neo-ink)] sm:text-[34px]">
          {done === 0 ? 'A base que sustenta a clínica.' : `${done} de ${total} resumos lidos.`}
        </h1>
        <p className="mt-3 max-w-[38ch] text-[17px] leading-snug tracking-[-0.011em] text-[var(--neo-gray)]">
          Resumos e mapas mentais do 1º ao 4º período. Cada afirmação com o artigo que a sustenta.
        </p>
      </header>

      <div className="flex flex-col gap-10 desktop:grid desktop:grid-cols-12 desktop:items-start desktop:gap-x-12">
        <div className="space-y-10 desktop:col-span-7">
          {suggestion ? (
            <button
              type="button"
              onClick={() => onOpenLesson(suggestion.discipline, suggestion.lessonIndex)}
              className="patient-hero w-full px-6 py-6 text-left sm:px-7 sm:py-7"
            >
              <p className="text-[13px] tracking-[-0.011em] text-white/75">
                {SUGGESTION_KICKER[suggestion.reason]}
              </p>
              <p className="mt-3 text-[15px] tracking-[-0.011em] text-white/80">{suggestion.discipline.title}</p>
              <p className="mt-1 text-[32px] font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-[36px]">
                {suggestion.lesson.title}
              </p>
              <p className="mt-2 max-w-[36ch] text-[17px] leading-snug text-white/80">{suggestion.lesson.summary}</p>
              <span className="hero-action">Ler · {suggestion.lesson.minutes} min</span>
            </button>
          ) : (
            <div className="ah-feature px-6 py-6">
              <p className="text-[13px] text-[var(--neo-gray)]">Estante</p>
              <p className="mt-1 text-[17px] font-semibold tracking-[-0.016em] text-[var(--neo-ink)]">
                Você leu tudo o que estava aberto.
              </p>
              <p className="mt-2 text-[15px] leading-snug text-[var(--neo-gray)]">
                {plan === 'free'
                  ? 'O Student abre o restante da estante — e a Cola sem limite diário.'
                  : 'Volte aos mapas e reconstrua um ramo de memória: é assim que fixa.'}
              </p>
              {plan === 'free' && onUpgrade && (
                <button type="button" onClick={onUpgrade} className="neo-link mt-3 text-[15px]">
                  Conhecer o Student ›
                </button>
              )}
            </div>
          )}

          <div className="ah-card px-5 py-4">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-[15px] font-semibold tracking-[-0.011em] text-[var(--neo-ink)]">
                {done} de {total} resumos
              </p>
              <p className="text-[13px] text-[var(--neo-gray)]">
                {plan === 'free' ? `${unlocked} abertos no Free` : `${BASE_DISCIPLINES.length} disciplinas`}
              </p>
            </div>
            <ProgressBar value={total ? done / total : 0} className="mt-3" />
          </div>

          {groups.map(group => (
            <BaseSection
              key={group.period}
              kicker={group.label}
              action={
                currentSemester === group.period ? (
                  <span className="text-[13px] text-[var(--neo-gray)]">Seu período</span>
                ) : undefined
              }
            >
              <div className="space-y-3">
                {group.disciplines.map(discipline => {
                  const read = countDone(progress, discipline);
                  const minutes = totalMinutes(discipline);
                  const lessons = discipline.lessons.length;
                  const progressLabel = read === lessons
                    ? 'Lido'
                    : read > 0
                      ? `${read} de ${lessons}`
                      : `${lessons} resumos`;
                  return (
                    <button
                      key={discipline.id}
                      type="button"
                      onClick={() => onOpenDiscipline(discipline)}
                      className="ah-card flex w-full items-center gap-4 px-5 py-4 text-left ios-press-gentle"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block text-[17px] font-semibold leading-[1.2] tracking-[-0.016em] text-[var(--neo-ink)]">
                          {discipline.title}
                        </span>
                        <span className="mt-1 block text-[14px] leading-snug text-[var(--neo-gray)]">
                          {discipline.tagline}
                        </span>
                        <span className="mt-3 block text-[13px] tabular-nums text-[var(--neo-gray)]">
                          {progressLabel} · {minutes} min
                        </span>
                      </span>
                      <ChevronRight size={16} className="shrink-0 text-[#C6C6C8]" />
                    </button>
                  );
                })}
              </div>
            </BaseSection>
          ))}
        </div>

        <aside className="space-y-10 desktop:col-span-5 desktop:sticky desktop:top-8">
          {plan === 'free' && (
            <div className="ah-card px-5 py-5">
              <p className="text-[13px] tracking-[-0.011em] text-[var(--neo-gray)]">Student</p>
              <p className="mt-2 text-[17px] font-semibold leading-[1.2] tracking-[-0.016em] text-[var(--neo-ink)]">
                A estante inteira, do 1º período à clínica.
              </p>
              <div className="mt-3 space-y-1.5">
                {BASE_STUDENT_PERKS.map(perk => (
                  <p key={perk} className="text-[15px] leading-snug text-[var(--neo-gray)]">
                    {perk}
                  </p>
                ))}
              </div>
              {onUpgrade && (
                <button type="button" onClick={onUpgrade} className="neo-link mt-4 text-[15px]">
                  Conhecer o Student ›
                </button>
              )}
              <p className="mt-3 flex items-center gap-1.5 text-[13px] text-[var(--neo-gray)]">
                <Lock size={11} /> No Free: o 1º resumo de cada disciplina e um mapa completo.
              </p>
            </div>
          )}

          <p className="px-1 text-[13px] leading-snug tracking-[-0.011em] text-[var(--neo-gray)]">
            Teste-se e volte depois de alguns dias. Grifar rende menos.
          </p>

          <button
            type="button"
            onClick={onOpenCola}
            className="ah-card w-full px-5 py-5 text-left ios-press-gentle"
          >
            <p className="text-[13px] text-[var(--neo-gray)]">Já está na clínica?</p>
            <p className="mt-1 text-[17px] font-semibold tracking-[-0.016em] text-[var(--neo-ink)]">
              A Cola continua daqui.
            </p>
            <p className="mt-1 text-[14px] leading-snug text-[var(--neo-gray)]">
              Revisão de 15 minutos antes de sentar na cadeira, por procedimento.
            </p>
            <p className="neo-link mt-3 text-[15px]">Abrir a Cola ›</p>
          </button>
        </aside>
      </div>
    </div>
  );
}
