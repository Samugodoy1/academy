import type { ExerciseSeed } from '../types';
import { choice, gap, multi, order, pairs, truth } from './authoring';

export const FARM_EXERCISES: ExerciseSeed[] = [
  choice(
    'farm-01',
    'Dose máxima diária de paracetamol para adulto saudável?',
    ['4 g', '1 g', '8 g', '500 mg'],
    'Acima de 4 g/dia o fígado sofre. Em etilistas e hepatopatas, o limite cai para cerca de 3 g.',
    { difficulty: 1 }
  ),
  truth(
    'farm-02',
    'Produtos combinados para gripe podem conter paracetamol e somar na dose diária.',
    true,
    'Paciente "toma só um antigripal" e mais paracetamol para a dor: dose oculta. Pergunte tudo o que usa.',
    2
  ),
  choice(
    'farm-03',
    'Qual é o principal risco do paracetamol em dose excessiva?',
    ['Hepatotoxicidade', 'Sangramento gástrico', 'Insuficiência renal aguda', 'Depressão respiratória'],
    'O metabólito tóxico esgota a glutationa do fígado. É a principal causa de insuficiência hepática por medicamento.',
    { difficulty: 1 }
  ),
  multi(
    'farm-04',
    'Em quem evitar anti-inflamatórios não esteroides?',
    ['Úlcera ou sangramento gástrico prévio', 'Insuficiência renal', 'Terceiro trimestre de gestação'],
    ['Adulto jovem saudável com dor pós-exodontia', 'Hipertenso bem controlado sem outros riscos'],
    'AINE agride estômago, rim e fecha o ducto arterial no fim da gestação. Paracetamol é a alternativa.',
    { difficulty: 2 }
  ),
  gap(
    'farm-05',
    'Os AINEs agem inibindo a enzima ___.',
    'ciclo-oxigenase',
    ['lipase', 'amilase', 'acetilcolinesterase'],
    'Menos COX, menos prostaglandina: menos dor e edema, mas também menos proteção gástrica e menos fluxo renal.',
    2
  ),
  choice(
    'farm-06',
    'Qual analgésico é mais seguro na gestação?',
    ['Paracetamol', 'Ibuprofeno', 'Ácido acetilsalicílico', 'Nimesulida'],
    'Paracetamol nas doses usuais é a primeira escolha em todos os trimestres. AINE fica de fora, sobretudo no terceiro.',
    { difficulty: 1 }
  ),
  choice(
    'farm-07',
    'Antibiótico de primeira escolha em infecção odontogênica com indicação sistêmica?',
    ['Amoxicilina', 'Tetraciclina', 'Ciprofloxacino', 'Vancomicina'],
    'Cobre a maioria das bactérias orais, é barata e bem tolerada. Em casos graves, associar clavulanato ou metronidazol.',
    { difficulty: 1 }
  ),
  choice(
    'farm-08',
    'Alergia grave à penicilina e precisa de profilaxia para endocardite. Qual opção?',
    ['Azitromicina 500 mg', 'Amoxicilina 2 g', 'Ampicilina 2 g IV', 'Cefalexina 2 g'],
    'Com anafilaxia prévia a penicilina, cefalosporina também fica de fora. Azitromicina ou doxiciclina são as opções.',
    { difficulty: 3 }
  ),
  gap(
    'farm-09',
    'A profilaxia padrão para endocardite é amoxicilina 2 g, ___ minutos antes do procedimento.',
    '30 a 60',
    ['5', '180', '1440'],
    'Uma dose única, com tempo para atingir pico sérico quando a bacteremia acontece.',
    2
  ),
  truth(
    'farm-10',
    'Metronidazol com álcool pode causar reação tipo dissulfiram.',
    true,
    'Náusea, vômito, rubor e taquicardia. Avise o paciente: nada de álcool durante e 48 h após.',
    2
  ),
  choice(
    'farm-11',
    'Qual antibiótico age especificamente contra anaeróbios?',
    ['Metronidazol', 'Amoxicilina', 'Azitromicina', 'Cefalexina'],
    'Metronidazol só pega anaeróbios. Por isso costuma ser associado à amoxicilina em infecções graves, não usado sozinho.',
    { difficulty: 2 }
  ),
  choice(
    'farm-12',
    'Qual antibiótico tem maior risco de colite por Clostridioides difficile?',
    ['Clindamicina', 'Amoxicilina', 'Azitromicina', 'Metronidazol'],
    'Diarreia intensa durante ou após clindamicina é sinal de alerta. Por isso ela deixou de ser a primeira alternativa.',
    { difficulty: 3 }
  ),
  truth(
    'farm-13',
    'Tetraciclinas são contraindicadas na gestação e em crianças pequenas.',
    true,
    'Depositam-se no dente em formação e mancham o esmalte para sempre.',
    1
  ),
  pairs(
    'farm-14',
    'Relacione o fármaco à precaução principal',
    [
      ['Paracetamol', 'Fígado e dose total diária'],
      ['AINE', 'Estômago, rim e sangramento'],
      ['Opioide', 'Sedação e constipação'],
      ['Benzodiazepínico', 'Não dirigir; potencializado por álcool'],
    ],
    'Cada classe tem seu ponto fraco. Prescrever é conhecer o efeito colateral, não só o efeito.',
    2
  ),
  choice(
    'farm-15',
    'Interação perigosa com epinefrina do anestésico?',
    ['Betabloqueador não seletivo (propranolol)', 'Losartana', 'Metformina', 'Omeprazol'],
    'Sem o beta-2 para vasodilatar, a epinefrina só vasoconstringe: pressão sobe e o coração desacelera. Limite a dose.',
    { difficulty: 3 }
  ),
  choice(
    'farm-16',
    'Paciente em varfarina precisa de analgesia. Melhor escolha?',
    ['Paracetamol', 'Ibuprofeno', 'Ácido acetilsalicílico', 'Diclofenaco'],
    'AINE aumenta sangramento e potencializa a varfarina. Paracetamol em dose usual é a opção segura.',
    { difficulty: 2 }
  ),
  truth(
    'farm-17',
    'Antibiótico substitui a drenagem em abscesso dentário.',
    false,
    'Pus preso não sai com remédio. Drenar e remover a causa; antibiótico só se houver sinais sistêmicos.'
  ),
  multi(
    'farm-18',
    'O que uma prescrição precisa conter?',
    ['Nome do fármaco e concentração', 'Dose, via e intervalo', 'Duração do tratamento'],
    ['Diagnóstico completo do paciente', 'Preço do medicamento'],
    'Receita incompleta gera erro na farmácia e em casa. Escreva como se o paciente fosse ler sozinho.',
    { difficulty: 1 }
  ),
  choice(
    'farm-19',
    'Qual corticoide em dose única pré-operatória reduz edema após cirurgia de terceiro molar?',
    ['Dexametasona 4 a 8 mg', 'Prednisona por 10 dias', 'Hidrocortisona tópica', 'Nenhum corticoide é usado'],
    'Dose única antes do trauma reduz edema e trismo sem os riscos do uso prolongado.',
    { difficulty: 2 }
  ),
  choice(
    'farm-20',
    'Qual é o tratamento da candidíase oral?',
    ['Nistatina ou fluconazol', 'Amoxicilina', 'Aciclovir', 'Clorexidina apenas'],
    'Candida é fungo: antifúngico. Corrigir a causa (prótese suja, boca seca, inalador) evita recidiva.',
    { difficulty: 1 }
  ),
  gap(
    'farm-21',
    'O bochecho de clorexidina a 0,12% pode causar ___ nos dentes com uso prolongado.',
    'manchamento',
    ['fluorose', 'fratura', 'erosão'],
    'Mancha marrom e alteração do gosto. Prescreva por tempo limitado, em geral até 2 semanas.',
    1
  ),
  order(
    'farm-22',
    'Ordene o raciocínio de uma prescrição segura',
    ['Confirmar que há indicação', 'Revisar alergias, doenças e medicamentos em uso', 'Escolher fármaco, dose e duração', 'Orientar uso e sinais de alerta', 'Registrar no prontuário'],
    'Indicação primeiro. Metade das receitas desnecessárias começa pulando esse passo.',
    { difficulty: 1 }
  ),
  choice(
    'farm-23',
    'Por quanto tempo manter antibiótico em infecção odontogênica com controle da causa?',
    ['Até melhora clínica, em geral 3 a 7 dias, reavaliando', 'Sempre 14 dias', '1 dose única', 'Até acabar a caixa, mesmo sem melhora'],
    'Duração curta com reavaliação. Se não melhora em 48 a 72 h, revise diagnóstico e drenagem, não só o antibiótico.',
    { difficulty: 3 }
  ),
  truth(
    'farm-24',
    'Náusea após um antibiótico significa alergia.',
    false,
    'Náusea é efeito adverso, não reação imunológica. Rotular como alergia tira do paciente a melhor opção futura.',
    1
  ),
];
