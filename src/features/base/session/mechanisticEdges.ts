import type { MechanisticEdge } from './types';

/** Pares causa → efeito que o aluno liga no mapa mecânico. */
export const MECHANISTIC_BY_DISCIPLINE: Record<string, MechanisticEdge[]> = {
  'anatomia-dental': [
    { from: 'Quadrante FDI', to: 'Posição no arco', label: '2º dígito' },
    { from: 'Face mesial', to: 'Linha média', label: 'referência' },
    { from: 'Primeiro molar sup.', to: 'Tubérculo de Carabelli', label: 'traço variável' },
    { from: 'Classe II Angle', to: 'Mordida distólica', label: 'oclusão' },
  ],
  'histologia-embriologia': [
    { from: 'Lâmina dental', to: 'Órgão do esmalte', label: 'epitelial' },
    { from: 'Papila ectomesênquima', to: 'Órgão da dentina/polpa', label: 'mesenquimal' },
    { from: 'Célula de Hertwig', to: 'Raiz', label: 'bainha' },
    { from: 'Cemento', to: 'Inserção periodontal', label: 'Sharpey' },
  ],
  'microbiologia-imunologia': [
    { from: 'Biofilme maturo', to: 'pH ácido local', label: 'metabolismo' },
    { from: 'Gingivite', to: 'Inflamação reversível', label: 'sem perda óssea' },
    { from: 'Lipopolissacarídeo', to: 'Resposta imune', label: 'PAMP' },
    { from: 'Placa supra', to: 'Gengivite', label: 'ecologia' },
  ],
  'patologia-geral-oral': [
    { from: 'Agresão', to: 'Inflamação aguda', label: 'mediadores' },
    { from: 'Reparo', to: 'Granulação', label: 'fase' },
    { from: 'Leucoplasia', to: 'Risco de malignização', label: 'seguir' },
    { from: 'Eritroplasia', to: 'Alta suspeita', label: 'biópsia' },
  ],
  'materiais-dentarios': [
    { from: 'Condicionamento ácido', to: 'Tags de esmalte', label: 'microrretentivo' },
    { from: 'Camada híbrida', to: 'Adesão resina-dentina', label: 'infiltração' },
    { from: 'Ionomero', to: 'Liberação de flúor', label: 'bioativo' },
    { from: 'Polimerização', to: 'Contração', label: 'margem' },
  ],
  'bioquimica-fluor': [
    { from: 'Açúcar fermentável', to: 'Queda de pH', label: 'Stephan' },
    { from: 'pH < 5,5', to: 'Desmineralização', label: 'esmalte' },
    { from: 'Flúor tópico', to: 'Fluorapatita', label: 'menos solúvel' },
    { from: 'Remineralização', to: 'Cristal reprecipitado', label: 'saliva' },
  ],
};
