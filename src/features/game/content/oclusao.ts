import type { ExerciseSeed } from '../types';
import { choice, gap, multi, order, pairs, truth } from './authoring';

export const OCL_EXERCISES: ExerciseSeed[] = [
  choice(
    'ocl-01',
    'O que define a relação cêntrica?',
    ['Posição dos côndilos na fossa, independente dos dentes', 'Onde os dentes encaixam melhor', 'Posição de repouso da mandíbula', 'Máxima abertura'],
    'RC é articular: côndilos anterossuperiores na fossa, com o disco interposto. Reprodutível mesmo sem dentes.',
    { difficulty: 2 }
  ),
  gap(
    'ocl-02',
    'A posição em que os dentes têm o maior número de contatos chama-se máxima ___ habitual.',
    'intercuspidação',
    ['protrusão', 'abertura', 'lateralidade'],
    'MIH é ditada pelos dentes; RC, pela articulação. Quando as duas não coincidem, há um deslize.',
    1
  ),
  pairs(
    'ocl-03',
    'Relacione a classe de Angle à posição do 1º molar',
    [
      ['Classe I', 'Cúspide MV superior no sulco MV inferior'],
      ['Classe II', 'Molar inferior distalizado'],
      ['Classe III', 'Molar inferior mesializado'],
    ],
    'A chave é o primeiro molar. Angle descreve a relação anteroposterior, não a estética.',
    1
  ),
  choice(
    'ocl-04',
    'O que é overjet?',
    ['Trespasse horizontal dos incisivos', 'Trespasse vertical dos incisivos', 'Distância entre os molares', 'Abertura máxima'],
    'Overjet é para frente; overbite é para baixo. Confundir os dois muda o diagnóstico ortodôntico.',
    { difficulty: 1 }
  ),
  truth(
    'ocl-05',
    'Na protrusão, os dentes anteriores devem desocluir os posteriores.',
    true,
    'Guia anterior protege os posteriores de forças laterais. Contato posterior na protrusão é interferência.',
    2
  ),
  choice(
    'ocl-06',
    'Na lateralidade, qual é o lado de trabalho?',
    ['O lado para onde a mandíbula se move', 'O lado oposto ao movimento', 'Sempre o lado direito', 'O lado que dói'],
    'Trabalho é onde se mastiga; balanceio (não trabalho) é o oposto. Interferência no balanceio é a mais danosa.',
    { difficulty: 1 }
  ),
  gap(
    'ocl-07',
    'Quando só o canino guia a lateralidade, chamamos de guia ___.',
    'canina',
    ['molar', 'incisal', 'condilar'],
    'Alternativa: função em grupo, com vários dentes do lado de trabalho tocando juntos. Ambas são aceitáveis.',
    2
  ),
  choice(
    'ocl-08',
    'Qual é a hipótese mais provável?',
    ['Bruxismo (parafunção)', 'Erosão por refluxo', 'Cárie de esmalte', 'Fluorose'],
    'Facetas planas, brilhantes e que se encaixam entre antagonistas são marca de ranger. Investigue sono e estresse.',
    { scenario: 'Facetas de desgaste planas em caninos e incisivos, masseter hipertrofiado, dor ao acordar.', difficulty: 1 }
  ),
  choice(
    'ocl-09',
    'Qual dispositivo é indicado para bruxismo do sono?',
    ['Placa oclusal estabilizadora rígida', 'Placa macia de silicone para sempre', 'Aparelho ortodôntico', 'Nenhum'],
    'Placa rígida distribui força e protege os dentes. Placa macia pode até aumentar a atividade muscular.',
    { difficulty: 2 }
  ),
  gap(
    'ocl-10',
    'A abertura bucal normal em adulto fica em torno de ___ mm.',
    '40 a 55',
    ['10 a 15', '80 a 90', '20 a 25'],
    'Menos de 40 mm sugere limitação: muscular, articular ou trismo. Meça sempre com régua.',
    2
  ),
  multi(
    'ocl-11',
    'Sinais e sintomas de disfunção temporomandibular?',
    ['Dor nos músculos da mastigação', 'Clique ou crepitação na ATM', 'Limitação de abertura'],
    ['Sangramento gengival', 'Sensibilidade ao frio em um dente'],
    'DTM é dor e disfunção da articulação e dos músculos. Dente doendo isolado é outro diagnóstico.',
    { difficulty: 1 }
  ),
  choice(
    'ocl-12',
    'Clique reprodutível na abertura e no fechamento, sem dor. Hipótese?',
    ['Deslocamento de disco com redução', 'Deslocamento de disco sem redução', 'Artrite reumatoide', 'Fratura condilar'],
    'O disco sai e volta ao lugar ("reduz") fazendo o clique. Sem dor e sem travamento, em geral só acompanhar.',
    { difficulty: 3 }
  ),
  choice(
    'ocl-13',
    'Qual é o primeiro tratamento para a maioria das DTMs musculares?',
    ['Conservador: orientação, autocuidado, calor e placa', 'Cirurgia da ATM', 'Ajuste oclusal extenso', 'Coroas em todos os dentes'],
    'DTM muscular responde a medidas reversíveis. Irreversível só depois, se houver indicação clara.',
    { difficulty: 2 }
  ),
  truth(
    'ocl-14',
    'Trauma oclusal pode alargar o espaço do ligamento periodontal na radiografia.',
    true,
    'Força excessiva inflama o ligamento e ele "engorda" na imagem. Mobilidade e faceta de desgaste completam o quadro.',
    2
  ),
  choice(
    'ocl-15',
    'Curva de Spee é observada em qual plano?',
    ['Sagital (anteroposterior)', 'Frontal (transversal)', 'Horizontal', 'Nenhum'],
    'Spee é a curva vista de lado; Wilson é a vista de frente. Ambas ajudam na desoclusão.',
    { difficulty: 3 }
  ),
  pairs(
    'ocl-16',
    'Relacione o conceito à definição',
    [
      ['Overbite', 'Trespasse vertical'],
      ['Overjet', 'Trespasse horizontal'],
      ['Mordida cruzada', 'Inferior por fora do superior'],
      ['Mordida aberta', 'Sem contato vertical entre antagonistas'],
    ],
    'Vocabulário básico de oclusão. Sem ele, não dá para descrever um caso.',
    1
  ),
  choice(
    'ocl-17',
    'O que é uma oclusão mutuamente protegida?',
    ['Posteriores suportam a carga em MIH; anteriores guiam os movimentos', 'Todos os dentes tocam em todos os movimentos', 'Só os anteriores tocam sempre', 'Os posteriores guiam a protrusão'],
    'Cada grupo protege o outro. Posteriores aguentam força vertical; anteriores aguentam guia.',
    { difficulty: 3 }
  ),
  truth(
    'ocl-18',
    'Em prótese total, busca-se oclusão balanceada bilateral.',
    true,
    'Sem dentes fixos, a base precisa de contatos dos dois lados em todos os movimentos para não bascular.',
    2
  ),
  choice(
    'ocl-19',
    'Como identificar um contato prematuro?',
    ['Papel de articular e relato do paciente ao fechar', 'Radiografia periapical', 'Teste de frio', 'Sondagem periodontal'],
    'Marca escura isolada e sensação de "bate primeiro". Ajuste com critério, um pouco de cada vez.',
    { difficulty: 1 }
  ),
  multi(
    'ocl-20',
    'O que o arco facial transfere ao articulador?',
    ['Relação da maxila com o eixo dos côndilos', 'Posição espacial do modelo superior'],
    ['A cor dos dentes', 'A força de mordida', 'O fluxo salivar'],
    'Sem arco facial, o modelo entra no articulador em posição arbitrária e a guia sai errada.',
    { difficulty: 3 }
  ),
  choice(
    'ocl-21',
    'Interferência oclusal mais prejudicial?',
    ['Contato no lado de balanceio', 'Contato bilateral em MIH', 'Guia canina', 'Contato anterior em protrusão'],
    'No balanceio, o côndilo está fora da fossa e a força cai onde não há suporte. Alvo clássico do ajuste.',
    { difficulty: 3 }
  ),
  order(
    'ocl-22',
    'Ordene a avaliação oclusal básica',
    ['Observar a relação molar e o trespasse', 'Checar contatos em MIH com papel de articular', 'Verificar guia em protrusão', 'Verificar guias em lateralidade', 'Registrar facetas de desgaste e mobilidade'],
    'Estático primeiro, dinâmico depois. Escrever tudo: oclusão muda e você vai querer comparar.',
    { difficulty: 2 }
  ),
  truth(
    'ocl-23',
    'A posição de repouso mandibular é um pouco aberta em relação à MIH.',
    true,
    'Espaço funcional livre de 2 a 4 mm. Dentes em contato o tempo todo é sinal de apertamento.',
    1
  ),
  choice(
    'ocl-24',
    'Dor aguda ao morder em um dente restaurado há 2 dias. Primeira suspeita?',
    ['Restauração alta', 'Pulpite irreversível', 'Fratura da raiz', 'Gengivite'],
    'Restauração alta sobrecarrega o ligamento. Marcar, ajustar e reavaliar antes de pensar em canal.',
    { difficulty: 1 }
  ),
];
