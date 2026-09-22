import type { ExerciseSeed } from '../types';
import { choice, gap, multi, order, pairs, truth } from './authoring';

export const MAT_EXERCISES: ExerciseSeed[] = [
  choice(
    'mat-01',
    'Por que o alginato deve ser vazado logo após a moldagem?',
    ['Perde ou ganha água e distorce (sinérese e embebição)', 'Endurece demais com o tempo', 'Fica tóxico', 'Perde a cor'],
    'Hidrocoloide muda de volume conforme troca água com o ambiente. Vazar em minutos; se não der, embrulhar úmido.',
    { difficulty: 1 }
  ),
  choice(
    'mat-02',
    'Qual material de moldagem é mais preciso e estável?',
    ['Silicone de adição', 'Alginato', 'Godiva', 'Silicone de condensação'],
    'Adição não libera subproduto e mantém dimensões por dias. É o padrão para prótese fixa.',
    { difficulty: 1 }
  ),
  truth(
    'mat-03',
    'Luvas de látex podem atrapalhar a polimerização do silicone de adição.',
    true,
    'Enxofre do látex inibe a reação. Manipule com luvas de vinil ou nitrilo, ou sem tocar a massa.',
    3
  ),
  gap(
    'mat-04',
    'O silicone de condensação contrai porque libera ___ ao polimerizar.',
    'álcool',
    ['água', 'flúor', 'oxigênio'],
    'A perda de álcool etílico encolhe o molde. Por isso vazar rápido e preferir o de adição quando puder.',
    2
  ),
  pairs(
    'mat-05',
    'Relacione o tipo de gesso ao uso',
    [
      ['Tipo II (comum)', 'Montar modelos em articulador'],
      ['Tipo III (pedra)', 'Modelos de trabalho'],
      ['Tipo IV (pedra especial)', 'Troquéis para prótese fixa'],
    ],
    'Quanto maior o número, mais resistência e menos expansão. Troquel exige detalhe e dureza: tipo IV.',
    2
  ),
  truth(
    'mat-06',
    'Mais água na mistura do gesso deixa o modelo mais resistente.',
    false,
    'Excesso de água aumenta a porosidade e enfraquece. Siga a proporção água/pó do fabricante.',
    1
  ),
  multi(
    'mat-07',
    'Quais são componentes da resina composta?',
    ['Matriz orgânica (Bis-GMA)', 'Carga inorgânica', 'Agente de união (silano)', 'Fotoiniciador'],
    ['Mercúrio', 'Hidrocoloide'],
    'A carga dá resistência; a matriz, plasticidade; o silano une as duas. O fotoiniciador dispara a reação com a luz.',
    { difficulty: 2 }
  ),
  choice(
    'mat-08',
    'Qual é o fotoiniciador mais comum e seu pico de absorção?',
    ['Canforoquinona, cerca de 468 nm', 'Peróxido de benzoíla, 300 nm', 'Água oxigenada, 600 nm', 'Sílica, 800 nm'],
    'Luz azul em torno de 468 nm ativa a canforoquinona. Fotopolimerizador LED é feito para esse pico.',
    { difficulty: 3 }
  ),
  gap(
    'mat-09',
    'A resina composta contrai cerca de ___ % ao polimerizar.',
    '2 a 3',
    ['10 a 15', '0', '30'],
    'Pequeno em número, grande em consequência: gera estresse na interface e pode abrir a margem.',
    2
  ),
  choice(
    'mat-10',
    'Por que a superfície da resina fica pegajosa após fotoativar?',
    ['O oxigênio inibe a polimerização da camada mais externa', 'A luz não chegou', 'A resina venceu', 'Faltou silano'],
    'Camada inibida por oxigênio. Sai no acabamento; em incrementos, ajuda a unir uma camada à outra.',
    { difficulty: 3 }
  ),
  choice(
    'mat-11',
    'Qual material adere quimicamente ao dente e libera flúor?',
    ['Ionômero de vidro', 'Resina composta', 'Amálgama', 'Fosfato de zinco'],
    'Reação ácido-base com o cálcio da dentina. Libera flúor por meses e recarrega com dentifrício.',
    { difficulty: 1 }
  ),
  truth(
    'mat-12',
    'O ionômero de vidro convencional deve ser protegido da umidade e da secagem logo após a inserção.',
    true,
    'Água em excesso lava íons; secagem racha. Verniz ou adesivo por cima nas primeiras horas protege.',
    2
  ),
  multi(
    'mat-13',
    'Quais metais compõem a liga do amálgama?',
    ['Prata', 'Estanho', 'Cobre'],
    ['Ouro', 'Titânio'],
    'Prata, estanho e cobre misturados ao mercúrio. Ligas com alto cobre têm menos corrosão e menos creep.',
    { difficulty: 2 }
  ),
  choice(
    'mat-14',
    'Qual cimento estimula a formação de dentina reparadora?',
    ['Hidróxido de cálcio', 'Fosfato de zinco', 'Ionômero de vidro', 'Resinoso'],
    'pH alto irrita levemente a polpa e estimula dentina terciária. Usado como forrador em cavidades profundas.',
    { difficulty: 2 }
  ),
  choice(
    'mat-15',
    'Qual material tem melhor biocompatibilidade para contato direto com a polpa?',
    ['MTA', 'Fosfato de zinco', 'Resina acrílica', 'Óxido de zinco e eugenol'],
    'MTA sela, é biocompatível e induz ponte de dentina. Padrão em capeamento e pulpotomia.',
    { difficulty: 2 }
  ),
  pairs(
    'mat-16',
    'Relacione a cerâmica à característica',
    [
      ['Feldspática', 'Mais estética, menos resistente'],
      ['Dissilicato de lítio', 'Equilíbrio entre estética e resistência'],
      ['Zircônia', 'Mais resistente, menos translúcida'],
    ],
    'Escolha pelo local: faceta em anterior pede estética; ponte em posterior pede resistência.',
    2
  ),
  choice(
    'mat-17',
    'Como preparar a cerâmica vítrea (dissilicato) para cimentação adesiva?',
    ['Ácido fluorídrico e silano', 'Ácido fosfórico apenas', 'Jateamento e nada mais', 'Não precisa de tratamento'],
    'O HF cria microporosidades; o silano faz a ponte com a resina. Zircônia, por outro lado, não condiciona com HF.',
    { difficulty: 3 }
  ),
  truth(
    'mat-18',
    'Zircônia deve ser condicionada com ácido fluorídrico antes de cimentar.',
    false,
    'Zircônia não tem fase vítrea; o HF não age. Use jateamento com alumina e primer com MDP.',
    3
  ),
  gap(
    'mat-19',
    'A propriedade que descreve a rigidez de um material é o módulo de ___.',
    'elasticidade',
    ['dureza', 'fluidez', 'cor'],
    'Módulo alto = rígido. Para restaurar dentina, um material com módulo parecido distribui melhor a carga.',
    2
  ),
  choice(
    'mat-20',
    'Como conferir se o fotopolimerizador está funcionando bem?',
    ['Medir a irradiância com radiômetro periodicamente', 'Ver se a luz acende', 'Aproximar da unha e sentir calor', 'Trocar de aparelho a cada ano'],
    'Luz fraca deixa resina mole no fundo. Radiômetro mostra se ainda entrega a potência mínima.',
    { difficulty: 1 }
  ),
  choice(
    'mat-21',
    'Qual é o monômero da resina acrílica de prótese?',
    ['Metacrilato de metila', 'Bis-GMA', 'Eugenol', 'Ácido poliacrílico'],
    'Monômero líquido + polímero em pó. Monômero residual pode irritar a mucosa; polimerização completa reduz isso.',
    { difficulty: 2 }
  ),
  order(
    'mat-22',
    'Ordene a cimentação adesiva de uma peça em dissilicato de lítio',
    ['Provar a peça', 'Condicionar a cerâmica com ácido fluorídrico', 'Aplicar silano na peça', 'Preparar o dente com o adesivo', 'Cimentar e remover excessos'],
    'Peça e dente têm protocolos próprios. Misturar a ordem compromete a união dos dois lados.',
    { difficulty: 3 }
  ),
  truth(
    'mat-23',
    'Guta-percha e godiva são materiais termoplásticos.',
    true,
    'Amolecem com calor e endurecem ao esfriar. Por isso a guta-percha é plastificada na obturação.',
    1
  ),
  choice(
    'mat-24',
    'Qual cimento tem pH muito ácido no momento da inserção?',
    ['Fosfato de zinco', 'Hidróxido de cálcio', 'MTA', 'Ionômero após a presa'],
    'pH baixo inicial pode irritar a polpa em preparo profundo. Por isso o forramento antes da coroa.',
    { difficulty: 2 }
  ),
];
