import type { ExerciseSeed } from '../types';

export const PERIODONTIA_EXERCISES: ExerciseSeed[] = [
  {
    id: 'perio-01',
    kind: 'choice',
    difficulty: 1,
    prompt: 'Qual é o diagnóstico?',
    scenario:
      'Em periodonto intacto, há profundidade de sondagem de até 3 mm, sem perda de inserção, e sangramento em 18% dos sítios.',
    options: ['Gengivite', 'Periodontite estágio III', 'Abscesso periodontal', 'Recessão gengival'],
    answer: 0,
    explanation:
      'Em periodonto intacto, sangramento à sondagem em pelo menos 10% dos sítios e profundidade de até 3 mm é compatível com gengivite. Sua extensão é classificada pela porcentagem de sítios afetados.',
  },
  {
    id: 'perio-02',
    kind: 'boolean',
    difficulty: 2,
    prompt: 'Verdadeiro ou falso?',
    statement: 'Qualquer sítio com perda de inserção confirma o diagnóstico de periodontite.',
    answer: false,
    explanation:
      'A perda de inserção pode resultar de recessão traumática, cárie cervical, lesão endodôntica ou fratura. O diagnóstico de periodontite exige distribuição compatível em múltiplos dentes e exclusão dessas causas.',
  },
  {
    id: 'perio-03',
    kind: 'blank',
    difficulty: 1,
    prompt: 'Complete a frase',
    sentence: 'Em periodonto intacto, saúde gengival requer sangramento à sondagem abaixo de ___% dos sítios.',
    answer: '10',
    bank: ['10', '20', '30', '50'],
    explanation:
      'A definição combina sangramento em menos de 10% dos sítios com profundidade de sondagem de até 3 mm. Profundidade isolada não estabelece doença.',
  },
  {
    id: 'perio-04',
    kind: 'choice',
    difficulty: 2,
    prompt: 'Profilaxia com taça resolve?',
    scenario: 'Paciente com cálculo subgengival detectado na sondagem em molares inferiores.',
    options: [
      'Sim, o polimento remove o cálculo',
      'Não: é necessária instrumentação subgengival dos sítios afetados',
      'Sim, desde que use pasta abrasiva',
      'Não, o caso é cirúrgico de imediato',
    ],
    answer: 1,
    explanation:
      'O polimento supragengival não remove depósitos subgengivais. A instrumentação deve ser dirigida aos sítios diagnosticados e acompanhada de controle de biofilme.',
  },
  {
    id: 'perio-05',
    kind: 'multi',
    difficulty: 2,
    prompt: 'Selecione o que deve ser registrado no periodontograma',
    options: [
      'Profundidade de sondagem por sítio',
      'Sangramento à sondagem',
      'Recessão gengival',
      'Cor da gravata do paciente',
      'Mobilidade e envolvimento de furca',
    ],
    answers: [0, 1, 2, 4],
    explanation:
      'Esses dados permitem comparar medidas na reavaliação e documentar objetivamente a resposta ao tratamento.',
  },
  {
    id: 'perio-06',
    kind: 'order',
    difficulty: 2,
    prompt: 'Ordene o tratamento periodontal básico',
    steps: [
      'Diagnóstico e periodontograma completo',
      'Orientação de higiene e controle de biofilme',
      'Instrumentação subgengival conforme os sítios e o plano',
      'Reavaliação após a cicatrização',
      'Manutenção periódica',
    ],
    explanation:
      'O tratamento é realizado por etapas e individualizado. A instrumentação pode ocorrer em uma ou mais sessões, sem obrigação de divisão por quadrantes.',
  },
  {
    id: 'perio-07',
    kind: 'match',
    difficulty: 3,
    prompt: 'Relacione o achado com o significado',
    pairs: [
      { left: 'Sangramento à sondagem', right: 'Sinal clínico de inflamação' },
      { left: 'Perda de inserção em padrão compatível', right: 'Critério para periodontite' },
      { left: 'Furca grau II', right: 'Perda óssea horizontal parcial entre raízes' },
      { left: 'Mobilidade grau III', right: 'Deslocamento horizontal e vertical do dente' },
    ],
    explanation:
      'Sangramento não demonstra progressão ativa, e perda de inserção exige exclusão de causas não periodontais. Furca e mobilidade devem ser classificadas pelo sistema adotado.',
  },
  {
    id: 'perio-08',
    kind: 'blank',
    difficulty: 2,
    prompt: 'Complete a frase',
    sentence: 'A reavaliação periodontal costuma ocorrer cerca de ___ semanas após a instrumentação.',
    answer: '4 a 8',
    bank: ['4 a 8', '1', '20 a 24', '52'],
    explanation:
      'O intervalo permite resolução inicial dos tecidos e avaliação da resposta. Ele pode variar conforme extensão da doença, procedimento e protocolo clínico.',
  },
  {
    id: 'perio-09',
    kind: 'choice',
    difficulty: 3,
    prompt: 'Qual fator local você deve corrigir?',
    scenario: 'Inflamação persistente apenas na mesial do 36, mesmo com boa higiene do paciente.',
    options: [
      'Nenhum: é característica individual',
      'Restauração com excesso ou margem mal adaptada retendo biofilme',
      'Cor da resina',
      'Tipo de escova',
    ],
    answer: 1,
    explanation:
      'Sítio isolado inflamado com higiene boa em toda a boca aponta fator retentivo local: excesso proximal, margem mal adaptada ou contato aberto.',
  },
  {
    id: 'perio-10',
    kind: 'boolean',
    difficulty: 2,
    prompt: 'Verdadeiro ou falso?',
    statement:
      'O tabagismo pode reduzir sinais clínicos de inflamação e está associado a pior resposta periodontal.',
    answer: true,
    explanation:
      'Fumantes podem apresentar menos sangramento apesar de maior destruição periodontal. Os efeitos envolvem alterações vasculares, inflamatórias, imunológicas e de cicatrização.',
  },
  {
    id: 'perio-11',
    kind: 'choice',
    difficulty: 2,
    prompt: 'Como orientar o paciente após a raspagem?',
    options: [
      'Avisar que pode haver sensibilidade e retração e reforçar higiene e manutenção',
      'Garantir que a gengiva volta ao nível original em uma semana',
      'Recomendar suspender o fio dental por um mês',
      'Dizer que não é preciso retornar',
    ],
    answer: 0,
    explanation:
      'Depois da raspagem, o edema diminui e a retração pode aparecer, com sensibilidade. Explicar isso antes evita a sensação de que o tratamento piorou o quadro.',
  },
  {
    id: 'perio-12',
    kind: 'multi',
    difficulty: 3,
    prompt: 'Selecione as situações que pedem encaminhamento ao especialista',
    options: [
      'Bolsas profundas persistentes após tratamento básico',
      'Envolvimento de furca avançado',
      'Gengivite leve em paciente jovem',
      'Necessidade de cirurgia periodontal',
      'Mobilidade progressiva sem resposta ao tratamento inicial',
    ],
    answers: [0, 1, 3, 4],
    explanation:
      'Bolsas residuais profundas, furca avançada, mobilidade progressiva e necessidade cirúrgica podem exigir experiência ou recursos especializados.',
  },
];
