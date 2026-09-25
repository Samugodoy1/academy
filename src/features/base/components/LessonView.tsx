import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight, Lock, Stethoscope } from '../../../icons';
import type { BaseDiscipline, BaseLesson } from '../types';
import { isLessonUnlocked, type BasePlan } from '../plan';
import { BackLink, BaseSection, GroupedList, ReferenceList } from './ui';

interface LessonViewProps {
  discipline: BaseDiscipline;
  lesson: BaseLesson;
  lessonIndex: number;
  plan: BasePlan;
  done: boolean;
  onBack: () => void;
  onToggleDone: () => void;
  onOpenLesson: (lessonIndex: number) => void;
}

export function LessonView({
  discipline,
  lesson,
  lessonIndex,
  plan,
  done,
  onBack,
  onToggleDone,
  onOpenLesson,
}: LessonViewProps) {
  const [revealed, setRevealed] = useState<Set<number>>(() => new Set());
  const references = discipline.references.filter(reference => lesson.refIds.includes(reference.id));
  const next = discipline.lessons[lessonIndex + 1];
  const nextUnlocked = next ? isLessonUnlocked(plan, lessonIndex + 1) : false;

  useEffect(() => {
    setRevealed(new Set());
  }, [lesson.id]);

  return (
    <div className="page-shell space-y-10">
      <header className="space-y-4">
        <BackLink label={discipline.title} onClick={onBack} />
        <div>
          <p className="text-[13px] tracking-[-0.011em] text-[var(--neo-gray)]">
            Resumo {lessonIndex + 1} de {discipline.lessons.length} · {lesson.minutes} min
          </p>
          <h1 className="mt-2 max-w-[20ch] text-[28px] font-semibold leading-[1.05] tracking-[-0.025em] text-[var(--neo-ink)] sm:text-[34px]">
            {lesson.title}
          </h1>
          <p className="mt-3 max-w-[40ch] text-[17px] leading-snug tracking-[-0.011em] text-[var(--neo-gray)]">
            {lesson.summary}
          </p>
        </div>
      </header>

      <div className="flex flex-col gap-10 desktop:grid desktop:grid-cols-12 desktop:items-start desktop:gap-x-12">
        <article className="space-y-10 desktop:col-span-7">
          <div className="rounded-[28px] bg-[var(--neo-wash)] px-6 py-6">
            <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-[var(--neo)]">Leve com você</p>
            <ol className="mt-3 space-y-3">
              {lesson.keyPoints.map((point, index) => (
                <li key={index} className="flex gap-3 text-[16px] leading-snug tracking-[-0.011em] text-[var(--neo-ink)]">
                  <span className="w-5 shrink-0 tabular-nums text-[var(--neo)]">{index + 1}</span>
                  <span>{point}</span>
                </li>
              ))}
            </ol>
          </div>

          {lesson.sections.map(section => (
            <section key={section.heading} className="space-y-3">
              <h2 className="text-[22px] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--neo-ink)]">
                {section.heading}
              </h2>
              {section.body && (
                <p className="text-[17px] leading-[1.5] tracking-[-0.011em] text-[var(--neo-ink)]">{section.body}</p>
              )}
              {section.bullets && (
                <ul className="space-y-2">
                  {section.bullets.map((bullet, index) => (
                    <li key={index} className="flex gap-3 text-[16px] leading-snug tracking-[-0.011em] text-[var(--neo-ink)]">
                      <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--neo)]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <div className="flex gap-4 rounded-[24px] bg-[#f5f5f7] px-5 py-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[var(--neo)]">
              <Stethoscope size={18} />
            </span>
            <div>
              <p className="text-[13px] text-[var(--neo-gray)]">Na cadeira</p>
              <p className="mt-1 text-[16px] leading-snug tracking-[-0.011em] text-[var(--neo-ink)]">{lesson.clinicalBridge}</p>
            </div>
          </div>

          <BaseSection kicker="Fixar · responda antes de abrir">
            <GroupedList>
              {lesson.selfCheck.map((item, index) => {
                const open = revealed.has(index);
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() =>
                      setRevealed(previous => {
                        const nextSet = new Set(previous);
                        if (nextSet.has(index)) nextSet.delete(index);
                        else nextSet.add(index);
                        return nextSet;
                      })
                    }
                    aria-expanded={open}
                    className="block w-full border-b border-black/[0.04] px-5 py-4 text-left last:border-b-0"
                  >
                    <p className="text-[15px] font-semibold leading-snug tracking-[-0.011em] text-[var(--neo-ink)]">
                      {item.question}
                    </p>
                    {open ? (
                      <motion.p
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18 }}
                        className="mt-2 text-[15px] leading-snug text-[var(--neo-ink)]"
                      >
                        {item.answer}
                      </motion.p>
                    ) : (
                      <p className="neo-link mt-2 text-[13px]">Ver resposta</p>
                    )}
                  </button>
                );
              })}
            </GroupedList>
          </BaseSection>

          <div className="space-y-3">
            <button
              type="button"
              onClick={onToggleDone}
              className={`w-full ${done ? 'neo-pill-secondary !bg-[#f5f5f7]' : 'neo-pill'}`}
            >
              {done ? (
                <>
                  <Check size={16} /> Lido · desmarcar
                </>
              ) : (
                'Marcar como lido'
              )}
            </button>
            {next && (
              <button
                type="button"
                onClick={() => onOpenLesson(lessonIndex + 1)}
                className="flex w-full items-center gap-4 rounded-[24px] bg-[#f5f5f7] px-5 py-4 text-left ios-press-gentle"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] text-[var(--neo-gray)]">Próximo resumo</span>
                  <span className={`block truncate text-[15px] font-semibold tracking-[-0.011em] ${nextUnlocked ? 'text-[var(--neo-ink)]' : 'text-[var(--neo-gray)]'}`}>
                    {next.title}
                  </span>
                </span>
                {nextUnlocked ? (
                  <ChevronRight size={16} className="shrink-0 text-[#C6C6C8]" />
                ) : (
                  <Lock size={15} className="shrink-0 text-[#C6C6C8]" />
                )}
              </button>
            )}
          </div>
        </article>

        <aside className="space-y-10 desktop:col-span-5 desktop:sticky desktop:top-8">
          <BaseSection kicker={`Fontes deste resumo · ${references.length}`}>
            {references.length > 0 ? (
              <ReferenceList references={references} />
            ) : (
              <p className="px-1 text-[14px] text-[var(--neo-gray)]">Veja as referências da disciplina.</p>
            )}
          </BaseSection>
        </aside>
      </div>
    </div>
  );
}
