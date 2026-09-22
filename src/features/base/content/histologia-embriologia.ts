import type { BaseDiscipline } from '../types';

export const histologiaEmbriologia: BaseDiscipline = {
  id: 'histologia-embriologia',
  title: 'Histologia e embriologia oral',
  short: 'Histologia',
  tagline: 'Odontogênese, esmalte, dentina, polpa e periodonto',
  period: 2,
  colaTopic: 'endodontia',
  references: [
    {
      id: 'thesleff-2003',
      authors: 'Thesleff I',
      title: 'Epithelial-mesenchymal signalling regulating tooth morphogenesis',
      journal: 'Journal of Cell Science',
      year: 2003,
      doi: '10.1242/jcs.00410',
      why: 'Resumo clássico da sinalização epitélio–mesênquima que dirige a formação do dente.',
    },
    {
      id: 'jussila-2012',
      authors: 'Jussila M, Thesleff I',
      title: 'Signaling networks regulating tooth organogenesis and regeneration, and the specification of dental mesenchymal and epithelial cell lineages',
      journal: 'Cold Spring Harbor Perspectives in Biology',
      year: 2012,
      doi: '10.1101/cshperspect.a008425',
      why: 'Atualiza as redes de sinalização (Wnt, BMP, FGF, Shh) e o papel do nó do esmalte.',
    },
    {
      id: 'simmer-2001',
      authors: 'Simmer JP, Hu JC',
      title: 'Dental enamel formation and its impact on clinical dentistry',
      journal: 'Journal of Dental Education',
      year: 2001,
      url: 'https://pubmed.ncbi.nlm.nih.gov/11569606/',
      why: 'Explica a amelogênese e por que o esmalte não se regenera.',
    },
    {
      id: 'goldberg-2011',
      authors: 'Goldberg M, Kulkarni AB, Young M, Boskey A',
      title: 'Dentin: structure, composition and mineralization',
      journal: 'Frontiers in Bioscience (Elite Edition)',
      year: 2011,
      doi: '10.2741/e281',
      why: 'Estrutura da dentina, túbulos e tipos de dentina (primária, secundária, terciária).',
    },
    {
      id: 'bosshardt-2005',
      authors: 'Bosshardt DD, Lang NP',
      title: 'The junctional epithelium: from health to disease',
      journal: 'Journal of Dental Research',
      year: 2005,
      doi: '10.1177/154405910508400102',
      why: 'O epitélio juncional como barreira e o que acontece quando ele migra.',
    },
    {
      id: 'nanci-2017',
      authors: 'Nanci A',
      title: "Ten Cate's Oral Histology: Development, Structure, and Function (9ª ed.)",
      journal: 'Elsevier — livro-texto',
      year: 2017,
      url: 'https://www.elsevier.com/books/ten-cates-oral-histology/nanci/978-0-323-48524-1',
      why: 'Texto-base da disciplina, referência para a organização das zonas da polpa e do ligamento.',
    },
  ],
  mindMap: {
    label: 'Histologia oral',
    children: [
      {
        label: 'Odontogênese',
        children: [
          { label: 'Lâmina dentária', note: '6ª semana intrauterina. Epitélio + ectomesênquima.' },
          { label: 'Botão → capuz → campânula', note: 'Morfogênese guiada pelo nó do esmalte.' },
          { label: 'Bainha de Hertwig', note: 'Modela a raiz. Restos de Malassez.' },
        ],
      },
      {
        label: 'Esmalte',
        children: [
          { label: '96% mineral', note: 'Hidroxiapatita em prismas.' },
          { label: 'Ameloblastos', note: 'Perdidos na erupção: não regenera.' },
          { label: 'Estrias de Retzius', note: 'Ritmo de formação. Linha neonatal.' },
        ],
      },
      {
        label: 'Dentina–polpa',
        children: [
          { label: '70% mineral', note: 'Túbulos com prolongamentos dos odontoblastos.' },
          { label: 'Odontoblastos vivos', note: 'Dentina secundária e terciária.' },
          { label: 'Zonas da polpa', note: 'Odontoblástica, pobre em células, rica em células, núcleo.' },
        ],
      },
      {
        label: 'Periodonto',
        children: [
          { label: 'Gengiva', note: 'Epitélio juncional: barreira com alto turnover.' },
          { label: 'Ligamento', note: 'Fibras de Sharpey em cemento e osso.' },
          { label: 'Cemento', note: 'Acelular (cervical) e celular (apical).' },
          { label: 'Osso alveolar', note: 'Fasciculado onde o ligamento insere.' },
        ],
      },
    ],
  },
  lessons: [
    {
      id: 'he-odontogenese',
      title: 'Odontogênese: do botão à raiz',
      summary: 'Como um espessamento do epitélio vira um dente — e o que sobra desse processo para dar problema depois.',
      minutes: 9,
      keyPoints: [
        'O dente nasce da interação entre epitélio oral (origem do esmalte) e ectomesênquima da crista neural (dentina, polpa, cemento, ligamento).',
        'Estágios: lâmina dentária (6ª semana) → botão → capuz → campânula → formação de raiz.',
        'O nó do esmalte é o centro de sinalização (Shh, BMP, FGF, Wnt) que define o número e a posição das cúspides.',
        'A bainha epitelial de Hertwig molda a raiz; seus restos (restos epiteliais de Malassez) podem originar cistos.',
      ],
      sections: [
        {
          heading: 'Início e estágios',
          bullets: [
            'Por volta da 6ª semana, a lâmina dentária espessa o epitélio oral. Em 10 pontos por arco brotam os germes dos decíduos; os permanentes surgem da lâmina sucessional (e, para molares, da extensão distal).',
            'Botão: proliferação epitelial com condensação do ectomesênquima ao redor. Capuz: o epitélio se invagina formando o órgão do esmalte; abaixo, a papila dentária; em volta, o folículo.',
            'Campânula: histodiferenciação — epitélio interno do esmalte vira pré-ameloblastos; células da papila em contato viram odontoblastos. A forma da coroa fica definida aqui.',
          ],
        },
        {
          heading: 'Sinais que dirigem a forma',
          bullets: [
            'Sinalização recíproca: primeiro o epitélio instrui o mesênquima; depois o mesênquima passa a dirigir o epitélio (Thesleff 2003).',
            'Nó do esmalte primário (capuz) e nós secundários (campânula) marcam onde nascem as cúspides — um sinal a mais, uma cúspide a mais.',
            'Vias Wnt, BMP, FGF e Shh explicam agenesias (por exemplo, mutações em PAX9 e MSX1) e dentes supranumerários.',
          ],
        },
        {
          heading: 'Raiz e o que fica para trás',
          bullets: [
            'A bainha epitelial de Hertwig cresce apicalmente e induz a dentina radicular; ao se fragmentar, permite que células do folículo formem cemento.',
            'Restos epiteliais de Malassez ficam no ligamento periodontal — são a fonte de cistos radiculares diante de inflamação periapical.',
            'Pérolas de Serres (restos da lâmina dentária) e cistos de erupção são outros remanescentes com nome próprio.',
            'Dentinogênese começa antes da amelogênese; a dentina do manto é a primeira camada, seguida pela dentina circumpulpar.',
          ],
        },
      ],
      clinicalBridge:
        'Cisto radicular, dens in dente, agenesia de lateral: todo diagnóstico de anomalia é uma história de desenvolvimento que deu certo ou errado. Você vai ler isso em radiografia.',
      selfCheck: [
        {
          question: 'Qual estrutura define quantas cúspides um dente terá?',
          answer: 'Os nós do esmalte (primário e secundários), centros de sinalização no epitélio que marcam onde a coroa se dobra em cúspide.',
        },
        {
          question: 'De onde vêm dentina, polpa e ligamento periodontal?',
          answer: 'Do ectomesênquima derivado da crista neural. Só o esmalte tem origem epitelial.',
        },
        {
          question: 'Por que um cisto radicular tem revestimento epitelial se o ligamento é conjuntivo?',
          answer: 'Porque os restos epiteliais de Malassez, remanescentes da bainha de Hertwig, permanecem no ligamento e proliferam sob estímulo inflamatório.',
        },
      ],
      refIds: ['thesleff-2003', 'jussila-2012'],
    },
    {
      id: 'he-esmalte-dentina',
      title: 'Esmalte e dentina: por que um não regenera e o outro reage',
      summary: 'Os dois tecidos que você vai cortar, condicionar e tentar preservar por toda a carreira.',
      minutes: 10,
      keyPoints: [
        'Esmalte: ~96% mineral (hidroxiapatita), organizado em prismas; formado por ameloblastos que morrem na erupção — sem células, sem regeneração.',
        'Dentina: ~70% mineral, 20% orgânica (colágeno tipo I), 10% água; atravessada por túbulos com prolongamentos de odontoblastos vivos.',
        'Dentina primária (até completar a raiz), secundária (lenta, a vida toda, reduz a câmara) e terciária (reacional ou reparadora, resposta a agressão).',
        'Túbulos são mais numerosos e largos perto da polpa: quanto mais fundo o preparo, mais permeável e mais sensível.',
      ],
      sections: [
        {
          heading: 'Esmalte',
          bullets: [
            'Amelogênese: fase secretora (matriz de amelogenina), fase de maturação (remoção da proteína, entrada de mineral). Distúrbios geram hipoplasia (defeito de quantidade) ou hipomineralização (defeito de qualidade).',
            'Prismas em "buraco de fechadura" correm da junção amelodentinária à superfície; a direção importa para o corte (bisel) e para o condicionamento ácido.',
            'Estrias de Retzius marcam o ritmo incremental; a linha neonatal registra o nascimento. Lamelas, tufos e fusos são defeitos estruturais que facilitam a difusão de ácido.',
            'Superfície: esmalte aprismático em decíduos e áreas cervicais — mais resistente ao condicionamento, exige tempo maior.',
          ],
        },
        {
          heading: 'Dentina e túbulos',
          bullets: [
            'Odontoblastos alinham-se na periferia da polpa e mantêm prolongamento no túbulo; o fluido dentinário preenche o restante.',
            'Dentina peritubular (muito mineralizada, ao redor do túbulo) e intertubular (entre túbulos, mais colágeno). Esclerose dentinária fecha túbulos com a idade ou sob estímulo lento.',
            'Densidade tubular: ~20 mil/mm² perto do esmalte, ~45 mil/mm² perto da polpa. Permeabilidade e sensibilidade aumentam com a profundidade.',
            'Junção amelodentinária é festonada e resiste à propagação de trincas.',
          ],
        },
        {
          heading: 'Como a dentina responde',
          bullets: [
            'Dentina secundária: fisiológica, deposita-se principalmente no teto e assoalho da câmara — daí câmaras menores em idosos.',
            'Dentina terciária reacional: pelos odontoblastos originais, diante de estímulo leve (cárie lenta, atrição). Reparadora: por células recém-diferenciadas quando os odontoblastos morrem (cárie rápida, preparo profundo).',
            'Dentina afetada (desmineralizada, colágeno íntegro) pode remineralizar e deve ser preservada; dentina infectada (colágeno desnaturado, bactérias) é removida.',
          ],
        },
      ],
      clinicalBridge:
        'Condicionamento ácido, sensibilidade pós-operatória, remoção seletiva de cárie e capeamento pulpar são respostas diretas a esta histologia. Quem entende o túbulo entende a dor.',
      selfCheck: [
        {
          question: 'Por que o esmalte não se regenera e a dentina sim?',
          answer: 'Os ameloblastos são perdidos quando o dente erupciona; a dentina mantém odontoblastos vivos na periferia da polpa, capazes de depositar dentina secundária e terciária.',
        },
        {
          question: 'Qual a diferença entre dentina terciária reacional e reparadora?',
          answer: 'Reacional é produzida pelos odontoblastos originais diante de estímulo moderado; reparadora é produzida por células novas diferenciadas da polpa depois que os odontoblastos morreram, sob agressão intensa.',
        },
        {
          question: 'Como a profundidade do preparo muda a permeabilidade da dentina?',
          answer: 'Perto da polpa os túbulos são mais numerosos e largos, então a dentina profunda é muito mais permeável e sensível — é aí que proteção pulpar e adesão cuidadosa importam.',
        },
      ],
      refIds: ['simmer-2001', 'goldberg-2011'],
    },
    {
      id: 'he-polpa-periodonto',
      title: 'Polpa, periodonto e mucosa: os tecidos vivos ao redor',
      summary: 'As zonas da polpa, as fibras do ligamento e a barreira gengival que separa biofilme de osso.',
      minutes: 9,
      keyPoints: [
        'Polpa: zona odontoblástica, zona pobre em células (Weil), zona rica em células e núcleo central; tecido conjuntivo frouxo dentro de paredes rígidas — pouca complacência, dor intensa.',
        'Ligamento periodontal: fibras colágenas (grupos crista alveolar, horizontal, oblíquo, apical, interradicular) inseridas como fibras de Sharpey em cemento e osso.',
        'Cemento acelular cobre o terço cervical e médio; cemento celular, o apical. Osso alveolar fasciculado recebe as fibras.',
        'Epitélio juncional: 15–30 células de espessura, hemidesmossomos, renovação em ~5 dias — a barreira que a periodontite destrói.',
      ],
      sections: [
        {
          heading: 'Polpa',
          bullets: [
            'Vasos entram pelo forame apical e por canais acessórios; circulação terminal e sem drenagem colateral efetiva — inflamação aumenta pressão e comprime vasos.',
            'Fibras nervosas Aδ (mielinizadas, dor aguda localizada) na periferia e fibras C (amielínicas, dor difusa) no centro — base dos testes de sensibilidade.',
            'Funções: formadora (dentina), nutritiva, sensorial e defensiva. Com a idade: menos células, mais fibras, câmaras menores, calcificações.',
          ],
        },
        {
          heading: 'Periodonto de sustentação',
          bullets: [
            'Ligamento com 0,15–0,38 mm de espessura; rico em fibroblastos, células de Malassez, cementoblastos, osteoblastos e mecanorreceptores.',
            'Grupos de fibras: crista alveolar (resiste à extrusão), horizontais (resistem ao deslocamento lateral), oblíquas (as mais numerosas, resistem à intrusão), apicais e interradiculares.',
            'Cemento: acelular de fibras extrínsecas (inserção), celular de fibras intrínsecas (adaptação apical). Não se remodela como osso — por isso reabsorções radiculares são lentas de reparar.',
            'Osso alveolar: lâmina dura na radiografia corresponde ao osso fasciculado; o espaço radiolúcido fino é o ligamento.',
          ],
        },
        {
          heading: 'Gengiva e mucosa',
          bullets: [
            'Mucosa mastigatória (gengiva e palato duro) é queratinizada; mucosa de revestimento (bochecha, lábio, assoalho) não; mucosa especializada no dorso da língua (papilas).',
            'Gengiva: epitélio oral (queratinizado), epitélio do sulco (não queratinizado) e epitélio juncional (não queratinizado, permeável, com espaços intercelulares largos que permitem migração de neutrófilos).',
            'O epitélio juncional adere ao esmalte por hemidesmossomos e lâmina basal interna; ao ser destruído, migra apicalmente formando bolsa. Espaço biológico (~2 mm) é a soma do epitélio juncional e da inserção conjuntiva.',
          ],
        },
      ],
      clinicalBridge:
        'Sondagem periodontal, teste de vitalidade e leitura da lâmina dura são a histologia desta lição vista de fora. Restauração invadindo o espaço biológico é inflamação crônica garantida.',
      selfCheck: [
        {
          question: 'Por que a pulpite dói tanto?',
          answer: 'A polpa está em uma câmara rígida com circulação terminal; o edema inflamatório aumenta a pressão intrapulpar, comprime vasos e estimula fibras nociceptivas sem espaço para expansão.',
        },
        {
          question: 'Qual grupo de fibras do ligamento é o mais numeroso e o que ele resiste?',
          answer: 'As fibras oblíquas, que correm do osso (mais coronal) ao cemento (mais apical) e resistem às forças de intrusão da mastigação.',
        },
        {
          question: 'O que é o espaço biológico e por que uma margem de restauração não pode invadi-lo?',
          answer: 'É a dimensão do epitélio juncional mais a inserção conjuntiva (cerca de 2 mm) acima da crista óssea. Margem dentro dele impede a reformação da inserção e mantém inflamação crônica.',
        },
      ],
      refIds: ['bosshardt-2005', 'nanci-2017'],
    },
  ],
};
