import type { BaseReference } from './types';

export function referenceHref(reference: BaseReference): string | null {
  if (reference.doi) return `https://doi.org/${reference.doi}`;
  return reference.url || null;
}

/** "Pitts NB et al. Nat Rev Dis Primers, 2017" style citation for tight spaces. */
export function referenceShortCitation(reference: BaseReference): string {
  const firstAuthor = reference.authors.split(',')[0].trim();
  const hasMany = reference.authors.includes(',');
  return `${firstAuthor}${hasMany ? ' et al.' : ''} · ${reference.journal}, ${reference.year}`;
}
