import { BoxGuideProcedure, boxGuides } from './boxGuides';

export interface BoxIntelligenceContext {
  patient: any;
  primaryTreatment: any;
  upcomingAppointment: any;
  lastEvolution: any;
  riskFlags: string[];
  anamnesisAlert: string;
  isFirstConsultation: boolean;
  boxProcedureDetail: string;
}

export function generateBoxContext(
  patient: any,
  treatmentInProgress: any[],
  upcomingAppointment: any
): BoxIntelligenceContext {
  const primaryTreatment = treatmentInProgress[0] || null;
  const lastEvolution = (patient?.evolution || [])[0] || null;

  // Detect first consultation
  const hasEvolutions = (patient?.evolution || []).length > 0;
  const hasTreatmentPlan = treatmentInProgress.length > 0;
  const appointmentNotes = String(upcomingAppointment?.notes || upcomingAppointment?.procedure || '').toLowerCase();
  const isExplicitConsulta = /consult|avalia|primeira|triag|exame|acolh/.test(appointmentNotes);
  const isFirstConsultation = isExplicitConsulta || (!hasEvolutions && !hasTreatmentPlan);

  // Parse anamnesis for risks
  const anamnesis = patient?.anamnesis || {};
  const candidates = [
    anamnesis.allergies && `Alergia: ${anamnesis.allergies}`,
    anamnesis.medications && `Medicação: ${anamnesis.medications}`,
    anamnesis.medical_history && `Histórico: ${anamnesis.medical_history}`,
    anamnesis.chief_complaint && `Queixa: ${anamnesis.chief_complaint}`,
  ].filter(Boolean);

  const riskRegex = /hipertens|diabet|alerg|anticoagul|card|asma|gest|grav|medica|press|sangr/i;
  const important = candidates.find((item: any) => riskRegex.test(String(item)));
  const anamnesisAlert = String(important || candidates[0] || '').trim();

  const riskFlags = candidates.filter((item: any) => riskRegex.test(String(item))).map(String);

  // Procedural Detail
  const boxProcedureDetail = primaryTreatment
    ? `${primaryTreatment.procedure}${primaryTreatment.tooth_number ? ` - dente ${primaryTreatment.tooth_number}` : ''}`
    : upcomingAppointment
      ? (upcomingAppointment.procedure || upcomingAppointment.notes || '')
      : '';

  return {
    patient,
    primaryTreatment,
    upcomingAppointment,
    lastEvolution,
    riskFlags,
    anamnesisAlert,
    isFirstConsultation,
    boxProcedureDetail,
  };
}

export function generateSmartAlerts(context: BoxIntelligenceContext, selectedProcedure: BoxGuideProcedure): string[] {
  const alerts: string[] = [];
  
  if (context.anamnesisAlert) {
    alerts.push(`Atenção sistêmica: ${context.anamnesisAlert}`);
    if (/alerg/i.test(context.anamnesisAlert) && selectedProcedure === 'Endodontia') {
      alerts.push('Verificar tipo de alergia antes de usar isolamento de látex ou anestésicos.');
    }
    if (/anticoagul|sangr/i.test(context.anamnesisAlert) && (selectedProcedure === 'Cirurgia' || selectedProcedure === 'Periodontia')) {
      alerts.push('Paciente com risco de sangramento. Validar anestesia e controle hemostático com professor.');
    }
    if (/hipertens|press/i.test(context.anamnesisAlert)) {
      alerts.push('Verificar PA antes do procedimento e ter cuidado com o uso de vasoconstritores.');
    }
    if (/diabet/i.test(context.anamnesisAlert) && selectedProcedure === 'Cirurgia') {
      alerts.push('Avaliar risco de infecção/cicatrização e necessidade de antibiótico profilático.');
    }
  }

  // Check last visit date
  if (context.lastEvolution && context.lastEvolution.date) {
    const lastDate = new Date(context.lastEvolution.date);
    const monthsSinceLast = (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    if (monthsSinceLast > 6) {
      alerts.push('Última visita há mais de 6 meses. Atualize a anamnese antes de prosseguir.');
    }
  }

  return alerts;
}

export function generateSmartMaterials(context: BoxIntelligenceContext, selectedProcedure: BoxGuideProcedure): string[] {
  const baseMaterials = boxGuides[selectedProcedure]?.blocks[0]?.items || [];
  let smartMaterials = [...baseMaterials];

  if (context.primaryTreatment?.tooth_number) {
    const toothStr = String(context.primaryTreatment.tooth_number);
    if (selectedProcedure === 'Endodontia') {
      if (/^1|^2/.test(toothStr)) smartMaterials.push(`Grampo para dente superior (ex: 211, 212, 200, 205) para o dente ${toothStr}`);
      if (/^3|^4/.test(toothStr)) smartMaterials.push(`Grampo para dente inferior (ex: w8a, 200, 205) para o dente ${toothStr}`);
    }
    if (selectedProcedure === 'Cirurgia') {
      if (/^1|^2/.test(toothStr)) smartMaterials.push(`Fórceps para arco superior indicado para o dente ${toothStr} (ex: 150)`);
      if (/^3|^4/.test(toothStr)) smartMaterials.push(`Fórceps para arco inferior indicado para o dente ${toothStr} (ex: 151)`);
    }
  }

  if (/alerg/i.test(context.anamnesisAlert)) {
    smartMaterials.push('Materiais SEM látex disponíveis, caso o paciente tenha alergia.');
  }

  return smartMaterials;
}

export function generateSmartChipContent(context: BoxIntelligenceContext, selectedProcedure: BoxGuideProcedure): Record<string, string[]> {
  const baseChips = boxGuides[selectedProcedure]?.chipContent || {};
  const smartChips = { ...baseChips };

  if (smartChips.Anamnese && context.anamnesisAlert) {
    smartChips.Anamnese = [
      `Paciente tem alertas registrados: ${context.anamnesisAlert}`,
      ...smartChips.Anamnese
    ];
  }

  if (smartChips.Anestesia && context.riskFlags.length > 0) {
    smartChips.Anestesia = [
      `Atenção na escolha do anestésico. Riscos: ${context.riskFlags.join(', ')}`,
      ...smartChips.Anestesia
    ];
  }

  if (smartChips.Evolucao && context.primaryTreatment) {
    smartChips.Evolucao = [
      `Registrar sobre o procedimento agendado: ${context.boxProcedureDetail}`,
      ...smartChips.Evolucao
    ];
  }

  return smartChips;
}

export function generateIntelligentSteps(context: BoxIntelligenceContext, selectedProcedure: BoxGuideProcedure, doubtCallback: (chip: string) => void, nextStepCallback: (step: number) => void, finishCallback: () => void) {
  const smartAlerts = generateSmartAlerts(context, selectedProcedure);
  const materials = generateSmartMaterials(context, selectedProcedure);
  const guide = boxGuides[selectedProcedure];
  const orderedBoxItems = guide?.chipContent.Sequencia || guide?.blocks.find((block) => block.ordered)?.items || [];
  const boxRecordItems = guide?.chipContent.Evolucao || guide?.blocks.find((block) => block.emphasis === 'record')?.items || [];

  const boxSafetyChip = guide?.doubtChips.includes('Anamnese') ? 'Anamnese' : guide?.doubtChips.includes('Anestesia') ? 'Anestesia' : guide?.doubtChips[0];
  const boxSequenceChip = guide?.doubtChips.includes('Sequencia') ? 'Sequencia' : guide?.doubtChips[0];
  const boxEvolutionChip = guide?.doubtChips.includes('Evolucao') ? 'Evolucao' : guide?.doubtChips[guide?.doubtChips.length - 1];

  if (selectedProcedure === 'Consulta') {
    return [
      {
        label: 'Acolhimento',
        title: 'Acolha o paciente',
        text: 'Confirme dados, entenda a queixa e revise o histórico antes de examinar.',
        steps: [
          'Confirmar nome, idade e dados cadastrais',
          context.anamnesisAlert ? `⚠️ Atenção: ${context.anamnesisAlert}` : 'Perguntar queixa principal',
          'Revisar alergias, medicações e condições sistêmicas',
          'Verificar PA se indicado',
        ],
        actions: [
          { label: 'Anamnese conferida', onClick: () => nextStepCallback(1), primary: true },
          { label: 'Preciso revisar', onClick: () => doubtCallback('Anamnese') },
        ],
      },
      {
        label: 'Exame',
        title: 'Faça o exame clínico',
        text: 'Examine sistematicamente e registre os achados.',
        steps: [
          'Inspeção extra-oral: face, linfonodos, ATM',
          'Inspeção intra-oral: mucosa, gengiva, língua',
          'Exame dentário: cáries, restaurações, ausências',
          'Sondagem periodontal quando indicado',
          'Solicitar radiografia se necessário',
        ],
        actions: [
          { label: 'Exame concluído', onClick: () => nextStepCallback(2), primary: true },
          { label: 'Ajuda no exame', onClick: () => doubtCallback('Exame') },
        ],
      },
      {
        label: 'Plano',
        title: 'Defina o plano com o professor',
        text: 'Organize os achados, priorize as necessidades e valide a conduta.',
        steps: [
          'Listar achados principais do exame',
          'Definir hipótese diagnóstica',
          'Priorizar necessidades clínicas',
          'Alinhar plano e próximos passos com o professor',
        ],
        actions: [
          { label: 'Plano definido', onClick: () => nextStepCallback(3), primary: true },
          { label: 'Rever orientações', onClick: () => doubtCallback('Plano') },
        ],
      },
      {
        label: 'Fechar',
        title: 'Registre e oriente',
        text: 'Registre a evolução, oriente o paciente e defina retorno.',
        steps: [
          'Registrar queixa, achados e hipótese',
          'Registrar plano de tratamento proposto',
          'Orientar paciente sobre achados e próximos passos',
          'Definir retorno ou próximo atendimento',
        ],
        actions: [
          {
            label: 'Registrar agora',
            onClick: finishCallback,
            primary: true,
          },
          {
            label: 'Revisar registro',
            onClick: () => doubtCallback('Evolucao'),
          },
        ],
      },
    ];
  }

  const alertStepText = smartAlerts.length > 0 
    ? smartAlerts.join(' ')
    : context.anamnesisAlert 
      ? `${context.anamnesisAlert}. Confira PA, medicação em uso e chame o professor se houver qualquer alteração.`
      : 'Revise anamnese, alergias, medicações e PA antes de seguir.';

  const lastEvoText = context.lastEvolution 
    ? `Última visita: ${context.lastEvolution.procedure || context.lastEvolution.procedure_performed || 'Atendimento realizado'}.`
    : '';

  return [
    {
      label: 'Antes',
      title: 'Confirme se está seguro iniciar',
      text: alertStepText,
      steps: [
        smartAlerts.length > 0 ? `⚠️ Revisar alertas de saúde antes de prosseguir.` : (context.anamnesisAlert ? `⚠️ Revisar alerta: ${context.anamnesisAlert}` : 'Conferir anamnese, alergias e medicações'),
        materials[0] || `Separar materiais de ${guide?.label}`,
        materials[1] || 'Conferir campo, isolamento e instrumentais',
        'Confirmar professor por perto se surgir dúvida',
      ],
      actions: [
        { label: 'Tudo certo', onClick: () => nextStepCallback(1), primary: true },
        { label: 'Revisar antes', onClick: () => doubtCallback(boxSafetyChip as string) },
      ],
    },
    {
      label: 'Caso',
      title: context.primaryTreatment?.tooth_number ? `Confirme o dente ${context.primaryTreatment.tooth_number}` : 'Confirme o caso de hoje',
      text: context.primaryTreatment
        ? `Plano de hoje: ${context.primaryTreatment.procedure}. Confira radiografia, boca e conduta antes de iniciar. ${lastEvoText}`
        : `Confira radiografia, região e objetivo clínico antes de iniciar ${guide?.label}. ${lastEvoText}`,
      steps: [
        context.boxProcedureDetail ? `Procedimento: ${context.boxProcedureDetail}` : `Revisar procedimento agendado`,
        context.primaryTreatment?.tooth_number ? `Conferir dente ${context.primaryTreatment.tooth_number} na boca e no RX` : 'Conferir dente/região na boca e no RX',
        orderedBoxItems[0] || `Validar primeira etapa de ${guide?.label}`,
        'Alinhar conduta com o professor se algo não bater',
      ],
      actions: [
        { label: 'Caso confirmado', onClick: () => nextStepCallback(2), primary: true },
        { label: 'Rever sequência', onClick: () => doubtCallback(boxSequenceChip as string) },
      ],
    },
    {
      label: 'Durante',
      title: 'Agora siga a próxima parte',
      text: `Sequência prática para ${guide?.label}. Faça uma ação por vez e confirme antes de avançar.`,
      steps: orderedBoxItems.slice(1, 6).length > 0
        ? orderedBoxItems.slice(1, 6)
        : orderedBoxItems.slice(0, 5),
      actions: [
        { label: 'Terminei essa parte', onClick: () => nextStepCallback(3), primary: true },
        { label: 'Pedir ajuda', onClick: () => doubtCallback(boxSequenceChip as string) },
      ],
    },
    {
      label: 'Fechar',
      title: 'Feche o caso antes de sair',
      text: 'Registre a evolução enquanto tudo está fresco e deixe o próximo passo claro.',
      steps: (boxRecordItems.length > 0 ? boxRecordItems : [
        'Registrar conduta realizada',
        'Registrar intercorrências ou ausência delas',
        'Anotar orientações dadas ao paciente',
        'Definir retorno ou próxima etapa',
      ]).slice(0, 5),
      actions: [
        {
          label: 'Registrar agora',
          onClick: finishCallback,
          primary: true,
        },
        {
          label: 'Revisar registro',
          onClick: () => doubtCallback(boxEvolutionChip as string),
        },
      ],
    },
  ];
}

export function generateEvolutionSuggestion(context: BoxIntelligenceContext, selectedProcedure: BoxGuideProcedure): string {
  let suggestion = `[Evolução sugerida para ${selectedProcedure}]\n`;
  if (context.primaryTreatment) {
    suggestion += `Procedimento realizado: ${context.boxProcedureDetail}\n`;
  }
  if (context.anamnesisAlert) {
    suggestion += `Observações sistêmicas consideradas: paciente tem alerta de ${context.anamnesisAlert}.\n`;
  }
  return suggestion;
}

export function generateBoxNowItems(context: BoxIntelligenceContext): string[] {
  const lastEvolutionLabel = context.lastEvolution?.procedure || context.lastEvolution?.procedure_performed || context.lastEvolution?.notes || '';
  
  return [
    context.anamnesisAlert
      ? `Atenção sistêmica: ${context.anamnesisAlert}. Antes de anestesiar, confirme PA, medicação em uso e peça orientação do professor se houver alteração.`
      : 'Atenção sistêmica: confirme anamnese, alergias, medicações e PA antes de iniciar.',
    context.primaryTreatment
      ? `Procedimento de hoje: ${context.primaryTreatment.procedure}${context.primaryTreatment.tooth_number ? ` do dente ${context.primaryTreatment.tooth_number}` : ''}. Confira radiografia e dente correto antes de iniciar.`
      : context.upcomingAppointment
        ? `Procedimento de hoje: ${context.upcomingAppointment.procedure || context.upcomingAppointment.notes || 'atendimento agendado'}. Confira objetivo, radiografia e dente/região antes de iniciar.`
        : 'Sem procedimento em foco: revise odontograma, queixa e plano clínico antes de escolher a conduta.',
    context.lastEvolution
      ? `Último registro: ${lastEvolutionLabel}. Ao terminar, registre o que foi feito e defina retorno.`
      : 'Último registro: ainda não há evolução anterior. Ao terminar, registre conduta, orientações e retorno.',
    'Depois do atendimento, registre evolução e defina retorno',
  ].filter(Boolean);
}

export function generateBoxNowSteps(context: BoxIntelligenceContext): string[] {
  return [
    'Confirmar PA/anamnese',
    context.primaryTreatment?.tooth_number ? `Conferir radiografia e dente ${context.primaryTreatment.tooth_number}` : 'Conferir radiografia e dente/região',
    'Iniciar atendimento',
    'Registrar evolução no final',
  ];
}
