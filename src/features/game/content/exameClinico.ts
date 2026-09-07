import type { ExerciseSeed } from '../types';

export const EXAME_CLINICO_EXERCISES: ExerciseSeed[] = [
  {
    id: 'exame-01',
    kind: 'choice',
    difficulty: 1,
    prompt: 'Qual é a conduta certa?',
    scenario: 'A paciente senta na cadeira e diz: "dói quando tomo água gelada, mas passa rápido".',
    options: [
      'Registrar a queixa com as palavras dela e investigar início, duração e o que alivia',
      'Anotar "sensibilidade" e já pedir panorâmica',
      'Começar a restauração do dente mais escurecido',
      'Prescrever analgésico e remarcar',
    ],
    answer: 0,
    explanation:
      'A queixa principal é registrada com as palavras do paciente e detalhada: início, duração, intensidade, o que piora e o que alivia. É isso que direciona a hipótese diagnóstica.',
  },
  {
    id: 'exame-02',
    kind: 'order',
    difficulty: 2,
    prompt: 'Coloque o exame na ordem correta',
    steps: [
      'Anamnese e queixa principal',
      'Exame extraoral (face, linfonodos, ATM)',
      'Exame intraoral de tecidos moles',
      'Exame dos dentes e do periodonto',
      'Exames complementares (testes e imagem)',
    ],
    explanation:
      'Do geral para o específico: história, extraoral, tecidos moles, dentes e periodonto e só então os complementares. Assim nada importante fica para trás.',
  },
  {
    id: 'exame-03',
    kind: 'boolean',
    difficulty: 2,
    prompt: 'Verdadeiro ou falso?',
    statement: 'Um achado radiográfico sozinho já fecha o diagnóstico.',
    answer: false,
    explanation:
      'Radiografia é dado complementar. Diagnóstico é clínica + imagem + testes. Sem correlação clínica, a imagem vira suposição.',
  },
  {
    id: 'exame-04',
    kind: 'choice',
    difficulty: 2,
    prompt: 'O que vem primeiro?',
    scenario:
      'O paciente quer clarear os dentes para o casamento, mas tem dor espontânea no 46 e gengiva sangrando.',
    options: [
      'O clareamento, porque é o desejo do paciente',
      'A urgência: controlar dor e infecção, depois adequar o meio bucal',
      'Moldar para clareamento e tratar a dor no retorno',
      'Encaminhar direto para a endodontia sem examinar',
    ],
    answer: 1,
    explanation:
      'Dor, infecção e risco funcional vêm antes de qualquer procedimento eletivo. Explique isso ao paciente: o estético entra depois da doença controlada.',
  },
  {
    id: 'exame-05',
    kind: 'multi',
    difficulty: 2,
    prompt: 'Selecione tudo que é obrigatório na anamnese',
    options: [
      'Doenças sistêmicas',
      'Medicamentos em uso',
      'Alergias',
      'Cor preferida da resina',
      'Gestação e amamentação',
    ],
    answers: [0, 1, 2, 4],
    explanation:
      'Doenças, medicamentos, alergias e gestação mudam anestésico, prescrição e risco de sangramento. Cor de resina é escolha estética, não anamnese.',
  },
  {
    id: 'exame-06',
    kind: 'match',
    difficulty: 2,
    prompt: 'Relacione o teste com o que ele investiga',
    pairs: [
      { left: 'Percussão vertical', right: 'Inflamação periapical' },
      { left: 'Sondagem periodontal', right: 'Perda de inserção' },
      { left: 'Teste de frio', right: 'Vitalidade pulpar' },
      { left: 'Palpação de fundo de sulco', right: 'Processo inflamatório em tecido mole' },
    ],
    explanation:
      'Cada teste responde uma pergunta diferente. Escolher o teste certo é o que separa raciocínio clínico de tentativa.',
  },
  {
    id: 'exame-07',
    kind: 'blank',
    difficulty: 1,
    prompt: 'Complete a frase',
    sentence: 'O plano de tratamento começa pela fase de ___ do meio bucal.',
    answer: 'adequação',
    bank: ['adequação', 'reabilitação', 'manutenção', 'estética'],
    explanation:
      'Adequação do meio: controlar dor, infecção, biofilme e cárie ativa antes de partir para restaurações definitivas, prótese ou estética.',
  },
  {
    id: 'exame-08',
    kind: 'choice',
    difficulty: 3,
    prompt: 'Qual dado muda sua conduta hoje?',
    scenario: 'Homem de 58 anos, hipertenso, relata uso de losartana e "um remédio para afinar o sangue".',
    options: [
      'Nenhum: pode seguir o atendimento normalmente',
      'Só a hipertensão, que exige aferir a pressão',
      'O anticoagulante, que muda o planejamento de hemostasia e exige alinhar com o professor/médico',
      'A idade, que contraindica anestesia com vasoconstritor',
    ],
    answer: 2,
    explanation:
      'Anticoagulante não se suspende por conta própria. O manejo costuma ser hemostasia local bem planejada — e a conversa com professor e médico assistente vem antes do procedimento.',
  },
  {
    id: 'exame-09',
    kind: 'boolean',
    difficulty: 1,
    prompt: 'Verdadeiro ou falso?',
    statement: 'Odontograma e periodontograma atualizados fazem parte do exame inicial.',
    answer: true,
    explanation:
      'Sem registro não há como comparar evolução, justificar o plano ou defender sua conduta no prontuário.',
  },
  {
    id: 'exame-10',
    kind: 'choice',
    difficulty: 3,
    prompt: 'Qual é o diagnóstico diferencial mais provável?',
    scenario:
      'Úlcera única no bordo lateral da língua, há 3 semanas, indolor, bordas endurecidas, em fumante de 60 anos.',
    options: [
      'Afta comum, basta orientar bochecho',
      'Lesão suspeita de malignidade: exige encaminhamento e biópsia',
      'Herpes labial recorrente',
      'Queimadura por alimento quente',
    ],
    answer: 1,
    explanation:
      'Úlcera com mais de 15 dias, indolor, bordas endurecidas e fator de risco (tabagismo) é sinal de alerta para câncer bucal. Encaminhe — não observe indefinidamente.',
  },
  {
    id: 'exame-11',
    kind: 'blank',
    difficulty: 2,
    prompt: 'Complete a frase',
    sentence: 'Sinal é o que o profissional ___; sintoma é o que o paciente relata.',
    answer: 'observa',
    bank: ['observa', 'prescreve', 'imagina', 'registra'],
    explanation:
      'Sinal é objetivo (você vê, palpa, mede). Sintoma é subjetivo (o paciente conta). Misturar os dois no prontuário confunde o raciocínio.',
  },
  {
    id: 'exame-12',
    kind: 'order',
    difficulty: 3,
    prompt: 'Organize o plano por fases',
    steps: [
      'Urgência: dor e infecção',
      'Adequação do meio e controle de doença',
      'Tratamento restaurador e cirúrgico',
      'Reabilitação protética',
      'Manutenção e proservação',
    ],
    explanation:
      'Essa é a espinha dorsal de qualquer plano na clínica escola. Se você sabe justificar a ordem, sabe defender o caso.',
  },
];
