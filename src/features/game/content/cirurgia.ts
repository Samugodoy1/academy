import type { ExerciseSeed } from '../types';
import { choice, gap, multi, order, pairs, truth } from './authoring';

export const CIRURGIA_EXERCISES: ExerciseSeed[] = [
  order(
    'cir-01',
    'Ordene os passos da exodontia simples',
    ['Anestesia', 'Sindesmotomia', 'Luxação com alavanca', 'Apreensão e avulsão com fórceps', 'Inspeção do alvéolo e compressão'],
    'Soltar as fibras antes de luxar, luxar antes de puxar. Força bruta sem sequência quebra raiz e osso.',
    { difficulty: 1 }
  ),
  gap(
    'cir-02',
    'Soltar as fibras gengivais ao redor do dente antes de luxar chama-se ___.',
    'sindesmotomia',
    ['osteotomia', 'alveoloplastia', 'gengivectomia'],
    'Sem sindesmotomia, a gengiva rasga junto com o dente. Passo rápido, poupa muita laceração.',
    1
  ),
  pairs(
    'cir-03',
    'Relacione o fórceps ao uso',
    [
      ['150', 'Universal superior'],
      ['151', 'Universal inferior'],
      ['23 (chifre de boi)', 'Molares inferiores'],
      ['17', 'Molares inferiores com raízes separadas'],
    ],
    'Fórceps é extensão da mão. Escolher o certo dá apreensão abaixo da coroa, em cemento, sem esmagar.',
    2
  ),
  choice(
    'cir-04',
    'Qual é o diagnóstico?',
    ['Alveolite', 'Infecção do alvéolo com abscesso', 'Dor pós-operatória normal', 'Fratura de mandíbula'],
    'Dor intensa que começa dias depois, alvéolo vazio e mau cheiro: coágulo perdido, osso exposto.',
    { scenario: 'Terceiro dia após exodontia do 38: dor intensa, alvéolo vazio, halitose, sem febre.', difficulty: 2 }
  ),
  choice(
    'cir-05',
    'Qual é o tratamento da alveolite?',
    ['Irrigar o alvéolo, curativo e analgesia', 'Antibiótico por 10 dias sem tocar no alvéolo', 'Curetar até sangrar muito', 'Nada, passa sozinha'],
    'Limpar restos, acalmar o osso exposto e controlar a dor. Antibiótico só se houver infecção.',
    { difficulty: 2 }
  ),
  multi(
    'cir-06',
    'O que aumenta o risco de alveolite?',
    ['Tabagismo', 'Trauma cirúrgico excessivo', 'Contraceptivo oral'],
    ['Comer sorvete no pós-operatório', 'Suturar o alvéolo'],
    'Fumar e sugar deslocam o coágulo; trauma e hormônios atrapalham a cicatrização.',
    { difficulty: 2 }
  ),
  choice(
    'cir-07',
    'Primeira medida para sangramento após exodontia?',
    ['Compressão com gaze por 20 a 30 minutos', 'Antibiótico', 'Bochecho vigoroso com água gelada', 'Aspirina'],
    'Pressão firme e contínua resolve a maioria dos sangramentos. Bochecho e aspirina pioram.',
    { difficulty: 1 }
  ),
  truth(
    'cir-08',
    'Paciente em uso de varfarina deve suspender o remédio antes de uma exodontia simples.',
    false,
    'Suspender aumenta o risco de trombose. Com INR estável e medidas hemostáticas locais, a exodontia é segura.',
    3
  ),
  choice(
    'cir-09',
    'Qual orientação pós-operatória está correta?',
    ['Não bochechar nas primeiras 24 horas', 'Bochechar com força de hora em hora', 'Fumar apenas após 2 horas', 'Comer alimentos quentes no mesmo dia'],
    'Bochecho, sucção e calor deslocam o coágulo. Frio, repouso e dieta pastosa nas primeiras 24 h.',
    { difficulty: 1 }
  ),
  choice(
    'cir-10',
    'Qual é a principal estrutura de risco?',
    ['Nervo alveolar inferior', 'Seio maxilar', 'Nervo infraorbital', 'Artéria facial'],
    'Terceiro molar inferior perto do canal mandibular: risco de parestesia do lábio. Precisa entrar no consentimento.',
    { scenario: 'Terceiro molar inferior incluso, raízes em contato com o canal mandibular na radiografia.', difficulty: 2 }
  ),
  choice(
    'cir-11',
    'Qual é a principal estrutura de risco?',
    ['Seio maxilar', 'Canal mandibular', 'Nervo lingual', 'Forame mentoniano'],
    'Raízes de molares superiores podem estar dentro do seio. Cuidado com comunicação bucossinusal.',
    { scenario: 'Exodontia do 16 com raízes próximas ao assoalho do seio na radiografia.', difficulty: 2 }
  ),
  choice(
    'cir-12',
    'Como confirmar uma comunicação bucossinusal?',
    ['Pedir para o paciente soprar com o nariz fechado e observar bolhas no alvéolo', 'Sondar fundo com a cureta', 'Irrigar com hipoclorito', 'Aguardar 1 semana'],
    'Manobra de Valsalva suave. Nunca explorar o alvéolo com instrumento: pode criar a comunicação.',
    { difficulty: 3 }
  ),
  gap(
    'cir-13',
    'A incisão do retalho deve terminar sobre osso ___.',
    'sadio',
    ['exposto', 'removido', 'infectado'],
    'Sutura sobre defeito ósseo afunda e abre. Planeje a incisão para fechar sobre osso íntegro.',
    2
  ),
  truth(
    'cir-14',
    'O retalho deve ter base mais larga que o ápice para manter a irrigação.',
    true,
    'Base larga garante suprimento sanguíneo. Retalho estreito na base necrosa.',
    2
  ),
  choice(
    'cir-15',
    'Antibiótico profilático em exodontia simples em paciente saudável?',
    ['Não indicado', 'Sempre indicado', 'Só se o dente for superior', 'Só se demorar mais de 10 minutos'],
    'Sem fator de risco, o antibiótico só traz efeito adverso e resistência. Técnica limpa é a profilaxia.',
    { difficulty: 2 }
  ),
  multi(
    'cir-16',
    'Quem precisa de profilaxia para endocardite antes de exodontia?',
    ['Portador de prótese valvar', 'Quem já teve endocardite', 'Cardiopatia congênita cianótica não corrigida'],
    ['Hipertenso controlado', 'Quem tem prolapso mitral sem regurgitação'],
    'Profilaxia é para o grupo de alto risco. Amoxicilina 2 g, 30 a 60 minutos antes, é o esquema padrão.',
    { difficulty: 3 }
  ),
  choice(
    'cir-17',
    'Qual é o risco específico?',
    ['Osteonecrose dos maxilares relacionada a medicamento', 'Alveolite simples', 'Hemorragia por plaquetopenia', 'Trismo'],
    'Antirreabsortivos e antiangiogênicos comprometem a remodelação óssea. Exodontia pede planejamento e conduta conservadora.',
    { scenario: 'Paciente em uso de zoledronato intravenoso por metástase óssea precisa extrair o 46.', difficulty: 3 }
  ),
  choice(
    'cir-18',
    'Qual é a conduta inicial?',
    ['Irrigar sob o capuz, orientar higiene e reavaliar', 'Extrair na mesma sessão com edema', 'Só prescrever antibiótico', 'Ignorar até doer mais'],
    'Pericoronarite aguda: aliviar a infecção local primeiro. A exodontia vem depois que o quadro esfria.',
    { scenario: 'Dor e edema na gengiva sobre o 48 semi-incluso, com trismo leve.', difficulty: 2 }
  ),
  gap(
    'cir-19',
    'Dividir o dente para remover raízes divergentes chama-se ___.',
    'odontosecção',
    ['osteotomia', 'apicectomia', 'alveolotomia'],
    'Raízes divergentes travam. Cortar e remover em partes protege osso e vizinho.',
    2
  ),
  truth(
    'cir-20',
    'A sutura simples costuma ser removida em cerca de 7 dias.',
    true,
    'Tempo suficiente para a epitelização das bordas. Fio que fica demais acumula placa.',
    1
  ),
  pairs(
    'cir-21',
    'Relacione a posição do terceiro molar (Winter) à descrição',
    [
      ['Mesioangular', 'Inclinado para o segundo molar'],
      ['Vertical', 'Longo eixo paralelo ao do segundo molar'],
      ['Horizontal', 'Deitado, perpendicular ao segundo molar'],
      ['Distoangular', 'Inclinado para o ramo'],
    ],
    'A angulação prevê a dificuldade. Distoangular inferior costuma ser o mais trabalhoso.',
    3
  ),
  choice(
    'cir-22',
    'Qual biópsia para uma lesão pequena (< 1 cm) e clinicamente benigna?',
    ['Excisional', 'Incisional', 'Punção', 'Nenhuma; só observar'],
    'Lesão pequena e benigna sai inteira: diagnóstico e tratamento no mesmo ato.',
    { difficulty: 2 }
  ),
  truth(
    'cir-23',
    'Em exodontia de decíduo, deve-se evitar curetar o alvéolo profundamente.',
    true,
    'O germe do permanente está logo abaixo. Curetagem vigorosa pode lesá-lo.',
    2
  ),
  choice(
    'cir-24',
    'Qual é o risco em quem fez radioterapia de cabeça e pescoço?',
    ['Osteorradionecrose', 'Fluorose', 'Alveolite apenas', 'Nenhum risco extra'],
    'Osso irradiado tem pouca vascularização e não cicatriza. Exodontia pede avaliação e planejamento com a equipe.',
    { difficulty: 3 }
  ),
];
