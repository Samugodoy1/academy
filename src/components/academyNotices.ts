export type NoticeType = 'success' | 'error';

export type AcademyNotice = {
  message: string;
  type?: NoticeType;
  celebration?: boolean;
  onUndo?: () => void;
  actionLabel?: string;
  onAction?: () => void;
};

/** Quiet, iOS-banner copy for the most common patient/clinic events. */
export const NOTICE = {
  patientCreated: 'Paciente adicionado',
  patientUpdated: 'Alterações salvas',
  patientPhoto: 'Foto atualizada',
  firstPatient: 'Primeiro caso na lista',
  firstAppointment: 'Primeiro box marcado',
  appointmentCreated: 'Atendimento marcado',
  appointmentRescheduled: 'Horário atualizado',
  anamnesisSaved: 'Anamnese salva',
  evolutionSaved: 'Evolução no prontuário',
  evolutionClosed: 'Atendimento fechado',
  firstRecord: 'Prontuário aberto',
  profileUpdated: 'Perfil atualizado',
  profilePhoto: 'Foto de perfil atualizada',
} as const;

export const noticeDurationMs = (notice: AcademyNotice) => {
  if (notice.onUndo || notice.onAction) return 5200;
  if (notice.type === 'error') return 3800;
  if (notice.celebration) return 3600;
  return 2400;
};
