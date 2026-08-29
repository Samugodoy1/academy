export const patientHasEvolutionForAppointment = (patient: any, appointment: any) => {
  if (!patient || !appointment?.id) return false;
  const appointmentId = Number(appointment.id);
  if (!Number.isFinite(appointmentId)) return false;

  const evolutions = [
    ...(Array.isArray(patient.evolution) ? patient.evolution : []),
    ...(Array.isArray(patient.clinicalEvolution) ? patient.clinicalEvolution : []),
  ];

  return evolutions.some((evolution: any) => Number(evolution?.appointment_id) === appointmentId);
};
