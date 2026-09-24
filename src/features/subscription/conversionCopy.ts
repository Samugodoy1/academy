/**
 * Copy de conversão do Academy.
 *
 * Princípios (produtos que convertem sem humilhar — Duolingo, Notion, Spotify):
 * - Efeito Zeigarnik: o semestre fica incompleto com 1 caso. A falta é o próximo nome, não uma lista de features.
 * - Aversão à perda no instante da parede: o paciente novo "fica de fora", o atendimento segue sem passo a passo.
 * - Dotação: só pede upgrade depois que a pessoa já tem um caso vivo.
 * - Identidade: Student é quem chega preparado na cadeira, não um recibo.
 * - Pico e fim: quem pagou ouve, no uso, que aquilo já é seu — reforço pós-compra, não novo anúncio.
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
    kicker: 'Academy Free',
    headline: 'O próximo paciente não entra.',
    body: 'Você já tem um caso vivo. A clínica do semestre não para nesse nome. No Student o próximo cadastro, o Modo Box e a agenda abrem juntos.',
    cta: 'Abrir o semestre no Student',
    dismiss: 'Deixar esse paciente de fora',
    usageLabel: 'Casos no Free',
    benefits: [
      'O próximo paciente entra na hora',
      'Modo Box no atendimento, não só na cabeça',
      'Agenda do mês sem teto',
    ],
  },
  box: {
    kicker: 'Academy Free',
    headline: 'O atendimento pede o Modo Box.',
    body: 'Checklist, bandeja e o passo deste procedimento ficam fechados no Free. Sem eles, o box depende só da memória — na hora em que a cadeira já está ocupada.',
    cta: 'Levar o Modo Box para a cadeira',
    dismiss: 'Atender sem o passo a passo',
    benefits: [
      'Passo a passo do procedimento aberto',
      'Bandeja e alertas da anamnese',
      'Casos e agenda do semestre sem teto',
    ],
  },
  appointments: {
    kicker: 'Academy Free',
    headline: 'Este mês da agenda fechou.',
    body: 'Os atendimentos deste mês já ocuparam o Free. O próximo horário da clínica só entra no Student — a agenda deixa de contar contra você.',
    cta: 'Liberar a agenda do mês',
    dismiss: 'Não marcar este horário',
    usageLabel: 'Agendamentos no mês',
    benefits: [
      'Horários do mês sem contagem',
      'Modo Box em cada atendimento',
      'Casos do semestre sem teto',
    ],
  },
  pdf: {
    kicker: 'Academy Free',
    headline: 'O caso não sai daqui em PDF.',
    body: 'O resumo para revisão, estudo e apresentação na faculdade é do Student. O prontuário continua no Free — o arquivo para levar, não.',
    cta: 'Gerar o PDF no Student',
    dismiss: 'Deixar o caso só na tela',
    benefits: [
      'PDF do caso para a faculdade',
      'Modo Box no atendimento',
      'Casos e agenda sem teto',
    ],
  },
};

export const STUDENT_PRIDE = {
  kicker: 'Student',
  headline: 'Você chega no box com o caso inteiro.',
  body: 'Modo Box, pacientes do semestre e o PDF do caso já são seus. O plano pago é presença na cadeira, não um selo.',
  owned: [
    'Seus casos, sem teto no semestre',
    'Seu Modo Box em todo atendimento',
    'Sua agenda, sem limite no mês',
  ],
  chairLine: 'Student. Este atendimento abre com checklist e bandeja.',
  homeLine: 'Student. Modo Box e os casos do semestre estão abertos.',
  checkoutHeadline: 'Agora o semestre cabe aqui.',
  checkoutBody: 'Você é Student. Modo Box, casos e o PDF do prontuário já estão abertos — use no próximo atendimento.',
  checkoutCta: 'Ir para a clínica',
  billingLine: 'Continua seu: Modo Box, casos do semestre e agenda sem teto no mês.',
};

export const FREE_TENSION = {
  accountHeadline: 'Um caso. O próximo fica de fora.',
  accountBody: 'O Free guarda um paciente para você sentir o fluxo. A lista da clínica, o Modo Box e a agenda do mês abrem no Student.',
  accountCta: 'Quero chegar preparado',
  homeHeadline: 'O próximo nome da lista não entra.',
  homeBody: 'Você já organizou o caso gratuito. O semestre da clínica pede o seguinte — e o Modo Box na hora de sentar.',
  homeCta: 'Abrir o semestre',
  prepLine: 'Isso é o aquecimento. O passo a passo na cadeira é do Student.',
  priceLead: 'O Free guarda um caso. O Student guarda o semestre — e o Modo Box na hora do atendimento.',
  subscribeCta: 'Quero o Student',
};
