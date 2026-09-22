import type { ExerciseSeed } from '../types';
import { choice, gap, multi, order, pairs, truth } from './authoring';

export const PAT_EXERCISES: ExerciseSeed[] = [
  choice(
    'pat-01',
    'Placa branca que não sai à raspagem e não se explica por outra doença. Nome?',
    ['Leucoplasia', 'Candidíase', 'Líquen plano', 'Linha alba'],
    'Leucoplasia é diagnóstico clínico de exclusão e tem potencial de malignização. Biópsia é obrigatória.',
    { difficulty: 2 }
  ),
  choice(
    'pat-02',
    'Placa branca que sai à raspagem deixando base avermelhada. Hipótese?',
    ['Candidíase pseudomembranosa', 'Leucoplasia', 'Carcinoma', 'Líquen plano'],
    'Se sai com a gaze, é pseudomembrana de Candida. Tratar com antifúngico e procurar a causa.',
    { difficulty: 1 }
  ),
  truth(
    'pat-03',
    'Eritroplasia tem maior risco de malignidade que leucoplasia.',
    true,
    'Placa vermelha aveludada: a maioria já mostra displasia ou carcinoma na biópsia. Não observar, biopsiar.',
    2
  ),
  choice(
    'pat-04',
    'Qual é o câncer de boca mais comum?',
    ['Carcinoma espinocelular', 'Melanoma', 'Ameloblastoma', 'Linfoma'],
    'Mais de 90% dos casos. Borda lateral de língua e assoalho são os locais clássicos.',
    { difficulty: 1 }
  ),
  multi(
    'pat-05',
    'Fatores de risco para carcinoma espinocelular oral?',
    ['Tabaco', 'Álcool', 'HPV (sobretudo em orofaringe)'],
    ['Escovação frequente', 'Uso de fio dental'],
    'Tabaco e álcool juntos multiplicam o risco. HPV explica casos em pacientes jovens sem esses hábitos.',
    { difficulty: 1 }
  ),
  gap(
    'pat-06',
    'Úlcera que não cicatriza em ___ semanas deve ser biopsiada.',
    '2 a 3',
    ['10', '20', '52'],
    'Trauma cicatriza em duas semanas. O que passa disso precisa de diagnóstico histológico.',
    1
  ),
  choice(
    'pat-07',
    'Qual é o diagnóstico mais provável?',
    ['Estomatite aftosa recorrente', 'Herpes labial', 'Carcinoma', 'Candidíase'],
    'Afta: úlcera dolorosa, halo vermelho, mucosa não ceratinizada, cura em 7 a 14 dias, volta de vez em quando.',
    { scenario: 'Úlcera pequena, dolorosa, com halo vermelho na mucosa jugal, recorrente, cura em 10 dias.', difficulty: 1 }
  ),
  choice(
    'pat-08',
    'Vesículas agrupadas no lábio que viram crostas. Diagnóstico?',
    ['Herpes labial recorrente', 'Afta', 'Impetigo', 'Queilite angular'],
    'Vesícula em mucosa ceratinizada e lábio é herpes. Afta nunca começa com vesícula e prefere mucosa não ceratinizada.',
    { difficulty: 1 }
  ),
  pairs(
    'pat-09',
    'Relacione a lesão à característica',
    [
      ['Afta', 'Úlcera em mucosa não ceratinizada'],
      ['Herpes', 'Vesículas em lábio e mucosa ceratinizada'],
      ['Líquen plano', 'Estrias brancas bilaterais'],
      ['Leucoplasia pilosa', 'Bordo de língua, ligada ao EBV em imunossuprimidos'],
    ],
    'Localização e aspecto contam metade do diagnóstico das lesões brancas e ulceradas.',
    2
  ),
  choice(
    'pat-10',
    'Bolha azulada e flutuante no lábio inferior de adolescente. Hipótese?',
    ['Mucocele', 'Hemangioma', 'Fibroma', 'Carcinoma'],
    'Extravasamento de muco após trauma no ducto de glândula salivar menor. Excisão com a glândula associada.',
    { difficulty: 1 }
  ),
  choice(
    'pat-11',
    'Nódulo firme, rosado, na mucosa jugal na linha de mordida. Hipótese?',
    ['Fibroma (hiperplasia fibrosa)', 'Mucocele', 'Papiloma', 'Carcinoma'],
    'Trauma repetido cria tecido fibroso. Excisão e remover a causa, senão volta.',
    { difficulty: 1 }
  ),
  choice(
    'pat-12',
    'Qual é o diagnóstico mais provável?',
    ['Granuloma piogênico', 'Carcinoma gengival', 'Fibroma', 'Cisto gengival'],
    'Lesão vascular reativa, comum na gestação ("tumor gravídico"). Melhora da higiene e excisão após o parto se persistir.',
    { scenario: 'Gestante com nódulo vermelho na gengiva que sangra ao escovar.', difficulty: 2 }
  ),
  truth(
    'pat-13',
    'Torus palatino precisa ser removido cirurgicamente sempre.',
    false,
    'Exostose benigna. Só remover se atrapalhar prótese ou traumatizar com frequência.',
    1
  ),
  choice(
    'pat-14',
    'Radiolucidez unilocular ao redor da coroa de um terceiro molar incluso. Hipótese?',
    ['Cisto dentígero', 'Cisto radicular', 'Ameloblastoma', 'Odontoma'],
    'Cisto dentígero se forma a partir do folículo, envolvendo a coroa do dente que não nasceu.',
    { difficulty: 2 }
  ),
  choice(
    'pat-15',
    'Radiolucidez no ápice de um dente com necrose pulpar. Hipótese?',
    ['Cisto radicular ou granuloma periapical', 'Cisto dentígero', 'Torus', 'Odontoma'],
    'Lesão periapical inflamatória nasce de polpa necrosada. Radiografia não distingue cisto de granuloma.',
    { difficulty: 2 }
  ),
  gap(
    'pat-16',
    'O tumor odontogênico com imagem multilocular em "bolhas de sabão" na mandíbula posterior é o ___.',
    'ameloblastoma',
    ['odontoma', 'torus', 'fibroma'],
    'Benigno, mas localmente agressivo e recidivante. Tratamento cirúrgico com margem.',
    3
  ),
  choice(
    'pat-17',
    'Qual é o tumor odontogênico mais comum?',
    ['Odontoma', 'Ameloblastoma', 'Mixoma', 'Cementoblastoma'],
    'Odontoma é um hamartoma de tecidos dentais. Frequentemente impede a erupção de um dente.',
    { difficulty: 3 }
  ),
  truth(
    'pat-18',
    'Língua geográfica é uma condição benigna que muda de lugar.',
    true,
    'Áreas de despapilação que migram. Sem tratamento específico; tranquilizar o paciente.',
    1
  ),
  choice(
    'pat-19',
    'Pontinhos amarelados na mucosa jugal, assintomáticos. O que são?',
    ['Grânulos de Fordyce', 'Candidíase', 'Leucoplasia', 'Petéquias'],
    'Glândulas sebáceas ectópicas: variação da normalidade. Nenhum tratamento.',
    { difficulty: 1 }
  ),
  choice(
    'pat-20',
    'Qual biópsia para lesão grande (> 2 cm) suspeita de malignidade?',
    ['Incisional', 'Excisional', 'Aspirativa apenas', 'Nenhuma; encaminhar sem biópsia'],
    'Retira um fragmento representativo para diagnóstico. A cirurgia definitiva é planejada depois.',
    { difficulty: 2 }
  ),
  multi(
    'pat-21',
    'Sinais que sugerem malignidade em uma lesão?',
    ['Endurecimento à palpação', 'Bordas elevadas e irregulares', 'Fixação aos tecidos profundos'],
    ['Dor intensa desde o início', 'Cura em 1 semana'],
    'Câncer oral inicial costuma ser indolor. Endurecido, irregular e fixo pede biópsia urgente.',
    { difficulty: 2 }
  ),
  order(
    'pat-22',
    'Ordene a conduta diante de uma lesão suspeita',
    ['Descrever a lesão (local, tamanho, cor, consistência)', 'Remover possíveis causas traumáticas', 'Reavaliar em até 2 semanas', 'Biopsiar se persistir', 'Encaminhar conforme o resultado'],
    'Documentar, remover causa, prazo curto e biópsia. Sem "vamos ver daqui a 6 meses".',
    { difficulty: 2 }
  ),
  truth(
    'pat-23',
    'Leucoplasia pilosa está associada ao vírus Epstein-Barr e à imunossupressão.',
    true,
    'Placas brancas enrugadas no bordo da língua que não saem. Pode ser o primeiro sinal de HIV não diagnosticado.',
    3
  ),
  choice(
    'pat-24',
    'Lesão verrucosa pediculada, branca, em palato mole. Hipótese?',
    ['Papiloma escamoso', 'Fibroma', 'Mucocele', 'Torus'],
    'Papiloma é associado ao HPV, com aspecto de couve-flor. Excisão simples.',
    { difficulty: 2 }
  ),
];
