import { Activity, AlertCircle, Clock } from '../../icons';
import type { Appointment } from '../../types/clinical';
import { parseAppointmentDateTime } from '../../utils/dateUtils';

export const StatusBadge = ({ app, now }: { app: Appointment; now: Date }) => {
  const startTime = parseAppointmentDateTime(app.start_time);
  const diffInMinutes = startTime ? Math.floor((startTime.getTime() - now.getTime()) / 60000) : 0;

  let label = '';
  let style = '';
  let icon = null;

  if (app.status === 'IN_PROGRESS') {
    label = 'Atendendo';
    style = 'bg-primary/10 text-primary border-primary/20';
    icon = <Activity size={10} className="animate-pulse" />;
  } else if (app.status === 'FINISHED') {
    label = 'Finalizado';
    style = 'bg-slate-100 text-slate-500 border-slate-200';
  } else if (app.status === 'NO_SHOW') {
    label = 'Faltou';
    style = 'bg-rose-50 text-rose-500 border-rose-100';
    icon = <AlertCircle size={10} />;
  } else if (app.status === 'CANCELLED') {
    label = 'Cancelado';
    style = 'bg-slate-100 text-slate-400 border-slate-200';
    icon = <AlertCircle size={10} />;
  } else if (diffInMinutes < 0 && app.status === 'SCHEDULED') {
    label = 'Atrasado';
    style = 'bg-rose-50 text-rose-500 border-rose-100 animate-pulse';
    icon = <Clock size={10} />;
  } else if (diffInMinutes >= 0 && diffInMinutes <= 15 && app.status === 'SCHEDULED') {
    label = `Próximo em ${diffInMinutes} min`;
    style = 'bg-amber-50 text-amber-600 border-amber-100 font-bold';
    icon = <Clock size={10} />;
  } else if (app.status === 'CONFIRMED') {
    label = 'Confirmado';
    style = 'bg-[#F3E8FF] text-academy-primary-dark border-[#DDD6FE]';
  } else {
    label = 'Agendado';
    style = 'bg-slate-50 text-slate-400 border-slate-100';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${style}`}>
      {icon}
      {label}
    </span>
  );
};
