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
    style = 'bg-apple-surface text-apple-ink';
    icon = <Activity size={10} />;
  } else if (app.status === 'FINISHED') {
    label = 'Finalizado';
    style = 'bg-apple-surface text-apple-gray';
  } else if (app.status === 'NO_SHOW') {
    label = 'Faltou';
    style = 'bg-apple-surface text-apple-red';
    icon = <AlertCircle size={10} />;
  } else if (app.status === 'CANCELLED') {
    label = 'Cancelado';
    style = 'bg-apple-surface text-apple-gray';
    icon = <AlertCircle size={10} />;
  } else if (diffInMinutes < 0 && app.status === 'SCHEDULED') {
    label = 'Atrasado';
    style = 'bg-apple-surface text-apple-red';
    icon = <Clock size={10} />;
  } else if (diffInMinutes >= 0 && diffInMinutes <= 15 && app.status === 'SCHEDULED') {
    label = `Próximo em ${diffInMinutes} min`;
    style = 'bg-apple-surface text-apple-ink';
    icon = <Clock size={10} />;
  } else if (app.status === 'CONFIRMED') {
    label = 'Confirmado';
    style = 'bg-apple-surface text-apple-ink';
  } else {
    label = 'Agendado';
    style = 'bg-apple-surface text-apple-gray';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-normal ${style}`}>
      {icon}
      {label}
    </span>
  );
};
