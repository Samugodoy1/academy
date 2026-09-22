import type { BaseDiscipline } from '../types';

export const fisiologiaOral: BaseDiscipline = {
  id: 'fisiologia-oral',
  title: 'Fisiologia oral',
  short: 'Fisiologia',
  tagline: 'Saliva, dor dentinária, mastigação e deglutição',
  period: 2,
  colaTopic: 'preventiva',
  references: [
    {
      id: 'humphrey-2001',
      authors: 'Humphrey SP, Williamson RT',
      title: 'A review of saliva: normal composition, flow, and function',
      journal: 'The Journal of Prosthetic Dentistry',
      year: 2001,
      doi: '10.1067/mpr.2001.113778',
      why: 'Valores de fluxo, composição e funções da saliva usados na lição.',
    },
    {
      id: 'dawes-2015',
      authors: 'Dawes C, Pedersen AML, Villa A, Ekström J, Proctor GB, Vissink A, et al.',
      title: 'The functions of human saliva: A review sponsored by the World Workshop on Oral Medicine VI',
      journal: 'Archives of Oral Biology',
      year: 2015,
      doi: '10.1016/j.archoralbio.2015.03.004',
      why: 'Revisão de consenso sobre o que a saliva faz e o que acontece quando falta.',
    },
    {
      id: 'pedersen-2018',
      authors: 'Pedersen AML, Sørensen CE, Proctor GB, Carpenter GH, Ekström J',
      title: 'Salivary secretion in health and disease',
      journal: 'Journal of Oral Rehabilitation',
      year: 2018,
      doi: '10.1111/joor.12664',
      why: 'Controle neural da secreção e causas de hipossalivação, incluindo medicamentos.',
    },
    {
      id: 'brannstrom-1986',
      authors: 'Brännström M',
      title: 'The hydrodynamic theory of dentinal pain: sensation in preparations, caries, and the dentinal crack syndrome',
      journal: 'Journal of Endodontics',
      year: 1986,
      doi: '10.1016/S0099-2399(86)80198-4',
      why: 'O artigo do próprio autor da teoria hidrodinâmica.',
    },
    {
      id: 'byers-1999',
      authors: 'Byers MR, Närhi MV',
      title: 'Dental injury models: experimental tools for understanding neuroinflammatory interactions and polymodal nociceptor functions',
      journal: 'Critical Reviews in Oral Biology & Medicine',
      year: 1999,
      doi: '10.1177/10454411990100010101',
      why: 'Fibras Aδ e C na polpa e como a inflamação muda a resposta à dor.',
    },
    {
      id: 'hiiemae-2003',
      authors: 'Hiiemae KM, Palmer JB',
      title: 'Tongue movements in feeding and speech',
      journal: 'Critical Reviews in Oral Biology & Medicine',
      year: 2003,
      doi: '10.1177/154411130301400604',
      why: 'Coordenação de língua, mastigação e deglutição.',
    },
    {
      id: 'peyron-2017',
      authors: 'Peyron MA, Woda A, Bourdiol P, Hennequin M',
      title: 'Age-related changes in mastication',
      journal: 'Journal of Oral Rehabilitation',
      year: 2017,
      doi: '10.1111/joor.12478',
      why: 'Como a função mastigatória se adapta com a perda dentária e a idade.',
    },
  ],
  mindMap: {
    label: 'Fisiologia oral',
    children: [
      {
        label: 'Saliva',
        children: [
          { label: 'Fluxo', note: 'Repouso 0,3–0,4 mL/min · estimulado 1–2 mL/min.' },
          { label: 'Glândulas', note: 'Parótida (serosa), submandibular (mista, domina o repouso), sublingual (mucosa).' },
          { label: 'Funções', note: 'Tampão, limpeza, lubrificação, antimicrobiana, remineralização.' },
          { label: 'Hipossalivação', note: '< 0,1 mL/min em repouso. Medicamentos são a causa nº 1.' },
        ],
      },
      {
        label: 'Dor dentinária',
        children: [
          { label: 'Teoria hidrodinâmica', note: 'Fluido move → fibra Aδ dispara.' },
          { label: 'Aδ vs C', note: 'Aguda e localizada vs difusa e persistente.' },
          { label: 'Tratamento', note: 'Ocluir túbulo ou dessensibilizar o nervo.' },
        ],
      },
      {
        label: 'Mastigação',
        children: [
          { label: 'Gerador central', note: 'Tronco encefálico dita o ritmo.' },
          { label: 'Reflexos', note: 'Miotático, de abertura, periodontal.' },
          { label: 'Eficiência', note: 'Cai com perda de dentes; adapta com o tempo.' },
        ],
      },
      {
        label: 'Deglutição',
        children: [
          { label: 'Fase oral', note: 'Voluntária. Língua leva o bolo.' },
          { label: 'Fase faríngea', note: 'Reflexa. Fecha via aérea.' },
          { label: 'Fase esofágica', note: 'Peristalse.' },
        ],
      },
    ],
  },
  lessons: [
    {
      id: 'fo-saliva',
      title: 'Saliva: composição, fluxo e as funções que protegem o dente',
      summary: 'O fluido que decide se o biofilme ganha ou perde — e por que boca seca é emergência de cárie.',
      minutes: 9,
      keyPoints: [
        'Fluxo não estimulado ~0,3–0,4 mL/min; estimulado 1–2 mL/min; total 0,5–1,5 L/dia. Hipossalivação: < 0,1 mL/min em repouso.',
        'Em repouso a submandibular contribui com a maior parte; sob estímulo a parótida domina com saliva serosa rica em amilase.',
        'Funções: tampão (bicarbonato, fosfato), limpeza mecânica, lubrificação (mucinas), defesa (IgA, lisozima, lactoferrina, peroxidase), reservatório de cálcio e fosfato para remineralização, película adquirida.',
        'Medicamentos (anticolinérgicos, antidepressivos, anti-hipertensivos), radioterapia de cabeça e pescoço e Sjögren são as causas mais frequentes de boca seca.',
      ],
      sections: [
        {
          heading: 'De onde vem e quanto',
          bullets: [
            'Três pares maiores (parótida, submandibular, sublingual) e centenas de glândulas menores (labiais, bucais, palatinas, linguais) que produzem pouco volume mas muita mucina — importante para lubrificação.',
            'Controle autonômico: parassimpático (acetilcolina, receptores muscarínicos M3) → volume abundante e aquoso; simpático → saliva mais viscosa, rica em proteína. Por isso anticolinérgicos secam a boca.',
            'Estímulos: mastigação, gustação (ácido é o mais potente), olfato e até o pensamento. Fluxo cai durante o sono — daí o risco maior de cárie com mamadeira noturna.',
          ],
        },
        {
          heading: 'O que tem dentro',
          bullets: [
            '99% água. Eletrólitos: Na, K, Cl, bicarbonato, fosfato, Ca, F em baixa concentração. pH em repouso ~6,7–7,3; sobe com o fluxo pela maior concentração de bicarbonato.',
            'Proteínas: amilase, mucinas (MUC5B, MUC7), proteínas ricas em prolina e estaterina (mantêm supersaturação de cálcio e fosfato sem precipitar), histatinas (antifúngicas), IgA secretora, lisozima, lactoferrina, peroxidase.',
            'Película adquirida: camada proteica que se forma em minutos sobre o esmalte limpo; protege contra ácido e é a base onde o biofilme se ancora.',
          ],
        },
        {
          heading: 'Quando falta',
          bullets: [
            'Xerostomia é a queixa; hipossalivação é a medida. Podem não coincidir.',
            'Consequências: cárie rampante (típica em cervical e incisal), candidíase, mucosite, dificuldade de deglutir e falar, prótese que não retém, halitose.',
            'Conduta básica: identificar causa (revisar prescrições), estimular fluxo (goma sem açúcar, xilitol), flúor de alta concentração, hidratação, substitutos de saliva.',
          ],
        },
      ],
      clinicalBridge:
        'Cárie de aparecimento súbito em adulto: a primeira pergunta é "que remédios você toma?". Sialometria é exame de consultório — copo, cronômetro, cinco minutos.',
      selfCheck: [
        {
          question: 'Qual valor define hipossalivação em repouso?',
          answer: 'Fluxo não estimulado abaixo de 0,1 mL/min (normal em torno de 0,3–0,4 mL/min).',
        },
        {
          question: 'Por que um antidepressivo tricíclico causa boca seca?',
          answer: 'Pelo efeito anticolinérgico: bloqueia receptores muscarínicos que o parassimpático usa para disparar a secreção aquosa das glândulas.',
        },
        {
          question: 'Como a saliva impede que cálcio e fosfato precipitem, se está supersaturada?',
          answer: 'Proteínas como estaterina e proteínas ricas em prolina estabilizam os íons em solução, mantendo o reservatório disponível para remineralizar o esmalte sem formar cálculo em toda parte.',
        },
      ],
      refIds: ['humphrey-2001', 'dawes-2015', 'pedersen-2018'],
    },
    {
      id: 'fo-dor-dentinaria',
      title: 'Dor dentinária: a teoria hidrodinâmica',
      summary: 'Por que o dente dói com gelado, ar e doce — e por que não há nervo no esmalte.',
      minutes: 7,
      keyPoints: [
        'Brännström: estímulos (frio, ar, osmótico, tátil) deslocam o fluido dentro dos túbulos; o movimento deforma terminações de fibras Aδ na periferia da polpa e gera dor aguda, curta e localizada.',
        'Fibras C (amielínicas, centrais) respondem a inflamação e calor: dor difusa, pulsátil, que persiste — sinal de pulpite irreversível.',
        'Túbulos abertos (recessão, erosão, abrasão, preparo) = hipersensibilidade dentinária. Fechar túbulo ou dessensibilizar nervo são as duas estratégias.',
        'A dentina não dói na profundidade uniformemente: dói mais perto da polpa, onde os túbulos são mais largos e numerosos.',
      ],
      sections: [
        {
          heading: 'O mecanismo',
          bullets: [
            'O fluido dentinário está sob leve pressão positiva. Frio contrai o fluido e o puxa para fora; ar seca a superfície e evapora fluido; soluções hipertônicas (açúcar) o puxam por osmose. Em todos os casos há fluxo rápido.',
            'O fluxo deforma mecanicamente as terminações nervosas Aδ situadas na camada odontoblástica e no início dos túbulos — a dentina em si não tem terminações na porção externa.',
            'Calor expande o fluido para dentro lentamente: resposta menor e mais tardia, exceto em polpa inflamada, quando fibras C sensibilizadas respondem.',
          ],
        },
        {
          heading: 'Aδ e C no exame clínico',
          bullets: [
            'Teste ao frio positivo com dor breve que cessa ao retirar o estímulo: fibras Aδ, compatível com polpa normal ou pulpite reversível.',
            'Dor prolongada (segundos a minutos), espontânea ou ao calor: fibras C, compatível com pulpite irreversível.',
            'Necrose: sem resposta, porque não há fibras vivas — o teste de vitalidade é, no fundo, um teste de sensibilidade neural.',
          ],
        },
        {
          heading: 'Hipersensibilidade dentinária',
          bullets: [
            'Definição: dor curta e aguda em dentina exposta a estímulos, sem outra patologia que explique. Prevalência alta em adultos jovens, associada a recessão e escovação abrasiva.',
            'Oclusão de túbulos: dentifrícios com arginina, estanho, nitrato de potássio (age no nervo), vernizes fluoretados, adesivos, laser.',
            'Remover a causa vem antes: dieta ácida, técnica de escovação, refluxo, bruxismo.',
          ],
        },
      ],
      clinicalBridge:
        'Todo teste de vitalidade, toda sensibilidade pós-restauração e toda queixa de "dói com gelado" passam por este resumo. Você vai explicá-lo a pacientes em palavras simples: "o líquido dentro do dente se mexe e cutuca o nervo".',
      selfCheck: [
        {
          question: 'Por que o doce dói em uma cárie de dentina, se não é frio nem toque?',
          answer: 'Pelo efeito osmótico: a solução hipertônica puxa fluido dos túbulos para fora, gerando o fluxo rápido que estimula as fibras Aδ.',
        },
        {
          question: 'Dor que continua por um minuto depois de tirar o gelo indica o quê?',
          answer: 'Ativação de fibras C sensibilizadas por inflamação — quadro compatível com pulpite irreversível, que não regride com restauração simples.',
        },
        {
          question: 'Como o nitrato de potássio reduz a sensibilidade?',
          answer: 'Não fecha o túbulo: o potássio difunde e despolariza a terminação nervosa cronicamente, reduzindo a capacidade da fibra de disparar.',
        },
      ],
      refIds: ['brannstrom-1986', 'byers-1999'],
    },
    {
      id: 'fo-mastigacao',
      title: 'Mastigação, deglutição e controle neuromuscular',
      summary: 'Do gerador de padrão no tronco aos reflexos que protegem o dente quando você morde uma pedra.',
      minutes: 7,
      keyPoints: [
        'O ritmo mastigatório vem de um gerador central de padrão no tronco encefálico, modulado pelo córtex e por feedback sensorial (periodonto, ATM, músculos, mucosa).',
        'Reflexos: miotático (estiramento do elevador → contração), de abertura (estímulo nocivo → inibe elevadores), e mecanorreceptores periodontais ajustam a força ao alimento.',
        'Deglutição em três fases: oral (voluntária), faríngea (reflexa, ~1 s, fecha a via aérea) e esofágica (peristalse). Deglutimos ~600 vezes por dia, a maioria sem alimento.',
        'A eficiência mastigatória cai com a perda de dentes posteriores; próteses recuperam parte, e o sistema se adapta com mais ciclos.',
      ],
      sections: [
        {
          heading: 'Ciclo e controle',
          bullets: [
            'Um ciclo tem fase de abertura, fechamento rápido e fechamento lento (fase de potência, quando o alimento é triturado). Frequência em torno de 1–1,5 Hz.',
            'Fibras aferentes do trigêmeo levam informação de posição e força ao núcleo mesencefálico (proprioceptores dos elevadores) e ao núcleo sensitivo principal; eferentes saem do núcleo motor do V para os músculos.',
            'A língua e as bochechas reposicionam o bolo entre ciclos (Hiiemae & Palmer 2003): mastigar é coordenação, não só força.',
          ],
        },
        {
          heading: 'Reflexos de proteção',
          bullets: [
            'Reflexo de abertura: contato inesperado com objeto duro ou dor → inibição dos elevadores e ativação dos abaixadores em milissegundos.',
            'Mecanorreceptores do ligamento periodontal detectam forças de poucos gramas: é por eles que você "sente" um ponto alto em uma restauração.',
            'Posição postural (repouso): espaço funcional livre de 2–4 mm entre os dentes; determinado por tônus muscular, não por oclusão.',
          ],
        },
        {
          heading: 'Deglutição e função',
          bullets: [
            'Fase oral: língua eleva contra o palato e empurra o bolo para trás. Fase faríngea: palato mole fecha nasofaringe, laringe eleva, epiglote e pregas vocais fecham a via aérea, esfíncter esofágico superior relaxa. Fase esofágica: onda peristáltica.',
            'Deglutição atípica (interposição lingual) e respiração bucal mudam o equilíbrio de forças e influenciam o desenvolvimento dos arcos.',
            'Idosos e pacientes com perda dentária engolem partículas maiores; a adaptação envolve mais ciclos e maior uso da língua (Peyron 2017).',
          ],
        },
      ],
      clinicalBridge:
        'Ajuste oclusal, prótese e ortodontia lidam com esse sistema. Um ponto alto de 50 micrômetros aciona reflexo periodontal; uma prótese total reduz e depois recupera eficiência mastigatória — você vai medir isso.',
      selfCheck: [
        {
          question: 'Onde é gerado o ritmo da mastigação?',
          answer: 'Em um gerador central de padrão no tronco encefálico, que o córtex inicia e o feedback sensorial (periodonto, músculos, ATM) ajusta.',
        },
        {
          question: 'O que acontece quando você morde uma pedra sem esperar?',
          answer: 'Dispara o reflexo de abertura: inibição imediata dos músculos elevadores e ativação dos abaixadores, protegendo dentes e periodonto.',
        },
        {
          question: 'Qual fase da deglutição é voluntária e qual protege a via aérea?',
          answer: 'A fase oral é voluntária; a fase faríngea é reflexa e fecha a via aérea (elevação laríngea, fechamento das pregas vocais e da epiglote).',
        },
      ],
      refIds: ['hiiemae-2003', 'peyron-2017'],
    },
  ],
};
