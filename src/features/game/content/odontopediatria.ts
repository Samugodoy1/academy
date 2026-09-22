import type { ExerciseSeed } from '../types';
import { choice, gap, multi, order, pairs, truth } from './authoring';

export const ODONTOPEDIATRIA_EXERCISES: ExerciseSeed[] = [
  choice(
    'ped-01',
    'Qual é o primeiro dente decíduo a erupcionar?',
    ['Incisivo central inferior', 'Incisivo central superior', 'Primeiro molar', 'Canino'],
    'Por volta dos 6 meses, os centrais inferiores abrem a dentição decídua.',
    { difficulty: 1 }
  ),
  choice(
    'ped-02',
    'Qual é o primeiro dente permanente a erupcionar?',
    ['Primeiro molar', 'Incisivo central superior', 'Canino', 'Segundo molar'],
    'Aos 6 anos o primeiro molar nasce atrás dos decíduos, sem trocar nenhum dente. Muitos pais acham que é de leite.',
    { difficulty: 1 }
  ),
  gap(
    'ped-03',
    'A dentição decídua completa tem ___ dentes.',
    '20',
    ['24', '28', '32'],
    'Cinco por quadrante: dois incisivos, um canino e dois molares. Não há pré-molares decíduos.',
    1
  ),
  truth(
    'ped-04',
    'A primeira consulta odontológica deve acontecer até o primeiro ano de vida.',
    true,
    'Ao nascer o primeiro dente ou até 12 meses: orientar dieta, higiene e flúor antes da doença aparecer.'
  ),
  pairs(
    'ped-05',
    'Relacione a técnica de manejo à descrição',
    [
      ['Falar-mostrar-fazer', 'Explica, demonstra e só então executa'],
      ['Reforço positivo', 'Elogia o comportamento desejado'],
      ['Distração', 'Desvia a atenção durante o procedimento'],
      ['Controle de voz', 'Muda tom e volume para ganhar atenção'],
    ],
    'Manejo é técnica, não improviso. Combinar as ferramentas evita a maior parte dos "não abre a boca".',
    1
  ),
  truth(
    'ped-06',
    'A técnica de mão sobre a boca é recomendada para crianças que choram.',
    false,
    'Técnicas aversivas não são recomendadas. Comunicação, distração e, se preciso, sedação são as alternativas.',
    2
  ),
  choice(
    'ped-07',
    'Qual é o tratamento indicado?',
    ['Pulpotomia', 'Pulpectomia', 'Extração', 'Restauração sem tratar a polpa'],
    'Polpa coronária exposta por cárie, sem sinais de necrose e com raiz sadia: remove a coroa da polpa e preserva a radicular.',
    { scenario: 'Molar decíduo com exposição pulpar por cárie, sem dor espontânea, sem fístula, sem lesão radicular.', difficulty: 2 }
  ),
  choice(
    'ped-08',
    'Qual material NÃO se usa para obturar canal de decíduo?',
    ['Guta-percha', 'Pasta de óxido de zinco e eugenol', 'Pasta iodoformada', 'Pasta reabsorvível à base de hidróxido de cálcio'],
    'A raiz do decíduo reabsorve; a obturação precisa reabsorver junto. Guta-percha ficaria no osso.',
    { difficulty: 3 }
  ),
  choice(
    'ped-09',
    'Qual restauração para molar decíduo após pulpotomia?',
    ['Coroa de aço', 'Resina classe I pequena', 'Selante', 'Nenhuma'],
    'Dente sem polpa coronária e com pouca estrutura fratura fácil. Coroa de aço sela e protege até a esfoliação.',
    { difficulty: 2 }
  ),
  gap(
    'ped-10',
    'Na técnica de ___, a coroa de aço é cimentada sobre a cárie sem remover tecido cariado.',
    'Hall',
    ['Black', 'Kennedy', 'Winter'],
    'Selar a cárie isola as bactérias do açúcar e a lesão para. Sem anestesia, sem broca, boa evidência em decíduos.',
    3
  ),
  choice(
    'ped-11',
    'Perda precoce do 75 aos 6 anos. Conduta?',
    ['Mantenedor de espaço', 'Nada, o permanente vai nascer', 'Extrair o 85 também para simetria', 'Prótese fixa'],
    'Sem o decíduo, o molar permanente migra para mesial e o pré-molar perde espaço. Banda-alça resolve.',
    { difficulty: 2 }
  ),
  choice(
    'ped-12',
    'Dente decíduo avulsionado. Conduta?',
    ['Não reimplantar; acompanhar', 'Reimplantar imediatamente', 'Reimplantar após 1 hora em leite', 'Colocar prótese fixa'],
    'Reimplantar pode lesar o germe do permanente. Orientar, controlar e acompanhar a erupção.',
    { difficulty: 2 }
  ),
  truth(
    'ped-13',
    'Molares decíduos têm câmara pulpar grande e esmalte fino.',
    true,
    'Por isso a cárie chega rápido à polpa e o preparo precisa ser conservador.',
    1
  ),
  multi(
    'ped-14',
    'Quais fatores causam cárie precoce da infância?',
    ['Mamadeira adoçada à noite', 'Ausência de escovação com flúor', 'Amamentação noturna livre após a erupção sem higiene'],
    ['Uso de chupeta', 'Dentes que nasceram cedo'],
    'Açúcar frequente, especialmente à noite, sem flúor. O manejo é dieta, higiene e flúor, não só restaurar.',
    { difficulty: 1 }
  ),
  choice(
    'ped-15',
    'Quantidade de dentifrício fluoretado para criança de 4 anos?',
    ['Grão de ervilha', 'Grão de arroz', 'Toda a escova', 'Nenhuma, só água'],
    'Ervilha dos 3 aos 6 anos, com o adulto escovando ou supervisionando. Cuspir sem enxaguar demais.',
    { difficulty: 1 }
  ),
  truth(
    'ped-16',
    'Os pais devem escovar ou supervisionar a escovação até cerca de 7 a 8 anos.',
    true,
    'Antes disso a criança não tem coordenação fina para limpar bem. Deixar "só ela" é deixar cárie.',
    1
  ),
  choice(
    'ped-17',
    'Chupeta até que idade costuma não deixar sequela?',
    ['Cerca de 3 anos', '6 anos', '10 anos', 'Qualquer idade'],
    'Hábito removido antes dos 3 anos costuma permitir autocorreção da mordida aberta anterior.',
    { difficulty: 2 }
  ),
  choice(
    'ped-18',
    'Anestésico contraindicado em criança de 3 anos?',
    ['Articaína', 'Lidocaína', 'Mepivacaína', 'Prilocaína'],
    'Articaína não tem segurança estabelecida abaixo de 4 anos. A lidocaína 2% é a escolha padrão em pediatria.',
    { difficulty: 3 }
  ),
  gap(
    'ped-19',
    'Após bloqueio inferior em criança, oriente os pais sobre o risco de ___ do lábio.',
    'mordedura',
    ['queimadura', 'fratura', 'descoloração'],
    'Lábio dormente é brinquedo para criança. Aviso simples evita ferida grande.',
    1
  ),
  order(
    'ped-20',
    'Ordene a erupção dos dentes decíduos',
    ['Incisivos centrais', 'Incisivos laterais', 'Primeiros molares', 'Caninos', 'Segundos molares'],
    'O canino nasce depois do primeiro molar: uma das pegadinhas clássicas. Tudo completo por volta dos 2 anos e meio.',
    { difficulty: 2 }
  ),
  choice(
    'ped-21',
    'Qual é a conduta?',
    ['Radiografar para ver a direção da intrusão e acompanhar', 'Extrair imediatamente', 'Reposicionar com fórceps', 'Colocar contenção rígida por 3 meses'],
    'Se a raiz foi para vestibular (longe do germe), pode reerupcionar. Se foi para o germe, extrair.',
    { scenario: 'Criança de 2 anos com intrusão do 51 após queda.', difficulty: 3 }
  ),
  truth(
    'ped-24',
    'Selante é indicado em primeiros molares permanentes de crianças com risco de cárie.',
    true,
    'Fissura profunda em dente recém-erupcionado é onde a cárie começa. Selar cedo, em quem tem risco, protege.',
    1
  ),
  choice(
    'ped-22',
    'Qual sinal indica necrose em molar decíduo?',
    ['Fístula ou abscesso na gengiva', 'Dor ao frio que passa rápido', 'Mancha branca na vestibular', 'Mobilidade fisiológica por esfoliação'],
    'Fístula, edema e radiolucidez interradicular indicam necrose: pulpectomia ou extração, não pulpotomia.',
    { difficulty: 2 }
  ),
  multi(
    'ped-23',
    'O que dizer à mãe após uma restauração em criança de 5 anos?',
    ['Cuidado para não morder o lábio dormente', 'Evitar alimentos duros até passar a anestesia', 'Continuar a escovação normalmente'],
    ['Não escovar o dente restaurado por 1 semana', 'Dar bala para acalmar'],
    'Orientação clara para quem cuida em casa é parte do tratamento.',
    { difficulty: 1 }
  ),
];
