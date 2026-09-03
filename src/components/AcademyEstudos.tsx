import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Check,
  ChevronRight,
  ClipboardList,
  FileText,
  Heart,
  Pill,
  Search,
  Shield,
  Stethoscope,
  Syringe,
  Tooth,
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
    color: 'bg-[var(--neo-soft)] text-[var(--neo-ink)]',
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
    color: 'bg-[var(--neo-soft)] text-[var(--neo-ink)]',
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


  const studyNudges = useMemo(() => {
    const items: Array<{ key: string; topic: StudyKey; title: string; reason: string }> = [];
    for (const gap of clinicalGaps) {
      if (!gap.studyTopic) continue;
      const material = STUDY_LIBRARY[gap.studyTopic];
      if (!material) continue;
      items.push({ key: `gap-${gap.id}`, topic: gap.studyTopic, title: material.title, reason: gap.message });
    }
    if (consolidation) {
      items.push({
        key: 'consolidation',
        topic: consolidation.topic,
        title: STUDY_LIBRARY[consolidation.topic].title,
        reason: `Você praticou ${consolidation.skillLabel} recentemente.`,
      });
    }
    for (const request of reviewRequests) {
      const material = STUDY_LIBRARY[request.topic];
      items.push({
        key: `review-${request.topic}`,
        topic: request.topic,
        title: material.title,
        reason: request.level === 'review'
          ? 'Você pediu para rever este tema.'
          : 'Dúvida para levar ao professor.',
      });
    }
    return items;
  }, [clinicalGaps, consolidation, reviewRequests]);

  // ── Material view ────────────────────────────────────────────────────
  if (activeMaterial) {
    const caseBox = selectedCase?.box || null;
    const checkedCount = activeMaterial.checklist.filter(item => checkedItems.has(item)).length;
    const caseName = selectedCase
      ? firstName(selectedCase.patient?.name || selectedCase.app?.patient_name)
      : '';

    return (
      <div className="page-shell space-y-8">
        <button type="button" onClick={closeStudy} className="neo-link text-[15px]">
          ‹ Estudos
        </button>

        {selectedCase && caseBox && (
          <div className="rounded-[24px] bg-[#f5f5f7] px-5 py-5">
            <p className="text-[13px] tracking-[-0.011em] text-[var(--neo-gray)]">
              Para o atendimento
            </p>
            <p className="mt-1 text-[22px] font-semibold leading-[1.05] tracking-[-0.025em] text-[var(--neo-ink)]">
              {caseName} · {getWhenLabel(selectedCase.date)}
            </p>
            {caseBox.boxProcedureDetail && (
              <p className="mt-2 text-[15px] leading-snug tracking-[-0.011em] text-[var(--neo-gray)]">
                {caseBox.boxProcedureDetail}
              </p>
            )}
            {cleanCheckpoint(caseBox.criticalCheckpoint) && (
              <p className="mt-3 text-[15px] leading-snug tracking-[-0.011em] text-[var(--neo-ink)]">
                {cleanCheckpoint(caseBox.criticalCheckpoint)}
              </p>
            )}
            {caseBox.anamnesisAlert && (
              <p className="mt-3 rounded-[16px] bg-[var(--neo-soft)] px-4 py-3 text-[14px] leading-snug text-[var(--neo-ink)]">
                {caseBox.anamnesisAlert}
              </p>
            )}
            {openPatientRecord && (
              <button
                type="button"
                onClick={() => openPatientRecord(selectedCase.patient.id)}
                className="neo-link mt-4 text-[15px]"
              >
                Abrir caso ›
              </button>
            )}
          </div>
        )}

        <header>
          <p className="text-[13px] tracking-[-0.011em] text-[var(--neo-gray)]">
            {activeMaterial.duration}
          </p>
          <h1 className="mt-2 text-[28px] font-semibold leading-[1.05] tracking-[-0.025em] text-[var(--neo-ink)] sm:text-[34px]">
            {activeMaterial.title}
          </h1>
          <p className="mt-3 max-w-[42ch] text-[17px] leading-snug tracking-[-0.011em] text-[var(--neo-gray)]">
            {activeMaterial.objective}
          </p>
        </header>

        {activeMaterial.quickFacts.length > 0 && (
          <StudySection kicker="Na ponta da língua">
            <div className="overflow-hidden rounded-[24px] bg-[#f5f5f7]">
              {activeMaterial.quickFacts.map(fact => (
                <div
                  key={fact.label}
                  className="border-b border-black/[0.04] px-5 py-4 last:border-b-0"
                >
                  <p className="text-[13px] text-[var(--neo-gray)]">{fact.label}</p>
                  <p className="mt-1 text-[15px] leading-snug tracking-[-0.011em] text-[var(--neo-ink)]">
                    {fact.value}
                  </p>
                </div>
              ))}
            </div>
          </StudySection>
        )}

        <StudySection kicker="Roteiro">
          <div className="space-y-3">
            {activeMaterial.modules.map((module, moduleIndex) => (
              <article key={module.title} className="rounded-[24px] bg-[#f5f5f7] px-5 py-5">
                <p className="text-[13px] tabular-nums text-[var(--neo)]">
                  {String(moduleIndex + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-2 text-[17px] font-semibold tracking-[-0.016em] text-[var(--neo-ink)]">
                  {module.title}
                </h3>
                <p className="mt-1 text-[15px] leading-snug text-[var(--neo-gray)]">
                  {module.description}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {module.steps.map(step => (
                    <li key={step} className="flex gap-2.5 text-[15px] leading-relaxed text-[var(--neo-ink)]">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--neo)]" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </StudySection>

        <StudySection
          kicker="Checklist"
          action={
            <span className="text-[13px] tabular-nums text-[var(--neo-gray)]">
              {checkedCount}/{activeMaterial.checklist.length}
            </span>
          }
        >
          <div className="overflow-hidden rounded-[24px] bg-[#f5f5f7]">
            {activeMaterial.checklist.map(item => {
              const isChecked = checkedItems.has(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleChecklistItem(item)}
                  className="flex w-full items-center gap-3 border-b border-black/[0.04] px-5 py-4 text-left last:border-b-0"
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                      isChecked ? 'bg-[var(--neo)] text-white' : 'bg-white text-transparent'
                    }`}
                  >
                    <Check size={12} />
                  </span>
                  <span
                    className={`text-[15px] tracking-[-0.011em] ${
                      isChecked ? 'text-[var(--neo-gray)] line-through' : 'text-[var(--neo-ink)]'
                    }`}
                  >
                    {item}
                  </span>
                </button>
              );
            })}
          </div>
        </StudySection>

        {activeMaterial.selfTest.length > 0 && (
          <StudySection kicker="Teste-se">
            <div className="overflow-hidden rounded-[24px] bg-[#f5f5f7]">
              {activeMaterial.selfTest.map((qa, index) => {
                const revealed = revealedAnswers.has(index);
                return (
                  <div key={qa.question} className="border-b border-black/[0.04] px-5 py-4 last:border-b-0">
                    <p className="text-[15px] font-semibold leading-snug tracking-[-0.011em] text-[var(--neo-ink)]">
                      {qa.question}
                    </p>
                    {revealed ? (
                      <p className="mt-2 text-[15px] leading-relaxed text-[var(--neo-gray)]">
                        {qa.answer}
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggleAnswer(index)}
                        className="neo-link mt-2 text-[15px]"
                      >
                        Ver resposta ›
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </StudySection>
        )}

        <StudySection kicker="Cuidado">
          <div className="overflow-hidden rounded-[24px] bg-[#f5f5f7]">
            {activeMaterial.pitfalls.map(item => (
              <p
                key={item}
                className="border-b border-black/[0.04] px-5 py-4 text-[15px] leading-relaxed text-[var(--neo-ink)] last:border-b-0"
              >
                {item}
              </p>
            ))}
          </div>
        </StudySection>

        <StudySection kicker="Explicar">
          <div className="rounded-[24px] bg-[#f5f5f7] px-5 py-5">
            <p className="text-[15px] leading-relaxed tracking-[-0.011em] text-[var(--neo-ink)]">
              {activeMaterial.patientTalk}
            </p>
          </div>
        </StudySection>

        <StudySection kicker="Confiança">
          <div className="overflow-hidden rounded-[24px] bg-[#f5f5f7]">
            {CONFIDENCE_OPTIONS.map(option => {
              const isSelected = selectedStudy ? confidenceMap[selectedStudy]?.level === option.level : false;
              return (
                <button
                  key={option.level}
                  type="button"
                  onClick={() => selectedStudy && setTopicConfidence(selectedStudy, option.level)}
                  className="flex w-full items-center gap-3 border-b border-black/[0.04] px-5 py-4 text-left last:border-b-0"
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                      isSelected ? 'bg-[var(--neo)] text-white' : 'bg-white text-transparent'
                    }`}
                  >
                    <Check size={12} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold tracking-[-0.011em] text-[var(--neo-ink)]">
                      {option.label}
                    </span>
                    {isSelected && (
                      <span className="mt-0.5 block text-[13px] text-[var(--neo-gray)]">
                        {option.hint}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </StudySection>

        {selectedCase && openPatientRecord && (
          <button
            type="button"
            className="neo-pill w-full"
            onClick={() => openPatientRecord(selectedCase.patient.id)}
          >
            Abrir caso de {caseName}
          </button>
        )}
      </div>
    );
  }

  const nextPatientName = nextCase
    ? firstName(nextCase.patient?.name || nextCase.app?.patient_name)
    : '';
  const headline = nextCase
    ? `${getDayPhrase(nextCase.date)} ${nextPatientName}.`
    : 'Antes do box';
  const headlineMeta = nextCase && nextCaseTopic
    ? `${nextCaseTopic.title} · ${nextCaseTopic.duration}`
    : studyNudges.length > 0
      ? 'Uma revisão que ainda falta no seu histórico.'
      : 'Quando um caso entrar na agenda, a revisão certa aparece aqui.';

  return (
    <div className="page-shell space-y-8 desktop:space-y-10">
      <header>
        <p className="text-[13px] tracking-[-0.011em] text-[var(--neo-gray)]">Estudos</p>
        <h1 className="mt-2 max-w-[18ch] text-[28px] font-semibold leading-[1.05] tracking-[-0.025em] text-[var(--neo-ink)] sm:text-[34px]">
          {headline}
        </h1>
        <p className="mt-3 max-w-[36ch] text-[17px] leading-snug tracking-[-0.011em] text-[var(--neo-gray)]">
          {headlineMeta}
        </p>
      </header>

      <div className="flex flex-col gap-10 desktop:grid desktop:grid-cols-12 desktop:items-start desktop:gap-x-12">
        <div className="space-y-8 desktop:col-span-7">
          {nextCase && nextCaseTopic ? (
            <button
              type="button"
              onClick={() => openStudy(nextCase.topicKey, nextCase)}
              className="w-full rounded-[28px] bg-[var(--neo)] px-6 py-6 text-left text-white"
            >
              <p className="text-[12px] font-normal uppercase tracking-[0.04em] text-white/80">
                {getWhenLabel(nextCase.date)}
                {nextCase.box.targetTooth ? ` · Dente ${nextCase.box.targetTooth}` : ''}
              </p>
              <p className="mt-2 text-[26px] font-semibold leading-[1.05] tracking-[-0.025em] sm:text-[32px]">
                {nextCaseTopic.title}
              </p>
              <p className="mt-2 text-[15px] tracking-[-0.011em] text-white/85">
                {nextCaseTopic.duration} · {nextCaseTopic.subtitle}
              </p>
              {cleanCheckpoint(nextCase.box.criticalCheckpoint) && (
                <p className="mt-4 text-[15px] leading-snug text-white/90">
                  {cleanCheckpoint(nextCase.box.criticalCheckpoint)}
                </p>
              )}
              {nextCase.box.anamnesisAlert && (
                <p className="mt-3 rounded-[16px] bg-white/15 px-4 py-3 text-[14px] leading-snug">
                  {nextCase.box.anamnesisAlert}
                </p>
              )}
              {(confidenceMap[nextCase.topicKey]?.level === 'review' ||
                confidenceMap[nextCase.topicKey]?.level === 'ask') && (
                <p className="mt-3 text-[13px] text-white/80">
                  {confidenceMap[nextCase.topicKey]?.level === 'review'
                    ? 'Você marcou este tema para rever.'
                    : 'Você ficou de levar uma dúvida ao professor.'}
                </p>
              )}
              <p className="mt-4 text-[15px] text-white/90">Revisar ›</p>
            </button>
          ) : studyNudges[0] ? (
            <button
              type="button"
              onClick={() => openStudy(studyNudges[0].topic)}
              className="w-full rounded-[24px] bg-[#f5f5f7] px-5 py-5 text-left"
            >
              <p className="text-[13px] text-[var(--neo-gray)]">Estudar agora</p>
              <p className="mt-1 text-[22px] font-semibold leading-[1.05] tracking-[-0.025em] text-[var(--neo-ink)]">
                {studyNudges[0].title}
              </p>
              <p className="mt-2 text-[15px] leading-snug tracking-[-0.011em] text-[var(--neo-gray)]">
                {studyNudges[0].reason}
              </p>
              <p className="mt-4 flex items-center justify-between text-[15px]">
                <span className="text-[var(--neo-gray)]">{STUDY_LIBRARY[studyNudges[0].topic].duration}</span>
                <span className="neo-link">Revisar ›</span>
              </p>
            </button>
          ) : (
            <div className="rounded-[24px] bg-[#f5f5f7] px-5 py-5">
              <p className="text-[13px] text-[var(--neo-gray)]">Agenda</p>
              <p className="mt-1 text-[22px] font-semibold tracking-[-0.025em] text-[var(--neo-ink)]">
                Livre agora
              </p>
              <p className="mt-1 text-[15px] tracking-[-0.011em] text-[var(--neo-gray)]">
                Nenhum atendimento nos próximos 15 dias.
              </p>
              <button
                type="button"
                className="neo-link mt-3 text-[15px]"
                onClick={() => setActiveTab?.('agenda')}
              >
                Ver agenda ›
              </button>
            </div>
          )}

          {nextCase && openPatientRecord && (
            <button
              type="button"
              className="neo-link text-[15px]"
              onClick={() => openPatientRecord(nextCase.patient.id)}
            >
              Abrir caso de {nextPatientName} ›
            </button>
          )}

          {laterCases.length > 0 && (
            <StudySection kicker="A seguir">
              <div className="overflow-hidden rounded-[24px] bg-[#f5f5f7]">
                {laterCases.map(caseInfo => {
                  const material = STUDY_LIBRARY[caseInfo.topicKey];
                  return (
                    <button
                      type="button"
                      key={`${caseInfo.app.id}`}
                      onClick={() => openStudy(caseInfo.topicKey, caseInfo)}
                      className="flex w-full items-center gap-4 border-b border-black/[0.04] px-5 py-4 text-left last:border-b-0"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-semibold text-[var(--neo-ink)]">
                          {firstName(caseInfo.app.patient_name || caseInfo.patient?.name)}
                        </p>
                        <p className="mt-0.5 truncate text-[13px] text-[var(--neo-gray)]">
                          {getWhenLabel(caseInfo.date)} · {material.title} · {material.duration}
                        </p>
                      </div>
                      <ChevronRight size={16} className="shrink-0 text-[#C6C6C8]" />
                    </button>
                  );
                })}
              </div>
            </StudySection>
          )}

          {studyNudges.length > (nextCase ? 0 : 1) && (
            <StudySection kicker="Para você">
              <div className="overflow-hidden rounded-[24px] bg-[#f5f5f7]">
                {studyNudges.slice(nextCase ? 0 : 1).map(nudge => (
                  <button
                    type="button"
                    key={nudge.key}
                    onClick={() => openStudy(nudge.topic)}
                    className="flex w-full items-center gap-4 border-b border-black/[0.04] px-5 py-4 text-left last:border-b-0"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-semibold text-[var(--neo-ink)]">
                        {nudge.title}
                      </p>
                      <p className="mt-0.5 truncate text-[13px] text-[var(--neo-gray)]">
                        {nudge.reason}
                      </p>
                    </div>
                    <ChevronRight size={16} className="shrink-0 text-[#C6C6C8]" />
                  </button>
                ))}
              </div>
            </StudySection>
          )}
        </div>

        <div className="space-y-8 desktop:col-span-5">
          <StudySection kicker="Temas">
            <div className="relative mb-3">
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--neo-gray)]"
              />
              <input
                type="text"
                value={librarySearch}
                onChange={event => setLibrarySearch(event.target.value)}
                placeholder="siso, canal, grampo"
                className="w-full rounded-[18px] bg-[#f5f5f7] py-3 pl-11 pr-4 text-[15px] tracking-[-0.011em] text-[var(--neo-ink)] outline-none placeholder:text-[var(--neo-gray)]"
              />
            </div>

            {filteredLibraryItems.length > 0 ? (
              <div className="overflow-hidden rounded-[24px] bg-[#f5f5f7]">
                {filteredLibraryItems.map(cat => {
                  const conf = confidenceMap[cat.id]?.level;
                  const caption =
                    nextCase?.topicKey === cat.id
                      ? `Para ${nextPatientName} · ${cat.duration}`
                      : conf === 'review'
                        ? `Você pediu para rever · ${cat.duration}`
                        : conf === 'ask'
                          ? `Dúvida para o professor · ${cat.duration}`
                          : `${cat.duration} · ${cat.subtitle}`;
                  return (
                    <button
                      type="button"
                      key={`lib-${cat.id}`}
                      onClick={() => openStudy(cat.id, nextCase?.topicKey === cat.id ? nextCase : null)}
                      className="flex w-full items-center gap-4 border-b border-black/[0.04] px-5 py-4 text-left last:border-b-0"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-semibold text-[var(--neo-ink)]">
                          {cat.title}
                        </p>
                        <p className="mt-0.5 truncate text-[13px] text-[var(--neo-gray)]">
                          {caption}
                        </p>
                      </div>
                      <ChevronRight size={16} className="shrink-0 text-[#C6C6C8]" />
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[24px] bg-[#f5f5f7] px-5 py-5">
                <p className="text-[15px] font-semibold text-[var(--neo-ink)]">Nada com esse nome.</p>
                <p className="mt-1 text-[13px] text-[var(--neo-gray)]">
                  Tente o procedimento — extração, canal, raspagem.
                </p>
              </div>
            )}
          </StudySection>
        </div>
      </div>
    </div>
  );
};

function StudySection({
  kicker,
  action,
  children,
}: {
  kicker: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between gap-3 px-1">
        <h2 className="text-[13px] font-normal tracking-[-0.011em] text-[var(--neo-gray)]">{kicker}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
