import { BookOpen, ClipboardList, Stethoscope, Tooth, User } from '../../icons';

export const ACADEMY_NAV = [
  { id: 'dashboard', label: 'Rotina', short: 'Hoje', icon: Stethoscope },
  { id: 'agenda', label: 'Agenda', short: 'Agenda', icon: ClipboardList },
  { id: 'pacientes', label: 'Casos', short: 'Casos', icon: Tooth },
  { id: 'estudos', label: 'Estudos', short: 'Estudos', icon: BookOpen },
  { id: 'configuracoes', label: 'Perfil', short: 'Você', icon: User },
] as const;

export type AcademyNavId = (typeof ACADEMY_NAV)[number]['id'];
