import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { useParams } from 'react-router-dom';
import { DEFAULT_PRODUCT } from '../../app/constants';
import { patientHasEvolutionForAppointment } from '../../utils/patientEvolution';
import { Loader2 } from '../../icons';

const PatientClinical = lazy(() =>
  import('../../components/PatientClinical').then(m => ({ default: m.PatientClinical }))
);

export const ClinicalPageRoute = ({ transactions, appointments, onUpdatePatient, onUpdateAnamnesis, onAddEvolution, onAddTransaction, onOpenSidebar, apiFetch, setAppActiveTab, navigate, pendingEvolutionAppointment, onClearPendingEvolution, onPatientLoaded, profile, canExportClinicalCasePdf, onRequestPdfUpgrade }: any) => {
  const { id } = useParams();
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const apiFetchRef = useRef(apiFetch);
  apiFetchRef.current = apiFetch;

  const loadPatient = React.useCallback(async (showLoading = true) => {
    if (!id) return;

    if (showLoading) {
      setLoading(true);
    }

    try {
      const res = await apiFetchRef.current(`/api/patients/${id}`);
      if (res.ok) {
        const data = await res.json();
        setPatient(data);
        onPatientLoaded?.(data);
      }
    } catch (error) {
      console.error('Error loading patient:', error);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [id]);

  useEffect(() => {
    loadPatient(true);
  }, [loadPatient]);

  const pendingEvolutionAlreadyClosed = patientHasEvolutionForAppointment(patient, pendingEvolutionAppointment);

  useEffect(() => {
    if (pendingEvolutionAlreadyClosed) {
      onClearPendingEvolution?.();
    }
  }, [pendingEvolutionAlreadyClosed, onClearPendingEvolution]);

  if (loading) return (
    <div className="flex-1 flex items-center justify-center bg-[#f2f2f7] min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={22} className="animate-spin text-[#86868b]" />
        <p className="text-[15px] text-[#6e6e73] tracking-[-0.016em]">Abrindo o caso</p>
      </div>
    </div>
  );

  if (!patient) return <div className="p-8 text-center text-[17px] text-[#6e6e73]">Caso não encontrado.</div>;

  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center bg-[#f2f2f7] min-h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={22} className="animate-spin text-[#86868b]" />
            <p className="text-[15px] text-[#6e6e73] tracking-[-0.016em]">Abrindo o caso</p>
          </div>
        </div>
      }
    >
      <PatientClinical
        patient={patient}
        appointments={appointments}
        onUpdatePatient={(updated: any) => {
          setPatient(updated);
          onUpdatePatient(updated);
        }}
        onAddEvolution={async (data: any) => {
          const evolutionWithPatient = { ...data, patient_id: patient.id };
          setPatient((prev: any) => ({ ...prev, evolution: [evolutionWithPatient, ...(prev.evolution || [])] }));
          await onAddEvolution(evolutionWithPatient);
          if (onClearPendingEvolution) onClearPendingEvolution();
        }}
        onRefreshPatient={() => loadPatient(false)}
        apiFetch={apiFetch}
        setAppActiveTab={setAppActiveTab}
        navigate={navigate}
        product={DEFAULT_PRODUCT}
        pendingEvolutionAppointment={pendingEvolutionAlreadyClosed ? null : pendingEvolutionAppointment}
        studentProfile={profile ? {
          name: profile.name,
          institution: profile.institution,
          current_discipline: profile.current_discipline,
          academic_period: profile.academic_period,
        } : null}
        canExportClinicalCasePdf={canExportClinicalCasePdf}
        onRequestPdfUpgrade={onRequestPdfUpgrade}
      />
    </Suspense>
  );
};
