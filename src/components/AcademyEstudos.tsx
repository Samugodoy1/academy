import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  FileText,
  Heart,
  Pill,
  Search,
  Shield,
  Sparkles,
  Stethoscope,
  Syringe,
  Target,
  Tooth,
  UserCircle
} from '../icons';
import { getAppointmentTime, parseAppointmentDateTime } from '../utils/dateUtils';
import { mapProcedureToTopic, StudyKey } from '../utils/studyTopics';
import { generateBoxContext, BoxIntelligenceContext } from '../data/boxIntelligence';
import {
  countClinicalSkills,
  detectClinicalGaps,
  getLastPerformedSkill,
  mapSkillToStudyTopic,
} from '../utils/clinicalProgression';

const STUDY_TOPIC_STORAGE_KEY = 'academy_study_topic';

interface AcademyEstudosProps {
  patients?: any[];
  appointments?: any[];
  setActiveTab?: (tab: any) => void;
  openPatientRecord?: (id: number) => void;
}

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
  /** Key facts and numbers the student must have memorized before the box. */
  quickFacts: Array<{ label: string; value: string }>;
  /** Active-recall questions: answer hidden until tapped. */
  selfTest: Array<{ question: string; answer: string }>;
  patientTalk: string;
};

const ACTIVE_STATUSES = new Set(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS']);

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
    quickFacts: [
      { label: 'Ordem do exame', value: 'Extraoral → intraoral → dentes → periodonto → exames complementares.' },
      { label: 'Queixa principal', value: 'Registrar com as palavras do paciente + início, duração e intensidade.' },
      { label: 'Prioridade', value: 'Dor, infecção e risco funcional sempre antes de eletivos.' },
      { label: 'Diagnóstico', value: 'Clínica + imagem + testes. Nunca um achado isolado.' }
    ],
    selfTest: [
      {
        question: 'O que não pode faltar no registro da queixa principal?',
        answer: 'As palavras do próprio paciente, início, duração, intensidade e o que alivia ou piora. Isso orienta urgência e hipótese diagnóstica.'
      },
      {
        question: 'O paciente quer "só restaurar o dente da frente", mas tem dor espontânea em outro dente. O que vem primeiro?',
        answer: 'A urgência. Dor, infecção e risco funcional sempre antes de tratamento eletivo — e isso precisa ser explicado ao paciente.'
      },
      {
        question: 'Achado radiográfico sugestivo fecha o diagnóstico?',
        answer: 'Não. Radiografia é dado complementar: precisa de correlação com história, inspeção e testes clínicos antes de virar conduta.'
      }
    ],
    patientTalk: 'Explique que a primeira consulta serve para entender a causa do problema e montar uma ordem segura de tratamento, nao apenas olhar um dente isolado.'
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
    quickFacts: [
      { label: 'Periapical', value: 'Ápice, lesão periapical, endodontia e trauma localizado.' },
      { label: 'Bite-wing', value: 'Cárie proximal, adaptação de restauração e crista óssea posterior.' },
      { label: 'Panorâmica', value: 'Visão geral, terceiros molares e lesões extensas — não serve para cárie pequena.' },
      { label: 'Leitura', value: 'Anatomia normal primeiro; depois procurar alteração.' }
    ],
    selfTest: [
      {
        question: 'Suspeita de cárie proximal pequena em pré-molar. Qual tomada pedir?',
        answer: 'Bite-wing. A panorâmica não tem definição suficiente para lesão proximal incipiente.'
      },
      {
        question: 'A imagem saiu com o dente alongado. Qual foi o erro provável?',
        answer: 'Angulação vertical insuficiente na técnica da bissetriz (alongamento). Angulação excessiva causa o contrário: encurtamento.'
      },
      {
        question: 'Como descrever um achado radiográfico no laudo?',
        answer: 'Localização, tamanho, limites (definidos ou não), densidade (radiolúcida/radiopaca) e relação com dentes e estruturas vizinhas.'
      }
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
    quickFacts: [
      { label: 'Lidocaína 2%', value: 'Dose máxima usual ~4,4 mg/kg. 1 tubete (1,8 ml) = 36 mg. Confirme o protocolo da disciplina.' },
      { label: 'Criança / baixo peso', value: 'Dose SEMPRE calculada por peso — nunca "1 tubete padrão".' },
      { label: 'Antes de injetar', value: 'Aspirar sempre; deposição lenta (~1 ml/min).' },
      { label: 'Latência', value: 'Aguardar e TESTAR a região antes de iniciar o procedimento.' }
    ],
    selfTest: [
      {
        question: 'O que conferir na anamnese antes de escolher o anestésico?',
        answer: 'Peso, idade, alergias relatadas, cardiopatia/hipertensão, medicamentos em uso, gestação e histórico de reação anterior.'
      },
      {
        question: 'O bloqueio do alveolar inferior falhou. Qual o primeiro passo?',
        answer: 'Reavaliar antes de repetir: técnica e referências anatômicas (rafe pterigomandibular, plano oclusal), tempo de latência e inflamação local. Repetir dose sem critério só soma risco.'
      },
      {
        question: 'Logo após a injeção o paciente fica pálido, suando e tonto. O que é mais provável?',
        answer: 'Lipotimia (reação vasovagal) — muito mais comum que alergia verdadeira. Deitar o paciente, elevar as pernas e monitorar. Não registrar como "alergia" sem critério.'
      }
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
    quickFacts: [
      { label: 'Segurança', value: 'Fio dental amarrado no grampo, sempre — é o resgate se ele soltar.' },
      { label: 'Grampo', value: 'Testar estabilidade no dente ANTES de levar o lençol.' },
      { label: 'Inversão', value: 'Instrumento rombo + jato de ar; amarrilho se precisar.' },
      { label: 'Vazamento cervical', value: 'Barreira gengival ou teflon — não dá para "ignorar e aderir".' }
    ],
    selfTest: [
      {
        question: 'Para que serve o fio dental amarrado no grampo?',
        answer: 'Resgate: se o grampo soltar ou fraturar, o fio impede aspiração ou deglutição. É item de segurança, não opcional.'
      },
      {
        question: 'O campo parece isolado, mas há umidade subindo pela cervical. Pode adesivar?',
        answer: 'Não. Vazamento cervical contamina a margem e compromete a adesão. Corrigir com inversão, barreira gengival ou troca de grampo antes de continuar.'
      },
      {
        question: 'O que define a escolha do grampo?',
        answer: 'Anatomia cervical do dente, grau de erupção, retenção disponível e o acesso necessário para o procedimento.'
      }
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
    quickFacts: [
      { label: 'Sulco saudável', value: 'Até ~3 mm de sondagem, sem sangramento.' },
      { label: 'Gengivite', value: 'Inflamação SEM perda de inserção — reversível.' },
      { label: 'Periodontite', value: 'Perda de inserção/osso — exige raspagem e manutenção.' },
      { label: 'Reavaliação', value: 'Em geral 30–45 dias após a raspagem (confirme com a disciplina).' }
    ],
    selfTest: [
      {
        question: 'O que diferencia gengivite de periodontite na prática?',
        answer: 'Perda de inserção e de osso. Gengivite é inflamação reversível sem perda; periodontite tem perda de inserção, e o plano muda.'
      },
      {
        question: 'Paciente com cálculo subgengival: profilaxia com taça resolve?',
        answer: 'Não. Polimento não alcança o depósito subgengival — precisa raspagem e alisamento radicular, senão a causa permanece.'
      },
      {
        question: 'O que registrar na sondagem?',
        answer: 'Profundidade por sítio, sangramento, recessão, mobilidade e furca. Sem registro não há como acompanhar evolução na reavaliação.'
      }
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
    quickFacts: [
      { label: 'Risco de cárie', value: 'Dieta (frequência de açúcar) + higiene + flúor + histórico de lesões.' },
      { label: 'Lesão ativa', value: 'Mancha branca OPACA e rugosa = atividade. Brilhante e lisa = inativa.' },
      { label: 'Selante', value: 'Fóssulas/fissuras retentivas em dente com risco — campo seco obrigatório.' },
      { label: 'Flúor', value: 'Indicação conforme idade e risco, não "automática" em toda consulta.' }
    ],
    selfTest: [
      {
        question: 'Mancha branca opaca e rugosa perto da cervical: o que significa e o que fazer?',
        answer: 'Lesão de cárie ATIVA não cavitada. Conduta: controle de biofilme, flúor e dieta — não broca. Remineralizar antes de pensar em restaurar.'
      },
      {
        question: 'Quando o selante é bem indicado?',
        answer: 'Sulcos retentivos em paciente com risco de cárie, especialmente molares recém-erupcionados — com isolamento e condicionamento adequados.'
      },
      {
        question: 'Por que profilaxia sem orientação tem pouco efeito?',
        answer: 'O biofilme se reorganiza em horas. Sem mudança de hábito (higiene + frequência de açúcar), a doença continua ativa.'
      }
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
    quickFacts: [
      { label: 'Isolamento', value: 'Absoluto, sempre. Endodontia sem isolamento não se discute.' },
      { label: 'Odontometria', value: 'CT com localizador apical + confirmação radiográfica.' },
      { label: 'Irrigação', value: 'A cada troca de lima. Nunca instrumentar canal seco.' },
      { label: 'Registro', value: 'CT, lima final, irrigante, medicação e selamento — em toda sessão.' }
    ],
    selfTest: [
      {
        question: 'Dor espontânea, noturna, que piora com frio e demora a passar: hipótese principal?',
        answer: 'Pulpite irreversível (provável). Confirmar com testes de vitalidade, percussão e imagem antes de definir conduta.'
      },
      {
        question: 'A sessão anterior registrou "acesso + odontometria, CT 21 mm". O que fazer hoje?',
        answer: 'Continuar de onde parou: confirmar canais e CT e instrumentar. Não refazer acesso — remover mais estrutura só enfraquece o dente.'
      },
      {
        question: 'O que não pode faltar na evolução de uma sessão de endo?',
        answer: 'Dente, CT, lima final, irrigante usado, medicação intracanal ou obturação, tipo de selamento e o próximo passo combinado.'
      }
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
    quickFacts: [
      { label: 'Cor', value: 'Escolher ANTES de isolar, com dente hidratado e boa luz.' },
      { label: 'Incrementos', value: 'Até ~2 mm; fotoativar pelo tempo do fabricante.' },
      { label: 'Contaminação', value: 'Saliva no campo adesivo = lavar, secar e recondicionar. Sem atalho.' },
      { label: 'Final', value: 'Checar oclusão com carbono ANTES do polimento.' }
    ],
    selfTest: [
      {
        question: 'Por que a cor precisa ser escolhida antes do isolamento?',
        answer: 'O dente desidrata sob isolamento e fica temporariamente mais claro e opaco — a cor escolhida depois sai errada.'
      },
      {
        question: 'Saliva contaminou a cavidade depois do adesivo. Qual a conduta?',
        answer: 'Não prosseguir por cima: lavar, secar e repetir condicionamento/adesivo na área contaminada. Adesão sobre contaminação falha.'
      },
      {
        question: 'Paciente volta com dor ao mastigar no dente restaurado ontem. Primeira suspeita?',
        answer: 'Contato oclusal alto. Conferir com papel articular e ajustar — é a causa mais comum e a de resolução mais simples.'
      }
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
    quickFacts: [
      { label: 'RX pré-op', value: 'Conferir na hora: raízes, curvaturas, seio maxilar e canal mandibular.' },
      { label: 'Antes de luxar', value: 'Anestesia TESTADA + sindesmotomia completa.' },
      { label: 'Força', value: 'Luxação progressiva e apoio correto — força bruta fratura raiz.' },
      { label: 'Alta', value: 'Pós-operatório por escrito: gaze, gelo, repouso e sinais de alerta.' }
    ],
    selfTest: [
      {
        question: 'O que checar na radiografia antes de uma exodontia?',
        answer: 'Número e curvatura das raízes, hipercementose, proximidade com seio maxilar ou canal mandibular e condição do osso ao redor.'
      },
      {
        question: 'Paciente em uso de anticoagulante. Suspende antes da extração?',
        answer: 'Não por conta própria. Alinhar com professor/médico; em geral o manejo é hemostasia local bem planejada (compressão, sutura, hemostático), não suspensão.'
      },
      {
        question: 'O alvéolo continua sangrando após a compressão inicial. Sequência?',
        answer: 'Compressão prolongada com gaze, sutura, hemostático local se disponível — e revisar a história médica se o sangramento persistir.'
      }
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
    quickFacts: [
      { label: 'Moldagem', value: 'Margem visível, limpa e seca. Término incompleto = refazer.' },
      { label: 'Subgengival', value: 'Afastamento gengival antes de registrar a margem.' },
      { label: 'Provisório', value: 'Protege o preparo e testa forma, função e resposta gengival.' },
      { label: 'Oclusão', value: 'Conferir em MIC e nos movimentos excursivos.' }
    ],
    selfTest: [
      {
        question: 'A moldagem saiu com uma bolha exatamente no término. Aceita?',
        answer: 'Não. O laboratório não adivinha a margem — peça nova moldagem. Término incompleto vira coroa desadaptada.'
      },
      {
        question: 'Qual a função do provisório além da estética?',
        answer: 'Proteger dentina exposta, manter posição do dente e do espaço, condicionar a gengiva e testar forma e oclusão antes da peça final.'
      },
      {
        question: 'Provisório ficou alto na oclusão. O que pode acontecer?',
        answer: 'Dor, mobilidade, fratura ou descimentação. Ajustar oclusão é parte da instalação, não opcional.'
      }
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
    quickFacts: [
      { label: 'Manejo', value: 'Dizer-mostrar-fazer, comandos curtos, reforço do comportamento certo.' },
      { label: 'Anestésico', value: 'Dose SEMPRE por peso (mg/kg). Confirmar máximo com o professor.' },
      { label: 'Decíduo', value: 'Checar cronologia de esfoliação antes de indicar tratamento.' },
      { label: 'Responsável', value: 'Informado e com consentimento registrado, sempre.' }
    ],
    selfTest: [
      {
        question: 'Como se calcula anestésico em criança?',
        answer: 'Por peso (mg/kg), nunca "1 tubete padrão". Criança de 20 kg tolera muito menos que um adulto — calcular antes, não durante.'
      },
      {
        question: 'Molar decíduo com cárie extensa, mobilidade e sucessor visível no RX. Tratar?',
        answer: 'Avaliar esfoliação primeiro: se está próxima, tratamento invasivo pode não se justificar. Controlar dor/infecção e discutir com o professor.'
      },
      {
        question: 'A criança chora e não colabora de jeito nenhum. Qual a conduta?',
        answer: 'Encurtar a consulta, resolver só o essencial e replanejar. Forçar o atendimento piora a colaboração em todas as consultas seguintes.'
      }
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

const getDayPhrase = (date: Date) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (date.toDateString() === today.toDateString()) return 'Hoje você atende';
  if (date.toDateString() === tomorrow.toDateString()) return 'Amanhã você atende';
  const weekday = date.toLocaleDateString('pt-BR', { weekday: 'long' }).split('-')[0];
  const prefix = ['sábado', 'domingo'].includes(weekday.toLowerCase()) ? 'No' : 'Na';
  return `${prefix} ${weekday} você atende`;
};

const getWhenLabel = (date: Date) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  if (date.toDateString() === today.toDateString()) return `Hoje · ${time}`;
  if (date.toDateString() === tomorrow.toDateString()) return `Amanhã · ${time}`;
  const day = date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
  return `${day} · ${time}`;
};

const firstName = (name?: string) => (name || 'paciente').trim().split(' ')[0] || 'paciente';

const cleanCheckpoint = (value?: string) => String(value || '').replace(/^⚠️\s*/, '').trim();

/** Fallback topic mapping when the appointment text alone is not enough. */
const BOX_PROCEDURE_TOPIC: Record<string, StudyKey> = {
  Consulta: 'exame-clinico',
  Endodontia: 'endodontia',
  Dentistica: 'dentistica',
  Cirurgia: 'cirurgia',
  Periodontia: 'periodontia',
  Protese: 'protese',
  Urgencia: 'exame-clinico',
};

const SKILL_PT: Record<string, string> = {
  restauracao: 'restaurações',
  raspagem: 'raspagens',
  exodontia: 'exodontias',
  endodontia: 'endodontias',
  profilaxia: 'profilaxias',
  clareamento: 'clareamentos',
  isolamento: 'isolamento absoluto',
  anestesia: 'anestesias',
  consulta: 'consultas',
  protese: 'próteses',
  cirurgia: 'cirurgias',
};

interface UpcomingCase {
  app: any;
  patient: any;
  topicKey: StudyKey;
  proc: string | null;
  date: Date;
  box: BoxIntelligenceContext;
}

// ── Clinical confidence (self-reported, persisted) ─────────────────────
// Founder doc: "Avaliação de confiança clínica, não apenas de horas consumidas."

type ConfidenceLevel = 'confident' | 'review' | 'ask';

const CONFIDENCE_STORAGE_KEY = 'academy_study_confidence_v1';

type ConfidenceMap = Partial<Record<StudyKey, { level: ConfidenceLevel; at: string }>>;

const loadConfidenceMap = (): ConfidenceMap => {
  try {
    return JSON.parse(localStorage.getItem(CONFIDENCE_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

const CONFIDENCE_OPTIONS: Array<{ level: ConfidenceLevel; label: string; hint: string }> = [
  { level: 'confident', label: 'Entraria confiante', hint: 'Sigo para o caso.' },
  { level: 'review', label: 'Quero rever de novo', hint: 'Mantenho este tema visível para você.' },
  { level: 'ask', label: 'Vou perguntar ao professor', hint: 'Anote a dúvida agora para não esquecer no box.' },
];

const normalizeSearch = (value: string) =>
  value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export const AcademyEstudos: React.FC<AcademyEstudosProps> = ({
  patients = [],
  appointments = [],
  setActiveTab,
  openPatientRecord
}) => {
  const [selectedStudy, setSelectedStudy] = useState<StudyKey | null>(null);
  const [selectedCase, setSelectedCase] = useState<UpcomingCase | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(new Set());
  const [confidenceMap, setConfidenceMap] = useState<ConfidenceMap>(loadConfidenceMap);
  const [librarySearch, setLibrarySearch] = useState('');
  const now = new Date();

  useEffect(() => {
    const stored = sessionStorage.getItem(STUDY_TOPIC_STORAGE_KEY) as StudyKey | null;
    if (stored && STUDY_LIBRARY[stored]) {
      setSelectedStudy(stored);
      sessionStorage.removeItem(STUDY_TOPIC_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    setCheckedItems(new Set());
    setRevealedAnswers(new Set());
  }, [selectedStudy]);

  const setTopicConfidence = (topic: StudyKey, level: ConfidenceLevel) => {
    setConfidenceMap(prev => {
      const next: ConfidenceMap = { ...prev, [topic]: { level, at: new Date().toISOString() } };
      try {
        localStorage.setItem(CONFIDENCE_STORAGE_KEY, JSON.stringify(next));
      } catch { /* storage indisponível: segue só em memória */ }
      return next;
    });
  };

  const toggleAnswer = (index: number) => {
    setRevealedAnswers(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const upcomingCases = useMemo<UpcomingCase[]>(() => {
    const limit = new Date(now);
    limit.setDate(limit.getDate() + 15);

    const usable = appointments
      .filter(app => ACTIVE_STATUSES.has(String(app.status).toUpperCase()))
      .filter(app => {
        const d = parseDate(app.start_time);
        return d && d > now && d <= limit;
      })
      .sort((a, b) => getAppointmentTime(a.start_time) - getAppointmentTime(b.start_time));

    const cases: UpcomingCase[] = [];
    for (const app of usable) {
      const patient = getPatient(patients, app.patient_id);
      if (!patient) continue;

      const treatments = (patient.treatmentPlan || []).filter((item: any) =>
        ['APROVADO', 'PENDENTE', 'PLANEJADO'].includes(String(item?.status || '').toUpperCase())
      );
      const patientAppointments = appointments.filter(
        a => String(a.patient_id) === String(patient.id)
      );
      const box = generateBoxContext(patient, treatments, patientAppointments);

      const proc = getProcedureHint(app, patient);
      const topicKey =
        mapProcedureToTopic(proc) ||
        (box.procedureInferred ? BOX_PROCEDURE_TOPIC[box.procedureInferred] : null) ||
        (box.isFirstConsultation ? 'exame-clinico' : null);

      if (!topicKey) continue;
      cases.push({ app, patient, topicKey, proc, date: parseDate(app.start_time)!, box });
    }
    return cases;
  }, [appointments, patients]);

  const nextCase = upcomingCases[0] || null;
  const nextCaseTopic = nextCase ? STUDY_LIBRARY[nextCase.topicKey] : null;

  const laterCases = useMemo(() => {
    const seen = new Set<string>();
    return upcomingCases.slice(1).filter(c => {
      const key = `${c.patient.id}-${c.topicKey}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 3);
  }, [upcomingCases]);

  const upcomingTopicSet = useMemo(
    () => new Set(upcomingCases.map(c => c.topicKey)),
    [upcomingCases]
  );

  const skillCounts = useMemo(() => countClinicalSkills(patients), [patients]);

  const clinicalGaps = useMemo(() => {
    return detectClinicalGaps(skillCounts)
      .filter(gap => gap.studyTopic && !upcomingTopicSet.has(gap.studyTopic))
      .slice(0, 2);
  }, [skillCounts, upcomingTopicSet]);

  const consolidation = useMemo(() => {
    const lastSkill = getLastPerformedSkill(patients);
    if (!lastSkill) return null;
    const topic = mapSkillToStudyTopic(lastSkill);
    if (!topic) return null;
    if (upcomingTopicSet.has(topic)) return null;
    if (clinicalGaps.some(gap => gap.studyTopic === topic)) return null;
    return { skill: lastSkill, skillLabel: SKILL_PT[lastSkill] || lastSkill, topic };
  }, [patients, upcomingTopicSet, clinicalGaps]);

  const reviewRequests = useMemo(() => {
    return (Object.entries(confidenceMap) as Array<[StudyKey, { level: ConfidenceLevel; at: string }]>)
      .filter(([topic, value]) =>
        (value.level === 'review' || value.level === 'ask') &&
        STUDY_LIBRARY[topic] &&
        !upcomingTopicSet.has(topic)
      )
      .sort((a, b) => new Date(b[1].at).getTime() - new Date(a[1].at).getTime())
      .slice(0, 3)
      .map(([topic, value]) => ({ topic, level: value.level }));
  }, [confidenceMap, upcomingTopicSet]);

  const allLibraryItems = Object.values(STUDY_LIBRARY);

  const filteredLibraryItems = useMemo(() => {
    const query = normalizeSearch(librarySearch.trim());
    if (!query) return allLibraryItems;
    const mappedTopic = mapProcedureToTopic(librarySearch);
    return allLibraryItems.filter(cat =>
      cat.id === mappedTopic ||
      normalizeSearch(`${cat.title} ${cat.subtitle} ${cat.topics} ${cat.level}`).includes(query)
    );
  }, [librarySearch]);

  const activeMaterial = selectedStudy ? STUDY_LIBRARY[selectedStudy] : null;

  const openStudy = (key: StudyKey, caseInfo: UpcomingCase | null = null) => {
    setSelectedCase(caseInfo);
    setSelectedStudy(key);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
  };

  const closeStudy = () => {
    setSelectedStudy(null);
    setSelectedCase(null);
  };

  const toggleChecklistItem = (item: string) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  };

  // ── Material view ────────────────────────────────────────────────────
  if (activeMaterial) {
    const Icon = activeMaterial.icon;
    const caseBox = selectedCase?.box || null;
    const checkedCount = activeMaterial.checklist.filter(item => checkedItems.has(item)).length;

    return (
      <div className="max-w-2xl mx-auto px-5 sm:px-6 pt-6 pb-32">
        <motion.button
          type="button"
          onClick={closeStudy}
          whileTap={{ scale: 0.97 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-bold text-academy-muted shadow-sm border border-academy-border hover:text-academy-text transition-colors"
        >
          <ArrowLeft size={15} />
          Voltar
        </motion.button>

        {selectedCase && caseBox && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-[28px] bg-academy-primary text-white p-6 shadow-[0_16px_44px_rgba(82,5,123,0.25)] overflow-hidden relative"
          >
            <span className="text-white/60 text-[11px] font-bold uppercase tracking-[0.12em]">
              Revisão para um caso real
            </span>
            <h3 className="text-[22px] font-bold leading-snug mt-1.5">
              {firstName(selectedCase.patient?.name || selectedCase.app?.patient_name)} · {getWhenLabel(selectedCase.date)}
            </h3>

            <div className="mt-4 grid gap-2.5">
              {caseBox.boxProcedureDetail && (
                <div className="rounded-[16px] bg-white/10 border border-white/15 px-4 py-2.5">
                  <span className="text-white/55 text-[10px] font-bold uppercase tracking-[0.1em]">Conduta planejada</span>
                  <p className="text-[13px] font-semibold mt-0.5 leading-snug">{caseBox.boxProcedureDetail}</p>
                </div>
              )}
              {cleanCheckpoint(caseBox.criticalCheckpoint) && (
                <div className="rounded-[16px] bg-white/10 border border-white/15 px-4 py-2.5">
                  <span className="text-white/55 text-[10px] font-bold uppercase tracking-[0.1em]">O que importa neste caso</span>
                  <p className="text-[13px] font-semibold mt-0.5 leading-snug">{cleanCheckpoint(caseBox.criticalCheckpoint)}</p>
                </div>
              )}
              {caseBox.anamnesisAlert && (
                <div className="rounded-[16px] bg-white px-4 py-2.5 flex items-start gap-2.5">
                  <AlertCircle size={16} className="text-academy-attention-text shrink-0 mt-0.5" />
                  <p className="text-[13px] font-semibold text-academy-attention-text leading-snug">{caseBox.anamnesisAlert}</p>
                </div>
              )}
            </div>

            {openPatientRecord && (
              <button
                type="button"
                onClick={() => openPatientRecord(selectedCase.patient.id)}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 border border-white/20 px-4 py-2 text-[13px] font-bold text-white active:scale-95 transition-transform"
              >
                Abrir caso
                <ArrowUpRight size={14} />
              </button>
            )}
          </motion.section>
        )}

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
              <p className="text-[11px] text-academy-muted font-semibold mt-1">Nível</p>
            </div>
          </div>
        </motion.section>

        {activeMaterial.quickFacts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-academy-primary rounded-[24px] p-5 mt-4 text-white shadow-[0_12px_36px_rgba(82,5,123,0.2)]"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-white/70" />
              <h3 className="text-[15px] font-bold">Na ponta da língua</h3>
            </div>
            <div className="grid gap-2.5">
              {activeMaterial.quickFacts.map(fact => (
                <div key={fact.label} className="rounded-[16px] bg-white/10 border border-white/15 px-4 py-3">
                  <span className="text-white/55 text-[10px] font-bold uppercase tracking-[0.1em]">{fact.label}</span>
                  <p className="text-[13px] font-semibold mt-0.5 leading-snug">{fact.value}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        <section className="space-y-4 mt-8">
          <h3 className="text-[16px] font-bold text-academy-text px-1">Roteiro de revisão</h3>
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-academy-text">Checklist antes do atendimento</h3>
              <span className="text-[12px] font-bold text-academy-muted">
                {checkedCount}/{activeMaterial.checklist.length}
              </span>
            </div>
            <div className="grid gap-1.5">
              {activeMaterial.checklist.map(item => {
                const isChecked = checkedItems.has(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleChecklistItem(item)}
                    className={`flex items-center gap-3 rounded-[14px] px-3 py-2.5 text-left transition-colors ${
                      isChecked ? 'bg-academy-success' : 'hover:bg-academy-neutral'
                    }`}
                  >
                    <span
                      className={`w-[22px] h-[22px] rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        isChecked
                          ? 'bg-academy-success-text border-academy-success-text text-white'
                          : 'border-academy-border bg-white text-transparent'
                      }`}
                    >
                      <Check size={12} />
                    </span>
                    <span className={`text-[13px] font-medium ${isChecked ? 'text-academy-success-text' : 'text-academy-muted'}`}>
                      {item}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {activeMaterial.selfTest.length > 0 && (
            <div className="bg-white rounded-[24px] border border-academy-border/70 p-5">
              <h3 className="text-[15px] font-bold text-academy-text">Teste-se antes do box</h3>
              <p className="text-[12px] font-medium text-academy-muted mt-1 mb-4">
                Responda de cabeça primeiro. Depois confira.
              </p>
              <div className="grid gap-3">
                {activeMaterial.selfTest.map((qa, index) => {
                  const revealed = revealedAnswers.has(index);
                  return (
                    <div key={qa.question} className="rounded-[18px] border border-academy-border/70 overflow-hidden">
                      <p className="text-[14px] font-semibold text-academy-text leading-snug px-4 pt-3.5 pb-3">
                        {qa.question}
                      </p>
                      {revealed ? (
                        <div className="bg-academy-neutral px-4 py-3 border-t border-academy-border/60">
                          <p className="text-[13px] text-academy-muted leading-relaxed">{qa.answer}</p>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggleAnswer(index)}
                          className="w-full text-left px-4 py-3 bg-academy-neutral text-[13px] font-bold text-academy-primary border-t border-academy-border/60 hover:bg-academy-soft transition-colors"
                        >
                          Ver resposta
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="bg-white rounded-[24px] border border-academy-border/70 p-5">
            <h3 className="text-[15px] font-bold text-academy-text mb-4">Pontos de atenção</h3>
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

          <div className="bg-white rounded-[24px] border border-academy-border/70 p-5">
            <h3 className="text-[15px] font-bold text-academy-text">
              Como você entraria nesse atendimento agora?
            </h3>
            <p className="text-[12px] font-medium text-academy-muted mt-1 mb-4">
              Resposta honesta. Sem nota, sem ranking — só ajusta o que eu te mostro depois.
            </p>
            <div className="grid gap-2">
              {CONFIDENCE_OPTIONS.map(option => {
                const isSelected = selectedStudy ? confidenceMap[selectedStudy]?.level === option.level : false;
                return (
                  <button
                    key={option.level}
                    type="button"
                    onClick={() => selectedStudy && setTopicConfidence(selectedStudy, option.level)}
                    className={`flex items-center gap-3 rounded-[16px] border px-4 py-3 text-left transition-colors ${
                      isSelected
                        ? option.level === 'confident'
                          ? 'bg-academy-success border-academy-success-text/20'
                          : 'bg-academy-alert border-academy-alert-text/20'
                        : 'bg-white border-academy-border hover:bg-academy-neutral'
                    }`}
                  >
                    <span
                      className={`w-[20px] h-[20px] rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? option.level === 'confident'
                            ? 'bg-academy-success-text border-academy-success-text text-white'
                            : 'bg-academy-alert-text border-academy-alert-text text-white'
                          : 'border-academy-border bg-white text-transparent'
                      }`}
                    >
                      <Check size={11} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[14px] font-bold text-academy-text">
                        {option.label}
                      </span>
                      {isSelected && (
                        <span className="block text-[12px] font-medium text-academy-muted mt-0.5">
                          {option.hint}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedCase && openPatientRecord && (
            <button
              type="button"
              onClick={() => openPatientRecord(selectedCase.patient.id)}
              className="w-full bg-academy-primary text-white font-bold text-[15px] py-[16px] rounded-[20px] shadow-lg active:scale-95 transition-transform"
            >
              Revisei. Abrir caso de {firstName(selectedCase.patient?.name || selectedCase.app?.patient_name)}
            </button>
          )}
        </section>
      </div>
    );
  }

  // ── List view ────────────────────────────────────────────────────────
  const preceptorMessage = nextCase
    ? `Preparei a revisão pelo caso de ${firstName(nextCase.patient?.name || nextCase.app?.patient_name)}, não por catálogo.`
    : clinicalGaps.length > 0
      ? 'Sem atendimento próximo na agenda. Sugeri revisões pelas lacunas do seu histórico clínico.'
      : 'Nada urgente para estudar agora. Quando um caso entrar na agenda, a revisão certa aparece aqui primeiro.';

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-6 space-y-10 pt-8 pb-32">
      <section className="space-y-6">
        <div className="pt-6">
          <p className="text-[16px] font-medium text-academy-muted mb-2">
            Estudos
          </p>
          <h2 className="text-[34px] sm:text-[38px] font-bold text-academy-text leading-[1.1] tracking-tight mt-1">
            {nextCase ? 'O que revisar agora' : 'Sua revisão clínica'}
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="flex items-start gap-3 rounded-2xl px-5 py-4 liquid-glass-card"
        >
          <Stethoscope size={18} className="mt-0.5 shrink-0 text-academy-primary" />
          <p className="text-[14px] font-medium text-[#3A3A3C] leading-snug">
            {preceptorMessage}
          </p>
        </motion.div>
      </section>

      {nextCase && nextCaseTopic ? (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <h3 className="text-[15px] font-bold text-academy-text tracking-tight px-1">Antes do próximo atendimento</h3>
          <div className="liquid-glass-card rounded-[32px] p-7 relative overflow-hidden flex flex-col">
            <div className="absolute -right-8 -bottom-8 opacity-[0.06] text-academy-primary pointer-events-none">
              <nextCaseTopic.icon size={200} />
            </div>

            <div className="relative z-10 flex flex-col">
              <span className="text-academy-primary text-[12px] font-bold uppercase tracking-widest">
                Foco do atendimento
              </span>
              <h2 className="text-[26px] sm:text-[30px] font-bold text-academy-text leading-[1.15] mt-2">
                {getDayPhrase(nextCase.date)} {firstName(nextCase.app.patient_name || nextCase.patient?.name)}.
              </h2>

              <div className="flex items-center gap-2 flex-wrap mt-3">
                <span className="px-3 py-1.5 rounded-full text-[12px] font-bold bg-academy-soft text-academy-primary">
                  {getWhenLabel(nextCase.date)}
                </span>
                {nextCase.box.targetTooth && (
                  <span className="px-3 py-1.5 rounded-full text-[12px] font-bold bg-academy-neutral text-academy-muted">
                    Dente {nextCase.box.targetTooth}
                  </span>
                )}
                {nextCase.box.clinicalStageLabel && (
                  <span className="px-3 py-1.5 rounded-full text-[12px] font-bold bg-academy-neutral text-academy-muted">
                    {nextCase.box.clinicalStageLabel}
                  </span>
                )}
              </div>

              <div className="mt-5 space-y-3">
                {cleanCheckpoint(nextCase.box.criticalCheckpoint) && (
                  <div className="bg-academy-neutral border border-academy-border/80 rounded-[20px] px-4 py-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-academy-muted">O que importa neste caso</span>
                    <p className="text-[14px] font-semibold text-academy-text leading-snug mt-1">
                      {cleanCheckpoint(nextCase.box.criticalCheckpoint)}
                    </p>
                  </div>
                )}

                {nextCase.box.anamnesisAlert && (
                  <div className="bg-academy-attention rounded-[20px] px-4 py-3.5 flex items-start gap-2.5">
                    <AlertCircle size={17} className="text-academy-attention-text shrink-0 mt-0.5" />
                    <p className="text-[13px] font-semibold text-academy-attention-text leading-snug">
                      {nextCase.box.anamnesisAlert}
                    </p>
                  </div>
                )}

                <div className="bg-academy-soft border border-academy-primary/10 rounded-[20px] px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-academy-primary shadow-sm shrink-0">
                      <nextCaseTopic.icon size={17} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[14px] font-bold text-academy-text leading-snug">{nextCaseTopic.title}</p>
                      <p className="text-[12px] font-semibold text-academy-muted mt-0.5">
                        Revisão de {nextCaseTopic.duration} · {nextCaseTopic.subtitle}
                      </p>
                      {confidenceMap[nextCase.topicKey]?.level === 'review' && (
                        <p className="text-[11px] font-bold text-academy-alert-text mt-1">
                          Você marcou este tema para rever.
                        </p>
                      )}
                      {confidenceMap[nextCase.topicKey]?.level === 'ask' && (
                        <p className="text-[11px] font-bold text-academy-alert-text mt-1">
                          Você ficou de levar uma dúvida deste tema ao professor.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => openStudy(nextCase.topicKey, nextCase)}
                    className="w-full bg-academy-primary text-white font-bold text-[15px] py-[16px] rounded-[20px] shadow-lg hover:scale-[0.98] transition-transform active:scale-95"
                  >
                    Revisar para este caso
                  </button>
                  <button
                    type="button"
                    onClick={() => openPatientRecord?.(nextCase.patient.id)}
                    className="w-full bg-white text-academy-muted border border-academy-border font-bold text-[15px] py-[16px] rounded-[20px] hover:bg-academy-neutral transition-colors active:scale-95"
                  >
                    Abrir caso
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      ) : (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-[32px] border border-academy-border shadow-sm p-8 flex items-start gap-4"
        >
          <div className="w-12 h-12 bg-academy-success rounded-full flex items-center justify-center shrink-0">
            <CheckCircle2 size={24} className="text-academy-success-text" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[17px] font-bold text-academy-text">Nenhum caso exigindo revisão</h3>
            <p className="text-[14px] text-academy-muted mt-1 leading-relaxed">
              Sua agenda próxima está tranquila. Se quiser, use o tempo para uma lacuna ou para a biblioteca abaixo.
            </p>
            <button
              type="button"
              onClick={() => setActiveTab?.('agenda')}
              className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-academy-primary"
            >
              <Calendar size={15} />
              Ver agenda
            </button>
          </div>
        </motion.section>
      )}

      {laterCases.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <h3 className="text-[15px] font-bold text-academy-text tracking-tight px-1">Casos seguintes</h3>
          <div className="rounded-[24px] overflow-hidden liquid-glass-card">
            {laterCases.map((caseInfo, index) => {
              const material = STUDY_LIBRARY[caseInfo.topicKey];
              return (
                <motion.button
                  type="button"
                  key={`${caseInfo.app.id}`}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => openStudy(caseInfo.topicKey, caseInfo)}
                  className={`w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-academy-neutral/60 transition-colors ${
                    index !== laterCases.length - 1 ? 'border-b border-academy-border/60' : ''
                  }`}
                >
                  <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0 ${material.color}`}>
                    <material.icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[15px] font-bold text-academy-text truncate">
                        {firstName(caseInfo.app.patient_name || caseInfo.patient?.name)}
                      </h4>
                      {caseInfo.box.anamnesisAlert && (
                        <span className="w-2 h-2 rounded-full bg-academy-attention-text shrink-0" />
                      )}
                    </div>
                    <p className="text-[12px] font-semibold text-academy-muted mt-0.5 truncate">
                      {getWhenLabel(caseInfo.date)} · {material.title} · {material.duration}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-[#C6C6C8] shrink-0" />
                </motion.button>
              );
            })}
          </div>
        </motion.section>
      )}

      {clinicalGaps.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <h3 className="text-[15px] font-bold text-academy-text tracking-tight px-1">Lacunas no seu histórico</h3>
          <div className="grid gap-3">
            {clinicalGaps.map(gap => {
              const material = gap.studyTopic ? STUDY_LIBRARY[gap.studyTopic] : null;
              if (!material) return null;
              return (
                <motion.button
                  type="button"
                  key={gap.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openStudy(gap.studyTopic!)}
                  className="bg-academy-alert rounded-[20px] px-5 py-4 text-left flex items-center gap-4 transition-all"
                >
                  <div className="w-10 h-10 rounded-[14px] bg-white flex items-center justify-center text-academy-alert-text shadow-sm shrink-0">
                    <material.icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-academy-text leading-snug">{gap.message}</p>
                    <p className="text-[12px] font-bold text-academy-alert-text mt-1">
                      Revisar {material.title.toLowerCase()} · {material.duration}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-academy-alert-text/50 shrink-0" />
                </motion.button>
              );
            })}
          </div>
        </motion.section>
      )}

      {consolidation && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => openStudy(consolidation.topic)}
            className="w-full bg-white rounded-[20px] px-5 py-4 border border-academy-border/70 shadow-sm text-left flex items-center gap-4 hover:border-stone-300 transition-all"
          >
            <div className="w-10 h-10 rounded-[14px] bg-academy-success flex items-center justify-center text-academy-success-text shrink-0">
              <Activity size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-academy-text leading-snug">
                Você praticou {consolidation.skillLabel} recentemente.
              </p>
              <p className="text-[12px] font-bold text-academy-muted mt-1">
                Consolidar {STUDY_LIBRARY[consolidation.topic].title.toLowerCase()} · {STUDY_LIBRARY[consolidation.topic].duration}
              </p>
            </div>
            <ChevronRight size={16} className="text-[#C6C6C8] shrink-0" />
          </motion.button>
        </motion.section>
      )}

      {reviewRequests.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <h3 className="text-[15px] font-bold text-academy-text tracking-tight px-1">Você marcou para voltar</h3>
          <div className="rounded-[24px] overflow-hidden liquid-glass-card">
            {reviewRequests.map((request, index) => {
              const material = STUDY_LIBRARY[request.topic];
              return (
                <motion.button
                  type="button"
                  key={request.topic}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => openStudy(request.topic)}
                  className={`w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-academy-neutral/60 transition-colors ${
                    index !== reviewRequests.length - 1 ? 'border-b border-academy-border/60' : ''
                  }`}
                >
                  <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0 ${material.color}`}>
                    <material.icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] font-bold text-academy-text">{material.title}</h4>
                    <p className="text-[12px] font-semibold text-academy-alert-text mt-0.5">
                      {request.level === 'review'
                        ? 'Você pediu para rever este tema'
                        : 'Você ficou de tirar uma dúvida com o professor'} · {material.duration}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-[#C6C6C8] shrink-0" />
                </motion.button>
              );
            })}
          </div>
        </motion.section>
      )}

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-4 pt-4 border-t border-academy-border/50"
      >
        <div className="px-1">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-academy-muted" />
            <h3 className="text-[15px] font-bold text-academy-text tracking-tight">Biblioteca</h3>
          </div>
          <p className="text-[12px] font-medium text-academy-muted mt-1">
            Para quando você quiser ir além do que a agenda pede.
          </p>
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-academy-muted/60 pointer-events-none" />
          <input
            type="text"
            value={librarySearch}
            onChange={event => setLibrarySearch(event.target.value)}
            placeholder="Buscar tema ou procedimento (ex.: siso, canal, grampo)"
            className="w-full liquid-glass-card border border-academy-border/70 rounded-[16px] pl-11 pr-4 py-3 text-[14px] font-medium text-academy-text placeholder:text-academy-muted/60 outline-none focus:ring-2 focus:ring-academy-primary/10 transition-all"
          />
        </div>

        {filteredLibraryItems.length > 0 ? (
          <div className="rounded-[24px] overflow-hidden liquid-glass-card">
            {filteredLibraryItems.map((cat, index) => (
              <motion.button
                type="button"
                key={`lib-${cat.id}`}
                whileTap={{ scale: 0.99 }}
                onClick={() => openStudy(cat.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-academy-neutral/60 transition-colors ${
                  index !== filteredLibraryItems.length - 1 ? 'border-b border-academy-border/60' : ''
                }`}
              >
                <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0 ${cat.color}`}>
                  <cat.icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[15px] font-bold text-academy-text">{cat.title}</h4>
                  <p className="text-[12px] font-semibold text-academy-muted mt-0.5 truncate">
                    {cat.duration} · {cat.subtitle}
                  </p>
                </div>
                <ChevronRight size={16} className="text-[#C6C6C8] shrink-0" />
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] bg-white border border-academy-border/70 px-5 py-6 text-center">
            <p className="text-[14px] font-semibold text-academy-text">Nada com esse nome por aqui.</p>
            <p className="text-[12px] text-academy-muted mt-1">
              Tente o nome do procedimento — "extração", "canal", "raspagem".
            </p>
          </div>
        )}
      </motion.section>
    </div>
  );
};

