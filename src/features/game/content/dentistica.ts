import type { ExerciseSeed } from '../types';
import { choice, gap, multi, order, pairs, truth } from './authoring';

export const DENTISTICA_EXERCISES: ExerciseSeed[] = [
  choice(
    'dent-01',
    'Quando escolher a cor da resina?',
    ['Antes do isolamento, com o dente hidratado', 'Depois do isolamento', 'Depois de secar o dente com ar', 'Após a restauração pronta'],
    'Dente seco fica mais claro e opaco. Escolha a cor com o dente úmido, em poucos segundos, antes de isolar.',
    { difficulty: 1 }
  ),
  pairs(
    'dent-02',
    'Relacione a classe de Black à localização',
    [
      ['Classe I', 'Oclusal de posteriores'],
      ['Classe II', 'Proximal de posteriores'],
      ['Classe III', 'Proximal de anteriores sem ângulo'],
      ['Classe IV', 'Proximal de anteriores com ângulo incisal'],
      ['Classe V', 'Terço cervical'],
    ],
    'A classificação orienta matriz, técnica e material. Saber de cor economiza tempo na clínica.',
    1
  ),
  choice(
    'dent-03',
    'Tempo de condicionamento com ácido fosfórico na dentina?',
    ['15 segundos', '60 segundos', '5 segundos', '2 minutos'],
    'Dentina condiciona rápido; 15 s bastam. Esmalte tolera até 30 s. Tempo demais na dentina enfraquece a adesão.',
    { difficulty: 2 }
  ),
  truth(
    'dent-04',
    'Na técnica convencional, a dentina deve ficar levemente úmida antes do adesivo.',
    true,
    'Secar demais colapsa as fibras colágenas e o adesivo não penetra. Úmida, sem poça: "dentina brilhante".',
    2
  ),
  gap(
    'dent-05',
    'A zona onde o adesivo se mistura com o colágeno da dentina chama-se camada ___.',
    'híbrida',
    ['esmaltada', 'lisa', 'oxidada'],
    'A camada híbrida é a união real entre resina e dente. Ela depende de condicionamento e umidade corretos.',
    2
  ),
  choice(
    'dent-06',
    'Espessura máxima do incremento de resina convencional?',
    ['2 mm', '5 mm', '0,5 mm', '8 mm'],
    'Mais que 2 mm a luz não polimeriza o fundo e a contração aumenta. Bulk fill é exceção, até 4 a 5 mm.',
    { difficulty: 1 }
  ),
  multi(
    'dent-07',
    'O que garante boa fotoativação?',
    ['Ponta do aparelho o mais perto possível da resina', 'Tempo recomendado pelo fabricante', 'Aparelho com irradiância adequada e conferida'],
    ['Distância de 2 cm para não aquecer', 'Fotoativar por 3 segundos'],
    'Luz fraca ou distante deixa resina mole no fundo: sensibilidade, manchamento e fratura precoce.',
    { difficulty: 2 }
  ),
  choice(
    'dent-08',
    'Qual sistema reconstrói melhor o contato proximal em classe II?',
    ['Matriz seccional com anel separador', 'Matriz circunferencial sem cunha', 'Fita de poliéster solta', 'Nenhuma matriz'],
    'O anel separa levemente os dentes e a matriz curva dá o contorno. O resultado é contato justo e anatômico.',
    { difficulty: 2 }
  ),
  choice(
    'dent-09',
    'Para que serve a cunha na classe II?',
    ['Adaptar a matriz na cervical e evitar excesso', 'Segurar o grampo', 'Anestesiar a papila', 'Escolher a cor'],
    'Sem cunha, sobra resina na cervical: degrau que retém biofilme e inflama a gengiva.',
    { difficulty: 1 }
  ),
  choice(
    'dent-10',
    'Qual é a causa mais provável?',
    ['Contato prematuro na restauração', 'Alergia à resina', 'Cárie nova', 'Falta de flúor'],
    'Restauração alta bate primeiro e sobrecarrega o ligamento. Ajuste oclusal resolve na hora.',
    { scenario: 'Paciente volta com dor ao morder um dia após uma restauração oclusal.', difficulty: 1 }
  ),
  truth(
    'dent-11',
    'Em cárie profunda, deve-se remover toda a dentina amolecida mesmo expondo a polpa.',
    false,
    'Remoção seletiva: deixe dentina afetada firme no fundo para não expor a polpa. Paredes laterais devem ficar em dentina dura.',
    3
  ),
  gap(
    'dent-12',
    'Deixar dentina afetada na parede pulpar para evitar exposição chama-se remoção ___ de tecido cariado.',
    'seletiva',
    ['total', 'agressiva', 'química'],
    'Polpa exposta em dente assintomático é pior resultado que dentina remanescente sob restauração bem selada.',
    3
  ),
  multi(
    'dent-13',
    'Causas de sensibilidade após restauração em resina?',
    ['Contaminação por saliva durante a adesão', 'Dentina seca em excesso', 'Contato prematuro'],
    ['Cor mais clara que o dente', 'Uso de matriz seccional'],
    'Sensibilidade pós-operatória quase sempre é falha de protocolo adesivo ou oclusão alta.',
    { difficulty: 2 }
  ),
  choice(
    'dent-14',
    'Qual vantagem o ionômero de vidro tem sobre a resina?',
    ['Adere quimicamente e libera flúor', 'É mais estético', 'Resiste mais ao desgaste', 'Não precisa de campo limpo'],
    'Ionômero é o material do risco alto de cárie e do ART. Perde em estética e resistência, ganha em flúor e tolerância.',
    { difficulty: 2 }
  ),
  choice(
    'dent-15',
    'Qual material para ART em molar de criança sem cadeira odontológica?',
    ['Ionômero de vidro de alta viscosidade', 'Resina composta', 'Amálgama', 'Cimento de fosfato de zinco'],
    'ART usa instrumentos manuais e ionômero: tolera umidade, adere e libera flúor.',
    { difficulty: 2 }
  ),
  truth(
    'dent-16',
    'O amálgama depende de retenção mecânica, não de adesão.',
    true,
    'Paredes ligeiramente convergentes para oclusal seguram o amálgama. Resina, ao contrário, adere e permite preparo conservador.',
    1
  ),
  gap(
    'dent-17',
    'A contração de polimerização da resina composta gera ___ na interface adesiva.',
    'estresse',
    ['flúor', 'brilho', 'calor apenas'],
    'A resina encolhe 2 a 3% ao endurecer e puxa as paredes. Incrementos pequenos reduzem esse estresse.',
    2
  ),
  choice(
    'dent-18',
    'Por que dar acabamento e polimento na resina?',
    ['Menos biofilme e menos manchamento', 'Deixar a resina mais dura', 'Aumentar a contração', 'Facilitar a remoção futura'],
    'Superfície lisa retém menos placa e pigmento. Polir é parte da restauração, não extra.',
    { difficulty: 1 }
  ),
  order(
    'dent-19',
    'Ordene o protocolo adesivo convencional (condiciona e lava)',
    ['Condicionar com ácido fosfórico', 'Lavar abundantemente', 'Secar deixando a dentina úmida', 'Aplicar o adesivo e evaporar o solvente', 'Fotoativar o adesivo'],
    'Cada passo prepara o seguinte. Pular a evaporação do solvente deixa água na interface e enfraquece tudo.',
    { difficulty: 2 }
  ),
  choice(
    'dent-20',
    'Com adesivo universal em modo autocondicionante, o que ainda vale fazer no esmalte?',
    ['Condicionamento seletivo com ácido fosfórico', 'Nada, é dispensável', 'Jatear com bicarbonato', 'Aplicar flúor antes'],
    'Autocondicionantes são fracos em esmalte. Ácido só no esmalte melhora a margem sem agredir a dentina.',
    { difficulty: 3 }
  ),
  choice(
    'dent-21',
    'Qual grampo ajuda em restauração de classe V?',
    ['212', 'W8A', 'Qualquer grampo de molar', 'Não se usa grampo'],
    'O 212 afasta a gengiva e expõe a margem cervical, onde a saliva mais atrapalha.',
    { difficulty: 2 }
  ),
  truth(
    'dent-22',
    'Clareamento pode causar sensibilidade transitória.',
    true,
    'O peróxido atravessa o esmalte e irrita a polpa temporariamente. Dessensibilizantes e pausas ajudam.',
    1
  ),
  choice(
    'dent-23',
    'Qual é a conduta?',
    ['Restauração adesiva conservadora', 'Coroa total', 'Extração', 'Só observar'],
    'Lesão cavitada em dentina precisa de restauração. Preparo mínimo: remover só o cariado e aderir.',
    { scenario: 'Cavidade oclusal em dentina no 36, assintomático, dente vital.', difficulty: 1 }
  ),
  gap(
    'dent-24',
    'Uma cavidade com muitas paredes aderidas e pouca superfície livre tem fator ___ alto.',
    'C',
    ['X', 'Y', 'F'],
    'Fator C alto = mais estresse de contração. Cavidades de classe I profundas são as mais críticas.',
    3
  ),
];
