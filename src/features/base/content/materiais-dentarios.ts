import type { BaseDiscipline } from '../types';

export const materiaisDentarios: BaseDiscipline = {
  id: 'materiais-dentarios',
  title: 'Materiais dentários',
  short: 'Materiais',
  tagline: 'Adesão, resinas compostas, ionômero e biocerâmicos',
  period: 4,
  colaTopic: 'materiais-dentarios',
  references: [
    {
      id: 'buonocore-1955',
      authors: 'Buonocore MG',
      title: 'A simple method of increasing the adhesion of acrylic filling materials to enamel surfaces',
      journal: 'Journal of Dental Research',
      year: 1955,
      doi: '10.1177/00220345550340060801',
      why: 'O artigo que inventou o condicionamento ácido do esmalte.',
    },
    {
      id: 'nakabayashi-1982',
      authors: 'Nakabayashi N, Kojima K, Masuhara E',
      title: 'The promotion of adhesion by the infiltration of monomers into tooth substrates',
      journal: 'Journal of Biomedical Materials Research',
      year: 1982,
      doi: '10.1002/jbm.820160307',
      why: 'Descreve a camada híbrida — a base da adesão à dentina.',
    },
    {
      id: 'pashley-2011',
      authors: 'Pashley DH, Tay FR, Breschi L, Tjäderhane L, Carvalho RM, Carrilho M, Tezvergil-Mutluay A',
      title: 'State of the art etch-and-rinse adhesives',
      journal: 'Dental Materials',
      year: 2011,
      doi: '10.1016/j.dental.2010.10.016',
      why: 'Revisão dos adesivos convencionais e da degradação da camada híbrida.',
    },
    {
      id: 'vanmeerbeek-2011',
      authors: 'Van Meerbeek B, Yoshihara K, Yoshida Y, Mine A, De Munck J, Van Landuyt KL',
      title: 'State of the art of self-etch adhesives',
      journal: 'Dental Materials',
      year: 2011,
      doi: '10.1016/j.dental.2010.10.023',
      why: 'Autocondicionantes, universais e a recomendação de condicionar seletivamente o esmalte.',
    },
    {
      id: 'ferracane-2011',
      authors: 'Ferracane JL',
      title: 'Resin composite — State of the art',
      journal: 'Dental Materials',
      year: 2011,
      doi: '10.1016/j.dental.2010.10.020',
      why: 'Composição, contração e desempenho das resinas compostas.',
    },
    {
      id: 'price-2015',
      authors: 'Price RB, Ferracane JL, Shortall AC',
      title: 'Light-Curing Units: A Review of What We Need to Know',
      journal: 'Journal of Dental Research',
      year: 2015,
      doi: '10.1177/0022034515594786',
      why: 'Fotoativação: irradiância, tempo, distância e erros comuns.',
    },
    {
      id: 'vanende-2017',
      authors: 'Van Ende A, De Munck J, Lise DP, Van Meerbeek B',
      title: 'Bulk-Fill Composites: A Review of the Current Literature',
      journal: 'The Journal of Adhesive Dentistry',
      year: 2017,
      doi: '10.3290/j.jad.a38141',
      why: 'O que muda (e o que não muda) com resinas bulk-fill.',
    },
    {
      id: 'sidhu-2016',
      authors: 'Sidhu SK, Nicholson JW',
      title: 'A Review of Glass-Ionomer Cements for Clinical Dentistry',
      journal: 'Journal of Functional Biomaterials',
      year: 2016,
      doi: '10.3390/jfb7030016',
      why: 'Química, propriedades e indicações do ionômero de vidro.',
    },
    {
      id: 'frencken-2012',
      authors: 'Frencken JE, Peters MC, Manton DJ, Leal SC, Gordan VV, Eden E',
      title: 'Minimal intervention dentistry for managing dental caries — a review: report of a FDI task group',
      journal: 'International Dental Journal',
      year: 2012,
      doi: '10.1111/idj.12007',
      why: 'ART e odontologia de mínima intervenção com ionômero de alta viscosidade.',
    },
    {
      id: 'parirokh-2010',
      authors: 'Parirokh M, Torabinejad M',
      title: 'Mineral trioxide aggregate: a comprehensive literature review — Part I: chemical, physical, and antibacterial properties',
      journal: 'Journal of Endodontics',
      year: 2010,
      doi: '10.1016/j.joen.2009.09.006',
      why: 'Propriedades do MTA, base dos biocerâmicos para proteção pulpar.',
    },
  ],
  mindMap: {
    label: 'Materiais',
    children: [
      {
        label: 'Adesão',
        children: [
          { label: 'Esmalte', note: 'Ácido fosfórico 37%, 15–30 s. Microrretenção.' },
          { label: 'Dentina', note: 'Camada híbrida: colágeno + monômero.' },
          { label: 'Etch-and-rinse', note: 'Condiciona, lava, dentina úmida.' },
          { label: 'Self-etch / universal', note: 'Menos sensível à técnica. Condicione o esmalte.' },
        ],
      },
      {
        label: 'Resina composta',
        children: [
          { label: 'Matriz + carga + silano', note: 'Bis-GMA, UDMA, TEGDMA · nanohíbrida.' },
          { label: 'Contração 1,5–3%', note: 'Incrementos ≤ 2 mm · bulk-fill 4–5 mm.' },
          { label: 'Fotoativação', note: '≥ 1000 mW/cm² · 20–40 s · perto e perpendicular.' },
        ],
      },
      {
        label: 'Ionômero de vidro',
        children: [
          { label: 'Ácido-base', note: 'Poliácido + vidro. Adesão química.' },
          { label: 'Libera flúor', note: 'E recarrega.' },
          { label: 'Sensível à umidade', note: 'Proteger nas primeiras 24 h.' },
          { label: 'ART', note: 'Alta viscosidade sem motor.' },
        ],
      },
      {
        label: 'Proteção pulpar',
        children: [
          { label: 'Hidróxido de cálcio', note: 'Alcalino, solúvel.' },
          { label: 'MTA / biocerâmicos', note: 'pH 12,5, sela, induz ponte de dentina.' },
        ],
      },
    ],
  },
  lessons: [
    {
      id: 'md-adesao',
      title: 'Adesão ao esmalte e à dentina: a camada híbrida',
      summary: 'Por que o ácido, por que a dentina úmida, e o que os adesivos universais mudaram.',
      minutes: 9,
      keyPoints: [
        'Esmalte: ácido fosfórico 30–40% por 15–30 s dissolve seletivamente os prismas e cria microporosidades; o adesivo penetra e forma tags — retenção micromecânica confiável (Buonocore 1955).',
        'Dentina: o ácido remove a smear layer e desmineraliza 3–5 µm, expondo colágeno; o monômero infiltra e forma a camada híbrida (Nakabayashi 1982). Colágeno colapsado (dentina seca demais) não é infiltrado.',
        'Etch-and-rinse (3 ou 2 passos): mais sensível à técnica, ótimo em esmalte. Self-etch/universal (1–2 passos): menos sensível, mas mais fraco em esmalte não condicionado → condicionamento seletivo do esmalte (Van Meerbeek 2011).',
        'A camada híbrida degrada com o tempo por hidrólise e por metaloproteinases da própria dentina; clorexidina 2% e adesivos com MDP ajudam a retardar.',
      ],
      sections: [
        {
          heading: 'Esmalte: o substrato fácil',
          bullets: [
            'Esmalte é 96% mineral e seco: o ácido cria padrão de condicionamento tipo I (dissolve o centro do prisma) ou II (periferia), com microporosidades de 5–50 µm.',
            'Tempo: 15–30 s para esmalte permanente; esmalte aprismático (decíduo, cervical) pode exigir 30–60 s. Lavar pelo mesmo tempo e secar até aspecto branco fosco.',
            'Bisel em esmalte aumenta a área e expõe os prismas em corte transversal, melhorando a retenção em restaurações de classe IV.',
          ],
        },
        {
          heading: 'Dentina: o substrato vivo e úmido',
          bullets: [
            'Smear layer (0,5–2 µm de detritos do corte) precisa ser removida (etch-and-rinse) ou incorporada/modificada (self-etch).',
            'Depois do ácido, a dentina desmineralizada é uma rede de colágeno mantida aberta pela água. Secar com ar colapsa a rede e impede a infiltração → adesão baixa. "Dentina úmida" (wet bonding): remover excesso de água com papel absorvente ou leve jato, deixando aspecto brilhante.',
            'Primer (HEMA em solvente) desloca a água; adesivo (Bis-GMA/UDMA) infiltra e copolimeriza; a camada híbrida sela os túbulos e é a barreira contra sensibilidade pós-operatória.',
            'Dentina esclerótica, cariada afetada ou profunda tem menos colágeno disponível/mais fluido — adesão menor; considerar CIV como base em lesões profundas.',
          ],
        },
        {
          heading: 'Sistemas adesivos hoje',
          bullets: [
            'Etch-and-rinse 3 passos (ácido, primer, adesivo) segue como padrão-ouro em laboratório; 2 passos (ácido, primer+adesivo) é o mais usado.',
            'Self-etch 2 passos (primer ácido, adesivo) e 1 passo (tudo junto); pH "leve" (~2) desmineraliza parcialmente e mantém hidroxiapatite ao redor do colágeno, permitindo ligação química do 10-MDP ao cálcio.',
            'Universais: podem ser usados em etch-and-rinse, self-etch ou condicionamento seletivo; a recomendação é condicionar seletivamente o esmalte por 15 s e aplicar self-etch na dentina.',
            'Erros comuns: condicionar dentina por tempo excessivo (desmineraliza mais do que o adesivo alcança), não evaporar bem o solvente (esfregar e soprar 5–10 s), camada de adesivo fina demais (falta de polimerização por inibição de oxigênio).',
          ],
        },
      ],
      clinicalBridge:
        'Sua primeira restauração adesiva em manequim e depois no paciente segue exatamente esta ordem. Sensibilidade pós-operatória quase sempre é um passo desta lição feito errado.',
      selfCheck: [
        {
          question: 'Por que secar a dentina condicionada com jato de ar prejudica a adesão?',
          answer: 'Porque a rede de colágeno exposta colapsa sem a água que a mantinha aberta; o monômero não consegue infiltrar entre as fibras e a camada híbrida fica incompleta.',
        },
        {
          question: 'Como usar um adesivo universal em uma classe II?',
          answer: 'Condicionamento seletivo: ácido fosfórico apenas no esmalte por 15 s, lavar, secar; aplicar o universal em esmalte e dentina no modo autocondicionante, esfregar, evaporar o solvente e fotoativar.',
        },
        {
          question: 'O que degrada a camada híbrida ao longo dos anos?',
          answer: 'Hidrólise dos polímeros e do colágeno não infiltrado, e a ação de metaloproteinases (MMP-2, -8, -9) e catepsinas da própria dentina ativadas pelo ácido. Inibidores (clorexidina) e adesivos mais hidrofóbicos retardam.',
        },
      ],
      refIds: ['buonocore-1955', 'nakabayashi-1982', 'pashley-2011', 'vanmeerbeek-2011'],
    },
    {
      id: 'md-resina-composta',
      title: 'Resinas compostas: composição, contração e fotoativação',
      summary: 'O que está no tubo, por que encolhe e como garantir que polimerizou de verdade.',
      minutes: 8,
      keyPoints: [
        'Composição: matriz orgânica (Bis-GMA, UDMA, TEGDMA), carga inorgânica (vidro de bário/estrôncio, sílica; 60–80% em peso), agente de união silano, fotoiniciador (canforoquinona + amina; pico 468 nm) e pigmentos.',
        'Classificação atual por tamanho de partícula: microhíbridas, nanohíbridas e nanoparticuladas; flow (menos carga, mais contração) e bulk-fill (incrementos de 4–5 mm com fotoiniciadores/translucidez modificados).',
        'Contração de polimerização 1,5–3% em volume gera tensão nas paredes (fator C alto em classe I); técnica incremental (≤2 mm, oblíqua) e bases elásticas reduzem a tensão.',
        'Fotoativação: irradiância ≥1000 mW/cm², 20–40 s por incremento, ponta perpendicular e o mais perto possível; cada 1 mm de distância ou resina escura/opaca reduz a energia que chega (Price 2015).',
      ],
      sections: [
        {
          heading: 'O que está no tubo',
          bullets: [
            'Bis-GMA: viscoso, alta resistência; TEGDMA dilui, mas aumenta contração e sorção de água. UDMA: alternativa menos viscosa.',
            'Carga: aumenta resistência, módulo e radiopacidade, reduz contração e coeficiente de expansão térmica. Nanopartículas (5–100 nm) permitem polimento e brilho duradouro; nanohíbridas combinam nano com micro para resistência.',
            'Silano liga a carga (inorgânica) à matriz (orgânica) — sua hidrólise ao longo do tempo é uma via de degradação.',
            'Canforoquinona é amarelada; alguns fotoiniciadores alternativos (TPO, Ivocerin) absorvem em ~400–410 nm, exigindo fotopolimerizador "polywave".',
          ],
        },
        {
          heading: 'Contração e tensão',
          bullets: [
            'A contração é inevitável (monômeros se aproximam ao formar polímero); o problema é a tensão quando a resina já aderiu às paredes e não flui mais (gel point).',
            'Fator C = superfícies aderidas / superfícies livres. Classe I profunda (5:1) gera mais tensão do que classe IV (1:5).',
            'Estratégias: incrementos oblíquos ≤2 mm que tocam menos paredes por vez; camada de flow ou CIV como "amortecedor"; bulk-fill com modificadores de tensão; evitar fotoativação com ponta muito distante que polimeriza lentamente e mal.',
            'Consequências da tensão: fenda marginal, sensibilidade, trinca de esmalte, cárie secundária.',
          ],
        },
        {
          heading: 'Fotoativação e acabamento',
          bullets: [
            'Verificar o aparelho com radiômetro; pontas riscadas ou com resina aderida perdem 20–50% da luz.',
            'Dose (J/cm²) = irradiância × tempo: 1000 mW/cm² × 20 s = 20 J/cm² — mínimo típico de 16–24 J/cm² por incremento de 2 mm; resinas escuras, opacas ou distantes precisam de mais tempo.',
            'Proteger olhos (luz azul) e não aquecer a polpa: pausas entre ativações longas, jato de ar.',
            'Camada superficial inibida pelo oxigênio deve ser removida no acabamento; polimento com discos/borrachas de granulação decrescente e pasta — brilho e menos biofilme.',
          ],
        },
      ],
      clinicalBridge:
        'A restauração que fica sensível ou "escurece a margem" em seis meses geralmente é fotoativação insuficiente ou contração mal administrada — esta lição é o checklist antes de cada incremento.',
      selfCheck: [
        {
          question: 'Por que a técnica incremental reduz a tensão de contração?',
          answer: 'Porque cada incremento fino toca menos paredes ao mesmo tempo (fator C menor) e pode fluir pela superfície livre enquanto polimeriza, dissipando parte da contração antes de ficar rígido.',
        },
        {
          question: 'Se o fotopolimerizador entrega 800 mW/cm², quanto tempo garante ~20 J/cm²?',
          answer: '20.000 mJ/cm² ÷ 800 mW/cm² = 25 s. Com distância ou resina opaca, aumentar.',
        },
        {
          question: 'Qual é a função do silano em uma resina composta?',
          answer: 'É o agente de união bifuncional que liga quimicamente a carga inorgânica (por silanol) à matriz orgânica (por metacrilato), permitindo transferência de tensão e resistência.',
        },
      ],
      refIds: ['ferracane-2011', 'price-2015', 'vanende-2017'],
    },
    {
      id: 'md-ionomero-bioativos',
      title: 'Ionômero de vidro e materiais para proteção pulpar',
      summary: 'O material que adere sem adesivo e libera flúor — e o que colocar sobre a dentina quase exposta.',
      minutes: 8,
      keyPoints: [
        'CIV: reação ácido-base entre poliácido (poliacrílico) e vidro de fluoroaluminossilicato; adesão química à hidroxiapatita (quelação de cálcio) e ao colágeno; libera e recarrega flúor; coeficiente de expansão térmica semelhante ao dente.',
        'Fragilidades: baixa resistência à fratura e ao desgaste, sensibilidade à água (dissolução) e à desidratação (trincas) nas primeiras 24 h — proteger a superfície com verniz ou adesivo.',
        'Tipos: convencional (cimentação, forramento, restaurações provisórias), alta viscosidade (ART, classes I/II em decíduos, classe V), modificado por resina (RMGIC: HEMA + fotoativação; mais resistente e menos sensível à umidade inicial).',
        'Proteção pulpar: hidróxido de cálcio (alcalino, antibacteriano, mas solúvel e sem selamento) vs MTA e biocerâmicos (pH ~12,5, selamento, induzem ponte de dentina; padrão atual em capeamento direto).',
      ],
      sections: [
        {
          heading: 'Química e propriedades do CIV',
          bullets: [
            'Presa: o ácido ataca o vidro liberando Ca²⁺, Al³⁺ e F⁻; os íons formam sais (policarboxilatos) que unem as cadeias — gel de cálcio nos primeiros minutos, alumínio nas horas seguintes. Por isso o material continua "amadurecendo" por 24 h.',
            'Adesão: grupos carboxila trocam íons com o cálcio da hidroxiapatita; condicionar com ácido poliacrílico 10–20% por 10–20 s remove a smear layer e melhora a união. Não usar ácido fosfórico.',
            'Flúor: liberação alta nos primeiros dias, depois constante e baixa; recarrega com dentifrício/verniz — efeito anticárie marginal com evidência moderada.',
            'Biocompatibilidade excelente; radiopacidade variável; estética inferior à resina.',
          ],
        },
        {
          heading: 'Indicações e o ART',
          bullets: [
            'Cimentação de coroas e bandas ortodônticas; forramento/base sob resina em cavidades profundas (técnica sanduíche, especialmente em margens de dentina/cemento).',
            'Restaurações em decíduos (classes I, II pequenas, V), lesões cervicais não cariosas em idosos, restaurações provisórias e em pacientes de alto risco de cárie.',
            'Tratamento restaurador atraumático (ART): remoção manual de tecido amolecido + CIV de alta viscosidade pressionado com o dedo (técnica de pressão digital); sobrevida boa em cavidades de uma face, menor em múltiplas faces (Frencken 2012).',
            'Cuidados: mistura correta (pó/líquido ou cápsula), inserir antes de perder o brilho, proteger da saliva e do ar, acabamento após 24 h idealmente.',
          ],
        },
        {
          heading: 'O que colocar perto da polpa',
          bullets: [
            'Cavidade rasa/média em dentina firme: adesivo direto, sem forramento — a camada híbrida sela.',
            'Cavidade profunda sem exposição (remoção seletiva deixou dentina afetada): base de CIV ou RMGIC (selamento + flúor) ou biocerâmico; hidróxido de cálcio em pequena área, se usado, deve ser coberto porque se dissolve.',
            'Exposição pulpar pequena em dente vital sem pulpite irreversível: capeamento direto com MTA ou silicato de cálcio fotoativável, sob isolamento absoluto, após hemostasia com clorexidina ou hipoclorito — taxas de sucesso superiores ao hidróxido de cálcio.',
            'MTA: pó de silicatos de cálcio + óxido de bismuto (radiopacidade); presa em ~3–4 h na presença de umidade; pode manchar (versões brancas e biocerâmicos com zircônia reduzem isso).',
          ],
        },
      ],
      clinicalBridge:
        'Na clínica de dentística você vai decidir "sanduíche com CIV ou resina direta?" e "hidróxido de cálcio ou MTA?" em toda cavidade profunda. A resposta depende da química desta lição.',
      selfCheck: [
        {
          question: 'Por que o ionômero de vidro adere ao dente sem sistema adesivo?',
          answer: 'Os grupos carboxila do poliácido fazem ligação iônica com o cálcio da hidroxiapatita (e interagem com o colágeno), formando união química direta — diferente da resina, que depende de microrretenção e camada híbrida.',
        },
        {
          question: 'O que acontece se o CIV convencional ficar exposto à saliva nos primeiros minutos? E ao ar por horas?',
          answer: 'Saliva: dissolução dos íons antes de formarem os sais de presa, superfície frágil e opaca. Ar: desidratação com trincas e perda de translucidez. Proteger com verniz ou adesivo até a maturação (24 h).',
        },
        {
          question: 'Quais vantagens o MTA tem sobre o hidróxido de cálcio no capeamento pulpar direto?',
          answer: 'Sela a exposição (baixa solubilidade, adaptação), mantém pH alcalino prolongado, é biocompatível e induz ponte de dentina mais espessa e contínua; o hidróxido de cálcio se dissolve e deixa "túneis" na ponte, com taxa de sucesso menor.',
        },
      ],
      refIds: ['sidhu-2016', 'frencken-2012', 'parirokh-2010'],
    },
  ],
};
