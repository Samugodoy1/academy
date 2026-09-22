import type { ExerciseSeed } from '../types';
import { choice, gap, multi, order, pairs, truth } from './authoring';

export const PREVENTIVA_EXERCISES: ExerciseSeed[] = [
  choice(
    'prev-01',
    'O que pesa mais no risco de cárie?',
    ['A frequência de açúcar ao longo do dia', 'A quantidade total de açúcar', 'A marca do doce', 'A temperatura do alimento'],
    'Cada exposição derruba o pH por 30 a 60 minutos. Seis balinhas ao longo do dia atacam mais que um pacote de uma vez.',
    { difficulty: 1 }
  ),
  gap(
    'prev-02',
    'O pH crítico para desmineralizar o esmalte é cerca de ___.',
    '5,5',
    ['7,0', '3,0', '6,8'],
    'Abaixo de 5,5 o esmalte perde mineral; a dentina começa a perder já perto de 6,2 a 6,7.',
    2
  ),
  truth(
    'prev-03',
    'Após comer açúcar, o pH do biofilme volta ao normal em cerca de 30 a 60 minutos.',
    true,
    'É a curva de Stephan. Beliscar o tempo todo mantém o pH lá embaixo sem chance de recuperação.',
    2
  ),
  choice(
    'prev-04',
    'Como o flúor protege principalmente contra a cárie?',
    ['Ação tópica: reduz desmineralização e favorece remineralização', 'Matando todas as bactérias da boca', 'Deixando o esmalte mais duro antes de erupcionar', 'Neutralizando o açúcar'],
    'Flúor presente no biofilme e na saliva durante o ataque ácido é o que faz diferença. Efeito local, não sistêmico.',
    { difficulty: 2 }
  ),
  choice(
    'prev-05',
    'Qual a concentração mínima de flúor eficaz em dentifrício?',
    ['1000 ppm', '250 ppm', '500 ppm', '5000 ppm'],
    'Abaixo de 1000 ppm o dentifrício perde efeito anticárie comprovado. Adultos usam 1000 a 1500 ppm.',
    { difficulty: 2 }
  ),
  choice(
    'prev-06',
    'Quanto dentifrício para uma criança de 2 anos?',
    ['Um grão de arroz', 'Uma ervilha', 'Metade da escova', 'Não usar dentifrício com flúor'],
    'Grão de arroz até os 3 anos, ervilha dos 3 aos 6. Fluoretado desde o primeiro dente, em pouca quantidade.',
    { difficulty: 1 }
  ),
  truth(
    'prev-07',
    'Fluorose ocorre por excesso de flúor ingerido durante a formação dos dentes.',
    true,
    'O risco é na infância, enquanto o esmalte se forma. Por isso a quantidade de dentifrício é controlada nos pequenos.'
  ),
  gap(
    'prev-08',
    'O verniz fluoretado a 5% tem cerca de ___ ppm de flúor.',
    '22.600',
    ['1.100', '5.000', '500'],
    'Alta concentração de uso profissional, aplicado 2 a 4 vezes ao ano conforme o risco.',
    3
  ),
  choice(
    'prev-09',
    'Mancha branca opaca e rugosa. Ela está?',
    ['Ativa', 'Inativa', 'Cavitada', 'Curada'],
    'Opaca e rugosa = perdendo mineral agora. Brilhante e lisa = lesão que parou (inativa).',
    { difficulty: 2 }
  ),
  choice(
    'prev-10',
    'Qual é a conduta?',
    ['Controle de biofilme, flúor e orientação de dieta', 'Restaurar com resina', 'Restaurar com amálgama', 'Extrair'],
    'Lesão sem cavidade pode remineralizar. Tratar a doença, não só o buraco, ainda mais quando não há buraco.',
    { scenario: 'Mancha branca ativa na vestibular do 13, sem cavitação.', difficulty: 2 }
  ),
  multi(
    'prev-11',
    'O que a saliva faz contra a cárie?',
    ['Tampona o ácido', 'Fornece cálcio e fosfato', 'Limpa restos de alimento'],
    ['Produz açúcar', 'Descolore o esmalte'],
    'Saliva é a defesa natural. Boca seca (xerostomia) perde tudo isso e o risco dispara.',
    { difficulty: 1 }
  ),
  truth(
    'prev-12',
    'Xerostomia aumenta o risco de cárie.',
    true,
    'Menos saliva, menos tampão e menos limpeza. Pacientes com boca seca precisam de flúor extra e acompanhamento.'
  ),
  choice(
    'prev-13',
    'Onde os selantes são indicados?',
    ['Fóssulas e fissuras de molares em risco', 'Faces lisas vestibulares', 'Incisivos de leite', 'Todos os dentes de todas as crianças'],
    'Fissura profunda retém biofilme que a escova não alcança. Selar em quem tem risco protege a face mais vulnerável.',
    { difficulty: 1 }
  ),
  choice(
    'prev-14',
    'Qual é o principal fator dessa cárie?',
    ['Mamadeira adoçada à noite', 'Genética', 'Falta de cálcio na dieta', 'Uso de chupeta'],
    'Açúcar em contato prolongado, saliva reduzida no sono e sem escovação depois: receita de cárie precoce da infância.',
    { scenario: 'Criança de 2 anos com cárie nos incisivos superiores; dorme com mamadeira de leite com açúcar.', difficulty: 1 }
  ),
  gap(
    'prev-15',
    'O ___ é um adoçante não fermentável pelas bactérias do biofilme.',
    'xilitol',
    ['sacarose', 'glicose', 'frutose'],
    'Bactérias não conseguem produzir ácido a partir de xilitol. Ajuda, mas não substitui flúor e escovação.',
    2
  ),
  choice(
    'prev-16',
    'Qual açúcar é o mais cariogênico?',
    ['Sacarose', 'Lactose', 'Xilitol', 'Amido cru'],
    'A sacarose alimenta a produção de ácido e de polissacarídeos que grudam o biofilme no dente.',
    { difficulty: 1 }
  ),
  truth(
    'prev-17',
    'A água fluoretada em nível ótimo tem cerca de 0,7 mg de flúor por litro.',
    true,
    'Medida de saúde pública que alcança toda a população, com risco mínimo de fluorose nesse nível.',
    2
  ),
  order(
    'prev-18',
    'Ordene a lógica do manejo de cárie',
    ['Avaliar o risco individual', 'Detectar e classificar as lesões', 'Controlar a doença (biofilme, dieta, flúor)', 'Restaurar só o que precisa', 'Reavaliar em intervalo conforme o risco'],
    'Primeiro a pessoa, depois o dente. Restaurar sem controlar a causa é começar de novo em pouco tempo.',
    { difficulty: 2 }
  ),
  choice(
    'prev-19',
    'Quantas vezes por dia escovar com dentifrício fluoretado?',
    ['Duas vezes', 'Uma vez', 'Após cada gole de água', 'Só à noite'],
    'Duas vezes ao dia mantém flúor disponível ao longo do dia. A escovação noturna é a mais importante.',
    { difficulty: 1 }
  ),
  pairs(
    'prev-20',
    'Relacione o achado à interpretação',
    [
      ['Mancha branca opaca e rugosa', 'Lesão ativa'],
      ['Mancha brilhante e lisa', 'Lesão inativa'],
      ['Cavidade em dentina com biofilme', 'Precisa de restauração'],
      ['Sulco pigmentado sem sombra', 'Observar e prevenir'],
    ],
    'Aparência da superfície conta a história da lesão. Isso decide entre prevenir e restaurar.',
    2
  ),
  multi(
    'prev-21',
    'O que aumenta o risco de cárie?',
    ['Beliscar doces várias vezes ao dia', 'Boca seca por medicamentos', 'Biofilme visível nos dentes'],
    ['Água fluoretada', 'Escovação noturna com dentifrício fluoretado'],
    'Risco alto combina açúcar frequente, pouca saliva e biofilme. Cada um deles tem uma orientação específica.',
    { difficulty: 1 }
  ),
  truth(
    'prev-22',
    'Clorexidina é a principal medida para prevenir cárie.',
    false,
    'Clorexidina reduz bactérias por pouco tempo. Prevenção de cárie se faz com flúor, dieta e biofilme sob controle.',
    2
  ),
  choice(
    'prev-23',
    'Qual orientação tem mais chance de funcionar?',
    ['Uma mudança pequena e específica combinada com o paciente', 'Uma lista de 15 regras', 'Proibir todo açúcar', 'Repetir "escove melhor"'],
    'Mudança de hábito acontece em passos alcançáveis. Uma meta concreta vale mais que um sermão.',
    { difficulty: 2 }
  ),
  gap(
    'prev-24',
    'O biofilme dental precisa ser removido mecanicamente porque bochecho não ___ a placa madura.',
    'desorganiza',
    ['adoça', 'colore', 'endurece'],
    'A escova e o fio quebram a estrutura do biofilme. Enxaguante é complemento, não substituto.',
    1
  ),
];
