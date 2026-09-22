import type { BaseDiscipline } from '../types';

export const anatomiaDental: BaseDiscipline = {
  id: 'anatomia-dental',
  title: 'Anatomia dental',
  short: 'Anatomia dental',
  tagline: 'Nomenclatura, morfologia, erupção e oclusão',
  period: 1,
  colaTopic: 'oclusao',
  references: [
    {
      id: 'keiser-1971',
      authors: 'Keiser-Nielsen S',
      title: 'Fédération Dentaire Internationale two-digit system of designating teeth',
      journal: 'International Dental Journal',
      year: 1971,
      url: 'https://pubmed.ncbi.nlm.nih.gov/5290012/',
      why: 'Artigo original que apresenta a notação FDI usada no prontuário do Academy.',
    },
    {
      id: 'peck-1993',
      authors: 'Peck S, Peck L',
      title: 'A time for change of tooth numbering systems',
      journal: 'Journal of Dental Education',
      year: 1993,
      url: 'https://pubmed.ncbi.nlm.nih.gov/8397247/',
      why: 'Compara os sistemas de notação e defende o FDI como padrão internacional.',
    },
    {
      id: 'kondo-2006',
      authors: 'Kondo S, Townsend GC',
      title: 'Associations between Carabelli trait and cusp areas in human permanent maxillary first molars',
      journal: 'American Journal of Physical Anthropology',
      year: 2006,
      doi: '10.1002/ajpa.20271',
      why: 'Mostra como um traço morfológico clássico varia entre pessoas — a anatomia é um padrão, não uma regra rígida.',
    },
    {
      id: 'alqahtani-2010',
      authors: 'AlQahtani SJ, Hector MP, Liversidge HM',
      title: 'The London Atlas of human tooth development and eruption',
      journal: 'American Journal of Physical Anthropology',
      year: 2010,
      doi: '10.1002/ajpa.21258',
      why: 'Atlas de referência para cronologia de formação e erupção, base das idades citadas no resumo.',
    },
    {
      id: 'bishara-1997',
      authors: 'Bishara SE, Jakobsen JR, Treder J, Nowak A',
      title: 'Arch width changes from 6 weeks to 45 years of age',
      journal: 'American Journal of Orthodontics and Dentofacial Orthopedics',
      year: 1997,
      doi: '10.1016/S0889-5406(97)80022-4',
      why: 'Acompanha as mudanças dos arcos ao longo da vida — contexto para a dentição mista.',
    },
    {
      id: 'turp-2008',
      authors: 'Türp JC, Greene CS, Strub JR',
      title: 'Dental occlusion: a critical reflection on past, present and future concepts',
      journal: 'Journal of Oral Rehabilitation',
      year: 2008,
      doi: '10.1111/j.1365-2842.2007.01820.x',
      why: 'Revisão crítica dos conceitos de oclusão: o que ainda vale e o que a evidência derrubou.',
    },
    {
      id: 'angle-1899',
      authors: 'Angle EH',
      title: 'Classification of malocclusion',
      journal: 'Dental Cosmos',
      year: 1899,
      url: 'https://quod.lib.umich.edu/d/dencos/acf8385.0041.001/262',
      why: 'Texto histórico que criou as classes I, II e III ainda usadas hoje.',
    },
  ],
  mindMap: {
    label: 'Anatomia dental',
    children: [
      {
        label: 'Nomenclatura',
        children: [
          { label: 'FDI: dois dígitos', note: 'Quadrante + posição. 11 a 48 permanentes, 51 a 85 decíduos.' },
          { label: 'Faces', note: 'Vestibular, lingual/palatina, mesial, distal, oclusal/incisal.' },
          { label: 'Terços', note: 'Cervical, médio, oclusal (coroa) · cervical, médio, apical (raiz).' },
        ],
      },
      {
        label: 'Grupos',
        children: [
          { label: 'Incisivos', note: 'Cortar. Borda incisal, cíngulo, mamelões.' },
          { label: 'Caninos', note: 'Rasgar. Cúspide única, raiz mais longa.' },
          { label: 'Pré-molares', note: 'Transição. Duas cúspides (exceto 2º inferior, que pode ter três).' },
          { label: 'Molares', note: 'Triturar. 4–5 cúspides, várias raízes.' },
        ],
      },
      {
        label: 'Dentições',
        children: [
          { label: 'Decídua: 20 dentes', note: 'Erupção de 6 a 30 meses.' },
          { label: 'Mista: 6 a 12 anos', note: 'Primeiros molares e incisivos abrem a troca.' },
          { label: 'Permanente: 32 dentes', note: 'Terceiros molares por último (17–21 anos).' },
        ],
      },
      {
        label: 'Oclusão',
        children: [
          { label: 'Chave de Angle', note: 'Cúspide mésio-vestibular do 16/26 no sulco vestibular do 36/46.' },
          { label: 'Classes I, II, III', note: 'Relação molar — não é diagnóstico completo.' },
          { label: 'Trespasse', note: 'Horizontal (overjet) e vertical (overbite): 2–4 mm.' },
          { label: 'Curvas', note: 'Spee (sagital) e Wilson (transversal).' },
        ],
      },
    ],
  },
  lessons: [
    {
      id: 'ad-notacao',
      title: 'Notação FDI, faces e terços',
      summary: 'A linguagem que você vai usar em todo prontuário, radiografia e conversa com professor.',
      minutes: 7,
      keyPoints: [
        'FDI usa dois dígitos: o primeiro é o quadrante (1–4 permanentes, 5–8 decíduos), o segundo é a posição a partir da linha média (1–8).',
        'Quadrantes seguem o sentido horário visto de frente: superior direito é 1, superior esquerdo é 2, inferior esquerdo é 3, inferior direito é 4.',
        'Faces: vestibular, lingual (inferior) ou palatina (superior), mesial (voltada para a linha média), distal, oclusal (posteriores) ou incisal (anteriores).',
        'Cada face divide-se em terços — e é assim que se descreve onde está uma lesão ou uma restauração.',
      ],
      sections: [
        {
          heading: 'Como ler um número FDI',
          body: 'O sistema da Fédération Dentaire Internationale foi proposto para ser falado e digitado sem ambiguidade em qualquer idioma.',
          bullets: [
            'Dente 36: quadrante 3 (inferior esquerdo), posição 6 → primeiro molar inferior esquerdo.',
            'Dente 11: incisivo central superior direito. Dente 21: incisivo central superior esquerdo.',
            'Decíduos usam quadrantes 5 a 8 na mesma ordem: 51 é o incisivo central superior direito decíduo; 85 é o segundo molar inferior direito decíduo.',
            'Fala-se "um-um", "três-seis" — nunca "onze" ou "trinta e seis". Isso evita confusão com o sistema universal (1–32).',
          ],
        },
        {
          heading: 'Faces e a lógica mesial–distal',
          bullets: [
            'Mesial é sempre a face mais próxima da linha média do arco; distal, a mais afastada. Para os incisivos centrais, a mesial encosta no central do lado oposto.',
            'Vestibular vale para todos; alguns textos separam labial (anteriores) e bucal (posteriores).',
            'Posteriores têm face oclusal; anteriores têm borda incisal. Restaurações recebem o nome pelas faces envolvidas: MO (mésio-oclusal), MOD, DO.',
            'A face proximal é aquela em contato com o vizinho — o ponto de contato e a ameia (embrasure) protegem a papila gengival.',
          ],
        },
        {
          heading: 'Terços: coordenadas na coroa e na raiz',
          bullets: [
            'Sentido cérvico-oclusal: terço cervical, médio e oclusal (ou incisal).',
            'Sentido mésio-distal: terço mesial, médio e distal. Sentido vestíbulo-lingual: terço vestibular, médio e lingual.',
            'Na raiz: terço cervical, médio e apical — a linguagem da endodontia e da periodontia.',
            'Uma lesão "na face vestibular, terço cervical do 23" localiza exatamente onde olhar e o que radiografar.',
          ],
        },
      ],
      clinicalBridge:
        'No prontuário do Academy o odontograma é FDI. Cada evolução, cada plano de tratamento e cada laudo radiográfico depende de você nomear dente, face e terço sem hesitar.',
      selfCheck: [
        {
          question: 'Qual dente é o 45? E o 65?',
          answer: '45: segundo pré-molar inferior direito (permanente). 65: segundo molar superior esquerdo decíduo (quadrante 6 = superior esquerdo decíduo; posição 5 = segundo molar decíduo).',
        },
        {
          question: 'Um colega diz "a mesial do 21 encosta na mesial do 11". Está certo?',
          answer: 'Sim. Os dois incisivos centrais superiores se tocam pelas faces mesiais, uma de cada lado da linha média.',
        },
        {
          question: 'Como descrever uma cárie na face palatina, perto da gengiva, do incisivo lateral superior esquerdo?',
          answer: 'Lesão na face palatina, terço cervical, do dente 22.',
        },
      ],
      refIds: ['keiser-1971', 'peck-1993'],
    },
    {
      id: 'ad-morfologia',
      title: 'Morfologia das coroas: como identificar cada grupo',
      summary: 'Os traços que fazem você reconhecer um dente solto na bancada — e enxergar a anatomia antes de esculpir.',
      minutes: 10,
      keyPoints: [
        'Cada grupo tem uma função e uma forma: incisivos cortam, caninos rasgam, pré-molares transitam, molares trituram.',
        'O primeiro molar superior tem quatro cúspides principais, ponte de esmalte entre mésio-palatina e disto-vestibular e frequentemente o tubérculo de Carabelli.',
        'O primeiro molar inferior tem cinco cúspides (três vestibulares) e duas raízes bem separadas; o segundo tem quatro cúspides com sulcos em cruz.',
        'Traços variam entre pessoas — a anatomia é padrão estatístico, não regra absoluta.',
      ],
      sections: [
        {
          heading: 'Anteriores: incisivos e caninos',
          bullets: [
            'Incisivos centrais superiores: coroa trapezoidal, borda incisal reta, cíngulo palatino bem marcado, ângulo mesial mais reto e distal mais arredondado.',
            'Incisivos laterais superiores: menores, mais arredondados, com maior variação (conoides, agenesia). Incisivos inferiores: os menores da boca, quase simétricos.',
            'Mamelões: três lobos na borda incisal de dentes recém-erupcionados, desgastados com a função.',
            'Caninos: uma cúspide com crista longitudinal, raiz mais longa do arco (o "pilar" do canto da boca) e forte cíngulo. Superior mais robusto; inferior mais estreito e alto.',
          ],
        },
        {
          heading: 'Pré-molares: a transição',
          bullets: [
            'Primeiro pré-molar superior: duas cúspides quase iguais, sulco mesial que cruza a crista marginal e concavidade na face mesial da raiz. Costuma ter duas raízes.',
            'Segundo pré-molar superior: cúspides mais parelhas, raiz única, sem o sulco mesial.',
            'Primeiro pré-molar inferior: cúspide vestibular dominante e lingual pequena — parece um canino. Crista transversal une as duas.',
            'Segundo pré-molar inferior: pode ter duas ou três cúspides (padrões em "U", "H" ou "Y").',
          ],
        },
        {
          heading: 'Molares: os moinhos',
          bullets: [
            'Primeiro molar superior: forma romboide, quatro cúspides (mésio-palatina é a maior), crista oblíqua (ponte de esmalte) e tubérculo de Carabelli em parte da população. Três raízes: duas vestibulares, uma palatina.',
            'Segundo molar superior: cúspide disto-palatina reduzida; forma mais triangular. Terceiro molar: o mais variável.',
            'Primeiro molar inferior: cinco cúspides (três vestibulares, duas linguais), duas raízes (mesial e distal). Segundo molar inferior: quatro cúspides em cruz.',
            'Molares decíduos: coroas bulbosas, colo constrito, raízes divergentes e finas para abrigar o germe do sucessor.',
          ],
        },
      ],
      clinicalBridge:
        'Esculpir em cera, restaurar uma oclusal ou ler uma panorâmica começam na mesma pergunta: como esse dente deveria ser? Quem reconhece cúspides e sulcos restaura anatomia, não só fecha buraco.',
      selfCheck: [
        {
          question: 'Como diferenciar um primeiro de um segundo pré-molar superior?',
          answer: 'O primeiro tem sulco mesial cruzando a crista marginal, concavidade mesial da raiz e frequentemente duas raízes; o segundo tem raiz única, cúspides mais parelhas e não tem o sulco mesial.',
        },
        {
          question: 'O que é a crista oblíqua e em que dente ela aparece?',
          answer: 'É a ponte de esmalte que une a cúspide mésio-palatina à disto-vestibular no primeiro molar superior. Preservá-la em restaurações mantém a resistência da coroa.',
        },
        {
          question: 'Quantas cúspides tem o primeiro molar inferior e quantas são vestibulares?',
          answer: 'Cinco cúspides, três delas vestibulares (mésio, médio e disto-vestibular) e duas linguais.',
        },
      ],
      refIds: ['kondo-2006'],
    },
    {
      id: 'ad-cronologia',
      title: 'Cronologia de erupção e dentição mista',
      summary: 'As idades que você precisa ter na cabeça para saber o que é normal em uma criança.',
      minutes: 8,
      keyPoints: [
        'Dentição decídua: 20 dentes, erupção de aproximadamente 6 a 30 meses, começando pelos incisivos centrais inferiores.',
        'Dentição permanente começa por volta dos 6 anos com os primeiros molares e incisivos centrais inferiores; termina com os terceiros molares (17–21 anos).',
        'Dentição mista (6–12 anos) é a fase de decíduos e permanentes convivendo — o momento das maiores dúvidas dos pais.',
        'Sequência importa mais do que idade exata: assimetria maior que 6 meses entre lados merece investigação.',
      ],
      sections: [
        {
          heading: 'Decíduos: a primeira dentição',
          bullets: [
            'Ordem aproximada: incisivos centrais inferiores (6–10 m), centrais superiores (8–12 m), laterais (9–13 m), primeiros molares (13–19 m), caninos (16–23 m), segundos molares (23–33 m).',
            'Aos 3 anos a dentição decídua costuma estar completa, com espaços fisiológicos (diastemas) que serão usados na troca.',
            'A formação começa na vida intrauterina: mineralização dos decíduos a partir da 14ª semana. Por isso doenças da gestação podem marcar o esmalte.',
          ],
        },
        {
          heading: 'Permanentes: a sequência',
          bullets: [
            'Por volta de 6–7 anos: primeiros molares ("molares dos 6 anos") e incisivos centrais inferiores. 7–9 anos: demais incisivos.',
            '9–12 anos: caninos e pré-molares. Caninos superiores costumam ser os últimos anteriores (11–12 anos) — daí a impactação frequente.',
            '11–13 anos: segundos molares. 17–21 anos: terceiros molares, se erupcionarem.',
            'Inferiores tendem a erupcionar antes dos superiores; meninas costumam estar um pouco à frente dos meninos.',
          ],
        },
        {
          heading: 'Dentição mista e espaço',
          bullets: [
            'Os pré-molares são menores que os molares decíduos que substituem: a diferença (leeway space) ajuda a acomodar o apinhamento dos incisivos.',
            'Perda precoce de um molar decíduo pode fechar esse espaço e comprometer a erupção do sucessor — daí a importância de manter decíduos saudáveis.',
            'Incisivos permanentes erupcionam mais para lingual e depois se posicionam ("patinho feio" é fase normal com diastema entre centrais superiores até a erupção dos caninos).',
            'O London Atlas (AlQahtani 2010) é a referência visual moderna para estimar idade dental por estágio de formação.',
          ],
        },
      ],
      clinicalBridge:
        'Quando um responsável perguntar se "esse dente já devia ter caído", você responde com sequência e faixa etária — e sabe quando pedir uma radiografia para investigar um sucessor ausente.',
      selfCheck: [
        {
          question: 'Quais são os primeiros dentes permanentes a erupcionar e com que idade?',
          answer: 'Os primeiros molares permanentes e os incisivos centrais inferiores, por volta de 6–7 anos. Os primeiros molares erupcionam atrás dos segundos molares decíduos, sem substituir ninguém.',
        },
        {
          question: 'Por que o canino superior é frequentemente impactado?',
          answer: 'Porque é um dos últimos anteriores a erupcionar (11–12 anos), percorre um trajeto longo e chega quando o espaço no arco já pode estar tomado.',
        },
        {
          question: 'O que é leeway space?',
          answer: 'A diferença de tamanho entre canino e molares decíduos e seus sucessores permanentes (canino e pré-molares), que sobra ao final da troca e ajuda a alinhar os incisivos.',
        },
      ],
      refIds: ['alqahtani-2010', 'bishara-1997'],
    },
    {
      id: 'ad-oclusao',
      title: 'Oclusão estática: as relações básicas',
      summary: 'Chave de Angle, trespasses e curvas — o vocabulário que a ortodontia, a prótese e a dentística vão exigir.',
      minutes: 9,
      keyPoints: [
        'Chave de Angle: cúspide mésio-vestibular do primeiro molar superior ocluindo no sulco vestibular do primeiro molar inferior.',
        'Classe I: relação molar normal; Classe II: molar inferior distalizado; Classe III: molar inferior mesializado. É relação molar, não diagnóstico completo.',
        'Trespasse horizontal (overjet) e vertical (overbite) normais giram em torno de 2–4 mm.',
        'A evidência atual questiona a "oclusão ideal" como causa de disfunção; conceitos mecânicos rígidos foram revistos.',
      ],
      sections: [
        {
          heading: 'Oclusão em máxima intercuspidação',
          bullets: [
            'Máxima intercuspidação habitual (MIH): posição em que os dentes encaixam com máximo contato. Relação cêntrica (RC): posição articular, condilar — independente de dentes.',
            'Cada dente posterior oclui com dois antagonistas (exceto incisivos centrais inferiores e terceiros molares superiores). Os inferiores ficam ligeiramente mesializados em relação aos superiores.',
            'Cúspides de suporte (cêntricas): palatinas superiores e vestibulares inferiores — recebem carga axial. Cúspides de guia: vestibulares superiores e linguais inferiores.',
          ],
        },
        {
          heading: 'Classificação de Angle e trespasses',
          bullets: [
            'Classe I: chave molar presente; problemas restritos a dentes (apinhamento, diastemas). Classe II: molar inferior para distal — divisão 1 (incisivos protruídos) e divisão 2 (incisivos verticalizados). Classe III: molar inferior para mesial.',
            'Relação canina: cúspide do canino superior entre canino e primeiro pré-molar inferior.',
            'Overjet: distância horizontal entre bordas incisais; overbite: sobreposição vertical (cerca de 1/3 da coroa do inferior). Mordida aberta e mordida profunda são os desvios.',
            'Mordida cruzada: dentes superiores por dentro dos inferiores (anterior ou posterior).',
          ],
        },
        {
          heading: 'Curvas e guias',
          bullets: [
            'Curva de Spee: curvatura no plano sagital, das pontas de cúspide dos posteriores inferiores. Curva de Wilson: curvatura transversal.',
            'Guia anterior: contato dos incisivos que separa os posteriores na protrusão (desoclusão). Guia canina ou função em grupo na lateralidade.',
            'Türp e colaboradores (2008) lembram que muitos dogmas oclusais vieram da prótese mecânica; disfunção temporomandibular é multifatorial e oclusão não é o centro.',
          ],
        },
      ],
      clinicalBridge:
        'Você vai checar oclusão em toda restauração, avaliar pontos de contato com papel carbono e descrever a relação molar no exame ortodôntico. Sem esse vocabulário não dá para conversar com o professor de prótese.',
      selfCheck: [
        {
          question: 'Descreva a chave de Angle.',
          answer: 'A cúspide mésio-vestibular do primeiro molar superior oclui no sulco vestibular (entre as cúspides mésio e médio-vestibular) do primeiro molar inferior.',
        },
        {
          question: 'Qual a diferença entre relação cêntrica e máxima intercuspidação?',
          answer: 'RC é posição articular (côndilos na posição mais superior e anterior na fossa), independente dos dentes. MIH é posição dental — o encaixe de máximo contato. Podem não coincidir.',
        },
        {
          question: 'Quais cúspides recebem a carga axial na oclusão?',
          answer: 'As cúspides de suporte: palatinas dos superiores e vestibulares dos inferiores.',
        },
      ],
      refIds: ['angle-1899', 'turp-2008'],
    },
  ],
};
