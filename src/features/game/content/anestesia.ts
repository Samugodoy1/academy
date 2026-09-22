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
      'O bloqueio do nervo alveolar inferior é uma técnica previsível para anestesia pulpar de molares inferiores, e o nervo lingual costuma ser anestesiado durante a retirada da agulha. Técnicas complementares podem ser necessárias.',
  },
  {
    id: 'anest-02',
    kind: 'boolean',
    difficulty: 1,
    prompt: 'Verdadeiro ou falso?',
    statement:
      'A aspiração cuidadosa é recomendada antes da deposição do anestésico, inclusive em técnicas infiltrativas.',
    answer: true,
    explanation:
      'A aspiração reduz, mas não elimina, o risco de injeção intravascular. Em bloqueios e regiões vascularizadas, pode ser necessário aspirar em mais de um plano e durante a deposição.',
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
      'Uma solução a 2% contém 20 mg/ml. Assim, 20 × 1,8 = 36 mg por tubete, valor usado no cálculo da dose total.',
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
      'O quadro é compatível com síncope vasovagal, e não demonstra alergia ao anestésico. Deve-se interromper o procedimento, posicionar o paciente, avaliar vias aéreas e monitorar sinais vitais.',
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
      'A injeção lenta reduz desconforto e picos sistêmicos. Após a latência apropriada, a região deve ser testada antes do início do procedimento.',
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
      { left: 'Forame mentual', right: 'Anestesia de lábio e tecidos moles vestibulares' },
    ],
    explanation:
      'O bloqueio mentual não produz anestesia pulpar previsível. Para a polpa de pré-molares e dentes anteriores inferiores, considera-se o bloqueio incisivo ou outra técnica apropriada.',
  },
  {
    id: 'anest-07',
    kind: 'choice',
    difficulty: 3,
    prompt: 'Como planejar a anestesia local?',
    scenario:
      'Paciente cardiopata controlado, com orientação médica de limitar vasoconstritor adrenérgico, precisa de restauração de 40 minutos.',
    options: [
      'Usar lidocaína com epinefrina 1:50.000 sem limitar o número de tubetes',
      'Avaliar a condição cardiovascular e usar a menor dose eficaz, limitando a epinefrina conforme o plano médico',
      'Articaína 4% com epinefrina 1:100.000 em dose dobrada',
      'Anestesia tópica apenas',
    ],
    answer: 1,
    explanation:
      'Vasoconstritores raramente são absolutamente contraindicados em cardiopatia controlada. Quando houver necessidade de cautela, a dose de epinefrina em adultos costuma ser limitada a 0,04 mg, com injeção lenta e aspiração repetida. Soluções sem vasoconstritor ou com outros vasoconstritores também exigem avaliação individual.',
  },
  {
    id: 'anest-08',
    kind: 'boolean',
    difficulty: 2,
    prompt: 'Verdadeiro ou falso?',
    statement: 'Tecido inflamado e com pH ácido reduz a eficácia do anestésico local.',
    answer: true,
    explanation:
      'Em tecido infectado e ácido, há menos anestésico na forma capaz de atravessar a membrana. Falhas em pulpites também envolvem sensibilização neural, anatomia e técnica, não apenas o pH.',
  },
  {
    id: 'anest-09',
    kind: 'choice',
    difficulty: 2,
    prompt: 'O bloqueio falhou. E agora?',
    scenario:
      'Você bloqueou o alveolar inferior, aguardou 12 minutos e o teste pulpar ainda provoca resposta dolorosa no 36.',
    options: [
      'Repetir mais dois tubetes na mesma hora, sem reavaliar',
      'Reavaliar referências, tempo de latência e inflamação e complementar com técnica adequada',
      'Começar mesmo assim, com o paciente segurando firme',
      'Trocar de paciente',
    ],
    answer: 1,
    explanation:
      'Antes de repetir a dose, deve-se rever técnica, referências anatômicas, latência, dose já administrada e condição pulpar. A técnica complementar é escolhida conforme o procedimento e o diagnóstico.',
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
      'O vasoconstritor pode reduzir a absorção sistêmica do anestésico, prolongar o efeito e diminuir o sangramento. Sua dose e o risco cardiovascular devem ser considerados para cada paciente.',
  },
  {
    id: 'anest-12',
    kind: 'choice',
    difficulty: 3,
    prompt: 'Como calcular a dose desta criança?',
    scenario: 'Criança de 20 kg, lidocaína 2% com epinefrina, dose máxima de 4,4 mg/kg.',
    options: [
      '1 tubete padrão, como no adulto',
      'Máximo teórico de 88 mg, equivalente a cerca de 2,4 tubetes de 1,8 ml',
      '4 tubetes, porque criança metaboliza rápido',
      'Não é possível calcular sem exame de sangue',
    ],
    answer: 1,
    explanation:
      '20 kg × 4,4 mg/kg = 88 mg. Como cada tubete contém 36 mg, 88 ÷ 36 = 2,44 tubetes. Esse é um teto calculado, não uma dose-alvo; deve-se usar a menor dose eficaz e contabilizar todo anestésico administrado.',
  },
];
