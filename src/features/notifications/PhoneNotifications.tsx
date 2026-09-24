import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { dayKeyOf } from '../game/streak';
import { isGoalReached } from '../game/progress';
import { loadLocalGameState } from '../game/sync';
import { planPhoneNotifications, type AppointmentReminderInput } from './plan';

const DECISION_KEY = 'odontohub-academy-notifications';

interface PhoneNotificationsProps {
  signedIn: boolean;
  appointments: AppointmentReminderInput[];
}

async function arm(appointments: AppointmentReminderInput[]) {
  if (!('serviceWorker' in navigator) || Notification.permission !== 'granted') return;
  const registration = await navigator.serviceWorker.register('/sw.js');
  const ready = await navigator.serviceWorker.ready;
  const now = new Date();
  const study = loadLocalGameState(now);
  const notifications = planPhoneNotifications({
    now,
    study: {
      streak: study.streak,
      goalReached: isGoalReached(study, now),
      lastDay: study.lastDay,
      today: dayKeyOf(now),
    },
    appointments,
  });
  const worker = ready.active || registration.active;
  worker?.postMessage({ type: 'schedule', notifications });
}

export const PhoneNotifications: React.FC<PhoneNotificationsProps> = ({ signedIn, appointments }) => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const signature = appointments.map(item => `${item.id}:${item.startMs}:${item.status}`).join('|');

  useEffect(() => {
    if (!signedIn || pathname.startsWith('/print')) return;
    if (typeof Notification === 'undefined') return;
    if (Notification.permission === 'granted') {
      void arm(appointments);
      return;
    }
    if (Notification.permission === 'denied') return;
    if (sessionStorage.getItem(DECISION_KEY) === 'later') return;
    const timer = window.setTimeout(() => setOpen(true), 2200);
    return () => window.clearTimeout(timer);
    // signature stands in for the appointment list so a parent re-render does not reset the ask
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signedIn, pathname, signature]);

  const later = () => {
    sessionStorage.setItem(DECISION_KEY, 'later');
    setOpen(false);
  };

  const allow = async () => {
    setOpen(false);
    const permission = await Notification.requestPermission();
    if (permission === 'granted') void arm(appointments);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="pointer-events-none fixed inset-0 z-[90] flex items-end justify-center no-print">
          <motion.button
            type="button"
            aria-label="Fechar"
            className="pointer-events-auto absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={later}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="phone-notifications-title"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto relative w-full max-w-[420px] px-3 pb-[max(12px,env(safe-area-inset-bottom))]"
          >
            <div className="overflow-hidden rounded-[14px] bg-[#f2f2f7] shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
              <div className="px-4 pb-3 pt-4">
                <p className="text-[13px] tracking-[-0.01em] text-[#6e6e73]">OdontoHub Academy</p>
                <h2 id="phone-notifications-title" className="text-[20px] font-semibold leading-tight tracking-[-0.03em] text-[#1d1d1f]">
                  Notificações
                </h2>
                <p className="mt-2 text-[15px] leading-snug tracking-[-0.011em] text-[#3a3a3c]">
                  Chegam no celular, no mesmo formato dos avisos do sistema.
                </p>
              </div>
              <ul className="mx-3 divide-y divide-[#e5e5ea] overflow-hidden rounded-[12px] bg-white">
                <li className="px-3 py-3">
                  <p className="text-[16px] tracking-[-0.02em] text-[#1d1d1f]">Questão do dia</p>
                  <p className="text-[13px] text-[#6e6e73]">Às 19h, se a de hoje ainda estiver aberta.</p>
                </li>
                <li className="px-3 py-3">
                  <p className="text-[16px] tracking-[-0.02em] text-[#1d1d1f]">Ofensiva</p>
                  <p className="text-[13px] text-[#6e6e73]">Avisa quando a sequência depende dessa questão.</p>
                </li>
                <li className="px-3 py-3">
                  <p className="text-[16px] tracking-[-0.02em] text-[#1d1d1f]">Atendimentos</p>
                  <p className="text-[13px] text-[#6e6e73]">Uma hora antes de entrar na cadeira.</p>
                </li>
              </ul>
              <div className="h-3" />
            </div>
            <button
              type="button"
              onClick={allow}
              className="mt-2 w-full rounded-[14px] bg-white py-3.5 text-[17px] font-semibold tracking-[-0.02em] text-[#007AFF]"
            >
              Ativar
            </button>
            <button
              type="button"
              onClick={later}
              className="mt-2 w-full rounded-[14px] bg-white py-3.5 text-[17px] tracking-[-0.02em] text-[#007AFF]"
            >
              Agora não
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
