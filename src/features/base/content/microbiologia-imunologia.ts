import type { BaseDiscipline } from '../types';

export const microbiologiaImunologia: BaseDiscipline = {
  id: 'microbiologia-imunologia',
  title: 'Microbiologia e imunologia oral',
  short: 'Microbiologia',
  tagline: 'Biofilme, ecologia da cárie e resposta imune no periodonto',
  period: 3,
  colaTopic: 'periodontia',
  references: [
    {
      id: 'marsh-2006',
      authors: 'Marsh PD',
      title: 'Dental plaque as a biofilm and a microbial community — implications for health and disease',
      journal: 'BMC Oral Health',
      year: 2006,
      doi: '10.1186/1472-6831-6-S1-S14',
      why: 'A hipótese da placa ecológica explicada pelo próprio autor.',
    },
    {
      id: 'kolenbrander-2010',
      authors: 'Kolenbrander PE, Palmer RJ Jr, Periasamy S, Jakubovics NS',
      title: 'Oral multispecies biofilm development and the key role of cell–cell distance',
      journal: 'Nature Reviews Microbiology',
      year: 2010,
      doi: '10.1038/nrmicro2381',
      why: 'Como colonizadores primários, coagregação e pontes constroem o biofilme.',
    },
    {
      id: 'kilian-2016',
      authors: 'Kilian M, Chapple ILC, Hannig M, Marsh PD, Meuric V, Pedersen AML, et al.',
      title: 'The oral microbiome — an update for oral healthcare professionals',
      journal: 'British Dental Journal',
      year: 2016,
      doi: '10.1038/sj.bdj.2016.865',
      why: 'Atualização acessível sobre o microbioma oral em saúde e doença.',
    },
    {
      id: 'loe-1965',
      authors: 'Löe H, Theilade E, Jensen SB',
      title: 'Experimental gingivitis in man',
      journal: 'Journal of Periodontology',
      year: 1965,
      doi: '10.1902/jop.1965.36.3.177',
      why: 'O experimento clássico: parar de escovar → gengivite em 2–3 semanas; voltar a escovar → reversão.',
    },
    {
      id: 'takahashi-2011',
      authors: 'Takahashi N, Nyvad B',
      title: 'The role of bacteria in the caries process: ecological perspectives',
      journal: 'Journal of Dental Research',
      year: 2011,
      doi: '10.1177/0022034510379602',
      why: 'Hipótese ecológica estendida: da placa saudável à acidogênica e acidúrica.',
    },
    {
      id: 'pitts-2017',
      authors: 'Pitts NB, Zero DT, Marsh PD, Ekstrand K, Weintraub JA, Ramos-Gomez F, et al.',
      title: 'Dental caries',
      journal: 'Nature Reviews Disease Primers',
      year: 2017,
      doi: '10.1038/nrdp.2017.30',
      why: 'Revisão de referência sobre a cárie como doença mediada por biofilme e açúcar.',
    },
    {
      id: 'hajishengallis-2015',
      authors: 'Hajishengallis G',
      title: 'Periodontitis: from microbial immune subversion to systemic inflammation',
      journal: 'Nature Reviews Immunology',
      year: 2015,
      doi: '10.1038/nri3785',
      why: 'Como a disbiose subverte a resposta imune e destrói o periodonto.',
    },
    {
      id: 'hajishengallis-2012',
      authors: 'Hajishengallis G, Darveau RP, Curtis MA',
      title: 'The keystone-pathogen hypothesis',
      journal: 'Nature Reviews Microbiology',
      year: 2012,
      doi: '10.1038/nrmicro2873',
      why: 'P. gingivalis como patógeno-chave em baixa abundância.',
    },
    {
      id: 'papapanou-2018',
      authors: 'Papapanou PN, Sanz M, Buduneli N, Dietrich T, Feres M, Fine DH, et al.',
      title: 'Periodontitis: Consensus report of workgroup 2 of the 2017 World Workshop on the Classification of Periodontal and Peri-Implant Diseases and Conditions',
      journal: 'Journal of Periodontology',
      year: 2018,
      doi: '10.1002/JPER.17-0721',
      why: 'Consenso que define periodontite e a base biológica da classificação atual.',
    },
  ],
  mindMap: {
    label: 'Microbiologia oral',
    children: [
      {
        label: 'Biofilme',
        children: [
          { label: 'Película adquirida', note: 'Proteínas salivares em minutos.' },
          { label: 'Colonizadores primários', note: 'Streptococcus, Actinomyces.' },
          { label: 'Ponte: F. nucleatum', note: 'Liga primários a tardios.' },
          { label: 'Matriz EPS', note: 'Protege, retém ácido, tolera antimicrobiano.' },
        ],
      },
      {
        label: 'Cárie ecológica',
        children: [
          { label: 'Açúcar frequente', note: 'Seleciona acidogênicos e acidúricos.' },
          { label: 'S. mutans, lactobacilos', note: 'Consequência da disbiose, não causa única.' },
          { label: 'Controle', note: 'Muda o ambiente: dieta, flúor, biofilme.' },
        ],
      },
      {
        label: 'Gengivite',
        children: [
          { label: 'Löe 1965', note: '2–3 semanas sem escovar. Reversível.' },
          { label: 'Inata', note: 'Neutrófilos, complemento, TLR.' },
        ],
      },
      {
        label: 'Periodontite',
        children: [
          { label: 'Disbiose', note: 'P. gingivalis como keystone.' },
          { label: 'Citocinas', note: 'IL-1β, TNF-α, IL-6, IL-17.' },
          { label: 'RANKL/OPG', note: 'Osteoclastos reabsorvem osso.' },
          { label: 'Hospedeiro', note: 'Diabetes, tabaco, genética.' },
        ],
      },
    ],
  },
  lessons: [
    {
      id: 'mi-biofilme',
      title: 'Biofilme dental: da película à comunidade',
      summary: 'Placa não é sujeira: é uma cidade organizada. Entender a arquitetura explica por que antibiótico não resolve.',
      minutes: 9,
      keyPoints: [
        'Sequência: película adquirida (minutos) → colonizadores primários (Streptococcus sanguinis, gordonii, oralis; Actinomyces) → coagregação → colonizadores tardios (anaeróbios gram-negativos) → maturação.',
        'Fusobacterium nucleatum é a ponte: coagrega com quase todos e liga os primários aos tardios (Kolenbrander 2010).',
        'Matriz de polissacarídeos extracelulares (EPS) retém ácido, cria gradientes de oxigênio e pH e torna as bactérias 10–1000× mais tolerantes a antimicrobianos do que soltas.',
        'Löe (1965): sem escovação, gengivite em 2–3 semanas em todos; ao retomar a higiene, reversão completa — biofilme causa, e remoção mecânica cura.',
      ],
      sections: [
        {
          heading: 'Formação',
          bullets: [
            'Película adquirida: glicoproteínas, mucinas, estaterina, proteínas ricas em prolina adsorvem ao esmalte e criam receptores para adesinas bacterianas.',
            'Primárias horas: estreptococos e Actinomyces ligam-se por adesinas específicas; multiplicam-se e produzem EPS (glucanos por glucosiltransferases a partir de sacarose).',
            'Dias: coagregação — pares específicos (por exemplo, S. gordonii + Actinomyces; F. nucleatum + P. gingivalis). Aumenta a diversidade e a espessura; o interior fica anaeróbio.',
            'Sem perturbação, o biofilme atinge complexidade "clímax" em 1–2 semanas; então a composição se estabiliza.',
          ],
        },
        {
          heading: 'Por que o biofilme resiste',
          bullets: [
            'Matriz: barreira física e química (liga antimicrobianos catiônicos), reservatório de nutrientes e de ácido.',
            'Gradientes: oxigênio some em micrômetros; pH varia; há microambientes onde anaeróbios estritos prosperam a poucos micrômetros da superfície aeróbia.',
            'Comunicação (quorum sensing, sistema com ComC/CSP em estreptococos) e transferência horizontal de genes.',
            'Fenótipo de biofilme: metabolismo mais lento e células persistentes — o mesmo microrganismo solto morre com uma dose que não afeta o biofilme.',
          ],
        },
        {
          heading: 'Saúde não é ausência de bactéria',
          bullets: [
            'O microbioma oral saudável tem centenas de espécies; muitas protegem (competição por sítio, produção de peróxido, alcalinização por arginina).',
            'Saúde é equilíbrio (simbiose); doença é desvio (disbiose) provocado por mudança ambiental (Kilian 2016).',
            'Consequência prática: o objetivo é controlar quantidade e ambiente do biofilme — não esterilizar a boca.',
          ],
        },
      ],
      clinicalBridge:
        'Explica por que raspagem e escova funcionam e antibiótico sozinho não: a matriz protege. Todo plano de controle de biofilme e toda instrução de higiene se apoiam aqui.',
      selfCheck: [
        {
          question: 'Qual espécie funciona como "ponte" no biofilme e por quê?',
          answer: 'Fusobacterium nucleatum: coagrega tanto com colonizadores primários (estreptococos, Actinomyces) quanto com tardios (P. gingivalis), conectando as camadas.',
        },
        {
          question: 'Por que bactérias em biofilme toleram antimicrobianos muito mais que em suspensão?',
          answer: 'A matriz de EPS limita a penetração e liga o agente; gradientes criam células de metabolismo lento e persistentes; e a densidade favorece troca de genes de resistência.',
        },
        {
          question: 'O que o experimento de Löe (1965) provou?',
          answer: 'Que o acúmulo de biofilme causa gengivite (em 2–3 semanas sem higiene) e que a remoção mecânica reverte completamente o quadro — relação causa-efeito e reversibilidade.',
        },
      ],
      refIds: ['marsh-2006', 'kolenbrander-2010', 'kilian-2016', 'loe-1965'],
    },
    {
      id: 'mi-ecologia-carie',
      title: 'Hipótese da placa ecológica e a cárie',
      summary: 'S. mutans não é o vilão solitário. O açúcar frequente muda o ambiente, e o ambiente escolhe as bactérias.',
      minutes: 7,
      keyPoints: [
        'Hipótese da placa ecológica (Marsh): mudança ambiental (açúcar frequente → pH baixo prolongado) seleciona espécies acidogênicas e acidúricas; a disbiose é consequência do ambiente, não invasão externa.',
        'S. mutans, lactobacilos, Bifidobacterium e Scardovia são marcadores de placa cariogênica, mas cárie ocorre sem S. mutans e S. mutans ocorre sem cárie.',
        'Takahashi & Nyvad (2011): três estágios — estabilidade dinâmica (saúde), acidogênico (adaptação de espécies comuns), acidúrico (dominância de espécies tolerantes a ácido).',
        'Estratégia: mudar o ambiente (frequência de açúcar, flúor, saliva, remoção de biofilme) em vez de tentar eliminar uma espécie.',
      ],
      sections: [
        {
          heading: 'Da placa saudável à cariogênica',
          bullets: [
            'Em saúde, estreptococos não mutans e Actinomyces metabolizam açúcar produzindo ácido em pequena quantidade, tamponado pela saliva; alcalinizantes (arginina deiminase) e produção de peróxido mantêm S. mutans em baixa.',
            'Com açúcar frequente, o pH fica baixo por mais tempo. Espécies comuns aumentam sua acidogenicidade (fase acidogênica). Se persistir, espécies acidúricas (S. mutans, lactobacilos, bifidobactérias) passam a dominar (fase acidúrica).',
            'Sacarose é o açúcar mais cariogênico: além de fermentável, é substrato para glucanos insolúveis que engrossam a matriz e a tornam mais porosa a ácido.',
          ],
        },
        {
          heading: 'O que isso muda no diagnóstico',
          bullets: [
            'Testes de contagem de S. mutans ou lactobacilos têm baixo valor preditivo individual — refletem o ambiente, não o destino.',
            'Avaliação de risco (dieta, saliva, exposição a flúor, histórico de lesões, higiene, fatores socioeconômicos) prevê melhor do que a bactéria.',
            'A cárie é uma doença comportamental e ambiental com um sinal biológico (a lesão).',
          ],
        },
        {
          heading: 'Como se traduz em conduta',
          bullets: [
            'Reduzir frequência de carboidratos fermentáveis; recomendar água entre refeições; xilitol reduz S. mutans e estimula saliva.',
            'Flúor muda o balanço mineral e também reduz a acidogenicidade do biofilme.',
            'Desorganizar o biofilme com escovação e fio remove a espessura que permite gradientes de pH extremos.',
            'Clorexidina por período curto pode ajudar em casos específicos, mas não muda o ambiente — a recolonização é rápida.',
          ],
        },
      ],
      clinicalBridge:
        'Você vai preencher uma ficha de risco de cárie (CAMBRA ou similar) para cada paciente: é esta hipótese em forma de checklist.',
      selfCheck: [
        {
          question: 'Por que a cárie não é considerada uma infecção clássica por um patógeno?',
          answer: 'Porque as espécies associadas são residentes normais que se tornam dominantes quando o ambiente muda (açúcar frequente, pH baixo). Não há "contágio" de um patógeno externo obrigatório.',
        },
        {
          question: 'O que diferencia a fase acidogênica da acidúrica na hipótese ecológica estendida?',
          answer: 'Na acidogênica, espécies comuns aumentam a produção de ácido sem grande mudança de composição. Na acidúrica, a exposição prolongada seleciona espécies tolerantes a ácido (S. mutans, lactobacilos), com mudança clara de composição.',
        },
        {
          question: 'Por que a sacarose é mais cariogênica que a glicose?',
          answer: 'Além de ser fermentada em ácido, a sacarose é o substrato exclusivo das glucosiltransferases que produzem glucanos insolúveis, tornando a matriz mais espessa e aderente.',
        },
      ],
      refIds: ['marsh-2006', 'takahashi-2011', 'pitts-2017'],
    },
    {
      id: 'mi-imunologia-periodonto',
      title: 'Resposta imune no periodonto: da gengivite à periodontite',
      summary: 'O osso não é destruído pela bactéria — é destruído pela resposta do hospedeiro a ela.',
      minutes: 9,
      keyPoints: [
        'Gengivite é inflamação reversível confinada à gengiva; periodontite envolve perda de inserção e osso por resposta imune desregulada a um biofilme disbiótico.',
        'Imunidade inata: neutrófilos atravessam o epitélio juncional continuamente; receptores Toll-like (TLR2/4) reconhecem LPS e lipoproteínas; complemento amplifica.',
        'Citocinas IL-1β, TNF-α, IL-6 e IL-17 aumentam RANKL; RANKL ativa osteoclastos e OPG o antagoniza — o balanço RANKL/OPG decide a perda óssea. Metaloproteinases (MMP-8, MMP-9) degradam colágeno.',
        'P. gingivalis é "patógeno-chave": em baixa abundância, manipula o complemento e os neutrófilos, permitindo que toda a comunidade cresça (Hajishengallis 2012).',
      ],
      sections: [
        {
          heading: 'Gengivite: inflamação que ainda protege',
          bullets: [
            'Biofilme na margem → vasodilatação, exsudato (fluido gengival aumenta), migração de neutrófilos pelo epitélio juncional → sangramento à sondagem, edema, rubor.',
            'Histologicamente: infiltrado de neutrófilos e depois linfócitos/plasmócitos no conjuntivo subjacente ao epitélio do sulco; sem perda de inserção.',
            'Remover o biofilme resolve; a gengivite pode durar anos sem virar periodontite — a transição depende do hospedeiro.',
          ],
        },
        {
          heading: 'Periodontite: quando a defesa destrói',
          bullets: [
            'Disbiose: a comunidade muda para gram-negativos anaeróbios proteolíticos (P. gingivalis, T. forsythia, T. denticola — o "complexo vermelho"), alimentados por fluido gengival rico em proteína e ferro.',
            'Resposta: mais neutrófilos hiperativos (liberam enzimas e espécies reativas), macrófagos e células Th17 produzindo IL-17; plasmócitos dominam o infiltrado crônico.',
            'Reabsorção óssea: IL-1β, TNF-α, IL-6, IL-17 e PGE2 aumentam RANKL em osteoblastos e fibroblastos; RANKL liga RANK em precursores de osteoclastos. OPG (osteoprotegerina) é o freio.',
            'MMPs (colagenases de neutrófilos e fibroblastos) degradam as fibras do ligamento; o epitélio juncional migra apicalmente, formando bolsa que abriga mais anaeróbios — ciclo.',
          ],
        },
        {
          heading: 'Hospedeiro e sistema',
          bullets: [
            'Fatores que amplificam: diabetes (produtos de glicação avançada → mais citocinas), tabagismo (vasoconstrição, neutrófilos disfuncionais, mascara sangramento), estresse, polimorfismos genéticos (IL-1).',
            'Ligação com doença sistêmica: bacteremia e mediadores inflamatórios elevam a carga inflamatória sistêmica; associações com diabetes, doença cardiovascular e desfechos gestacionais (Hajishengallis 2015).',
            'Classificação 2017: estágio (gravidade/complexidade) e grau (velocidade de progressão e fatores de risco) — reconhece que a resposta do hospedeiro define o prognóstico.',
          ],
        },
      ],
      clinicalBridge:
        'Sangramento à sondagem é neutrófilo atravessando epitélio; bolsa é epitélio migrando por MMP; perda óssea na radiografia é RANKL vencendo OPG. Na Cola de periodontia você aplica este mapa ao periodontograma.',
      selfCheck: [
        {
          question: 'Quem destrói o osso alveolar na periodontite?',
          answer: 'Os osteoclastos do próprio hospedeiro, ativados por RANKL induzido por citocinas inflamatórias (IL-1β, TNF-α, IL-17). As bactérias iniciam; a resposta imune executa.',
        },
        {
          question: 'O que significa dizer que P. gingivalis é um patógeno-chave?',
          answer: 'Que mesmo em baixa abundância ela remodela a comunidade e a resposta do hospedeiro (subverte complemento e neutrófilos), permitindo que toda a microbiota disbiótica prospere — como a pedra-chave de um arco.',
        },
        {
          question: 'Por que o tabagismo pode esconder a gengivite e piorar a periodontite ao mesmo tempo?',
          answer: 'A nicotina causa vasoconstrição (menos sangramento e rubor, mascarando o sinal) enquanto prejudica a função dos neutrófilos e a cicatrização, aumentando a destruição.',
        },
      ],
      refIds: ['hajishengallis-2015', 'hajishengallis-2012', 'papapanou-2018'],
    },
  ],
};
