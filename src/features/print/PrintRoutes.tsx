import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Printer } from '../../icons';
import type { Appointment, Dentist } from '../../types/clinical';
import {
  formatAppointmentTime,
  formatDateInputValue,
  getAppointmentTime,
  isSameAppointmentDay,
} from '../../utils/dateUtils';
import { formatAllergieLabel, formatMedicationLabel, hasRecordedAllergie } from '../../utils/anamnesisUtils';

export function PrintLayout({ children, title, onPrint }: { children: React.ReactNode, title: string, onPrint: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-slate-50 py-4 md:py-8 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8 no-print">
          <h1 className="text-xl font-bold text-slate-800">{title}</h1>
          <div className="flex gap-4">
            <button
              onClick={() => window.close()}
              className="px-6 py-2 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all"
            >
              Fechar
            </button>
            <button
              onClick={onPrint}
              className="print-btn flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-[0_12px_36px_rgba(139,92,246,0.12)]"
            >
              <Printer size={20} />
              Imprimir Agora
            </button>
          </div>
        </div>
        <div className="print-container bg-white shadow-xl">
          {children}
        </div>
      </div>
    </div>
  );
}

export function PrintAgenda({ date, appointments, profile }: { date: Date, appointments: Appointment[], profile: Dentist | null }) {
  const dayAppointments = appointments
    .filter(a => isSameAppointmentDay(a.start_time, date))
    .sort((a, b) => getAppointmentTime(a.start_time) - getAppointmentTime(b.start_time));

  return (
    <PrintLayout title="Agenda do Dia" onPrint={() => window.print()}>
      <div className="border-b-4 border-slate-900 pb-8 mb-10">
        <h1 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tight">Agenda do Dia</h1>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-2xl font-bold text-slate-700 capitalize">
              {date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
            <p className="text-xl text-slate-500 mt-1">
              {profile?.name || 'Dr. Samuel Godoy'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-slate-900">
              Total: {dayAppointments.length} consultas
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {dayAppointments.map((app) => (
          <div key={app.id} className="flex gap-8 pb-8 border-b border-slate-200 last:border-0">
            <div className="w-8 h-8 border-2 border-slate-400 rounded flex-shrink-0 mt-1" />
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <p className="text-2xl font-black text-slate-900">
                  {formatAppointmentTime(app.start_time)}
                  <span className="mx-3 text-slate-300">—</span>
                  {app.patient_name}
                </p>
                <span className="text-sm font-black text-slate-400 border border-slate-200 px-3 py-1 rounded-lg uppercase tracking-widest">
                  {app.status === 'SCHEDULED' ? 'Agendado' :
                    app.status === 'CONFIRMED' ? 'Confirmado' :
                      app.status === 'CANCELLED' ? 'Cancelado' :
                        app.status === 'NO_SHOW' ? 'Faltou' :
                          app.status === 'IN_PROGRESS' ? 'Atendendo' : 'Finalizado'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <p className="text-slate-700 text-lg">
                  <span className="font-bold text-slate-400 uppercase text-xs tracking-wider block mb-0.5">Observações</span>
                  {app.notes || 'Nenhuma observação'}
                </p>
                <p className="text-slate-700 text-lg">
                  <span className="font-bold text-slate-400 uppercase text-xs tracking-wider block mb-0.5">Dentista</span>
                  {app.dentist_name}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PrintLayout>
  );
}

export function PrintReceipt({ transaction, installment, profile, patients, paymentPlans }: any) {
  const data = transaction || installment;
  if (!data) return <div className="p-8 text-center text-slate-500">Documento não encontrado.</div>;

  const patient = patients.find((p: any) => p.id === data.patient_id);
  const plan = installment ? paymentPlans.find((p: any) => p.id === data.payment_plan_id) : null;

  return (
    <PrintLayout title="Recibo" onPrint={() => window.print()}>
      <div className="p-12 bg-white text-slate-800 font-serif border border-slate-200">
        <div className="flex justify-between items-start mb-16">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white">
              <Plus size={28} strokeWidth={3} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">OdontoHub</h1>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-serif italic text-slate-400 mb-1">Recibo</h2>
            <p className="text-sm font-sans font-bold text-slate-500 uppercase tracking-widest">Nº {data.id.toString().padStart(6, '0')}</p>
          </div>
        </div>

        <div className="space-y-10 text-lg leading-relaxed">
          <p>
            Recebemos de <span className="font-bold border-b-2 border-slate-200 px-2">{patient?.name || data.patient_name || '________________________________'}</span>,
            a importância de <span className="font-bold border-b-2 border-slate-200 px-2">R$ {data.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            (<span className="italic text-slate-500">________________________________________________</span>).
          </p>

          <p>
            Referente a <span className="font-bold border-b-2 border-slate-200 px-2">{data.procedure || plan?.procedure || data.description || 'tratamento odontológico'}</span>.
          </p>

          <div className="pt-10 flex justify-between items-end">
            <div>
              <p className="text-slate-500 mb-1">Data do Pagamento</p>
              <p className="font-bold text-xl">{new Date(data.date || data.payment_date || data.due_date).toLocaleDateString('pt-BR')}</p>
            </div>
            <div className="text-center w-64">
              <div className="border-b-2 border-slate-900 mb-2"></div>
              <p className="font-bold text-slate-800">{profile?.name || 'Assinatura do Responsável'}</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest">{profile?.cro ? `CRO: ${profile.cro}` : 'Cirurgião Dentista'}</p>
            </div>
          </div>
        </div>
      </div>
    </PrintLayout>
  );
}

export function PrintReport({ profile, transactions, patients, appointments }: any) {
  const summary = {
    totalIncome: transactions.filter((t: any) => t.type === 'INCOME').reduce((acc: number, t: any) => acc + Number(t.amount), 0),
    totalExpense: transactions.filter((t: any) => t.type === 'EXPENSE').reduce((acc: number, t: any) => acc + Number(t.amount), 0),
    totalPatients: patients.length,
    totalAppointments: appointments.length
  };

  return (
    <PrintLayout title="Relatório Financeiro" onPrint={() => window.print()}>
      <div className="p-12 bg-white text-slate-800 font-sans">
        <div className="flex justify-between items-start mb-16 border-b-4 border-slate-900 pb-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight mb-2">Relatório Geral</h1>
            <p className="text-xl text-slate-500 font-medium">Resumo de Atividades e Financeiro</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Data de Emissão</p>
            <p className="text-xl font-bold text-slate-900">{new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Resumo Financeiro</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Total de Entradas</span>
                <span className="text-2xl font-black text-primary">
                  {summary.totalIncome.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Total de Saídas</span>
                <span className="text-2xl font-black text-rose-600">
                  {summary.totalExpense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t-2 border-slate-900">
                <span className="text-lg font-black text-slate-900 uppercase">Saldo Final</span>
                <span className={`text-3xl font-black ${(summary.totalIncome - summary.totalExpense) >= 0 ? 'text-primary' : 'text-rose-600'}`}>
                  {(summary.totalIncome - summary.totalExpense).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Estatísticas Gerais</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Pacientes</p>
                <p className="text-4xl font-black text-slate-900">{summary.totalPatients}</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Consultas</p>
                <p className="text-4xl font-black text-slate-900">{summary.totalAppointments}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Últimas Transações</h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-xs uppercase tracking-widest">
                <th className="pb-4 font-black">Data</th>
                <th className="pb-4 font-black">Descrição</th>
                <th className="pb-4 font-black">Tipo</th>
                <th className="pb-4 font-black text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {transactions.slice(0, 15).map((t: any) => (
                <tr key={t.id} className="border-b border-slate-50">
                  <td className="py-4 font-medium">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                  <td className="py-4 font-bold text-slate-900">{t.description}</td>
                  <td className="py-4">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${t.type === 'INCOME' ? 'bg-primary/5 text-primary' : 'bg-rose-50 text-rose-600'}`}>
                      {t.type === 'INCOME' ? 'Entrada' : 'Saída'}
                    </span>
                  </td>
                  <td className={`py-4 font-black text-right ${t.type === 'INCOME' ? 'text-primary' : 'text-rose-600'}`}>
                    {Number(t.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-24 pt-12 border-t border-slate-100 flex justify-between items-end">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Clínica</p>
            <p className="text-lg font-bold text-slate-900">{profile?.clinic_name || 'OdontoHub'}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Responsável</p>
            <p className="text-lg font-bold text-slate-900">{profile?.name}</p>
          </div>
        </div>
      </div>
    </PrintLayout>
  );
}

export function PrintDocument({ profile, patients, apiFetch, appointments, transactions, installments, paymentPlans }: any) {
  const { tipo: type, id } = useParams();
  const [doc, setDoc] = useState<any>(null);
  const [fullPatient, setFullPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoc = async () => {
      const genericTypes = ['receituario', 'declaracao', 'atestado', 'encaminhamento', 'ficha', 'orcamento'];
      if (type && genericTypes.includes(type) && id) {
        try {
          const res = await apiFetch(`/api/documents/${id}`);
          if (res.ok) {
            const data = await res.json();
            const parsedDoc = {
              ...data,
              content: JSON.parse(data.content)
            };
            setDoc(parsedDoc);

            if (data.patient_id) {
              const pRes = await apiFetch(`/api/patients/${data.patient_id}`);
              if (pRes.ok) {
                const pData = await pRes.json();
                setFullPatient(pData);
              }
            }
          }
        } catch (error) {
          console.error('Error fetching document:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchDoc();
  }, [id, type, apiFetch]);

  if (loading) return <div className="bg-white flex items-center justify-center font-bold text-slate-400 py-20">Carregando dados para impressão...</div>;

  if (type === 'agenda') {
    const dateStr = new URLSearchParams(window.location.search).get('date') || formatDateInputValue(new Date());
    const date = new Date(dateStr + 'T12:00:00');
    return <PrintAgenda date={date} appointments={appointments} profile={profile} />;
  }

  if (type === 'recibo') {
    const transaction = transactions.find((t: any) => t.id.toString() === id);
    const installment = installments.find((i: any) => i.id.toString() === id);
    return <PrintReceipt transaction={transaction} installment={installment} profile={profile} patients={patients} paymentPlans={paymentPlans} />;
  }

  if (type === 'relatorio') {
    return <PrintReport profile={profile} transactions={transactions} patients={patients} appointments={appointments} />;
  }

  if (!doc && id) return <div className="bg-white flex items-center justify-center font-bold text-slate-400 py-20">Documento não encontrado.</div>;

  const patient = fullPatient || patients.find((p: any) => p.id === doc?.patient_id);
  const content = doc?.content || {};

  return (
    <PrintLayout title={type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Documento'} onPrint={() => window.print()}>
      <div className="bg-white p-[1cm] font-serif text-slate-900">
        <div className="text-center border-b-2 border-primary/20 pb-6 mb-10">
          <h1 className="text-3xl font-bold text-primary uppercase tracking-widest">
            {profile?.clinic_name || 'Clínica Odontológica'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {profile?.clinic_address || 'Endereço não informado'}
          </p>
          <p className="text-sm text-slate-500">
            Tel: {profile?.phone || 'Telefone não informado'}
          </p>
        </div>

        <div className="space-y-8 min-h-[15cm]">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold uppercase underline decoration-primary/40 underline-offset-8">
              {type === 'receituario' ? 'Receituário' :
                type === 'declaracao' ? 'Declaração' :
                  type === 'atestado' ? 'Atestado' :
                    type === 'encaminhamento' ? 'Encaminhamento' :
                      type === 'ficha' ? 'Ficha Clínica' :
                        type === 'orcamento' ? 'Orçamento' : type}
            </h2>
          </div>

          <div className="space-y-6 text-lg leading-relaxed">
            <p><strong>Paciente:</strong> {patient?.name || '________________________________'}</p>
            <p><strong>Data:</strong> {doc?.created_at ? new Date(doc.created_at).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR')}</p>

            {type === 'receituario' && (
              <div className="mt-10 space-y-8">
                <p className="font-bold text-xl mb-4 text-primary">Uso Interno:</p>
                {content.items?.map((item: any, i: number) => (
                  <div key={i} className="border-l-4 border-primary/40 pl-4 mb-6">
                    <p className="font-bold text-lg">{item.medication}</p>
                    <p className="text-slate-700 italic">{item.dosage}</p>
                  </div>
                ))}
                {content.instructions && (
                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <p className="font-bold mb-2">Instruções:</p>
                    <p className="text-slate-700 whitespace-pre-wrap">{content.instructions}</p>
                  </div>
                )}
              </div>
            )}

            {type === 'declaracao' && (
              <div className="mt-10">
                <p className="text-justify">
                  Declaro para os devidos fins que o(a) paciente <strong>{patient?.name}</strong> compareceu a esta clínica odontológica na data de <strong>{new Date(doc?.created_at || Date.now()).toLocaleDateString('pt-BR')}</strong> para atendimento odontológico.
                </p>
              </div>
            )}

            {type === 'atestado' && (
              <div className="mt-10 space-y-6">
                <p className="text-justify">
                  Atesto, para os devidos fins, que o(a) Sr(a). <strong>{patient?.name}</strong> necessita de <strong>{content.period}</strong> de afastamento de suas atividades, a partir desta data, por motivo de tratamento odontológico.
                </p>
                {content.reason && (
                  <p><strong>Observação:</strong> {content.reason}</p>
                )}
              </div>
            )}

            {type === 'encaminhamento' && (
              <div className="mt-10 space-y-6">
                <p><strong>Ao Especialista:</strong> {content.specialist}</p>
                <p className="text-justify">
                  Encaminho o(a) paciente <strong>{patient?.name}</strong> para avaliação e conduta especializada.
                </p>
                <p><strong>Motivo/Histórico:</strong> {content.reason}</p>
              </div>
            )}

            {type === 'ficha' && (
              <div className="mt-10 space-y-8">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <p><strong>CPF:</strong> {patient?.cpf}</p>
                  <p><strong>Data de Nasc.:</strong> {patient?.birth_date ? new Date(patient.birth_date).toLocaleDateString('pt-BR') : 'Não informado'}</p>
                  <p><strong>E-mail:</strong> {patient?.email}</p>
                  <p><strong>Telefone:</strong> {patient?.phone}</p>
                  <p className="col-span-2"><strong>Endereço:</strong> {patient?.address || 'Não informado'}</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-bold border-b-2 border-primary/40 pb-1 text-primary uppercase tracking-wider">Histórico Clínico (Anamnese)</h4>
                    <div className="grid grid-cols-1 gap-4 text-sm">
                      <div>
                        <p className="font-bold text-slate-500 text-[10px] uppercase">Histórico Médico:</p>
                        <p>{patient?.anamnesis?.medical_history || 'Nenhum histórico registrado.'}</p>
                      </div>
                      <div>
                        <p className="font-bold text-slate-500 text-[10px] uppercase">Alergias:</p>
                        <p className={hasRecordedAllergie(patient?.anamnesis?.allergies) ? 'text-rose-600 font-bold' : ''}>
                          {formatAllergieLabel(patient?.anamnesis?.allergies)}
                        </p>
                      </div>
                      <div>
                        <p className="font-bold text-slate-500 text-[10px] uppercase">Medicações em Uso:</p>
                        <p>{formatMedicationLabel(patient?.anamnesis?.medications)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold border-b-2 border-primary/40 pb-1 text-primary uppercase tracking-wider">Histórico de Atendimentos (Evolução)</h4>
                    {patient?.evolution && patient.evolution.length > 0 ? (
                      <div className="space-y-4">
                        {patient.evolution.map((evo: any, i: number) => (
                          <div key={i} className="border-b border-slate-100 pb-3">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-bold text-primary">{new Date(evo.date).toLocaleDateString('pt-BR')}</span>
                              <span className="text-xs font-bold text-slate-400 uppercase">{evo.procedure_performed}</span>
                            </div>
                            <p className="text-sm text-slate-600 italic">{evo.notes}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 italic">Nenhum atendimento registrado até o momento.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {type === 'orcamento' && (
              <div className="mt-10 space-y-6">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-primary/5 text-primary">
                      <th className="border border-primary/10 p-3 text-left">Procedimento</th>
                      <th className="border border-primary/10 p-3 text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {content.items?.map((item: any, i: number) => (
                      <tr key={i}>
                        <td className="border border-slate-100 p-3">{item.procedure}</td>
                        <td className="border border-slate-100 p-3 text-right">
                          {Number(item.value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-bold bg-slate-50">
                      <td className="border border-slate-100 p-3 text-right">Total</td>
                      <td className="border border-slate-100 p-3 text-right text-primary">
                        {content.items?.reduce((acc: number, item: any) => acc + Number(item.value), 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center">
          <div className="w-64 border-t border-slate-400 mb-2"></div>
          <p className="font-bold text-lg">{profile?.name}</p>
          <p className="text-slate-600">Cirurgião-Dentista • CRO: {profile?.cro}</p>
        </div>
      </div>
    </PrintLayout>
  );
}

export default PrintDocument;
