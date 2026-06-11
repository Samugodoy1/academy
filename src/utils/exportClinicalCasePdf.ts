import {
  formatAllergieLabel,
  formatMedicationLabel,
  hasMeaningfulAnamnesisValue,
  hasRecordedAllergie,
  hasRecordedMedication,
} from './anamnesisUtils';
import { formatAppointmentDate, formatAppointmentTime, formatDate, getAppointmentTime } from './dateUtils';
import { generateBoxContext } from '../data/boxIntelligence';
import {
  formatTreatmentAnchor,
  isActiveTreatmentStatus,
  normalizeTreatmentItem,
} from './treatmentPlanScope';

const ACADEMY = {
  primary: [82, 5, 123] as [number, number, number],
  primaryDark: [59, 4, 89] as [number, number, number],
  soft: [244, 241, 246] as [number, number, number],
  bg: [246, 248, 250] as [number, number, number],
  text: [7, 17, 31] as [number, number, number],
  muted: [123, 132, 145] as [number, number, number],
  border: [230, 235, 240] as [number, number, number],
  attentionBg: [255, 240, 243] as [number, number, number],
  attentionText: [225, 29, 72] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
};

const CARD = {
  paddingTop: 7,
  paddingRight: 6,
  paddingBottom: 7,
  paddingLeft: 12,
  accentWidth: 3,
  gap: 6,
  radius: 3,
};

const TOOTH_STATUS_LABELS: Record<string, string> = {
  healthy: 'Saudável',
  decay: 'Cárie',
  filling: 'Restauração',
  crown: 'Coroa',
  root_canal_done: 'Canal realizado',
  root_canal_needed: 'Canal necessário',
  implant: 'Implante',
  extraction_done: 'Extração realizada',
  extraction_needed: 'Extração necessária',
  fracture: 'Fratura',
  wear: 'Desgaste',
  facet: 'Faceta',
  prosthesis: 'Prótese',
  missing: 'Ausente',
};

const ANAMNESIS_LABELS: Record<string, string> = {
  chief_complaint: 'Queixa principal',
  allergies: 'Alergias',
  medications: 'Medicações em uso',
  medical_history: 'Histórico médico',
  habits: 'Hábitos',
  family_history: 'Histórico familiar',
  vital_signs: 'Sinais vitais',
  systemic_diseases: 'Doenças sistêmicas',
  clinical_notes: 'Observações clínicas',
};

const TREATMENT_STATUS_LABELS: Record<string, string> = {
  PLANEJADO: 'Planejado',
  APROVADO: 'Aprovado',
  PENDENTE: 'Pendente',
  CONCLUIDO: 'Concluído',
};

const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  SCHEDULED: 'Agendado',
  CONFIRMED: 'Confirmado',
  IN_PROGRESS: 'Em atendimento',
  FINISHED: 'Finalizado',
  CANCELLED: 'Cancelado',
  NO_SHOW: 'Faltou',
};

export interface StudentProfileForPdf {
  name?: string;
  institution?: string;
  current_discipline?: string;
  academic_period?: string;
}

export interface ExportClinicalCasePdfInput {
  patient: any;
  appointments: any[];
  studentProfile?: StudentProfileForPdf | null;
}

const getAge = (birthDate?: string) => {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age;
};

const sanitizeFileName = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-_ ]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 60) || 'caso_clinico';

type JsPDFConstructor = typeof import('jspdf').jsPDF;

type CardTone = 'default' | 'attention';

interface CardShellOptions {
  fill?: [number, number, number];
  accent?: [number, number, number];
  border?: [number, number, number];
}

class PdfBuilder {
  private doc: InstanceType<JsPDFConstructor>;
  private y = 0;
  private measuring = false;
  private cardContext: { left: number; width: number } | null = null;
  private readonly margin = 16;
  private readonly pageWidth: number;
  private readonly contentWidth: number;
  private pageNumber = 1;

  constructor(jsPDF: JsPDFConstructor) {
    this.doc = new jsPDF({ unit: 'mm', format: 'a4' });
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.contentWidth = this.pageWidth - this.margin * 2;
    this.y = this.margin;
  }

  private get textLeft() {
    return this.cardContext?.left ?? this.margin;
  }

  private get textWidth() {
    return this.cardContext?.width ?? this.contentWidth;
  }

  private lineHeight(fontSize: number) {
    return fontSize * 0.42 + 2.1;
  }

  private ensureSpace(height: number) {
    const pageHeight = this.doc.internal.pageSize.getHeight();
    if (this.y + height > pageHeight - 18) {
      if (!this.measuring) {
        this.addFooter();
        this.doc.addPage();
        this.pageNumber += 1;
        this.drawPageBackground();
      }
      this.y = this.margin;
    }
  }

  private drawPageBackground() {
    if (this.measuring) return;
    this.doc.setFillColor(...ACADEMY.bg);
    this.doc.rect(0, 0, this.pageWidth, this.doc.internal.pageSize.getHeight(), 'F');
  }

  private addFooter() {
    const pageHeight = this.doc.internal.pageSize.getHeight();
    this.doc.setDrawColor(...ACADEMY.border);
    this.doc.setLineWidth(0.2);
    this.doc.line(this.margin, pageHeight - 12, this.pageWidth - this.margin, pageHeight - 12);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    this.doc.setTextColor(...ACADEMY.muted);
    this.doc.text('OdontoHub Academy · Resumo acadêmico do caso clínico', this.margin, pageHeight - 7);
    this.doc.text(`Página ${this.pageNumber}`, this.pageWidth - this.margin, pageHeight - 7, { align: 'right' });
  }

  private drawCardShell(startY: number, height: number, options: CardShellOptions = {}) {
    const fill = options.fill ?? ACADEMY.white;
    const accent = options.accent ?? ACADEMY.primary;
    const border = options.border ?? ACADEMY.border;

    this.doc.setFillColor(...fill);
    this.doc.setDrawColor(...border);
    this.doc.setLineWidth(0.25);
    this.doc.roundedRect(this.margin, startY, this.contentWidth, height, CARD.radius, CARD.radius, 'FD');

    this.doc.setFillColor(...accent);
    this.doc.rect(this.margin, startY, CARD.accentWidth, height, 'F');
    this.doc.roundedRect(this.margin, startY, CARD.accentWidth + 0.5, height, CARD.radius, 0, 'F');
  }

  private measureBlock(content: () => void) {
    const savedY = this.y;
    const savedContext = this.cardContext;
    this.measuring = true;
    content();
    const height = this.y - savedY;
    this.y = savedY;
    this.cardContext = savedContext;
    this.measuring = false;
    return height;
  }

  private runInCard(content: () => void, tone: CardTone = 'default') {
    const startY = this.y;
    const innerLeft = this.margin + CARD.paddingLeft;
    const innerWidth = this.contentWidth - CARD.paddingLeft - CARD.paddingRight;

    this.cardContext = { left: innerLeft, width: innerWidth };
    this.y += CARD.paddingTop;

    const contentHeight = this.measureBlock(content);
    const cardHeight = contentHeight + CARD.paddingTop + CARD.paddingBottom;

    this.ensureSpace(cardHeight + CARD.gap);
    this.y = startY;

    const shellOptions: CardShellOptions =
      tone === 'attention'
        ? { fill: ACADEMY.attentionBg, accent: ACADEMY.attentionText, border: ACADEMY.attentionText }
        : {};

    this.drawCardShell(startY, cardHeight, shellOptions);

    this.cardContext = { left: innerLeft, width: innerWidth };
    this.y = startY + CARD.paddingTop;
    content();
    this.cardContext = null;
    this.y = startY + cardHeight + CARD.gap;
  }

  writeParagraph(text: string, fontSize = 10, color: [number, number, number] = ACADEMY.text) {
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(fontSize);
    this.doc.setTextColor(...color);
    const lines = this.doc.splitTextToSize(text, this.textWidth);
    const blockHeight = lines.length * this.lineHeight(fontSize) + 1.5;
    this.ensureSpace(blockHeight);
    if (!this.measuring) {
      this.doc.text(lines, this.textLeft, this.y);
    }
    this.y += blockHeight;
  }

  writeKeyValue(label: string, value: string) {
    this.ensureSpace(10);
    if (!this.measuring) {
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(8.5);
      this.doc.setTextColor(...ACADEMY.muted);
      this.doc.text(label.toUpperCase(), this.textLeft, this.y);
    }
    this.y += 4.5;
    this.writeParagraph(value, 10, ACADEMY.text);
    this.y += 1.5;
  }

  drawSectionLabel(title: string, color: [number, number, number] = ACADEMY.primary) {
    this.ensureSpace(8);
    if (!this.measuring) {
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(8.5);
      this.doc.setTextColor(...color);
      this.doc.text(title.toUpperCase(), this.textLeft, this.y);
    }
    this.y += 6;
  }

  drawBulletList(items: string[]) {
    items.forEach((item) => {
      const lines = this.doc.splitTextToSize(item, this.textWidth - 5);
      const blockHeight = lines.length * this.lineHeight(9.5) + 1.5;
      this.ensureSpace(blockHeight);
      if (!this.measuring) {
        this.doc.setFillColor(...ACADEMY.primary);
        this.doc.circle(this.textLeft + 1.2, this.y - 1.1, 0.75, 'F');
        this.doc.setFont('helvetica', 'normal');
        this.doc.setFontSize(9.5);
        this.doc.setTextColor(...ACADEMY.text);
        this.doc.text(lines, this.textLeft + 5, this.y);
      }
      this.y += blockHeight;
    });
  }

  drawTimelineItem(dateLabel: string, title: string, notes?: string) {
    this.ensureSpace(6);
    if (!this.measuring) {
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(8.5);
      this.doc.setTextColor(...ACADEMY.primary);
      this.doc.text(dateLabel, this.textLeft, this.y);
    }
    this.y += 4.5;

    if (!this.measuring) {
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(10);
      this.doc.setTextColor(...ACADEMY.text);
    }
    this.writeParagraph(title, 10, ACADEMY.text);

    if (notes?.trim()) {
      this.writeParagraph(notes.trim(), 9.5, ACADEMY.muted);
    }

    this.y += 2;
    if (!this.measuring) {
      this.doc.setDrawColor(...ACADEMY.border);
      this.doc.setLineWidth(0.15);
      this.doc.line(this.textLeft, this.y, this.textLeft + this.textWidth, this.y);
    }
    this.y += 4;
  }

  drawHeader(studentProfile?: StudentProfileForPdf | null, patientName?: string) {
    this.drawPageBackground();

    this.doc.setFillColor(...ACADEMY.primary);
    this.doc.roundedRect(this.margin, this.y, this.contentWidth, 30, 4, 4, 'F');

    this.doc.setFillColor(...ACADEMY.primaryDark);
    this.doc.circle(this.margin + 11, this.y + 15, 6.5, 'F');
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(12);
    this.doc.setTextColor(...ACADEMY.white);
    this.doc.text('O', this.margin + 11, this.y + 16.3, { align: 'center' });

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(16);
    this.doc.text('OdontoHub Academy', this.margin + 22, this.y + 12);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(10);
    this.doc.setTextColor(244, 241, 246);
    this.doc.text('Resumo do caso clínico para estudo', this.margin + 22, this.y + 18.5);

    const generatedAt = new Date().toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    this.doc.setFontSize(8.5);
    this.doc.text(`Gerado em ${generatedAt}`, this.pageWidth - this.margin - 2, this.y + 12, { align: 'right' });

    this.y += 36;

    if (studentProfile?.name || studentProfile?.institution || studentProfile?.current_discipline) {
      this.runInCard(() => {
        this.drawSectionLabel('Estudante');
        const studentLines = [
          studentProfile?.name ? `Acadêmico(a): ${studentProfile.name}` : null,
          studentProfile?.institution ? `Instituição: ${studentProfile.institution}` : null,
          studentProfile?.current_discipline ? `Disciplina: ${studentProfile.current_discipline}` : null,
          studentProfile?.academic_period ? `Período: ${studentProfile.academic_period}` : null,
        ].filter(Boolean) as string[];
        this.drawBulletList(studentLines);
      });
    }

    if (patientName) {
      this.runInCard(() => {
        this.drawSectionLabel('Identificação do caso');
        this.ensureSpace(10);
        if (!this.measuring) {
          this.doc.setFont('helvetica', 'bold');
          this.doc.setFontSize(17);
          this.doc.setTextColor(...ACADEMY.text);
          this.doc.text(patientName, this.textLeft, this.y);
        }
        this.y += 9;
      });
    }
  }

  drawCard(content: () => void) {
    this.runInCard(content, 'default');
  }

  drawAlert(title: string, body: string) {
    this.runInCard(() => {
      this.drawSectionLabel('Alertas clínicos', ACADEMY.attentionText);
      this.ensureSpace(6);
      if (!this.measuring) {
        this.doc.setFont('helvetica', 'bold');
        this.doc.setFontSize(10);
        this.doc.setTextColor(...ACADEMY.attentionText);
        this.doc.text(title, this.textLeft, this.y);
      }
      this.y += 5.5;
      this.writeParagraph(body, 9.5, ACADEMY.attentionText);
    }, 'attention');
  }

  save(fileName: string) {
    this.addFooter();
    this.doc.save(fileName);
  }
}

export async function exportClinicalCasePdf({
  patient,
  appointments,
  studentProfile,
}: ExportClinicalCasePdfInput): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const builder = new PdfBuilder(jsPDF);
  const patientAppointments = (appointments || [])
    .filter((appointment) => appointment.patient_id === patient?.id)
    .filter((appointment) => !['CANCELLED', 'NO_SHOW'].includes(String(appointment.status || '').toUpperCase()))
    .sort((a, b) => getAppointmentTime(b.start_time) - getAppointmentTime(a.start_time));

  const treatmentPlan = (patient?.treatmentPlan || []).filter((item: any) =>
    isActiveTreatmentStatus(item.status) || String(item.status || '').toUpperCase() === 'CONCLUIDO',
  );
  const treatmentInProgress = (patient?.treatmentPlan || []).filter((item: any) =>
    isActiveTreatmentStatus(item.status),
  );
  const primaryTreatment = treatmentInProgress[0] || null;
  const upcomingAppointment =
    [...patientAppointments]
      .filter((appointment) => getAppointmentTime(appointment.start_time) >= Date.now())
      .sort((a, b) => getAppointmentTime(a.start_time) - getAppointmentTime(b.start_time))[0] || null;

  const boxContext = generateBoxContext(patient, treatmentInProgress, patientAppointments);
  const age = getAge(patient?.birth_date);
  const anamnesis = patient?.anamnesis || {};
  const odontogram = patient?.odontogram || {};
  const evolutions = [...(patient?.evolution || [])].sort(
    (a, b) => new Date(b.date || b.created_at || 0).getTime() - new Date(a.date || a.created_at || 0).getTime(),
  );

  builder.drawHeader(studentProfile, patient?.name || 'Caso clínico');

  builder.drawCard(() => {
    builder.drawSectionLabel('Visão geral');
    const overviewLines = [
      age !== null ? `Idade: ${age} anos` : 'Idade: não informada',
      patient?.phone ? `Contato: ${patient.phone}` : null,
      patient?.created_at ? `Caso cadastrado em ${formatDate(patient.created_at)}` : null,
      primaryTreatment
        ? `Próximo passo: ${primaryTreatment.procedure} · ${formatTreatmentAnchor(normalizeTreatmentItem(primaryTreatment))}`
        : upcomingAppointment
          ? `Próxima consulta: ${formatAppointmentDate(upcomingAppointment.start_time, { day: '2-digit', month: '2-digit', year: 'numeric' })} às ${formatAppointmentTime(upcomingAppointment.start_time)}`
          : 'Sem procedimento prioritário definido no plano clínico',
      boxContext.expectedTodaySummary ? `Foco do atendimento: ${boxContext.expectedTodaySummary}` : null,
    ].filter(Boolean) as string[];
    builder.drawBulletList(overviewLines);
  });

  const alertLines: string[] = [];
  if (hasRecordedAllergie(anamnesis.allergies)) {
    alertLines.push(`Alergia referida: ${formatAllergieLabel(anamnesis.allergies)}`);
  }
  if (hasRecordedMedication(anamnesis.medications)) {
    alertLines.push(`Medicação em uso: ${formatMedicationLabel(anamnesis.medications)}`);
  }
  if (boxContext.criticalCheckpoint) {
    alertLines.push(boxContext.criticalCheckpoint);
  }
  if (alertLines.length > 0) {
    builder.drawAlert('Atenção antes do atendimento', alertLines.join('\n\n'));
  }

  builder.drawCard(() => {
    builder.drawSectionLabel('Anamnese');
    const filledFields = Object.entries(ANAMNESIS_LABELS).filter(([key]) =>
      hasMeaningfulAnamnesisValue(anamnesis[key as keyof typeof anamnesis]),
    );
    if (filledFields.length === 0) {
      builder.writeParagraph('Anamnese ainda não registrada. Priorize coletar queixa, alergias e medicações antes do box.', 9.5, ACADEMY.muted);
      return;
    }
    filledFields.forEach(([key, label]) => {
      builder.writeKeyValue(label, String(anamnesis[key as keyof typeof anamnesis] || '').trim());
    });
  });

  builder.drawCard(() => {
    builder.drawSectionLabel('Plano clínico');
    if (treatmentPlan.length === 0) {
      builder.writeParagraph('Nenhum procedimento registrado no plano. Use o odontograma para mapear condições e definir condutas.', 9.5, ACADEMY.muted);
      return;
    }
    treatmentPlan.slice(0, 12).forEach((item: any) => {
      const normalized = normalizeTreatmentItem(item);
      const status = TREATMENT_STATUS_LABELS[String(item.status || '').toUpperCase()] || item.status || '—';
      builder.writeParagraph(
        `${normalized.procedure || 'Procedimento'} · ${formatTreatmentAnchor(normalized)} · ${status}`,
        9.5,
        ACADEMY.text,
      );
    });
    if (treatmentPlan.length > 12) {
      builder.writeParagraph(`+ ${treatmentPlan.length - 12} procedimento(s) adicional(is) no prontuário digital.`, 9, ACADEMY.muted);
    }
  });

  const odontogramEntries = Object.entries(odontogram)
    .map(([tooth, data]: [string, any]) => {
      const status = String(data?.status || 'healthy');
      if (status === 'healthy') return null;
      const label = TOOTH_STATUS_LABELS[status] || status;
      const notes = data?.notes?.trim();
      return notes ? `Dente ${tooth}: ${label} — ${notes}` : `Dente ${tooth}: ${label}`;
    })
    .filter(Boolean) as string[];

  builder.drawCard(() => {
    builder.drawSectionLabel('Mapa do odontograma');
    if (odontogramEntries.length === 0) {
      builder.writeParagraph('Nenhuma alteração registrada nos dentes. Ideal para casos novos ou avaliação inicial.', 9.5, ACADEMY.muted);
      return;
    }
    builder.drawBulletList(odontogramEntries.slice(0, 16));
    if (odontogramEntries.length > 16) {
      builder.writeParagraph(`+ ${odontogramEntries.length - 16} dente(s) com registro adicional no app.`, 9, ACADEMY.muted);
    }
  });

  builder.drawCard(() => {
    builder.drawSectionLabel('Linha do tempo clínica');
    if (evolutions.length === 0) {
      builder.writeParagraph('Sem evoluções registradas. Após cada atendimento, documente conduta, materiais e orientações.', 9.5, ACADEMY.muted);
      return;
    }
    evolutions.slice(0, 8).forEach((evolution: any) => {
      const dateLabel = evolution.date
        ? formatDate(evolution.date)
        : evolution.created_at
          ? formatDate(evolution.created_at)
          : 'Data não informada';
      const title = evolution.procedure || evolution.procedure_performed || 'Evolução clínica';
      const notes = [evolution.notes, evolution.materials, evolution.observations].filter(Boolean).join(' · ');
      builder.drawTimelineItem(dateLabel, title, notes);
    });
    if (evolutions.length > 8) {
      builder.writeParagraph(`+ ${evolutions.length - 8} evolução(ões) disponíveis no prontuário digital.`, 9, ACADEMY.muted);
    }
  });

  builder.drawCard(() => {
    builder.drawSectionLabel('Atendimentos');
    if (patientAppointments.length === 0) {
      builder.writeParagraph('Nenhum atendimento agendado ou realizado para este caso.', 9.5, ACADEMY.muted);
      return;
    }
    patientAppointments.slice(0, 8).forEach((appointment) => {
      const dateLabel = `${formatAppointmentDate(appointment.start_time, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })} · ${formatAppointmentTime(appointment.start_time)}`;
      const status = APPOINTMENT_STATUS_LABELS[String(appointment.status || '').toUpperCase()] || appointment.status;
      const procedure = appointment.notes || appointment.procedure || 'Atendimento clínico';
      builder.writeParagraph(`${dateLabel} · ${status} · ${procedure}`, 9.5, ACADEMY.text);
    });
  });

  builder.drawCard(() => {
    builder.drawSectionLabel('Guia rápido para o box');
    const studyItems = [
      boxContext.expectedTodaySummary,
      boxContext.criticalCheckpoint,
      primaryTreatment ? `Procedimento prioritário: ${primaryTreatment.procedure}` : null,
      upcomingAppointment
        ? `Próximo horário: ${formatAppointmentDate(upcomingAppointment.start_time, { day: '2-digit', month: '2-digit' })} às ${formatAppointmentTime(upcomingAppointment.start_time)}`
        : null,
      'Revise anamnese, confirme alergias/medicações e valide conduta com o professor antes de iniciar.',
    ].filter(Boolean) as string[];
    builder.drawBulletList(studyItems);
    builder.writeParagraph(
      'Documento gerado para apoio acadêmico. Não substitui prontuário oficial da instituição.',
      8.5,
      ACADEMY.muted,
    );
  });

  const fileName = `Caso_${sanitizeFileName(patient?.name || 'clinico')}_${new Date().toLocaleDateString('en-CA')}.pdf`;
  builder.save(fileName);
}
