import type { ExerciseSeed } from '../types';

export const ANESTESIA_EXERCISES: ExerciseSeed[] = [
  {
    id: 'anest-01',
    kind: 'choice',
    difficulty: 1,
    prompt: 'Qual técnica você escolhe?',
    scenario: 'Restauração no 46, com necessidade de anestesia de polpa e gengiva lingual.',
    options: [
      'Infiltrativa vestibular apenas',
      'Bloqueio do nervo alveolar inferior (com lingual)',
      'Intraligamentar isolada',
      'Anestesia tópica em gel',
    ],
    answer: 1,
    explanation:
      'A cortical mandibular posterior é espessa: infiltrativa não alcança bem a polpa. O bloqueio do alveolar inferior é a técnica de escolha, e o lingual costuma vir junto.',
  },
  {
    id: 'anest-02',
    kind: 'boolean',
    difficulty: 1,
    prompt: 'Verdadeiro ou falso?',
    statement: 'Aspirar antes de injetar é opcional quando a técnica é infiltrativa.',
    answer: false,
    explanation:
      'Aspiração é sempre obrigatória. Injeção intravascular de anestésico com vasoconstritor pode causar taquicardia, tremor e reação sistêmica.',
  },
  {
    id: 'anest-03',
    kind: 'blank',
    difficulty: 2,
    prompt: 'Complete o cálculo',
    sentence: 'Um tubete de 1,8 ml de lidocaína a 2% contém ___ mg de sal anestésico.',
    answer: '36',
    bank: ['36', '18', '54', '20'],
    explanation:
      '2% = 20 mg/ml. 20 × 1,8 = 36 mg por tubete. Guardar esse número é o que permite calcular dose máxima na hora.',
  },
  {
    id: 'anest-04',
    kind: 'choice',
    difficulty: 3,
    prompt: 'Qual é a conduta imediata?',
    scenario:
      'Logo após a injeção, o paciente fica pálido, sudoreico, com tontura e visão escurecendo.',
    options: [
      'Registrar alergia ao anestésico no prontuário',
      'Posição supina com pernas elevadas, monitorar e tranquilizar',
      'Aplicar mais anestésico para continuar rápido',
      'Liberar o paciente para tomar ar na rua',
    ],
    answer: 1,
    explanation:
      'Quadro clássico de lipotimia (reação vasovagal), muito mais comum que alergia. Deite o paciente, eleve as pernas, monitore sinais vitais e não rotule como alergia.',
  },
  {
    id: 'anest-05',
    kind: 'order',
    difficulty: 2,
    prompt: 'Ordene a aplicação segura',
    steps: [
      'Revisar anamnese e calcular a dose máxima',
      'Aplicar anestésico tópico na mucosa seca',
      'Puncionar e aspirar',
      'Injetar lentamente',
      'Aguardar a latência e testar a região',
    ],
    explanation:
      'Injeção lenta (cerca de 1 ml por minuto) reduz dor e risco de reação. Testar antes de começar evita a pior cena: o paciente sentir no meio do procedimento.',
  },
  {
    id: 'anest-06',
    kind: 'match',
    difficulty: 2,
    prompt: 'Relacione a estrutura com a técnica',
    pairs: [
      { left: 'Rafe pterigomandibular', right: 'Bloqueio do alveolar inferior' },
      { left: 'Forame palatino maior', right: 'Anestesia do palato posterior' },
      { left: 'Fundo de sulco vestibular', right: 'Infiltrativa supraperiosteal' },
      { left: 'Forame mentual', right: 'Anestesia de pré-molares inferiores e lábio' },
    ],
    explanation:
      'Referência anatômica errada é a causa número um de falha anestésica. Antes de repetir o tubete, revise o ponto de punção.',
  },
  {
    id: 'anest-07',
    kind: 'choice',
    difficulty: 3,
    prompt: 'Qual sal você prefere?',
    scenario:
      'Paciente cardiopata controlado, com orientação médica de limitar vasoconstritor adrenérgico, precisa de restauração de 40 minutos.',
    options: [
      'Lidocaína 2% com epinefrina 1:50.000',
      'Mepivacaína 3% sem vasoconstritor ou prilocaína com felipressina, conforme orientação',
      'Articaína 4% com epinefrina 1:100.000 em dose dobrada',
      'Anestesia tópica apenas',
    ],
    answer: 1,
    explanation:
      'Em restrição a vasoconstritor adrenérgico, a escolha recai sobre mepivacaína 3% sem vasoconstritor ou prilocaína com felipressina — sempre confirmando com o professor e a orientação médica.',
  },
  {
    id: 'anest-08',
    kind: 'boolean',
    difficulty: 2,
    prompt: 'Verdadeiro ou falso?',
    statement: 'Tecido inflamado e com pH ácido reduz a eficácia do anestésico local.',
    answer: true,
    explanation:
      'Em meio ácido, menos moléculas ficam na forma não ionizada capaz de atravessar a membrana. Por isso a anestesia falha com mais frequência em abscessos e pulpites.',
  },
  {
    id: 'anest-09',
    kind: 'choice',
    difficulty: 2,
    prompt: 'O bloqueio falhou. E agora?',
    scenario: 'Você bloqueou o alveolar inferior, esperou 5 minutos e o paciente ainda sente o 36.',
    options: [
      'Repetir mais dois tubetes na mesma hora, sem reavaliar',
      'Reavaliar referências, tempo de latência e inflamação e complementar com técnica adequada',
      'Começar mesmo assim, com o paciente segurando firme',
      'Trocar de paciente',
    ],
    answer: 1,
    explanation:
      'Falha se investiga antes de repetir: técnica, anatomia, latência e inflamação local. Complementos (infiltrativa, intraligamentar, intrapulpar) são escolhidos com critério e supervisão.',
  },
  {
    id: 'anest-10',
    kind: 'multi',
    difficulty: 3,
    prompt: 'Selecione os sinais de toxicidade sistêmica por anestésico',
    options: [
      'Formigamento perioral e gosto metálico',
      'Tremores e agitação',
      'Convulsão em casos graves',
      'Melhora imediata da ansiedade',
      'Depressão do sistema nervoso central',
    ],
    answers: [0, 1, 2, 4],
    explanation:
      'Toxicidade começa com excitação (formigamento, tremor, agitação) e pode evoluir para convulsão e depressão do SNC. Por isso a dose se calcula, não se estima.',
  },
  {
    id: 'anest-11',
    kind: 'blank',
    difficulty: 2,
    prompt: 'Complete a frase',
    sentence: 'O vasoconstritor prolonga a anestesia e reduz o ___ no campo operatório.',
    answer: 'sangramento',
    bank: ['sangramento', 'edema', 'trismo', 'pH'],
    explanation:
      'Vasoconstritor reduz absorção sistêmica (mais segurança), prolonga a duração e melhora a visibilidade por diminuir o sangramento.',
  },
  {
    id: 'anest-12',
    kind: 'choice',
    difficulty: 3,
    prompt: 'Como calcular a dose desta criança?',
    scenario: 'Criança de 20 kg, lidocaína 2% com epinefrina, dose máxima de 4,4 mg/kg.',
    options: [
      '1 tubete padrão, como no adulto',
      '88 mg no total, ou aproximadamente 2,4 tubetes',
      '4 tubetes, porque criança metaboliza rápido',
      'Não é possível calcular sem exame de sangue',
    ],
    answer: 1,
    explanation:
      '20 kg × 4,4 mg/kg = 88 mg. Cada tubete tem 36 mg, então o limite fica em torno de 2,4 tubetes. Em criança, a dose se calcula antes — nunca durante.',
  },
];
