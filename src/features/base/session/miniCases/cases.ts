import type { MiniCase } from '../types';

export const MINI_CASES: MiniCase[] = [
  {
    id: 'anestesia-falhou',
    title: 'A anestesia não pegou',
    tagline: '46 · dor aguda · bloco inferior',
    period: 3,
    minutes: 7,
    references: [
      {
        id: 'case-anest-1',
        authors: 'Becker DE, Reed KL',
        title: 'Local anesthetics: review of pharmacological considerations',
        journal: 'Anesthesia Progress',
        year: 2012,
        url: 'https://pubmed.ncbi.nlm.nih.gov/23050752/',
        why: 'Revisão de falhas de bloqueio e fatores técnicos.',
      },
    ],
    steps: [
      {
        kind: 'story',
        body: 'Paciente 28 anos, 46 com pulpite. Você fez bloqueio do alveolar inferior pelo forame. Após 5 minutos, ela ainda sente dor na percussão.',
      },
      {
        kind: 'choice',
        body: 'O que você verifica primeiro?',
        choices: [
          { id: 'a', label: 'Posição da agulha e contato ósseo no forame', correct: true, feedback: 'Sem contato ósseo posterior, a solução pode ficar longe do tronco nervoso.' },
          { id: 'b', label: 'Trocar imediatamente para infiltração no 46', feedback: 'Infiltração no molar inferior raramente resolve pulpite profunda — mas o bloqueio mal feito vem antes.' },
          { id: 'c', label: 'Aumentar a dose além do protocolo', feedback: 'Dose extra sem revisar técnica não é o primeiro passo e pode ultrapassar teto mg/kg.' },
        ],
      },
      {
        kind: 'theory',
        body: 'Revisar: trajeto do nervo alveolar inferior, sinais de anestesia do lábio inferior e língua, e calculadora de tubetes.',
        lessonIds: ['acp-trigemeo', 'fa-anestesicos'],
      },
      {
        kind: 'outcome',
        body: 'Repetir o bloqueio com técnica corrigida ou complementar com longo bucal se indicado. Documentar no prontuário o que foi feito — no Academy isso vira evolução.',
      },
    ],
  },
  {
    id: 'dor-frio',
    title: 'Dor ao gelado no 15',
    tagline: 'Estímulo térmico · polpa ou dentina?',
    period: 2,
    minutes: 6,
    references: [
      {
        id: 'case-dor-1',
        authors: 'Brannstrom M',
        title: 'The hydrodynamic theory of dentinal pain',
        journal: 'Journal of Endodontics',
        year: 1986,
        doi: '10.1016/S0099-2399(86)80158-7',
        why: 'Base da dor dentinária por movimento de fluido nos túbulos.',
      },
    ],
    steps: [
      {
        kind: 'story',
        body: 'Paciente relata dor rápida e intensa ao sorvete no 15, que passa em segundos quando remove o estímulo.',
      },
      {
        kind: 'choice',
        body: 'O padrão sugere principalmente…',
        choices: [
          { id: 'a', label: 'Irritação dentinária/pulpar reversível', correct: true, feedback: 'Dor curta ligada ao estímulo, aliviando ao cessar, fala a favor de envolvimento dentinário ou pulpar incipiente.' },
          { id: 'b', label: 'Abscesso agudo', feedback: 'Abscesso costuma ser espontâneo, contínuo ou à percussão — não só ao gelado por segundos.' },
          { id: 'c', label: 'Periodontite avançada', feedback: 'Periodontite dói mais à mobilidade e sondagem profunda do que ao térmico isolado.' },
        ],
      },
      {
        kind: 'theory',
        body: 'Teoria hidrodinâmica: fluido nos túbulos estimula fibras A-delta. Esmalte exposto ou restauração com margem aberta entram no raciocínio.',
        lessonIds: ['fo-dor-dentinaria', 'ca-doenca-lesao'],
      },
      {
        kind: 'outcome',
        body: 'Exame clínico, teste térmico controlado, radiografia se necessário. Plano: remover causa ou tratar pulpa conforme achados.',
      },
    ],
  },
  {
    id: 'lesao-esmalte',
    title: 'Mancha branca proximal',
    tagline: 'ICDAS · radiografia bite-wing',
    period: 3,
    minutes: 6,
    references: [
      {
        id: 'case-icdas-1',
        authors: 'Ismail AI et al.',
        title: 'The International Caries Detection and Assessment System (ICDAS)',
        journal: 'Community Dentistry and Oral Epidemiology',
        year: 2007,
        doi: '10.1111/j.1600-0528.2007.00347.x',
        why: 'Padroniza descrição de lesão e decisão não/restauradora.',
      },
    ],
    steps: [
      {
        kind: 'story',
        body: 'No exame clínico você vê opacidade branca no terço médio da face mesial do 26, sem cavidade aberta. Bite-wing confirma radio-luscência superficial.',
      },
      {
        kind: 'choice',
        body: 'Conduta inicial mais alinhada à preventiva…',
        choices: [
          { id: 'a', label: 'Reforço de higiene, flúor e controle de biofilme', correct: true, feedback: 'Lesão incipiente pode remineralizar — ICDAS e diretrizes enfatizam não invasivo primeiro.' },
          { id: 'b', label: 'Restauração imediata classe II', feedback: 'Cavidade aberta ou dentina exposta muda o plano; aqui ainda há esmalte contínuo.' },
          { id: 'c', label: 'Endodontia profilática', feedback: 'Sem sintoma pulpar ou cavidade profunda, endo não entra.' },
        ],
      },
      {
        kind: 'theory',
        body: 'Curva de Stephan e ICDAS: classificar, fotografar, revisar em 3 meses.',
        lessonIds: ['ca-icdas', 'bf-desmineralizacao'],
      },
      { kind: 'outcome', body: 'Registrar código ICDAS, orientar dieta e flúor, agendar retorno.' },
    ],
  },
  {
    id: 'perfurocorte',
    title: 'Agulha no lixo errado',
    tagline: 'Biossegurança · acidente percutâneo',
    period: 1,
    minutes: 5,
    references: [
      {
        id: 'case-bio-1',
        authors: 'Kohn WG et al.',
        title: 'Guidelines for infection control in dental health-care settings',
        journal: 'MMWR Recommendations and Reports',
        year: 2003,
        url: 'https://www.cdc.gov/mmwr/preview/mmwrhtml/rr5217a1.htm',
        why: 'Fluxo após exposição a material biológico.',
      },
    ],
    steps: [
      {
        kind: 'story',
        body: 'Durante sutura simulada, você perfura o dedo com agulha usada em paciente simulado com ficha de Hepatite B documentada.',
      },
      {
        kind: 'choice',
        body: 'Primeiro passo institucional…',
        choices: [
          { id: 'a', label: 'Lavar, notificar serviço de saúde e seguir protocolo da faculdade', correct: true, feedback: 'Tempo importa; registro e profilaxia seguem fluxo local.' },
          { id: 'b', label: 'Ignorar se não sangrou', feedback: 'Exposição percutânea exige avaliação mesmo com sangramento mínimo.' },
          { id: 'c', label: 'Continuar o procedimento e contar depois', feedback: 'Adia profilaxia e aumenta risco.' },
        ],
      },
      { kind: 'theory', body: 'Precauções padrão e descarte em perfurocortante.', lessonIds: ['br-precaucoes'] },
      { kind: 'outcome', body: 'Relato escrito, encaminhamento e acompanhamento sorológico conforme norma.' },
    ],
  },
  {
    id: 'macula-branca',
    title: 'Placa branca que não sai',
    tagline: 'Lesão potentially malignant · biopsia?',
    period: 4,
    minutes: 7,
    references: [
      {
        id: 'case-opm-1',
        authors: 'Warnakulasuriya S et al.',
        title: 'Oral potentially malignant disorders: a consensus report',
        journal: 'Journal of Oral Pathology & Medicine',
        year: 2021,
        doi: '10.1111/jop.13131',
        why: 'Conduta em leucoplasia e lesões suspeitas.',
      },
    ],
    steps: [
      {
        kind: 'story',
        body: 'Homem 52 anos, tabagista. Mancha branca homogênea no assoalho bucal há 3 meses, não descama com gaze.',
      },
      {
        kind: 'choice',
        body: 'Conduta mais segura…',
        choices: [
          { id: 'a', label: 'Encaminhar para biópsia ou centro de referência', correct: true, feedback: 'Lesão persistente em assoalho + tabaco = alto índice de suspeita.' },
          { id: 'b', label: 'Prescrever antifúngico e revisar em 1 ano', feedback: 'Candidose esbranquiçada descama; lesão fixa exige histopatologia.' },
          { id: 'c', label: 'Laser estético para clarear', feedback: 'Não trata etiologia nem exclui displasia.' },
        ],
      },
      { kind: 'theory', body: 'Diferença leucoplasia vs eritroplasia vs líquen.', lessonIds: ['pg-lesoes-potencialmente-malignas'] },
      { kind: 'outcome', body: 'Documentar tamanho, foto, hábitos; encaminhar.' },
    ],
  },
  {
    id: 'atm-clique',
    title: 'Clique ao abrir',
    tagline: 'ATM · disc displacement',
    period: 2,
    minutes: 5,
    references: [
      {
        id: 'case-atm-1',
        authors: 'Türp JC et al.',
        title: 'Dental occlusion: a critical reflection',
        journal: 'Journal of Oral Rehabilitation',
        year: 2008,
        doi: '10.1111/j.1365-2842.2007.01820.x',
        why: 'Contexto oclusão-TMJ sem oversimplificar.',
      },
    ],
    steps: [
      {
        kind: 'story',
        body: 'Estudante relata estalido articular ao abrir amplo, sem dor constante. Quer “ajustar oclusão” sozinho.',
      },
      {
        kind: 'choice',
        body: 'Orientação inicial adequada…',
        choices: [
          { id: 'a', label: 'Anamnese, palpação ATM, evitar autoprocedimentos invasivos', correct: true, feedback: 'Clique nem sempre exige desgaste oclusal; diagnóstico vem antes.' },
          { id: 'b', label: 'Desgaste imediato do 36', feedback: 'Oclusão como causa única está superada — conduta precipitada.' },
          { id: 'c', label: 'Prescrever antibiótico', feedback: 'Sem infecção, ATB não entra.' },
        ],
      },
      { kind: 'theory', body: 'Músculos da mastigação e trajeto condilar.', lessonIds: ['acp-musculos-atm'] },
      { kind: 'outcome', body: 'Encaminhar se dor, limitação ou crepitação progressiva.' },
    ],
  },
  {
    id: 'ionomero-pediatria',
    title: 'Criança, cárie no 75',
    tagline: 'Ionomero de vidro · dentição decídua',
    period: 3,
    minutes: 5,
    references: [
      {
        id: 'case-iono-1',
        authors: 'Sidhu SK, Nicholson JW',
        title: 'Glass ionomer cements in pediatric dentistry',
        journal: 'European Archives of Paediatric Dentistry',
        year: 2016,
        doi: '10.1007/s40368-016-0244-8',
        why: 'Indicações em dente decíduo e liberação de flúor.',
      },
    ],
    steps: [
      {
        kind: 'story',
        body: 'Criança 4 anos, cooperação parcial, cárie oclusal no 75. Você pensa em ionômero de vidro.',
      },
      {
        kind: 'choice',
        body: 'Vantagem principal do ionômero neste cenário…',
        choices: [
          { id: 'a', label: 'Adesão química e liberação de flúor em dente decíduo', correct: true, feedback: 'Menos dependência de condicionamento ácido agressivo; útil em cooperação limitada.' },
          { id: 'b', label: 'Maior resistência que resina bulk fill em todas as faces', feedback: 'Resina pode ser preferida em carga — ionômero brilha em cenários específicos.' },
          { id: 'c', label: 'Substitui endodontia', feedback: 'Material restaurador não trata pulpa infectada.' },
        ],
      },
      { kind: 'theory', body: 'Matriz de ionômero e umidade.', lessonIds: ['md-ionomero-bioativos'] },
      { kind: 'outcome', body: 'Restauração, orientação aos pais, retorno.' },
    ],
  },
  {
    id: 'radiografia-pan',
    title: 'Panorâmica “estranha”',
    tagline: 'Artefato vs patologia',
    period: 2,
    minutes: 5,
    references: [
      {
        id: 'case-rad-1',
        authors: 'Ludlow JB et al.',
        title: 'Dosimetry of CBCT and panoramic imaging',
        journal: 'Oral Surgery, Oral Medicine, Oral Pathology',
        year: 2008,
        doi: '10.1016/j.tripleo.2008.07.009',
        why: 'Interpretação e dose em imagem panorâmica.',
      },
    ],
    steps: [
      {
        kind: 'story',
        body: 'Em panorâmica, mandíbula parece “fantasma” duplicada de um lado. Colega acha que é fratura.',
      },
      {
        kind: 'choice',
        body: 'Hipótese mais provável…',
        choices: [
          { id: 'a', label: 'Artefato de movimento ou posicionamento', correct: true, feedback: 'Panorâmica exige posição estável; fantasma duplo é clássico de movimento.' },
          { id: 'b', label: 'Fratura mandibular bilateral', feedback: 'Padrão simétrico fantasma raramente é fratura real sem trauma.' },
          { id: 'c', label: 'Tumor ósseo', feedback: 'Lesões reais têm sinais periféricos diferentes — repita exame antes.' },
        ],
      },
      { kind: 'theory', body: 'ALARA e colimação.', lessonIds: ['br-radioprotecao'] },
      { kind: 'outcome', body: 'Repetir radiografia com posicionador; periapical se dúvida focal.' },
    ],
  },
  {
    id: 'gengivite-inicio',
    title: 'Sangramento ao escovar',
    tagline: 'Placa · gengivite',
    period: 2,
    minutes: 5,
    references: [
      {
        id: 'case-ging-1',
        authors: 'Löe H et al.',
        title: 'Experimental gingivitis in man',
        journal: 'Journal of Periodontology',
        year: 1965,
        doi: '10.1902/jop.1965.36.3.177',
        why: 'Modelo clássico placa → inflamação reversível.',
      },
    ],
    steps: [
      {
        kind: 'story',
        body: 'Estudante no 2º período, sangramento diário, nunca fez profilaxia. Medo de periodontite avançada.',
      },
      {
        kind: 'choice',
        body: 'Mensagem correta…',
        choices: [
          { id: 'a', label: 'Gengivite é reversível com controle de biofilme', correct: true, feedback: 'Löe: remoção de placa reverte inflamação em dias.' },
          { id: 'b', label: 'Precisa extrair todos os dentes', feedback: 'Exagero — estágio inicial responde à higiene.' },
          { id: 'c', label: 'Antibiótico por 30 dias', feedback: 'Gengivite crônica por placa não se trata com ATB sistêmico isolado.' },
        ],
      },
      { kind: 'theory', body: 'Biofilme e resposta imune.', lessonIds: ['mi-biofilme', 'mi-imunologia-periodonto'] },
      { kind: 'outcome', body: 'Motivar escovação interdental, retorno em 2 semanas.' },
    ],
  },
  {
    id: 'fluor-crianca',
    title: 'Flúor em criança',
    tagline: 'Dose · fluorose',
    period: 2,
    minutes: 5,
    references: [
      {
        id: 'case-fl-1',
        authors: 'Slayton RL et al.',
        title: 'Fluoride varnish efficacy in preventing caries',
        journal: 'Journal of Dental Research',
        year: 2018,
        doi: '10.1177/0022034518777267',
        why: 'Profilaxia tópica segura em pediatria.',
      },
    ],
    steps: [
      {
        kind: 'story',
        body: 'Mãe quer “flúor forte” diário em criança 3 anos que já engole pasta.',
      },
      {
        kind: 'choice',
        body: 'Orientação…',
        choices: [
          { id: 'a', label: 'Pasta com concentração adequada à idade e quantidade mínima', correct: true, feedback: 'Fluorose vem de excesso crônico na formação; dose importa.' },
          { id: 'b', label: 'Enxaguante álcoolico 2x/dia', feedback: 'Enxaguante não é rotina em pré-escolar.' },
          { id: 'c', label: 'Suspender flúor para sempre', feedback: 'Cárie e fluorose são balanço — não eliminar flúor.' },
        ],
      },
      { kind: 'theory', body: 'Mecanismos do flúor e fluorose.', lessonIds: ['bf-mecanismos-fluor', 'bf-fluorose-seguranca'] },
      { kind: 'outcome', body: 'Verniz em consultório + orientação domiciliar.' },
    ],
  },
  {
    id: 'sutura-trauma',
    title: 'Corte no lábio',
    tagline: 'Primeiros socorros · sutura',
    period: 3,
    minutes: 5,
    references: [
      {
        id: 'case-sut-1',
        authors: 'Holmes JD et al.',
        title: 'Evaluation and repair of perioral lacerations',
        journal: 'Facial Plastic Surgery',
        year: 2014,
        doi: '10.1055/s-0034-1395218',
        why: 'Avaliação de feridas labiais e sutura.',
      },
    ],
    steps: [
      {
        kind: 'story',
        body: 'Paciente chega com laceração labial 2 cm após queda. Sangramento controlado.',
      },
      {
        kind: 'choice',
        body: 'Antes de suturar…',
        choices: [
          { id: 'a', label: 'Anamnese, tetano, limpeza e avaliação de dentes/alvéolo', correct: true, feedback: 'Trauma facial inclui dento e osso — não só pele.' },
          { id: 'b', label: 'Suturar imediatamente sem examinar arcada', feedback: 'Pode perder luxação ou fratura radicular.' },
          { id: 'c', label: 'ATB profilático universal sem indicação', feedback: 'ATB segue protocolo de ferida contaminada e risco.' },
        ],
      },
      { kind: 'theory', body: 'Farmacologia analgésica e anestesia local.', lessonIds: ['fa-analgesia'] },
      { kind: 'outcome', body: 'Sutura por planos, radiografia se suspeita dentária.' },
    ],
  },
  {
    id: 'materiais-alergia',
    title: 'Alergia a látex?',
    tagline: 'Anamnese · materiais',
    period: 4,
    minutes: 4,
    references: [
      {
        id: 'case-latex-1',
        authors: 'Hamann CP et al.',
        title: 'Occupational allergic contact dermatitis in dental workers',
        journal: 'Contact Dermatitis',
        year: 2003,
        doi: '10.1034/j.1600-0536.2003.00078.x',
        why: 'Reações a látex e alternativas.',
      },
    ],
    steps: [
      {
        kind: 'story',
        body: 'Paciente relata “alergia a borracha” ao calçar luva. Histórico vago.',
      },
      {
        kind: 'choice',
        body: 'Conduta…',
        choices: [
          { id: 'a', label: 'Detalhar reação, usar luva não látex e registrar', correct: true, feedback: 'Anamnese guia material e emergência.' },
          { id: 'b', label: 'Usar látex mesmo assim', feedback: 'Risco de reação tipo I.' },
          { id: 'c', label: 'Cancelar todo tratamento', feedback: 'Alternativas existem.' },
        ],
      },
      { kind: 'theory', body: 'Adesivos e monômeros — reações diferentes.', lessonIds: ['md-resina-composta'] },
      { kind: 'outcome', body: 'Kit sem látex, epinefrina disponível se história grave.' },
    ],
  },
];

export function getMiniCase(id: string) {
  return MINI_CASES.find(c => c.id === id) || null;
}
