import type { ExerciseSeed } from '../types';
import { choice, gap, multi, order, pairs, truth } from './authoring';

export const URG_EXERCISES: ExerciseSeed[] = [
  choice(
    'urg-01',
    'Qual é a emergência mais comum no consultório odontológico?',
    ['Síncope vasovagal', 'Infarto', 'Anafilaxia', 'Convulsão'],
    'Medo, jejum e agulha: o desmaio é a ocorrência número um. Reconhecer os sinais prévios evita a queda.',
    { difficulty: 1 }
  ),
  choice(
    'urg-02',
    'Qual é a conduta?',
    ['Deitar com as pernas elevadas e monitorar', 'Sentar e dar água com açúcar', 'Colocar em pé para circular o sangue', 'Aplicar epinefrina'],
    'Pré-síncope vasovagal: posição supina com pernas elevadas devolve sangue ao cérebro em segundos.',
    { scenario: 'Paciente fica pálido, suado e diz que vai desmaiar logo após a anestesia.', difficulty: 1 }
  ),
  choice(
    'urg-03',
    'Qual é a hipótese e a conduta?',
    ['Hipoglicemia; dar glicose por via oral', 'Anafilaxia; aplicar epinefrina', 'Infarto; dar aspirina', 'Síncope; deitar e aguardar'],
    'Diabético em jejum com suor, tremor e confusão é hipoglicemia até prova em contrário. Consciente: açúcar pela boca.',
    { scenario: 'Diabético em uso de insulina, em jejum, começa a suar e falar confuso.', difficulty: 2 }
  ),
  truth(
    'urg-04',
    'Em hipoglicemia com paciente inconsciente, deve-se colocar açúcar na boca.',
    false,
    'Risco de aspiração. Inconsciente recebe glucagon IM ou glicose IV e chamada para o serviço de emergência.',
    2
  ),
  choice(
    'urg-05',
    'Qual é o medicamento de primeira linha na anafilaxia?',
    ['Epinefrina intramuscular', 'Anti-histamínico oral', 'Corticoide oral', 'Salbutamol inalado'],
    'Só a epinefrina reverte a hipotensão e o edema de via aérea. Anti-histamínico e corticoide são complementares.',
    { difficulty: 1 }
  ),
  gap(
    'urg-06',
    'Dose de epinefrina IM para adulto em anafilaxia: ___ mg da solução 1:1.000.',
    '0,3 a 0,5',
    ['3', '10', '0,01'],
    'Na face lateral da coxa. Repetir a cada 5 a 15 minutos se não melhorar. Chame o 192.',
    3
  ),
  multi(
    'urg-07',
    'Sinais de anafilaxia?',
    ['Urticária e prurido generalizado', 'Edema de lábios e língua', 'Rouquidão e chiado'],
    ['Dor localizada no local da injeção', 'Sono profundo'],
    'Pele + via aérea ou pressão caindo, minutos após a exposição. Não espere a pressão cair para agir.',
    { difficulty: 2 }
  ),
  choice(
    'urg-08',
    'Qual é a conduta?',
    ['Sentar o paciente e usar o broncodilatador de resgate', 'Deitar com pernas elevadas', 'Dar água gelada', 'Aplicar glicose'],
    'Crise de asma: posição sentada, salbutamol inalado e oxigênio se disponível. Sem melhora, emergência.',
    { scenario: 'Asmático começa a chiar e tem dificuldade para respirar durante o atendimento.', difficulty: 2 }
  ),
  choice(
    'urg-09',
    'Dor no peito em aperto que não melhora em minutos. Além de chamar o 192, o que dar?',
    ['Ácido acetilsalicílico para mastigar', 'Paracetamol', 'Anti-histamínico', 'Glicose'],
    'AAS mastigado reduz a mortalidade no infarto. Nitrato só se o paciente já usa e não tomou inibidor de PDE-5.',
    { difficulty: 3 }
  ),
  truth(
    'urg-10',
    'Durante uma convulsão, deve-se colocar algo entre os dentes para proteger a língua.',
    false,
    'Nada na boca, nada de conter. Proteja a cabeça, afaste objetos e cronometre. Mais de 5 minutos: emergência.',
    1
  ),
  order(
    'urg-11',
    'Ordene a conduta em uma convulsão tônico-clônica',
    ['Proteger a cabeça e afastar objetos', 'Cronometrar a crise', 'Após a crise, lateralizar o paciente', 'Verificar respiração e nível de consciência', 'Chamar emergência se durar mais de 5 minutos ou repetir'],
    'A crise em geral para sozinha. Seu trabalho é evitar trauma e aspiração, não interromper a convulsão.',
    { difficulty: 2 }
  ),
  pairs(
    'urg-12',
    'Relacione o sinal ao componente do FAST (suspeita de AVC)',
    [
      ['Face', 'Assimetria ao sorrir'],
      ['Arm (braço)', 'Um braço cai ao elevar os dois'],
      ['Speech (fala)', 'Fala arrastada ou confusa'],
      ['Time (tempo)', 'Anotar o início e chamar o 192'],
    ],
    'AVC é corrida contra o relógio. Reconhecer em segundos e acionar o serviço de emergência.',
    2
  ),
  choice(
    'urg-13',
    'Paciente engasgou e está tossindo com força. O que fazer?',
    ['Encorajar a tosse e observar', 'Fazer Heimlich imediatamente', 'Dar água', 'Deitar o paciente'],
    'Tosse eficaz é a melhor manobra. Heimlich é para obstrução completa: sem tosse, sem voz, sem ar.',
    { difficulty: 1 }
  ),
  choice(
    'urg-14',
    'Obstrução completa da via aérea em adulto consciente. Manobra?',
    ['Compressões abdominais (Heimlich)', 'RCP', 'Ventilação boca a boca', 'Tapotagem nas costas apenas'],
    'Sem ar passando, compressões abdominais rápidas para cima. Se ficar inconsciente, iniciar RCP.',
    { difficulty: 2 }
  ),
  gap(
    'urg-15',
    'Na RCP do adulto, a frequência de compressões é de ___ por minuto.',
    '100 a 120',
    ['60', '200', '30'],
    'Profundidade de 5 a 6 cm, deixando o tórax voltar. Troque de socorrista a cada 2 minutos.',
    2
  ),
  choice(
    'urg-16',
    'Relação compressões/ventilações na RCP de adulto com um socorrista?',
    ['30:2', '15:2', '5:1', '10:10'],
    '30 compressões, 2 ventilações. Se não souber ventilar, compressões contínuas já salvam.',
    { difficulty: 1 }
  ),
  truth(
    'urg-17',
    'O DEA pode ser usado por dentista sem treinamento médico.',
    true,
    'O aparelho fala o que fazer e só choca se houver ritmo chocável. Ligar cedo é o que muda a sobrevida.',
    1
  ),
  choice(
    'urg-18',
    'Qual é a conduta?',
    ['Deitar em decúbito lateral esquerdo', 'Deitar de costas com pernas elevadas', 'Sentar ereta', 'Aplicar epinefrina'],
    'O útero comprime a veia cava em decúbito dorsal. Virar para a esquerda devolve o retorno venoso.',
    { scenario: 'Gestante no 3º trimestre sente tontura e queda de pressão deitada na cadeira.', difficulty: 3 }
  ),
  multi(
    'urg-19',
    'O que deve ter no kit de emergência do consultório?',
    ['Epinefrina', 'Oxigênio', 'Glicose oral', 'Broncodilatador'],
    ['Antibiótico injetável', 'Anestésico extra'],
    'Epinefrina, O2, glicose, broncodilatador, AAS e, idealmente, um DEA. Antibiótico não é emergência.',
    { difficulty: 1 }
  ),
  choice(
    'urg-20',
    'Paciente ansioso hiperventilando, formigamento nas mãos e tontura. Conduta?',
    ['Acalmar e orientar respiração lenta', 'Dar oxigênio a 100%', 'Aplicar glicose', 'Deitar com pernas elevadas'],
    'Hiperventilação baixa o CO2 e dá formigamento. Voz calma e respiração guiada resolvem. Oxigênio piora.',
    { difficulty: 2 }
  ),
  gap(
    'urg-21',
    'O número do SAMU no Brasil é ___.',
    '192',
    ['190', '193', '911'],
    '192 é o SAMU. 193 é bombeiros; 190 é polícia. Tenha o número visível na sala.',
    1
  ),
  choice(
    'urg-22',
    'Qual é a conduta?',
    ['Interromper o atendimento e encaminhar para avaliação médica urgente', 'Anestesiar e prosseguir', 'Dar um copo de água e esperar', 'Aplicar epinefrina'],
    'Pressão muito alta com sintomas é emergência hipertensiva. Nada de procedimento; encaminhar.',
    { scenario: 'PA de 200/120 mmHg com dor de cabeça forte e visão turva antes do procedimento.', difficulty: 2 }
  ),
  truth(
    'urg-23',
    'Sinais vitais devem ser aferidos e registrados antes de procedimentos invasivos.',
    true,
    'Pressão e pulso antes dão a linha de base. Sem eles você não sabe se o que vê depois é mudança.',
    1
  ),
  choice(
    'urg-24',
    'Primeiro passo em qualquer emergência no consultório?',
    ['Interromper o procedimento e avaliar consciência, respiração e circulação', 'Aplicar epinefrina', 'Ligar para o dentista mais experiente', 'Dar água ao paciente'],
    'Parar, posicionar e avaliar (ABC). O medicamento vem depois do diagnóstico, nunca antes.',
    { difficulty: 1 }
  ),
];
