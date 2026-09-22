import type { BaseDiscipline } from '../types';

export const cariologia: BaseDiscipline = {
  id: 'cariologia',
  title: 'Cariologia',
  short: 'Cariologia',
  tagline: 'Doença, lesão, ICDAS e manejo não restaurador',
  period: 3,
  colaTopic: 'preventiva',
  references: [
    {
      id: 'pitts-2017',
      authors: 'Pitts NB, Zero DT, Marsh PD, Ekstrand K, Weintraub JA, Ramos-Gomez F, et al.',
      title: 'Dental caries',
      journal: 'Nature Reviews Disease Primers',
      year: 2017,
      doi: '10.1038/nrdp.2017.30',
      why: 'Definição atual de cárie como doença dinâmica, mediada por biofilme e açúcar.',
    },
    {
      id: 'selwitz-2007',
      authors: 'Selwitz RH, Ismail AI, Pitts NB',
      title: 'Dental caries',
      journal: 'The Lancet',
      year: 2007,
      doi: '10.1016/S0140-6736(07)60031-2',
      why: 'Seminário do Lancet: epidemiologia, etiologia e manejo.',
    },
    {
      id: 'kidd-2004',
      authors: 'Kidd EAM, Fejerskov O',
      title: 'What constitutes dental caries? Histopathology of carious enamel and dentin related to the action of cariogenic biofilms',
      journal: 'Journal of Dental Research',
      year: 2004,
      doi: '10.1177/154405910408301s07',
      why: 'Histopatologia da lesão e a distinção entre dentina afetada e infectada.',
    },
    {
      id: 'ismail-2007',
      authors: 'Ismail AI, Sohn W, Tellez M, Amaya A, Sen A, Hasson H, Pitts NB',
      title: 'The International Caries Detection and Assessment System (ICDAS): an integrated system for measuring dental caries',
      journal: 'Community Dentistry and Oral Epidemiology',
      year: 2007,
      doi: '10.1111/j.1600-0528.2007.00347.x',
      why: 'Artigo que apresenta os códigos ICDAS usados no resumo.',
    },
    {
      id: 'nyvad-1999',
      authors: 'Nyvad B, Machiulskiene V, Baelum V',
      title: 'Reliability of a new caries diagnostic system differentiating between active and inactive caries lesions',
      journal: 'Caries Research',
      year: 1999,
      doi: '10.1159/000016526',
      why: 'Critérios clínicos para diferenciar lesão ativa de inativa.',
    },
    {
      id: 'slayton-2018',
      authors: 'Slayton RL, Urquhart O, Araujo MWB, Fontana M, Guzmán-Armstrong S, Nascimento MM, et al.',
      title: 'Evidence-based clinical practice guideline on nonrestorative treatments for carious lesions: A report from the American Dental Association',
      journal: 'The Journal of the American Dental Association',
      year: 2018,
      doi: '10.1016/j.adaj.2018.07.002',
      why: 'Diretriz ADA: o que usar em cada tipo de lesão para paralisar ou reverter sem restaurar.',
    },
    {
      id: 'schwendicke-2016',
      authors: 'Schwendicke F, Frencken JE, Bjørndal L, Maltz M, Manton DJ, Ricketts D, et al.',
      title: 'Managing Carious Lesions: Consensus Recommendations on Carious Tissue Removal',
      journal: 'Advances in Dental Research',
      year: 2016,
      doi: '10.1177/0022034516639271',
      why: 'Consenso ICCC sobre remoção seletiva de tecido cariado.',
    },
    {
      id: 'gao-2016',
      authors: 'Gao SS, Zhao IS, Hiraishi N, Duangthip D, Mei ML, Lo ECM, Chu CH',
      title: 'Clinical Trials of Silver Diamine Fluoride in Arresting Caries among Children: A Systematic Review',
      journal: 'JDR Clinical & Translational Research',
      year: 2016,
      doi: '10.1177/2380084416661474',
      why: 'Evidência do diamino fluoreto de prata para paralisar lesões cavitadas.',
    },
  ],
  mindMap: {
    label: 'Cariologia',
    children: [
      {
        label: 'Doença vs lesão',
        children: [
          { label: 'Doença', note: 'Biofilme + açúcar + tempo + hospedeiro. Dinâmica.' },
          { label: 'Lesão', note: 'O sinal: mancha branca → cavidade.' },
          { label: 'Ativa vs inativa', note: 'Fosca e rugosa vs lisa e brilhante.' },
        ],
      },
      {
        label: 'Detecção',
        children: [
          { label: 'Limpo, seco, iluminado', note: 'Cinco segundos de ar.' },
          { label: 'ICDAS 0–6', note: '1–2 esmalte visual · 3 microcavidade · 4 sombra · 5–6 cavidade.' },
          { label: 'Sonda', note: 'Sem forçar. Sonda romba para textura.' },
          { label: 'Bite-wing', note: 'Proximais e profundidade.' },
        ],
      },
      {
        label: 'Manejo não restaurador',
        children: [
          { label: 'Verniz de flúor', note: 'Manchas brancas, 2–4×/ano.' },
          { label: 'Selante / infiltrante', note: 'Oclusais e proximais não cavitadas.' },
          { label: 'SDF 38%', note: 'Paralisa cavidades. Mancha de preto.' },
          { label: 'Dieta e biofilme', note: 'Sempre. É o tratamento da doença.' },
        ],
      },
      {
        label: 'Quando restaurar',
        children: [
          { label: 'Cavidade não limpável', note: 'Ou comprometendo função/estética.' },
          { label: 'Remoção seletiva', note: 'Deixa dentina afetada perto da polpa.' },
        ],
      },
    ],
  },
  lessons: [
    {
      id: 'ca-doenca-lesao',
      title: 'Cárie é doença, lesão é sinal',
      summary: 'A mudança de mentalidade que separa quem trata buraco de quem trata paciente.',
      minutes: 8,
      keyPoints: [
        'Cárie: doença crônica, não transmissível, mediada por biofilme e dependente de açúcar, multifatorial e dinâmica (Pitts 2017). A lesão (mancha, cavidade) é o sinal, não a doença.',
        'Restaurar trata a lesão; controlar dieta, biofilme, flúor e saliva trata a doença. Fazer só o primeiro é garantir a próxima lesão.',
        'Lesão ativa: opaca, fosca, rugosa, sob biofilme, em local de estagnação. Inativa: lisa, brilhante, às vezes escura, em local limpável (Nyvad 1999).',
        'Dentina afetada (desmineralizada, colágeno preservado, remineralizável) é diferente de dentina infectada (colágeno destruído, carregada de bactérias): só a segunda precisa sair.',
      ],
      sections: [
        {
          heading: 'Etiologia em camadas',
          bullets: [
            'Determinantes biológicos: biofilme cariogênico, açúcar frequente, saliva insuficiente, dente suscetível (esmalte imaturo, defeitos).',
            'Determinantes comportamentais: frequência de ingestão, higiene, exposição a flúor, acesso a cuidado.',
            'Determinantes sociais: renda, educação, disponibilidade de alimentos ultraprocessados — a cárie se concentra em quem tem menos (Selwitz 2007).',
            'Tempo é o fator silencioso: lesões de esmalte levam meses a anos para progredir; há janela para intervir sem broca.',
          ],
        },
        {
          heading: 'Anatomia da lesão',
          bullets: [
            'Esmalte: lesão em cone com base na superfície (lisa) ou com base na junção amelodentinária (oclusal, seguindo os prismas). Zonas: superfície, corpo, escura, translúcida.',
            'Dentina: quando o ácido atinge a JAD, espalha-se lateralmente e a lesão de dentina é mais larga que a de esmalte ("sombra" que aparece na ICDAS 4).',
            'Camadas da dentina cariada (Kidd & Fejerskov 2004): infectada (necrótica, amolecida, úmida, colágeno desnaturado) e afetada (desmineralizada, mais firme, colágeno íntegro, túbulos com esclerose reativa).',
            'A polpa responde desde o esmalte: esclerose tubular e dentina terciária sob a lesão — é por isso que lesões lentas raramente causam pulpite.',
          ],
        },
        {
          heading: 'Atividade decide conduta',
          bullets: [
            'Lesão inativa não precisa de tratamento além de manter o controle — mesmo pigmentada.',
            'Lesão ativa não cavitada: tratamento não restaurador (flúor, selante, mudança de comportamento). Ativa cavitada e não limpável: restaurar ou paralisar com SDF, e tratar a doença.',
            'Reavaliar em 3–6 meses é parte do tratamento: sem controle de atividade não há como saber se funcionou.',
          ],
        },
      ],
      clinicalBridge:
        'O odontograma do Academy pede que você marque lesões — mas o plano de tratamento começa com "controle da doença" antes de qualquer restauração. Esta lição é a razão.',
      selfCheck: [
        {
          question: 'Um paciente com sete restaurações novas e nenhuma mudança na dieta está tratado?',
          answer: 'Não. Foram tratadas sete lesões; a doença (biofilme + açúcar frequente) continua e produzirá novas lesões e falhas nas margens.',
        },
        {
          question: 'Como diferenciar clinicamente uma mancha branca ativa de uma inativa?',
          answer: 'Ativa: opaca, fosca, superfície rugosa à sonda romba, coberta por biofilme, em área de estagnação (margem gengival, fóssulas). Inativa: brilhante, lisa, frequentemente longe da gengiva ou em área limpável.',
        },
        {
          question: 'Por que a dentina afetada deve ser preservada?',
          answer: 'Porque tem colágeno íntegro e pode remineralizar; removê-la só aproxima a cavidade da polpa e aumenta o risco de exposição sem benefício.',
        },
      ],
      refIds: ['pitts-2017', 'selwitz-2007', 'kidd-2004', 'nyvad-1999'],
    },
    {
      id: 'ca-icdas',
      title: 'Detecção e classificação: ICDAS e atividade',
      summary: 'Códigos de 0 a 6, exame padronizado e quando pedir bite-wing.',
      minutes: 8,
      keyPoints: [
        'Exame: dente limpo, seco (5 segundos de ar) e bem iluminado. Sonda só para remover placa e sentir textura — nunca para "furar" mancha branca.',
        'ICDAS: 0 hígido · 1 primeira mudança visual só após secagem · 2 mudança visual distinta úmida · 3 ruptura localizada do esmalte sem dentina visível · 4 sombra escura de dentina sob esmalte · 5 cavidade distinta com dentina visível · 6 cavidade extensa.',
        'Códigos 1–2: manejo não restaurador. Código 3: selante ou infiltrante/restauração mínima. Códigos 4–6: em geral restaurador ou paralisação.',
        'Bite-wing é o exame para proximais e para estimar profundidade; panorâmica não serve para cárie.',
      ],
      sections: [
        {
          heading: 'Preparar o exame',
          bullets: [
            'Profilaxia antes do exame: biofilme e cálculo escondem lesões incipientes.',
            'Secagem prolongada (5 s) revela mancha branca porosa que fica invisível úmida — é a diferença entre ICDAS 1 e 2.',
            'Iluminação direta e espelho seco; afastadores para faces livres. Fio dental pode sinalizar cavitação proximal (desfia).',
            'Sonda pontiaguda forçada em lesão não cavitada quebra a superfície e converte uma lesão remineralizável em cavidade. Use sonda de ponta romba (WHO/CPI).',
          ],
        },
        {
          heading: 'Os códigos ICDAS',
          bullets: [
            'ICDAS 1: opacidade branca/marrom visível só após secagem, limitada a fóssulas, sulcos ou área de estagnação.',
            'ICDAS 2: opacidade visível com o dente úmido; ainda sem ruptura de superfície.',
            'ICDAS 3: microcavidade localizada no esmalte — a sonda romba sente a descontinuidade; sem dentina visível.',
            'ICDAS 4: sombra cinza/azulada/marrom da dentina subjacente vista através de esmalte aparentemente íntegro.',
            'ICDAS 5: cavidade em esmalte com dentina visível, menos da metade da superfície. ICDAS 6: cavidade extensa, mais da metade, pode atingir polpa.',
            'O sistema registra separadamente o código de restauração/selante (primeiro dígito) e o de cárie (segundo dígito).',
          ],
        },
        {
          heading: 'Imagem e complementos',
          bullets: [
            'Bite-wing (interproximal): lesões proximais aparecem como triângulo radiolúcido com base na superfície; classifique por profundidade (E1 metade externa do esmalte, E2 metade interna, D1 terço externo da dentina, D2, D3).',
            'Lesão radiográfica em esmalte ou D1 sem cavitação clínica: manejo não restaurador e controle radiográfico em 12–24 meses conforme risco.',
            'Transiluminação por fibra óptica e fluorescência são auxiliares; não substituem o exame visual padronizado.',
          ],
        },
      ],
      clinicalBridge:
        'Registrar ICDAS no odontograma torna o plano rastreável: você compara o código em seis meses e prova ao professor que a lesão parou.',
      selfCheck: [
        {
          question: 'Qual a diferença entre ICDAS 1 e ICDAS 2?',
          answer: 'ICDAS 1 só é visível depois de secar o dente por cerca de 5 segundos; ICDAS 2 é visível mesmo com o dente úmido. Ambos são lesões de esmalte sem ruptura.',
        },
        {
          question: 'O que o código ICDAS 4 indica sobre a profundidade?',
          answer: 'Que a lesão já atingiu a dentina (sombra escura visível através do esmalte), embora a superfície do esmalte pareça íntegra ou tenha apenas microcavidade.',
        },
        {
          question: 'Por que não se usa sonda exploradora afiada para "confirmar" cárie em fóssulas?',
          answer: 'Porque a sonda pode romper a camada superficial de uma lesão remineralizável, transformando-a em cavidade, e a retenção da ponta reflete a anatomia do sulco, não a presença de cárie.',
        },
      ],
      refIds: ['ismail-2007', 'nyvad-1999'],
    },
    {
      id: 'ca-nao-restaurador',
      title: 'Manejo não restaurador: quando não abrir o dente',
      summary: 'Flúor, selante, infiltrante e SDF — o que a diretriz da ADA recomenda para cada lesão.',
      minutes: 9,
      keyPoints: [
        'Lesões não cavitadas em superfícies lisas e oclusais: verniz de flúor 5% NaF (2–4×/ano) e/ou selante (oclusal). Em proximais não cavitadas: infiltrante resinoso ou verniz (Slayton 2018).',
        'Lesões cavitadas em dentina quando restauração não é viável agora: diamino fluoreto de prata 38% (SDF) paralisa a maioria em 1–2 aplicações anuais, com mancha preta na lesão (Gao 2016).',
        'Quando restaurar: remoção seletiva — em lesões profundas, deixar dentina afetada na parede pulpar e limpar as paredes periféricas até dentina dura (Schwendicke 2016). Evitar exposição pulpar.',
        'Nada disso funciona sem tratar a doença: dieta, biofilme, flúor de uso diário.',
      ],
      sections: [
        {
          heading: 'Superfícies lisas e oclusais não cavitadas',
          bullets: [
            'Verniz de NaF 5%: aplicação profissional em manchas brancas ativas, 2 a 4 vezes por ano conforme risco. Eficaz em decíduos e permanentes.',
            'Selante resinoso ou de ionômero em oclusais com ICDAS 1–3: impede acesso de substrato ao biofilme na fóssula; lesões seladas paralisam.',
            'Dentifrício 1000–1500 ppm 2×/dia é a base; 5000 ppm em alto risco (≥16 anos). Gel de FFA 1,23% em ≥6 anos como alternativa profissional.',
          ],
        },
        {
          heading: 'Proximais não cavitadas',
          bullets: [
            'Lesão radiográfica em esmalte ou D1 sem cavitação (verificar com separador ou fio): infiltrante resinoso (ácido clorídrico 15% + resina de baixa viscosidade) ou verniz de flúor.',
            'Selar proximal com adesivo é opção com evidência moderada. Restaurar é a última escolha — a restauração proximal encurta a vida do dente.',
            'Controle radiográfico: 12 meses em alto risco, 24 em baixo.',
          ],
        },
        {
          heading: 'Cavidades e a remoção seletiva',
          bullets: [
            'SDF 38%: paralisa cerca de 80% das lesões cavitadas em decíduos com aplicação anual ou semestral; indicado em crianças pequenas, pacientes com necessidades especiais, idosos com cárie radicular e em saúde pública. Mancha o tecido cariado de preto e o paciente/responsável deve consentir.',
            'Tratamento restaurador atraumático (ART): remoção manual de tecido amolecido + CIV de alta viscosidade; adequado quando não há isolamento ou motor disponível.',
            'Remoção seletiva (ICCC 2016): em lesões rasas/moderadas, remover até dentina firme; em lesões profundas (último quarto/terço da dentina), remover até dentina amolecida na parede pulpar, mantendo a dentina afetada para evitar exposição. Paredes periféricas sempre em dentina dura para vedar.',
            'Remoção em etapas (stepwise) e capeamento pulpar indireto são variações para lesões muito profundas em dentes com polpa vital sem sintomas de pulpite irreversível.',
          ],
        },
      ],
      clinicalBridge:
        'Na clínica você vai propor selante ou verniz onde muitos ainda proporiam restauração — e precisa justificar com a diretriz. Esta lição é a justificativa.',
      selfCheck: [
        {
          question: 'Lesão proximal radiográfica na metade interna do esmalte (E2), sem cavitação. Conduta?',
          answer: 'Não restaurar. Infiltrante resinoso ou verniz de flúor, controle de dieta e biofilme, e controle radiográfico em 12–24 meses conforme o risco.',
        },
        {
          question: 'Quais os limites de remoção de tecido cariado em uma lesão profunda em dente vital assintomático?',
          answer: 'Paredes periféricas até dentina dura (para vedamento) e parede pulpar apenas até remover dentina amolecida, deixando dentina afetada para não expor a polpa.',
        },
        {
          question: 'Qual o principal efeito colateral do SDF e como ele condiciona o uso?',
          answer: 'Mancha preta permanente no tecido cariado (e temporária em mucosa/pele). Exige explicação e consentimento, e limita o uso em anteriores por motivo estético.',
        },
      ],
      refIds: ['slayton-2018', 'schwendicke-2016', 'gao-2016'],
    },
  ],
};
