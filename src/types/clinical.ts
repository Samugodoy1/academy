import type { ProductCode } from '../config/product';

export interface PaymentPlan {
  id: number;
  dentist_id: number;
  patient_id: number;
  procedure: string;
  total_amount: number;
  installments_count: number;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  created_at: string;
}

export interface Installment {
  id: number;
  payment_plan_id: number;
  dentist_id: number;
  patient_id: number;
  number: number;
  amount: number;
  due_date: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  payment_date?: string;
  transaction_id?: number;
  procedure?: string;
}

export interface Transaction {
  id: number;
  dentist_id: number;
  type: 'INCOME' | 'EXPENSE';
  description: string;
  category: string;
  amount: number;
  payment_method: string;
  date: string;
  status: string;
  patient_id?: number;
  patient_name?: string;
  procedure?: string;
  notes?: string;
  created_at: string;
}

export interface Patient {
  id: number;
  name: string;
  cpf: string;
  phone: string;
  email: string;
  birth_date?: string;
  address?: string;
  photo_url?: string;
  anamnesis?: {
    medical_history: string;
    allergies: string;
    medications: string;
    chief_complaint?: string;
    habits?: string;
    family_history?: string;
    vital_signs?: string;
  };
  evolution?: Array<{
    id: number;
    date: string;
    notes: string;
    procedure_performed: string;
    appointment_id?: number | null;
    created_at?: string;
  }>;
  files?: Array<{
    id: number;
    file_url: string;
    file_type: string;
    description: string;
    created_at: string;
  }>;
  odontogram?: Record<number, { status: string; notes: string }>;
  journey?: {
    cadastro: 'PENDENTE' | 'CONCLUIDO';
    anamnese: 'PENDENTE' | 'CONCLUIDO';
    odontograma: 'PENDENTE' | 'CONCLUIDO';
    plano: 'PENDENTE' | 'CONCLUIDO';
    aceite: 'PENDENTE' | 'CONCLUIDO';
    consultas: 'PENDENTE' | 'CONCLUIDO';
    evolucao: 'PENDENTE' | 'CONCLUIDO';
    pagamento: 'PENDENTE' | 'CONCLUIDO';
  };
  toothHistory?: Array<{
    id: number;
    tooth_number: number;
    procedure: string;
    notes: string;
    date: string;
    dentist_name?: string;
  }>;
  treatmentPlan?: Array<{
    id: number;
    tooth_number?: number;
    procedure: string;
    value: number;
    status: 'PLANEJADO' | 'APROVADO' | 'REALIZADO' | 'CANCELADO';
    created_at: string;
  }>;
  procedures?: Array<{
    id: number;
    date: string;
    tooth_number?: number;
    procedure: string;
    dentist_name: string;
    notes: string;
  }>;
  clinicalEvolution?: Array<{
    id: number;
    date: string;
    procedure: string;
    notes: string;
    materials?: string;
    observations?: string;
    procedure_performed?: string;
    appointment_id?: number | null;
    created_at?: string;
  }>;
  last_evolution_date?: string;
  evolution_count?: number;
  odontogram_data?: unknown;
  has_odontogram_record?: boolean;
  financial?: {
    transactions: Transaction[];
    paymentPlans: PaymentPlan[];
    installments: Installment[];
  };
  created_at?: string;
}

export type Product = ProductCode;
export type ProductPlan = 'free' | 'pro' | 'student';
export type ProductApprovalStatus = 'pending' | 'approved' | 'rejected' | 'blocked';

export interface ProductAccess {
  product: Product;
  plan: ProductPlan;
  product_role: string;
  approval_status: ProductApprovalStatus;
  onboarding_completed?: boolean;
}

export interface Dentist {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  cro?: string;
  specialty?: string;
  bio?: string;
  photo_url?: string;
  clinic_name?: string;
  clinic_address?: string;
  institution?: string;
  academic_period?: string;
  student_registration?: string;
  current_discipline?: string;
  academy_neo?: string;
  academy_widgets?: unknown;
  settings?: Record<string, unknown>;
  current_product?: Product;
  product_accesses?: ProductAccess[];
  accepted_terms?: boolean;
  accepted_terms_at?: string;
  accepted_privacy_policy?: boolean;
}

export interface Appointment {
  id: number;
  patient_id: number;
  patient_name: string;
  patient_phone: string;
  dentist_id: number;
  dentist_name: string;
  start_time: string;
  end_time: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'CANCELLED' | 'IN_PROGRESS' | 'FINISHED' | 'NO_SHOW';
  notes?: string;
}

export interface CurrentUser {
  id: number;
  name: string;
  role: string;
  status?: string;
  current_product?: Product;
  product_accesses?: ProductAccess[];
  onboarding_done?: boolean;
  welcome_seen?: boolean;
  record_opened?: boolean;
}
