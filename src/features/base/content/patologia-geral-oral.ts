import type { BaseDiscipline } from '../types';

export const patologiaGeralOral: BaseDiscipline = {
  id: 'patologia-geral-oral',
  title: 'Patologia geral e oral',
  short: 'Patologia',
  tagline: 'Inflamação, reparo e lesões que não podem passar despercebidas',
  period: 3,
  colaTopic: 'patologia-oral',
  references: [
    {
      id: 'medzhitov-2010',
      authors: 'Medzhitov R',
      title: 'Inflammation 2010: new adventures of an old flame',
      journal: 'Cell',
      year: 2010,
      doi: '10.1016/j.cell.2010.03.006',
      why: 'Visão moderna da inflamação como resposta adaptativa que pode se tornar patológica.',
    },
    {
      id: 'nair-2004',
      authors: 'Nair PNR',
      title: 'Pathogenesis of apical periodontitis and the causes of endodontic failures',
      journal: 'Critical Reviews in Oral Biology & Medicine',
      year: 2004,
      doi: '10.1177/154411130401500604',
      why: 'A periodontite apical explicada da microbiologia do canal ao granuloma e ao cisto.',
    },
    {
      id: 'gurtner-2008',
      authors: 'Gurtner GC, Werner S, Barrandon Y, Longaker MT',
      title: 'Wound repair and regeneration',
      journal: 'Nature',
      year: 2008,
      doi: '10.1038/nature07039',
      why: 'As fases da cicatrização e por que reparo não é regeneração.',
    },
    {
      id: 'blum-2002',
      authors: 'Blum IR',
      title: 'Contemporary views on dry socket (alveolar osteitis): a clinical appraisal of standardization, aetiopathogenesis and management: a critical review',
      journal: 'International Journal of Oral and Maxillofacial Surgery',
      year: 2002,
      doi: '10.1054/ijom.2002.0263',
      why: 'Fisiopatologia e fatores de risco da alveolite.',
    },
    {
      id: 'warnakulasuriya-2021',
      authors: 'Warnakulasuriya S, Kujan O, Aguirre-Urizar JM, Bagan JV, González-Moles MÁ, Kerr AR, et al.',
      title: 'Oral potentially malignant disorders: A consensus report from an international seminar on nomenclature and classification, convened by the WHO Collaborating Centre for Oral Cancer',
      journal: 'Oral Diseases',
      year: 2021,
      doi: '10.1111/odi.13704',
      why: 'Lista e definição atuais das desordens potencialmente malignas.',
    },
    {
      id: 'warnakulasuriya-2009',
      authors: 'Warnakulasuriya S',
      title: 'Global epidemiology of oral and oropharyngeal cancer',
      journal: 'Oral Oncology',
      year: 2009,
      doi: '10.1016/j.oraloncology.2008.06.002',
      why: 'Fatores de risco e distribuição do câncer de boca.',
    },
    {
      id: 'nice-ng12',
      authors: 'National Institute for Health and Care Excellence',
      title: 'Suspected cancer: recognition and referral (NG12) — head and neck cancers',
      journal: 'NICE guideline',
      year: 2015,
      url: 'https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer',
      why: 'Critérios objetivos de encaminhamento urgente para lesões suspeitas.',
    },
  ],
  mindMap: {
    label: 'Patologia',
    children: [
      {
        label: 'Inflamação',
        children: [
          { label: 'Sinais cardinais', note: 'Rubor, calor, tumor, dor, perda de função.' },
          { label: 'Aguda', note: 'Vasodilatação, exsudato, neutrófilos.' },
          { label: 'Crônica', note: 'Macrófagos, linfócitos, fibrose.' },
          { label: 'Periapical', note: 'Granuloma → cisto → abscesso.' },
        ],
      },
      {
        label: 'Reparo',
        children: [
          { label: 'Fases', note: 'Hemostasia → inflamação → proliferação → remodelação.' },
          { label: 'Alvéolo', note: 'Coágulo · granulação · osteoide · osso.' },
          { label: 'Atrasos', note: 'Tabaco, diabetes, infecção, radioterapia.' },
          { label: 'Alveolite', note: 'Coágulo perdido. Dor no 3º–5º dia.' },
        ],
      },
      {
        label: 'Potencialmente malignas',
        children: [
          { label: 'Leucoplasia', note: 'Branca, não removível, sem outra causa.' },
          { label: 'Eritroplasia', note: 'Vermelha. Maior risco.' },
          { label: 'Líquen plano', note: 'Estrias de Wickham; risco baixo mas real.' },
          { label: 'Queilite actínica', note: 'Lábio inferior, sol.' },
        ],
      },
      {
        label: 'Alerta',
        children: [
          { label: 'Úlcera > 3 semanas', note: 'Indolor, endurecida, borda elevada.' },
          { label: 'Sítios', note: 'Borda lateral da língua, assoalho.' },
          { label: 'Biópsia', note: 'Único diagnóstico definitivo.' },
        ],
      },
    ],
  },
  lessons: [
    {
      id: 'pg-inflamacao',
      title: 'Inflamação: sinais, mediadores e o que acontece no periápice',
      summary: 'A mesma resposta que protege é a que forma o abscesso. Entenda a sequência e você entende a endodontia.',
      minutes: 9,
      keyPoints: [
        'Inflamação aguda: vasodilatação (rubor, calor), aumento de permeabilidade (edema/tumor), migração de neutrófilos; mediadores: histamina, prostaglandinas, bradicinina, C5a, IL-1, TNF.',
        'Dor vem de bradicinina, prostaglandinas (sensibilizam) e da pressão do edema — por isso AINE funciona e por isso a pulpite dói tanto.',
        'Crônica: macrófagos, linfócitos, plasmócitos, angiogênese e fibrose; pode formar granuloma (agregado de macrófagos) quando o agente persiste.',
        'Periodontite apical: resposta do periápice à infecção do canal necrótico (Nair 2004). Formas: granuloma periapical, cisto radicular, abscesso agudo/crônico. Trate a causa (canal) e a lesão regride.',
      ],
      sections: [
        {
          heading: 'Aguda: a sequência vascular e celular',
          bullets: [
            'Minutos: vasoconstrição transitória, depois vasodilatação por histamina e NO → mais fluxo (rubor, calor).',
            'Permeabilidade aumenta (contração endotelial por histamina, bradicinina, leucotrienos) → exsudato rico em proteína sai → edema. Fibrina delimita a área.',
            'Neutrófilos marginam, rolam (selectinas), aderem (integrinas/ICAM), atravessam o endotélio e seguem quimiotaxia (C5a, LTB4, IL-8) até o agente. Fagocitose e liberação de enzimas e espécies reativas.',
            'Desfechos: resolução, supuração (abscesso: neutrófilos mortos + tecido liquefeito), cronificação ou fibrose.',
          ],
        },
        {
          heading: 'Crônica e granulomas',
          bullets: [
            'Quando o agente persiste (bactéria no canal, corpo estranho, autoimunidade), macrófagos assumem: secretam IL-1, TNF, fatores de crescimento; linfócitos T dirigem; plasmócitos produzem anticorpo.',
            'Reparo concomitante: angiogênese e fibrose. Tecido de granulação = novos capilares + fibroblastos + infiltrado.',
            'Granuloma: coleção organizada de macrófagos ativados (epitelioides), às vezes células gigantes, com linfócitos ao redor. Nem toda lesão chamada "granuloma" em odontologia é granuloma histológico — o "granuloma periapical" é tecido de granulação inflamado.',
          ],
        },
        {
          heading: 'Periápice: da necrose ao cisto',
          bullets: [
            'Polpa necrosada vira reservatório de biofilme anaeróbio que o sistema imune não alcança. Produtos bacterianos saem pelo forame e o periápice monta defesa: reabsorção óssea (para "afastar" a fonte) e barreira de tecido de granulação.',
            'Radiograficamente: espessamento do ligamento → radiolucidez periapical circunscrita. Histologia: granuloma (tecido de granulação com macrófagos, linfócitos, plasmócitos) em ~50%, cisto em ~15–40% (restos de Malassez proliferam por estímulo inflamatório e cavitam).',
            'Abscesso apical agudo: quando a bactéria vence a barreira; dor intensa, extrusão, edema, pode formar celulite ou fístula (crônico). Sintomas sistêmicos pedem antibiótico; caso contrário, drenagem via canal ou incisão.',
            'Tratar o canal remove a fonte; a lesão cicatriza por reparo ósseo em meses a anos. Cistos verdadeiros (não comunicantes com o canal) podem não regredir — uma causa de falha (Nair 2004).',
          ],
        },
      ],
      clinicalBridge:
        'Cada radiolucidez periapical que você vai ver no box é esta lição em imagem: uma defesa organizada contra bactérias dentro de um canal. O tratamento é endodontia, não antibiótico.',
      selfCheck: [
        {
          question: 'Quais mediadores explicam a dor da inflamação e como o ibuprofeno atua sobre eles?',
          answer: 'Bradicinina e prostaglandinas (PGE2) sensibilizam nociceptores; o edema aumenta a pressão. O ibuprofeno inibe a ciclo-oxigenase e reduz a produção de prostaglandinas.',
        },
        {
          question: 'Por que o osso ao redor do ápice é reabsorvido na periodontite apical?',
          answer: 'Citocinas inflamatórias (IL-1, TNF, IL-6) ativam RANKL e osteoclastos; a reabsorção afasta o osso da fonte de irritantes e cria espaço para o tecido de granulação defensivo.',
        },
        {
          question: 'Um abscesso apical agudo localizado, sem febre, em paciente saudável, precisa de antibiótico?',
          answer: 'Não. A conduta é drenagem (via canal ou incisão) e tratamento da causa. Antibiótico é reservado para sinais de disseminação sistêmica (febre, mal-estar, linfadenopatia, celulite difusa) ou paciente imunocomprometido.',
        },
      ],
      refIds: ['medzhitov-2010', 'nair-2004'],
    },
    {
      id: 'pg-reparo',
      title: 'Reparo e cicatrização: do alvéolo à alveolite',
      summary: 'As fases da cicatrização, o cronograma do alvéolo e o que atrasa tudo.',
      minutes: 8,
      keyPoints: [
        'Fases: hemostasia (minutos) → inflamação (dias 1–3) → proliferação (dias 3–14: granulação, angiogênese, fibroblastos, epitelização) → remodelação (semanas a meses; colágeno III → I).',
        'Primeira intenção: bordas aproximadas, pouca granulação, cicatriz mínima. Segunda intenção: ferida aberta, muita granulação, contração, cicatriz maior.',
        'Alvéolo pós-extração: coágulo (dia 1) → tecido de granulação (dias 3–7) → epitelização em 2–3 semanas → osteoide/osso imaturo (4–6 semanas) → remodelação por meses, com perda de dimensão óssea maior nas primeiras 8–12 semanas.',
        'Alveolite (osteíte alveolar): perda ou lise do coágulo com osso exposto, dor intensa no 3º–5º dia; fatores: tabagismo, contraceptivos, trauma cirúrgico, terceiros molares inferiores, bochecho vigoroso precoce.',
      ],
      sections: [
        {
          heading: 'As fases (Gurtner 2008)',
          bullets: [
            'Hemostasia: plaquetas agregam e liberam PDGF, TGF-β; a rede de fibrina é o primeiro arcabouço.',
            'Inflamação: neutrófilos limpam; macrófagos (M1 → M2) coordenam a transição para reparo liberando VEGF, FGF, TGF-β.',
            'Proliferação: fibroblastos migram e produzem colágeno tipo III e matriz; novos capilares (angiogênese); queratinócitos migram das bordas e reepitelizam; miofibroblastos contraem a ferida.',
            'Remodelação: colágeno III substituído por I, fibras se reorientam, vascularização diminui. A pele recupera ~80% da resistência original; mucosa oral cicatriza mais rápido e com menos cicatriz que a pele.',
          ],
        },
        {
          heading: 'O alvéolo em cronograma',
          bullets: [
            'Dia 0–1: coágulo preenche o alvéolo; hemostasia depende de compressão e coágulo estável — o paciente não deve bochechar nem cuspir com força.',
            'Dias 2–7: tecido de granulação substitui o coágulo a partir das paredes; epitélio começa a migrar das margens gengivais.',
            'Semanas 2–3: alvéolo coberto por epitélio; internamente, osteoide na base.',
            'Semanas 4–8: osso imaturo preenche; a crista vestibular (fina, osso fasciculado dependente do ligamento) reabsorve — por isso a perda de largura de ~30–50% no primeiro ano, relevante para implantes.',
            'Meses: remodelação e maturação; a densidade radiográfica normaliza em ~6 meses.',
          ],
        },
        {
          heading: 'O que atrasa e a alveolite',
          bullets: [
            'Sistêmicos: diabetes descompensado (microangiopatia, disfunção de neutrófilos), tabagismo (vasoconstrição, hipóxia, CO), desnutrição, corticoide, quimio/radioterapia (osteorradionecrose), bisfosfonatos/antirreabsortivos (osteonecrose medicamentosa).',
            'Locais: infecção, corpo estranho, isquemia por sutura muito apertada, trauma excessivo, mobilidade.',
            'Alveolite: incidência de ~1–4% em extrações gerais, chegando a 20–30% em terceiros molares inferiores. Fisiopatologia: atividade fibrinolítica aumentada (plasmina) dissolve o coágulo (Blum 2002). Conduta: irrigação suave, curativo alveolar analgésico, analgesia; não é infecção — antibiótico não é rotina.',
            'Prevenção: técnica atraumática, controle de biofilme, orientações pós-operatórias, cessação de tabaco nas 48–72 h, clorexidina 0,12% em casos de risco.',
          ],
        },
      ],
      clinicalBridge:
        'Você vai escrever as orientações pós-extração e atender a "dor que começou no terceiro dia". Saber o cronograma do alvéolo é saber o que é normal e o que é alveolite.',
      selfCheck: [
        {
          question: 'Por que a dor da alveolite começa tipicamente entre o 3º e o 5º dia?',
          answer: 'Porque é o período em que o coágulo deveria estar sendo substituído por tecido de granulação; quando ele é perdido ou dissolvido por fibrinólise, o osso fica exposto exatamente nesse intervalo.',
        },
        {
          question: 'Qual a diferença entre cicatrização por primeira e segunda intenção?',
          answer: 'Primeira: bordas aproximadas (sutura), pouco tecido de granulação, epitelização rápida, cicatriz mínima. Segunda: ferida aberta, preenchimento por granulação abundante, contração, mais tempo e mais cicatriz.',
        },
        {
          question: 'Por que a crista óssea vestibular é a que mais reabsorve após a extração?',
          answer: 'É fina e composta principalmente por osso fasciculado, cuja manutenção depende das fibras do ligamento periodontal; sem o dente, esse osso perde a função e é reabsorvido.',
        },
      ],
      refIds: ['gurtner-2008', 'blum-2002'],
    },
    {
      id: 'pg-lesoes-potencialmente-malignas',
      title: 'Lesões potencialmente malignas e o exame da mucosa',
      summary: 'Você é quem vai olhar essa boca com regularidade. Saber o que não pode esperar salva vidas.',
      minutes: 9,
      keyPoints: [
        'Desordens potencialmente malignas (OPMD, Warnakulasuriya 2021): leucoplasia, eritroplasia, leucoplasia verrucosa proliferativa, líquen plano oral, fibrose submucosa, queilite actínica, lúpus discoide, disceratose congênita, entre outras.',
        'Carcinoma espinocelular é >90% dos cânceres de boca; sítios mais comuns: borda lateral e ventre da língua, assoalho, gengiva/rebordo, palato mole. Fatores: tabaco (todas as formas), álcool (sinergia), HPV (orofaringe), radiação solar (lábio), betel.',
        'Sinais de alerta: úlcera que não cicatriza em 2–3 semanas, indolor, endurecida à palpação, bordas elevadas; lesão vermelha ou branca não removível; nódulo; mobilidade dental sem causa; linfonodo cervical endurecido.',
        'Biópsia é o único diagnóstico definitivo. Encaminhar em até 2 semanas lesões suspeitas (NICE NG12).',
      ],
      sections: [
        {
          heading: 'Reconhecer as OPMD',
          bullets: [
            'Leucoplasia: placa branca que não se remove à raspagem e não se explica por outra doença (é diagnóstico de exclusão). Homogênea (risco menor) ou não homogênea (nodular, verrucosa, eritroleucoplasia — risco maior). Taxa de transformação global ~1–3% ao ano em algumas séries; maior em não fumantes, assoalho/língua, não homogêneas.',
            'Eritroplasia: placa vermelha aveludada; rara, mas com a maior taxa de displasia/carcinoma já na biópsia inicial.',
            'Líquen plano oral: estrias brancas reticulares (Wickham), bilaterais, em mucosa jugal; formas erosivas doem. Risco de transformação ~1%; acompanhamento periódico.',
            'Queilite actínica: lábio inferior, perda da nitidez do limite vermelhão–pele, áreas esbranquiçadas e descamação, em quem trabalha ao sol.',
          ],
        },
        {
          heading: 'O exame sistemático',
          bullets: [
            'Extraoral: inspeção de face e lábios; palpação bimanual de linfonodos cervicais (submentonianos, submandibulares, cadeia jugular, supraclaviculares).',
            'Intraoral, sempre na mesma ordem: lábios (vermelhão e mucosa), mucosa jugal e fundo de sulco, gengiva/rebordo, língua (dorso, bordas laterais tracionando com gaze, ventre), assoalho (palpação bimanual), palato duro e mole, pilares e orofaringe.',
            'Descrever cada lesão: localização, tamanho, cor, superfície, base (séssil/pediculada), consistência à palpação, bordas, sintomas, tempo de evolução.',
            'Fotografar e registrar; reavaliar lesões inespecíficas em 2–3 semanas após remover possível causa (prótese, dente fraturado).',
          ],
        },
        {
          heading: 'Quando não esperar',
          bullets: [
            'Úlcera > 3 semanas sem causa traumática identificável ou que persiste após remover a causa; especialmente indolor e endurecida.',
            'Lesão vermelha ou mista vermelha/branca persistente. Massa ou nódulo em crescimento. Área de dormência inexplicada (invasão nervosa).',
            'Linfonodo cervical > 2 cm, endurecido, fixo, indolor, por mais de 3 semanas.',
            'Conduta: não "tratar empiricamente" com antifúngico ou corticoide por semanas — encaminhar para estomatologia/biópsia. Sobrevida em 5 anos passa de ~30–40% (estádio avançado) para >80% (precoce).',
          ],
        },
      ],
      clinicalBridge:
        'Na anamnese e no exame intraoral de toda primeira consulta você faz o rastreamento. Um minuto de inspeção de língua e assoalho por paciente é o exame que mais salva vidas na sua profissão.',
      selfCheck: [
        {
          question: 'Por que leucoplasia é um diagnóstico de exclusão?',
          answer: 'Porque o termo só se aplica à placa branca que não se remove e não pode ser atribuída a outra condição definida (candidíase, líquen, morsicatio, leucoedema, hiperqueratose friccional). Descartadas essas, resta a leucoplasia — que precisa de biópsia.',
        },
        {
          question: 'Paciente de 58 anos, fumante, úlcera indolor de 3 semanas na borda lateral da língua, endurecida. Qual a conduta?',
          answer: 'Suspeita de carcinoma espinocelular: encaminhamento urgente (até 2 semanas) para biópsia/estomatologia. Não prescrever tratamento empírico prolongado.',
        },
        {
          question: 'Qual OPMD tem a maior probabilidade de já mostrar displasia grave ou carcinoma na primeira biópsia?',
          answer: 'A eritroplasia (placa vermelha aveludada), embora rara, apresenta displasia grave ou carcinoma na maioria dos casos ao diagnóstico.',
        },
      ],
      refIds: ['warnakulasuriya-2021', 'warnakulasuriya-2009', 'nice-ng12'],
    },
  ],
};
