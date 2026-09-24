/**
 * Copy de conversão do Academy.
 *
 * Regra principal:
 * o aluno não compra "recursos". Ele compra uma rotina mais organizada
 * para estudar e chegar melhor preparado na clínica.
 *
 * O Free precisa entregar valor real, mas o Student precisa resolver uma
 * necessidade recorrente. A copy mostra essa diferença sem pressionar
 * artificialmente o aluno.
 */

export type UpgradeFeature = 'pdf' | 'cases' | 'appointments' | 'box';

export interface UpgradeMoment {
  kicker: string;
  headline: string;
  body: string;
  cta: string;
  dismiss: string;
  benefits: string[];
  usageLabel?: string;
}

export const UPGRADE_MOMENT: Record<UpgradeFeature, UpgradeMoment> = {
  cases: {
    kicker: 'Academy Student',
    headline: 'Continue acompanhando sua clínica por aqui.',
    body: 'Você já começou este caso no Academy. No Student, você pode continuar cadastrando pacientes, registrar as evoluções e manter os atendimentos do semestre organizados em um só lugar.',
    cta: 'Conhecer o Student',
    dismiss: 'Continuar no Free',
    usageLabel: 'Seu limite no Free',
    benefits: [
      'Casos e evoluções durante todo o semestre',
      'Modo Box para acompanhar o atendimento',
      'Agenda acadêmica sem limite',
    ],
  },
  box: {
    kicker: 'Academy Student',
    headline: 'É aqui que o Academy fica útil durante o atendimento.',
    body: 'O Modo Box transforma o caso em orientação para a cadeira: o que conferir, o que preparar e quais pontos merecem atenção. Ele está disponível no Student.',
    cta: 'Conhecer o Modo Box',
    dismiss: 'Continuar sem o Modo Box',
    benefits: [
      'Orientação do atendimento dentro do caso',
      'Checklist e informações importantes na hora certa',
      'Histórico do caso sempre à mão',
    ],
  },
  appointments: {
    kicker: 'Academy Student',
    headline: 'Continue organizando seus atendimentos.',
    body: 'Você já está usando a agenda do Academy. No Student, os atendimentos do semestre ficam organizados junto aos pacientes, casos e evoluções.',
    cta: 'Conhecer o Student',
    dismiss: 'Continuar no Free',
    usageLabel: 'Agendamentos no mês',
    benefits: [
      'Agenda acadêmica sem limite mensal',
      'Pacientes e atendimentos no mesmo lugar',
      'Modo Box durante a clínica',
    ],
  },
  pdf: {
    kicker: 'Academy Student',
    headline: 'Leve o caso com você.',
    body: 'No Student, você pode gerar o PDF do caso para revisar, estudar ou apresentar na faculdade sem precisar montar tudo de novo.',
    cta: 'Gerar PDF no Student',
    dismiss: 'Continuar sem PDF',
    benefits: [
      'Resumo do caso em PDF',
      'Prontuário e evoluções organizados',
      'Modo Box durante o atendimento',
    ],
  },
};

export const STUDENT_PRIDE = {
  kicker: 'Seu Academy',
  headline: 'Tudo o que você precisa para acompanhar a faculdade e a clínica.',
  body: 'No Student, o Academy deixa de ser só um lugar para estudar e passa a acompanhar sua rotina: estudos, pacientes, casos, agenda e Modo Box.',
  owned: [
    'Seus casos e evoluções do semestre',
    'Seu Modo Box durante os atendimentos',
    'Sua agenda acadêmica sem limite',
  ],
  chairLine: 'Modo Box ativo. Abra o caso e siga o atendimento por aqui.',
  homeLine: 'Student ativo. Seus estudos e sua clínica ficam no mesmo lugar.',
  checkoutHeadline: 'Seu Academy está pronto para acompanhar o semestre.',
  checkoutBody: 'Agora você tem acesso ao Student. Cadastre seus pacientes, organize seus casos e use o Modo Box no próximo atendimento.',
  checkoutCta: 'Ir para o Academy',
  billingLine: 'Seu Student inclui casos, agenda e Modo Box para acompanhar sua rotina na faculdade.',
};

export const FREE_TENSION = {
  accountHeadline: 'Comece pelo Free. Continue quando fizer sentido.',
  accountBody: 'O Free permite conhecer o Academy e começar a organizar sua rotina. O Student libera o que você precisa quando a clínica começa a exigir mais: casos, agenda e Modo Box.',
  accountCta: 'Conhecer o Student',
  homeHeadline: 'Seu caso já começou. Quer continuar por aqui?',
  homeBody: 'O Academy pode acompanhar o caso durante o semestre. No Student, você libera novos pacientes, evoluções e o Modo Box para usar durante o atendimento.',
  homeCta: 'Conhecer o Student',
  prepLine: 'Quer usar o passo a passo durante o atendimento? Isso faz parte do Student.',
  priceLead: 'O Student foi feito para quem quer usar o Academy de verdade durante o semestre — estudando, organizando casos e atendendo.',
  subscribeCta: 'Assinar o Student',
};
