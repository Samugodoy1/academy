import type { ExerciseSeed } from '../types';
import { choice, gap, multi, order, pairs, truth } from './authoring';

export const RADIOLOGIA_EXERCISES: ExerciseSeed[] = [
  choice(
    'radio-01',
    'Qual tomada mostra melhor cárie proximal em posteriores?',
    ['Interproximal (bite-wing)', 'Panorâmica', 'Periapical', 'Oclusal'],
    'A bite-wing mostra coroas superiores e inferiores no mesmo filme, com pouca sobreposição proximal.',
    { difficulty: 1 }
  ),
  choice(
    'radio-02',
    'Qual tomada mostra o ápice do dente?',
    ['Periapical', 'Interproximal', 'Oclusal', 'Telerradiografia'],
    'A periapical inclui coroa, raiz e pelo menos 2 a 3 mm de osso além do ápice.',
    { difficulty: 1 }
  ),
  truth(
    'radio-03',
    'Radiolúcido aparece escuro na imagem.',
    true,
    'Estrutura que deixa o raio X passar fica escura (radiolúcida). Estrutura densa bloqueia o feixe e fica clara (radiopaca).'
  ),
  gap(
    'radio-04',
    'O esmalte é a estrutura mais ___ do dente.',
    'radiopaca',
    ['radiolúcida', 'porosa', 'irregular'],
    'Quanto mais mineralizado, mais claro na radiografia. Por isso o esmalte é o tecido mais radiopaco.',
    1
  ),
  pairs(
    'radio-05',
    'Relacione a estrutura à aparência radiográfica',
    [
      ['Esmalte', 'Radiopaco intenso'],
      ['Câmara pulpar', 'Radiolúcida'],
      ['Lâmina dura', 'Linha radiopaca fina'],
      ['Espaço do ligamento', 'Linha radiolúcida fina'],
    ],
    'Saber o normal é o primeiro passo para reconhecer o anormal. Lâmina dura clara, ligamento escuro.'
  ),
  choice(
    'radio-06',
    'O que corrigir?',
    ['Angulação horizontal', 'Angulação vertical', 'Tempo de exposição', 'Contraste no monitor'],
    'Contatos sobrepostos são erro de angulação horizontal: o feixe não passou paralelo às faces proximais.',
    { scenario: 'Na bite-wing, os contatos proximais aparecem sobrepostos.' }
  ),
  choice(
    'radio-07',
    'O que aconteceu?',
    ['Angulação vertical insuficiente', 'Angulação vertical excessiva', 'Filme invertido', 'Sobre-exposição'],
    'Na técnica da bissetriz, pouca angulação vertical alonga a imagem; angulação em excesso encurta.',
    { scenario: 'Na periapical, as raízes aparecem muito alongadas.', difficulty: 3 }
  ),
  truth(
    'radio-08',
    'A técnica do paralelismo usa posicionador para manter o filme paralelo ao dente.',
    true,
    'Filme paralelo ao longo eixo e feixe perpendicular a ambos: menos distorção que a bissetriz.',
    2
  ),
  choice(
    'radio-09',
    'Como aparece a cárie proximal em esmalte?',
    ['Triângulo radiolúcido com base na superfície', 'Ponto radiopaco na cúspide', 'Linha radiopaca no contato', 'Halo escuro ao redor da raiz'],
    'A desmineralização se espalha ao longo dos prismas de esmalte: base para fora, ápice para a junção amelodentinária.',
    { difficulty: 2 }
  ),
  gap(
    'radio-10',
    'O princípio ALARA orienta manter a dose tão ___ quanto razoavelmente possível.',
    'baixa',
    ['alta', 'constante', 'rápida'],
    'Toda exposição precisa de justificativa clínica. Técnica correta evita repetição, e repetição é dose extra.',
    1
  ),
  multi(
    'radio-11',
    'O que reduz a dose para o paciente?',
    ['Colimação retangular', 'Receptor digital ou filme rápido', 'Pedir só a tomada que responde à pergunta clínica'],
    ['Repetir a tomada "para garantir"', 'Aumentar o tempo de exposição'],
    'Colimar, usar receptores sensíveis e indicar com critério são as medidas com maior impacto na dose.'
  ),
  truth(
    'radio-12',
    'A radiografia diferencia com segurança granuloma de cisto periapical.',
    false,
    'Ambos aparecem como radiolucidez apical. Só o exame histopatológico define o diagnóstico.',
    3
  ),
  choice(
    'radio-13',
    'Qual é a interpretação mais adequada?',
    ['Compatível com lesão periapical de origem endodôntica', 'Cárie de raiz', 'Dente normal', 'Fratura radicular'],
    'Radiolucidez apical em dente sem resposta ao frio indica polpa necrosada com periodontite apical.',
    { scenario: 'Radiolucidez arredondada no ápice do 12, que não responde ao frio.' }
  ),
  choice(
    'radio-14',
    'Como localizar um objeto no sentido vestíbulo-lingual?',
    ['Duas tomadas com angulação horizontal diferente (técnica de Clark)', 'Aumentar o tempo de exposição', 'Fazer uma panorâmica', 'Trocar o filme por um maior'],
    'Se o objeto se move no mesmo sentido do tubo, está por lingual; se no sentido oposto, por vestibular.',
    { difficulty: 3 }
  ),
  gap(
    'radio-15',
    'Na técnica de Clark, o objeto que se move no mesmo sentido do tubo está por ___.',
    'lingual',
    ['vestibular', 'mesial', 'oclusal'],
    'Regra "mesmo lado, lingual": objetos linguais acompanham o deslocamento do tubo.',
    3
  ),
  truth(
    'radio-16',
    'A panorâmica é a melhor escolha para detectar cárie proximal.',
    false,
    'Panorâmica dá visão geral com menos nitidez e sobreposição. Para cárie proximal, bite-wing.',
    1
  ),
  choice(
    'radio-17',
    'Qual exame está indicado?',
    ['Tomografia computadorizada de feixe cônico', 'Periapical isolada', 'Bite-wing', 'Oclusal'],
    'Para medir altura e espessura óssea em três dimensões antes de implante, a TCFC é o exame de escolha.',
    { scenario: 'Planejamento de implante na região de 36 com dúvida sobre a posição do canal mandibular.' }
  ),
  choice(
    'radio-18',
    'Filme muito claro após o processamento. Causa provável?',
    ['Subexposição ou revelação insuficiente', 'Superexposição', 'Filme colocado ao contrário', 'Paciente se mexeu'],
    'Pouca radiação ou revelador fraco deixam a imagem clara; excesso deixa escura.',
    { difficulty: 2 }
  ),
  truth(
    'radio-19',
    'Gestante com dor de dente pode fazer radiografia periapical se houver indicação.',
    true,
    'A dose de uma periapical é muito baixa. Com indicação clínica e proteção, o exame não é contraindicado.',
    2
  ),
  multi(
    'radio-20',
    'Quais são indicações de radiografia oclusal?',
    ['Localizar cálculo em ducto salivar', 'Avaliar expansão de cortical', 'Localizar dente incluso no sentido vestíbulo-palatino'],
    ['Medir profundidade de bolsa', 'Avaliar o seio maxilar inteiro'],
    'A oclusal mostra o arco "de cima": ótima para localizar objetos e ver expansão óssea.',
    { difficulty: 3 }
  ),
  order(
    'radio-21',
    'Ordene a leitura sistemática de uma periapical',
    ['Conferir identificação e qualidade da imagem', 'Avaliar coroa e restaurações', 'Avaliar raiz e canal', 'Avaliar ligamento e lâmina dura', 'Avaliar osso periapical e vizinhança'],
    'Sempre na mesma ordem, de fora para dentro. Quem lê "só o que dói" perde achados ao lado.',
    { difficulty: 2 }
  ),
  choice(
    'radio-22',
    'Qual tomada mostra a crista óssea interproximal com fidelidade?',
    ['Interproximal (bite-wing)', 'Panorâmica', 'Telerradiografia lateral', 'Oclusal'],
    'A bite-wing tem pouca distorção vertical: ideal para avaliar perda óssea horizontal inicial.',
    { difficulty: 2 }
  ),
  pairs(
    'radio-23',
    'Relacione a pergunta clínica ao exame',
    [
      ['Cárie proximal', 'Bite-wing'],
      ['Lesão periapical', 'Periapical'],
      ['Visão geral dos arcos', 'Panorâmica'],
      ['Planejar implante em 3D', 'Tomografia de feixe cônico'],
    ],
    'Primeiro a pergunta, depois o exame. Nenhuma tomada responde a tudo.',
    1
  ),
  truth(
    'radio-24',
    'Um dente com restauração metálica aparece radiolúcido.',
    false,
    'Metal bloqueia totalmente o feixe e aparece branco intenso (radiopaco).',
    1
  ),
];
