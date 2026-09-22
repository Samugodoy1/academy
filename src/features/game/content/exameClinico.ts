import type { ExerciseSeed } from '../types';

export const EXAME_CLINICO_EXERCISES: ExerciseSeed[] = [
  {
    id: 'exame-01',
    kind: 'choice',
    difficulty: 1,
    prompt: 'Qual é a primeira conduta mais adequada?',
    scenario: 'A paciente senta na cadeira e diz: "dói quando tomo água gelada, mas passa rápido".',
    options: [
      'Registrar a queixa nas palavras da paciente e investigar início, duração, intensidade e fatores associados',
      'Anotar "sensibilidade" e já pedir panorâmica',
      'Começar a restauração do dente mais escurecido',
      'Prescrever analgésico e remarcar',
    ],
    answer: 0,
    explanation:
      'A queixa principal deve ser caracterizada antes do exame e dos testes dirigidos. Início, duração, intensidade, localização, fatores desencadeantes e fatores de alívio ajudam a formular hipóteses diagnósticas.',
  },
  {
    id: 'exame-02',
    kind: 'order',
    difficulty: 2,
    prompt: 'Em uma consulta inicial sem urgência, organize uma sequência clínica possível',
    steps: [
      'Anamnese e queixa principal',
      'Exame extraoral (face, linfonodos, ATM)',
      'Exame intraoral de tecidos moles',
      'Exame dos dentes e do periodonto',
      'Testes e exames de imagem indicados pelos achados',
    ],
    explanation:
      'Uma sequência sistemática reduz omissões. Testes e imagens devem responder a perguntas clínicas e podem ser antecipados quando uma urgência ou um achado exigir.',
  },
  {
    id: 'exame-03',
    kind: 'boolean',
    difficulty: 2,
    prompt: 'Verdadeiro ou falso?',
    statement: 'Um achado radiográfico sozinho já fecha o diagnóstico.',
    answer: false,
    explanation:
      'A radiografia é um exame complementar. Sua interpretação deve ser integrada à história, ao exame clínico e aos testes pertinentes.',
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
      'Avaliar e controlar a dor do 46 e a inflamação gengival antes do clareamento',
      'Moldar para clareamento e tratar a dor no retorno',
      'Encaminhar direto para a endodontia sem examinar',
    ],
    answer: 1,
    explanation:
      'A dor espontânea exige diagnóstico e manejo antes de um procedimento eletivo. O sangramento gengival também deve ser avaliado e controlado antes do clareamento.',
  },
  {
    id: 'exame-05',
    kind: 'multi',
    difficulty: 2,
    prompt: 'Selecione os dados médicos relevantes representados nas opções',
    options: [
      'Doenças sistêmicas',
      'Medicamentos em uso',
      'Alergias',
      'Cor preferida da resina',
      'Gestação ou amamentação, quando aplicável',
    ],
    answers: [0, 1, 2, 4],
    explanation:
      'Doenças, medicamentos, alergias e condições como gestação ou amamentação podem modificar exames, anestesia e prescrição. A anamnese completa também deve ser adaptada à pessoa e ao procedimento planejado.',
  },
  {
    id: 'exame-06',
    kind: 'match',
    difficulty: 2,
    prompt: 'Relacione o teste com o que ele investiga',
    pairs: [
      { left: 'Percussão vertical', right: 'Resposta dos tecidos apicais' },
      {
        left: 'Sondagem periodontal associada à posição da margem gengival',
        right: 'Nível clínico de inserção',
      },
      { left: 'Teste de frio', right: 'Sensibilidade pulpar' },
      { left: 'Palpação de fundo de sulco', right: 'Sensibilidade ou aumento de volume apical' },
    ],
    explanation:
      'Cada teste fornece uma informação específica. Nenhum deles, isoladamente, estabelece o diagnóstico pulpar, apical ou periodontal.',
  },
  {
    id: 'exame-07',
    kind: 'blank',
    difficulty: 1,
    prompt: 'Complete a frase',
    sentence: 'Após o diagnóstico e o manejo de urgências, o controle inicial da doença integra a fase de ___ do meio bucal.',
    answer: 'adequação',
    bank: ['adequação', 'reabilitação', 'manutenção', 'estética'],
    explanation:
      'A adequação do meio busca controlar biofilme, inflamação e lesões ativas antes de tratamentos definitivos. Urgências são priorizadas conforme a necessidade clínica.',
  },
  {
    id: 'exame-08',
    kind: 'choice',
    difficulty: 3,
    prompt: 'Qual é a abordagem adequada antes da exodontia?',
    scenario:
      'Homem de 58 anos, hipertenso, relata losartana e "um remédio para afinar o sangue", mas não sabe informar o nome. Está prevista uma exodontia.',
    options: [
      'Nenhum: pode seguir o atendimento normalmente',
      'Apenas aferir a pressão, pois o outro medicamento não interfere no procedimento',
      'Aferir a pressão e identificar o antitrombótico, a dose e o horário antes de avaliar o risco hemorrágico',
      'A idade, que contraindica anestesia com vasoconstritor',
    ],
    answer: 2,
    explanation:
      'É necessário identificar se o medicamento é anticoagulante ou antiagregante e conhecer seu esquema. A conduta depende do fármaco e do risco do procedimento; ele não deve ser suspenso sem protocolo ou orientação do prescritor. Pressão arterial e condições sistêmicas também devem ser avaliadas.',
  },
  {
    id: 'exame-09',
    kind: 'boolean',
    difficulty: 1,
    prompt: 'Verdadeiro ou falso?',
    statement:
      'O exame inicial deve incluir registros dentários e avaliação periodontal compatíveis com os achados e o risco do paciente.',
    answer: true,
    explanation:
      'O odontograma e a avaliação periodontal documentam a condição inicial. A necessidade de um periodontograma completo depende do rastreamento, dos achados e do risco periodontal.',
  },
  {
    id: 'exame-10',
    kind: 'choice',
    difficulty: 3,
    prompt: 'Qual é a conduta mais adequada diante desse achado?',
    scenario:
      'Úlcera única no bordo lateral da língua, há mais de 3 semanas, indolor, bordas endurecidas, em fumante de 60 anos.',
    options: [
      'Afta comum, basta orientar bochecho',
      'Tratar como lesão suspeita e encaminhar com urgência para avaliação e biópsia, se indicada',
      'Herpes labial recorrente',
      'Queimadura por alimento quente',
    ],
    answer: 1,
    explanation:
      'Uma úlcera inexplicada persistente por três semanas, especialmente com endurecimento e tabagismo, requer investigação urgente. O diagnóstico definitivo depende de avaliação especializada e exame histopatológico quando indicado.',
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
    prompt: 'Em um caso sem urgência imediata, organize as fases gerais do planejamento',
    steps: [
      'Diagnóstico, avaliação de risco e definição de prioridades',
      'Adequação do meio e controle das doenças ativas',
      'Tratamentos definitivos na sequência indicada para o caso',
      'Reabilitação protética',
      'Manutenção e proservação',
    ],
    explanation:
      'O plano deve ser individualizado e pode mudar conforme a resposta ao tratamento. Dor, infecção ou risco agudo são tratados antes dessa sequência eletiva.',
  },
];
