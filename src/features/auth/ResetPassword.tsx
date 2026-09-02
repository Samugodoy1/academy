import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, CheckCircle2, Lock } from '../../icons';
import { API_URL } from '../../config';

export function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setMessage(data.message);
        setTimeout(() => navigate('/'), 3000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="oh-device p-8 text-center max-w-md">
          <AlertTriangle className="mx-auto text-apple-red mb-4" size={40} />
          <h1 className="text-[28px] font-semibold tracking-[-0.025em] leading-[1.05] mb-2 text-white">Link inválido</h1>
          <p className="text-[#86868b] mb-6 text-[17px]">Este link de recuperação expirou ou não é válido.</p>
          <Link to="/" className="apple-btn inline-block">
            Voltar para o login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="oh-device w-full max-w-md overflow-hidden"
      >
        <div className="p-8 md:p-12">
          <div className="flex justify-center mb-8">
            <div className="w-14 h-14 bg-apple-ink rounded-full flex items-center justify-center text-white">
              <Lock size={26} strokeWidth={1.8} />
            </div>
          </div>
          <div className="text-center mb-10">
            <h1 className="text-[34px] font-semibold text-white tracking-[-0.025em] leading-[1.05] mb-2">Nova senha</h1>
            <p className="text-apple-gray text-[17px]">Crie uma senha para a conta.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[13px] text-apple-gray mb-2 block">Nova senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray" size={18} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ios-input w-full pl-12"
                />
              </div>
            </div>

            <div>
              <label className="text-[13px] text-apple-gray mb-2 block">Confirmar senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray" size={18} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="ios-input w-full pl-12"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-apple-surface rounded-[16px] flex items-center gap-3 text-apple-red text-[15px]">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            {message && (
              <div className="p-4 bg-apple-surface rounded-[16px] flex items-center gap-3 text-apple-ink text-[15px]">
                <CheckCircle2 size={18} className="text-apple-green" />
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || success}
              className="apple-btn w-full disabled:opacity-50"
            >
              {loading ? 'Processando...' : 'Redefinir senha'}
            </button>
          </form>

          {success && (
            <div className="mt-6 text-center text-[15px] text-apple-gray">
              Redirecionando para o login.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
