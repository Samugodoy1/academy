import React from 'react';
import { ChevronRight, Lock, TreeStructure } from '../../../icons';
import { STUDY_TOPIC_LABELS } from '../../../utils/studyTopics';
import type { BaseDiscipline } from '../types';
import { PERIOD_LABEL, totalMinutes } from '../content';
import { isLessonUnlocked, isMindMapUnlocked, type BasePlan } from '../plan';
import { countDone, isLessonDone, type BaseProgress } from '../progress';
import { countLeaves } from './MindMap';
import { BackLink, BaseSection, GroupedList, ListRow, ProgressBar, ReferenceList } from './ui';

interface DisciplineViewProps {
  discipline: BaseDiscipline;
  disciplineIndex: number;
  plan: BasePlan;
  progress: BaseProgress;
  onBack: () => void;
  onOpenLesson: (lessonIndex: number) => void;
  onOpenMindMap: () => void;
  onOpenCola: (topic: NonNullable<BaseDiscipline['colaTopic']>) => void;
}

export function DisciplineView({
  discipline,
  disciplineIndex,
  plan,
  progress,
  onBack,
  onOpenLesson,
  onOpenMindMap,
  onOpenCola,
}: DisciplineViewProps) {
  const read = countDone(progress, discipline);
  const total = discipline.lessons.length;
  const mapUnlocked = isMindMapUnlocked(plan, disciplineIndex);
  const ideas = countLeaves(discipline.mindMap);
  const branches = discipline.mindMap.children?.length || 0;

  return (
    <div className="page-shell space-y-10">
      <header className="space-y-4">
        <BackLink label="Estudos" onClick={onBack} />
        <div>
          <p className="text-[13px] tracking-[-0.011em] text-[var(--neo-gray)]">{PERIOD_LABEL[discipline.period]}</p>
          <h1 className="mt-2 max-w-[18ch] text-[28px] font-semibold leading-[1.05] tracking-[-0.025em] text-[var(--neo-ink)] sm:text-[34px]">
            {discipline.title}
          </h1>
          <p className="mt-3 max-w-[38ch] text-[17px] leading-snug tracking-[-0.011em] text-[var(--neo-gray)]">
            {discipline.tagline}
          </p>
        </div>
        <div className="rounded-[24px] bg-[#f5f5f7] px-5 py-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[15px] font-semibold tracking-[-0.011em] text-[var(--neo-ink)]">
              {read} de {total} resumos lidos
            </p>
            <p className="text-[13px] text-[var(--neo-gray)]">{totalMinutes(discipline)} min no total</p>
          </div>
          <ProgressBar value={total ? read / total : 0} className="mt-3" />
        </div>
      </header>

      <div className="flex flex-col gap-10 desktop:grid desktop:grid-cols-12 desktop:items-start desktop:gap-x-12">
        <div className="space-y-10 desktop:col-span-7">
          <BaseSection kicker="Resumos">
            <GroupedList>
              {discipline.lessons.map((lesson, index) => {
                const unlocked = isLessonUnlocked(plan, index);
                return (
                  <ListRow
                    key={lesson.id}
                    title={lesson.title}
                    meta={`${lesson.minutes} min · ${lesson.summary}`}
                    locked={!unlocked}
                    done={isLessonDone(progress, lesson.id)}
                    onClick={() => onOpenLesson(index)}
                  />
                );
              })}
            </GroupedList>
          </BaseSection>

          <BaseSection kicker="Mapa mental">
            <button
              type="button"
              onClick={onOpenMindMap}
              className={`flex w-full items-center gap-4 rounded-[24px] px-5 py-5 text-left ios-press-gentle ${
                mapUnlocked ? 'bg-[var(--neo)] text-white' : 'bg-[#f5f5f7] text-[var(--neo-ink)]'
              }`}
            >
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                  mapUnlocked ? 'bg-white/15 text-white' : 'bg-white text-[var(--neo)]'
                }`}
              >
                <TreeStructure size={22} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[17px] font-semibold tracking-[-0.016em]">{discipline.mindMap.label}</span>
                <span className={`mt-0.5 block text-[14px] ${mapUnlocked ? 'text-white/85' : 'text-[var(--neo-gray)]'}`}>
                  {branches} ramos · {ideas} ideias · modo reconstruir
                </span>
              </span>
              {mapUnlocked ? (
                <ChevronRight size={16} className="shrink-0 text-white/80" />
              ) : (
                <Lock size={15} className="shrink-0 text-[#C6C6C8]" />
              )}
            </button>
          </BaseSection>

          {discipline.colaTopic && (
            <button
              type="button"
              onClick={() => onOpenCola(discipline.colaTopic!)}
              className="w-full rounded-[24px] bg-[#f5f5f7] px-5 py-5 text-left ios-press-gentle"
            >
              <p className="text-[13px] text-[var(--neo-gray)]">Na clínica isto vira</p>
              <p className="mt-1 text-[17px] font-semibold tracking-[-0.016em] text-[var(--neo-ink)]">
                Cola · {STUDY_TOPIC_LABELS[discipline.colaTopic]}
              </p>
              <p className="neo-link mt-2 text-[15px]">Abrir na Cola ›</p>
            </button>
          )}
        </div>

        <aside className="space-y-3 desktop:col-span-5">
          <BaseSection kicker={`Referências · ${discipline.references.length}`}>
            <ReferenceList references={discipline.references} />
          </BaseSection>
        </aside>
      </div>
    </div>
  );
}
