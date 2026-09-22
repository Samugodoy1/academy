import type { BaseDiscipline } from '../types';

export const biossegurancaRadioprotecao: BaseDiscipline = {
  id: 'biosseguranca-radioprotecao',
  title: 'Biossegurança e radioproteção',
  short: 'Biossegurança',
  tagline: 'Precauções padrão, esterilização e a lógica do ALARA',
  period: 1,
  colaTopic: 'biosseguranca',
  references: [
    {
      id: 'kohn-2003',
      authors: 'Kohn WG, Collins AS, Cleveland JL, Harte JA, Eklund KJ, Malvitz DM; CDC',
      title: 'Guidelines for infection control in dental health-care settings — 2003',
      journal: 'MMWR Recommendations and Reports',
      year: 2003,
      url: 'https://www.cdc.gov/mmwr/preview/mmwrhtml/rr5217a1.htm',
      why: 'Diretriz-base do CDC para controle de infecção em odontologia, ainda vigente com atualizações.',
    },
    {
      id: 'harrel-2004',
      authors: 'Harrel SK, Molinari J',
      title: 'Aerosols and splatter in dentistry: a brief review of the literature and infection control implications',
      journal: 'The Journal of the American Dental Association',
      year: 2004,
      doi: '10.14219/jada.archive.2004.0207',
      why: 'Aerossol e respingo: origem, alcance e como reduzir.',
    },
    {
      id: 'rutala-2016',
      authors: 'Rutala WA, Weber DJ',
      title: 'Disinfection and sterilization in health care facilities: an overview and current issues',
      journal: 'Infectious Disease Clinics of North America',
      year: 2016,
      doi: '10.1016/j.idc.2016.04.002',
      why: 'Classificação de Spaulding e métodos de desinfecção e esterilização.',
    },
    {
      id: 'ada-2006-radiografias',
      authors: 'American Dental Association Council on Scientific Affairs',
      title: 'The use of dental radiographs: update and recommendations',
      journal: 'The Journal of the American Dental Association',
      year: 2006,
      doi: '10.14219/jada.archive.2006.0393',
      why: 'Critérios de seleção: radiografia com justificativa clínica, não de rotina.',
    },
    {
      id: 'ludlow-2008',
      authors: 'Ludlow JB, Davies-Ludlow LE, White SC',
      title: 'Patient risk related to common dental radiographic examinations: the impact of 2007 International Commission on Radiological Protection recommendations regarding dose calculation',
      journal: 'The Journal of the American Dental Association',
      year: 2008,
      doi: '10.14219/jada.archive.2008.0339',
      why: 'Doses efetivas das radiografias odontológicas comuns.',
    },
    {
      id: 'ludlow-2015',
      authors: 'Ludlow JB, Timothy R, Walker C, Hunter R, Benavides E, Samuelson DB, Scheske MJ',
      title: 'Effective dose of dental CBCT — a meta analysis of published data and additional data for nine CBCT units',
      journal: 'Dentomaxillofacial Radiology',
      year: 2015,
      doi: '10.1259/dmfr.20140197',
      why: 'Quanto a tomografia expõe em comparação às técnicas convencionais.',
    },
  ],
  mindMap: {
    label: 'Biossegurança',
    children: [
      {
        label: 'Cadeia de infecção',
        children: [
          { label: 'Agente → reservatório → saída', note: 'Sangue, saliva, aerossol.' },
          { label: 'Transmissão', note: 'Contato direto, indireto, gotícula, aerossol.' },
          { label: 'Porta de entrada → hospedeiro', note: 'Mucosa, pele lesada, perfurocortante.' },
        ],
      },
      {
        label: 'Precauções padrão',
        children: [
          { label: 'Higiene das mãos', note: 'Antes e depois de todo contato. Álcool 70% ou água e sabão.' },
          { label: 'EPI', note: 'Luvas, máscara, óculos, avental, gorro.' },
          { label: 'Perfurocortantes', note: 'Não reencapar com as duas mãos. Descarte rígido.' },
          { label: 'Aerossol', note: 'Sugador de alta potência, barreiras, antissepsia prévia.' },
        ],
      },
      {
        label: 'Processamento',
        children: [
          { label: 'Spaulding', note: 'Crítico · semicrítico · não crítico.' },
          { label: 'Limpeza', note: 'Sempre antes. Ultrassom ou manual com escova.' },
          { label: 'Esterilização', note: 'Autoclave 121–134 °C. Indicadores e Bowie-Dick.' },
          { label: 'Desinfecção', note: 'Superfícies: álcool 70%, quaternário.' },
        ],
      },
      {
        label: 'Radioproteção',
        children: [
          { label: 'Justificar', note: 'Cada imagem responde uma pergunta.' },
          { label: 'Otimizar (ALARA)', note: 'Colimação retangular, sensor digital, avental?' },
          { label: 'Doses', note: 'Periapical ~1–8 µSv · panorâmica ~15–25 · CBCT variável.' },
        ],
      },
    ],
  },
  lessons: [
    {
      id: 'br-precaucoes',
      title: 'Cadeia de infecção e precauções padrão',
      summary: 'A rotina que você repete mil vezes antes de tocar um paciente — e o raciocínio que a sustenta.',
      minutes: 8,
      keyPoints: [
        'Precauções padrão valem para todo paciente, sempre, porque não é possível saber quem porta HBV, HCV, HIV ou tuberculose: tratar todo sangue e fluido como potencialmente infectante (CDC 2003).',
        'Higiene das mãos é a medida mais eficaz: água e sabão quando visivelmente sujas; álcool gel 70% nas demais situações; antes de calçar e depois de retirar luvas.',
        'EPI: luvas (troca entre pacientes, nunca lavar luva), máscara cirúrgica (ou N95/PFF2 em aerossol e risco respiratório), óculos ou protetor facial, avental de manga longa, gorro.',
        'Perfurocortantes: não reencapar agulha com as duas mãos (técnica de uma mão ou dispositivo), descartar em coletor rígido; exposição acidental é emergência — lavar, notificar, avaliar profilaxia em até 2 h (HIV) e sorologias.',
      ],
      sections: [
        {
          heading: 'Como a infecção percorre a clínica',
          bullets: [
            'Elos: agente infeccioso → reservatório (paciente, água do equipo, superfícies) → porta de saída (saliva, sangue, aerossol) → via de transmissão → porta de entrada (mucosa, pele lesada, punção) → hospedeiro suscetível. Quebrar qualquer elo interrompe a cadeia.',
            'Vias: contato direto com sangue/saliva; indireto por instrumentos e superfícies contaminadas; gotículas (>5 µm, alcance curto) e aerossóis (<5 µm, ficam suspensos e alcançam alvéolos).',
            'Riscos ocupacionais principais: HBV (vacina em 3 doses + anti-HBs é obrigatória para o estudante), HCV, HIV, influenza, SARS-CoV-2, tuberculose e herpes (panarício herpético em dedo sem luva).',
          ],
        },
        {
          heading: 'Precauções padrão, passo a passo',
          bullets: [
            'Antes do paciente: mãos, EPI, barreiras em superfícies de toque (encosto, alça do refletor, seringa tríplice), instrumental estéril aberto na frente do paciente.',
            'Durante: luvas só tocam o campo; para pegar prontuário ou celular, retirar luvas. Sobreluvas para interrupções curtas. Sugador de alta potência reduz aerossol em até 90% (Harrel & Molinari 2004); bochecho antisséptico prévio reduz carga bacteriana.',
            'Depois: descartar perfurocortantes, remover EPI na ordem (luvas → avental → óculos → máscara), higienizar mãos, desinfetar superfícies com álcool 70% ou quaternário de amônio (limpar antes de desinfetar), acionar água do equipo por 20–30 s entre pacientes.',
          ],
        },
        {
          heading: 'Acidente com material biológico',
          bullets: [
            'Lavar com água e sabão (pele) ou soro (mucosa); não espremer nem usar hipoclorito.',
            'Identificar paciente-fonte e solicitar sorologias (HBV, HCV, HIV) com consentimento; avaliar status vacinal do acidentado.',
            'Profilaxia pós-exposição para HIV idealmente nas primeiras 2 h (até 72 h); imunoglobulina + vacina para HBV se não imune; acompanhamento sorológico por 6 meses. Notificar a instituição — sempre.',
          ],
        },
      ],
      clinicalBridge:
        'A Cola de biossegurança é o checklist do box; esta lição é o porquê de cada item. Professor pergunta "por que não pode lavar a luva?" — você responde com a cadeia de infecção.',
      selfCheck: [
        {
          question: 'Por que as precauções padrão não dependem do diagnóstico do paciente?',
          answer: 'Porque a maioria dos portadores de HBV, HCV ou HIV não sabe ou não informa; a única forma segura é tratar todo sangue, saliva e fluido como potencialmente infectante em todos os atendimentos.',
        },
        {
          question: 'Qual a medida isolada que mais reduz aerossol durante o uso da alta rotação?',
          answer: 'O sugador de alta potência (evacuador de alto volume) bem posicionado, que remove a maior parte do aerossol e do respingo na fonte.',
        },
        {
          question: 'Você se fura com a agulha após anestesiar. Quais os três primeiros passos?',
          answer: 'Lavar o local com água e sabão sem espremer; comunicar imediatamente o professor/serviço e registrar; providenciar avaliação para profilaxia (HIV em até 2 h idealmente) e sorologias do paciente-fonte e sua.',
        },
      ],
      refIds: ['kohn-2003', 'harrel-2004'],
    },
    {
      id: 'br-processamento',
      title: 'Processamento de instrumentais: limpeza, desinfecção e esterilização',
      summary: 'Spaulding, autoclave e indicadores — o que garante que a pinça é estéril de verdade.',
      minutes: 8,
      keyPoints: [
        'Classificação de Spaulding: crítico (penetra tecido ou osso: curetas, brocas, fórceps → esterilização), semicrítico (toca mucosa: espelho, condensador, peça de mão → esterilização; se impossível, desinfecção de alto nível), não crítico (toca pele íntegra → desinfecção de nível intermediário/baixo).',
        'Limpeza precede tudo: matéria orgânica protege microrganismos e inativa desinfetantes. Ultrassom com detergente enzimático ou lavagem manual com escova e EPI grosso.',
        'Autoclave a vapor é o método padrão: 121 °C por 15–30 min ou 134 °C por 3–4 min (ciclos completos incluem secagem). Peças de mão devem ser autoclavadas entre pacientes.',
        'Monitorar: indicador físico (registro do ciclo), químico (fita/integrador em cada pacote) e biológico (esporos de Geobacillus stearothermophilus, semanal). Armazenar em embalagem íntegra, seca, identificada com data.',
      ],
      sections: [
        {
          heading: 'Fluxo do artigo',
          bullets: [
            'Área suja → limpeza → inspeção e secagem → embalagem → esterilização → armazenamento → uso. Fluxo unidirecional, sem cruzar sujo com limpo.',
            'Pré-limpeza no consultório: retirar detritos grosseiros e manter úmido (não deixar sangue secar). Transporte em caixa fechada.',
            'Inspeção: lupa para verificar ausência de sujidade, corrosão e integridade; lubrificar articulados.',
            'Embalagem: papel grau cirúrgico/filme, envelope selado; permite penetração do vapor e mantém a esterilidade. Escrever data, conteúdo e responsável.',
          ],
        },
        {
          heading: 'Métodos e o que não funciona',
          bullets: [
            'Vapor saturado sob pressão (autoclave): eficaz, rápido, atóxico; corrói aço carbono sem tratamento. Calor seco (estufa 160 °C por 2 h): lento, danifica materiais, controle difícil — em desuso nos serviços.',
            'Desinfecção de alto nível (glutaraldeído 2% por 20–30 min ou ácido peracético) só para semicríticos que não toleram calor; não substitui esterilização em críticos.',
            'Não são métodos de esterilização: "esterilizador" de bolinhas de vidro, imersão em álcool, fervura, luz UV.',
            'Descartáveis (agulhas, lâminas, sugadores, copos) não se reprocessam.',
          ],
        },
        {
          heading: 'Garantir e provar',
          bullets: [
            'Indicador químico externo (fita) mostra que passou pelo ciclo; interno (integrador classe 5/6) mostra que o vapor atingiu o interior do pacote nas condições certas.',
            'Teste de Bowie-Dick diário em autoclaves com pré-vácuo verifica remoção de ar. Indicador biológico semanal (e após manutenção) é a prova definitiva.',
            'Rastreabilidade: registro do lote, ciclo e resultado dos indicadores — exigido em auditoria e em processo judicial.',
            'Superfícies: limpar com detergente e depois desinfetar (álcool 70% friccionado 3×, quaternário, hipoclorito 1% para sangue); barreiras descartáveis reduzem a necessidade.',
          ],
        },
      ],
      clinicalBridge:
        'O estágio de CME (central de material) do primeiro ano é este fluxo na prática. Você vai carimbar a fita, ler o integrador e explicar por que a estufa saiu de cena.',
      selfCheck: [
        {
          question: 'Um espelho clínico é crítico, semicrítico ou não crítico? Como deve ser processado?',
          answer: 'Semicrítico (toca mucosa íntegra). Deve ser esterilizado em autoclave; desinfecção de alto nível só se o material não tolerar calor.',
        },
        {
          question: 'Por que a limpeza vem antes da esterilização se a autoclave "mata tudo"?',
          answer: 'Porque matéria orgânica e biofilme formam barreira física que impede o vapor de atingir os microrganismos e podem inativar agentes químicos; a esterilização só é garantida em artigo limpo.',
        },
        {
          question: 'Que informação o indicador biológico dá que o químico não dá?',
          answer: 'Prova que microrganismos altamente resistentes (esporos de G. stearothermophilus) foram efetivamente mortos naquele ciclo — o químico só indica exposição às condições físicas.',
        },
      ],
      refIds: ['rutala-2016', 'kohn-2003'],
    },
    {
      id: 'br-radioprotecao',
      title: 'Radioproteção: justificar, otimizar e as doses reais',
      summary: 'Quanto é uma periapical, por que a panorâmica "de rotina" não existe e o que o ALARA exige de você.',
      minutes: 7,
      keyPoints: [
        'Princípios: justificação (a imagem deve mudar o diagnóstico ou a conduta), otimização (ALARA — a menor dose que responde à pergunta) e limitação de dose para trabalhadores.',
        'Radiografia não é exame de rotina: critérios de seleção baseados em história e exame clínico (ADA 2006). "Panorâmica para todo paciente novo" não tem sustentação.',
        'Doses efetivas aproximadas (Ludlow 2008): periapical digital ~1–8 µSv; bite-wing similar; panorâmica ~15–25 µSv; série completa com colimação retangular ~35 µSv; CBCT de 20 a >1000 µSv conforme campo (Ludlow 2015). Radiação de fundo natural: ~3000 µSv/ano.',
        'Reduzir dose: sensor digital, colimação retangular (reduz até 5×), posicionadores, filme/sensor rápido, tempo correto, distância e barreira para o operador (nunca segurar o filme).',
      ],
      sections: [
        {
          heading: 'Efeitos e por que otimizar',
          bullets: [
            'Efeitos determinísticos (limiar: catarata, eritema) não ocorrem em odontologia. Efeitos estocásticos (câncer) têm probabilidade proporcional à dose, sem limiar seguro assumido — daí o ALARA.',
            'Tecidos mais radiossensíveis no campo: tireoide, glândulas salivares, medula óssea, cristalino. Crianças têm risco maior por tecido em crescimento e maior expectativa de vida.',
            'Dose efetiva (µSv) pondera os órgãos expostos e permite comparar exames diferentes com a radiação de fundo.',
          ],
        },
        {
          heading: 'Justificar cada tomada',
          bullets: [
            'Periapical: dor, lesão periapical, endodontia, trauma, avaliação localizada. Bite-wing: cárie proximal e crista óssea posterior. Panorâmica: visão geral quando há indicação (terceiros molares, lesões extensas, planejamento amplo).',
            'Intervalo de bite-wings depende do risco de cárie: alto risco 6–12 meses; baixo risco 24–36 meses (adultos podem chegar a 36).',
            'Gestação não contraindica radiografia necessária (dose ao útero desprezível), mas reforça a justificativa; use protetor se a norma local exigir.',
            'CBCT só quando a imagem 2D não responde à pergunta (implantes, dentes impactados complexos, reabsorções, endodontia complexa) e com o menor campo de visão possível.',
          ],
        },
        {
          heading: 'Otimizar na prática',
          bullets: [
            'Receptores digitais (CCD/CMOS ou placas de fósforo) reduzem a dose em relação ao filme convencional; ajustar kVp/mA/tempo por região e paciente.',
            'Colimação retangular ajustada ao tamanho do sensor é a medida isolada de maior impacto na intraoral.',
            'Avental de chumbo: a evidência recente e a ADA (2023) indicam que não reduz dose relevante com colimação adequada e pode atrapalhar; protetor de tireoide em crianças é discutido — siga a norma vigente no seu serviço.',
            'Operador: ficar a ≥2 m fora do feixe ou atrás de barreira; dosímetro quando exigido; nunca segurar sensor ou paciente — usar posicionadores.',
          ],
        },
      ],
      clinicalBridge:
        'Antes de pedir a primeira radiografia para um paciente seu, você vai escrever a pergunta que ela responde. A Cola de radiologia continua no "como tirar e como ler".',
      selfCheck: [
        {
          question: 'Quanto uma panorâmica expõe em comparação à radiação natural de um dia?',
          answer: 'Uma panorâmica digital fica em torno de 15–25 µSv; a radiação de fundo é ~3000 µSv/ano (≈8 µSv/dia). Ou seja, cerca de 2–3 dias de exposição natural — pequena, mas nunca sem justificativa.',
        },
        {
          question: 'Qual medida técnica mais reduz a dose em radiografias intraorais?',
          answer: 'A colimação retangular ajustada ao tamanho do receptor, que pode reduzir a dose efetiva em até cinco vezes em relação ao cilindro circular.',
        },
        {
          question: 'Paciente novo, sem queixa, exame clínico sem lesões, baixo risco de cárie. Qual o exame radiográfico indicado?',
          answer: 'Possivelmente nenhum de imediato, ou bite-wings posteriores se as proximais não forem visíveis clinicamente — nunca uma panorâmica "de rotina". A imagem precisa responder a uma pergunta clínica.',
        },
      ],
      refIds: ['ada-2006-radiografias', 'ludlow-2008', 'ludlow-2015'],
    },
  ],
};
