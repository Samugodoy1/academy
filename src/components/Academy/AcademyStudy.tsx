import React, { useState } from 'react';
import { BookOpen, Search } from 'lucide-react';

interface AcademyStudyProps {
  onSelectMaterial?: (material: any) => void;
}

const LEVELS = [
  { id: 'iniciante', label: 'Iniciante' },
  { id: 'intermediario', label: 'Intermediário' },
  { id: 'avancado', label: 'Avançado' },
];

export const AcademyStudy: React.FC<AcademyStudyProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const materials: any[] = [];
  const filteredMaterials = materials.filter(material =>
    String(material.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto bg-white pb-20 text-[var(--neo-ink)]">
      <div className="mx-auto max-w-2xl px-4 py-6">
        <h1 className="text-[28px] font-semibold tracking-[-0.025em] leading-[1.05]">Estudos</h1>
        <p className="mt-2 text-[15px] text-[var(--neo-gray)]">
          Antes do box. Poucas páginas, o essencial.
        </p>

        <div className="relative mt-5">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--neo-gray)]" />
          <input
            type="text"
            placeholder="Buscar material"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ios-input w-full pl-10"
          />
        </div>

        <div className="mt-4 flex gap-2">
          {LEVELS.map(level => (
            <span
              key={level.id}
              className="rounded-[980px] bg-[var(--neo-soft)] px-3 py-1.5 text-[12px] text-[var(--neo-ink)]"
            >
              {level.label}
            </span>
          ))}
        </div>

        {filteredMaterials.length === 0 && (
          <div className="neo-card mt-6 px-6 py-12 text-center">
            <BookOpen size={28} className="mx-auto mb-3 text-[var(--neo)]" />
            <p className="font-semibold tracking-[-0.016em]">Nenhum material ainda.</p>
            <p className="mt-1 text-[15px] text-[var(--neo-gray)]">Os temas do seu próximo caso aparecem aqui.</p>
          </div>
        )}
      </div>
    </div>
  );
};
