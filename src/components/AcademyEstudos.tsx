import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  FileText,
  FlaskConical,
  Heart,
  MessageCircle,
  Pill,
  Search,
  Shield,
  Sparkles,
  Stethoscope,
  Syringe,
  Target,
  Tooth,
  UserCircle,
  Zap
} from '../icons';
import { parseAppointmentDateTime } from '../utils/dateUtils';

interface AcademyEstudosProps {
  patients?: any[];
  appointments?: any[];
  setActiveTab?: (tab: any) => void;
  openPatientRecord?: (id: number) => void;
}

type StudyKey =
  | 'exame-clinico'
  | 'radiologia'
  | 'anestesia'
  | 'isolamento'
  | 'periodontia'
  | 'preventiva'
  | 'dentistica'
  | 'endodontia'
  | 'cirurgia'
  | 'protese'
  | 'diagnostico'
  | 'odontopediatria';

type StudyMaterial = {
  id: StudyKey;
  title: string;
  subtitle: string;
  topics: string;
  duration: string;
  level: string;
  icon: React.ElementType;
  color: string;
  borderColor: string;
  objective: string;
  modules: Array<{
    title: string;
    description: string;
    steps: string[];
  }>;
  checklist: string[];
  pitfalls: string[];
  patientTalk: string;
};

const ACTIVE_STATUSES = new Set(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS']);

type StudyIntent = 'agora' | 'prova' | 'trabalho' | 'clinica' | 'duvida' | 'biblioteca';

type ExamPlan = {
  disciplina: string;
  tema: string;
  dataProva: string;
  tempoDisponivel: string;
  created: boolean;
};

type WorkPlan = {
  tema: string;
  tipo: 'seminario' | 'apresentacao' | 'resumo' | 'relatorio';
  prazo: string;
  integrantes: string;
  created: boolean;
};

const STORAGE_KEYS = {
  exam: 'academy-estudos-prova',
  work: 'academy-estudos-trabalho'
};

const DEFAULT_EXAM_PLAN: ExamPlan = {
  disciplina: '',
  tema: '',
  dataProva: '',
  tempoDisponivel: '',
  created: false
};

const DEFAULT_WORK_PLAN: WorkPlan = {
  tema: '',
  tipo: 'seminario',
  prazo: '',
  integrantes: '',
  created: false
};

const STUDY_INTENTS: Array<{ id: StudyIntent; label: string; icon: React.ElementType }> = [
  { id: 'agora', label: 'Agora', icon: Sparkles },
  { id: 'prova', label: 'Prova', icon: Target },
  { id: 'trabalho', label: 'Trabalho', icon: FileText },
  { id: 'clinica', label: 'Clínica', icon: Stethoscope },
  { id: 'duvida', label: 'Dúvida rápida', icon: MessageCircle },
  { id: 'biblioteca', label: 'Biblioteca', icon: BookOpen }
];

const QUICK_QUESTION_SUGGESTIONS = [
  'Quando indicar pino?',
  'Pulpite reversível x irreversível',
  'O que é IDS?',
  'Anestesia em hipertenso'
];

const REQUIRED_LIBRARY_KEYS: StudyKey[] = [
  'exame-clinico',
  'radiologia',
  'anestesia',
  'isolamento',
  'periodontia',
  'dentistica',
  'endodontia',
  'cirurgia',
  'protese',
  'diagnostico'
];

function loadStoredStudyState<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;

  try {
    const stored = window.localStorage.getItem(key);
    return stored ? { ...fallback, ...JSON.parse(stored) } : fallback;
  } catch {
    return fallback;
  }
}

function saveStoredStudyState<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Local state still works if storage is unavailable.
  }
}

const STUDY_LIBRARY: Record<StudyKey, StudyMaterial> = {
  'exame-clinico': {
    id: 'exame-clinico',
    title: 'Exame clinico',
    subtitle: 'Anamnese, diagnostico e plano',
    topics: 'Queixa principal, anamnese, exame intraoral, hipotese diagnostica.',
    duration: '15 min',
    level: 'Base de toda clinica',
    icon: ClipboardList,
    color: 'bg-stone-100 text-stone-600',
    borderColor: 'border-stone-200',
    objective: 'Organizar o raciocinio clinico antes de qualquer procedimento: ouvir, examinar, registrar achados e transformar sinais em um plano justificavel.',
    modules: [
      {
        title: 'Anamnese dirigida',
        description: 'A historia do paciente orienta risco, urgencia e conduta.',
        steps: [
          'Registrar queixa principal com palavras do paciente, inicio, duracao, intensidade e fatores que aliviam ou pioram.',
          'Investigar doencas sistemicas, alergias, medicamentos, cirurgias, gestacao, ansiedade e experiencias odontologicas previas.',
          'Relacionar sintomas com habitos, dieta, higiene, bruxismo, trauma, sangramento gengival e historico de dor.'
        ]
      },
      {
        title: 'Exame fisico e odontologico',
        description: 'Separe achados objetivos de interpretacoes.',
        steps: [
          'Avaliar face, linfonodos, ATM, abertura bucal, mucosas, lingua, assoalho, palato e orofaringe.',
          'Examinar dentes por quadrante: carie, restauracoes, fraturas, mobilidade, recessao, sangramento e placa.',
          'Usar testes complementares quando fizer sentido: percussao, palpacao, vitalidade pulpar, sondagem periodontal e radiografia.'
        ]
      },
      {
        title: 'Diagnostico e prioridade',
        description: 'O aluno precisa justificar por que tratar agora e como tratar.',
        steps: [
          'Listar diagnostico provavel, diagnosticos diferenciais e dados que sustentam cada hipotese.',
          'Separar urgencias de tratamentos eletivos e estabilizar dor, infeccao ou risco funcional primeiro.',
          'Montar plano por fases: adequacao do meio, controle de doenca, tratamento restaurador/cirurgico/protetico e manutencao.'
        ]
      }
    ],
    checklist: [
      'Queixa principal registrada',
      'Historico medico e medicacoes conferidos',
      'Exame extraoral e intraoral completo',
      'Odontograma ou periodontograma atualizado',
      'Plano por prioridades explicado ao paciente'
    ],
    pitfalls: [
      'Comecar procedimento sem diagnostico claro transforma a consulta em tentativa.',
      'Ignorar medicamento de uso continuo pode mudar anestesia, sangramento ou prescricao.',
      'Confundir achado radiografico com diagnostico final sem correlacao clinica.'
    ],
    patientTalk: 'Explique que a primeira consulta serve para entender a causa do problema e montar uma ordem segura de tratamento, nao apenas olhar um dente isolado.'
  },
  diagnostico: {
    id: 'diagnostico',
    title: 'Diagnóstico',
    subtitle: 'Hipóteses, diferenciais e decisão',
    topics: 'Sinais, sintomas, testes, hipóteses e conduta inicial.',
    duration: '16 min',
    level: 'Raciocínio clínico',
    icon: FlaskConical,
    color: 'bg-violet-50 text-academy-primary',
    borderColor: 'border-violet-100',
    objective: 'Organizar o raciocínio antes da conduta: transformar queixa, exame e testes complementares em uma hipótese defensável e um próximo passo seguro.',
    modules: [
      {
        title: 'Coleta de dados',
        description: 'Diagnóstico bom começa separando fato de interpretação.',
        steps: [
          'Registrar queixa, duração, gatilhos, intensidade, histórico sistêmico e uso de medicamentos.',
          'Anotar achados clínicos objetivos: localização, extensão, dor provocada, sangramento, mobilidade e alterações visuais.',
          'Conferir exames complementares apenas quando eles respondem uma pergunta clínica real.'
        ]
      },
      {
        title: 'Hipóteses e diferenciais',
        description: 'Liste possibilidades antes de fechar a decisão.',
        steps: [
          'Definir hipótese principal e pelo menos um diagnóstico diferencial quando houver dúvida.',
          'Relacionar cada hipótese com sinais que sustentam ou enfraquecem a conclusão.',
          'Identificar sinais de urgência, risco sistêmico ou necessidade de encaminhamento.'
        ]
      },
      {
        title: 'Conduta inicial',
        description: 'A primeira decisão deve reduzir risco e aumentar clareza.',
        steps: [
          'Priorizar dor, infecção, trauma, função e risco de progressão.',
          'Explicar ao paciente o que já está claro e o que ainda precisa confirmar.',
          'Registrar plano, justificativa e próximos exames ou reavaliações.'
        ]
      }
    ],
    checklist: [
      'Queixa principal clara',
      'Sinais e sintomas separados',
      'Testes indicados registrados',
      'Hipótese principal definida',
      'Conduta inicial justificada'
    ],
    pitfalls: [
      'Fechar diagnóstico só pela radiografia pode ignorar sinais clínicos importantes.',
      'Tratar dor sem investigar causa pode mascarar evolução do caso.',
      'Não registrar hipótese e justificativa dificulta supervisão e continuidade.'
    ],
    patientTalk: 'Explique que o diagnóstico junta conversa, exame e testes para escolher a conduta mais segura, sem pular etapas.'
  },
  radiologia: {
    id: 'radiologia',
    title: 'Radiologia odontologica',
    subtitle: 'Tecnica, indicacao e interpretacao',
    topics: 'Periapical, bite-wing, panoramica, protecao radiologica, laudo descritivo.',
    duration: '13 min',
    level: 'Diagnostico complementar',
    icon: Search,
    color: 'bg-stone-100 text-stone-600',
    borderColor: 'border-stone-200',
    objective: 'Escolher a tomada radiografica correta, executar com tecnica e interpretar sem pular etapas de anatomia, qualidade e achados patologicos.',
    modules: [
      {
        title: 'Indicacao da imagem',
        description: 'A radiografia deve responder uma pergunta clinica.',
        steps: [
          'Usar periapical para apice, endodontia, lesao periapical, trauma e avaliacao localizada.',
          'Usar bite-wing para carie proximal, excesso restaurador, adaptacao marginal e perda ossea posterior.',
          'Usar panoramica para visao geral, terceiros molares, lesoes extensas, alteracoes osseas e planejamento amplo.'
        ]
      },
      {
        title: 'Qualidade tecnica',
        description: 'Imagem ruim pode gerar diagnostico errado.',
        steps: [
          'Conferir posicionamento, abrangencia da area de interesse, nitidez, contraste e ausencia de corte apical.',
          'Reconhecer erros comuns: alongamento, encurtamento, meia-lua, sobreposicao proximal e movimento.',
          'Repetir tomada apenas quando a imagem nao responde a pergunta clinica, respeitando radioprotecao.'
        ]
      },
      {
        title: 'Leitura sistematica',
        description: 'Interprete em ordem para nao enxergar so o obvio.',
        steps: [
          'Identificar estruturas anatomicas normais antes de procurar alteracoes.',
          'Avaliar coroa, margem restauradora, camara pulpar, raiz, lamina dura, espaco periodontal e osso alveolar.',
          'Descrever achado por localizacao, tamanho, limites, densidade e relacao com dentes/estruturas.'
        ]
      }
    ],
    checklist: [
      'Pergunta clinica definida',
      'EPI e protecao radiologica usados',
      'Imagem com apice/margens visiveis',
      'Achados descritos antes da conclusao',
      'Radiografia anexada ao prontuario'
    ],
    pitfalls: [
      'Pedir panoramica para diagnosticar carie proximal pequena costuma ser insuficiente.',
      'Sobreposicao proximal invalida avaliacao de carie interproximal.',
      'Radiografia nao substitui teste clinico de vitalidade pulpar.'
    ],
    patientTalk: 'Explique que a imagem ajuda a ver areas que o exame visual nao mostra, usando a menor exposicao necessaria para responder a duvida clinica.'
  },
  anestesia: {
    id: 'anestesia',
    title: 'Anestesia local',
    subtitle: 'Tecnicas e seguranca',
    topics: 'Anamnese, escolha do sal, infiltrativa, bloqueios, acidentes e manejo.',
    duration: '17 min',
    level: 'Procedimento diario',
    icon: Pill,
    color: 'bg-academy-attention text-academy-attention-text',
    borderColor: 'border-academy-border',
    objective: 'Revisar fundamentos para anestesiar com previsibilidade: indicacao, anatomia, dose, aspiracao, latencia e conduta diante de falhas.',
    modules: [
      {
        title: 'Escolha e dose segura',
        description: 'Anestesia comeca na anamnese, nao na seringa.',
        steps: [
          'Conferir peso, idade, gestacao, alergias relatadas, cardiopatias, hipertensao, medicacoes e historico de reacao.',
          'Escolher anestesico e vasoconstritor conforme procedimento, duracao esperada, sangramento e condicao sistemica.',
          'Calcular dose maxima quando houver crianca, baixo peso, multiplos tubetes ou condicao de risco.'
        ]
      },
      {
        title: 'Tecnica e anatomia',
        description: 'A tecnica correta depende do nervo alvo e da area tratada.',
        steps: [
          'Usar infiltrativa em maxila e regioes com cortical favoravel; considerar bloqueio quando a area for ampla.',
          'No bloqueio alveolar inferior, localizar referencias: rafe pterigomandibular, plano oclusal e ramo mandibular.',
          'Aspirar, depositar lentamente, aguardar latencia e testar anestesia antes de iniciar.'
        ]
      },
      {
        title: 'Falha anestesica e intercorrencias',
        description: 'Falha deve ser investigada antes de repetir sem criterio.',
        steps: [
          'Reavaliar tecnica, anatomia, inflamacao local, tempo de latencia e ansiedade.',
          'Complementar com infiltrativa, intraligamentar ou intrapulpar quando indicado e supervisionado.',
          'Reconhecer sinais de lipotimia, toxicidade, parestesia, hematoma e reacao alergica verdadeira.'
        ]
      }
    ],
    checklist: [
      'Anamnese de risco revisada',
      'Dose estimada para o paciente',
      'Tecnica escolhida pelo procedimento',
      'Aspiracao e injecao lenta realizadas',
      'Sinais vitais/ansiedade observados'
    ],
    pitfalls: [
      'Repetir tubetes sem calcular dose aumenta risco desnecessario.',
      'Iniciar antes da latencia completa gera dor e perda de confianca.',
      'Confundir ansiedade com alergia pode levar a registros incorretos.'
    ],
    patientTalk: 'Explique que a anestesia sera aplicada devagar para dar conforto e seguranca, e que voce testara a regiao antes de comecar o procedimento.'
  },
  isolamento: {
    id: 'isolamento',
    title: 'Isolamento absoluto',
    subtitle: 'Campo operatorio e controle de umidade',
    topics: 'Grampos, lencol de borracha, amarrilhos, inversao, seguranca.',
    duration: '12 min',
    level: 'Habilidade essencial',
    icon: Shield,
    color: 'bg-emerald-50 text-emerald-600',
    borderColor: 'border-emerald-100',
    objective: 'Entender quando, por que e como isolar para proteger paciente, melhorar visibilidade e aumentar previsibilidade adesiva/endodontica.',
    modules: [
      {
        title: 'Indicacoes e beneficios',
        description: 'O isolamento nao e detalhe estetico; e controle biologico e tecnico.',
        steps: [
          'Indicar em endodontia, restauracoes adesivas, cimentacoes e procedimentos com risco de aspiracao/contaminacao.',
          'Relacionar isolamento com controle de saliva, lingua, bochecha, aerossol, visibilidade e tempo operatorio.',
          'Explicar ao paciente que o lencol melhora conforto e seguranca durante o atendimento.'
        ]
      },
      {
        title: 'Selecao do conjunto',
        description: 'Grampo e perfuracao devem respeitar dente, arco e acesso.',
        steps: [
          'Escolher grampo pela anatomia cervical, erupcao, retencao e distancia gengival.',
          'Planejar perfuracoes por dente, contato proximal e extensao do campo necessario.',
          'Testar estabilidade do grampo, usar fio dental de seguranca e proteger tecidos.'
        ]
      },
      {
        title: 'Instalacao e vedamento',
        description: 'O sucesso aparece na margem cervical.',
        steps: [
          'Passar contatos com fio dental sem rasgar o lencol.',
          'Inverter a borracha no sulco com instrumento rombo, ar e amarrilhos quando necessario.',
          'Controlar vazamentos com barreira gengival, teflon ou ajuste de grampo conforme indicacao.'
        ]
      }
    ],
    checklist: [
      'Grampo correto separado',
      'Fio de seguranca no grampo',
      'Perfuracoes planejadas',
      'Contatos passados sem rasgo',
      'Campo seco antes do procedimento'
    ],
    pitfalls: [
      'Grampo instavel e risco de acidente; deve ser corrigido antes de iniciar.',
      'Campo aparentemente isolado, mas com vazamento cervical, compromete adesao.',
      'Perfuracao mal posicionada dificulta inversao e retrai mal a borracha.'
    ],
    patientTalk: 'Explique que o isolamento cria uma area seca e protegida, evitando saliva no procedimento e diminuindo risco de engolir materiais.'
  },
  periodontia: {
    id: 'periodontia',
    title: 'Periodontia basica',
    subtitle: 'Raspagem, controle de biofilme e manutencao',
    topics: 'Gengivite, periodontite, sondagem, raspagem, instrucao de higiene.',
    duration: '18 min',
    level: 'Muito comum na clinica',
    icon: Activity,
    color: 'bg-green-50 text-green-700',
    borderColor: 'border-green-100',
    objective: 'Revisar diagnostico periodontal inicial e execucao de raspagem/profilaxia com foco em inflamacao, biofilme e manutencao.',
    modules: [
      {
        title: 'Diagnostico periodontal',
        description: 'Sangramento e perda de insercao mudam o plano.',
        steps: [
          'Avaliar placa, calculo, sangramento, profundidade de sondagem, recessao, mobilidade e furca.',
          'Diferenciar gengivite de periodontite observando perda de insercao, perda ossea e historico.',
          'Registrar sitios criticos e fatores locais: restauracao mal adaptada, apinhamento, respiracao bucal e tabagismo.'
        ]
      },
      {
        title: 'Raspagem e alisamento',
        description: 'Instrumentacao deve remover deposito sem traumatizar tecido.',
        steps: [
          'Selecionar curetas/ultrassom conforme area, acesso e quantidade de calculo.',
          'Estabelecer apoio digital, angulacao correta e movimentos controlados por quadrante.',
          'Irrigar, reavaliar lisura radicular e orientar sensibilidade pos-raspagem.'
        ]
      },
      {
        title: 'Controle e manutencao',
        description: 'Sem mudanca de habito, a inflamacao volta.',
        steps: [
          'Demonstrar escovacao, limpeza interdental e controle de areas de maior retencao.',
          'Definir retorno para reavaliar sangramento, placa e profundidade de sondagem.',
          'Encaminhar casos com bolsas profundas, mobilidade importante ou resposta ruim ao tratamento inicial.'
        ]
      }
    ],
    checklist: [
      'Sondagem registrada quando indicada',
      'Indice de placa/sangramento observado',
      'Instrumentais afiados e selecionados',
      'Orientacao de higiene individualizada',
      'Retorno de manutencao agendado'
    ],
    pitfalls: [
      'Fazer apenas polimento em paciente com calculo subgengival nao trata a causa.',
      'Nao registrar sondagem impede acompanhar evolucao.',
      'Prometer cura sem manutencao periodontal cria expectativa errada.'
    ],
    patientTalk: 'Explique que o sangramento gengival geralmente indica inflamacao por biofilme e que o tratamento combina limpeza profissional com higiene diaria bem orientada.'
  },
  preventiva: {
    id: 'preventiva',
    title: 'Preventiva e profilaxia',
    subtitle: 'Fluor, selante e controle de carie',
    topics: 'Risco de carie, dieta, profilaxia, fluor, selantes, educacao em saude.',
    duration: '14 min',
    level: 'Primeiros atendimentos',
    icon: Heart,
    color: 'bg-lime-50 text-lime-700',
    borderColor: 'border-lime-100',
    objective: 'Transformar a consulta preventiva em decisao clinica: avaliar risco, remover biofilme, aplicar medidas protetoras e orientar comportamento.',
    modules: [
      {
        title: 'Risco de carie',
        description: 'Prevencao muda conforme risco individual.',
        steps: [
          'Investigar frequencia de acucar, higiene, fluor, xerostomia, historico de carie e exposicao radicular.',
          'Classificar risco combinando lesoes ativas, placa visivel, dieta e fatores sociais/comportamentais.',
          'Priorizar controle de atividade de doenca antes de procedimentos esteticos.'
        ]
      },
      {
        title: 'Profilaxia e fluor',
        description: 'O procedimento deve ter indicacao, nao ser automatico.',
        steps: [
          'Remover biofilme e manchas extrinsecas com escova/taca, pasta profilatica ou jato quando indicado.',
          'Aplicar fluor conforme idade, risco e protocolo da clinica, evitando excesso desnecessario.',
          'Orientar nao comer/beber pelo periodo recomendado quando o produto exigir.'
        ]
      },
      {
        title: 'Selantes e educacao',
        description: 'Selante protege sulcos vulneraveis quando bem indicado.',
        steps: [
          'Indicar selante em fossulas e fissuras retentivas, especialmente em molares recem-erupcionados.',
          'Garantir isolamento relativo/absoluto, condicionamento e fotoativacao adequados.',
          'Ensinar higiene de forma pratica, escolhendo uma meta simples para o paciente cumprir.'
        ]
      }
    ],
    checklist: [
      'Risco de carie estimado',
      'Dieta e fluor de rotina perguntados',
      'Biofilme evidenciado ou visualizado',
      'Indicacao de fluor/selante definida',
      'Meta de higiene combinada'
    ],
    pitfalls: [
      'Profilaxia sem orientacao dura pouco como estrategia preventiva.',
      'Selante em campo contaminado falha precocemente.',
      'Tratar carie sem abordar frequencia de acucar mantem a doenca ativa.'
    ],
    patientTalk: 'Explique que prevenir nao e so limpar: e reduzir o risco de novas lesoes com habitos, fluor e protecao das areas mais vulneraveis.'
  },
  endodontia: {
    id: 'endodontia',
    title: 'Endodontia',
    subtitle: 'Tratamento de canal previsivel',
    topics: 'Acesso, isolamento absoluto, odontometria, instrumentacao.',
    duration: '18 min',
    level: 'Clinico essencial',
    icon: Activity,
    color: 'bg-academy-attention text-academy-attention-text',
    borderColor: 'border-academy-border',
    objective: 'Chegar ao atendimento com um roteiro claro para diagnostico, acesso, preparo quimico-mecanico e orientacoes finais.',
    modules: [
      {
        title: 'Diagnostico e plano',
        description: 'Confirme sinais clinicos antes de iniciar o procedimento.',
        steps: [
          'Revisar queixa principal, tempo de dor e fatores desencadeantes.',
          'Checar testes pulpares, percussao, palpacao e imagem radiografica.',
          'Definir se o caso pede urgencia, biopulpectomia, necropulpectomia ou encaminhamento.'
        ]
      },
      {
        title: 'Acesso e isolamento',
        description: 'Monte o campo antes de entrar no canal.',
        steps: [
          'Selecionar grampo, lencol de borracha, arco, sugador e irrigacao.',
          'Remover tecido cariado/restauracao fragil e localizar referencia anatomica.',
          'Executar acesso conservador, mas suficiente para instrumentacao sem degraus.'
        ]
      },
      {
        title: 'Odontometria e instrumentacao',
        description: 'Trabalhe com medida segura e irrigacao abundante.',
        steps: [
          'Estabelecer patencia e comprimento de trabalho com localizador e radiografia quando indicado.',
          'Instrumentar respeitando glide path, anatomia e limite apical.',
          'Irrigar entre instrumentos e manter aspiracao eficiente.'
        ]
      }
    ],
    checklist: [
      'Radiografia inicial disponivel',
      'Isolamento absoluto planejado',
      'Anestesico, irrigante e limas separados',
      'Comprimento de trabalho registrado',
      'Orientacoes pos-operatorias combinadas'
    ],
    pitfalls: [
      'Acesso pequeno demais pode criar desvio e fratura de instrumento.',
      'Instrumentar sem irrigacao suficiente reduz previsibilidade.',
      'Dor espontanea persistente pede reavaliacao do diagnostico.'
    ],
    patientTalk: 'Explique que o objetivo e remover a infeccao ou inflamacao interna do dente, aliviar a dor e preservar a estrutura dentaria.'
  },
  dentistica: {
    id: 'dentistica',
    title: 'Dentistica',
    subtitle: 'Restauracoes adesivas e acabamento',
    topics: 'Adesao, escolha de resina, matrizes, acabamento.',
    duration: '14 min',
    level: 'Pratico',
    icon: Tooth,
    color: 'bg-green-50 text-green-700',
    borderColor: 'border-green-100',
    objective: 'Preparar a sequencia para restauracoes diretas com isolamento, adesao controlada e anatomia funcional.',
    modules: [
      {
        title: 'Selecao de caso e cor',
        description: 'Defina o resultado antes do isolamento alterar a cor do dente.',
        steps: [
          'Registrar extensao da lesao, contato proximal e margem cervical.',
          'Selecionar cor com o dente hidratado e boa iluminacao.',
          'Escolher resina, matriz, cunha e sistema adesivo conforme o caso.'
        ]
      },
      {
        title: 'Controle de campo',
        description: 'A adesao depende mais de controle do que de pressa.',
        steps: [
          'Priorizar isolamento absoluto quando houver margem profunda ou campo umido.',
          'Condicionar, lavar e secar conforme o sistema adesivo escolhido.',
          'Aplicar adesivo com friccao ativa e fotopolimerizar no tempo correto.'
        ]
      },
      {
        title: 'Estratificacao e acabamento',
        description: 'Reproduza forma antes de polir.',
        steps: [
          'Inserir incrementos pequenos, respeitando anatomia e ponto de contato.',
          'Checar oclusao com papel articular antes do polimento final.',
          'Finalizar com discos, borrachas e tiras proximais quando necessario.'
        ]
      }
    ],
    checklist: [
      'Cor selecionada antes do isolamento',
      'Matriz/cunha/teste de contato prontos',
      'Campo seco e acesso visual adequado',
      'Tempo de fotoativacao conferido',
      'Oclusao e acabamento revisados'
    ],
    pitfalls: [
      'Contaminacao por saliva compromete a adesao.',
      'Excesso proximal dificulta higiene e causa inflamacao gengival.',
      'Nao conferir oclusao pode gerar dor ao mastigar.'
    ],
    patientTalk: 'Explique que a restauracao devolve forma e funcao ao dente e que acabamento e polimento ajudam conforto, higiene e durabilidade.'
  },
  cirurgia: {
    id: 'cirurgia',
    title: 'Cirurgia',
    subtitle: 'Exodontia e pos-operatorio seguro',
    topics: 'Anestesia, biosseguranca, extracao, pos-operatorio.',
    duration: '16 min',
    level: 'Seguranca clinica',
    icon: Syringe,
    color: 'bg-academy-attention text-academy-attention-text',
    borderColor: 'border-academy-border',
    objective: 'Organizar avaliacao, anestesia, tecnica cirurgica e orientacoes para reduzir intercorrencias.',
    modules: [
      {
        title: 'Avaliacao pre-operatoria',
        description: 'Identifique riscos antes de anestesiar.',
        steps: [
          'Conferir anamnese, alergias, medicamentos, pressao e condicoes sistemicas.',
          'Avaliar radiografia, anatomia radicular e proximidade com estruturas nobres.',
          'Definir necessidade de encaminhamento, profilaxia ou ajuste de conduta.'
        ]
      },
      {
        title: 'Anestesia e tecnica',
        description: 'Trabalhe com visibilidade, apoio e movimentos controlados.',
        steps: [
          'Selecionar tecnica anestesica e aguardar latencia adequada.',
          'Sindesmotomia, luxacao progressiva e apoio correto dos instrumentais.',
          'Evitar forca excessiva; quando necessario, seccionar ou ampliar acesso.'
        ]
      },
      {
        title: 'Hemostasia e alta',
        description: 'A consulta termina quando o paciente sabe o que fazer em casa.',
        steps: [
          'Inspecionar alveolo, remover espiculas e irrigar quando indicado.',
          'Comprimir gaze, conferir hemostasia e suturar se necessario.',
          'Entregar orientacoes claras sobre repouso, alimentacao, higiene e sinais de alerta.'
        ]
      }
    ],
    checklist: [
      'Anamnese e medicacoes revisadas',
      'Imagem radiografica avaliada',
      'Instrumental cirurgico separado',
      'Plano de hemostasia definido',
      'Orientacoes pos-operatorias entregues'
    ],
    pitfalls: [
      'Forca sem planejamento aumenta risco de fratura radicular.',
      'Nao revisar medicamentos pode elevar risco de sangramento.',
      'Orientacao vaga no pos-operatorio gera retorno evitavel.'
    ],
    patientTalk: 'Explique o passo a passo com linguagem simples, incluindo anestesia, remocao controlada e cuidados para cicatrizacao.'
  },
  protese: {
    id: 'protese',
    title: 'Protese e moldagem',
    subtitle: 'Moldagem, provisiorio e oclusao',
    topics: 'Moldagem, preparo, provisiorio, registro oclusal, cimentacao.',
    duration: '19 min',
    level: 'Clinica integrada',
    icon: FileText,
    color: 'bg-stone-100 text-stone-600',
    borderColor: 'border-stone-200',
    objective: 'Revisar etapas proteticas comuns na graduacao: planejamento, preparo conservador, moldagem/escaneamento, provisiorio e ajuste oclusal.',
    modules: [
      {
        title: 'Planejamento protetico',
        description: 'Antes de desgastar, confirme indicacao, estrutura remanescente e funcao.',
        steps: [
          'Avaliar vitalidade, periodonto, espaco protetico, linha do sorriso, habitos parafuncionais e expectativa estetica.',
          'Definir se o caso pede restauracao direta, indireta, pino, nucleo, coroa, provisiorio ou encaminhamento.',
          'Planejar termino cervical, reducao oclusal/incisal e preservacao maxima de estrutura sadia.'
        ]
      },
      {
        title: 'Moldagem ou escaneamento',
        description: 'A qualidade do modelo depende de margem limpa, seca e visivel.',
        steps: [
          'Controlar saliva, sangue e afastamento gengival antes de registrar a margem.',
          'Selecionar moldeira/material ou fluxo de escaneamento conforme caso e protocolo da clinica.',
          'Conferir bolhas, arrasto, rasgo, falta de termino, contato proximal e registro antagonista.'
        ]
      },
      {
        title: 'Provisorio e ajuste',
        description: 'O provisorio protege o dente e testa forma, funcao e gengiva.',
        steps: [
          'Adaptar margem, contato proximal e contorno para evitar inflamacao gengival.',
          'Checar oclusao em maxima intercuspidacao e movimentos excursivos.',
          'Orientar higiene, risco de deslocamento e retorno se houver dor, soltura ou fratura.'
        ]
      }
    ],
    checklist: [
      'Indicacao protetica justificada',
      'Fotografia/cor registrada quando necessario',
      'Termino e reducao conferidos',
      'Moldagem sem falhas na margem',
      'Provisorio ajustado e cimentado'
    ],
    pitfalls: [
      'Preparar sem avaliar periodonto pode esconder inflamacao e margem ruim.',
      'Moldagem com sangue/saliva costuma falhar na copia do termino.',
      'Provisorio alto em oclusao gera dor, mobilidade ou soltura.'
    ],
    patientTalk: 'Explique que a protese reconstrui forma e funcao, mas depende de etapas precisas para encaixar bem, proteger a gengiva e mastigar confortavelmente.'
  },
  odontopediatria: {
    id: 'odontopediatria',
    title: 'Odontopediatria',
    subtitle: 'Conduta, prevencao e procedimentos simples',
    topics: 'Manejo infantil, denticao decidua, fluor, selante, ART, urgencias.',
    duration: '18 min',
    level: 'Atendimento supervisionado',
    icon: Stethoscope,
    color: 'bg-emerald-50 text-emerald-700',
    borderColor: 'border-emerald-100',
    objective: 'Revisar o atendimento infantil com foco em comportamento, prevencao, diagnostico de carie e procedimentos conservadores comuns na clinica escola.',
    modules: [
      {
        title: 'Manejo comportamental',
        description: 'A tecnica depende da confianca da crianca e do responsavel.',
        steps: [
          'Usar dizer-mostrar-fazer, voz calma, comandos curtos e reforco positivo.',
          'Combinar com responsavel informacoes de saude, alimentacao, higiene, trauma e experiencia previa.',
          'Reconhecer limites: dor, medo intenso e pouca colaboracao podem exigir consulta curta ou encaminhamento.'
        ]
      },
      {
        title: 'Denticao decidua e carie',
        description: 'Dente deciduo tem anatomia e ciclo biologico proprios.',
        steps: [
          'Avaliar idade, cronologia de erupcao/esfoliacao, lesoes ativas, fistula, mobilidade e envolvimento pulpar.',
          'Diferenciar lesao inicial, cavitada, profunda e com sinais de infeccao para escolher conduta.',
          'Priorizar controle de doenca: dieta, fluor, higiene supervisionada e retorno.'
        ]
      },
      {
        title: 'Procedimentos comuns',
        description: 'Conservador nao significa improvisado.',
        steps: [
          'Aplicar selante quando sulcos retentivos e risco indicarem, com isolamento adequado.',
          'Considerar ART/ionomero em casos selecionados, removendo dentina infectada e preservando estrutura.',
          'Em urgencias, controlar dor/infeccao e encaminhar se houver comprometimento sistemico.'
        ]
      }
    ],
    checklist: [
      'Responsavel orientado e consentimento registrado',
      'Risco de carie avaliado',
      'Comportamento infantil considerado no plano',
      'Dose de anestesico calculada quando necessario',
      'Orientacao de dieta/higiene entregue'
    ],
    pitfalls: [
      'Tratar a crianca como adulto pequeno piora colaboracao.',
      'Ignorar cronologia de esfoliacao pode levar a tratamento excessivo.',
      'Prescrever sem peso/idade e sem supervisao aumenta risco.'
    ],
    patientTalk: 'Explique ao responsavel que o foco e controlar a doenca e criar uma experiencia segura, para que a crianca aceite melhor os proximos cuidados.'
  }
};

const parseDate = (value?: string) => {
  if (!value) return null;
  return parseAppointmentDateTime(value);
};

const getPatient = (patients: any[], id: number) => patients.find(p => p.id === id);

const getProcedureHint = (appointment?: any, patient?: any) => {
  const treatment = patient?.treatmentPlan?.find((item: any) =>
    item?.status === 'PLANEJADO' || item?.status === 'APROVADO'
  );
  return appointment?.notes || appointment?.procedure || treatment?.procedure || null;
};

const mapProcedureToTopic = (procedure: string | null): StudyKey | null => {
  if (!procedure) return null;
  const lower = procedure.toLowerCase();
  if (lower.includes('anamn') || lower.includes('exame') || lower.includes('avaliacao') || lower.includes('diagnost') || lower.includes('plano de tratamento')) return 'exame-clinico';
  if (lower.includes('radio') || lower.includes('rx') || lower.includes('periapical') || lower.includes('bite') || lower.includes('panoram')) return 'radiologia';
  if (lower.includes('anestes') || lower.includes('bloqueio') || lower.includes('infiltrativa')) return 'anestesia';
  if (lower.includes('isolamento') || lower.includes('dique') || lower.includes('lencol') || lower.includes('grampo')) return 'isolamento';
  if (lower.includes('rasp') || lower.includes('period') || lower.includes('gengiv') || lower.includes('calculo') || lower.includes('tartaro') || lower.includes('profilaxia periodontal')) return 'periodontia';
  if (lower.includes('profilax') || lower.includes('fluor') || lower.includes('selante') || lower.includes('prevent') || lower.includes('biofilme')) return 'preventiva';
  if (lower.includes('endo') || lower.includes('canal') || lower.includes('pulpar') || lower.includes('tratamento endodontico')) return 'endodontia';
  if (lower.includes('restaura') || lower.includes('resin') || lower.includes('clareamento') || lower.includes('facet') || lower.includes('lente') || lower.includes('dentistic')) return 'dentistica';
  if (lower.includes('extra') || lower.includes('siso') || lower.includes('cirurg') || lower.includes('implant') || lower.includes('exodontia')) return 'cirurgia';
  if (lower.includes('protese') || lower.includes('provisor') || lower.includes('moldagem') || lower.includes('coroa') || lower.includes('ciment')) return 'protese';
  if (lower.includes('pediatr') || lower.includes('crianca') || lower.includes('deciduo') || lower.includes('infantil') || lower.includes('art')) return 'odontopediatria';
  return null;
};

export const AcademyEstudos: React.FC<AcademyEstudosProps> = ({
  patients = [],
  appointments = [],
  setActiveTab,
  openPatientRecord
}) => {
  const [activeIntent, setActiveIntent] = useState<StudyIntent>('agora');
  const [selectedStudy, setSelectedStudy] = useState<StudyKey | null>(null);
  const [examPlan, setExamPlan] = useState<ExamPlan>(() =>
    loadStoredStudyState(STORAGE_KEYS.exam, DEFAULT_EXAM_PLAN)
  );
  const [workPlan, setWorkPlan] = useState<WorkPlan>(() =>
    loadStoredStudyState(STORAGE_KEYS.work, DEFAULT_WORK_PLAN)
  );
  const [quickQuestion, setQuickQuestion] = useState('');

  useEffect(() => {
    saveStoredStudyState(STORAGE_KEYS.exam, examPlan);
  }, [examPlan]);

  useEffect(() => {
    saveStoredStudyState(STORAGE_KEYS.work, workPlan);
  }, [workPlan]);

  const upcomingAppointments = useMemo(() => {
    const current = new Date();
    const limit = new Date(current);
    limit.setDate(limit.getDate() + 30);

    return appointments
      .filter(app => ACTIVE_STATUSES.has(String(app.status || 'SCHEDULED').toUpperCase()))
      .map(app => {
        const date = parseDate(app.start_time || app.date);
        const patientId = Number(app.patient_id);
        const patient = Number.isFinite(patientId) ? getPatient(patients, patientId) : null;
        const proc = getProcedureHint(app, patient);
        const topicKey = mapProcedureToTopic(proc);
        return { app, patient, proc, topicKey, date };
      })
      .filter(item => item.date && item.date > current && item.date <= limit)
      .sort((a, b) => (a.date?.getTime() || 0) - (b.date?.getTime() || 0));
  }, [appointments, patients]);

  const upcomingCases = useMemo(() => {
    return upcomingAppointments.filter(item => item.topicKey);
  }, [upcomingAppointments]);

  const nextAppointment = upcomingAppointments[0];

  const weekReviews = useMemo(() => {
    const otherCases = upcomingCases.filter(item => item.app.id !== nextAppointment?.app?.id);
    const keys = otherCases.map(c => c.topicKey).filter(Boolean) as StudyKey[];
    const uniqueKeys = Array.from(new Set(keys));

    return uniqueKeys.map(k => {
      const caseInfo = otherCases.find(c => c.topicKey === k);
      const category = STUDY_LIBRARY[k];

      let contextPhrase = category.title;
      if (caseInfo && caseInfo.date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const caseDate = new Date(caseInfo.date);
        caseDate.setHours(0, 0, 0, 0);
        const diffTime = caseDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          contextPhrase = `${category.title} amanhã`;
        } else if (diffDays <= 7) {
          contextPhrase = `${category.title} nesta semana`;
        } else {
          contextPhrase = `${category.title} em breve`;
        }
      }

      return {
        ...category,
        contextPhrase
      };
    }).slice(0, 3);
  }, [nextAppointment, upcomingCases]);

  const requestedLibraryItems = REQUIRED_LIBRARY_KEYS.map(key => STUDY_LIBRARY[key]);
  const extraLibraryItems = Object.values(STUDY_LIBRARY).filter(item => !REQUIRED_LIBRARY_KEYS.includes(item.id));
  const activeMaterial = selectedStudy ? STUDY_LIBRARY[selectedStudy] : null;
  const workMembers = workPlan.integrantes
    .split(/[,\n]/)
    .map(item => item.trim())
    .filter(Boolean);

  const canCreateExam = Boolean(
    examPlan.disciplina.trim() ||
    examPlan.tema.trim() ||
    examPlan.dataProva ||
    examPlan.tempoDisponivel.trim()
  );

  const canCreateWork = Boolean(
    workPlan.tema.trim() ||
    workPlan.prazo ||
    workPlan.integrantes.trim()
  );

  const openIntent = (intent: StudyIntent) => {
    setActiveIntent(intent);
    setSelectedStudy(null);
  };

  const ActionCard = ({
    icon: Icon,
    title,
    description,
    intent
  }: {
    icon: React.ElementType;
    title: string;
    description: string;
    intent: StudyIntent;
  }) => (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      onClick={() => openIntent(intent)}
      className="rounded-[24px] bg-white p-5 text-left border border-academy-border/75 shadow-[0_10px_32px_rgba(15,23,42,0.04)] transition-all hover:border-academy-primary/20 hover:shadow-[0_16px_40px_rgba(82,5,123,0.08)]"
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[16px] bg-academy-soft text-academy-primary">
        <Icon size={22} />
      </div>
      <h3 className="text-[16px] font-bold text-academy-text">{title}</h3>
      <p className="mt-1 text-[13px] font-medium leading-relaxed text-academy-muted">{description}</p>
    </motion.button>
  );

  const PlanBlock = ({
    title,
    children
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="rounded-[22px] border border-academy-border/70 bg-white px-5 py-4 shadow-sm">
      <h4 className="text-[14px] font-bold text-academy-text">{title}</h4>
      <div className="mt-2 text-[13px] font-medium leading-relaxed text-academy-muted">
        {children}
      </div>
    </div>
  );

  const EmptyState = ({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction
  }: {
    icon: React.ElementType;
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
  }) => (
    <div className="rounded-[28px] border border-academy-border/70 bg-white px-6 py-9 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[20px] bg-academy-soft text-academy-primary">
        <Icon size={25} />
      </div>
      <h3 className="text-[17px] font-bold text-academy-text">{title}</h3>
      {description && <p className="mx-auto mt-2 max-w-sm text-[13px] font-medium leading-relaxed text-academy-muted">{description}</p>}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 rounded-full bg-academy-primary px-5 py-3 text-[13px] font-bold text-white shadow-[0_12px_28px_rgba(82,5,123,0.16)] transition-all active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );

  const AppointmentStudyCard: React.FC<{ item: any }> = ({ item }) => {
    const topic = item.topicKey ? STUDY_LIBRARY[item.topicKey as StudyKey] : null;
    const appointmentName = item.app.patient_name || item.patient?.name || 'Atendimento agendado';
    const dateLabel = item.date?.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' });
    const timeLabel = item.date?.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const Icon = topic?.icon || Stethoscope;

    return (
      <motion.article
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[26px] border border-academy-border/75 bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.05)]"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[17px] bg-academy-soft text-academy-primary">
            <Icon size={23} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-bold uppercase text-academy-primary">
              {dateLabel} {timeLabel ? `· ${timeLabel}` : ''}
            </p>
            <h3 className="mt-1 truncate text-[17px] font-bold text-academy-text">{appointmentName}</h3>
            <p className="mt-1 text-[13px] font-medium leading-relaxed text-academy-muted">
              {topic
                ? `Revisão sugerida: ${topic.title}.`
                : 'Adicione procedimento ou observações na agenda para sugerir uma revisão específica.'}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => topic ? setSelectedStudy(topic.id) : openIntent('biblioteca')}
            className="flex-1 rounded-full bg-academy-primary px-4 py-3 text-[13px] font-bold text-white transition-all active:scale-95"
          >
            Preparar atendimento
          </button>
          {item.patient?.id && (
            <button
              type="button"
              onClick={() => openPatientRecord?.(item.patient.id)}
              className="flex-1 rounded-full border border-academy-border bg-white px-4 py-3 text-[13px] font-bold text-academy-muted transition-all hover:bg-academy-neutral active:scale-95"
            >
              Abrir caso
            </button>
          )}
        </div>
      </motion.article>
    );
  };

  const LibraryCard: React.FC<{ item: StudyMaterial }> = ({ item }) => (
    <motion.button
      type="button"
      key={`lib-${item.id}`}
      whileTap={{ scale: 0.98 }}
      onClick={() => setSelectedStudy(item.id)}
      className="group cursor-pointer rounded-[24px] border border-academy-border/70 bg-white p-5 text-left shadow-sm transition-all hover:border-academy-primary/20 hover:shadow-[0_14px_34px_rgba(82,5,123,0.08)]"
    >
      <div className="flex items-start gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] ${item.color}`}>
          <item.icon size={22} />
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <h4 className="text-[16px] font-bold text-academy-text">{item.title}</h4>
          <p className="mt-0.5 text-[12px] font-semibold text-academy-muted">
            {item.duration} · {item.level}
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-academy-muted">
            {item.topics}
          </p>
        </div>
        <div className="pt-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-academy-neutral text-academy-muted transition-colors group-hover:bg-academy-soft group-hover:text-academy-primary">
            <ChevronRight size={16} />
          </div>
        </div>
      </div>
    </motion.button>
  );

  if (activeMaterial) {
    const Icon = activeMaterial.icon;

    return (
      <div className="max-w-2xl mx-auto px-5 sm:px-6 pt-6 pb-32">
        <motion.button
          type="button"
          onClick={() => setSelectedStudy(null)}
          whileTap={{ scale: 0.97 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-bold text-academy-muted shadow-sm border border-academy-border hover:text-academy-text transition-colors"
        >
          <ArrowLeft size={15} />
          Voltar
        </motion.button>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[32px] border ${activeMaterial.borderColor} bg-white p-6 sm:p-7 shadow-xl shadow-slate-200/50 overflow-hidden relative`}
        >
          <div className={`w-14 h-14 rounded-[18px] flex items-center justify-center ${activeMaterial.color} mb-5`}>
            <Icon size={28} />
          </div>
          <p className="text-[13px] font-bold uppercase tracking-widest text-academy-study-text mb-2">
            Material de estudo
          </p>
          <h2 className="text-[32px] sm:text-[38px] font-bold text-academy-text leading-[1.05] tracking-tight">
            {activeMaterial.title}
          </h2>
          <p className="text-[15px] text-academy-muted font-medium mt-3 leading-relaxed">
            {activeMaterial.objective}
          </p>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="rounded-[18px] bg-academy-neutral px-4 py-3">
              <div className="flex items-center gap-2 text-academy-study-text font-bold text-[13px]">
                <Clock size={15} />
                {activeMaterial.duration}
              </div>
              <p className="text-[11px] text-academy-muted font-semibold mt-1">Tempo sugerido</p>
            </div>
            <div className="rounded-[18px] bg-academy-neutral px-4 py-3">
              <div className="flex items-center gap-2 text-academy-muted font-bold text-[13px]">
                <Target size={15} />
                {activeMaterial.level}
              </div>
              <p className="text-[11px] text-academy-muted font-semibold mt-1">Nivel</p>
            </div>
          </div>
        </motion.section>

        <section className="space-y-4 mt-8">
          <h3 className="text-[16px] font-bold text-academy-text px-1">Roteiro de revisao</h3>
          {activeMaterial.modules.map((module, moduleIndex) => (
            <motion.article
              key={module.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: moduleIndex * 0.05 }}
              className="bg-white rounded-[24px] border border-academy-border/70 p-5 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-academy-neutral text-academy-muted flex items-center justify-center text-[13px] font-bold shrink-0">
                  {moduleIndex + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-[16px] font-bold text-academy-text">{module.title}</h4>
                  <p className="text-[13px] text-academy-muted font-medium mt-1">{module.description}</p>
                  <div className="space-y-2.5 mt-4">
                    {module.steps.map(step => (
                      <div key={step} className="flex gap-2.5 text-[13px] text-academy-muted leading-relaxed">
                        <CheckCircle2 size={16} className="text-academy-muted shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </section>

        <section className="grid gap-4 mt-8">
          <div className="bg-white rounded-[24px] border border-academy-border/70 p-5">
            <h3 className="text-[15px] font-bold text-academy-text mb-4">Checklist antes do atendimento</h3>
            <div className="grid gap-2.5">
              {activeMaterial.checklist.map(item => (
                <div key={item} className="flex items-center gap-2.5 text-[13px] font-medium text-academy-muted">
                  <CheckCircle2 size={16} className="text-academy-success-text shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[24px] border border-academy-border/70 p-5">
            <h3 className="text-[15px] font-bold text-academy-text mb-4">Pontos de atencao</h3>
            <div className="grid gap-3">
              {activeMaterial.pitfalls.map(item => (
                <p key={item} className="text-[13px] leading-relaxed text-academy-attention-text bg-academy-attention rounded-[16px] px-4 py-3">
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="bg-white border border-academy-border rounded-[24px] p-5 text-academy-text">
            <div className="flex items-center gap-2 mb-3">
              <UserCircle size={18} className="text-academy-muted" />
              <h3 className="text-[15px] font-bold">Como explicar ao paciente</h3>
            </div>
            <p className="text-[14px] leading-relaxed text-academy-muted">{activeMaterial.patientTalk}</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 pb-32 pt-8 sm:px-6">
      <section className="space-y-5">
        <div className="pt-4">
          <p className="mb-2 text-[15px] font-semibold text-academy-muted">Estudos</p>
          <h2 className="text-[32px] font-bold leading-[1.08] text-academy-text sm:text-[36px]">
            O que você precisa preparar hoje?
          </h2>
          <p className="mt-3 max-w-xl text-[15px] font-medium leading-relaxed text-academy-muted">
            Estude pelo que você precisa resolver agora. Prova, trabalho, clínica ou dúvida rápida.
          </p>
        </div>

        <div className="-mx-5 overflow-x-auto px-5 no-scrollbar sm:-mx-6 sm:px-6">
          <div className="flex min-w-max gap-2 pb-1">
            {STUDY_INTENTS.map(intent => {
              const Icon = intent.icon;
              const isActive = activeIntent === intent.id;

              return (
                <button
                  type="button"
                  key={intent.id}
                  onClick={() => openIntent(intent.id)}
                  className={`inline-flex h-11 items-center gap-2 rounded-full border px-4 text-[13px] font-bold transition-all ${
                    isActive
                      ? 'border-academy-primary/20 bg-white text-academy-primary shadow-[0_10px_28px_rgba(82,5,123,0.12)]'
                      : 'border-transparent bg-academy-neutral/75 text-academy-muted hover:bg-white hover:text-academy-text'
                  }`}
                >
                  <Icon size={16} />
                  {intent.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <motion.div
        key={activeIntent}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        className="mt-8"
      >
        {activeIntent === 'agora' && (
          <section className="space-y-6">
            <div>
              <h3 className="text-[22px] font-bold leading-tight text-academy-text">
                Separei o que pode te ajudar agora.
              </h3>
              <p className="mt-2 text-[14px] font-medium text-academy-muted">
                A biblioteca continua aqui quando você quiser procurar por conta própria.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <ActionCard icon={Target} title="Preparar para prova" description="Monte uma revisão curta com prioridade e perguntas." intent="prova" />
              <ActionCard icon={FileText} title="Organizar trabalho" description="Estruture tema, grupo, fala e checklist." intent="trabalho" />
              <ActionCard icon={Stethoscope} title="Revisar para clínica" description="Veja atendimentos reais e revise o procedimento." intent="clinica" />
              <ActionCard icon={MessageCircle} title="Tirar dúvida rápida" description="Deixe a pergunta pronta para a futura resposta do Academy." intent="duvida" />
            </div>

            {nextAppointment ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <Stethoscope size={16} className="text-academy-primary" />
                  <h4 className="text-[15px] font-bold text-academy-text">Clínica próxima</h4>
                </div>
                <AppointmentStudyCard item={nextAppointment} />
              </div>
            ) : (
              <EmptyState
                icon={Calendar}
                title="Nenhum atendimento próximo para preparar agora."
                description="Quando houver atendimento real na sua agenda, ele aparece aqui sem inventar paciente ou procedimento."
                actionLabel="Ver agenda"
                onAction={() => setActiveTab?.('agenda')}
              />
            )}
          </section>
        )}

        {activeIntent === 'prova' && (
          <section className="space-y-5">
            <div className="rounded-[28px] border border-academy-border/75 bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.05)]">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-[17px] bg-academy-soft text-academy-primary">
                  <Target size={24} />
                </div>
                <div>
                  <h3 className="text-[20px] font-bold text-academy-text">Criar revisão para prova</h3>
                  <p className="mt-1 text-[13px] font-medium text-academy-muted">Um roteiro simples, pronto para integração futura.</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1.5">
                  <span className="text-[12px] font-bold text-academy-muted">Disciplina</span>
                  <input
                    value={examPlan.disciplina}
                    onChange={(e) => setExamPlan(prev => ({ ...prev, disciplina: e.target.value }))}
                    className="rounded-[18px] border border-academy-border bg-academy-neutral px-4 py-3 text-[14px] font-semibold text-academy-text outline-none focus:ring-2 focus:ring-academy-primary/10"
                    placeholder="Ex.: Endodontia"
                  />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-[12px] font-bold text-academy-muted">Tema</span>
                  <input
                    value={examPlan.tema}
                    onChange={(e) => setExamPlan(prev => ({ ...prev, tema: e.target.value }))}
                    className="rounded-[18px] border border-academy-border bg-academy-neutral px-4 py-3 text-[14px] font-semibold text-academy-text outline-none focus:ring-2 focus:ring-academy-primary/10"
                    placeholder="Tema da avaliação"
                  />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-[12px] font-bold text-academy-muted">Data da prova</span>
                  <input
                    type="date"
                    value={examPlan.dataProva}
                    onChange={(e) => setExamPlan(prev => ({ ...prev, dataProva: e.target.value }))}
                    className="rounded-[18px] border border-academy-border bg-academy-neutral px-4 py-3 text-[14px] font-semibold text-academy-text outline-none focus:ring-2 focus:ring-academy-primary/10"
                  />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-[12px] font-bold text-academy-muted">Tempo disponível</span>
                  <input
                    value={examPlan.tempoDisponivel}
                    onChange={(e) => setExamPlan(prev => ({ ...prev, tempoDisponivel: e.target.value }))}
                    className="rounded-[18px] border border-academy-border bg-academy-neutral px-4 py-3 text-[14px] font-semibold text-academy-text outline-none focus:ring-2 focus:ring-academy-primary/10"
                    placeholder="Ex.: 45 min hoje"
                  />
                </label>
              </div>

              <button
                type="button"
                disabled={!canCreateExam}
                onClick={() => setExamPlan(prev => ({ ...prev, created: true }))}
                className="mt-5 w-full rounded-full bg-academy-primary px-5 py-3.5 text-[14px] font-bold text-white transition-all active:scale-95 disabled:cursor-not-allowed disabled:bg-academy-border disabled:text-academy-muted"
              >
                Criar revisão
              </button>
            </div>

            {examPlan.created && (
              <div className="grid gap-3">
                <PlanBlock title="O que revisar primeiro">
                  {examPlan.tema || examPlan.disciplina
                    ? `Comece por ${examPlan.tema || examPlan.disciplina}. Separe conceitos, indicações e etapas que costumam cair.`
                    : 'Defina disciplina ou tema para ordenar a revisão.'}
                </PlanBlock>
                <PlanBlock title="Revisão rápida">
                  Monte um resumo de uma página com definições, sequência clínica e pontos de atenção.
                </PlanBlock>
                <PlanBlock title="Simulado/perguntas">
                  Transforme cada tópico em perguntas curtas e responda sem olhar o material.
                </PlanBlock>
                <PlanBlock title="Pontos para reforçar">
                  Marque erros, dúvidas recorrentes e itens que precisam de professor, monitoria ou biblioteca.
                </PlanBlock>
              </div>
            )}
          </section>
        )}

        {activeIntent === 'trabalho' && (
          <section className="space-y-5">
            <div className="rounded-[28px] border border-academy-border/75 bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.05)]">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-[17px] bg-academy-soft text-academy-primary">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-[20px] font-bold text-academy-text">Organizar trabalho</h3>
                  <p className="mt-1 text-[13px] font-medium text-academy-muted">Estrutura local, sem depender de backend agora.</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1.5 sm:col-span-2">
                  <span className="text-[12px] font-bold text-academy-muted">Tema</span>
                  <input
                    value={workPlan.tema}
                    onChange={(e) => setWorkPlan(prev => ({ ...prev, tema: e.target.value }))}
                    className="rounded-[18px] border border-academy-border bg-academy-neutral px-4 py-3 text-[14px] font-semibold text-academy-text outline-none focus:ring-2 focus:ring-academy-primary/10"
                    placeholder="Tema do trabalho"
                  />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-[12px] font-bold text-academy-muted">Tipo</span>
                  <select
                    value={workPlan.tipo}
                    onChange={(e) => setWorkPlan(prev => ({ ...prev, tipo: e.target.value as WorkPlan['tipo'] }))}
                    className="rounded-[18px] border border-academy-border bg-academy-neutral px-4 py-3 text-[14px] font-semibold text-academy-text outline-none focus:ring-2 focus:ring-academy-primary/10"
                  >
                    <option value="seminario">Seminário</option>
                    <option value="apresentacao">Apresentação</option>
                    <option value="resumo">Resumo</option>
                    <option value="relatorio">Relatório</option>
                  </select>
                </label>
                <label className="grid gap-1.5">
                  <span className="text-[12px] font-bold text-academy-muted">Prazo</span>
                  <input
                    type="date"
                    value={workPlan.prazo}
                    onChange={(e) => setWorkPlan(prev => ({ ...prev, prazo: e.target.value }))}
                    className="rounded-[18px] border border-academy-border bg-academy-neutral px-4 py-3 text-[14px] font-semibold text-academy-text outline-none focus:ring-2 focus:ring-academy-primary/10"
                  />
                </label>
                <label className="grid gap-1.5 sm:col-span-2">
                  <span className="text-[12px] font-bold text-academy-muted">Integrantes</span>
                  <input
                    value={workPlan.integrantes}
                    onChange={(e) => setWorkPlan(prev => ({ ...prev, integrantes: e.target.value }))}
                    className="rounded-[18px] border border-academy-border bg-academy-neutral px-4 py-3 text-[14px] font-semibold text-academy-text outline-none focus:ring-2 focus:ring-academy-primary/10"
                    placeholder="Separe nomes por vírgula"
                  />
                </label>
              </div>

              <button
                type="button"
                disabled={!canCreateWork}
                onClick={() => setWorkPlan(prev => ({ ...prev, created: true }))}
                className="mt-5 w-full rounded-full bg-academy-primary px-5 py-3.5 text-[14px] font-bold text-white transition-all active:scale-95 disabled:cursor-not-allowed disabled:bg-academy-border disabled:text-academy-muted"
              >
                Gerar estrutura
              </button>
            </div>

            {workPlan.created && (
              <div className="grid gap-3">
                <PlanBlock title="Tópicos principais">
                  {workPlan.tema
                    ? `Comece com contexto, conceitos essenciais, desenvolvimento do tema "${workPlan.tema}" e fechamento.`
                    : 'Defina o tema para organizar os tópicos principais.'}
                </PlanBlock>
                <PlanBlock title="Divisão do grupo">
                  {workMembers.length > 0 ? (
                    <div className="grid gap-1.5">
                      {workMembers.map((member, index) => (
                        <span key={`${member}-${index}`}>{member}: parte {index + 1} do roteiro.</span>
                      ))}
                    </div>
                  ) : (
                    'Adicione integrantes para sugerir uma divisão sem inventar nomes.'
                  )}
                </PlanBlock>
                <PlanBlock title="Roteiro de fala">
                  Abertura, problema, explicação principal, exemplo clínico quando houver e conclusão objetiva.
                </PlanBlock>
                <PlanBlock title="Checklist do que falta">
                  Referências, slides ou arquivo final, revisão de linguagem, ensaio e conferência do prazo.
                </PlanBlock>
              </div>
            )}
          </section>
        )}

        {activeIntent === 'clinica' && (
          <section className="space-y-5">
            <div>
              <h3 className="text-[22px] font-bold text-academy-text">Prepare a clínica com dados reais.</h3>
              <p className="mt-2 text-[14px] font-medium leading-relaxed text-academy-muted">
                Próximos atendimentos, revisões relacionadas e nenhum caso inventado.
              </p>
            </div>

            {upcomingAppointments.length > 0 ? (
              <div className="grid gap-3">
                {upcomingAppointments.slice(0, 5).map((item: any, index) => (
                  <AppointmentStudyCard key={item.app.id || `${item.app.patient_name}-${index}`} item={item} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Calendar}
                title="Nenhum atendimento próximo para preparar agora."
                description="Quando a agenda tiver um atendimento real, o Academy usa esse contexto aqui."
                actionLabel="Ver agenda"
                onAction={() => setActiveTab?.('agenda')}
              />
            )}

            {weekReviews.length > 0 && (
              <div className="space-y-3">
                <h4 className="px-1 text-[15px] font-bold text-academy-text">Revisões relacionadas</h4>
                <div className="grid gap-3">
                  {weekReviews.map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setSelectedStudy(cat.id)}
                      className="flex items-center gap-4 rounded-[22px] border border-academy-border/70 bg-white p-4 text-left shadow-sm transition-all hover:border-academy-primary/20"
                    >
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] ${cat.color}`}>
                        <cat.icon size={21} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5 className="text-[15px] font-bold text-academy-text">{cat.title}</h5>
                        <p className="mt-0.5 text-[12px] font-semibold text-academy-muted">{cat.contextPhrase}</p>
                      </div>
                      <ChevronRight size={16} className="shrink-0 text-academy-muted" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {activeIntent === 'duvida' && (
          <section className="space-y-5">
            <div>
              <h3 className="text-[22px] font-bold text-academy-text">Dúvida rápida</h3>
              <p className="mt-2 text-[14px] font-medium text-academy-muted">Digite uma pergunta clínica ou teórica.</p>
            </div>

            <div className="rounded-[28px] border border-academy-border/75 bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.05)]">
              <textarea
                value={quickQuestion}
                onChange={(e) => setQuickQuestion(e.target.value)}
                className="min-h-[130px] w-full resize-none rounded-[22px] border border-academy-border bg-academy-neutral px-4 py-4 text-[15px] font-semibold leading-relaxed text-academy-text outline-none focus:ring-2 focus:ring-academy-primary/10"
                placeholder="Digite uma dúvida clínica ou teórica"
              />

              <div className="mt-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {QUICK_QUESTION_SUGGESTIONS.map(suggestion => (
                  <button
                    type="button"
                    key={suggestion}
                    onClick={() => setQuickQuestion(suggestion)}
                    className="shrink-0 rounded-full border border-academy-border bg-white px-4 py-2 text-[12px] font-bold text-academy-muted transition-all hover:border-academy-primary/20 hover:text-academy-primary"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-academy-primary/10 bg-academy-soft px-5 py-4">
              <div className="flex items-start gap-3">
                <Zap size={18} className="mt-0.5 shrink-0 text-academy-primary" />
                <p className="text-[14px] font-semibold leading-relaxed text-academy-primary-dark">
                  Em breve, o Academy vai responder dúvidas rápidas com explicações objetivas.
                </p>
              </div>
            </div>
          </section>
        )}

        {activeIntent === 'biblioteca' && (
          <section className="space-y-5">
            <div>
              <h3 className="text-[22px] font-bold text-academy-text">Biblioteca</h3>
              <p className="mt-2 text-[14px] font-medium leading-relaxed text-academy-muted">
                A biblioteca continua aqui quando você quiser procurar por conta própria.
              </p>
            </div>

            <div className="grid gap-4">
              {requestedLibraryItems.map(item => (
                <LibraryCard key={item.id} item={item} />
              ))}
            </div>

            {extraLibraryItems.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="px-1 text-[14px] font-bold text-academy-muted">Também disponíveis</h4>
                <div className="grid gap-4">
                  {extraLibraryItems.map(item => (
                    <LibraryCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </motion.div>
    </div>
  );
};
