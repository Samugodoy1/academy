import React, { useEffect, useRef } from 'react';
import { DEFAULT_ACADEMY_NEO_ID, persistAcademyNeoId, readStoredAcademyNeoId } from './academyNeo';
import { useAcademyNeo } from './AcademyNeoProvider';
import { useAcademyWidgets } from './AcademyWidgetsProvider';
import {
  fetchAcademyPrefs,
  resolveAcademyPrefs,
  saveAcademyAccount,
  setAcademyAccountPrefs,
  setAcademyProfileSnapshot,
  resetAcademyAccountPrefs,
  type AcademyAccountPrefs,
} from './academyAccount';
import { defaultAcademyWidgets, persistAcademyWidgets, readAcademyWidgets } from './academyWidgets';

interface AcademyPrefsSyncProps {
  userId?: number | null;
  profile?: unknown;
}

export function AcademyPrefsSync({ userId, profile }: AcademyPrefsSyncProps) {
  const { hydrateColorway } = useAcademyNeo();
  const { hydrateWidgets } = useAcademyWidgets();
  const hydratedUser = useRef<number | null>(null);
  const fromApi = useRef(false);

  useEffect(() => {
    if (!userId) {
      hydratedUser.current = null;
      fromApi.current = false;
      resetAcademyAccountPrefs();
      hydrateColorway(DEFAULT_ACADEMY_NEO_ID);
      hydrateWidgets(defaultAcademyWidgets());
      return;
    }

    if (profile) setAcademyProfileSnapshot(profile);

    const apply = (prefs: AcademyAccountPrefs, persistRemote: boolean) => {
      setAcademyAccountPrefs(prefs);
      persistAcademyNeoId(prefs.academy_neo);
      persistAcademyWidgets(prefs.academy_widgets);
      hydrateColorway(prefs.academy_neo);
      hydrateWidgets(prefs.academy_widgets);
      if (persistRemote) void saveAcademyAccount(prefs);
    };

    const fromLocal = (): AcademyAccountPrefs => ({
      academy_neo: readStoredAcademyNeoId(),
      academy_widgets: readAcademyWidgets(),
    });

    if (hydratedUser.current !== userId) {
      hydratedUser.current = userId;
      fromApi.current = false;
      let cancelled = false;
      void fetchAcademyPrefs().then(remote => {
        if (cancelled) return;
        const fromProfile = resolveAcademyPrefs(profile);
        if (remote) {
          fromApi.current = true;
          apply({
            academy_neo: remote.academy_neo || fromProfile.neo || fromLocal().academy_neo,
            academy_widgets: remote.academy_widgets || fromProfile.widgets || fromLocal().academy_widgets,
          }, false);
          return;
        }
        apply({
          academy_neo: fromProfile.neo || fromLocal().academy_neo,
          academy_widgets: fromProfile.widgets || fromLocal().academy_widgets,
        }, !fromProfile.neo || !fromProfile.widgets);
      });
      return () => {
        cancelled = true;
      };
    }

    if (!fromApi.current && profile) {
      const fromProfile = resolveAcademyPrefs(profile);
      if (fromProfile.neo || fromProfile.widgets) {
        apply({
          academy_neo: fromProfile.neo || fromLocal().academy_neo,
          academy_widgets: fromProfile.widgets || fromLocal().academy_widgets,
        }, !fromProfile.neo || !fromProfile.widgets);
      }
    }
  }, [hydrateColorway, hydrateWidgets, profile, userId]);

  return null;
}
