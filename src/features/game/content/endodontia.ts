import type { ExerciseSeed } from '../types';

export const ENDODONTIA_EXERCISES: ExerciseSeed[] = [
  {
    id: 'endo-01',
    kind: 'choice',
    difficulty: 2,
    prompt: 'Qual é a hipótese diagnóstica?',
    scenario:
      'Dor espontânea, que acorda o paciente à noite, piora com o frio e demora vários minutos para passar.',
    options: [
      'Sensibilidade dentinária',
      'Pulpite irreversível',
      'Pericoronarite',
      'Bruxismo',
    ],
    answer: 1,
    explanation:
      'Dor espontânea e resposta prolongada ao frio são compatíveis com pulpite irreversível sintomática. O diagnóstico deve combinar história, testes de sensibilidade pulpar, exame apical e imagem.',
  },
  {
    id: 'endo-02',
    kind: 'boolean',
    difficulty: 1,
    prompt: 'Verdadeiro ou falso?',
    statement: 'A instrumentação deve ocorrer com irrigação adequada e renovada durante o preparo.',
    answer: true,
    explanation:
      'A irrigação auxilia na remoção de detritos, lubrificação e redução microbiana. Volume, frequência e técnica devem seguir um protocolo seguro, sem pressão apical excessiva.',
  },
  {
    id: 'endo-03',
    kind: 'order',
    difficulty: 2,
    prompt: 'Ordene a sessão de endodontia',
    steps: [
      'Anestesia e teste da região',
      'Isolamento absoluto',
      'Acesso e localização dos canais',
      'Odontometria (comprimento de trabalho)',
      'Preparo químico-mecânico',
      'Irrigação final e obturação, ou medicação e selamento se a sessão não puder ser concluída',
    ],
    explanation:
      'O isolamento precede o acesso. Quando o preparo pode ser concluído adequadamente, a obturação em sessão única é uma opção; medicação intracanal e provisório são usados quando houver indicação de tratamento em mais de uma sessão.',
  },
  {
    id: 'endo-04',
    kind: 'blank',
    difficulty: 2,
    prompt: 'Complete a frase',
    sentence: 'O irrigante mais usado no preparo químico-mecânico é o ___ de sódio.',
    answer: 'hipoclorito',
    bank: ['hipoclorito', 'bicarbonato', 'fluoreto', 'cloreto'],
    explanation:
      'Hipoclorito de sódio dissolve tecido orgânico e tem ação antimicrobiana. O EDTA complementa removendo a smear layer inorgânica.',
  },
  {
    id: 'endo-05',
    kind: 'choice',
    difficulty: 3,
    prompt: 'O que fazer na sessão de hoje?',
    scenario: 'A evolução anterior registra: "acesso realizado, odontometria concluída, CT 21 mm".',
    options: [
      'Refazer o acesso para conferir',
      'Continuar de onde parou: confirmar canais e comprimento e instrumentar',
      'Obturar direto sem instrumentar',
      'Recomeçar o caso do zero',
    ],
    answer: 1,
    explanation:
      'Sob isolamento, remove-se o provisório e reavaliam-se sintomas, anatomia, permeabilidade e comprimento de trabalho. O acesso só deve ser ampliado quando isso for necessário para localizar ou instrumentar os canais com segurança.',
  },
  {
    id: 'endo-06',
    kind: 'match',
    difficulty: 3,
    prompt: 'Relacione o termo com o significado',
    pairs: [
      {
        left: 'Patência apical',
        right: 'Passagem passiva de lima fina pelo forame sem ampliá-lo',
      },
      { left: 'Glide path', right: 'Trajeto inicial reproduzível para a instrumentação' },
      { left: 'Comprimento de trabalho', right: 'Limite planejado do preparo e da obturação' },
      { left: 'Smear layer', right: 'Camada de resíduos aderida à parede do canal' },
    ],
    explanation:
      'Esses conceitos orientam o preparo. A patência não deve ser confundida com ampliação deliberada do forame.',
  },
  {
    id: 'endo-07',
    kind: 'multi',
    difficulty: 2,
    prompt: 'Selecione o que precisa constar na evolução da sessão',
    options: [
      'Dente e canais trabalhados',
      'Comprimento de trabalho',
      'Irrigante e medicação usados',
      'Marca do carro do paciente',
      'Tipo de selamento provisório',
    ],
    answers: [0, 1, 2, 4],
    explanation:
      'O registro permite continuidade segura entre sessões e deve documentar medidas, substâncias, intercorrências e selamento realizado.',
  },
  {
    id: 'endo-08',
    kind: 'choice',
    difficulty: 2,
    prompt: 'Qual acesso é o correto?',
    options: [
      'O menor possível, mesmo que a lima entre forçada',
      'Conservador, porém suficiente para instrumentar em linha reta e sem degraus',
      'O maior possível, para enxergar bem',
      'Pela face vestibular em molares, por ser mais direto',
    ],
    answer: 1,
    explanation:
      'Acesso pequeno demais gera desvio, degrau e fratura de instrumento; grande demais enfraquece o dente. O equilíbrio é o objetivo.',
  },
  {
    id: 'endo-09',
    kind: 'boolean',
    difficulty: 2,
    prompt: 'Verdadeiro ou falso?',
    statement:
      'A leitura do localizador foraminal deve ser interpretada com os dados clínicos e a imagem indicada para o caso.',
    answer: true,
    explanation:
      'O localizador eletrônico é útil para estabelecer o comprimento de trabalho, enquanto a radiografia informa anatomia e relação apical. A necessidade e o momento da imagem devem seguir o caso e o protocolo institucional.',
  },
  {
    id: 'endo-10',
    kind: 'choice',
    difficulty: 3,
    prompt: 'Qual é a conduta na urgência?',
    scenario: 'Necrose pulpar com abscesso periapical agudo, edema localizado e dor intensa no 45.',
    options: [
      'Só prescrever antibiótico e remarcar',
      'Desbridar e drenar pelo canal quando possível, incisar coleção flutuante se indicada e definir o tratamento',
      'Exodontia imediata',
      'Apenas analgésico e bolsa de gelo',
    ],
    answer: 1,
    explanation:
      'O controle local da fonte inclui desbridamento e drenagem; edema flutuante pode exigir incisão. Antibiótico não substitui o procedimento e é reservado, em geral, para disseminação, sinais sistêmicos ou comprometimento do hospedeiro.',
  },
  {
    id: 'endo-11',
    kind: 'blank',
    difficulty: 2,
    prompt: 'Complete a frase',
    sentence: 'A medicação intracanal mais usada entre sessões é o ___ de cálcio.',
    answer: 'hidróxido',
    bank: ['hidróxido', 'sulfato', 'fosfato', 'carbonato'],
    explanation:
      'Quando há indicação de medicação entre sessões, o hidróxido de cálcio é uma opção frequente por sua ação antimicrobiana. Ele não é necessário quando o caso pode ser adequadamente concluído em sessão única.',
  },
  {
    id: 'endo-12',
    kind: 'choice',
    difficulty: 3,
    prompt: 'O que provavelmente aconteceu?',
    scenario:
      'Durante a irrigação, o paciente relata dor súbita e intensa, com edema aparecendo rapidamente.',
    options: [
      'Reação normal ao hipoclorito',
      'Possível acidente com extravasamento de hipoclorito para os tecidos periapicais',
      'Anestesia acabando',
      'Sinusite',
    ],
    answer: 1,
    explanation:
      'Dor súbita e edema rápido sugerem extravasamento. Deve-se interromper a irrigação, aspirar sem nova pressão, avaliar via aérea e extensão, controlar a dor, documentar e acompanhar. Edema progressivo, disfagia, dispneia ou comprometimento ocular exigem atendimento de urgência.',
  },
];
