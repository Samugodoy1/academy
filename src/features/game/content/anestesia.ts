import type { ExerciseSeed } from '../types';
import { choice, gap, multi, order, pairs, truth } from './authoring';

export const ANESTESIA_EXERCISES: ExerciseSeed[] = [
  choice(
    'anest-01',
    'Quantos mg de lidocaína tem 1 mL da solução a 2%?',
    ['20 mg', '2 mg', '200 mg', '0,2 mg'],
    'Porcentagem em anestésico é g por 100 mL. 2% = 2 g/100 mL = 20 mg/mL.',
    { difficulty: 1 }
  ),
  choice(
    'anest-02',
    'Quantos mg de lidocaína há em um tubete de 1,8 mL a 2%?',
    ['36 mg', '18 mg', '72 mg', '3,6 mg'],
    '20 mg/mL × 1,8 mL = 36 mg. Esse número é a base de todo cálculo de dose máxima.',
    { difficulty: 1 }
  ),
  gap(
    'anest-03',
    'A dose máxima de anestésico local é calculada pelo ___ do paciente.',
    'peso',
    ['humor', 'número de dentes', 'tamanho da boca'],
    'mg/kg × peso = teto em mg. Divida pelos mg do tubete para saber quantos tubetes pode usar.',
    1
  ),
  choice(
    'anest-04',
    'Quantos tubetes inteiros de lidocaína 2% pode usar, no máximo?',
    ['2 tubetes', '4 tubetes', '6 tubetes', '1 tubete'],
    'Com 4,4 mg/kg: 20 kg × 4,4 = 88 mg. Cada tubete tem 36 mg, então 88 ÷ 36 = 2,4 → 2 tubetes inteiros.',
    { scenario: 'Criança de 20 kg. Limite adotado: 4,4 mg/kg.', difficulty: 3 }
  ),
  truth(
    'anest-05',
    'Aspirar antes de injetar reduz o risco de injeção intravascular.',
    true,
    'Sangue no tubete = agulha dentro de um vaso. Reposicione e aspire de novo antes de depositar.'
  ),
  choice(
    'anest-06',
    'Qual é a velocidade ideal de injeção?',
    ['Cerca de 1 mL por minuto', 'O mais rápido possível', '1 mL a cada 5 segundos', 'Não faz diferença'],
    'Injeção lenta dói menos, reduz o pico plasmático e dá tempo de perceber uma reação.',
    { difficulty: 1 }
  ),
  choice(
    'anest-07',
    'Por que a anestesia falha mais em tecido inflamado?',
    ['O pH baixo reduz a fração de base livre que entra no nervo', 'O anestésico é destruído pelo pus', 'A agulha não penetra o tecido', 'O vasoconstritor deixa de funcionar'],
    'Anestésicos são bases fracas. Em meio ácido, sobra pouca molécula não ionizada para atravessar a membrana.',
    { difficulty: 3 }
  ),
  multi(
    'anest-08',
    'Anestesia falhou em pulpite. Quais técnicas complementares ajudam?',
    ['Intraligamentar', 'Intraóssea', 'Intrapulpar'],
    ['Repetir a mesma infiltração 5 vezes', 'Aplicar anestésico tópico na coroa'],
    'Técnicas complementares levam o anestésico para perto da polpa, contornando o pH inflamado.',
    { difficulty: 3 }
  ),
  gap(
    'anest-09',
    'O bloqueio do nervo alveolar inferior anestesia os dentes inferiores do lado, o lábio e o ___.',
    'mento',
    ['palato', 'nariz', 'lóbulo da orelha'],
    'O nervo mentoniano é ramo terminal do alveolar inferior: lábio e queixo dormentes confirmam o bloqueio.',
    2
  ),
  truth(
    'anest-10',
    'Na maxila, a infiltrativa funciona bem porque o osso é mais poroso.',
    true,
    'A cortical vestibular fina da maxila deixa o anestésico difundir até o ápice. Na mandíbula adulta, isso raramente basta.'
  ),
  choice(
    'anest-11',
    'Qual agulha para o bloqueio do alveolar inferior?',
    ['Longa (cerca de 32 mm)', 'Curta (cerca de 20 mm)', 'Extracurta', 'Qualquer uma serve'],
    'O alvo fica profundo e a agulha nunca deve entrar até o canhão. Longa dá margem de segurança.',
    { difficulty: 2 }
  ),
  pairs(
    'anest-12',
    'Relacione o bloqueio à região anestesiada',
    [
      ['Alveolar inferior', 'Dentes inferiores de um lado'],
      ['Nasopalatino', 'Palato anterior'],
      ['Palatino maior', 'Palato posterior'],
      ['Mentoniano', 'Lábio inferior e mento'],
    ],
    'Cada nervo tem seu território. Saber o mapa evita anestesiar o lugar errado.',
    2
  ),
  choice(
    'anest-13',
    'Qual anestésico é contraindicado em crianças menores de 4 anos?',
    ['Articaína 4%', 'Lidocaína 2%', 'Mepivacaína 3%', 'Prilocaína 3%'],
    'A articaína não tem segurança estabelecida abaixo de 4 anos e por isso não é recomendada nessa faixa.',
    { difficulty: 3 }
  ),
  choice(
    'anest-14',
    'Qual vantagem o vasoconstritor traz?',
    ['Aumenta a duração e reduz a absorção sistêmica', 'Torna a solução menos ácida', 'Elimina a dor da injeção', 'Dispensa a aspiração'],
    'Vasos contraídos mantêm o anestésico no local por mais tempo, sangram menos e liberam menos droga para o sangue.',
    { difficulty: 1 }
  ),
  gap(
    'anest-15',
    'Em cardiopata controlado, o limite usual de epinefrina é 0,04 mg, cerca de ___ tubetes a 1:100.000.',
    'dois',
    ['oito', 'dez', 'um'],
    'Cada tubete de 1,8 mL a 1:100.000 tem 0,018 mg de epinefrina. Dois tubetes ficam logo abaixo do limite.',
    3
  ),
  truth(
    'anest-16',
    'Mepivacaína 3% sem vasoconstritor é uma opção quando o vasoconstritor deve ser evitado.',
    true,
    'Sem vasoconstritor, a duração pulpar é curta (20 a 40 min), mas serve para procedimentos rápidos.',
    2
  ),
  choice(
    'anest-17',
    'Qual sinal costuma aparecer primeiro na toxicidade por anestésico local?',
    ['Excitação do sistema nervoso: agitação, tremores, fala arrastada', 'Parada cardíaca imediata', 'Urticária nas mãos', 'Dor no local da injeção'],
    'Doses altas afetam primeiro o SNC (excitação e depois depressão), depois o coração. Reconhecer cedo é o que salva.',
    { difficulty: 3 }
  ),
  choice(
    'anest-18',
    'O que orientar aos responsáveis?',
    ['Vigiar para a criança não morder o lábio dormente', 'Dar alimento quente para passar o efeito', 'Fazer bochecho com gelo', 'Nada, o efeito passa sozinho'],
    'Lábio dormente + criança curiosa = mordedura sem dor. Aviso simples evita lesão feia.',
    { scenario: 'Criança de 6 anos recebeu bloqueio do alveolar inferior para restaurar o 85.', difficulty: 1 }
  ),
  order(
    'anest-19',
    'Ordene a técnica de injeção segura',
    ['Aplicar anestésico tópico', 'Posicionar e inserir a agulha', 'Aspirar', 'Injetar lentamente', 'Retirar a agulha e observar o paciente'],
    'Tópico para a picada, aspiração para o vaso, lentidão para a dor e a segurança. Observar sempre.',
    { difficulty: 1 }
  ),
  truth(
    'anest-20',
    'Ao aspirar e ver sangue no tubete, basta injetar devagar mesmo assim.',
    false,
    'Sangue indica agulha dentro do vaso. Reposicione, aspire de novo e só então injete.',
    1
  ),
  choice(
    'anest-21',
    'Qual nervo é mais frequentemente lesado com parestesia após bloqueio inferior?',
    ['Lingual', 'Facial', 'Bucal', 'Infraorbital'],
    'O nervo lingual passa bem no trajeto da agulha do bloqueio; parestesia da língua é a queixa mais comum.',
    { difficulty: 3 }
  ),
  multi(
    'anest-22',
    'Quais são referências anatômicas do bloqueio do alveolar inferior?',
    ['Prega pterigomandibular', 'Incisura coronoide', 'Plano oclusal dos molares inferiores'],
    ['Forame incisivo', 'Tuberosidade da maxila'],
    'Dedo na incisura coronoide, agulha lateral à prega pterigomandibular, cerca de 1 cm acima do plano oclusal.',
    { difficulty: 2 }
  ),
  choice(
    'anest-23',
    'Trismo dias após o bloqueio inferior. Causa mais provável?',
    ['Trauma ou hematoma no músculo pterigóideo medial', 'Alergia ao anestésico', 'Fratura da mandíbula', 'Necrose pulpar do 47'],
    'A agulha pode ferir o pterigóideo medial. Calor úmido, analgésico e exercícios leves resolvem a maioria.',
    { difficulty: 2 }
  ),
  gap(
    'anest-24',
    'A prilocaína em dose alta pode causar ___.',
    'metemoglobinemia',
    ['hipoglicemia', 'trismo', 'gengivite'],
    'Metabólitos da prilocaína oxidam a hemoglobina. Cuidado em anemia, doença respiratória e gestação.',
    3
  ),
];
