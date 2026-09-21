export const ACADEMY_MODULE_COUNT = 21;

export type TourSlide = {
  kicker: string;
  title: string;
  body: string;
};

export type SetupStepId = 'patient' | 'appointment' | 'record' | 'cola';

export const ACADEMY_TOUR: TourSlide[] = [
  {
    kicker: 'OdontoHub Academy',
    title: 'A clínica da faculdade, no bolso.',
    body: 'Casos, box, prontuário e a Cola — o ritmo do atendimento, pensado para quem está na graduação.',
  },
  {
    kicker: 'Clínica',
    title: 'O caso vive no Academy.',
    body: 'Cadastre o paciente, marque o box e abra o prontuário. Anamnese, odontograma e evolução no mesmo lugar.',
  },
  {
    kicker: 'Cola',
    title: 'Antes de sentar, a Cola.',
    body: `${ACADEMY_MODULE_COUNT} módulos: exame, anestesia, endo, cirurgia e o resto da cadeira. O essencial, em minutos.`,
  },
  {
    kicker: 'Jogo',
    title: 'Treine jogando.',
    body: 'Lições curtas, ofensiva e missões. Uma sessão hoje e você chega no box mais afiado.',
  },
];

export const colaOnboardingKey = (userId?: number | string | null) =>
  `academy_onboarding_cola_${userId ?? 'anon'}`;

export const readColaOpened = (userId?: number | string | null) => {
  try {
    return localStorage.getItem(colaOnboardingKey(userId)) === '1';
  } catch {
    return false;
  }
};

export const writeColaOpened = (userId?: number | string | null) => {
  try {
    localStorage.setItem(colaOnboardingKey(userId), '1');
  } catch {
    /* storage indisponível */
  }
};
