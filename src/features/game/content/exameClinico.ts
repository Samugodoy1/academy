import type { ExerciseSeed } from '../types';
import { choice, gap, multi, order, pairs, truth } from './authoring';

export const EXAME_CLINICO_EXERCISES: ExerciseSeed[] = [
  choice(
    'exame-01',
    'Como registrar a queixa principal?',
    ['Com as palavras do paciente', 'Com o diagnóstico provável', 'Só com o número do dente', 'Depois da radiografia'],
    'A queixa principal é o motivo da consulta, nas palavras de quem sente. O diagnóstico vem depois do exame.',
    { difficulty: 1 }
  ),
  truth(
    'exame-02',
    'Sinal é o que o paciente relata.',
    false,
    'Sinal é o que você observa, palpa ou mede. Sintoma é o que o paciente conta.'
  ),
  gap(
    'exame-03',
    'Sintoma é o que o paciente ___.',
    'relata',
    ['observa', 'mede', 'prescreve'],
    'Sintoma é subjetivo: dor, ardência, "sensação de dente alto". Sinal é objetivo: edema, fístula, mobilidade.',
    1
  ),
  choice(
    'exame-04',
    'Qual é a hipótese mais provável?',
    ['Pulpite reversível', 'Pulpite irreversível', 'Necrose pulpar', 'Abscesso apical agudo'],
    'Dor provocada, curta e que cessa ao retirar o estímulo é o padrão da pulpite reversível.',
    { scenario: '"Dói quando tomo água gelada, mas passa em segundos."', difficulty: 1 }
  ),
  choice(
    'exame-05',
    'Qual é a hipótese mais provável?',
    ['Pulpite irreversível sintomática', 'Pulpite reversível', 'Hipersensibilidade dentinária', 'Gengivite'],
    'Dor espontânea, prolongada após o frio e que acorda o paciente aponta para inflamação pulpar irreversível.',
    { scenario: 'Dor espontânea no 36, que dura minutos após o frio e acordou o paciente à noite.' }
  ),
  choice(
    'exame-06',
    'O que esse conjunto de achados sugere?',
    ['Necrose pulpar com periodontite apical', 'Pulpite reversível', 'Dente hígido', 'Trauma oclusal isolado'],
    'Sem resposta ao frio, a polpa provavelmente está necrosada. A dor à percussão mostra que a inflamação chegou ao ápice.',
    { scenario: 'Dente 21 não responde ao frio e dói à percussão vertical.', difficulty: 3 }
  ),
  truth(
    'exame-07',
    'O teste de frio mede o fluxo sanguíneo da polpa.',
    false,
    'O frio testa a resposta das fibras nervosas, não a circulação. Por isso pode falhar em dentes traumatizados ou imaturos.',
    2
  ),
  pairs(
    'exame-08',
    'Relacione o teste ao que ele investiga',
    [
      ['Teste de frio', 'Sensibilidade pulpar'],
      ['Percussão vertical', 'Tecidos periapicais'],
      ['Sondagem', 'Profundidade do sulco ou bolsa'],
      ['Palpação apical', 'Dor ou volume no fundo de sulco'],
    ],
    'Cada teste responde a uma pergunta diferente. O diagnóstico nasce da soma deles com a história.'
  ),
  order(
    'exame-09',
    'Coloque a consulta inicial em ordem',
    ['Anamnese', 'Exame extraoral', 'Exame intraoral', 'Exames complementares', 'Diagnóstico e plano'],
    'Da história ao plano: a sequência sistemática evita esquecer regiões e pedir exames sem pergunta clínica.',
    { difficulty: 1 }
  ),
  choice(
    'exame-10',
    'Palpar linfonodos faz parte de qual etapa?',
    ['Exame extraoral', 'Exame intraoral', 'Anamnese', 'Exame periodontal'],
    'Face, linfonodos e ATM são avaliados no exame extraoral, antes de olhar a boca.',
    { difficulty: 1 }
  ),
  multi(
    'exame-11',
    'O que não pode faltar na história médica?',
    ['Doenças sistêmicas', 'Medicamentos em uso', 'Alergias'],
    ['Cor preferida da resina', 'Time de futebol'],
    'Doenças, remédios e alergias mudam anestesia, prescrição e conduta. Pergunte sempre, mesmo em consulta rápida.',
    { difficulty: 1 }
  ),
  choice(
    'exame-12',
    'O que vem primeiro?',
    ['Diagnosticar e tratar a dor do 46', 'Clarear, porque é o desejo dele', 'Moldar para o clareamento', 'Encaminhar direto para a endodontia'],
    'Dor espontânea é prioridade. Procedimento eletivo espera o controle do problema ativo.',
    { scenario: 'Paciente quer clarear para o casamento, mas tem dor espontânea no 46.' }
  ),
  truth(
    'exame-13',
    'Uma radiografia sozinha fecha o diagnóstico pulpar.',
    false,
    'A imagem mostra estrutura, não sensibilidade. Diagnóstico pulpar exige história, testes e imagem juntos.'
  ),
  gap(
    'exame-14',
    'Dor à percussão vertical sugere inflamação no ___.',
    'ligamento periodontal',
    ['esmalte', 'nervo alveolar', 'músculo masseter'],
    'A percussão comprime o ligamento periodontal. Se ele está inflamado, o paciente sente na hora.'
  ),
  choice(
    'exame-15',
    'Qual é a conduta?',
    ['Encaminhar com urgência para avaliação e biópsia', 'Prescrever bochecho e reavaliar em 1 mês', 'Tratar como afta', 'Trocar a escova e observar'],
    'Úlcera que não cicatriza em 2 a 3 semanas, endurecida e em fumante é suspeita de câncer até prova em contrário.',
    { scenario: 'Úlcera indolor no bordo da língua há 4 semanas, bordas endurecidas, fumante de 60 anos.', difficulty: 3 }
  ),
  choice(
    'exame-16',
    'Qual dente é o 36?',
    ['1º molar inferior esquerdo', '1º molar inferior direito', '1º molar superior esquerdo', '2º pré-molar inferior esquerdo'],
    'Na notação FDI o primeiro dígito é o quadrante (3 = inferior esquerdo) e o segundo, o dente (6 = primeiro molar).',
    { difficulty: 1 }
  ),
  choice(
    'exame-17',
    'Qual dente é o 11?',
    ['Incisivo central superior direito', 'Incisivo central superior esquerdo', 'Incisivo lateral superior direito', 'Canino superior direito'],
    'Quadrante 1 é o superior direito; dente 1 é o incisivo central. Os quadrantes seguem o sentido horário visto de frente.',
    { difficulty: 1 }
  ),
  pairs(
    'exame-18',
    'Relacione o quadrante FDI à região',
    [
      ['Quadrante 1', 'Superior direito'],
      ['Quadrante 2', 'Superior esquerdo'],
      ['Quadrante 3', 'Inferior esquerdo'],
      ['Quadrante 4', 'Inferior direito'],
    ],
    'Direita e esquerda são sempre do paciente. Começa em cima à direita e gira no sentido horário.',
    1
  ),
  truth(
    'exame-19',
    'Na notação FDI, os dentes decíduos usam os quadrantes 5 a 8.',
    true,
    'Decíduos: 51 a 85. O dente 65, por exemplo, é o segundo molar decíduo superior esquerdo.',
    2
  ),
  gap(
    'exame-20',
    'A adequação do meio bucal vem ___ dos tratamentos definitivos.',
    'antes',
    ['depois', 'em vez', 'independente'],
    'Primeiro controla-se biofilme, inflamação e lesões ativas. Restauração definitiva em boca doente dura pouco.'
  ),
  order(
    'exame-21',
    'Ordene as fases do plano de tratamento',
    ['Urgência', 'Adequação do meio', 'Tratamento definitivo', 'Reabilitação', 'Manutenção'],
    'Dor e infecção primeiro; depois estabilizar a doença; só então restaurar, reabilitar e manter.',
    { difficulty: 3 }
  ),
  choice(
    'exame-22',
    'Qual é a conduta?',
    ['Adiar o procedimento eletivo e encaminhar ao médico', 'Anestesiar sem vasoconstritor e extrair', 'Extrair normalmente', 'Pedir para respirar fundo e repetir a medida em 1 min'],
    'Pressão acima de 180/110 contraindica procedimento eletivo. Estabilizar primeiro, extrair depois.',
    { scenario: 'Exodontia eletiva marcada. Pressão aferida: 184/112 mmHg, paciente sem sintomas.', difficulty: 3 }
  ),
  multi(
    'exame-23',
    'Quais sinais tornam uma lesão de mucosa suspeita?',
    ['Persiste há mais de 2 semanas', 'Bordas endurecidas', 'Sangra sem causa aparente'],
    ['Doeu ao comer pimenta', 'Sumiu em 5 dias'],
    'Lesão que não cicatriza, endurece ou sangra espontaneamente exige investigação, não observação.',
    { difficulty: 2 }
  ),
  choice(
    'exame-24',
    'O que fazer primeiro?',
    ['Identificar o medicamento antes de decidir a conduta', 'Suspender o remédio por 3 dias', 'Extrair, pois é um dente só', 'Trocar por outro anti-inflamatório'],
    'Anticoagulante e antiagregante têm manejos diferentes. Nunca suspenda sem saber o que é e sem falar com o prescritor.',
    { scenario: 'Paciente usa "um remédio para afinar o sangue" mas não sabe o nome. Exodontia prevista.', difficulty: 3 }
  ),
  truth(
    'exame-25',
    'Toda "alergia" relatada deve ser investigada: qual fármaco e qual reação.',
    true,
    'Náusea não é alergia. Investigar evita tanto reexposição perigosa quanto rótulos errados no prontuário.',
    2
  ),
];
