import type { ExerciseSeed } from '../types';
import { choice, gap, multi, order, pairs, truth } from './authoring';

export const PROTESE_EXERCISES: ExerciseSeed[] = [
  choice(
    'prot-01',
    'Redução oclusal para coroa total em cerâmica?',
    ['1,5 a 2 mm', '0,3 mm', '4 mm', 'Não precisa reduzir'],
    'Cerâmica precisa de espessura para não fraturar. Menos que 1,5 mm na oclusal é pedir trinca.',
    { difficulty: 2 }
  ),
  gap(
    'prot-02',
    'As paredes axiais do preparo devem ter leve ___ para oclusal.',
    'convergência',
    ['divergência', 'concavidade', 'rugosidade'],
    'Convergência total de 6 a 12° dá retenção e permite assentar. Paredes paralelas travam; muito expulsivas soltam.',
    2
  ),
  pairs(
    'prot-03',
    'Relacione o término ao material',
    [
      ['Chanfro', 'Coroa metálica'],
      ['Ombro ou ombro arredondado', 'Coroa em cerâmica pura'],
      ['Chanfro largo', 'Metalocerâmica'],
    ],
    'O término dá espaço para a margem do material. Cerâmica quer volume; metal fica bem em chanfro fino.',
    3
  ),
  choice(
    'prot-04',
    'O que é o efeito férula?',
    ['Estrutura dental íntegra de 1,5 a 2 mm acima do término, abraçada pela coroa', 'O pino dentro do canal', 'A cimentação adesiva', 'A largura do ombro'],
    'A coroa abraçando dente sadio protege contra fratura. Sem férula, o pino não salva.',
    { difficulty: 3 }
  ),
  truth(
    'prot-05',
    'Molar tratado endodonticamente com paredes fracas deve receber cobertura de cúspides.',
    true,
    'Dente sem polpa e sem paredes rompe sob a mastigação. Onlay ou coroa protege as cúspides.',
    2
  ),
  choice(
    'prot-06',
    'Para que serve o fio de afastamento gengival?',
    ['Expor o término e controlar o fluido no sulco', 'Anestesiar a gengiva', 'Clarear a margem', 'Fixar o provisório'],
    'Margem escondida sob a gengiva não é copiada. Afastar e secar o sulco é a metade da moldagem.',
    { difficulty: 1 }
  ),
  choice(
    'prot-07',
    'A moldagem não copiou parte do término. O que fazer?',
    ['Repetir a moldagem', 'Mandar ao laboratório com a anotação', 'Corrigir com cera', 'Aceitar e ajustar na prova'],
    'Sem o término no molde, não há coroa adaptada. Repetir custa minutos; refazer a coroa custa semanas.',
    { difficulty: 1 }
  ),
  choice(
    'prot-08',
    'Qual material de moldagem tem melhor estabilidade dimensional?',
    ['Silicone de adição', 'Alginato', 'Godiva', 'Gesso'],
    'Silicone de adição pode ser vazado horas depois com precisão. Alginato precisa ser vazado logo.',
    { difficulty: 2 }
  ),
  truth(
    'prot-09',
    'Molde de alginato pode esperar até o dia seguinte para ser vazado.',
    false,
    'Alginato perde ou ganha água e distorce. Vazar o quanto antes, idealmente em minutos.',
    1
  ),
  multi(
    'prot-10',
    'Funções do provisório?',
    ['Proteger o preparo', 'Manter posição e contatos', 'Testar estética e função'],
    ['Substituir a coroa definitiva para sempre', 'Clarear o dente'],
    'O provisório é ensaio da definitiva. Dente sem provisório migra, dói e a gengiva cresce sobre o término.',
    { difficulty: 1 }
  ),
  choice(
    'prot-11',
    'Qual é o problema esperado?',
    ['Migração dos dentes vizinhos e extrusão do preparo', 'Fluorose', 'Necrose pulpar imediata', 'Nenhum'],
    'Sem contato, o dente se move. Em semanas a coroa definitiva já não encaixa.',
    { scenario: 'Provisório ficou sem contato proximal e oclusal por 6 semanas.', difficulty: 2 }
  ),
  pairs(
    'prot-12',
    'Relacione a classe de Kennedy à situação',
    [
      ['Classe I', 'Extremidade livre bilateral'],
      ['Classe II', 'Extremidade livre unilateral'],
      ['Classe III', 'Espaço unilateral com dentes nas duas pontas'],
      ['Classe IV', 'Espaço anterior único cruzando a linha média'],
    ],
    'A classe define suporte e desenho da prótese parcial removível. Classe I é a mais difícil de estabilizar.',
    2
  ),
  gap(
    'prot-13',
    'Em prótese total, o espaço funcional livre entre repouso e oclusão é de cerca de ___ mm.',
    '2 a 4',
    ['10', '0', '8'],
    'A dimensão vertical de oclusão é a de repouso menos o espaço livre. Errar isso dá dor muscular e fala estranha.',
    3
  ),
  choice(
    'prot-14',
    'Qual sinal sugere dimensão vertical aumentada?',
    ['Dentes batem ao falar e o paciente parece "cheio"', 'Comissuras caídas e queilite angular', 'Mais espaço para a língua', 'Lábios finos e afundados'],
    'Aumentou demais: dentes clicam na fala e a musculatura cansa. Diminuiu: cara de idoso e canto da boca úmido.',
    { difficulty: 3 }
  ),
  choice(
    'prot-15',
    'Por que remover todo o excesso de cimento subgengival?',
    ['Evitar inflamação e perda óssea ao redor', 'Melhorar a cor', 'Facilitar a remoção da coroa', 'Aumentar a retenção'],
    'Cimento no sulco age como cálculo: retém biofilme e inflama. Cheque com fio e sonda.',
    { difficulty: 1 }
  ),
  truth(
    'prot-16',
    'O contato proximal ideal deixa o fio dental passar com leve resistência.',
    true,
    'Aberto retém comida; apertado impede assentar. Resistência leve é a medida.',
    1
  ),
  order(
    'prot-17',
    'Ordene as etapas de uma coroa unitária',
    ['Planejamento e provisório pré-fabricado', 'Preparo do dente', 'Moldagem com afastamento gengival', 'Prova e ajuste', 'Cimentação e remoção de excessos'],
    'Do planejamento à cimentação: cada etapa depende da anterior estar bem feita.',
    { difficulty: 1 }
  ),
  choice(
    'prot-18',
    'Prótese total superior cai ao abrir a boca. Qual propriedade falhou?',
    ['Retenção', 'Suporte', 'Estética', 'Oclusão'],
    'Retenção é resistir à remoção no sentido oposto à inserção. Selamento periférico e adaptação ao palato são a chave.',
    { difficulty: 2 }
  ),
  gap(
    'prot-19',
    'Quando resta pouca estrutura coronária, indica-se um ___ intrarradicular para reter o núcleo.',
    'pino',
    ['grampo', 'bracket', 'implante'],
    'O pino retém o núcleo, não reforça a raiz. Preservar dentina e ter férula importa mais que o pino.',
    2
  ),
  multi(
    'prot-20',
    'O que conferir na prova da coroa antes de cimentar?',
    ['Adaptação marginal', 'Contato proximal', 'Contatos oclusais'],
    ['Peso da coroa', 'Temperatura da coroa'],
    'Provar bem evita coroa alta, aberta ou com margem vazando. Depois de cimentar, o ajuste é limitado.',
    { difficulty: 1 }
  ),
  truth(
    'prot-21',
    'Doença periodontal ativa deve ser controlada antes da prótese definitiva.',
    true,
    'Gengiva inflamada sangra na moldagem e muda de posição depois. Estabilizar antes de moldar.',
    1
  ),
  choice(
    'prot-22',
    'Qual cerâmica tem maior resistência à fratura?',
    ['Zircônia', 'Feldspática', 'Dissilicato de lítio', 'Porcelana de baixa fusão'],
    'Zircônia é a mais resistente, ideal para posteriores e pontes. Feldspática é a mais estética, para facetas.',
    { difficulty: 2 }
  ),
  choice(
    'prot-23',
    'Quando indicar inlay/onlay em vez de coroa total?',
    ['Quando ainda há estrutura sadia suficiente para preservar', 'Sempre em dentes tratados endodonticamente', 'Quando o dente tem mobilidade grau 3', 'Nunca em posteriores'],
    'Preparo parcial poupa dente. A coroa total é para quando não sobrou parede confiável.',
    { difficulty: 2 }
  ),
  choice(
    'prot-24',
    'Paciente relata queimação e queilite angular com prótese total antiga. Causa provável?',
    ['Dimensão vertical diminuída por desgaste', 'Alergia à resina acrílica', 'Excesso de dimensão vertical', 'Falta de flúor'],
    'Dentes gastos fecham demais a boca; a comissura dobra e fica úmida. Refazer a dimensão resolve.',
    { difficulty: 3 }
  ),
];
