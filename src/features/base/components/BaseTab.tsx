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
import type { ReadinessLevel } from '../session/types';
import {
  persistReviewState,
  readReviewState,
  scheduleAfterSession,
  type ReviewState,
} from '../session/review';
import {
  markCaseComplete,
  markLabComplete,
  markSessionComplete,
  persistSessionProgress,
  readSessionProgress,
  type SessionProgress,
} from '../session/sessionProgress';
import { LabExperience } from '../session/labs/LabExperience';
import { BaseHome } from './BaseHome';
import { BaseLockSheet } from './BaseLockSheet';
import { CaseFlow } from './CaseFlow';
import { DisciplineView } from './DisciplineView';
import { LessonView } from './LessonView';
import { MindMapView } from './MindMapView';
import { MixView } from './MixView';
import { ReviewInbox } from './ReviewInbox';
import { SessionFlow } from './SessionFlow';
import { BackLink } from './ui';

interface BaseTabProps {
  plan: BasePlan;
  academicPeriod?: string | null;
  setActiveTab?: (tab: any) => void;
  onUpgrade?: () => void;
}

export const BaseTab: React.FC<BaseTabProps> = ({ plan, academicPeriod, setActiveTab, onUpgrade }) => {
  const [view, setViewState] = useState<BaseView>(readBaseView);
  const [progress, setProgress] = useState<BaseProgress>(readBaseProgress);
  const [review, setReview] = useState<ReviewState>(readReviewState);
  const [sessionProgress, setSessionProgress] = useState<SessionProgress>(readSessionProgress);
  const [lock, setLock] = useState<{ block: BaseBlock; subject?: string } | null>(null);

  const setView = useCallback((next: BaseView) => {
    setViewState(next);
    persistBaseView(next);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    persistBaseProgress(progress);
  }, [progress]);

  useEffect(() => {
    persistReviewState(review);
  }, [review]);

  useEffect(() => {
    persistSessionProgress(sessionProgress);
  }, [sessionProgress]);

  const openLessonId =
    view.kind === 'session' || view.kind === 'reference'
      ? getDiscipline(view.disciplineId)?.lessons[view.lessonIndex]?.id ?? null
      : null;

  useEffect(() => {
    if (!openLessonId) return;
    setProgress(previous => markLessonOpened(previous, openLessonId));
  }, [openLessonId]);

  const canOpenLesson = useCallback((lessonIndex: number) => isLessonUnlocked(plan, lessonIndex), [plan]);

  const suggestion = useMemo(
    () => suggestNextLesson(BASE_DISCIPLINES, progress, canOpenLesson),
    [progress, canOpenLesson],
  );

  const openDiscipline = (discipline: BaseDiscipline) => setView({ kind: 'discipline', disciplineId: discipline.id });

  const openSession = (discipline: BaseDiscipline, lessonIndex: number) => {
    const lesson = discipline.lessons[lessonIndex];
    if (!lesson) return;
    if (!isLessonUnlocked(plan, lessonIndex)) {
      setLock({ block: 'lesson', subject: lesson.title });
      return;
    }
    setView({ kind: 'session', disciplineId: discipline.id, lessonIndex });
  };

  const openReference = (disciplineId: string, lessonIndex: number) => {
    setView({ kind: 'reference', disciplineId, lessonIndex });
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

  const onSessionComplete = (discipline: BaseDiscipline, lessonIndex: number, readiness: ReadinessLevel, note?: string) => {
    const lesson = discipline.lessons[lessonIndex];
    if (!lesson) return;
    setSessionProgress(s => markSessionComplete(s, lesson.id, readiness));
    setReview(r => scheduleAfterSession(r, lesson.id, readiness));
    if (readiness === 'confident' && !isLessonDone(progress, lesson.id)) {
      setProgress(p => toggleLessonDone(p, lesson.id));
    }
    openDiscipline(discipline);
  };

  const currentSemester = academicSemester(academicPeriod);

  const discipline = view.kind === 'home' || view.kind === 'review' || view.kind === 'mix' || view.kind === 'case' || view.kind === 'lab'
    ? null
    : getDiscipline(view.disciplineId);

  const disciplineIndex = discipline ? getDisciplineIndex(discipline.id) : -1;

  let body: React.ReactNode;

  if (view.kind === 'home') {
    body = (
      <BaseHome
        plan={plan}
        progress={progress}
        review={review}
        sessionProgress={sessionProgress}
        suggestion={suggestion}
        currentSemester={currentSemester}
        onOpenDiscipline={openDiscipline}
        onOpenLesson={openSession}
        onOpenReview={() => setView({ kind: 'review' })}
        onOpenMix={() => setView({ kind: 'mix' })}
        onOpenCola={() => openCola()}
        onUpgrade={onUpgrade}
      />
    );
  } else if (view.kind === 'review') {
    body = (
      <ReviewInbox
        review={review}
        onReviewChange={setReview}
        onBack={() => setView({ kind: 'home' })}
        onOpenSession={(disciplineId, lessonIndex) => {
          const d = getDiscipline(disciplineId);
          if (d) openSession(d, lessonIndex);
        }}
      />
    );
  } else if (view.kind === 'mix') {
    body = (
      <MixView
        plan={plan}
        review={review}
        onReviewChange={setReview}
        onBack={() => setView({ kind: 'home' })}
        onUpgrade={onUpgrade}
      />
    );
  } else if (view.kind === 'case') {
    body = (
      <CaseFlow
        caseId={view.caseId}
        onBack={() => setView({ kind: 'home' })}
        onComplete={() => {
          setSessionProgress(s => markCaseComplete(s, view.caseId));
          setView({ kind: 'home' });
        }}
      />
    );
  } else if (view.kind === 'lab') {
    body = (
      <div className="page-shell space-y-8">
        <BackLink label="Estudos" onClick={() => setView({ kind: 'home' })} />
        <LabExperience
          labId={view.labId}
          onComplete={() => {
            setSessionProgress(s => markLabComplete(s, view.labId));
            setView({ kind: 'home' });
          }}
        />
      </div>
    );
  } else if (!discipline) {
    body = null;
  } else if (view.kind === 'session' && discipline.lessons[view.lessonIndex] && isLessonUnlocked(plan, view.lessonIndex)) {
    body = (
      <SessionFlow
        discipline={discipline}
        lessonIndex={view.lessonIndex}
        onBack={() => openDiscipline(discipline)}
        onOpenReference={() => openReference(discipline.id, view.lessonIndex)}
        onComplete={(readiness, note) => onSessionComplete(discipline, view.lessonIndex, readiness, note)}
        onLabComplete={labId => setSessionProgress(s => markLabComplete(s, labId as import('../session/types').LabId))}
        onCaseComplete={caseId => setSessionProgress(s => markCaseComplete(s, caseId))}
      />
    );
  } else if (view.kind === 'reference' && discipline.lessons[view.lessonIndex] && isLessonUnlocked(plan, view.lessonIndex)) {
    const lesson = discipline.lessons[view.lessonIndex];
    body = (
      <LessonView
        discipline={discipline}
        lesson={lesson}
        lessonIndex={view.lessonIndex}
        plan={plan}
        done={isLessonDone(progress, lesson.id)}
        onBack={() => setView({ kind: 'session', disciplineId: discipline.id, lessonIndex: view.lessonIndex })}
        onToggleDone={() => setProgress(previous => toggleLessonDone(previous, lesson.id))}
        onOpenLesson={index => openSession(discipline, index)}
      />
    );
  } else if (view.kind === 'mindmap' && isMindMapUnlocked(plan, disciplineIndex)) {
    body = (
      <MindMapView
        discipline={discipline}
        onBack={() => openDiscipline(discipline)}
        onOpenLesson={index => openSession(discipline, index)}
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
        onOpenLesson={index => openSession(discipline, index)}
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
