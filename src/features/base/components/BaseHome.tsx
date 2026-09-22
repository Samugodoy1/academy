import React from 'react';
import { ArrowUpRight, Check, Lock } from '../../../icons';
import type { BaseDiscipline } from '../types';
import { BASE_DISCIPLINES, disciplinesByPeriod, STUDY_METHOD_TIPS, totalMinutes } from '../content';
import { BASE_STUDENT_PERKS, countLessons, countUnlockedLessons, type BasePlan } from '../plan';
import { countAllDone, countDone, type BaseContinueSuggestion, type BaseProgress } from '../progress';
import { referenceHref, referenceShortCitation } from '../references';
import { unlockedDueCards, type ReviewState } from '../session/review';
import type { SessionProgress } from '../session/sessionProgress';
import { CompetenciesPanel } from './CompetenciesPanel';
import { BaseSection, GroupedList, ListRow, ProgressBar } from './ui';

interface BaseHomeProps {
  plan: BasePlan;
  progress: BaseProgress;
  review: ReviewState;
  sessionProgress: SessionProgress;
  suggestion: BaseContinueSuggestion | null;
  /** Semester the student is in, when the profile says so. Highlights that shelf. */
  currentSemester?: number | null;
  onOpenDiscipline: (discipline: BaseDiscipline) => void;
  onOpenLesson: (discipline: BaseDiscipline, lessonIndex: number) => void;
  onOpenReview: () => void;
  onOpenMix: () => void;
  onOpenCola: () => void;
  onUpgrade?: () => void;
}

const SUGGESTION_KICKER: Record<BaseContinueSuggestion['reason'], string> = {
  resume: 'Continuar a sessão',
  next: 'Próxima sessão',
  start: 'Comece por aqui',
};

export function BaseHome({
  plan,
  progress,
  review,
  sessionProgress,
  suggestion,
  currentSemester,
  onOpenDiscipline,
  onOpenLesson,
  onOpenReview,
  onOpenMix,
  onOpenCola,
  onUpgrade,
}: BaseHomeProps) {
  const total = countLessons(BASE_DISCIPLINES);
  const done = countAllDone(progress, BASE_DISCIPLINES);
  const unlocked = countUnlockedLessons(plan, BASE_DISCIPLINES);
  const groups = disciplinesByPeriod();
  const dueReview = unlockedDueCards(review, plan).length;

  return (
    <div className="page-shell space-y-10">
      <header>
        <p className="text-[13px] tracking-[-0.011em] text-[var(--neo-gray)]">Estudos · Ciclo básico</p>
        <h1 className="mt-2 max-w-[18ch] text-[28px] font-semibold leading-[1.05] tracking-[-0.025em] text-[var(--neo-ink)] sm:text-[34px]">
          {done === 0 ? 'Estude como vai cair na prova.' : `${done} de ${total} tópicos dominados.`}
        </h1>
        <p className="mt-3 max-w-[38ch] text-[17px] leading-snug tracking-[-0.011em] text-[var(--neo-gray)]">
          Sessão com chute, gesto ativo e revisão espaçada. O resumo fica como referência — com DOI.
        </p>
      </header>

      <div className="flex flex-col gap-10 desktop:grid desktop:grid-cols-12 desktop:items-start desktop:gap-x-12">
        <div className="space-y-10 desktop:col-span-7">
          {suggestion ? (
            <button
              type="button"
              onClick={() => onOpenLesson(suggestion.discipline, suggestion.lessonIndex)}
              className="w-full rounded-[28px] bg-[var(--neo)] px-6 py-6 text-left text-white ios-press-gentle"
            >
              <p className="text-[12px] font-normal uppercase tracking-[0.04em] text-white/80">
                {SUGGESTION_KICKER[suggestion.reason]}
              </p>
              <p className="mt-2 text-[15px] tracking-[-0.011em] text-white/85">{suggestion.discipline.title}</p>
              <p className="mt-1 text-[26px] font-semibold leading-[1.05] tracking-[-0.025em] sm:text-[32px]">
                {suggestion.lesson.title}
              </p>
              <p className="mt-3 text-[15px] leading-snug text-white/90">{suggestion.lesson.summary}</p>
              <p className="mt-4 flex items-center justify-between text-[15px] text-white/90">
                <span>{suggestion.lesson.minutes} min · sessão guiada</span>
                <span>Iniciar ›</span>
              </p>
            </button>
          ) : (
            <div className="rounded-[28px] bg-[#f5f5f7] px-6 py-6">
              <p className="text-[13px] text-[var(--neo-gray)]">Estante</p>
              <p className="mt-1 text-[22px] font-semibold tracking-[-0.025em] text-[var(--neo-ink)]">
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

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onOpenReview}
              className="rounded-[24px] bg-[#f5f5f7] px-5 py-4 text-left ios-press-gentle"
            >
              <p className="text-[15px] font-semibold text-[var(--neo-ink)]">Revisão</p>
              <p className="mt-1 text-[14px] text-[var(--neo-gray)]">
                {dueReview === 0 ? 'Fila vazia hoje' : `${dueReview} ${dueReview === 1 ? 'cartão' : 'cartões'} vencidos`}
              </p>
            </button>
            <button
              type="button"
              onClick={onOpenMix}
              className="rounded-[24px] bg-[#f5f5f7] px-5 py-4 text-left ios-press-gentle"
            >
              <p className="text-[15px] font-semibold text-[var(--neo-ink)]">Mistura</p>
              <p className="mt-1 text-[14px] text-[var(--neo-gray)]">Perguntas cruzando disciplinas</p>
            </button>
          </div>

          <CompetenciesPanel session={sessionProgress} review={review} />

          <div className="rounded-[24px] bg-[#f5f5f7] px-5 py-4">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-[15px] font-semibold tracking-[-0.011em] text-[var(--neo-ink)]">
                {done} de {total} tópicos
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
                  <span className="rounded-full bg-[var(--neo-wash)] px-2.5 py-0.5 text-[12px] font-medium text-[var(--neo)]">
                    O seu período
                  </span>
                ) : undefined
              }
            >
              <GroupedList>
                {group.disciplines.map(discipline => {
                  const read = countDone(progress, discipline);
                  const minutes = totalMinutes(discipline);
                  const lessons = discipline.lessons.length;
                  return (
                    <ListRow
                      key={discipline.id}
                      title={discipline.title}
                      meta={`${lessons} resumos · mapa mental · ${minutes} min · ${discipline.tagline}`}
                      done={read === lessons}
                      trailing={
                        read > 0 && read < lessons ? (
                          <span className="shrink-0 text-[13px] tabular-nums text-[var(--neo-gray)]">
                            {read}/{lessons}
                          </span>
                        ) : undefined
                      }
                      onClick={() => onOpenDiscipline(discipline)}
                    />
                  );
                })}
              </GroupedList>
            </BaseSection>
          ))}
        </div>

        <aside className="space-y-10 desktop:col-span-5 desktop:sticky desktop:top-8">
          {plan === 'free' && (
            <div className="rounded-[28px] bg-[var(--neo-wash)] px-6 py-6">
              <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-[var(--neo)]">Student</p>
              <p className="mt-2 text-[22px] font-semibold leading-[1.1] tracking-[-0.025em] text-[var(--neo-ink)]">
                A estante inteira, do 1º período à clínica.
              </p>
              <div className="mt-4 space-y-2">
                {BASE_STUDENT_PERKS.map(perk => (
                  <p key={perk} className="flex items-center gap-2.5 text-[14px] text-[var(--neo-ink)]">
                    <Check size={14} className="shrink-0 text-[var(--neo)]" />
                    {perk}
                  </p>
                ))}
              </div>
              {onUpgrade && (
                <button type="button" onClick={onUpgrade} className="neo-pill mt-5 w-full">
                  Conhecer o Student
                </button>
              )}
              <p className="mt-3 flex items-center gap-1.5 text-[12px] text-[var(--neo-gray)]">
                <Lock size={11} /> No Free: o 1º resumo de cada disciplina e um mapa completo.
              </p>
            </div>
          )}

          <BaseSection kicker="Como estudar, com evidência">
            <GroupedList>
              {STUDY_METHOD_TIPS.map(tip => {
                const href = referenceHref(tip.reference);
                return (
                  <div key={tip.id} className="border-b border-black/[0.04] px-5 py-4 last:border-b-0">
                    <p className="text-[15px] font-semibold tracking-[-0.011em] text-[var(--neo-ink)]">{tip.title}</p>
                    <p className="mt-1 text-[14px] leading-snug text-[var(--neo-gray)]">{tip.body}</p>
                    {href && (
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="neo-link mt-2 inline-flex items-center gap-1 text-[13px]"
                      >
                        {referenceShortCitation(tip.reference)} <ArrowUpRight size={12} />
                      </a>
                    )}
                  </div>
                );
              })}
            </GroupedList>
          </BaseSection>

          <button
            type="button"
            onClick={onOpenCola}
            className="w-full rounded-[24px] bg-[#f5f5f7] px-5 py-5 text-left ios-press-gentle"
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
