import React from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  ChevronRight,
  LogOut,
  UserCircle,
  UserCog,
} from '../../icons';
import { SubscriptionManagement } from '../../components/SubscriptionManagement';
import { SystemThemePicker } from '../../components/SystemThemePicker';
import { AcademyAccount } from './AcademyAccount';
import type { CurrentUser, Dentist, Product, ProductAccess, ProductPlan } from '../../types/clinical';

type AppTabId =
  | 'dashboard'
  | 'agenda'
  | 'pacientes'
  | 'estudos'
  | 'financeiro'
  | 'documentos'
  | 'prontuario'
  | 'configuracoes'
  | 'admin'
  | 'portal'
  | 'inteligencia'
  | 'academy';

type ApiFetch = (url: string, options?: RequestInit & { product?: string }) => Promise<Response>;

export interface ConfigTabProps {
  user: CurrentUser;
  profile: Dentist;
  profileDraft: Dentist | null;
  isProfileEditing: boolean;
  profilePassword: string;
  isSavingProfile: boolean;
  apiFetch: ApiFetch;
  getCurrentProduct: () => Product;
  getProductAccess: (product: Product) => ProductAccess | undefined;
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void | Promise<void>;
  startProfileEditing: () => void;
  handleSaveProfile: (e: React.FormEvent) => void | Promise<void>;
  updateProfileDraft: (patch: Partial<Dentist>) => void;
  setIsProfileEditing: (value: boolean) => void;
  setProfileDraft: React.Dispatch<React.SetStateAction<Dentist | null>>;
  setProfilePassword: (value: string) => void;
  fetchProfile: () => void | Promise<void>;
  setShowAcademyUpgradeModal: (value: boolean) => void;
  setActiveTab: (tab: AppTabId) => void;
  handleLogout: () => void;
}

export function ConfigTab(props: ConfigTabProps) {
  const currentProduct = props.getCurrentProduct();
  const currentPlan = (props.getProductAccess(currentProduct)?.plan || 'free') as ProductPlan;

  if (currentProduct === 'academy') {
    return (
      <AcademyAccount
        user={props.user}
        profile={props.profile}
        profileDraft={props.profileDraft}
        isProfileEditing={props.isProfileEditing}
        profilePassword={props.profilePassword}
        isSavingProfile={props.isSavingProfile}
        apiFetch={props.apiFetch}
        handlePhotoUpload={props.handlePhotoUpload}
        startProfileEditing={props.startProfileEditing}
        handleSaveProfile={props.handleSaveProfile}
        updateProfileDraft={props.updateProfileDraft}
        setIsProfileEditing={props.setIsProfileEditing}
        setProfileDraft={props.setProfileDraft}
        setProfilePassword={props.setProfilePassword}
        fetchProfile={props.fetchProfile}
        setActiveTab={props.setActiveTab}
        handleLogout={props.handleLogout}
        currentPlan={currentPlan}
      />
    );
  }

  return <ProAccount {...props} currentPlan={currentPlan} />;
}

function ProAccount({
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
}: ConfigTabProps & { currentPlan: ProductPlan }) {
  const cancelEdit = () => {
    setIsProfileEditing(false);
    setProfileDraft(profile);
    setProfilePassword('');
    fetchProfile();
  };

  return (
    <div className="page-shell space-y-8 tablet-l:max-w-3xl">
      <header className="flex flex-col items-center text-center">
        <label className="relative cursor-pointer">
          <span className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-sys-inset text-sys-text">
            {profile.photo_url ? (
              <img src={profile.photo_url} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <UserCircle size={64} />
            )}
          </span>
          <span className="absolute bottom-0 right-0 rounded-full bg-apple-blue p-1.5 text-white">
            <Camera size={14} />
          </span>
          <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
        </label>
        <h1 className="mt-5 text-[28px] font-semibold tracking-[-0.025em] text-sys-text">{profile.name}</h1>
        {user.role === 'DENTIST' && (profile.specialty || profile.cro) && (
          <p className="mt-1 text-[15px] text-sys-muted">
            {[profile.specialty, profile.cro ? `CRO ${profile.cro}` : ''].filter(Boolean).join(' · ')}
          </p>
        )}
        {!isProfileEditing && (
          <button type="button" onClick={startProfileEditing} className="apple-link mt-3 !text-[15px]">
            Editar ›
          </button>
        )}
      </header>

      <SystemThemePicker />

      {isProfileEditing && profileDraft ? (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="oh-device p-6 space-y-4">
            <input required type="text" value={profileDraft.name} onChange={e => updateProfileDraft({ name: e.target.value })} className="ios-input w-full" placeholder="Nome" />
            {user.role === 'DENTIST' && (
              <>
                <input type="text" value={profileDraft.cro || ''} onChange={e => updateProfileDraft({ cro: e.target.value })} className="ios-input w-full" placeholder="CRO" />
                <input type="text" value={profileDraft.specialty || ''} onChange={e => updateProfileDraft({ specialty: e.target.value })} className="ios-input w-full" placeholder="Especialidade" />
                <textarea rows={3} value={profileDraft.bio || ''} onChange={e => updateProfileDraft({ bio: e.target.value })} className="ios-input w-full resize-none" placeholder="Bio" />
                <input type="text" value={profileDraft.clinic_name || ''} onChange={e => updateProfileDraft({ clinic_name: e.target.value })} className="ios-input w-full" placeholder="Clínica" />
                <input type="text" value={profileDraft.clinic_address || ''} onChange={e => updateProfileDraft({ clinic_address: e.target.value })} className="ios-input w-full" placeholder="Endereço" />
              </>
            )}
            <input required type="email" value={profileDraft.email} onChange={e => updateProfileDraft({ email: e.target.value })} className="ios-input w-full" placeholder="E-mail" />
            <input type="tel" value={profileDraft.phone || ''} onChange={e => updateProfileDraft({ phone: e.target.value })} className="ios-input w-full" placeholder="Telefone" />
            <input type="password" value={profilePassword} onChange={e => setProfilePassword(e.target.value)} className="ios-input w-full" placeholder="Nova senha" />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={cancelEdit} className="apple-btn-light !px-6">Cancelar</button>
            <button type="submit" disabled={isSavingProfile} className="apple-btn disabled:opacity-50">
              {isSavingProfile ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      ) : (
        <div className="overflow-hidden rounded-[24px] bg-sys-inset">
          {profile.email && (
            <p className="border-b border-sys-hairline px-5 py-4 text-[17px] text-sys-text">{profile.email}</p>
          )}
          {profile.phone && (
            <p className="border-b border-sys-hairline px-5 py-4 text-[17px] text-sys-text">{profile.phone}</p>
          )}
          {profile.clinic_name && (
            <p className="border-b border-sys-hairline px-5 py-4 text-[17px] text-sys-text">{profile.clinic_name}</p>
          )}
          {profile.clinic_address && (
            <p className="border-b border-sys-hairline px-5 py-4 text-[17px] text-sys-text">{profile.clinic_address}</p>
          )}
          <Link to="/termos" target="_blank" className="flex items-center justify-between border-b border-sys-hairline px-5 py-4">
            <span className="text-[17px] text-sys-text">Termos</span>
            <ChevronRight size={16} className="text-sys-muted" />
          </Link>
          <Link to="/privacidade" target="_blank" className="flex items-center justify-between px-5 py-4">
            <span className="text-[17px] text-sys-text">Privacidade</span>
            <ChevronRight size={16} className="text-sys-muted" />
          </Link>
        </div>
      )}

      <SubscriptionManagement apiFetch={apiFetch} product="odontohub" currentPlan={currentPlan} />

      {user?.role?.toUpperCase() === 'ADMIN' && (
        <button
          type="button"
          onClick={() => setActiveTab('admin')}
          className="flex w-full items-center justify-between rounded-[24px] bg-sys-inset px-5 py-4"
        >
          <span className="flex items-center gap-3 text-[17px] text-sys-text">
            <UserCog size={18} />
            Acessos
          </span>
          <ChevronRight size={16} className="text-sys-muted" />
        </button>
      )}

      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center justify-center gap-2 py-4 text-[15px] text-sys-muted"
      >
        <LogOut size={16} />
        Sair
      </button>
    </div>
  );
}
