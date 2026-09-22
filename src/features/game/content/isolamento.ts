import type { ExerciseSeed } from '../types';

export const ISOLAMENTO_EXERCISES: ExerciseSeed[] = [
  {
    id: 'isol-01',
    kind: 'choice',
    difficulty: 1,
    prompt: 'Por que o fio dental é amarrado no grampo?',
    options: [
      'Para marcar o grampo do kit',
      'Para resgatar o grampo se ele soltar ou fraturar',
      'Para segurar o lençol de borracha',
      'Para afastar a língua',
    ],
    answer: 1,
    explanation:
      'O fio permite recuperar o grampo se ele se soltar durante a prova, instalação ou remoção, reduzindo o risco de deglutição ou aspiração.',
  },
  {
    id: 'isol-02',
    kind: 'boolean',
    difficulty: 1,
    prompt: 'Verdadeiro ou falso?',
    statement: 'Endodontia pode ser realizada sem isolamento absoluto quando o paciente colabora.',
    answer: false,
    explanation:
      'O isolamento absoluto é o padrão de cuidado no tratamento endodôntico não cirúrgico. Ele reduz contaminação salivar e protege contra instrumentos e irrigantes.',
  },
  {
    id: 'isol-03',
    kind: 'order',
    difficulty: 2,
    prompt: 'Ordene a montagem do isolamento',
    steps: [
      'Selecionar o grampo de acordo com a anatomia cervical',
      'Amarrar o fio dental de segurança e testar o grampo no dente',
      'Perfurar o lençol conforme os dentes a isolar',
      'Levar o conjunto e passar os contatos com fio dental',
      'Inverter a borracha no sulco e conferir a vedação',
    ],
    explanation:
      'O fio deve estar preso ao grampo antes de qualquer prova intraoral. A estabilidade é verificada antes da instalação definitiva do campo.',
  },
  {
    id: 'isol-04',
    kind: 'choice',
    difficulty: 2,
    prompt: 'Qual é a conduta?',
    scenario: 'O campo parece isolado, mas há umidade subindo pela cervical do dente 25.',
    options: [
      'Seguir com o adesivo e secar com ar antes',
      'Corrigir: inverter melhor a borracha, usar barreira gengival ou trocar o grampo',
      'Ignorar, porque adesivo moderno tolera umidade',
      'Aumentar o tempo de fotoativação para compensar',
    ],
    answer: 1,
    explanation:
      'A entrada de umidade pode comprometer o procedimento adesivo. A causa deve ser corrigida por inversão, amarrilho, ajuste do grampo ou material de vedação compatível antes de prosseguir.',
  },
  {
    id: 'isol-05',
    kind: 'match',
    difficulty: 2,
    prompt: 'Relacione o instrumento com a função',
    pairs: [
      { left: 'Perfurador de Ainsworth', right: 'Fazer os orifícios no lençol' },
      { left: 'Pinça de Palmer', right: 'Levar e remover o grampo' },
      { left: 'Arco de Young', right: 'Manter o lençol estendido' },
      { left: 'Barreira gengival fotopolimerizável', right: 'Selar vazamentos cervicais' },
    ],
    explanation:
      'Conhecer a função de cada instrumento permite selecionar e utilizar o material com segurança.',
  },
  {
    id: 'isol-06',
    kind: 'multi',
    difficulty: 2,
    prompt: 'Selecione os procedimentos em que o isolamento absoluto é obrigatório ou frequentemente preferível',
    options: [
      'Tratamento endodôntico',
      'Restauração adesiva',
      'Cimentação adesiva de peça indireta',
      'Consulta de anamnese',
      'Aplicação de selante',
    ],
    answers: [0, 1, 2, 4],
    explanation:
      'Na endodontia, o isolamento absoluto é padrão de cuidado. Em restaurações adesivas, cimentações e selantes, ele costuma oferecer controle de umidade e segurança, mas a indicação depende do acesso, do material e da possibilidade de isolamento efetivo.',
  },
  {
    id: 'isol-07',
    kind: 'blank',
    difficulty: 2,
    prompt: 'Complete a frase',
    sentence: 'A ___ da borracha no sulco gengival contribui para a vedação cervical.',
    answer: 'inversão',
    bank: ['inversão', 'perfuração', 'tração', 'fotoativação'],
    explanation:
      'A inversão adapta a borracha ao sulco. Instrumento rombo, fio dental, jato de ar e amarrilho podem auxiliar sem lesar os tecidos.',
  },
  {
    id: 'isol-08',
    kind: 'choice',
    difficulty: 3,
    prompt: 'Qual grampo é mais adequado?',
    scenario: 'Molar inferior parcialmente erupcionado, com pouca altura de coroa clínica.',
    options: [
      'Grampo de incisivo, por ser menor',
      'Grampo para molar com mordentes retentivos direcionados apicalmente, testado quanto à estabilidade',
      'Qualquer grampo, desde que fique preso na gengiva',
      'Nenhum: usar apenas isolamento relativo com algodão',
    ],
    answer: 1,
    explanation:
      'O grampo é escolhido pela anatomia cervical, pelo grau de erupção e pela estabilidade. Os mordentes devem apoiar o dente sem traumatizar desnecessariamente o tecido gengival.',
  },
  {
    id: 'isol-09',
    kind: 'boolean',
    difficulty: 2,
    prompt: 'Verdadeiro ou falso?',
    statement: 'O isolamento absoluto também protege o paciente da aspiração de instrumentos.',
    answer: true,
    explanation:
      'Além de controlar umidade e melhorar visibilidade, o lençol é barreira física contra deglutição e aspiração de limas, grampos e fragmentos.',
  },
  {
    id: 'isol-10',
    kind: 'choice',
    difficulty: 2,
    prompt: 'O lençol rasgou e o defeito comprometeu a vedação cervical. O que fazer?',
    options: [
      'Continuar, pois a vedação não influencia o procedimento',
      'Reposicionar e vedar adequadamente ou substituir o lençol antes de iniciar',
      'Colar o rasgo com adesivo dentinário',
      'Trocar para isolamento relativo',
    ],
    answer: 1,
    explanation:
      'Quando o rasgo permite entrada de fluido, o campo deve ser corrigido. Um defeito distante da área operatória pode ser manejado de outra forma se a vedação e a segurança permanecerem adequadas.',
  },
  {
    id: 'isol-11',
    kind: 'blank',
    difficulty: 1,
    prompt: 'Complete a frase',
    sentence: 'Além do dente a tratar, isolar os dentes ___ facilita o acesso e a matriz.',
    answer: 'vizinhos',
    bank: ['vizinhos', 'antagonistas', 'anteriores', 'decíduos'],
    explanation:
      'Ampliar o campo melhora a visão, a passagem da matriz e o afastamento — especialmente em restaurações proximais.',
  },
  {
    id: 'isol-12',
    kind: 'order',
    difficulty: 3,
    prompt: 'Ordene a remoção segura do isolamento',
    steps: [
      'Conferir se o procedimento está concluído',
      'Cortar os septos de borracha com tesoura protegendo o tecido',
      'Remover o grampo com a pinça',
      'Retirar lençol e arco em conjunto',
      'Inspecionar sulcos e conferir se nenhum fragmento ficou',
    ],
    explanation:
      'Após a remoção, é necessário inspecionar a borracha e os espaços interproximais para confirmar que nenhum fragmento permaneceu retido.',
  },
];
