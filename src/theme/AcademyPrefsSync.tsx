import React, { useEffect, useRef } from 'react';
import { DEFAULT_ACADEMY_NEO_ID, persistAcademyNeoId, readExplicitAcademyNeoId, readStoredAcademyNeoId } from './academyNeo';
import { useAcademyNeo } from './AcademyNeoProvider';
import { useAcademyWidgets } from './AcademyWidgetsProvider';
import {
  chooseAcademyNeo,
  chooseAcademyWidgets,
  fetchAcademyPrefs,
  resolveAcademyPrefs,
  saveAcademyAccount,
  setAcademyAccountPrefs,
  setAcademyProfileSnapshot,
  resetAcademyAccountPrefs,
  type AcademyAccountPrefs,
} from './academyAccount';
import { persistAcademyWidgets, readAcademyWidgets, readExplicitAcademyWidgets } from './academyWidgets';

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
      const storedNeo = readExplicitAcademyNeoId();
      hydrateColorway(storedNeo ?? DEFAULT_ACADEMY_NEO_ID, { persist: false });
      const storedWidgets = readExplicitAcademyWidgets();
      if (storedWidgets && storedWidgets.length > 0) hydrateWidgets(storedWidgets);
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

    const chooseNeo = (remoteNeo: AcademyAccountPrefs['academy_neo'] | null | undefined) => (
      chooseAcademyNeo(remoteNeo, readExplicitAcademyNeoId())
    );

    const chooseWidgets = (
      remoteWidgets: AcademyAccountPrefs['academy_widgets'] | null | undefined,
      profileWidgets: AcademyAccountPrefs['academy_widgets'] | null | undefined,
    ) => chooseAcademyWidgets(
      remoteWidgets,
      profileWidgets,
      readExplicitAcademyWidgets(),
      fromLocal().academy_widgets,
    );

    if (hydratedUser.current !== userId) {
      hydratedUser.current = userId;
      fromApi.current = false;
      let cancelled = false;
      void fetchAcademyPrefs().then(remote => {
        if (cancelled) return;
        const fromProfile = resolveAcademyPrefs(profile);
        if (remote) {
          fromApi.current = true;
          const widgets = chooseWidgets(remote.academy_widgets, fromProfile.widgets);
          apply({
            academy_neo: chooseNeo(remote.academy_neo || fromProfile.neo),
            academy_widgets: widgets.widgets,
          }, widgets.pushLocal);
          return;
        }
        const widgets = chooseWidgets(null, fromProfile.widgets);
        apply({
          academy_neo: chooseNeo(fromProfile.neo),
          academy_widgets: widgets.widgets,
        }, !fromProfile.neo || widgets.pushLocal);
      });
      return () => {
        cancelled = true;
      };
    }

    if (!fromApi.current && profile) {
      const fromProfile = resolveAcademyPrefs(profile);
      if (fromProfile.neo || fromProfile.widgets) {
        const widgets = chooseWidgets(null, fromProfile.widgets);
        apply({
          academy_neo: chooseNeo(fromProfile.neo),
          academy_widgets: widgets.widgets,
        }, !fromProfile.neo || widgets.pushLocal);
      }
    }
  }, [hydrateColorway, hydrateWidgets, profile, userId]);

  return null;
}
