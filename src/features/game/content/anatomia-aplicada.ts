import type { ExerciseSeed } from '../types';
import { choice, gap, multi, order, pairs, truth } from './authoring';

export const ANAT_EXERCISES: ExerciseSeed[] = [
  choice(
    'anat-01',
    'Qual nervo inerva a polpa dos dentes inferiores?',
    ['Alveolar inferior', 'Lingual', 'Bucal', 'Facial'],
    'O alveolar inferior entra no canal mandibular e distribui ramos para todos os dentes do lado.',
    { difficulty: 1 }
  ),
  choice(
    'anat-02',
    'Onde fica o forame mentoniano?',
    ['Perto dos ápices dos pré-molares inferiores', 'Abaixo do canino inferior', 'Abaixo do segundo molar inferior', 'Na linha média'],
    'Geralmente entre o primeiro e o segundo pré-molar. Por isso é referência para o bloqueio mentoniano e alerta na cirurgia periapical.',
    { difficulty: 2 }
  ),
  gap(
    'anat-03',
    'O nervo ___ dá sensibilidade aos dois terços anteriores da língua.',
    'lingual',
    ['facial', 'hipoglosso', 'glossofaríngeo'],
    'O lingual é o vizinho do alveolar inferior no bloqueio, por isso a língua também dorme.',
    1
  ),
  choice(
    'anat-04',
    'Qual nervo inerva a gengiva vestibular dos molares inferiores?',
    ['Bucal', 'Lingual', 'Mentoniano', 'Alveolar inferior'],
    'O bloqueio do alveolar inferior não pega a gengiva vestibular dos molares. Complementar com o bucal.',
    { difficulty: 2 }
  ),
  pairs(
    'anat-05',
    'Relacione o nervo à região',
    [
      ['Nasopalatino', 'Palato anterior'],
      ['Palatino maior', 'Palato posterior'],
      ['Infraorbital', 'Lábio superior e asa do nariz'],
      ['Alveolar superior posterior', 'Molares superiores'],
    ],
    'Mapa da maxila: saber o território de cada nervo escolhe a técnica anestésica certa.',
    2
  ),
  truth(
    'anat-06',
    'A raiz mesiovestibular do primeiro molar superior costuma ser inervada pelo alveolar superior médio.',
    true,
    'Por isso o bloqueio do alveolar superior posterior às vezes deixa essa raiz sensível. Complementar por infiltração.',
    3
  ),
  choice(
    'anat-07',
    'Quantas raízes tem o primeiro molar superior?',
    ['Três', 'Duas', 'Uma', 'Quatro'],
    'Duas vestibulares e uma palatina. A mesiovestibular frequentemente esconde um segundo canal (MV2).',
    { difficulty: 1 }
  ),
  choice(
    'anat-08',
    'Qual canal é mais frequentemente esquecido no primeiro molar superior?',
    ['Segundo canal mesiovestibular (MV2)', 'Palatino', 'Distovestibular', 'Distal'],
    'O MV2 existe em mais da metade dos casos e fica escondido sob uma prateleira de dentina. Procure sempre.',
    { difficulty: 3 }
  ),
  gap(
    'anat-09',
    'O molar inferior tem tipicamente ___ raízes.',
    'duas',
    ['três', 'quatro', 'uma'],
    'Mesial e distal. A mesial costuma ter dois canais; a distal, um ou dois.',
    1
  ),
  multi(
    'anat-10',
    'Quais músculos fecham a boca (elevadores)?',
    ['Masseter', 'Temporal', 'Pterigóideo medial'],
    ['Pterigóideo lateral', 'Bucinador'],
    'Os três elevadores fecham; o pterigóideo lateral abre e protrui. Dor no masseter é a queixa mais comum na DTM muscular.',
    { difficulty: 2 }
  ),
  choice(
    'anat-11',
    'Qual músculo pode ser lesado pela agulha no bloqueio do alveolar inferior, causando trismo?',
    ['Pterigóideo medial', 'Masseter', 'Temporal', 'Bucinador'],
    'O pterigóideo medial fica no caminho da agulha. Hematoma ou trauma nele dá trismo dias depois.',
    { difficulty: 3 }
  ),
  pairs(
    'anat-12',
    'Relacione a glândula ao ducto',
    [
      ['Parótida', 'Ducto de Stensen, na altura do 2º molar superior'],
      ['Submandibular', 'Ducto de Wharton, na carúncula sublingual'],
      ['Sublingual', 'Vários ductos pequenos no assoalho'],
    ],
    'Saber onde os ductos abrem ajuda a localizar cálculo salivar e evitar lesão em cirurgia.',
    2
  ),
  choice(
    'anat-13',
    'Paciente com paralisia facial transitória após bloqueio inferior. O que aconteceu?',
    ['Anestésico depositado na parótida atingiu o nervo facial', 'Lesão do alveolar inferior', 'Reação alérgica', 'AVC'],
    'Agulha muito profunda ou posterior chega à parótida, onde o facial passa. Tranquilizar, proteger o olho e aguardar.',
    { difficulty: 3 }
  ),
  truth(
    'anat-14',
    'O nervo facial é responsável pela sensibilidade da face.',
    false,
    'O facial (VII) é motor da mímica. Sensibilidade da face é do trigêmeo (V).',
    1
  ),
  choice(
    'anat-15',
    'Infecção do 2º molar inferior com ápice abaixo da inserção do milo-hióideo se espalha para qual espaço?',
    ['Submandibular', 'Sublingual', 'Canino', 'Bucal'],
    'Ápice abaixo do milo-hióideo drena para submandibular; acima dele, para sublingual. Esse detalhe muda a gravidade.',
    { difficulty: 3 }
  ),
  gap(
    'anat-16',
    'Celulite bilateral dos espaços submandibular, sublingual e submentoniano chama-se angina de ___.',
    'Ludwig',
    ['Vincent', 'Bell', 'Winter'],
    'Emergência: risco de obstrução da via aérea. Encaminhar para hospital, não tratar no consultório.',
    3
  ),
  choice(
    'anat-17',
    'Qual estrutura fica logo acima dos ápices dos molares superiores?',
    ['Seio maxilar', 'Canal mandibular', 'Fossa nasal', 'Forame mentoniano'],
    'Raízes de molares e pré-molares superiores podem projetar-se no seio. Risco de comunicação na exodontia.',
    { difficulty: 1 }
  ),
  truth(
    'anat-18',
    'A articulação temporomandibular tem um disco entre o côndilo e a fossa.',
    true,
    'O disco articular acompanha o côndilo. Deslocamento dele produz o clique clássico.',
    1
  ),
  choice(
    'anat-19',
    'Qual músculo faz a protrusão e ajuda a abrir a boca?',
    ['Pterigóideo lateral', 'Masseter', 'Temporal', 'Pterigóideo medial'],
    'O pterigóideo lateral puxa o côndilo e o disco para frente. É o único mastigatório que abre.',
    { difficulty: 2 }
  ),
  multi(
    'anat-20',
    'O que o bloqueio do alveolar inferior costuma anestesiar?',
    ['Dentes inferiores do lado', 'Lábio inferior e mento', 'Metade da língua'],
    ['Gengiva vestibular dos molares', 'Lábio superior'],
    'Alveolar inferior + lingual dormem juntos. Gengiva vestibular dos molares é do nervo bucal.',
    { difficulty: 2 }
  ),
  gap(
    'anat-21',
    'A artéria que irriga a maxila e a mandíbula é ramo da carótida ___.',
    'externa',
    ['interna', 'comum', 'vertebral'],
    'A artéria maxilar, ramo da carótida externa, dá as alveolares. Hemorragia arterial em cirurgia bucal vem daí.',
    2
  ),
  choice(
    'anat-22',
    'Qual referência óssea marca a entrada do canal mandibular?',
    ['Língula', 'Linha oblíqua externa', 'Processo coronoide', 'Tubérculo geniano'],
    'A língula protege o forame mandibular. É o alvo mental do bloqueio do alveolar inferior.',
    { difficulty: 3 }
  ),
  truth(
    'anat-23',
    'Incisivos inferiores podem ter dois canais.',
    true,
    'Cerca de 20 a 40% têm canal lingual extra. Em retratamento, procure antes de culpar a obturação.',
    3
  ),
  order(
    'anat-25',
    'Ordene o trajeto do nervo alveolar inferior',
    ['Nervo mandibular (V3) sai do crânio pelo forame oval', 'Entra no forame mandibular, atrás da língula', 'Percorre o canal mandibular', 'Emite o nervo mentoniano pelo forame mentoniano', 'Termina como plexo incisivo'],
    'Do crânio ao queixo: cada trecho explica um sinal clínico, do bloqueio à parestesia do lábio.',
    { difficulty: 3 }
  ),
  choice(
    'anat-24',
    'Qual nervo dá sensibilidade à mucosa jugal?',
    ['Bucal', 'Facial', 'Lingual', 'Mentoniano'],
    'O bucal é sensitivo (ramo do V3). Não confundir com o músculo bucinador, que é motor do facial.',
    { difficulty: 2 }
  ),
];
