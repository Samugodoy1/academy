import React, { useEffect, useRef } from 'react';
import { DEFAULT_ACADEMY_NEO_ID, readStoredAcademyNeoId } from './academyNeo';
import { useAcademyNeo } from './AcademyNeoProvider';
import { useAcademyWidgets } from './AcademyWidgetsProvider';
import {
  resolveAcademyPrefs,
  saveAcademyAccount,
  setAcademyProfileSnapshot,
  resetAcademyAccountPrefs,
} from './academyAccount';
import { defaultAcademyWidgets, readAcademyWidgets } from './academyWidgets';

interface AcademyPrefsSyncProps {
  userId?: number | null;
  profile?: unknown;
}

export function AcademyPrefsSync({ userId, profile }: AcademyPrefsSyncProps) {
  const { hydrateColorway } = useAcademyNeo();
  const { hydrateWidgets } = useAcademyWidgets();
  const hydratedUser = useRef<number | null>(null);

  useEffect(() => {
    if (!userId) {
      hydratedUser.current = null;
      resetAcademyAccountPrefs();
      hydrateColorway(DEFAULT_ACADEMY_NEO_ID);
      hydrateWidgets(defaultAcademyWidgets());
      return;
    }

    if (!profile) return;
    setAcademyProfileSnapshot(profile);

    if (hydratedUser.current === userId) return;
    hydratedUser.current = userId;

    const resolved = resolveAcademyPrefs(profile);
    const neo = resolved.neo || readStoredAcademyNeoId();
    const widgets = resolved.widgets || readAcademyWidgets();
    hydrateColorway(neo);
    hydrateWidgets(widgets);

    if (!resolved.neo || !resolved.widgets) {
      void saveAcademyAccount({
        academy_neo: neo,
        academy_widgets: widgets,
      });
    }
  }, [hydrateColorway, hydrateWidgets, profile, userId]);

  return null;
}
