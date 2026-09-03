import { BookOpen, Calendar, Home, User, Users } from '../../icons';

export const ACADEMY_NAV = [
  { id: 'dashboard', label: 'Hoje', short: 'Hoje', description: 'O dia da clínica', icon: Home },
  { id: 'pacientes', label: 'Pacientes', short: 'Pacientes', description: 'Prontuários', icon: Users },
  { id: 'agenda', label: 'Agenda', short: 'Agenda', description: 'A semana', icon: Calendar },
  { id: 'estudos', label: 'Estudos', short: 'Estudos', description: 'Antes do box', icon: BookOpen },
  { id: 'configuracoes', label: 'Conta', short: 'Você', description: 'Perfil', icon: User },
] as const;

export type AcademyNavId = (typeof ACADEMY_NAV)[number]['id'];
