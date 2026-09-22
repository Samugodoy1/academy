import type { BaseDiscipline } from '../types';

export const anatomiaCabecaPescoco: BaseDiscipline = {
  id: 'anatomia-cabeca-pescoco',
  title: 'Anatomia da cabeça e pescoço',
  short: 'Cabeça e pescoço',
  tagline: 'Ossos, trigêmeo, músculos e ATM — o mapa da anestesia',
  period: 1,
  colaTopic: 'anatomia-aplicada',
  references: [
    {
      id: 'rodella-2012',
      authors: 'Rodella LF, Buffoli B, Labanca M, Rezzani R',
      title: 'A review of the mandibular and maxillary nerve supplies and their clinical relevance',
      journal: 'Archives of Oral Biology',
      year: 2012,
      doi: '10.1016/j.archoralbio.2011.09.007',
      why: 'Revisão da inervação maxilar e mandibular com as variações que explicam falhas anestésicas.',
    },
    {
      id: 'blanton-2003',
      authors: 'Blanton PL, Jeske AH',
      title: 'The key to profound local anesthesia: neuroanatomy',
      journal: 'The Journal of the American Dental Association',
      year: 2003,
      doi: '10.14219/jada.archive.2003.0262',
      why: 'Conecta cada técnica anestésica ao ramo nervoso e ao ponto anatômico de referência.',
    },
    {
      id: 'khoury-2011',
      authors: 'Khoury JN, Mihailidis S, Ghabriel M, Townsend G',
      title: 'Applied anatomy of the pterygomandibular space: improving the success of inferior alveolar nerve blocks',
      journal: 'Australian Dental Journal',
      year: 2011,
      doi: '10.1111/j.1834-7819.2011.01312.x',
      why: 'Anatomia do espaço pterigomandibular e por que o bloqueio do alveolar inferior falha.',
    },
    {
      id: 'alomar-2007',
      authors: 'Alomar X, Medrano J, Cabratosa J, Clavero JA, Lorente M, Serra I, Monill JM, Salvador A',
      title: 'Anatomy of the temporomandibular joint',
      journal: 'Seminars in Ultrasound, CT and MRI',
      year: 2007,
      doi: '10.1053/j.sult.2007.02.002',
      why: 'Descrição anatômica e por imagem dos componentes da ATM.',
    },
    {
      id: 'statpearls-atm',
      authors: 'Bordoni B, Varacallo M',
      title: 'Anatomy, Head and Neck, Temporomandibular Joint',
      journal: 'StatPearls (NCBI Bookshelf)',
      year: 2023,
      url: 'https://www.ncbi.nlm.nih.gov/books/NBK538486/',
      why: 'Revisão aberta e atualizada da ATM e dos músculos da mastigação.',
    },
  ],
  mindMap: {
    label: 'Cabeça e pescoço',
    children: [
      {
        label: 'Maxila',
        children: [
          { label: 'Forame infraorbital', note: 'Nervo infraorbital · bloqueio dos anteriores.' },
          { label: 'Tuberosidade', note: 'Nervo alveolar superior posterior · molares.' },
          { label: 'Palato', note: 'Forame incisivo (nasopalatino) e palatino maior.' },
          { label: 'Osso poroso', note: 'Infiltrativa funciona bem na maxila.' },
        ],
      },
      {
        label: 'Mandíbula',
        children: [
          { label: 'Forame mandibular', note: 'Face medial do ramo, sob a língula. Alvo do bloqueio.' },
          { label: 'Canal mandibular', note: 'Nervo e vasos alveolares inferiores.' },
          { label: 'Forame mentual', note: 'Entre os pré-molares, abaixo dos ápices.' },
          { label: 'Cortical densa', note: 'Infiltrativa não atravessa em molares: bloqueio.' },
        ],
      },
      {
        label: 'Trigêmeo (V)',
        children: [
          { label: 'V1 oftálmico', note: 'Sensitivo. Testa, pálpebra superior.' },
          { label: 'V2 maxilar', note: 'ASA, ASM, ASP, palatino maior, nasopalatino.' },
          { label: 'V3 mandibular', note: 'Alveolar inferior, lingual, bucal. Motor da mastigação.' },
        ],
      },
      {
        label: 'Mastigação e ATM',
        children: [
          { label: 'Elevadores', note: 'Masseter, temporal, pterigóideo medial.' },
          { label: 'Pterigóideo lateral', note: 'Protrusão, abertura e lateralidade.' },
          { label: 'ATM', note: 'Côndilo, disco, fossa. Rotação + translação.' },
        ],
      },
    ],
  },
  lessons: [
    {
      id: 'acp-ossos',
      title: 'Maxila e mandíbula: os marcos que você vai palpar',
      summary: 'Forames, cristas e tuberosidades que orientam anestesia, cirurgia e leitura de radiografia.',
      minutes: 9,
      keyPoints: [
        'Maxila tem cortical fina e porosa: a anestesia infiltrativa difunde bem. Mandíbula tem cortical espessa: molares exigem bloqueio.',
        'Forame infraorbital (abaixo da órbita), forame incisivo e forame palatino maior são os pontos de referência da maxila.',
        'Na mandíbula: forame mandibular na face medial do ramo (sob a língula), canal mandibular percorrendo o corpo e forame mentual entre os pré-molares.',
        'O trígono retromolar e a linha oblíqua são referências para o bloqueio do alveolar inferior e para o acesso a terceiros molares.',
      ],
      sections: [
        {
          heading: 'Maxila',
          bullets: [
            'Processo alveolar sustenta os dentes superiores; a tuberosidade da maxila fica atrás dos molares — ponto para o bloqueio do alveolar superior posterior.',
            'Forame infraorbital: abaixo da margem infraorbital, na linha da pupila; emerge o nervo infraorbital (ramo terminal de V2).',
            'Palato duro: forame incisivo atrás dos incisivos centrais (nervo nasopalatino) e forames palatinos maiores próximos ao segundo/terceiro molares (nervo palatino maior).',
            'Seio maxilar ocupa o corpo da maxila; raízes de molares e pré-molares podem estar em contato íntimo com o assoalho — relevante em extrações e endodontia.',
          ],
        },
        {
          heading: 'Mandíbula',
          bullets: [
            'Corpo, ramo, ângulo, côndilo e processo coronoide. Face medial do ramo tem a língula e o forame mandibular, onde entra o nervo alveolar inferior.',
            'Canal mandibular desce do forame e corre abaixo dos ápices dos molares; sua relação com terceiros molares é decisiva no risco cirúrgico.',
            'Forame mentual: face vestibular do corpo, geralmente entre ápices dos pré-molares; por ele saem o nervo e vasos mentuais.',
            'Linha oblíqua externa, trígono retromolar e rafe pterigomandibular são os marcos palpáveis/visíveis para o bloqueio do alveolar inferior.',
          ],
        },
        {
          heading: 'Por que isso muda a técnica',
          bullets: [
            'Cortical maxilar porosa → infiltrativa supraperiosteal costuma anestesiar polpa e periósteo de um dente. Cortical mandibular densa → em molares e pré-molares, bloqueio do alveolar inferior.',
            'Em crianças a cortical mandibular é menos densa: infiltrativa pode bastar em molares decíduos.',
            'Variações anatômicas (forame mandibular alto, canal bífido, forame retromolar) explicam parte das falhas anestésicas.',
          ],
        },
      ],
      clinicalBridge:
        'Cada técnica de anestesia da Cola aponta para um forame ou uma tuberosidade desta lição. Quem palpa o marco certo erra menos e repica menos.',
      selfCheck: [
        {
          question: 'Onde fica o forame mandibular e por que ele importa?',
          answer: 'Na face medial do ramo da mandíbula, logo atrás da língula, na altura do plano oclusal dos molares em adultos. É por ele que o nervo alveolar inferior entra no canal — o alvo do bloqueio.',
        },
        {
          question: 'Por que a infiltrativa funciona em maxila e falha em molares inferiores?',
          answer: 'A cortical da maxila é fina e porosa e deixa o anestésico difundir até o ápice; a cortical mandibular na região de molares é espessa e bloqueia a difusão.',
        },
        {
          question: 'Que estruturas emergem do forame infraorbital e do forame mentual?',
          answer: 'Do infraorbital, o nervo infraorbital e vasos; do mentual, o nervo mentual (sensibilidade do lábio inferior e mento) e vasos mentuais.',
        },
      ],
      refIds: ['rodella-2012', 'blanton-2003'],
    },
    {
      id: 'acp-trigemeo',
      title: 'Nervo trigêmeo: o mapa da anestesia',
      summary: 'Quem inerva o quê — a única forma de escolher a técnica certa em vez de decorar.',
      minutes: 10,
      keyPoints: [
        'V2 (maxilar) é só sensitivo: alveolares superiores anterior, médio e posterior, infraorbital, palatino maior e nasopalatino.',
        'V3 (mandibular) é misto: alveolar inferior (→ mentual e incisivo), lingual, bucal, auriculotemporal e ramos motores para a mastigação.',
        'Polpa e periodonto vestibular dos inferiores: alveolar inferior. Mucosa vestibular dos molares inferiores: nervo bucal. Lingual: nervo lingual.',
        'Anastomoses cruzam a linha média — anteriores costumam precisar de complemento do lado oposto.',
      ],
      sections: [
        {
          heading: 'V2 — maxilar',
          bullets: [
            'Sai do crânio pelo forame redondo, atravessa a fossa pterigopalatina e entra na órbita como infraorbital.',
            'Alveolar superior posterior (ASP): molares superiores, exceto frequentemente a raiz mésio-vestibular do primeiro molar. Alveolar superior médio (ASM): presente em parte das pessoas; pré-molares e raiz MV do 1º molar. Alveolar superior anterior (ASA): incisivos e canino.',
            'Palatino maior: mucosa palatina de molares e pré-molares. Nasopalatino: palato anterior, atrás dos incisivos.',
            'Infiltrativa supraperiosteal alcança ASA/ASM/ASP no ápice de cada dente — daí ser a técnica de rotina na maxila.',
          ],
        },
        {
          heading: 'V3 — mandibular',
          bullets: [
            'Sai pelo forame oval. Divisão anterior: essencialmente motora (masseter, temporal, pterigóideos) e o nervo bucal (sensitivo). Divisão posterior: alveolar inferior, lingual e auriculotemporal.',
            'Alveolar inferior entra no forame mandibular, inerva todos os dentes inferiores do lado e emerge como mentual (lábio, mento) e incisivo (anteriores).',
            'Lingual: dois terços anteriores da língua (sensibilidade geral), assoalho e gengiva lingual. Passa próximo à cortical lingual do terceiro molar — risco cirúrgico.',
            'Bucal: mucosa e gengiva vestibular dos molares inferiores. Não é anestesiado pelo bloqueio do alveolar inferior; precisa de complemento para grampo ou cirurgia.',
          ],
        },
        {
          heading: 'Falhas com explicação anatômica',
          bullets: [
            'Inervação acessória do milo-hióideo em molares inferiores; canal bífido; forame retromolar.',
            'Anastomoses de incisivo contralateral nos anteriores inferiores e superiores.',
            'Inflamação local e ansiedade não são "anatomia", mas mudam o resultado tanto quanto — a Cola de anestesia continua este assunto.',
          ],
        },
      ],
      clinicalBridge:
        'No box, escolher entre infiltrativa, bloqueio e complemento bucal é aplicar este mapa. A Cola de anestesia parte daqui.',
      selfCheck: [
        {
          question: 'O bloqueio do alveolar inferior anestesia a mucosa vestibular dos molares inferiores?',
          answer: 'Não. Essa mucosa é do nervo bucal, que precisa de anestesia complementar para colocação de grampo ou incisão vestibular.',
        },
        {
          question: 'Qual nervo inerva a raiz mésio-vestibular do primeiro molar superior na maioria das pessoas?',
          answer: 'O alveolar superior médio (quando presente) ou fibras do anterior; por isso a infiltrativa apenas na região do ASP pode deixar essa raiz sensível.',
        },
        {
          question: 'Que ramos terminais o alveolar inferior origina ao sair do canal?',
          answer: 'O nervo mentual (lábio inferior, mento e gengiva vestibular anterior) e o nervo incisivo (dentes anteriores inferiores).',
        },
      ],
      refIds: ['blanton-2003', 'khoury-2011', 'rodella-2012'],
    },
    {
      id: 'acp-musculos-atm',
      title: 'Músculos da mastigação e ATM',
      summary: 'Quem eleva, quem abaixa e como a articulação gira e desliza.',
      minutes: 8,
      keyPoints: [
        'Elevadores: masseter, temporal e pterigóideo medial. Todos inervados por V3.',
        'Pterigóideo lateral protrui, ajuda na abertura e faz lateralidade; a abertura depende também de supra-hióideos (digástrico) e da gravidade.',
        'ATM é uma articulação sinovial dupla: côndilo, disco interposto e fossa mandibular do temporal. Movimento combina rotação (compartimento inferior) e translação (superior).',
        'Abertura normal fica em torno de 40–55 mm; lateralidade e protrusão em torno de 7–10 mm.',
      ],
      sections: [
        {
          heading: 'Os quatro músculos',
          bullets: [
            'Masseter: do arco zigomático à face lateral do ramo e ângulo; potente elevador. Palpável na bochecha ao apertar os dentes.',
            'Temporal: em leque, da fossa temporal ao processo coronoide. Fibras anteriores elevam; posteriores retraem.',
            'Pterigóideo medial: da fossa pterigóidea à face medial do ângulo; eleva e ajuda na protrusão. Forma a parede medial do espaço pterigomandibular — onde deposita-se o anestésico do bloqueio.',
            'Pterigóideo lateral: cabeça superior (disco/cápsula) e inferior (côndilo). Protrai e faz lateralidade; contração unilateral desvia a mandíbula para o lado oposto.',
          ],
        },
        {
          heading: 'ATM: componentes',
          bullets: [
            'Côndilo mandibular, disco articular (fibrocartilagem, bicôncavo, avascular no centro), fossa mandibular e eminência articular do osso temporal.',
            'Cápsula e ligamentos (temporomandibular lateral, esfenomandibular, estilomandibular). Zona bilaminar retrodiscal vascularizada e inervada — origem de dor quando o disco desloca.',
            'Superfícies articulares recobertas por fibrocartilagem (não hialina), adaptação a cargas de cisalhamento.',
          ],
        },
        {
          heading: 'Movimento e exame',
          bullets: [
            'Primeiros ~20 mm de abertura: predominantemente rotação; depois, translação do côndilo pela eminência.',
            'Exame: abertura máxima, desvios/deflexões, ruídos (clique, crepitação), palpação de masseter, temporal e polo lateral do côndilo.',
            'Bruxismo e dor miofascial são frequentes e multifatoriais; consenso de 2018 orienta avaliação por autorrelato, exame e instrumentos — não por oclusão isolada.',
          ],
        },
      ],
      clinicalBridge:
        'Na primeira consulta você palpa masseter e temporal e mede a abertura. Um clique não é diagnóstico — mas saber onde está o disco explica por que ele ocorre.',
      selfCheck: [
        {
          question: 'Quais músculos elevam a mandíbula e qual nervo os inerva?',
          answer: 'Masseter, temporal e pterigóideo medial — todos pelo ramo mandibular (V3) do trigêmeo.',
        },
        {
          question: 'Se o pterigóideo lateral direito contrai sozinho, para onde a mandíbula desvia?',
          answer: 'Para a esquerda (lado oposto), porque o côndilo direito é tracionado para frente e medialmente.',
        },
        {
          question: 'Que parte da ATM dói quando há deslocamento do disco?',
          answer: 'A zona bilaminar (tecido retrodiscal), que é vascularizada e inervada, ao ser comprimida pelo côndilo quando o disco sai da posição.',
        },
      ],
      refIds: ['alomar-2007', 'statpearls-atm'],
    },
  ],
};
