import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from '../../../icons';
import type { MindMapNode } from '../types';

interface MindMapProps {
  root: MindMapNode;
}

/**
 * A mind map the student can read and then rebuild: every branch folds, and
 * "Reconstruir" hides the leaves so they have to be recalled before revealing.
 * Desktop draws root → branches left to right; phones stack them.
 */
export function MindMap({ root }: MindMapProps) {
  const [quiz, setQuiz] = useState(false);
  const [folded, setFolded] = useState<Set<string>>(() => new Set());
  const [revealed, setRevealed] = useState<Set<string>>(() => new Set());

  const branches = root.children || [];
  const leafCount = useMemo(() => countLeaves(root), [root]);

  const toggleFold = (key: string) => {
    setFolded(previous => {
      const next = new Set(previous);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const reveal = (key: string) => {
    setRevealed(previous => new Set(previous).add(key));
  };

  const startQuiz = () => {
    setRevealed(new Set());
    setFolded(new Set());
    setQuiz(true);
  };

  const revealedCount = revealed.size;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <p className="text-[13px] text-[var(--neo-gray)]">
          {quiz
            ? `Reconstruindo · ${revealedCount} de ${leafCount} conferidos`
            : `${branches.length} ramos · ${leafCount} ideias · toque num ramo para dobrar`}
        </p>
        <button
          type="button"
          onClick={() => (quiz ? setQuiz(false) : startQuiz())}
          className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
            quiz ? 'bg-[var(--neo)] text-white' : 'bg-[var(--neo-wash)] text-[var(--neo)]'
          }`}
        >
          {quiz ? 'Mostrar tudo' : 'Reconstruir'}
        </button>
      </div>

      <div className="mindmap">
        <div className="mindmap-root">
          <span className="mindmap-root-pill">{root.label}</span>
        </div>
        <ul className="mindmap-branches">
          {branches.map((branch, index) => {
            const key = `${index}`;
            const isFolded = folded.has(key);
            return (
              <li key={key} className="mindmap-branch">
                <div className="mindmap-card">
                  <button
                    type="button"
                    onClick={() => toggleFold(key)}
                    aria-expanded={!isFolded}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                  >
                    <span className="text-[15px] font-semibold tracking-[-0.011em] text-[var(--neo-ink)]">
                      {branch.label}
                    </span>
                    <span className="flex items-center gap-2 text-[12px] text-[var(--neo-gray)]">
                      {isFolded && `${countLeaves(branch)}`}
                      <ChevronDown
                        size={14}
                        className={`text-[#C6C6C8] transition-transform ${isFolded ? '-rotate-90' : ''}`}
                      />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {!isFolded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <MindMapLeaves
                          nodes={branch.children || []}
                          keyPrefix={key}
                          quiz={quiz}
                          revealed={revealed}
                          onReveal={reveal}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function MindMapLeaves({
  nodes,
  keyPrefix,
  quiz,
  revealed,
  onReveal,
  depth = 0,
}: {
  nodes: MindMapNode[];
  keyPrefix: string;
  quiz: boolean;
  revealed: Set<string>;
  onReveal: (key: string) => void;
  depth?: number;
}) {
  return (
    <ul className={`border-t border-black/[0.04] ${depth > 0 ? 'ml-4 border-l border-t-0 border-black/[0.06] pl-3' : ''}`}>
      {nodes.map((node, index) => {
        const key = `${keyPrefix}.${index}`;
        const hidden = quiz && !revealed.has(key);
        const hasChildren = Boolean(node.children?.length);
        return (
          <li key={key} className="px-4 py-2.5">
            {hidden ? (
              <button
                type="button"
                onClick={() => onReveal(key)}
                className="flex w-full items-center gap-3 text-left"
                aria-label="Revelar ideia"
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--neo-soft)]" />
                <span className="h-[14px] flex-1 rounded-full bg-[#e8e8ed]" />
                <span className="text-[12px] text-[var(--neo)]">Revelar</span>
              </button>
            ) : (
              <motion.div
                initial={quiz ? { opacity: 0, y: 4 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                className="flex items-start gap-3"
              >
                <span className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-[var(--neo)]" />
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-medium leading-snug tracking-[-0.011em] text-[var(--neo-ink)]">{node.label}</p>
                  {node.note && <p className="mt-0.5 text-[13px] leading-snug text-[var(--neo-gray)]">{node.note}</p>}
                </div>
              </motion.div>
            )}
            {hasChildren && !hidden && (
              <MindMapLeaves
                nodes={node.children!}
                keyPrefix={key}
                quiz={quiz}
                revealed={revealed}
                onReveal={onReveal}
                depth={depth + 1}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function countLeaves(node: MindMapNode): number {
  if (!node.children || node.children.length === 0) return 1;
  return node.children.reduce((sum, child) => sum + countLeaves(child), 0);
}
