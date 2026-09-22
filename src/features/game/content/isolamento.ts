import type { ExerciseSeed } from '../types';
import { choice, gap, multi, order, pairs, truth } from './authoring';

export const ISOLAMENTO_EXERCISES: ExerciseSeed[] = [
  multi(
    'isol-01',
    'Quais são vantagens do isolamento absoluto?',
    ['Campo seco e limpo', 'Protege contra aspiração de instrumentos', 'Afasta língua e bochecha'],
    ['Dispensa a anestesia', 'Substitui a sucção'],
    'Dique bem colocado = restauração adesiva previsível e paciente protegido de lima, grampo e hipoclorito.',
    { difficulty: 1 }
  ),
  truth(
    'isol-02',
    'O isolamento absoluto é padrão de cuidado no tratamento endodôntico.',
    true,
    'Proteção contra deglutição de instrumentos e contra o hipoclorito, além de controle da contaminação do canal.'
  ),
  choice(
    'isol-03',
    'Para que serve amarrar fio dental no grampo?',
    ['Recuperar o grampo se ele escapar para a garganta', 'Fixar melhor o lençol', 'Marcar o lado vestibular', 'Facilitar a esterilização'],
    'Grampo que pula sem fio pode ser deglutido ou aspirado. O fio é o cinto de segurança.',
    { difficulty: 1 }
  ),
  choice(
    'isol-04',
    'Antes de levar o grampo à boca, o que testar?',
    ['Estabilidade dos quatro pontos de apoio no dente', 'Se cabe no perfurador', 'A cor do lençol', 'Se a mola está brilhante'],
    'Grampo que balança no teste vai pular durante o procedimento. Apoio em quatro pontos, sem tocar a gengiva além do necessário.',
    { difficulty: 1 }
  ),
  gap(
    'isol-05',
    'O grampo 212 é o mais usado para restaurações de classe ___.',
    'V',
    ['I', 'II', 'IV'],
    'O 212 (Ferrier) afasta a gengiva e expõe a margem cervical. Costuma ser estabilizado com godiva.',
    3
  ),
  order(
    'isol-06',
    'Ordene a colocação do isolamento (grampo primeiro)',
    ['Selecionar e testar o grampo', 'Amarrar fio dental no grampo', 'Perfurar o lençol', 'Levar o grampo ao dente', 'Passar o lençol pelo grampo', 'Inverter as bordas do lençol'],
    'Testar e amarrar antes de colocar; inverter depois de tudo no lugar. Cada passo evita um problema.',
    { difficulty: 2 }
  ),
  choice(
    'isol-07',
    'Para que serve inverter a borda do lençol no sulco?',
    ['Vedar e impedir a entrada de saliva', 'Deixar o campo mais bonito', 'Prender o arco', 'Proteger o esmalte'],
    'Borda invertida cria vedação. Sem inversão, a saliva entra por baixo e o campo molha.',
    { difficulty: 2 }
  ),
  truth(
    'isol-08',
    'Quem tem alergia a látex pode usar lençol de látex se for rápido.',
    false,
    'Alergia a látex pode causar reação grave. Use lençol sem látex (nitrílico ou similar).',
    1
  ),
  choice(
    'isol-09',
    'Lençol rasgou ao passar pelo contato proximal. Como evitar?',
    ['Passar fio dental antes para testar e abrir o contato', 'Fazer um furo maior', 'Puxar com força', 'Lubrificar com pasta profilática'],
    'Se o fio não passa, o lençol não passa. Teste o contato e, se preciso, lubrifique a borda do furo.',
    { difficulty: 2 }
  ),
  choice(
    'isol-10',
    'Grampo sem asas: qual é a sequência de colocação?',
    ['Grampo no dente, depois o lençol por cima', 'Lençol e grampo juntos', 'Lençol primeiro, grampo depois', 'Arco primeiro'],
    'Sem asas, o grampo vai primeiro e o lençol é esticado por cima. Com asas, grampo e lençol podem ir juntos.',
    { difficulty: 2 }
  ),
  pairs(
    'isol-11',
    'Relacione o instrumento à função',
    [
      ['Perfurador', 'Fazer os furos no lençol'],
      ['Porta-grampo', 'Abrir e levar o grampo ao dente'],
      ['Arco', 'Manter o lençol esticado'],
      ['Fio dental', 'Segurança e passagem interproximal'],
    ],
    'Kit básico do dique: quem sabe o que cada peça faz monta o isolamento em poucos minutos.',
    1
  ),
  truth(
    'isol-12',
    'Saliva no campo compromete a adesão da restauração.',
    true,
    'Umidade e proteínas salivares contaminam o adesivo. Campo seco é pré-requisito, não luxo.'
  ),
  choice(
    'isol-13',
    'Dente sem coroa suficiente para o grampo. O que fazer?',
    ['Colocar o grampo no dente vizinho e isolar vários dentes', 'Desistir do isolamento', 'Apertar mais o grampo', 'Usar dois grampos no mesmo dente'],
    'Isolar o quadrante com grampo no dente ao lado mantém o campo seco sem forçar um dente frágil.',
    { difficulty: 2 }
  ),
  choice(
    'isol-14',
    'Paciente com o nariz entupido. Qual é o cuidado?',
    ['Avaliar se consegue respirar pelo nariz antes de isolar', 'Isolar rápido e cobrir o nariz', 'Fazer furos extras no lençol', 'Deitar a cadeira mais'],
    'Com o dique, a boca fica fechada. Quem não respira pelo nariz não tolera; considere isolamento relativo.',
    { difficulty: 2 }
  ),
  gap(
    'isol-15',
    'O isolamento com rolos de algodão e sugador é chamado de isolamento ___.',
    'relativo',
    ['absoluto', 'total', 'seletivo'],
    'Relativo controla umidade parcialmente. Serve para profilaxia, selante em alguns casos e quando o absoluto é inviável.',
    1
  ),
  multi(
    'isol-16',
    'Quais sinais mostram que o dique está vedando?',
    ['Nenhuma saliva aparece ao redor do dente', 'Borda invertida em todo o contorno', 'Lençol sem rasgos'],
    ['O paciente sente gosto de borracha', 'O arco está torto'],
    'Cheque vedação antes de começar. Corrigir depois, com adesivo já aplicado, é tarde.',
    { difficulty: 2 }
  ),
  truth(
    'isol-17',
    'Grampo com asas permite levar grampo e lençol ao dente em um só movimento.',
    true,
    'As asas prendem o lençol; depois de assentar o grampo, o lençol é liberado das asas.',
    2
  ),
  choice(
    'isol-18',
    'Furos do lençol ficaram muito próximos. Consequência?',
    ['Lençol rasga ou não veda entre os dentes', 'Grampo não abre', 'Arco não encaixa', 'Nenhuma'],
    'Furos muito próximos deixam pouca borracha entre os dentes. Furos muito distantes puxam e não invertem.',
    { difficulty: 2 }
  ),
  choice(
    'isol-19',
    'Godiva no grampo 212 serve para?',
    ['Estabilizar o grampo no dente', 'Anestesiar a gengiva', 'Colar o lençol', 'Clarear o esmalte'],
    'O 212 apoia em dentes com pouca retenção; a godiva nas garras impede que ele deslize.',
    { difficulty: 3 }
  ),
  gap(
    'isol-20',
    'O lençol deve ser removido cortando os septos interproximais ___ de soltar o grampo.',
    'antes',
    ['depois', 'em vez', 'independente'],
    'Cortar septos primeiro evita puxar o lençol contra os contatos e deixar pedaços de borracha entre os dentes.',
    2
  ),
  truth(
    'isol-21',
    'Após remover o dique, é preciso conferir se sobrou borracha entre os dentes.',
    true,
    'Fragmento de lençol no espaço interproximal causa inflamação gengival em poucos dias.',
    1
  ),
  choice(
    'isol-22',
    'Qual é o principal risco de não isolar em endodontia?',
    ['Aspiração ou deglutição de lima', 'Manchar o dente', 'Perder a cor do lençol', 'Aumentar o tempo de anestesia'],
    'Lima na garganta é emergência. Dique absoluto é a barreira mais simples e eficaz contra isso.',
    { difficulty: 1 }
  ),
  choice(
    'isol-23',
    'Qual procedimento tolera isolamento relativo?',
    ['Profilaxia com pasta', 'Restauração adesiva de classe II', 'Tratamento endodôntico', 'Cimentação adesiva de faceta'],
    'Quanto mais dependente de adesão e mais arriscado para a via aérea, mais o absoluto é indispensável.',
    { difficulty: 1 }
  ),
  pairs(
    'isol-24',
    'Relacione o problema à causa provável',
    [
      ['Saliva entrando no campo', 'Lençol não invertido'],
      ['Grampo que pula', 'Grampo não testado'],
      ['Lençol rasgado no contato', 'Contato não testado com fio'],
      ['Reação na pele do paciente', 'Alergia a látex'],
    ],
    'Quase todo problema do dique tem uma etapa pulada por trás.',
    2
  ),
];
