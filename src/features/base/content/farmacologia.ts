import type { BaseDiscipline } from '../types';

export const farmacologia: BaseDiscipline = {
  id: 'farmacologia',
  title: 'Farmacologia para odontologia',
  short: 'Farmacologia',
  tagline: 'Anestésicos locais, analgesia e antibióticos com evidência',
  period: 4,
  colaTopic: 'farmacologia',
  references: [
    {
      id: 'becker-2012',
      authors: 'Becker DE, Reed KL',
      title: 'Local anesthetics: review of pharmacological considerations',
      journal: 'Anesthesia Progress',
      year: 2012,
      doi: '10.2344/0003-3006-59.2.90',
      why: 'Farmacologia dos anestésicos locais: pKa, ligação proteica, vasoconstritores, doses.',
    },
    {
      id: 'aapd-anestesia',
      authors: 'American Academy of Pediatric Dentistry',
      title: 'Use of Local Anesthesia for Pediatric Dental Patients (Best Practices)',
      journal: 'The Reference Manual of Pediatric Dentistry',
      year: 2022,
      url: 'https://www.aapd.org/globalassets/media/policies_guidelines/bp_localanesthesia.pdf',
      why: 'Tabela de doses máximas por peso, referência da Cola de anestesia.',
    },
    {
      id: 'moore-2013',
      authors: 'Moore PA, Hersh EV',
      title: 'Combining ibuprofen and acetaminophen for acute pain management after third-molar extractions: translating clinical research to dental practice',
      journal: 'The Journal of the American Dental Association',
      year: 2013,
      doi: '10.14219/jada.archive.2013.0207',
      why: 'A combinação ibuprofeno + paracetamol supera opioides na dor dental aguda.',
    },
    {
      id: 'moore-2018',
      authors: 'Moore PA, Ziegler KM, Lipman RD, Aminoshariae A, Carrasco-Labra A, Mariotti A',
      title: 'Benefits and harms associated with analgesic medications used in the management of acute dental pain: An overview of systematic reviews',
      journal: 'The Journal of the American Dental Association',
      year: 2018,
      doi: '10.1016/j.adaj.2018.02.012',
      why: 'Overview de revisões sistemáticas: eficácia e riscos de cada analgésico.',
    },
    {
      id: 'carrasco-labra-2024',
      authors: 'Carrasco-Labra A, Polk DE, Urquhart O, Aghaloo T, Claytor JW Jr, Dhar V, et al.',
      title: 'Evidence-based clinical practice guideline for the pharmacologic management of acute dental pain in adolescents, adults, and older adults',
      journal: 'The Journal of the American Dental Association',
      year: 2024,
      doi: '10.1016/j.adaj.2023.10.009',
      why: 'Diretriz ADA 2024: AINE (± paracetamol) como primeira linha; opioide apenas como exceção.',
    },
    {
      id: 'lockhart-2019',
      authors: 'Lockhart PB, Tampi MP, Abt E, Aminoshariae A, Durkin MJ, Fouad AF, et al.',
      title: 'Evidence-based clinical practice guideline on antibiotic use for the urgent management of pulpal- and periapical-related dental pain and intraoral swelling',
      journal: 'The Journal of the American Dental Association',
      year: 2019,
      doi: '10.1016/j.adaj.2019.08.020',
      why: 'Diretriz ADA: quando (não) prescrever antibiótico na dor de origem endodôntica.',
    },
    {
      id: 'wilson-2021',
      authors: 'Wilson WR, Gewitz M, Lockhart PB, Bolger AF, DeSimone DC, Kazi DS, et al.',
      title: 'Prevention of Viridans Group Streptococcal Infective Endocarditis: A Scientific Statement From the American Heart Association',
      journal: 'Circulation',
      year: 2021,
      doi: '10.1161/CIR.0000000000000969',
      why: 'Atualização da AHA sobre profilaxia de endocardite em procedimentos odontológicos.',
    },
    {
      id: 'sollecito-2015',
      authors: 'Sollecito TP, Abt E, Lockhart PB, Truelove E, Paumier TM, Tracy SL, et al.',
      title: 'The use of prophylactic antibiotics prior to dental procedures in patients with prosthetic joints: Evidence-based clinical practice guideline for dental practitioners',
      journal: 'The Journal of the American Dental Association',
      year: 2015,
      doi: '10.1016/j.adaj.2014.11.012',
      why: 'Diretriz ADA: em geral, não há indicação de profilaxia para próteses articulares.',
    },
  ],
  mindMap: {
    label: 'Farmacologia',
    children: [
      {
        label: 'Anestésicos locais',
        children: [
          { label: 'Mecanismo', note: 'Bloqueio de canais de Na⁺ pela forma ionizada, por dentro.' },
          { label: 'pKa e latência', note: 'Lidocaína 7,9 (rápida) · bupivacaína 8,1 (lenta).' },
          { label: 'Inflamação', note: 'pH baixo → menos base livre → falha.' },
          { label: 'Vasoconstritor', note: '↑ duração, ↓ toxicidade e sangramento.' },
          { label: 'Dose máxima', note: 'Calcular por peso. Sempre.' },
        ],
      },
      {
        label: 'Analgesia',
        children: [
          { label: '1ª linha', note: 'Ibuprofeno 400 mg ± paracetamol 1 g.' },
          { label: 'AINE: cuidados', note: 'Renal, úlcera, anticoagulante, asma, gestação.' },
          { label: 'Opioide', note: 'Exceção. Não é primeira linha.' },
        ],
      },
      {
        label: 'Antibióticos',
        children: [
          { label: 'Dor pulpar/apical', note: 'Tratamento dental, não antibiótico.' },
          { label: 'Sinais sistêmicos', note: 'Febre, celulite, mal-estar → amoxicilina.' },
          { label: 'Profilaxia EI', note: 'Só alto risco. Amoxicilina 2 g 30–60 min antes.' },
          { label: 'Próteses articulares', note: 'Em geral, não.' },
        ],
      },
    ],
  },
  lessons: [
    {
      id: 'fa-anestesicos',
      title: 'Anestésicos locais: como bloqueiam, quanto usar',
      summary: 'A farmacologia por trás de cada tubete — para calcular dose e prever falha em vez de decorar.',
      minutes: 10,
      keyPoints: [
        'Bloqueiam canais de sódio voltagem-dependentes pelo lado interno da membrana; a molécula precisa atravessar a membrana como base (não ionizada) e agir como cátion (ionizada).',
        'pKa define latência: quanto mais perto do pH tecidual (7,4), mais base livre e mais rápido o início. Lidocaína/articaína/mepivacaína ~7,7–7,9 (2–4 min); bupivacaína 8,1 (mais lenta, mais longa).',
        'Tecido inflamado tem pH baixo → mais forma ionizada → menos droga atravessa a membrana → falha anestésica. Solução: bloqueio à distância da inflamação, técnicas complementares.',
        'Dose máxima calcula-se por peso. Lidocaína 2% com epinefrina: 4,4 mg/kg (máx. 300 mg) pela AAPD; bulas e Malamed aceitam até 7 mg/kg (máx. 500 mg). Um tubete de 1,8 mL a 2% tem 36 mg. Siga o protocolo da sua disciplina.',
      ],
      sections: [
        {
          heading: 'Molécula e mecanismo',
          bullets: [
            'Estrutura: anel aromático lipofílico + cadeia intermediária (amida ou éster) + amina terciária hidrofílica. Amidas (lidocaína, articaína, mepivacaína, prilocaína, bupivacaína) são metabolizadas no fígado; a articaína também é hidrolisada no plasma (meia-vida curta — ~20–40 min).',
            'Ésteres (procaína, benzocaína) são hidrolisados por esterases plasmáticas e geram PABA — alergia verdadeira é mais comum com ésteres; com amidas é rara (suspeitar de metabissulfito do vasoconstritor ou de reação vasovagal).',
            'Fibras menores e mielinizadas finas (Aδ, dor e temperatura) bloqueiam antes das grossas (Aβ, tato e pressão) — por isso o paciente "sente pressão, mas não dor".',
          ],
        },
        {
          heading: 'Vasoconstritor e escolha',
          bullets: [
            'Epinefrina 1:100.000 (0,01 mg/mL) ou 1:200.000: reduz absorção → menor pico plasmático (menos toxicidade), maior duração, campo mais seco.',
            'Cardiopata controlado: limite de 0,04 mg de epinefrina por sessão (~2 tubetes de 1:100.000 ou 4 de 1:200.000). Evitar em feocromocitoma, hipertireoidismo descompensado, uso de cocaína nas 24 h.',
            'Mepivacaína 3% sem vasoconstritor: procedimentos curtos e pacientes com contraindicação a epinefrina; duração pulpar ~20–40 min.',
            'Articaína 4% com epi: difusão óssea superior (grupo tiofeno), útil em infiltrativa de molares inferiores. Relatos de parestesia após bloqueios com articaína geraram debate; a evidência é controversa — siga o protocolo da disciplina.',
            'Bupivacaína 0,5%: dor pós-operatória em cirurgias longas; não em crianças (risco de mordedura de lábio).',
          ],
        },
        {
          heading: 'Dose, toxicidade e falha',
          bullets: [
            'Calcular: peso × mg/kg = dose máxima em mg; dividir por mg/tubete. Criança de 20 kg com lidocaína 2% + epi a 4,4 mg/kg: 88 mg → 2,4 tubetes. Nunca "um tubete padrão" em criança.',
            'Toxicidade sistêmica: primeiro SNC (tontura, zumbido, gosto metálico, agitação → convulsão → depressão), depois cardiovascular (bradicardia, hipotensão, arritmia). Prevenção: aspiração antes de injetar, injeção lenta (1 mL/min), dose por peso.',
            'Metemoglobinemia: prilocaína e benzocaína em doses altas. Interações: propranolol reduz clearance da lidocaína; antidepressivos tricíclicos potencializam a epinefrina.',
            'Falha: inflamação (pH), anatomia (inervação acessória), técnica, ansiedade. A Cola de anestesia é a continuação clínica desta lição.',
          ],
        },
      ],
      clinicalBridge:
        'Antes do primeiro tubete no box você vai calcular a dose em voz alta para o professor. Esta lição é a conta e a explicação de por que o dente inflamado não anestesia.',
      selfCheck: [
        {
          question: 'Por que o dente com pulpite aguda é mais difícil de anestesiar?',
          answer: 'O pH tecidual baixo aumenta a fração ionizada do anestésico, que não atravessa a membrana; além disso, há hiperemia (remove a droga mais rápido) e nociceptores sensibilizados. Bloqueio à distância e técnicas complementares (intraligamentar, intraóssea, intrapulpar) compensam.',
        },
        {
          question: 'Quantos tubetes de lidocaína 2% com epinefrina uma criança de 15 kg pode receber, no limite de 4,4 mg/kg?',
          answer: '15 × 4,4 = 66 mg. Cada tubete de 1,8 mL a 2% tem 36 mg. Portanto ~1,8 tubetes — arredondar para baixo: no máximo 1 tubete e meio, com margem.',
        },
        {
          question: 'Quais são os primeiros sinais de toxicidade sistêmica por anestésico local?',
          answer: 'Sinais de excitação do SNC: tontura, zumbido, gosto metálico, dormência perioral, agitação, fala arrastada. Podem evoluir para convulsão e depois depressão do SNC e cardiovascular.',
        },
      ],
      refIds: ['becker-2012', 'aapd-anestesia'],
    },
    {
      id: 'fa-analgesia',
      title: 'Analgesia e anti-inflamatórios: o que a evidência diz',
      summary: 'Ibuprofeno mais paracetamol vence opioide. Os cuidados com AINE que você precisa saber antes de prescrever.',
      minutes: 8,
      keyPoints: [
        'Diretriz ADA 2024 (Carrasco-Labra): para dor dental aguda em adolescentes e adultos, AINE (ibuprofeno 400 mg) isolado ou com paracetamol (1000 mg) é a primeira linha; opioides só como exceção e por curto tempo.',
        'AINEs inibem COX-1/COX-2 → menos prostaglandinas → menos sensibilização de nociceptores e menos edema. Paracetamol age no SNC, sem efeito anti-inflamatório periférico relevante, e é poupador de rim e estômago.',
        'Cuidados com AINE: insuficiência renal, úlcera/sangramento GI, anticoagulantes, insuficiência cardíaca, asma sensível a AINE, 3º trimestre de gestação. Paracetamol: máx. 3–4 g/dia, hepatopatia e álcool.',
        'Corticoide em dose única pré-operatória (dexametasona 4–8 mg) reduz edema e trismo em cirurgia de terceiros molares; não é analgésico de rotina.',
      ],
      sections: [
        {
          heading: 'Escada da dor dental',
          bullets: [
            'Dor leve: ibuprofeno 400 mg a cada 6–8 h ou paracetamol 500–1000 mg a cada 6 h.',
            'Dor moderada a intensa: ibuprofeno 400 mg + paracetamol 1000 mg juntos, a cada 6–8 h, por 2–3 dias. A combinação tem NNT melhor do que qualquer opioide oral em dor pós-exodontia (Moore & Hersh 2013).',
            'Primeira dose antes que o efeito anestésico passe ("analgesia preemptiva/perioperatória") reduz o pico de dor.',
            'Opioides (codeína, tramadol): eficácia modesta, mais efeitos adversos (náusea, sedação, constipação), risco de dependência — reservar para quando AINE e paracetamol são contraindicados ou insuficientes, no menor tempo possível.',
          ],
        },
        {
          heading: 'Quem não pode tomar AINE',
          bullets: [
            'Renal: AINE reduz prostaglandinas que mantêm o fluxo renal; evitar em doença renal crônica, idosos desidratados, uso de IECA/diurético ("triple whammy").',
            'Gastrointestinal: história de úlcera ou sangramento, uso de corticoide ou anticoagulante — se necessário, ibuprofeno na menor dose por 1–2 dias com protetor gástrico, ou preferir paracetamol.',
            'Cardiovascular: insuficiência cardíaca, infarto recente; diclofenaco tem maior risco CV; naproxeno menor.',
            'Gestação: paracetamol é a escolha; AINE contraindicado no 3º trimestre (fechamento precoce do ducto arterioso, oligoidrâmnio). Asma com intolerância a AINE: paracetamol.',
          ],
        },
        {
          heading: 'Anti-inflamatórios esteroidais e outras notas',
          bullets: [
            'Dexametasona 4–8 mg VO ou IM 1 h antes de cirurgia de terceiro molar reduz edema e trismo; dose única não suprime o eixo adrenal. Evitar em diabéticos descompensados e infecção ativa não drenada.',
            'Dipirona (metamizol) é amplamente usada no Brasil como analgésico/antitérmico; evidência razoável para dor aguda; risco raro de agranulocitose. Não é AINE clássico.',
            'Sempre: prescrição por escrito com dose, intervalo e duração; alertar sobre limite diário de paracetamol (muitos combos "para gripe" o contêm).',
          ],
        },
      ],
      clinicalBridge:
        'Sua primeira receita pós-exodontia vai ser ibuprofeno + paracetamol, não codeína. Saber justificar isso com a diretriz de 2024 é o que separa prescrição de hábito.',
      selfCheck: [
        {
          question: 'Qual é a primeira linha para dor pós-exodontia em adulto saudável, segundo a ADA 2024?',
          answer: 'Ibuprofeno 400 mg, isolado ou combinado com paracetamol 1000 mg, a cada 6–8 h por poucos dias. Opioides não são primeira linha.',
        },
        {
          question: 'Por que o AINE é perigoso em paciente idoso usando enalapril e furosemida?',
          answer: 'Os três reduzem a perfusão renal por mecanismos diferentes (prostaglandinas, angiotensina II e volume): a associação — "triple whammy" — aumenta muito o risco de lesão renal aguda.',
        },
        {
          question: 'Que analgésico usar em gestante no terceiro trimestre com dor dental?',
          answer: 'Paracetamol. AINEs são contraindicados no terceiro trimestre pelo risco de fechamento precoce do ducto arterioso e redução do líquido amniótico.',
        },
      ],
      refIds: ['carrasco-labra-2024', 'moore-2013', 'moore-2018'],
    },
    {
      id: 'fa-antibioticos',
      title: 'Antibióticos: quando sim, quando não, e profilaxia',
      summary: 'A maioria das dores de dente não precisa de antibiótico. Saiba as exceções e as regras da endocardite.',
      minutes: 9,
      keyPoints: [
        'Diretriz ADA 2019 (Lockhart): dor pulpar ou periapical em adulto imunocompetente, sem sinais sistêmicos, é tratada com procedimento (pulpotomia, canal, drenagem, extração) — não com antibiótico, mesmo em abscesso localizado.',
        'Antibiótico indicado quando há disseminação sistêmica (febre, mal-estar, linfadenopatia, celulite difusa, trismo) ou quando o tratamento definitivo não é possível e o paciente tem sinais de infecção progressiva. Primeira escolha: amoxicilina 500 mg 8/8 h por 3–7 dias; reavaliar em 3 dias.',
        'Profilaxia de endocardite (AHA 2021): apenas para alto risco — prótese valvar ou material protético valvar, endocardite prévia, cardiopatia congênita cianótica não reparada ou reparada com defeito residual, transplante cardíaco com valvopatia. Amoxicilina 2 g VO 30–60 min antes de procedimentos que manipulam gengiva ou periápice.',
        'Próteses articulares: em geral não se recomenda profilaxia (ADA 2015). Resistência antimicrobiana é consequência direta de prescrição desnecessária.',
      ],
      sections: [
        {
          heading: 'Infecção odontogênica: tratar a fonte',
          bullets: [
            'Pulpite irreversível: dor, sem infecção sistêmica → antibiótico não age (polpa sem circulação) e não alivia. Tratamento: pulpectomia/pulpotomia.',
            'Periodontite apical sintomática ou abscesso apical agudo localizado: drenagem via canal ou incisão + analgesia. Antibiótico só se houver sinais sistêmicos.',
            'Sinais que mudam a conduta: febre > 38 °C, mal-estar, linfadenopatia dolorosa, celulite com edema difuso, trismo, disfagia, elevação do assoalho — estes dois últimos são urgência hospitalar (risco de via aérea).',
            'Esquema: amoxicilina 500 mg a cada 8 h (ou 875 mg a cada 12 h); alergia à penicilina: azitromicina 500 mg/dia por 3 dias ou clindamicina 300 mg a cada 6–8 h (atenção a colite por C. difficile). Casos graves: amoxicilina-clavulanato ou associação com metronidazol.',
          ],
        },
        {
          heading: 'Profilaxia de endocardite',
          bullets: [
            'Racional: bacteremia por estreptococos do grupo viridans em procedimentos que sangram; mas bacteremia também ocorre ao escovar e mastigar — por isso as indicações foram muito restringidas desde 2007 e reafirmadas em 2021.',
            'Alto risco (profilaxia indicada): válvula prostética ou reparo com material prostético; endocardite infecciosa prévia; cardiopatia congênita cianótica não reparada, reparada com material protético nos primeiros 6 meses, ou com defeito residual junto ao material; transplante cardíaco com valvopatia.',
            'Não indicado: prolapso de valva mitral, sopro funcional, cardiopatia reumática sem prótese, marca-passo, stent coronário, revascularização.',
            'Regime: amoxicilina 2 g (criança 50 mg/kg) VO 30–60 min antes; alergia: azitromicina 500 mg ou doxiciclina 100 mg; cefalexina 2 g se a alergia não foi anafilaxia. Se esquecer, pode dar até 2 h após.',
          ],
        },
        {
          heading: 'Outras profilaxias e o uso racional',
          bullets: [
            'Próteses articulares: a ADA (2015) concluiu que a evidência não sustenta profilaxia de rotina; decisão compartilhada com o ortopedista em casos específicos (imunossupressão, prótese recente com complicações).',
            'Cirurgia de terceiros molares em paciente saudável: profilaxia não é rotina; considerar dose única pré-operatória em cirurgias longas/óssea conforme protocolo local.',
            'Uso racional: dose certa, tempo mínimo eficaz, reavaliar em 48–72 h e interromper quando resolvido. Registrar alergias com precisão (reação real vs intolerância).',
          ],
        },
      ],
      clinicalBridge:
        'O paciente vai pedir "um antibiótico para a dor de dente". Sua resposta — abrir e drenar hoje — precisa vir com a explicação desta lição.',
      selfCheck: [
        {
          question: 'Paciente com pulpite irreversível no 36, sem edema nem febre. Antibiótico ajuda?',
          answer: 'Não. A polpa inflamada tem pouca ou nenhuma circulação para levar a droga, e não há infecção sistêmica. O tratamento é pulpectomia (ou pulpotomia de urgência) e analgesia.',
        },
        {
          question: 'Paciente com prolapso de valva mitral vai fazer raspagem. Precisa de profilaxia?',
          answer: 'Não. Prolapso mitral não está entre as condições de alto risco da AHA; profilaxia é restrita a prótese valvar, endocardite prévia, algumas cardiopatias congênitas e transplante com valvopatia.',
        },
        {
          question: 'Quais sinais transformam um abscesso dental em caso de antibiótico — ou de hospital?',
          answer: 'Antibiótico: febre, mal-estar, linfadenopatia, celulite difusa. Hospital: trismo importante, disfagia, elevação do assoalho da boca, dispneia — risco de comprometimento da via aérea.',
        },
      ],
      refIds: ['lockhart-2019', 'wilson-2021', 'sollecito-2015'],
    },
  ],
};
