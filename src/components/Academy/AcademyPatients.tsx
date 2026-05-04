import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
    <div className="flex-1 bg-[var(--academy-bg)] overflow-y-auto pb-20">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-20 bg-[var(--academy-bg)]/80 backdrop-blur-md px-4 py-4"
        >
          <div className="mb-4">
            <h1 className="ios-title text-2xl mb-1">Meus Pacientes</h1>
            <p className="ios-text-secondary">Organize seus casos clinicos</p>
          </div>

          <div className="relative mb-3">
            <Search size={16} style={{color: 'var(--academy-muted)', position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)'}} />
            <input
              type="text"
              placeholder="Buscar paciente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ios-input pl-10 w-full"
            />
          </div>
        </motion.div>

        <div className="px-4 space-y-3">
          {filteredPatients.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Users size={40} style={{color: 'var(--academy-muted)', marginLeft: 'auto', marginRight: 'auto', marginBottom: '0.75rem'}} />
              <p style={{color: 'var(--academy-muted)'}} className="font-medium">Nenhum paciente encontrado</p>
              <p className="text-sm mt-1" style={{color: 'var(--academy-muted)'}}>A tela ainda nao possui uma API real de pacientes Academy.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
