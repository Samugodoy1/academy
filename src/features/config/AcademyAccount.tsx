import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, ChevronRight, LogOut, UserCog } from '../../icons';
import { AcademyNeoPicker } from '../../components/AcademyNeoPicker';
import { SubscriptionManagement } from '../../components/SubscriptionManagement';
import { studentGreeting } from '../../theme/academyWidgets';
import {
  isAcademyStudentPlan,
  studentAcademicLine,
  studentFirstName,
  studentIdentityHeadline,
  studentSchoolLine,
} from '../../theme/academyProfile';
import type { CurrentUser, Dentist } from '../../types/clinical';

type ApiFetch = (url: string, options?: RequestInit & { product?: string }) => Promise<Response>;

export interface AcademyAccountProps {
  user: CurrentUser;
  profile: Dentist;
  profileDraft: Dentist | null;
  isProfileEditing: boolean;
  profilePassword: string;
  isSavingProfile: boolean;
  apiFetch: ApiFetch;
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void | Promise<void>;
  startProfileEditing: () => void;
  handleSaveProfile: (e: React.FormEvent) => void | Promise<void>;
  updateProfileDraft: (patch: Partial<Dentist>) => void;
  setIsProfileEditing: (value: boolean) => void;
  setProfileDraft: React.Dispatch<React.SetStateAction<Dentist | null>>;
  setProfilePassword: (value: string) => void;
  fetchProfile: () => void | Promise<void>;
  setActiveTab: (tab: 'admin') => void;
  handleLogout: () => void;
  currentPlan: string;
}

function Group({ children }: { children: React.ReactNode }) {
  return <div className="overflow-hidden rounded-[24px] bg-[#f5f5f7]">{children}</div>;
}

function Row({
  children,
  onClick,
  href,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
}) {
  const className =
    'flex w-full items-center gap-3 border-b border-black/[0.04] px-5 py-4 text-left last:border-b-0';

  if (href) {
    return (
      <Link to={href} target="_blank" className={className}>
        {children}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {children}
      </button>
    );
  }

  return <div className={className}>{children}</div>;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-4 border-b border-black/[0.04] px-5 last:border-b-0">
      <span className="w-[7.5rem] shrink-0 py-4 text-[15px] tracking-[-0.011em] text-[var(--neo-ink)]">
        {label}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </label>
  );
}

const fieldClass =
  'w-full bg-transparent py-4 text-[15px] tracking-[-0.011em] text-[var(--neo-ink)] outline-none placeholder:text-[var(--neo-gray)]';

export function AcademyAccount({
  user,
  profile,
  profileDraft,
  isProfileEditing,
  profilePassword,
  isSavingProfile,
  apiFetch,
  handlePhotoUpload,
  startProfileEditing,
  handleSaveProfile,
  updateProfileDraft,
  setIsProfileEditing,
  setProfileDraft,
  setProfilePassword,
  fetchProfile,
  setActiveTab,
  handleLogout,
  currentPlan,
}: AcademyAccountProps) {
  const firstName = studentFirstName(profile.name || user.name);
  const academicLine = studentAcademicLine(profile.academic_period, profile.institution);
  const schoolLine = studentSchoolLine(profile.institution, profile.current_discipline);
  const headline = studentIdentityHeadline(profile.academic_period);
  const isStudent = isAcademyStudentPlan(currentPlan);
  const academyAccess = profile.product_accesses?.find(access => access.product === 'academy');
  const approval = String(academyAccess?.approval_status || '').toLowerCase();
  const waitingAccess = Boolean(approval) && !['approved', 'aprovado', 'active', 'ativo'].includes(approval);

  const cancelEdit = () => {
    setIsProfileEditing(false);
    setProfileDraft(profile);
    setProfilePassword('');
    fetchProfile();
  };

  return (
    <div className="page-shell space-y-8 tablet-l:max-w-[640px] desktop:space-y-10">
      <header className="min-w-0">
        <p className="text-[15px] font-normal tracking-[-0.011em] text-[var(--neo-gray)]">
          {studentGreeting(new Date())}{firstName ? `, ${firstName}` : ''}
        </p>
        <h1 className="mt-3 text-[28px] font-semibold leading-[1.05] tracking-[-0.025em] text-[var(--neo-ink)] sm:text-[34px]">
          {isProfileEditing ? 'Seus dados.' : headline}
        </h1>
      </header>

      <section className="flex flex-col items-center text-center">
        <label className="group relative cursor-pointer">
          <span className="block h-40 w-40 overflow-hidden rounded-[40px] bg-[var(--neo-soft)] sm:h-48 sm:w-48">
            {profile.photo_url ? (
              <img
                src={profile.photo_url}
                alt=""
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-[52px] font-semibold tracking-[-0.04em] text-[var(--neo)]">
                {(firstName || 'A').charAt(0).toUpperCase()}
              </span>
            )}
          </span>
          <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-white/92 px-2.5 py-1 text-[12px] tracking-[-0.011em] text-[var(--neo-ink)] shadow-[0_4px_16px_rgba(29,29,31,0.08)]">
            <Camera size={12} />
            Foto
          </span>
          <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
        </label>

        {!isProfileEditing && (
          <>
            <p className="mt-5 max-w-[20ch] text-[26px] font-semibold leading-[1.05] tracking-[-0.025em] text-[var(--neo-ink)] sm:text-[32px]">
              {profile.name || 'Sem nome ainda'}
            </p>
            {academicLine ? (
              <p className="mt-2 text-[17px] tracking-[-0.011em] text-[var(--neo-gray)]">
                {academicLine}
              </p>
            ) : (
              <p className="mt-2 text-[17px] tracking-[-0.011em] text-[var(--neo-gray)]">
                Falta período e faculdade.
              </p>
            )}
            {profile.current_discipline && academicLine && (
              <p className="mt-1 text-[15px] tracking-[-0.011em] text-[var(--neo-gray)]">
                {profile.current_discipline}
              </p>
            )}
            <button type="button" onClick={startProfileEditing} className="neo-link mt-4 text-[17px]">
              Editar ›
            </button>
          </>
        )}
      </section>

      {isProfileEditing && profileDraft ? (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <button type="button" onClick={cancelEdit} className="neo-link text-[17px]">
              Cancelar
            </button>
            <button type="submit" disabled={isSavingProfile} className="neo-link text-[17px] disabled:opacity-50">
              {isSavingProfile ? 'Salvando' : 'Pronto'}
            </button>
          </div>

          <Group>
            <Field label="Nome">
              <input
                required
                type="text"
                value={profileDraft.name}
                onChange={e => updateProfileDraft({ name: e.target.value })}
                className={fieldClass}
                placeholder="Como te chamam no box"
              />
            </Field>
            <Field label="RA">
              <input
                type="text"
                value={profileDraft.student_registration || ''}
                onChange={e => updateProfileDraft({ student_registration: e.target.value })}
                className={fieldClass}
                placeholder="Matrícula"
              />
            </Field>
            <Field label="Período">
              <input
                type="text"
                value={profileDraft.academic_period || ''}
                onChange={e => updateProfileDraft({ academic_period: e.target.value })}
                className={fieldClass}
                placeholder="6º período"
              />
            </Field>
            <Field label="Faculdade">
              <input
                type="text"
                value={profileDraft.institution || ''}
                onChange={e => updateProfileDraft({ institution: e.target.value })}
                className={fieldClass}
                placeholder="A sua faculdade"
              />
            </Field>
            <Field label="Clínica">
              <input
                type="text"
                value={profileDraft.current_discipline || ''}
                onChange={e => updateProfileDraft({ current_discipline: e.target.value })}
                className={fieldClass}
                placeholder="Disciplina de agora"
              />
            </Field>
          </Group>

          <Group>
            <Field label="E-mail">
              <input
                required
                type="email"
                value={profileDraft.email}
                onChange={e => updateProfileDraft({ email: e.target.value })}
                className={fieldClass}
              />
            </Field>
            <Field label="Telefone">
              <input
                type="tel"
                inputMode="tel"
                value={profileDraft.phone || ''}
                onChange={e => updateProfileDraft({ phone: e.target.value })}
                className={fieldClass}
                placeholder="(00) 00000-0000"
              />
            </Field>
            <Field label="Senha">
              <input
                type="password"
                value={profilePassword}
                onChange={e => setProfilePassword(e.target.value)}
                className={fieldClass}
                placeholder="Deixa em branco pra manter"
              />
            </Field>
          </Group>
        </form>
      ) : (
        <>
          <AcademyNeoPicker />

          <section className="space-y-3">
            <h2 className="px-1 text-[13px] font-normal tracking-[-0.011em] text-[var(--neo-gray)]">
              Na faculdade
            </h2>
            {schoolLine || profile.student_registration ? (
              <div className="rounded-[24px] bg-[#f5f5f7] px-5 py-5">
                {profile.institution ? (
                  <p className="text-[22px] font-semibold leading-[1.05] tracking-[-0.025em] text-[var(--neo-ink)]">
                    {profile.institution}
                  </p>
                ) : (
                  <p className="text-[22px] font-semibold leading-[1.05] tracking-[-0.025em] text-[var(--neo-ink)]">
                    Sem faculdade ainda
                  </p>
                )}
                {profile.current_discipline && (
                  <p className="mt-2 text-[17px] tracking-[-0.011em] text-[var(--neo-ink)]">
                    {profile.current_discipline}
                  </p>
                )}
                {profile.student_registration && (
                  <p className="mt-2 text-[15px] tracking-[-0.011em] text-[var(--neo-gray)]">
                    RA {profile.student_registration}
                  </p>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={startProfileEditing}
                className="w-full rounded-[24px] bg-[#f5f5f7] px-5 py-5 text-left"
              >
                <p className="text-[22px] font-semibold leading-[1.05] tracking-[-0.025em] text-[var(--neo-ink)]">
                  Onde você estuda
                </p>
                <p className="mt-2 text-[15px] tracking-[-0.011em] text-[var(--neo-gray)]">
                  Faculdade, período e a clínica de agora.
                </p>
                <p className="neo-link mt-4 text-[15px]">Completar ›</p>
              </button>
            )}
          </section>

          <section className="space-y-3">
            <h2 className="px-1 text-[13px] font-normal tracking-[-0.011em] text-[var(--neo-gray)]">
              O plano
            </h2>
            {isStudent ? (
              <div className="rounded-[24px] bg-[#f5f5f7] px-5 py-5">
                <p className="text-[13px] tracking-[-0.011em] text-[var(--neo-gray)]">Student</p>
                <p className="mt-1 text-[22px] font-semibold leading-[1.05] tracking-[-0.025em] text-[var(--neo-ink)]">
                  Sem teto no semestre.
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => document.getElementById('assinatura')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="w-full rounded-[28px] bg-[var(--neo)] px-6 py-6 text-left text-white"
              >
                <p className="text-[12px] font-normal uppercase tracking-[0.04em] text-white/80">
                  Free
                </p>
                <p className="mt-2 text-[26px] font-semibold leading-[1.05] tracking-[-0.025em]">
                  Três casos. O box já começou.
                </p>
                <p className="mt-2 text-[15px] tracking-[-0.011em] text-white/85">
                  No Student a evolução, a agenda e o prontuário seguem no semestre.
                </p>
                <p className="mt-4 text-[15px] text-white/90">Mudar para Student ›</p>
              </button>
            )}
            {waitingAccess && (
              <p className="px-1 text-[13px] tracking-[-0.011em] text-[var(--neo-gray)]">
                A faculdade ainda libera o acesso.
              </p>
            )}
          </section>

          <div id="assinatura">
            <SubscriptionManagement
              apiFetch={apiFetch}
              product="academy"
              currentPlan={currentPlan}
            />
          </div>

          <section className="space-y-3">
            <h2 className="px-1 text-[13px] font-normal tracking-[-0.011em] text-[var(--neo-gray)]">
              Conta
            </h2>
            <Group>
              {profile.email && (
                <Row>
                  <span className="min-w-0 flex-1 truncate text-[17px] tracking-[-0.011em] text-[var(--neo-ink)]">
                    {profile.email}
                  </span>
                </Row>
              )}
              {profile.phone && (
                <Row>
                  <span className="min-w-0 flex-1 truncate text-[17px] tracking-[-0.011em] text-[var(--neo-ink)]">
                    {profile.phone}
                  </span>
                </Row>
              )}
              <Row onClick={startProfileEditing}>
                <span className="min-w-0 flex-1 text-[17px] tracking-[-0.011em] text-[var(--neo-ink)]">
                  Nome, RA e faculdade
                </span>
                <ChevronRight size={16} className="shrink-0 text-[#C6C6C8]" />
              </Row>
              <Row href="/termos">
                <span className="min-w-0 flex-1 text-[17px] tracking-[-0.011em] text-[var(--neo-ink)]">
                  Termos
                </span>
                <ChevronRight size={16} className="shrink-0 text-[#C6C6C8]" />
              </Row>
              <Row href="/privacidade">
                <span className="min-w-0 flex-1 text-[17px] tracking-[-0.011em] text-[var(--neo-ink)]">
                  Privacidade
                </span>
                <ChevronRight size={16} className="shrink-0 text-[#C6C6C8]" />
              </Row>
              {user?.role?.toUpperCase() === 'ADMIN' && (
                <Row onClick={() => setActiveTab('admin')}>
                  <UserCog size={18} className="shrink-0 text-[var(--neo-gray)]" />
                  <span className="min-w-0 flex-1 text-[17px] tracking-[-0.011em] text-[var(--neo-ink)]">
                    Acessos
                  </span>
                  <ChevronRight size={16} className="shrink-0 text-[#C6C6C8]" />
                </Row>
              )}
            </Group>
          </section>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 py-4 text-[15px] tracking-[-0.011em] text-[var(--neo-gray)]"
          >
            <LogOut size={16} />
            Sair
          </button>
        </>
      )}
    </div>
  );
}
