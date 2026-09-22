import type { ExerciseSeed } from '../types';
import { choice, gap, multi, order, pairs, truth } from './authoring';

export const BIO_EXERCISES: ExerciseSeed[] = [
  pairs(
    'bio-01',
    'Relacione a classificação de Spaulding ao processamento',
    [
      ['Crítico (penetra tecido)', 'Esterilização'],
      ['Semicrítico (toca mucosa)', 'Esterilização ou desinfecção de alto nível'],
      ['Não crítico (pele íntegra)', 'Desinfecção de nível intermediário ou baixo'],
    ],
    'O destino do instrumental depende de onde ele toca. Cureta e broca são críticos: autoclave.',
    2
  ),
  choice(
    'bio-02',
    'Qual é a temperatura e o tempo padrão da autoclave gravitacional?',
    ['121 °C por 15 a 20 minutos', '60 °C por 1 hora', '100 °C por 5 minutos', '200 °C por 2 minutos'],
    'Vapor sob pressão a 121 °C ou 134 °C. Tempo conta a partir da temperatura atingida, não da porta fechada.',
    { difficulty: 2 }
  ),
  choice(
    'bio-03',
    'Qual controle comprova que a autoclave esterilizou?',
    ['Indicador biológico', 'Fita indicadora que mudou de cor', 'Papel do pacote seco', 'Tempo cronometrado'],
    'A fita só mostra que passou por calor. Só o indicador biológico (esporos) prova morte microbiana. Fazer pelo menos semanalmente.',
    { difficulty: 2 }
  ),
  truth(
    'bio-04',
    'A estufa (calor seco) é o método recomendado para instrumentais odontológicos.',
    false,
    'A ANVISA não recomenda estufa: ciclo longo, difícil de monitorar e sem garantia de esterilização. Autoclave é o padrão.',
    2
  ),
  order(
    'bio-05',
    'Ordene o processamento do instrumental',
    ['Limpeza (manual ou ultrassônica)', 'Enxágue e secagem', 'Inspeção e embalagem', 'Esterilização em autoclave', 'Armazenamento protegido'],
    'Sujeira protege micro-organismos do vapor. Sem limpeza correta, não existe esterilização.',
    { difficulty: 1 }
  ),
  gap(
    'bio-06',
    'Agulhas e lâminas devem ser descartadas em recipiente ___ e resistente a perfuração.',
    'rígido',
    ['plástico comum', 'de papel', 'aberto'],
    'Caixa rígida, fechada ao atingir 2/3. Nunca no lixo comum ou no saco branco.',
    1
  ),
  truth(
    'bio-07',
    'Reencapar a agulha com as duas mãos é seguro se feito devagar.',
    false,
    'A maioria dos acidentes acontece ao reencapar. Use técnica de uma mão ou dispositivo de reencape.',
    1
  ),
  order(
    'bio-08',
    'Ordene a conduta após acidente com perfurocortante',
    ['Lavar o local com água e sabão', 'Avaliar o paciente-fonte e o profissional', 'Notificar o acidente', 'Iniciar profilaxia para HIV, se indicada, o mais rápido possível', 'Acompanhar com sorologias'],
    'Profilaxia para HIV funciona melhor nas primeiras 2 horas e até 72 horas. Não deixe para amanhã.',
    { difficulty: 3 }
  ),
  choice(
    'bio-09',
    'Em quanto tempo iniciar a profilaxia pós-exposição para HIV?',
    ['O mais cedo possível, no máximo em 72 horas', 'Em até 1 semana', 'Em até 30 dias', 'Não existe profilaxia'],
    'Cada hora conta. Ideal em 2 horas; após 72 horas, a eficácia cai muito.',
    { difficulty: 2 }
  ),
  choice(
    'bio-10',
    'Qual vacina é obrigatória para quem atende em odontologia?',
    ['Hepatite B', 'Febre amarela', 'HPV', 'Raiva'],
    'Hepatite B se transmite fácil por sangue. Após as três doses, confira o anti-HBs para saber se respondeu.',
    { difficulty: 1 }
  ),
  multi(
    'bio-11',
    'O que reduz a contaminação por aerossol?',
    ['Sucção de alta potência', 'Isolamento absoluto', 'Bochecho antisséptico antes do procedimento'],
    ['Abrir a janela e desligar o sugador', 'Usar só o sugador de saliva'],
    'Alta rotação e ultrassom espalham gotículas. Sugar na fonte e isolar reduzem a nuvem.',
    { difficulty: 2 }
  ),
  choice(
    'bio-12',
    'Higiene das mãos com álcool 70%: quando não basta?',
    ['Mãos visivelmente sujas', 'Entre dois pacientes sem sujidade', 'Antes de calçar luvas', 'Após tocar a cadeira'],
    'Álcool não remove sujeira nem matéria orgânica. Mão suja: água e sabão.',
    { difficulty: 1 }
  ),
  truth(
    'bio-13',
    'Luvas dispensam a higiene das mãos.',
    false,
    'Luva tem microfuros e as mãos contaminam ao retirá-la. Higienizar antes de calçar e depois de tirar.',
    1
  ),
  choice(
    'bio-14',
    'Como processar a caneta de alta rotação entre pacientes?',
    ['Limpar, lubrificar e esterilizar em autoclave', 'Só passar álcool 70%', 'Lavar com água corrente', 'Trocar apenas a broca'],
    'A peça de mão aspira fluido do paciente para dentro. É item crítico: autoclave a cada uso.',
    { difficulty: 2 }
  ),
  gap(
    'bio-15',
    'Antes de enviar ao laboratório, o molde deve ser ___.',
    'desinfetado',
    ['esterilizado em autoclave', 'lavado com álcool puro', 'seco ao sol'],
    'Enxaguar e borrifar desinfetante compatível (hipoclorito a 1% para alginato). Protege o técnico e o gesso.',
    2
  ),
  pairs(
    'bio-16',
    'Relacione o resíduo ao grupo',
    [
      ['Gaze com sangue', 'Grupo A (infectante)'],
      ['Revelador radiográfico', 'Grupo B (químico)'],
      ['Papel de escritório', 'Grupo D (comum)'],
      ['Agulha', 'Grupo E (perfurocortante)'],
    ],
    'Cada grupo tem cor de saco e destino. Misturar aumenta custo e risco.',
    2
  ),
  choice(
    'bio-17',
    'Por quanto tempo acionar as linhas de água entre pacientes?',
    ['20 a 30 segundos', '2 segundos', '10 minutos', 'Não é necessário'],
    'Refluxo contamina a mangueira. O flush arrasta a água parada e reduz o biofilme da linha.',
    { difficulty: 2 }
  ),
  multi(
    'bio-18',
    'Quais EPIs são obrigatórios em todo atendimento?',
    ['Luvas', 'Máscara', 'Óculos de proteção', 'Avental'],
    ['Luvas estéreis em toda profilaxia', 'Máscara N95 em todo paciente'],
    'Barreira contra respingo e aerossol para você e para o paciente. Gorro complementa.',
    { difficulty: 1 }
  ),
  truth(
    'bio-19',
    'Pacotes esterilizados têm validade indefinida se não abrirem.',
    false,
    'Validade depende da embalagem, do armazenamento e da integridade. Pacote úmido, rasgado ou caído: reprocessar.',
    2
  ),
  choice(
    'bio-20',
    'Qual desinfetante para superfícies entre pacientes?',
    ['Álcool 70% ou quaternário de amônio', 'Água pura', 'Hipoclorito a 10%', 'Detergente de louça'],
    'Fricção com álcool 70% em três aplicações ou desinfetante registrado. Barreiras plásticas reduzem o trabalho.',
    { difficulty: 1 }
  ),
  choice(
    'bio-21',
    'Para que serve a cuba ultrassônica?',
    ['Limpar o instrumental antes da esterilização', 'Esterilizar sem calor', 'Secar os pacotes', 'Desinfetar moldes'],
    'Cavitação remove sujeira de lugares que a escova não alcança. Limpeza, não esterilização.',
    { difficulty: 1 }
  ),
  truth(
    'bio-22',
    'A mesma luva pode ser usada em dois pacientes se for lavada com álcool.',
    false,
    'Luva é de uso único por paciente. Álcool degrada o látex e não garante descontaminação.',
    1
  ),
  gap(
    'bio-23',
    'O indicador químico dentro de cada pacote mostra que o pacote foi ___ ao processo.',
    'exposto',
    ['imune', 'resistente', 'alheio'],
    'Indicador químico monitora cada pacote; o biológico valida o equipamento. Um não substitui o outro.',
    2
  ),
  choice(
    'bio-24',
    'Paciente informa ser portador de hepatite C. O que muda no atendimento?',
    ['Nada: as precauções-padrão já protegem', 'Usar luva dupla e marcar no final do dia', 'Recusar o atendimento', 'Esterilizar duas vezes o instrumental'],
    'Precauções-padrão valem para todos, porque muitos não sabem que são portadores. Não há atendimento de "segunda classe".',
    { difficulty: 2 }
  ),
];
