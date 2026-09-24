import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import {
  HOME_SCREEN_INSTALLED_KEY,
  HOME_SCREEN_SESSION_KEY,
  detectHomeScreenPlatform,
  isIosSafari,
  isStandaloneDisplay,
  shouldSuggestHomeScreen,
  type HomeScreenPlatform,
} from './homeScreen';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

function ShareGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 15.5V4.5" stroke="#007AFF" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M8 8.2 12 4.2l4 4" stroke="#007AFF" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M7.2 10.5H6.4A2.4 2.4 0 0 0 4 12.9v6.2A2.4 2.4 0 0 0 6.4 21.5h11.2a2.4 2.4 0 0 0 2.4-2.4v-6.2a2.4 2.4 0 0 0-2.4-2.4h-.8"
        stroke="#007AFF"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlusSquareGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="4" width="16" height="16" rx="4" stroke="#1d1d1f" strokeWidth="1.6" />
      <path d="M12 8.2v7.6M8.2 12h7.6" stroke="#1d1d1f" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function DotsGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="6" r="1.5" fill="#1d1d1f" />
      <circle cx="12" cy="12" r="1.5" fill="#1d1d1f" />
      <circle cx="12" cy="18" r="1.5" fill="#1d1d1f" />
    </svg>
  );
}

function PhonePlusGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="7" y="3" width="10" height="18" rx="2.2" stroke="#1d1d1f" strokeWidth="1.6" />
      <path d="M12 8.2v5.2M9.4 10.8h5.2" stroke="#1d1d1f" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M10.5 18.2h3" stroke="#1d1d1f" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

const StepRow: React.FC<{
  index: number;
  glyph: React.ReactNode;
  title: string;
  detail: string;
}> = ({ index, glyph, title, detail }) => {
  return (
    <li className="flex items-center gap-3 px-3 py-3">
      <span className="w-4 shrink-0 text-[13px] tabular-nums text-[#86868b]">{index}</span>
      <span className="flex h-9 min-w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#f2f2f7] px-1.5">
        {glyph}
      </span>
      <span className="min-w-0">
        <span className="block text-[16px] leading-tight tracking-[-0.02em] text-[#1d1d1f]">{title}</span>
        <span className="mt-0.5 block text-[13px] leading-snug tracking-[-0.01em] text-[#6e6e73]">{detail}</span>
      </span>
    </li>
  );
};

const IOS_STEPS = [
  {
    title: 'Toque em Compartilhar',
    detail: 'O quadrado com a seta, na barra do Safari.',
    glyph: <ShareGlyph />,
  },
  {
    title: 'Adicionar à Tela de Início',
    detail: 'Role a lista de ações e toque nessa linha.',
    glyph: <PlusSquareGlyph />,
  },
  {
    title: 'Toque em Adicionar',
    detail: 'O botão azul, no canto superior direito.',
    glyph: <span className="whitespace-nowrap text-[11px] font-semibold leading-none tracking-[-0.03em] text-[#007AFF]">Adicionar</span>,
  },
];

const ANDROID_STEPS = [
  {
    title: 'Toque no menu',
    detail: 'Os três pontos, no canto superior do Chrome.',
    glyph: <DotsGlyph />,
  },
  {
    title: 'Adicionar à tela inicial',
    detail: 'Se aparecer “Instalar app”, é a mesma ação.',
    glyph: <PhonePlusGlyph />,
  },
  {
    title: 'Confirme em Adicionar',
    detail: 'O Academy fica na tela inicial, em tela cheia.',
    glyph: <span className="whitespace-nowrap text-[11px] font-semibold leading-none tracking-[-0.03em] text-[#1a73e8]">Adicionar</span>,
  },
];

export const AddToHomeScreen: React.FC = () => {
  const { pathname } = useLocation();
  const [platform, setPlatform] = useState<HomeScreenPlatform | null>(null);
  const [safari, setSafari] = useState(true);
  const [open, setOpen] = useState(false);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const nav = window.navigator as Navigator & { standalone?: boolean };
    const standalone = isStandaloneDisplay(
      nav,
      window.matchMedia('(display-mode: standalone)').matches,
    );
    const ua = nav.userAgent || '';
    const detected = detectHomeScreenPlatform(ua, nav.maxTouchPoints, nav.platform);
    const installed = localStorage.getItem(HOME_SCREEN_INSTALLED_KEY) === '1';
    const dismissedThisVisit = sessionStorage.getItem(HOME_SCREEN_SESSION_KEY) === '1';
    if (!shouldSuggestHomeScreen({ platform: detected, standalone, installed, dismissedThisVisit, pathname })) {
      setOpen(false);
      return;
    }
    setPlatform(detected);
    setSafari(detected === 'ios' ? isIosSafari(ua) : true);
    const timer = window.setTimeout(() => setOpen(true), 1600);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      localStorage.setItem(HOME_SCREEN_INSTALLED_KEY, '1');
      setOpen(false);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(HOME_SCREEN_SESSION_KEY, '1');
    setOpen(false);
  };

  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    setInstallEvent(null);
    if (choice.outcome === 'accepted') {
      localStorage.setItem(HOME_SCREEN_INSTALLED_KEY, '1');
      setOpen(false);
    }
  };

  const steps = platform === 'android' ? ANDROID_STEPS : IOS_STEPS;
  const title = platform === 'android' ? 'Adicionar à tela inicial' : 'Adicionar à Tela de Início';

  return (
    <AnimatePresence>
      {open && platform && (
        <div className="pointer-events-none fixed inset-0 z-[90] flex items-end justify-center no-print">
          <motion.button
            type="button"
            aria-label="Fechar sugestão"
            className="pointer-events-auto absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="home-screen-title"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto relative w-full max-w-[420px] px-3 pb-[max(12px,env(safe-area-inset-bottom))]"
          >
            <div className="overflow-hidden rounded-[14px] bg-[#f2f2f7] shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
              <div className="flex items-center gap-3 px-4 pb-3 pt-4">
                <img
                  src="/favicon.svg"
                  alt=""
                  className="h-14 w-14 rounded-[14px] bg-white object-contain p-2 shadow-[0_0_0_0.5px_rgba(0,0,0,0.08)]"
                />
                <div className="min-w-0">
                  <p className="text-[13px] tracking-[-0.01em] text-[#6e6e73]">OdontoHub Academy</p>
                  <h2 id="home-screen-title" className="text-[20px] font-semibold leading-tight tracking-[-0.03em] text-[#1d1d1f]">
                    {title}
                  </h2>
                </div>
              </div>
              <p className="px-4 pb-3 text-[15px] leading-snug tracking-[-0.011em] text-[#3a3a3c]">
                {platform === 'ios' && !safari
                  ? 'No iPhone isso abre pelo Safari. Toque em Compartilhar no navegador e escolha Safari. Depois:'
                  : 'Três toques. O Academy passa a abrir em tela cheia, direto da tela inicial.'}
              </p>
              <ol className="mx-3 divide-y divide-[#e5e5ea] overflow-hidden rounded-[12px] bg-white">
                {steps.map((step, index) => (
                  <StepRow key={step.title} index={index + 1} glyph={step.glyph} title={step.title} detail={step.detail} />
                ))}
              </ol>
              {platform === 'android' && installEvent && (
                <div className="px-3 pt-3">
                  <button type="button" onClick={install} className="apple-btn w-full">
                    Instalar
                  </button>
                </div>
              )}
              <div className="h-3" />
            </div>
            <button
              type="button"
              onClick={dismiss}
              className="mt-2 w-full rounded-[14px] bg-white py-3.5 text-[17px] font-semibold tracking-[-0.02em] text-[#007AFF] shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
            >
              Agora não
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
