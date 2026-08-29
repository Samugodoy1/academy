import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Sparkles, X } from '../../icons';

export const UpgradeLimitModal = ({ data, onClose, onUpgrade }: any) => {
  const isPdfFeature = data?.feature === 'pdf';
  const isAppointmentLimit = !isPdfFeature && data?.limit && data.limit > 3;
  const limit = data?.limit || 3;
  const currentUsage = data?.currentUsage || limit;
  const progress = Math.min(100, Math.round((currentUsage / limit) * 100));

  const headlineText = isPdfFeature
    ? 'Exportar caso em PDF é exclusivo do Academy Student.'
    : isAppointmentLimit
      ? 'Você atingiu o limite de agendamentos deste mês.'
      : 'Seu Academy já tem seus primeiros casos.';

  const descriptionText = isPdfFeature
    ? 'Gere um resumo do caso para revisão, estudo e apresentação acadêmica. Esse recurso faz parte do plano pago do Academy.'
    : isAppointmentLimit
      ? `Você já agendou ${currentUsage} atendimentos neste mês. Para continuar agendando sem limite, mude para o Academy Student.`
      : `Você já organizou ${currentUsage} casos. Para continuar acompanhando seus pacientes, evoluções e atendimentos da faculdade, mude para o Academy Student.`;

  const barLabel = isAppointmentLimit ? 'Agendamentos no mês' : 'Casos no Free';
  const benefitItems = isPdfFeature
    ? ['Exportar casos clínicos em PDF', 'Casos e agenda ilimitados', 'Modo box e evoluções completos']
    : ['Casos ilimitados', 'Agenda acadêmica sem limite', 'Evoluções e modo box completos'];

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
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-[20px] bg-slate-950 text-white shadow-lg shadow-slate-950/15 sm:h-16 sm:w-16 sm:rounded-[22px]">
                <Sparkles size={25} />
              </div>

              <div className="text-center">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 sm:text-[11px]">
                  Academy Free
                </p>

                <h2 className="mx-auto max-w-[330px] text-[25px] font-bold leading-[1.06] tracking-[-0.055em] text-slate-950 sm:max-w-[360px] sm:text-[28px]">
                  {headlineText}
                </h2>

                <p className="mx-auto mt-3 max-w-[330px] text-[14px] leading-6 text-slate-500 sm:mt-4 sm:max-w-[360px] sm:text-[15px]">
                  {descriptionText}
                </p>
              </div>

              {!isPdfFeature && (
                <div className="mt-6 rounded-[22px] border border-slate-100 bg-slate-50/80 p-4 sm:rounded-[24px]">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">
                      {barLabel}
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

              <div className={`grid gap-2 ${isPdfFeature ? 'mt-6' : 'mt-4'}`}>
                {benefitItems.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl bg-white px-3 py-2.5 text-[13px] text-slate-600 ring-1 ring-slate-100 sm:text-sm"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <CheckCircle2 size={15} />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="sticky bottom-0 mt-6 space-y-2 bg-white/95 pt-3 backdrop-blur-md">
                <button
                  onClick={onUpgrade}
                  className="h-12 w-full rounded-full bg-slate-950 text-[15px] font-bold text-white shadow-[0_12px_30px_rgba(15,23,42,0.22)] transition active:scale-[0.99] sm:hover:-translate-y-0.5 sm:hover:bg-slate-800"
                >
                  Mudar para Student
                </button>

                <button
                  onClick={onClose}
                  className="h-11 w-full rounded-full text-[14px] font-semibold text-slate-500 transition active:scale-[0.99] sm:hover:bg-slate-100 sm:hover:text-slate-700"
                >
                  Continuar no Free
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
