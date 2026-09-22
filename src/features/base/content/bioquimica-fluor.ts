import type { BaseDiscipline } from '../types';

export const bioquimicaFluor: BaseDiscipline = {
  id: 'bioquimica-fluor',
  title: 'Bioquímica da cárie e do flúor',
  short: 'Bioquímica e flúor',
  tagline: 'Des/remineralização, pH crítico e como o flúor age',
  period: 2,
  colaTopic: 'preventiva',
  references: [
    {
      id: 'featherstone-2004',
      authors: 'Featherstone JDB',
      title: 'The continuum of dental caries — evidence for a dynamic disease process',
      journal: 'Journal of Dental Research',
      year: 2004,
      doi: '10.1177/154405910408301s08',
      why: 'A cárie como equilíbrio dinâmico entre fatores patológicos e protetores.',
    },
    {
      id: 'robinson-2000',
      authors: 'Robinson C, Shore RC, Brookes SJ, Strafford S, Wood SR, Kirkham J',
      title: 'The chemistry of enamel caries',
      journal: 'Critical Reviews in Oral Biology & Medicine',
      year: 2000,
      doi: '10.1177/10454411000110040601',
      why: 'A química da dissolução do esmalte e a formação da lesão de subsuperfície.',
    },
    {
      id: 'buzalaf-2011',
      authors: 'Buzalaf MAR, Pessan JP, Honório HM, ten Cate JM',
      title: 'Mechanisms of action of fluoride for caries control',
      journal: 'Monographs in Oral Science',
      year: 2011,
      doi: '10.1159/000325151',
      why: 'Revisão dos mecanismos: o efeito do flúor é predominantemente tópico e pós-eruptivo.',
    },
    {
      id: 'tencate-2013',
      authors: 'ten Cate JM',
      title: 'Contemporary perspective on the use of fluoride products in caries prevention',
      journal: 'British Dental Journal',
      year: 2013,
      doi: '10.1038/sj.bdj.2013.162',
      why: 'Perspectiva atual sobre produtos fluoretados e quando usar cada um.',
    },
    {
      id: 'featherstone-1999',
      authors: 'Featherstone JDB',
      title: 'Prevention and reversal of dental caries: role of low level fluoride',
      journal: 'Community Dentistry and Oral Epidemiology',
      year: 1999,
      doi: '10.1111/j.1600-0528.1999.tb01989.x',
      why: 'Por que baixas concentrações constantes de flúor no fluido do biofilme são o que importa.',
    },
    {
      id: 'walsh-2019',
      authors: 'Walsh T, Worthington HV, Glenny AM, Marinho VCC, Jeroncic A',
      title: 'Fluoride toothpastes of different concentrations for preventing dental caries',
      journal: 'Cochrane Database of Systematic Reviews',
      year: 2019,
      doi: '10.1002/14651858.CD007868.pub3',
      why: 'Revisão sistemática: dentifrícios com ≥1000 ppm previnem cárie; abaixo disso, não há evidência.',
    },
    {
      id: 'wright-2014',
      authors: 'Wright JT, Hanson N, Ristic H, Whall CW, Estrich CG, Zentz RR',
      title: 'Fluoride toothpaste efficacy and safety in children younger than 6 years: a systematic review',
      journal: 'The Journal of the American Dental Association',
      year: 2014,
      doi: '10.14219/jada.2013.37',
      why: 'Base da recomendação de quantidade de dentifrício para crianças pequenas.',
    },
    {
      id: 'whitford-2011',
      authors: 'Whitford GM',
      title: 'Acute toxicity of ingested fluoride',
      journal: 'Monographs in Oral Science',
      year: 2011,
      doi: '10.1159/000325146',
      why: 'Dose provavelmente tóxica e conduta na ingestão acidental.',
    },
    {
      id: 'evans-1995',
      authors: 'Evans RW, Darvell BW',
      title: 'Refining the estimate of the critical period for susceptibility to enamel fluorosis in human maxillary central incisors',
      journal: 'Journal of Public Health Dentistry',
      year: 1995,
      doi: '10.1111/j.1752-7325.1995.tb02376.x',
      why: 'Janela crítica de fluorose nos incisivos centrais superiores.',
    },
  ],
  mindMap: {
    label: 'Cárie e flúor',
    children: [
      {
        label: 'Equilíbrio mineral',
        children: [
          { label: 'Hidroxiapatita', note: 'Ca10(PO4)6(OH)2 · pH crítico ~5,5.' },
          { label: 'Fluorapatita', note: 'pH crítico ~4,5. Muito mais resistente.' },
          { label: 'Dentina', note: 'pH crítico mais alto: ~6,2–6,7.' },
        ],
      },
      {
        label: 'Curva de Stephan',
        children: [
          { label: 'Queda em minutos', note: 'Sacarose → ácido → pH < 5,5.' },
          { label: 'Recuperação', note: '30–60 min pelo tampão salivar.' },
          { label: 'Frequência', note: 'Mais importante que a quantidade de açúcar.' },
        ],
      },
      {
        label: 'Flúor: mecanismos',
        children: [
          { label: 'Inibe desmineralização', note: 'F no fluido ao redor do cristal.' },
          { label: 'Acelera remineralização', note: 'Forma fluor-hidroxiapatita.' },
          { label: 'Reservatório CaF2', note: 'Libera F quando o pH cai.' },
          { label: 'Efeito sistêmico', note: 'Pequeno. Flúor é tópico.' },
        ],
      },
      {
        label: 'Uso e segurança',
        children: [
          { label: 'Dentifrício ≥ 1000 ppm', note: 'Para todas as idades; quantidade ajustada.' },
          { label: 'Verniz 5% NaF', note: '22.600 ppm. 2–4×/ano em risco.' },
          { label: 'Fluorose', note: 'Janela crítica 15–30 meses (incisivos).' },
          { label: 'Dose tóxica', note: '≈ 5 mg F/kg: pronto-socorro.' },
        ],
      },
    ],
  },
  lessons: [
    {
      id: 'bf-desmineralizacao',
      title: 'Desmineralização e remineralização: a química do pH crítico',
      summary: 'O esmalte dissolve e reprecipita várias vezes por dia. Cárie é quando a conta fecha no negativo.',
      minutes: 8,
      keyPoints: [
        'Hidroxiapatita [Ca10(PO4)6(OH)2] começa a dissolver quando o pH do fluido do biofilme cai abaixo de ~5,5 (pH crítico do esmalte). Dentina, menos mineralizada, dissolve já em ~6,2–6,7.',
        'Fluorapatita tem pH crítico ~4,5: com flúor na superfície do cristal, o esmalte tolera ataques ácidos muito mais intensos.',
        'Curva de Stephan: após sacarose, o pH do biofilme cai em minutos e leva 30–60 minutos para voltar. Frequência de ingestão pesa mais do que quantidade.',
        'A lesão inicial é de subsuperfície: a camada externa fica relativamente preservada, e o mineral perdido pode ser reposto — mancha branca é reversível.',
      ],
      sections: [
        {
          heading: 'Solubilidade e saturação',
          bullets: [
            'O fluido do biofilme está normalmente supersaturado em cálcio e fosfato em relação à hidroxiapatita: o cristal não dissolve. Quando bactérias produzem ácido, H⁺ consome PO4³⁻ e OH⁻, a solução fica subsaturada e o mineral sai do esmalte.',
            'pH crítico não é constante universal: depende das concentrações de cálcio e fosfato na saliva e no biofilme de cada pessoa. É por isso que "5,5" é uma média, não uma lei.',
            'Ácidos da dieta (refrigerantes, pH 2,5–3,5) atacam diretamente a superfície: erosão, não cárie — a diferença está na presença de biofilme e no padrão de perda (subsuperfície vs superfície).',
          ],
        },
        {
          heading: 'A lesão de subsuperfície',
          bullets: [
            'Zonas histológicas da mancha branca (do fundo para a superfície): translúcida, escura, corpo da lesão (maior perda mineral, 20–50%) e camada superficial (quase intacta, ~1–10% de perda).',
            'A superfície se mantém porque recebe mineral reprecipitado da saliva e do próprio corpo da lesão, e porque fluoreto se concentra ali.',
            'Clinicamente: mancha branca opaca após secagem = perda de mineral suficiente para mudar a refração da luz. Ativa: rugosa, fosca, com biofilme. Inativa: lisa, brilhante, às vezes pigmentada.',
          ],
        },
        {
          heading: 'Remineralização',
          bullets: [
            'Quando o pH volta a subir, cálcio e fosfato da saliva e do biofilme reprecipitam sobre os cristais parcialmente dissolvidos. Com flúor presente, o novo mineral é fluor-hidroxiapatita, menos solúvel que o original.',
            'O balanço diário decide: muitos episódios ácidos longos → perda líquida (cárie progride); poucos episódios, saliva boa, flúor → ganho ou estabilidade.',
            'Featherstone (2004) descreve a cárie como um contínuo: fatores patológicos (bactérias acidogênicas, carboidrato frequente, hipossalivação) contra fatores protetores (saliva, flúor, cálcio/fosfato, antimicrobianos).',
          ],
        },
      ],
      clinicalBridge:
        'Cada orientação de dieta ("junte os doces em uma refeição") e cada aplicação de flúor em mancha branca é esta lição em ação. Quem entende a curva de Stephan explica a cárie para um pai em um minuto.',
      selfCheck: [
        {
          question: 'Por que a dentina começa a desmineralizar em um pH mais alto que o esmalte?',
          answer: 'Porque tem menos mineral, cristais menores e mais carbonato e magnésio na apatita, o que a torna mais solúvel: o pH crítico sobe para cerca de 6,2–6,7.',
        },
        {
          question: 'Cinco balas ao longo da tarde ou cinco balas de uma vez — qual cenário é pior para o esmalte?',
          answer: 'Ao longo da tarde. Cada exposição gera uma queda de pH de 30–60 minutos; espaçadas, o esmalte fica subsaturado a maior parte do tempo. Juntas, é um único episódio.',
        },
        {
          question: 'Como a camada superficial da mancha branca se mantém quase intacta?',
          answer: 'Recebe reprecipitação de mineral da saliva e do corpo da lesão e concentra flúor, o que a torna menos solúvel do que a subsuperfície que está sendo dissolvida por ácido que difunde através dela.',
        },
      ],
      refIds: ['featherstone-2004', 'robinson-2000'],
    },
    {
      id: 'bf-mecanismos-fluor',
      title: 'Como o flúor age: tópico, não sistêmico',
      summary: 'Os três mecanismos que importam e a evidência sobre concentração de dentifrício.',
      minutes: 8,
      keyPoints: [
        'Mecanismos principais: (1) inibe a desmineralização quando presente no fluido ao redor do cristal; (2) acelera a remineralização formando fluor-hidroxiapatita; (3) inibição enzimática bacteriana — efeito menor em concentrações usuais.',
        'O efeito é predominantemente tópico e pós-eruptivo: flúor incorporado ao esmalte durante a formação contribui pouco (Buzalaf 2011).',
        'Dentifrícios com ≥1000 ppm previnem cárie; abaixo de 1000 ppm a evidência é insuficiente (Cochrane, Walsh 2019). Duas vezes ao dia, sem enxaguar demais.',
        'Fluoreto de cálcio (CaF₂) formado após aplicações concentradas funciona como reservatório que libera flúor quando o pH cai.',
      ],
      sections: [
        {
          heading: 'Por que baixas concentrações constantes vencem',
          bullets: [
            'Featherstone (1999): concentrações de 0,02–0,1 ppm de F no fluido do biofilme já deslocam o equilíbrio para remineralização. O objetivo é manter flúor presente o dia todo, não "dose alta uma vez".',
            'Dentifrício deposita flúor na saliva, biofilme e superfícies; a concentração cai em ~1–2 horas, por isso a frequência (2×/dia) importa.',
            'Enxaguar vigorosamente com muita água reduz o benefício: cuspir o excesso e não bochechar é a orientação atual.',
          ],
        },
        {
          heading: 'Produtos e concentrações',
          bullets: [
            'Dentifrício: 1000–1500 ppm (uso geral); 5000 ppm para alto risco em maiores de 16 anos, sob prescrição.',
            'Verniz de NaF 5% (22.600 ppm): aplicação profissional, 2–4×/ano conforme risco; seguro em crianças pequenas pela pequena quantidade e adesão ao dente.',
            'Gel de flúor fosfato acidulado 1,23% (12.300 ppm): aplicação profissional, não recomendado para menores de 6 anos pelo risco de ingestão.',
            'Água de abastecimento: ~0,7 mg F/L (no Brasil a faixa ótima varia por região, em geral 0,6–0,8 mg/L). Efeito principal também tópico, pelo contato frequente.',
          ],
        },
        {
          heading: 'O que o flúor não faz',
          bullets: [
            'Não "mata" bactérias em concentração de dentifrício de forma relevante; a inibição de enolase e ATPase ocorre, mas o efeito clínico dominante é físico-químico.',
            'Não regenera esmalte perdido em cavidade; remineraliza lesão de subsuperfície com superfície íntegra.',
            'Não substitui controle de biofilme e dieta — desloca o equilíbrio, não elimina a causa.',
          ],
        },
      ],
      clinicalBridge:
        'Prescrever dentifrício 1000 ppm para uma criança de dois anos (em quantidade de grão de arroz) é a prática baseada em evidência que você vai defender diante de pais preocupados.',
      selfCheck: [
        {
          question: 'Qual dos mecanismos do flúor é o mais importante na prática e por quê?',
          answer: 'A ação tópica no equilíbrio mineral: inibir desmineralização e acelerar remineralização formando fluor-hidroxiapatita. O efeito sistêmico pré-eruptivo é pequeno.',
        },
        {
          question: 'Dentifrício de 500 ppm previne cárie?',
          answer: 'A revisão Cochrane (Walsh 2019) não encontrou evidência de efeito abaixo de 1000 ppm. A recomendação é ≥1000 ppm para todas as idades, ajustando a quantidade.',
        },
        {
          question: 'Para que serve o CaF₂ que se forma após o verniz?',
          answer: 'É um reservatório: estável em pH neutro, dissolve quando o pH do biofilme cai e libera flúor exatamente na hora do ataque ácido.',
        },
      ],
      refIds: ['buzalaf-2011', 'tencate-2013', 'featherstone-1999', 'walsh-2019'],
    },
    {
      id: 'bf-fluorose-seguranca',
      title: 'Fluorose e segurança: dose, idade e risco',
      summary: 'Quanto é demais, quando o esmalte está vulnerável e o que fazer se uma criança come o tubo.',
      minutes: 7,
      keyPoints: [
        'Fluorose é hipomineralização do esmalte por ingestão crônica de flúor durante a formação dental; para incisivos centrais superiores a janela crítica é ~15–30 meses de idade (Evans & Darvell 1995).',
        'A principal fonte de ingestão em crianças pequenas é dentifrício engolido: por isso a quantidade — grão de arroz até 3 anos, grão de ervilha de 3 a 6 — e a supervisão.',
        'Dose provavelmente tóxica (DPT): ~5 mg F/kg. Um tubo de 90 g com 1100 ppm tem ~100 mg de F — quantidade relevante para uma criança de 10 kg.',
        'Fluorose leve é estética (linhas e manchas brancas opacas); formas graves (pigmentação, perda de esmalte) são raras onde a água é controlada.',
      ],
      sections: [
        {
          heading: 'Fluorose dental',
          bullets: [
            'Mecanismo: excesso de flúor interfere na remoção das proteínas da matriz durante a maturação do esmalte → esmalte poroso, hipomineralizado, com aparência opaca.',
            'Dose-dependente e cumulativa durante o período de formação (até ~6–8 anos para a maior parte dos dentes permanentes). Depois que o esmalte está pronto, não há mais risco de fluorose.',
            'Classificação de Dean (normal, questionável, muito leve, leve, moderada, severa) ainda é usada em epidemiologia. Diferencial: hipomineralização molar-incisivo (MIH), manchas brancas de cárie, amelogênese imperfeita.',
          ],
        },
        {
          heading: 'Quantidade certa para cada idade',
          bullets: [
            'Antes de 3 anos: esfregaço/grão de arroz de dentifrício ≥1000 ppm, escovação pelo adulto, 2×/dia (Wright 2014; AAPD; ADA).',
            '3 a 6 anos: grão de ervilha, supervisionado, ensinar a cuspir.',
            'Bochecho fluoretado (0,05% NaF diário ou 0,2% semanal) apenas para quem consegue cuspir de forma confiável — em geral acima de 6 anos.',
            'Água, alimentos e suplementos somam: em regiões com água fluoretada, suplementos sistêmicos não são recomendados.',
          ],
        },
        {
          heading: 'Toxicidade aguda',
          bullets: [
            'Sintomas iniciais: náusea, vômito, dor abdominal, salivação — o flúor forma HF no estômago e depois liga cálcio (hipocalcemia, arritmias em doses altas).',
            'Ingestão < 5 mg/kg: dar leite ou alimento rico em cálcio e observar. ≥ 5 mg/kg: encaminhar a pronto-socorro; induzir vômito só se orientado.',
            'Prevenção no consultório: aplicar verniz em vez de gel em crianças pequenas, usar sugador com gel, manter tubos fora do alcance.',
          ],
        },
      ],
      clinicalBridge:
        'Você vai calcular: criança de 12 kg, tubo de 90 g a 1100 ppm. Quanto é a DPT (60 mg) e quanto tem no tubo (99 mg)? Saber fazer essa conta em 20 segundos é segurança do paciente.',
      selfCheck: [
        {
          question: 'Quando o incisivo central superior está mais vulnerável à fluorose?',
          answer: 'Aproximadamente entre 15 e 30 meses de idade, durante a fase de maturação do esmalte desse dente. Depois que o esmalte se completa, não há mais risco para ele.',
        },
        {
          question: 'Quanto flúor há em um tubo de 90 g a 1100 ppm e para que peso isso atinge a DPT?',
          answer: '1100 ppm = 1,1 mg/g → ~99 mg de F no tubo. A DPT é ~5 mg/kg, então um tubo inteiro atinge a DPT para uma criança de até ~20 kg.',
        },
        {
          question: 'Por que reduzir a concentração do dentifrício infantil para 500 ppm não é a resposta para o risco de fluorose?',
          answer: 'Porque 500 ppm não tem evidência de prevenir cárie. A estratégia com evidência é manter ≥1000 ppm e controlar a quantidade (grão de arroz/ervilha) e a supervisão.',
        },
      ],
      refIds: ['evans-1995', 'wright-2014', 'whitford-2011'],
    },
  ],
};
