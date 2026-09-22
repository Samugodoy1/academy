import type { ExerciseSeed } from '../types';
import { choice, gap, multi, order, pairs, truth } from './authoring';

export const GERI_EXERCISES: ExerciseSeed[] = [
  truth(
    'geri-01',
    'Perder dentes é consequência natural do envelhecimento.',
    false,
    'Dente se perde por doença (cárie, periodontite), não por idade. Idoso saudável pode manter os dentes a vida toda.'
  ),
  choice(
    'geri-02',
    'Qual tipo de cárie é típico do idoso?',
    ['Cárie radicular', 'Cárie de fissura', 'Cárie precoce', 'Cárie de mamadeira'],
    'Recessão expõe cemento, que é menos mineralizado e desmineraliza em pH mais alto que o esmalte.',
    { difficulty: 1 }
  ),
  choice(
    'geri-03',
    'Qual material é boa escolha para restaurar cárie radicular?',
    ['Ionômero de vidro', 'Amálgama', 'Cerâmica', 'Cimento de fosfato de zinco'],
    'Adere à dentina úmida, libera flúor e tolera campo difícil. Ideal para margens em cemento.',
    { difficulty: 2 }
  ),
  gap(
    'geri-04',
    'Para idosos de alto risco de cárie, pode-se prescrever dentifrício com ___ ppm de flúor.',
    '5.000',
    ['250', '500', '50.000'],
    'Dentifrício de alta concentração, sob prescrição, reduz cárie radicular em quem tem boca seca ou recessão.',
    3
  ),
  choice(
    'geri-05',
    'Causa mais comum de boca seca no idoso?',
    ['Efeito de medicamentos', 'Envelhecimento das glândulas por si só', 'Falta de água', 'Prótese total'],
    'Anti-hipertensivos, antidepressivos e anticolinérgicos secam a boca. Quanto mais remédios, mais seco.',
    { difficulty: 1 }
  ),
  multi(
    'geri-06',
    'Manejo da hipossalivação?',
    ['Hidratação frequente', 'Goma ou pastilha sem açúcar', 'Saliva artificial ou lubrificantes', 'Flúor de alta concentração'],
    ['Bochecho com álcool', 'Balas com açúcar para estimular'],
    'Estimular saliva onde existe, substituir onde não existe e proteger o dente do risco aumentado.',
    { difficulty: 2 }
  ),
  truth(
    'geri-07',
    'A polpa do idoso responde menos ao teste de frio.',
    true,
    'Câmara reduzida por dentina secundária e menos fibras. Um teste negativo não fecha necrose; compare com outros dentes.',
    2
  ),
  choice(
    'geri-08',
    'Qual é o diagnóstico mais provável?',
    ['Estomatite por prótese (candidíase)', 'Alergia à resina', 'Carcinoma de palato', 'Queimadura'],
    'Prótese que não sai à noite e não é limpa vira ninho de Candida. Tratar a prótese, não só a mucosa.',
    { scenario: 'Mucosa vermelha exatamente na área coberta pela prótese total superior; paciente dorme com ela.', difficulty: 1 }
  ),
  multi(
    'geri-09',
    'Orientações de higiene da prótese total?',
    ['Escovar com escova própria e sabão neutro', 'Retirar para dormir', 'Deixar imersa em solução adequada durante a noite'],
    ['Escovar com dentifrício abrasivo', 'Ferver a prótese semanalmente'],
    'Dentifrício risca a resina e acumula mais biofilme. Água fervente deforma. Simples e diário funciona.',
    { difficulty: 1 }
  ),
  choice(
    'geri-10',
    'Tecido mole redundante na região do rebordo, em volta da borda da prótese. Hipótese?',
    ['Hiperplasia fibrosa por prótese mal adaptada', 'Carcinoma', 'Torus', 'Mucocele'],
    'A borda machuca, o tecido cresce. Ajustar ou refazer a prótese; remover o excesso se não regredir.',
    { difficulty: 2 }
  ),
  choice(
    'geri-11',
    'Bisfosfonato oral para osteoporose há 2 anos e precisa extrair um dente. Risco de osteonecrose?',
    ['Baixo, mas exige informar e planejar', 'Muito alto; contraindicação absoluta', 'Zero', 'Só existe com dose intravenosa'],
    'Oral por pouco tempo: risco baixo. Intravenoso oncológico: alto. Em ambos, técnica atraumática e acompanhamento.',
    { difficulty: 3 }
  ),
  truth(
    'geri-12',
    'O exame das mucosas deve fazer parte de toda consulta do idoso.',
    true,
    'Câncer de boca é mais frequente após os 60 anos e começa sem dor. Quem olha encontra cedo.',
    1
  ),
  choice(
    'geri-13',
    'Ao levantar da cadeira, o idoso fica tonto. O que fazer?',
    ['Levantar em etapas e aguardar sentado antes de ficar em pé', 'Levantar rápido para melhorar a circulação', 'Deitar por 1 hora', 'Dar café'],
    'Hipotensão ortostática é comum com anti-hipertensivos. Subir a cadeira devagar previne queda.',
    { difficulty: 1 }
  ),
  choice(
    'geri-14',
    'Como se comunicar com um paciente com demência leve?',
    ['Frases curtas, uma instrução por vez, com o cuidador presente', 'Falar alto e rápido', 'Explicar só ao cuidador', 'Evitar falar durante o atendimento'],
    'Respeito e simplicidade. O paciente ainda participa; o cuidador complementa e leva as orientações para casa.',
    { difficulty: 2 }
  ),
  truth(
    'geri-15',
    'Higiene oral reduz o risco de pneumonia aspirativa em idosos frágeis.',
    true,
    'Biofilme oral vai para o pulmão com a aspiração. Boca limpa salva vidas em instituições e hospitais.',
    2
  ),
  gap(
    'geri-16',
    'O uso de muitos medicamentos ao mesmo tempo chama-se ___.',
    'polifarmácia',
    ['automedicação', 'hipofarmácia', 'fitoterapia'],
    'Mais remédios, mais interações e mais boca seca. Conciliar a lista antes de prescrever qualquer coisa.',
    1
  ),
  choice(
    'geri-17',
    'Diabético idoso em uso de insulina. Melhor horário para a consulta?',
    ['Pela manhã, após o café e a medicação habitual', 'Em jejum, cedo', 'Fim da tarde sem lanche', 'Não importa'],
    'Evita hipoglicemia na cadeira. Pergunte se comeu e se tomou o remédio antes de começar.',
    { difficulty: 2 }
  ),
  choice(
    'geri-18',
    'Por que a dentina do idoso é menos sensível ao preparo?',
    ['Dentina esclerótica com túbulos obliterados', 'Ausência de polpa', 'Esmalte mais espesso', 'Menos flúor'],
    'Túbulos fechados por mineral conduzem menos estímulo. A cor mais amarelada vem daí também.',
    { difficulty: 2 }
  ),
  multi(
    'geri-19',
    'Adaptações úteis no atendimento do idoso frágil?',
    ['Sessões mais curtas', 'Posição da cadeira menos inclinada', 'Instruções por escrito para o cuidador'],
    ['Sempre sedação', 'Ignorar a lista de remédios'],
    'Menos tempo, mais conforto e comunicação clara. Isso melhora a adesão e reduz emergências.',
    { difficulty: 1 }
  ),
  pairs(
    'geri-20',
    'Relacione o achado à orientação',
    [
      ['Boca seca', 'Revisar medicamentos e usar substitutos de saliva'],
      ['Cárie radicular', 'Ionômero e flúor de alta concentração'],
      ['Estomatite por prótese', 'Higiene da prótese e retirar à noite'],
      ['Hiperplasia por prótese', 'Ajustar ou refazer a prótese'],
    ],
    'Os problemas mais comuns do idoso têm condutas simples e bem definidas.',
    2
  ),
  truth(
    'geri-21',
    'Idoso com capacidade de decisão preservada pode consentir sozinho ao tratamento.',
    true,
    'Idade não tira autonomia. O cuidador participa quando o paciente quer ou quando a capacidade está comprometida.',
    1
  ),
  choice(
    'geri-22',
    'Prótese total antiga com dentes muito gastos. Consequência provável?',
    ['Redução da dimensão vertical e queilite angular', 'Aumento da dimensão vertical', 'Fluorose', 'Cárie radicular'],
    'Dente gasto fecha a boca demais; a comissura dobra e fica úmida, favorecendo Candida.',
    { difficulty: 2 }
  ),
  order(
    'geri-23',
    'Ordene a consulta inicial do idoso',
    ['Revisar lista completa de medicamentos e doenças', 'Aferir pressão e perguntar sobre alimentação do dia', 'Examinar mucosas, dentes, próteses e saliva', 'Priorizar dor, infecção e função mastigatória', 'Combinar plano com paciente e cuidador'],
    'A boca do idoso é lida junto com a saúde geral. O plano precisa caber na vida dele.',
    { difficulty: 2 }
  ),
  choice(
    'geri-24',
    'Raiz residual assintomática em idoso sob prótese total. Conduta?',
    ['Avaliar clínica e radiograficamente; remover se houver infecção ou interferir na prótese', 'Extrair sempre, imediatamente', 'Ignorar sem exame', 'Fazer canal'],
    'Nem toda raiz precisa sair. Risco cirúrgico versus benefício, com o paciente na decisão.',
    { difficulty: 3 }
  ),
];
