import React from 'react';
import { ArrowUpRight } from '../../../icons';
import { STUDY_METHOD_TIPS } from '../content';
import type { BaseDiscipline } from '../types';
import { referenceHref, referenceShortCitation } from '../references';
import { MindMap } from './MindMap';
import { BackLink, BaseSection, ReferenceList } from './ui';

interface MindMapViewProps {
  discipline: BaseDiscipline;
  onBack: () => void;
  onOpenLesson: (lessonIndex: number) => void;
}

export function MindMapView({ discipline, onBack, onOpenLesson }: MindMapViewProps) {
  const methodTip = STUDY_METHOD_TIPS.find(tip => tip.id === 'mapa');
  const methodHref = methodTip ? referenceHref(methodTip.reference) : null;

  return (
    <div className="page-shell space-y-10">
      <header className="space-y-4">
        <BackLink label={discipline.title} onClick={onBack} />
        <div>
          <p className="text-[13px] tracking-[-0.011em] text-[var(--neo-gray)]">Mapa mental</p>
          <h1 className="mt-2 max-w-[18ch] text-[28px] font-semibold leading-[1.05] tracking-[-0.025em] text-[var(--neo-ink)] sm:text-[34px]">
            {discipline.title}
          </h1>
          <p className="mt-3 max-w-[40ch] text-[17px] leading-snug tracking-[-0.011em] text-[var(--neo-gray)]">
            Leia uma vez inteiro. Depois toque em Reconstruir e diga cada ideia antes de revelar.
          </p>
        </div>
      </header>

      <div className="rounded-[28px] bg-[#f5f5f7] px-4 py-5 sm:px-6 sm:py-6">
        <MindMap root={discipline.mindMap} />
      </div>

      {methodTip && methodHref && (
        <p className="px-1 text-[13px] leading-snug text-[var(--neo-gray)]">
          Por que reconstruir funciona:{' '}
          <a href={methodHref} target="_blank" rel="noreferrer" className="neo-link inline-flex items-center gap-1">
            {referenceShortCitation(methodTip.reference)} <ArrowUpRight size={12} />
          </a>
        </p>
      )}

      <div className="flex flex-col gap-10 desktop:grid desktop:grid-cols-12 desktop:items-start desktop:gap-x-12">
        <div className="desktop:col-span-7">
          <BaseSection kicker="Cada ramo tem um resumo">
            <div className="overflow-hidden rounded-[24px] bg-[#f5f5f7]">
              {discipline.lessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => onOpenLesson(index)}
                  className="flex w-full items-center justify-between gap-3 border-b border-black/[0.04] px-5 py-4 text-left last:border-b-0"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[15px] font-semibold tracking-[-0.011em] text-[var(--neo-ink)]">
                      {lesson.title}
                    </span>
                    <span className="block text-[13px] text-[var(--neo-gray)]">{lesson.minutes} min</span>
                  </span>
                  <span className="neo-link shrink-0 text-[15px]">Ler ›</span>
                </button>
              ))}
            </div>
          </BaseSection>
        </div>
        <aside className="desktop:col-span-5">
          <BaseSection kicker="Referências">
            <ReferenceList references={discipline.references} />
          </BaseSection>
        </aside>
      </div>
    </div>
  );
}
