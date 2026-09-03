import { BookOpen, Calendar, Home, User, Users } from '../../icons';

export const ACADEMY_NAV = [
  { id: 'dashboard', label: 'Hoje', short: 'Hoje', description: 'O seu dia', icon: Home },
  { id: 'pacientes', label: 'Pacientes', short: 'Casos', description: 'Os seus casos', icon: Users },
  { id: 'agenda', label: 'Agenda', short: 'Agenda', description: 'Os boxes', icon: Calendar },
  { id: 'estudos', label: 'Estudos', short: 'Cola', description: 'Antes de sentar', icon: BookOpen },
  { id: 'configuracoes', label: 'Conta', short: 'Você', description: 'Você', icon: User },
] as const;

export type AcademyNavId = (typeof ACADEMY_NAV)[number]['id'];
