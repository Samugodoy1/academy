import React, { useMemo, useState } from 'react';
import { MECHANISTIC_BY_DISCIPLINE } from '../session/mechanisticEdges';
import type { MechanisticEdge } from '../session/types';

interface MechanisticConnectProps {
  disciplineId: string;
  onComplete: () => void;
}

export function MechanisticConnect({ disciplineId, onComplete }: MechanisticConnectProps) {
  const edges = MECHANISTIC_BY_DISCIPLINE[disciplineId] || [];
  const nodes = useMemo(() => {
    const set = new Set<string>();
    edges.forEach(e => {
      set.add(e.from);
      set.add(e.to);
    });
    return [...set];
  }, [edges]);

  const [selectedFrom, setSelectedFrom] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<number>>(() => new Set());
  const [flash, setFlash] = useState<'ok' | 'miss' | null>(null);

  if (edges.length === 0) {
    return (
      <div className="space-y-3">
        <p className="text-[15px] text-[var(--neo-gray)]">Mapa mecânico em expansão para esta disciplina.</p>
        <button type="button" onClick={onComplete} className="neo-pill w-full">
          Continuar
        </button>
      </div>
    );
  }

  const tryLink = (to: string) => {
    if (!selectedFrom) return;
    const idx = edges.findIndex(
      (e, i) => !matched.has(i) && e.from === selectedFrom && e.to === to,
    );
    if (idx >= 0) {
      const next = new Set(matched);
      next.add(idx);
      setMatched(next);
      setFlash('ok');
      setSelectedFrom(null);
      if (next.size === edges.length) setTimeout(onComplete, 400);
    } else {
      setFlash('miss');
      setSelectedFrom(null);
    }
    setTimeout(() => setFlash(null), 600);
  };

  return (
    <div className="space-y-4">
      <p className="text-[14px] leading-snug text-[var(--neo-gray)]">
        Toque uma causa, depois o efeito. {matched.size} de {edges.length} ligados.
      </p>
      <div
        className={`grid gap-2 transition-colors ${flash === 'ok' ? 'ring-2 ring-[var(--neo)]/30 rounded-[20px]' : ''} ${flash === 'miss' ? 'ring-2 ring-[#FF3B30]/30 rounded-[20px]' : ''}`}
      >
        <div className="flex flex-wrap gap-2">
          {nodes.map(node => (
            <button
              key={`from-${node}`}
              type="button"
              onClick={() => setSelectedFrom(node)}
              className={`rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors ${
                selectedFrom === node ? 'bg-[var(--neo)] text-white' : 'bg-white text-[var(--neo-ink)]'
              }`}
            >
              {node}
            </button>
          ))}
        </div>
      </div>
      {selectedFrom && (
        <div className="space-y-2 rounded-[20px] bg-white px-4 py-4">
          <p className="text-[13px] text-[var(--neo-gray)]">Efeito de «{selectedFrom}»</p>
          <div className="flex flex-wrap gap-2">
            {nodes
              .filter(n => n !== selectedFrom)
              .map(n => (
                <button
                  key={`to-${n}`}
                  type="button"
                  onClick={() => tryLink(n)}
                  className="rounded-full bg-[#f5f5f7] px-3 py-2 text-[14px] ios-press-gentle"
                >
                  {n}
                </button>
              ))}
          </div>
        </div>
      )}
      <MatchedList edges={edges} matched={matched} />
    </div>
  );
}

function MatchedList({ edges, matched }: { edges: MechanisticEdge[]; matched: Set<number> }) {
  if (matched.size === 0) return null;
  return (
    <ul className="space-y-2 text-[14px] text-[var(--neo-ink)]">
      {[...matched].map(i => {
        const e = edges[i];
        return (
          <li key={i} className="flex gap-2">
            <span className="text-[var(--neo)]">✓</span>
            <span>
              {e.from} → {e.to}
              {e.label ? ` · ${e.label}` : ''}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
