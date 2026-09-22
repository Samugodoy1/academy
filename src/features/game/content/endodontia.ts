import type { ExerciseSeed } from '../types';
import { choice, gap, multi, order, pairs, truth } from './authoring';

export const ENDODONTIA_EXERCISES: ExerciseSeed[] = [
  choice(
    'endo-01',
    'Qual é o diagnóstico pulpar?',
    ['Pulpite irreversível sintomática', 'Pulpite reversível', 'Necrose pulpar', 'Polpa normal'],
    'Dor que persiste depois do frio e aparece sozinha mostra que a polpa não vai se recuperar.',
    { scenario: 'Dor espontânea no 46, que dura minutos após o frio.', difficulty: 1 }
  ),
  choice(
    'endo-02',
    'Qual é o diagnóstico periapical?',
    ['Abscesso apical crônico', 'Abscesso apical agudo', 'Periodontite apical sintomática', 'Tecidos normais'],
    'Fístula é a marca do abscesso crônico: a infecção drena sozinha e por isso quase não dói.',
    { scenario: 'Dente 22 sem resposta ao frio, sem dor, com fístula na gengiva vestibular.', difficulty: 2 }
  ),
  choice(
    'endo-03',
    'Como identificar o dente de origem de uma fístula?',
    ['Inserir cone de guta-percha na fístula e radiografar', 'Testar o frio em todos os dentes', 'Sondar a fístula com a sonda periodontal', 'Fazer panorâmica'],
    'O cone segue o trajeto da fístula e aponta o ápice de origem, que nem sempre é o dente mais próximo.',
    { difficulty: 2 }
  ),
  truth(
    'endo-04',
    'Um dente com necrose pulpar não responde ao teste de frio.',
    true,
    'Sem polpa viva, sem resposta. Cuidado: dentes multirradiculares podem ter necrose parcial e responder ainda.'
  ),
  pairs(
    'endo-05',
    'Relacione o irrigante à sua principal função',
    [
      ['Hipoclorito de sódio', 'Dissolve tecido orgânico e desinfeta'],
      ['EDTA 17%', 'Remove a parte inorgânica da smear layer'],
      ['Clorexidina 2%', 'Antimicrobiano sem dissolver tecido'],
      ['Soro fisiológico', 'Lavagem neutra entre soluções'],
    ],
    'Cada solução tem um papel. Hipoclorito é o irrigante principal; EDTA entra no final para abrir os túbulos.',
    2
  ),
  gap(
    'endo-06',
    'O irrigante que dissolve tecido pulpar remanescente é o ___ de sódio.',
    'hipoclorito',
    ['bicarbonato', 'cloreto', 'fluoreto'],
    'Só o hipoclorito dissolve matéria orgânica. Sem ele, restos de polpa ficam nos canais acessórios.',
    1
  ),
  choice(
    'endo-07',
    'O que determina o comprimento de trabalho com mais precisão?',
    ['Localizador apical eletrônico confirmado por radiografia', 'Só a radiografia inicial', 'Tabela de comprimento médio dos dentes', 'Sensibilidade tátil'],
    'O localizador encontra a constrição apical; a radiografia confirma. Juntos, erram muito menos.',
    { difficulty: 2 }
  ),
  gap(
    'endo-08',
    'O limite apical do preparo fica cerca de ___ mm aquém do ápice radiográfico.',
    '1',
    ['5', '3', '0'],
    'O forame raramente coincide com o ápice radiográfico. Parar 0,5 a 1 mm antes respeita a constrição.',
    2
  ),
  truth(
    'endo-09',
    'A medicação intracanal com hidróxido de cálcio age pelo pH alcalino elevado.',
    true,
    'pH em torno de 12 mata bactérias e neutraliza toxinas. É a medicação padrão entre sessões.',
    2
  ),
  choice(
    'endo-10',
    'Qual é a conduta?',
    ['Capeamento pulpar direto com MTA ou hidróxido de cálcio', 'Tratamento endodôntico imediato', 'Extração', 'Restaurar direto sem proteção'],
    'Polpa sã, exposição pequena e sem sangramento excessivo: proteger a polpa e selar bem tem boa taxa de sucesso.',
    { scenario: 'Exposição pulpar pontual em dente assintomático, vital, durante a remoção de cárie.', difficulty: 3 }
  ),
  choice(
    'endo-11',
    'Qual é a conduta?',
    ['Reimplantar imediatamente no alvéolo', 'Guardar o dente e reimplantar em 1 semana', 'Descartar o dente', 'Lavar com álcool e reimplantar'],
    'Cada minuto fora do alvéolo mata células do ligamento. Reimplantar na hora é a melhor chance; leite ou saliva se não der.',
    { scenario: 'Dente 11 permanente avulsionado há 10 minutos, em criança de 9 anos.', difficulty: 2 }
  ),
  truth(
    'endo-12',
    'Dente decíduo avulsionado deve ser reimplantado.',
    false,
    'Reimplantar decíduo pode lesar o germe do permanente. Orientar e acompanhar o espaço.',
    2
  ),
  multi(
    'endo-13',
    'Qual meio serve para transportar um dente avulsionado?',
    ['Leite', 'Saliva do paciente', 'Soro fisiológico'],
    ['Álcool', 'Papel toalha seco'],
    'Meio úmido e isotônico mantém as células do ligamento vivas. Seco por mais de 60 min, o prognóstico despenca.',
    { difficulty: 1 }
  ),
  choice(
    'endo-14',
    'Permanente jovem com ápice aberto e polpa vital exposta. Objetivo do tratamento?',
    ['Manter a polpa viva para completar a raiz (apexogênese)', 'Obturar o canal imediatamente', 'Extrair e colocar implante', 'Aguardar a necrose'],
    'Raiz incompleta precisa da polpa para crescer. Pulpotomia com MTA preserva a vitalidade radicular.',
    { difficulty: 3 }
  ),
  order(
    'endo-15',
    'Ordene as etapas do tratamento endodôntico',
    ['Diagnóstico e radiografia', 'Anestesia e isolamento absoluto', 'Acesso e localização dos canais', 'Odontometria', 'Preparo químico-mecânico', 'Obturação e selamento coronário'],
    'Sequência lógica: sem isolamento não há acesso seguro; sem odontometria não há preparo no comprimento certo.',
    { difficulty: 1 }
  ),
  choice(
    'endo-16',
    'Qual é o principal material de obturação?',
    ['Guta-percha com cimento endodôntico', 'Resina composta', 'Amálgama', 'Ionômero de vidro'],
    'Guta-percha preenche, o cimento sela os espaços. A combinação é padrão há décadas.',
    { difficulty: 1 }
  ),
  truth(
    'endo-17',
    'Uma boa restauração coronária é tão importante quanto a obturação para o sucesso do tratamento.',
    true,
    'Canal bem obturado com coroa vazando volta a infectar. Selamento coronário protege o trabalho todo.'
  ),
  choice(
    'endo-18',
    'Antibiótico está indicado?',
    ['Não; a dor é inflamatória e o tratamento é local', 'Sim, amoxicilina por 7 dias', 'Sim, apenas se houver cárie', 'Sim, antes de qualquer anestesia'],
    'Pulpite não é infecção sistêmica. Remover a polpa inflamada e prescrever analgésico resolve; antibiótico não age aqui.',
    { scenario: 'Pulpite irreversível sintomática, sem edema, sem febre.', difficulty: 2 }
  ),
  multi(
    'endo-19',
    'Quando o antibiótico sistêmico entra em infecção endodôntica?',
    ['Edema difuso com celulite', 'Febre e mal-estar', 'Trismo ou dificuldade de engolir'],
    ['Dor intensa localizada sem edema', 'Fístula crônica assintomática'],
    'Sinais de disseminação sistêmica pedem antibiótico junto com drenagem. Dor isolada não.',
    { difficulty: 3 }
  ),
  choice(
    'endo-20',
    'Dor forte súbita e edema durante a irrigação. O que aconteceu?',
    ['Extravasamento de hipoclorito além do ápice', 'Alergia à guta-percha', 'Fratura de raiz', 'Reação ao anestésico'],
    'Acidente com hipoclorito: irrigar com soro, analgesia, compressa fria e acompanhar de perto.',
    { difficulty: 3 }
  ),
  gap(
    'endo-21',
    'Manter uma lima fina passando pelo forame durante o preparo chama-se ___ apical.',
    'patência',
    ['fratura', 'condensação', 'obturação'],
    'Patência evita acúmulo de raspas no terço apical e mantém o comprimento de trabalho durante o preparo.',
    3
  ),
  truth(
    'endo-22',
    'Dor leve nas primeiras 24 a 48 horas após o tratamento é esperada.',
    true,
    'A instrumentação irrita o periápice. Avise o paciente antes: dor esperada não vira ligação de emergência.',
    1
  ),
  choice(
    'endo-23',
    'Para que serve o preparo prévio do trajeto com limas manuais finas (glide path)?',
    ['Reduzir o risco de fratura dos instrumentos rotatórios', 'Obturar o canal', 'Anestesiar a polpa', 'Remover a coroa'],
    'Instrumento rotatório em canal sem caminho pré-definido trava e quebra. Glide path é seguro.',
    { difficulty: 3 }
  ),
  choice(
    'endo-24',
    'Qual é o diagnóstico periapical?',
    ['Abscesso apical agudo', 'Abscesso apical crônico', 'Periodontite apical assintomática', 'Osteíte condensante'],
    'Dor intensa, edema e sensibilidade à percussão sem fístula: pus preso, precisa drenar.',
    { scenario: 'Dor intensa, edema vestibular, dente 36 dolorido ao toque, sem fístula.', difficulty: 2 }
  ),
];
