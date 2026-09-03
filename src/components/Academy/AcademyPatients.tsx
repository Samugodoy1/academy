import React, { useState } from 'react';
import { Search, Users } from 'lucide-react';

interface AcademyPatientsProps {
  onSelectPatient?: (patient: any) => void;
}

export const AcademyPatients: React.FC<AcademyPatientsProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const patients: any[] = [];
  const filteredPatients = patients.filter(patient =>
    String(patient.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--neo-wash)] pb-20 text-[var(--neo-ink)]">
      <div className="mx-auto max-w-2xl px-4 py-6">
        <h1 className="text-[28px] font-semibold tracking-[-0.025em] leading-[1.05]">Casos</h1>
        <p className="mt-2 text-[15px] text-[var(--neo-gray)]">
          Nenhum paciente ainda. Comece pelo seu primeiro caso.
        </p>

        <div className="relative mt-5">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--neo-gray)]" />
          <input
            type="text"
            placeholder="Buscar paciente"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ios-input w-full pl-10"
          />
        </div>

        {filteredPatients.length === 0 && (
          <div className="neo-card mt-6 px-6 py-12 text-center">
            <Users size={28} className="mx-auto mb-3 text-[var(--neo)]" />
            <p className="font-semibold tracking-[-0.016em]">Nenhum paciente ainda.</p>
            <p className="mt-1 text-[15px] text-[var(--neo-gray)]">Comece pelo seu primeiro caso.</p>
          </div>
        )}
      </div>
    </div>
  );
};
