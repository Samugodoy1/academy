import type { ExerciseSeed } from '../types';
import { choice, gap, multi, order, pairs, truth } from './authoring';

export const ORTO_EXERCISES: ExerciseSeed[] = [
  choice(
    'orto-01',
    'Idade recomendada para a primeira avaliação ortodôntica?',
    ['Cerca de 7 anos', '12 anos', '18 anos', 'Só quando todos os permanentes nascerem'],
    'Aos 7 já dá para ver a relação dos molares e incisivos permanentes. Muito problema se intercepta nessa fase.',
    { difficulty: 1 }
  ),
  pairs(
    'orto-02',
    'Relacione a classe de Angle à descrição',
    [
      ['Classe I', 'Relação molar normal, problema dentário'],
      ['Classe II', 'Arco inferior para trás'],
      ['Classe III', 'Arco inferior para frente'],
    ],
    'Angle é o vocabulário básico. Classe II é a mais comum nos consultórios brasileiros.',
    1
  ),
  choice(
    'orto-03',
    'Classe II divisão 1 versus divisão 2: qual é a diferença?',
    ['Na divisão 1 os incisivos superiores estão protruídos; na 2, retroinclinados', 'Na divisão 1 falta um dente', 'A divisão 2 é bilateral', 'Não há diferença'],
    'Divisão 1: overjet grande, lábio incompetente. Divisão 2: overbite profundo e incisivos "para dentro".',
    { difficulty: 3 }
  ),
  gap(
    'orto-04',
    'O overjet normal é de cerca de ___ mm.',
    '2 a 3',
    ['10', '0', '6 a 8'],
    'Trespasse horizontal de 2 a 3 mm e vertical de 2 a 3 mm são a referência de normalidade.',
    2
  ),
  choice(
    'orto-05',
    'O que acontece no lado de pressão durante o movimento dentário?',
    ['Reabsorção óssea por osteoclastos', 'Aposição óssea por osteoblastos', 'Nada', 'Formação de cemento'],
    'O dente empurra o osso: reabsorve do lado da pressão e forma do lado da tensão. É assim que ele anda.',
    { difficulty: 2 }
  ),
  truth(
    'orto-06',
    'Força mais forte move o dente mais rápido e com mais segurança.',
    false,
    'Força excessiva estrangula o ligamento (hialinização), atrasa o movimento e aumenta reabsorção radicular. Leve e contínua é o ideal.',
    2
  ),
  choice(
    'orto-07',
    'Qual é a consequência clássica?',
    ['Mordida aberta anterior e protrusão dos incisivos superiores', 'Classe III', 'Apinhamento inferior', 'Diastema entre molares'],
    'Dedo ou chupeta empurra os superiores para frente e impede os incisivos de tocarem. Remover o hábito é o primeiro passo.',
    { scenario: 'Criança de 6 anos que ainda chupa o dedo.', difficulty: 1 }
  ),
  multi(
    'orto-08',
    'Sinais de respiração bucal?',
    ['Face alongada', 'Palato estreito e profundo', 'Lábios entreabertos em repouso'],
    ['Mordida profunda sempre', 'Excesso de saliva'],
    'Boca aberta muda a postura da língua e o crescimento da maxila. Avaliar com otorrino faz parte.',
    { difficulty: 2 }
  ),
  choice(
    'orto-09',
    'Mordida cruzada posterior bilateral em dentição mista. Tratamento?',
    ['Expansão rápida da maxila (disjuntor)', 'Esperar a dentição permanente', 'Extrair pré-molares', 'Contenção fixa'],
    'A sutura palatina ainda está aberta: expandir agora é fácil e estável. Depois vira cirurgia.',
    { difficulty: 2 }
  ),
  choice(
    'orto-10',
    'Classe III esquelética em criança de 8 anos. Melhor momento para tratar?',
    ['Agora, com tração reversa da maxila (máscara facial)', 'Só após os 18 anos', 'Após a erupção dos terceiros molares', 'Nunca é tratável'],
    'Maxila responde à tração antes dos 10 anos. Deixar crescer só piora a discrepância.',
    { difficulty: 3 }
  ),
  choice(
    'orto-11',
    'Aparelhos funcionais para Classe II funcionam melhor em qual fase?',
    ['Pico de crescimento puberal', 'Após o fim do crescimento', 'Na dentição decídua', 'Em qualquer idade igualmente'],
    'Eles aproveitam o crescimento mandibular. Sem crescimento, não há o que estimular.',
    { difficulty: 3 }
  ),
  truth(
    'orto-12',
    'Após o tratamento ortodôntico, a contenção deve ser usada por longo prazo.',
    true,
    'Dentes tendem a voltar, principalmente incisivos inferiores. Contenção é parte do tratamento, não opcional.',
    1
  ),
  choice(
    'orto-13',
    'Qual dente permanente fica incluso com mais frequência, depois do terceiro molar?',
    ['Canino superior', 'Incisivo central inferior', 'Primeiro molar', 'Segundo pré-molar superior'],
    'O canino superior faz um caminho longo até erupcionar. Palpar a bossa canina aos 9 a 10 anos previne surpresa.',
    { difficulty: 2 }
  ),
  pairs(
    'orto-14',
    'Relacione o fio ao uso',
    [
      ['Níquel-titânio', 'Alinhamento inicial (flexível)'],
      ['Aço inoxidável', 'Mecânica e fechamento de espaço (rígido)'],
      ['Beta-titânio (TMA)', 'Finalização e dobras'],
    ],
    'Flexível para desalinhados; rígido para mover em bloco. A sequência de fios segue essa lógica.',
    3
  ),
  choice(
    'orto-15',
    'Diastema entre incisivos centrais superiores em criança de 8 anos. Conduta?',
    ['Observar: costuma fechar com a erupção dos caninos', 'Fechar com aparelho agora', 'Frenectomia imediata', 'Restaurar com resina'],
    'Fase do "patinho feio". O diastema fecha sozinho na maioria; frenectomia só se persistir após os caninos.',
    { difficulty: 2 }
  ),
  gap(
    'orto-16',
    'Manchas brancas ao redor dos brackets após o tratamento indicam ___.',
    'desmineralização',
    ['fluorose', 'hipoplasia', 'erosão'],
    'Biofilme parado ao redor do bracket. Prevenção: higiene rigorosa, flúor e controle da dieta durante o tratamento.',
    1
  ),
  truth(
    'orto-17',
    'Reabsorção radicular é um risco possível do tratamento ortodôntico.',
    true,
    'Leve e comum; grave em alguns pacientes. Radiografias de controle e forças leves reduzem o problema.',
    2
  ),
  choice(
    'orto-18',
    'Perda precoce do segundo molar decíduo. Risco ortodôntico?',
    ['Mesialização do primeiro molar permanente e perda de espaço', 'Diastema anterior', 'Classe III', 'Mordida aberta'],
    'O molar permanente anda para frente e rouba o espaço do pré-molar. Mantenedor de espaço evita.',
    { difficulty: 2 }
  ),
  choice(
    'orto-19',
    'O que a telerradiografia lateral acrescenta ao diagnóstico?',
    ['Relação esquelética entre maxila, mandíbula e base do crânio', 'Cárie proximal', 'Bolsa periodontal', 'Vitalidade pulpar'],
    'Cefalometria mostra se o problema é dentário ou esquelético. Isso decide entre aparelho e cirurgia.',
    { difficulty: 2 }
  ),
  gap(
    'orto-20',
    'No ângulo ANB da cefalometria, valor em torno de 2° indica padrão esquelético de Classe ___.',
    'I',
    ['II', 'III', 'IV'],
    'ANB maior sugere Classe II; menor ou negativo, Classe III. É uma das medidas mais usadas.',
    3
  ),
  multi(
    'orto-21',
    'O que faz parte da documentação ortodôntica?',
    ['Modelos ou escaneamento', 'Fotografias intra e extraorais', 'Panorâmica e telerradiografia'],
    ['Exame de sangue', 'Teste de frio em todos os dentes'],
    'Documentação registra o ponto de partida e permite medir o que mudou.',
    { difficulty: 1 }
  ),
  truth(
    'orto-22',
    'Alinhadores removíveis dependem do uso de 20 a 22 horas por dia.',
    true,
    'Fora da boca não movem nada. Adesão do paciente é o fator crítico dessa técnica.',
    1
  ),
  choice(
    'orto-23',
    'O que é ancoragem em ortodontia?',
    ['Resistência ao movimento indesejado de dentes usados como apoio', 'Cimentação do bracket', 'Fio mais grosso', 'Uso de elástico'],
    'Toda força tem reação. Ancoragem controla para onde vai a reação, com dentes, mini-implantes ou aparelhos extraorais.',
    { difficulty: 3 }
  ),
  order(
    'orto-24',
    'Ordene as fases do tratamento corretivo',
    ['Alinhamento e nivelamento', 'Correção da relação molar e fechamento de espaços', 'Finalização e intercuspidação', 'Contenção'],
    'Primeiro alinhar, depois mover em bloco, depois refinar. Contenção fecha o ciclo.',
    { difficulty: 2 }
  ),
];
