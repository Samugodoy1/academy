import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from '../../icons';
import { trackPaywallView, trackStudentCta } from '../analytics/track';
import { ACADEMY_FREE_MAX_PATIENTS } from '../subscription/academyEntitlements';
import { UPGRADE_MOMENT, type UpgradeFeature } from '../subscription/conversionCopy';

export const UpgradeLimitModal = ({ data, onClose, onUpgrade }: any) => {
  const feature = (data?.feature || 'cases') as UpgradeFeature;
  const moment = UPGRADE_MOMENT[feature] || UPGRADE_MOMENT.cases;
  const limit = data?.limit || ACADEMY_FREE_MAX_PATIENTS;
  const currentUsage = data?.currentUsage ?? limit;
  const progress = limit > 0 ? Math.min(100, Math.round((currentUsage / limit) * 100)) : 100;
  const showUsageBar = Boolean(moment.usageLabel);

  useEffect(() => {
    if (!data?.open) return;
    trackPaywallView(`upgrade_limit_${feature}`, {
      limit: data.limit,
      current_usage: data.currentUsage,
      feature,
    });
  }, [data?.open, data?.limit, data?.currentUsage, feature]);

  return (
    <AnimatePresence>
      {data?.open && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-slate-950/35 backdrop-blur-md sm:flex sm:items-center sm:justify-center sm:px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 42, scale: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 42, scale: 1 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="
              fixed bottom-0 left-0 right-0
              max-h-[92dvh] overflow-hidden
              rounded-t-[30px] bg-white shadow-[0_-20px_70px_rgba(15,23,42,0.22)]
              sm:relative sm:bottom-auto sm:left-auto sm:right-auto
              sm:w-full sm:max-w-[460px] sm:rounded-[34px]
              sm:max-h-[90vh]
            "
          >
            <div className="mx-auto mt-3 h-1.5 w-11 rounded-full bg-slate-200 sm:hidden" />

            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100/90 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
              aria-label="Fechar"
            >
              <X size={18} />
            </button>

            <div className="max-h-[92dvh] overflow-y-auto px-5 pb-[calc(18px+env(safe-area-inset-bottom))] pt-6 sm:px-7 sm:pb-7 sm:pt-8">
              <div className="text-center">
                <p className="mb-2 text-[13px] font-normal text-apple-gray">
                  {moment.kicker}
                </p>

                <h2 className="mx-auto max-w-[330px] text-[28px] font-semibold leading-[1.05] tracking-[-0.025em] text-apple-ink sm:max-w-[360px] sm:text-[34px]">
                  {moment.headline}
                </h2>

                <p className="mx-auto mt-3 max-w-[330px] text-[14px] leading-6 text-slate-500 sm:mt-4 sm:max-w-[360px] sm:text-[15px]">
                  {moment.body}
                </p>
              </div>

              {showUsageBar && (
                <div className="mt-6 rounded-[22px] border border-slate-100 bg-slate-50/80 p-4 sm:rounded-[24px]">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">
                      {moment.usageLabel}
                    </span>

                    <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-slate-950 shadow-sm ring-1 ring-slate-100">
                      {currentUsage}/{limit}
                    </span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-200/70">
                    <motion.div
                      className="h-full rounded-full bg-slate-950"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                    />
                  </div>
                </div>
              )}

              <div className={`grid gap-2 ${showUsageBar ? 'mt-4' : 'mt-6'}`}>
                {moment.benefits.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl bg-white px-3 py-2.5 text-[13px] text-slate-600 ring-1 ring-slate-100 sm:text-sm"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-apple-surface text-apple-green">
                      <CheckCircle2 size={15} />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="sticky bottom-0 mt-6 space-y-2 bg-white/95 pt-3 backdrop-blur-md">
                <button
                  onClick={() => {
                    trackStudentCta(`upgrade_limit_${feature}`);
                    onUpgrade();
                  }}
                  className="apple-btn w-full"
                >
                  {moment.cta}
                </button>

                <button
                  onClick={onClose}
                  className="h-11 w-full rounded-full text-[14px] font-semibold text-slate-500 transition active:scale-[0.99] sm:hover:bg-slate-100 sm:hover:text-slate-700"
                >
                  {moment.dismiss}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
