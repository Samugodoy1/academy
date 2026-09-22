import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { StudyKey } from '../../../utils/studyTopics';
import { academicSemester } from '../../../theme/academyStage';
import { BASE_DISCIPLINES, getDiscipline, getDisciplineIndex } from '../content';
import { handOffToCola, persistBaseView, readBaseView, type BaseView } from '../handoff';
import { isLessonUnlocked, isMindMapUnlocked, type BaseBlock, type BasePlan } from '../plan';
import {
  isLessonDone,
  markLessonOpened,
  persistBaseProgress,
  readBaseProgress,
  suggestNextLesson,
  toggleLessonDone,
  type BaseProgress,
} from '../progress';
import type { BaseDiscipline } from '../types';
import { BaseHome } from './BaseHome';
import { BaseLockSheet } from './BaseLockSheet';
import { DisciplineView } from './DisciplineView';
import { LessonView } from './LessonView';
import { MindMapView } from './MindMapView';

interface BaseTabProps {
  plan: BasePlan;
  academicPeriod?: string | null;
  setActiveTab?: (tab: any) => void;
  onUpgrade?: () => void;
}

export const BaseTab: React.FC<BaseTabProps> = ({ plan, academicPeriod, setActiveTab, onUpgrade }) => {
  const [view, setViewState] = useState<BaseView>(readBaseView);
  const [progress, setProgress] = useState<BaseProgress>(readBaseProgress);
  const [lock, setLock] = useState<{ block: BaseBlock; subject?: string } | null>(null);

  const setView = useCallback((next: BaseView) => {
    setViewState(next);
    persistBaseView(next);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    persistBaseProgress(progress);
  }, [progress]);

  const canOpenLesson = useCallback((lessonIndex: number) => isLessonUnlocked(plan, lessonIndex), [plan]);

  const suggestion = useMemo(
    () => suggestNextLesson(BASE_DISCIPLINES, progress, canOpenLesson),
    [progress, canOpenLesson],
  );

  const openDiscipline = (discipline: BaseDiscipline) => setView({ kind: 'discipline', disciplineId: discipline.id });

  const openLesson = (discipline: BaseDiscipline, lessonIndex: number) => {
    const lesson = discipline.lessons[lessonIndex];
    if (!lesson) return;
    if (!isLessonUnlocked(plan, lessonIndex)) {
      setLock({ block: 'lesson', subject: lesson.title });
      return;
    }
    setProgress(previous => markLessonOpened(previous, lesson.id));
    setView({ kind: 'lesson', disciplineId: discipline.id, lessonIndex });
  };

  const openMindMap = (discipline: BaseDiscipline) => {
    if (!isMindMapUnlocked(plan, getDisciplineIndex(discipline.id))) {
      setLock({ block: 'mindMap', subject: discipline.mindMap.label });
      return;
    }
    setView({ kind: 'mindmap', disciplineId: discipline.id });
  };

  const openCola = (topic: StudyKey | null = null) => {
    handOffToCola(topic);
    setActiveTab?.('estudos');
  };

  const currentSemester = academicSemester(academicPeriod);

  const discipline = view.kind === 'home' ? null : getDiscipline(view.disciplineId);
  const disciplineIndex = discipline ? getDisciplineIndex(discipline.id) : -1;

  let body: React.ReactNode;
  if (!discipline) {
    body = (
      <BaseHome
        plan={plan}
        progress={progress}
        suggestion={suggestion}
        currentSemester={currentSemester}
        onOpenDiscipline={openDiscipline}
        onOpenLesson={openLesson}
        onOpenCola={() => openCola()}
        onUpgrade={onUpgrade}
      />
    );
  } else if (view.kind === 'lesson' && discipline.lessons[view.lessonIndex] && isLessonUnlocked(plan, view.lessonIndex)) {
    const lesson = discipline.lessons[view.lessonIndex];
    body = (
      <LessonView
        discipline={discipline}
        lesson={lesson}
        lessonIndex={view.lessonIndex}
        plan={plan}
        done={isLessonDone(progress, lesson.id)}
        onBack={() => openDiscipline(discipline)}
        onToggleDone={() => setProgress(previous => toggleLessonDone(previous, lesson.id))}
        onOpenLesson={index => openLesson(discipline, index)}
      />
    );
  } else if (view.kind === 'mindmap' && isMindMapUnlocked(plan, disciplineIndex)) {
    body = (
      <MindMapView
        discipline={discipline}
        onBack={() => openDiscipline(discipline)}
        onOpenLesson={index => openLesson(discipline, index)}
      />
    );
  } else {
    body = (
      <DisciplineView
        discipline={discipline}
        disciplineIndex={disciplineIndex}
        plan={plan}
        progress={progress}
        onBack={() => setView({ kind: 'home' })}
        onOpenLesson={index => openLesson(discipline, index)}
        onOpenMindMap={() => openMindMap(discipline)}
        onOpenCola={openCola}
      />
    );
  }

  return (
    <>
      {body}
      <AnimatePresence>
        {lock && (
          <BaseLockSheet
            block={lock.block}
            subject={lock.subject}
            onClose={() => setLock(null)}
            onUpgrade={
              onUpgrade
                ? () => {
                    setLock(null);
                    onUpgrade();
                  }
                : undefined
            }
          />
        )}
      </AnimatePresence>
    </>
  );
};
