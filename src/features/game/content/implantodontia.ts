import type { ExerciseSeed } from '../types';
import { choice, gap, multi, order, pairs, truth } from './authoring';

export const IMPL_EXERCISES: ExerciseSeed[] = [
  gap(
    'impl-01',
    'O contato direto entre osso vivo e a superfície do implante chama-se ___.',
    'osseointegração',
    ['cicatrização fibrosa', 'anquilose dentária', 'reabsorção'],
    'Descrita por Brånemark. Sem ligamento: o implante não se move nem tem a propriocepção do dente.',
    1
  ),
  choice(
    'impl-02',
    'De que material é feita a maioria dos implantes?',
    ['Titânio', 'Aço inoxidável', 'Ouro', 'Zircônia exclusivamente'],
    'Titânio forma óxido estável, biocompatível e favorece osseointegração. Zircônia é alternativa em casos selecionados.',
    { difficulty: 1 }
  ),
  choice(
    'impl-03',
    'Qual exame é padrão para planejar implantes?',
    ['Tomografia computadorizada de feixe cônico', 'Panorâmica isolada', 'Bite-wing', 'Telerradiografia'],
    'Altura, espessura e posição de canal e seio só aparecem em 3D. Panorâmica distorce e não mostra espessura.',
    { difficulty: 1 }
  ),
  truth(
    'impl-04',
    'Implantes são indicados em adolescentes assim que o dente permanente é perdido.',
    false,
    'O implante não acompanha o crescimento e vai ficar em infraoclusão. Esperar o fim do crescimento.',
    2
  ),
  choice(
    'impl-05',
    'Distância mínima entre implante e dente adjacente?',
    ['1,5 mm', '0,5 mm', '5 mm', 'Não há regra'],
    'Menos de 1,5 mm compromete o osso da crista e a papila. Entre dois implantes, 3 mm.',
    { difficulty: 2 }
  ),
  gap(
    'impl-06',
    'Entre dois implantes adjacentes, a distância mínima é de ___ mm.',
    '3',
    ['1', '10', '0,5'],
    'Cada implante perde um pouco de osso ao redor; com menos de 3 mm, as perdas se encontram e a papila some.',
    2
  ),
  choice(
    'impl-07',
    'Margem de segurança do ápice do implante ao canal mandibular?',
    ['Pelo menos 2 mm', '0 mm', '10 mm', '0,2 mm'],
    'A fresa pode passar do comprimento planejado. Dois milímetros protegem o nervo alveolar inferior.',
    { difficulty: 2 }
  ),
  multi(
    'impl-08',
    'O que evitar superaquecimento do osso durante a fresagem?',
    ['Irrigação abundante', 'Baixa rotação', 'Fresas afiadas e sequência crescente'],
    ['Alta rotação sem parar', 'Fresar sem irrigar para ver melhor'],
    'Acima de 47 °C por um minuto o osso necrosa e o implante não integra. Irrigação é obrigatória.',
    { difficulty: 2 }
  ),
  choice(
    'impl-09',
    'O que é estabilidade primária?',
    ['Fixação mecânica no momento da instalação', 'Osseointegração completa', 'Prótese bem adaptada', 'Ausência de dor'],
    'Primária é mecânica (travamento no osso). Secundária é biológica (osso novo). Sem a primeira, a segunda não vem.',
    { difficulty: 2 }
  ),
  truth(
    'impl-10',
    'Carga imediata exige boa estabilidade primária (torque em geral ≥ 35 Ncm).',
    true,
    'Implante que gira no alvéolo não pode receber prótese no mesmo dia. Torque e osso decidem.',
    3
  ),
  pairs(
    'impl-11',
    'Relacione a densidade óssea à região típica',
    [
      ['D1 (muito denso)', 'Mandíbula anterior'],
      ['D2', 'Mandíbula posterior'],
      ['D3', 'Maxila anterior'],
      ['D4 (pouco denso)', 'Maxila posterior'],
    ],
    'Osso denso dá estabilidade mas aquece mais na fresagem. Osso mole pede subinstrumentação e mais tempo.',
    3
  ),
  choice(
    'impl-12',
    'Tempo clássico de cicatrização antes de carregar um implante na maxila?',
    ['Cerca de 4 a 6 meses', '1 semana', '1 ano', '2 dias'],
    'Maxila é menos densa e integra mais devagar que a mandíbula (2 a 3 meses). Superfícies modernas encurtam isso.',
    { difficulty: 2 }
  ),
  choice(
    'impl-13',
    'Pouca altura óssea na maxila posterior. Procedimento indicado?',
    ['Levantamento do seio maxilar com enxerto', 'Implante mais longo mesmo assim', 'Implante zigomático em todos os casos', 'Desistir do implante'],
    'Elevar a membrana e enxertar ganha altura para um implante convencional.',
    { difficulty: 2 }
  ),
  choice(
    'impl-14',
    'Qual é o diagnóstico?',
    ['Mucosite peri-implantar', 'Peri-implantite', 'Osseointegração normal', 'Fratura do implante'],
    'Inflamação de tecido mole sem perda óssea é mucosite: reversível com higiene e limpeza.',
    { scenario: 'Sangramento à sondagem ao redor do implante, sem perda óssea na radiografia.', difficulty: 2 }
  ),
  choice(
    'impl-15',
    'Qual é o diagnóstico?',
    ['Peri-implantite', 'Mucosite peri-implantar', 'Saúde peri-implantar', 'Alveolite'],
    'Sangramento ou supuração com perda óssea progressiva define peri-implantite. Quanto antes tratar, melhor.',
    { scenario: 'Supuração à sondagem e perda óssea progressiva ao redor do implante na radiografia.', difficulty: 2 }
  ),
  multi(
    'impl-16',
    'Fatores de risco para peri-implantite?',
    ['Histórico de periodontite', 'Tabagismo', 'Higiene deficiente', 'Excesso de cimento subgengival'],
    ['Uso de fio dental', 'Prótese parafusada'],
    'Quem perdeu dente por periodontite tende a perder implante pela mesma causa. Manutenção rigorosa.',
    { difficulty: 2 }
  ),
  truth(
    'impl-17',
    'Implantes devem ser sondados com força leve durante a manutenção.',
    true,
    'Sondagem leve não danifica. Sangramento e aumento da profundidade ao longo do tempo são sinais de alerta.',
    2
  ),
  choice(
    'impl-18',
    'Tratamento padrão para mandíbula edêntula com queixa de prótese solta?',
    ['Sobredentadura sobre dois implantes', 'Nova prótese total convencional apenas', 'Implante único na linha média', 'Ponte fixa sem implantes'],
    'Dois implantes anteriores com encaixes transformam a retenção. É o padrão mínimo de cuidado recomendado.',
    { difficulty: 2 }
  ),
  choice(
    'impl-19',
    'Vantagem da prótese parafusada sobre a cimentada?',
    ['Pode ser removida para manutenção', 'É mais estética', 'Não precisa de torque', 'Nunca afrouxa'],
    'Parafusada sai e volta; cimentada não deixa excesso de cimento se bem feita. Cada uma tem seu lugar.',
    { difficulty: 2 }
  ),
  gap(
    'impl-20',
    'Parafuso da prótese que afrouxa repetidamente sugere sobrecarga ___.',
    'oclusal',
    ['salivar', 'térmica', 'química'],
    'Investigue contatos prematuros, bruxismo e desenho da prótese antes de só reapertar.',
    2
  ),
  multi(
    'impl-21',
    'Contraindicações relativas ou situações de alto risco para implantes?',
    ['Radioterapia prévia na região', 'Bisfosfonato intravenoso', 'Diabetes descompensado', 'Tabagismo pesado'],
    ['Hipertensão controlada', 'Uso de óculos'],
    'Osso irradiado, antirreabsortivo IV e glicemia alta comprometem a cicatrização. Avaliar com a equipe médica.',
    { difficulty: 3 }
  ),
  order(
    'impl-22',
    'Ordene a sequência básica da reabilitação com implante',
    ['Avaliação clínica e tomografia', 'Planejamento reverso e guia cirúrgico', 'Cirurgia de instalação', 'Período de osseointegração', 'Prótese sobre o implante', 'Manutenção periódica'],
    'Começa pela prótese ideal e planeja o implante para ela: planejamento reverso.',
    { difficulty: 1 }
  ),
  truth(
    'impl-23',
    'Faixa de mucosa ceratinizada ao redor do implante facilita a higiene e o conforto.',
    true,
    'Mucosa móvel ao redor do implante dói ao escovar e acumula mais biofilme. Às vezes é preciso enxerto gengival.',
    3
  ),
  choice(
    'impl-24',
    'Paciente relata que o implante "não sente" o alimento como um dente. Por quê?',
    ['Não tem ligamento periodontal nem seus receptores', 'A coroa é de cerâmica', 'O parafuso está solto', 'O implante é curto'],
    'A propriocepção fina vem do ligamento. Sem ele, a força de mordida é menos controlada, o que pesa no desenho da prótese.',
    { difficulty: 2 }
  ),
];
