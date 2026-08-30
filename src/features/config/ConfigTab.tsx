import React from 'react';
import { Link } from 'react-router-dom';
import {
  UserCircle,
  Camera,
  Pencil,
  Shield,
  Activity,
  FileText,
  Mail,
  Phone,
  Building2,
  MapPin,
  CheckCircle2,
  ChevronRight,
  UserCog,
  LogOut,
} from '../../icons';
import { SubscriptionManagement } from '../../components/SubscriptionManagement';
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

export function ConfigTab({
  user,
  profile,
  profileDraft,
  isProfileEditing,
  profilePassword,
  isSavingProfile,
  apiFetch,
  getCurrentProduct,
  getProductAccess,
  handlePhotoUpload,
  startProfileEditing,
  handleSaveProfile,
  updateProfileDraft,
  setIsProfileEditing,
  setProfileDraft,
  setProfilePassword,
  fetchProfile,
  setShowAcademyUpgradeModal,
  setActiveTab,
  handleLogout,
}: ConfigTabProps) {
  const currentProduct = getCurrentProduct();
  const currentPlan = (getProductAccess(currentProduct)?.plan || 'free') as ProductPlan;

  return (
    <div className="page-shell space-y-6 tablet-l:max-w-3xl">

      {/* ── PROFILE HEADER ── */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-24 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
        <div className="px-8 pb-8 -mt-14">
          <div className="flex items-end gap-5">
            <div className="relative group shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100 flex items-center justify-center text-slate-400">
                {profile.photo_url ? (
                  <img src={profile.photo_url} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <UserCircle size={64} />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-lg cursor-pointer hover:opacity-90 transition-all">
                <Camera size={14} />
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
              </label>
            </div>
            <div className="pb-1 min-w-0">
              <h2 className="text-xl font-bold text-slate-900 truncate">{profile.name}</h2>
              {currentProduct === 'academy' ? (
                <>
                  <p className="text-sm text-primary font-medium">Perfil acadêmico</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {profile.student_registration ? `Matrícula / RA ${profile.student_registration}` : 'Matrícula / RA não informado'}
                  </p>
                </>
              ) : user.role === 'DENTIST' && profile.specialty && (
                <p className="text-sm text-primary font-medium">{profile.specialty}</p>
              )}
              {currentProduct !== 'academy' && user.role === 'DENTIST' && profile.cro && (
                <p className="text-xs text-slate-400 mt-0.5">CRO {profile.cro}</p>
              )}
            </div>
          </div>

          {!isProfileEditing && (
            <button
              onClick={startProfileEditing}
              className="mt-5 flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              <Pencil size={14} />
              Editar perfil
            </button>
          )}
        </div>
      </div>

      {/* ── VIEW MODE ── */}
      {!isProfileEditing && (
        <>
          {/* Profile Section */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{currentProduct === 'academy' ? 'Perfil acadêmico' : 'Perfil'}</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <UserCircle size={16} className="text-slate-300 shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-400">Nome</p>
                  <p className="text-sm text-slate-800 font-medium">{profile.name || 'Não informado'}</p>
                </div>
              </div>
              {currentProduct === 'academy' && (
                <>
                  <div className="flex items-center gap-3">
                    <Shield size={16} className="text-slate-300 shrink-0" />
                    <div>
                      <p className="text-[11px] text-slate-400">Matrícula / RA</p>
                      <p className="text-sm text-slate-800 font-medium">{profile.student_registration || 'Não informado'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Activity size={16} className="text-slate-300 shrink-0" />
                    <div>
                      <p className="text-[11px] text-slate-400">Período ou semestre</p>
                      <p className="text-sm text-slate-800 font-medium">{profile.academic_period || 'Não informado'}</p>
                    </div>
                  </div>
                </>
              )}
              {currentProduct !== 'academy' && user.role === 'DENTIST' && (
                <>
                  <div className="flex items-center gap-3">
                    <Shield size={16} className="text-slate-300 shrink-0" />
                    <div>
                      <p className="text-[11px] text-slate-400">CRO</p>
                      <p className="text-sm text-slate-800 font-medium">{profile.cro || '—'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Activity size={16} className="text-slate-300 shrink-0" />
                    <div>
                      <p className="text-[11px] text-slate-400">Especialidade</p>
                      <p className="text-sm text-slate-800 font-medium">{profile.specialty || '—'}</p>
                    </div>
                  </div>
                </>
              )}
              {currentProduct !== 'academy' && user.role === 'DENTIST' && profile.bio && (
                <div className="flex items-start gap-3 pt-1">
                  <FileText size={16} className="text-slate-300 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] text-slate-400">Bio</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{profile.bio}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-slate-300 shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-400">E-mail</p>
                  <p className="text-sm text-slate-800 font-medium">{profile.email || 'Não informado'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-slate-300 shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-400">Telefone</p>
                  <p className="text-sm text-slate-800 font-medium">{profile.phone || 'Não informado'}</p>
                </div>
              </div>
            </div>
          </div>

          {currentProduct === 'academy' && (
            <>
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Informações da faculdade</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Building2 size={16} className="text-slate-300 shrink-0" />
                    <div>
                      <p className="text-[11px] text-slate-400">Faculdade / Instituição</p>
                      <p className="text-sm text-slate-800 font-medium">{profile.institution || 'Não informado'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-slate-300 shrink-0" />
                    <div>
                      <p className="text-[11px] text-slate-400">Clínica ou disciplina atual</p>
                      <p className="text-sm text-slate-800 font-medium">{profile.current_discipline || 'Não informado'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Acesso Academy</h3>
                <div className="space-y-3">
                  {(() => {
                    const academyAccess = profile.product_accesses?.find(access => access.product === 'academy');
                    const academyPlan = academyAccess?.plan || 'free';
                    const isFreeAcademy = academyPlan === 'free';
                    const planLabel = isFreeAcademy ? 'Free' : 'Academy Student';
                    return (
                      <>
                        <div className="flex items-center gap-3">
                          <Shield size={16} className="text-slate-300 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] text-slate-400">Plano Academy</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm text-slate-800 font-medium">{planLabel}</p>
                              {isFreeAcademy ? (
                                <button
                                  type="button"
                                  onClick={() => setShowAcademyUpgradeModal(true)}
                                  className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold hover:bg-primary/15 transition-colors"
                                >
                                  Mudar para Student
                                </button>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
                                  Plano Student
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle2 size={16} className="text-slate-300 shrink-0" />
                          <div>
                            <p className="text-[11px] text-slate-400">Status do acesso</p>
                            <p className="text-sm text-slate-800 font-medium">{academyAccess?.approval_status || 'Não informado'}</p>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </>
          )}

          {/* Clinic Section (dentist only) */}
          {currentProduct !== 'academy' && user.role === 'DENTIST' && (profile.clinic_name || profile.clinic_address) && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Clínica</h3>
              <div className="space-y-3">
                {profile.clinic_name && (
                  <div className="flex items-center gap-3">
                    <Building2 size={16} className="text-slate-300 shrink-0" />
                    <div>
                      <p className="text-[11px] text-slate-400">Nome</p>
                      <p className="text-sm text-slate-800 font-medium">{profile.clinic_name}</p>
                    </div>
                  </div>
                )}
                {profile.clinic_address && (
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-slate-300 shrink-0" />
                    <div>
                      <p className="text-[11px] text-slate-400">Endereço</p>
                      <p className="text-sm text-slate-800 font-medium">{profile.clinic_address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── EDIT MODE ── */}
      {isProfileEditing && profileDraft && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Profile Fields */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{currentProduct === 'academy' ? 'Dados do aluno' : 'Perfil'}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[11px] text-slate-400 mb-1.5 block">Nome Completo</label>
                <input required type="text" value={profileDraft.name}
                  onChange={(e) => updateProfileDraft({ name: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-base" />
              </div>
              {currentProduct === 'academy' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] text-slate-400 mb-1.5 block">Matrícula / RA</label>
                    <input type="text" value={profileDraft.student_registration || ''}
                      onChange={(e) => updateProfileDraft({ student_registration: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-base"
                      placeholder="Não informado" />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 mb-1.5 block">Período ou semestre</label>
                    <input type="text" value={profileDraft.academic_period || ''}
                      onChange={(e) => updateProfileDraft({ academic_period: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-base"
                      placeholder="Não informado" />
                  </div>
                </div>
              )}
              {currentProduct !== 'academy' && user.role === 'DENTIST' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] text-slate-400 mb-1.5 block">CRO</label>
                      <input type="text" value={profileDraft.cro || ''}
                        onChange={(e) => updateProfileDraft({ cro: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-base"
                        placeholder="12345-SP" />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 mb-1.5 block">Especialidade</label>
                      <input type="text" value={profileDraft.specialty || ''}
                        onChange={(e) => updateProfileDraft({ specialty: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-base"
                        placeholder="Ortodontia" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 mb-1.5 block">Bio / Descrição Profissional</label>
                    <textarea rows={3} value={profileDraft.bio || ''}
                      onChange={(e) => updateProfileDraft({ bio: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-base resize-none"
                      placeholder="Conte um pouco sobre sua trajetória..." />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Contact Fields */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contato</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[11px] text-slate-400 mb-1.5 block">E-mail</label>
                <input required type="email" value={profileDraft.email}
                  onChange={(e) => updateProfileDraft({ email: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-base" />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 mb-1.5 block">Telefone</label>
                <input type="tel" inputMode="tel" value={profileDraft.phone || ''}
                  onChange={(e) => updateProfileDraft({ phone: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-base"
                  placeholder="(00) 00000-0000" />
              </div>
            </div>
          </div>

          {currentProduct === 'academy' && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Informações da faculdade</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] text-slate-400 mb-1.5 block">Faculdade / Instituição</label>
                  <input type="text" value={profileDraft.institution || ''}
                    onChange={(e) => updateProfileDraft({ institution: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-base"
                    placeholder="Não informado" />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 mb-1.5 block">Clínica ou disciplina atual</label>
                  <input type="text" value={profileDraft.current_discipline || ''}
                    onChange={(e) => updateProfileDraft({ current_discipline: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-base"
                    placeholder="Não informado" />
                </div>
              </div>
            </div>
          )}

          {/* Clinic Fields (dentist only) */}
          {currentProduct !== 'academy' && user.role === 'DENTIST' && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Clínica</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] text-slate-400 mb-1.5 block">Nome da Clínica</label>
                  <input type="text" value={profileDraft.clinic_name || ''}
                    onChange={(e) => updateProfileDraft({ clinic_name: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-base"
                    placeholder="Clínica Sorriso Perfeito" />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 mb-1.5 block">Endereço</label>
                  <input type="text" value={profileDraft.clinic_address || ''}
                    onChange={(e) => updateProfileDraft({ clinic_address: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-base"
                    placeholder="Rua Exemplo, 123 - Centro" />
                </div>
              </div>
            </div>
          )}

          {/* Password */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Segurança</h3>
            <div>
              <label className="text-[11px] text-slate-400 mb-1.5 block">Nova Senha</label>
              <input type="password" value={profilePassword}
                onChange={(e) => setProfilePassword(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-base"
                placeholder="Deixe em branco para manter a atual" />
            </div>
          </div>

          {/* Save / Cancel */}
          <div className="flex items-center gap-3 justify-end">
            <button
              type="button"
              onClick={() => { setIsProfileEditing(false); setProfileDraft(profile); setProfilePassword(''); fetchProfile(); }}
              className="px-6 py-3 rounded-2xl font-semibold text-sm text-slate-500 hover:bg-slate-100 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSavingProfile}
              className="bg-primary text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-[0_8px_24px_rgba(139,92,246,0.15)] hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSavingProfile ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </form>
      )}

      {/* ── SUBSCRIPTION ── */}
      <SubscriptionManagement
        apiFetch={apiFetch}
        product={currentProduct}
        currentPlan={currentPlan}
      />

      {/* ── LEGAL (minimal) ── */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Legal</h3>
          {profile.accepted_terms_at && (
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <CheckCircle2 size={12} className="text-primary" />
              Aceito em {new Date(profile.accepted_terms_at).toLocaleDateString('pt-BR')}
            </span>
          )}
        </div>
        <div className="flex gap-3">
          <Link to="/termos" target="_blank"
            className="flex-1 p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between group hover:border-primary/20 transition-all">
            <span className="text-xs font-semibold text-slate-600">Termos de Uso</span>
            <ChevronRight className="text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" size={14} />
          </Link>
          <Link to="/privacidade" target="_blank"
            className="flex-1 p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between group hover:border-primary/20 transition-all">
            <span className="text-xs font-semibold text-slate-600">Privacidade</span>
            <ChevronRight className="text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" size={14} />
          </Link>
        </div>
      </div>

      {/* ── ADMIN ── */}
      {user?.role?.toUpperCase() === 'ADMIN' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Administração</h3>
          <button
            onClick={() => setActiveTab('admin')}
            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between group hover:border-primary/20 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <UserCog size={16} className="text-slate-400" />
              <span className="text-xs font-semibold text-slate-600">Gerenciar acessos</span>
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" size={14} />
          </button>
        </div>
      )}

      {/* ── LOGOUT (subdued) ── */}
      <button
        onClick={handleLogout}
        className="w-full p-4 rounded-2xl flex items-center justify-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-100/60 transition-all"
      >
        <LogOut size={16} />
        Sair da conta
      </button>

      <div className="h-4" />
    </div>
  );
}
