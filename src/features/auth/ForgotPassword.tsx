import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_URL } from '../../config';
import { AcademyWordmark } from '../../components/AcademyWordmark';
import { DuoButton } from '../../components/DuoButton';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await fetch(`${API_URL}/api/auth/request-password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sys-bg flex items-center justify-center px-6 font-sans antialiased">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[400px] oh-device p-8 sm:p-10"
      >
        <AcademyWordmark />
        <h1 className="mt-8 text-[34px] font-semibold leading-[1.05] tracking-[-0.025em] text-sys-text">
          Esqueceu a senha.
        </h1>
        <p className="mt-3 text-[17px] text-sys-muted tracking-[-0.011em]">
          Envie o e-mail da faculdade.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-[13px] font-normal text-sys-muted mb-2">E-mail</label>
            <input
              type="email"
              required
              placeholder="voce@faculdade.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="ios-input w-full h-[48px]"
            />
          </div>

          {error && (
            <p className="text-[15px] text-[#ff3b30]">{error}</p>
          )}

          {message && (
            <p className="text-[15px] text-sys-text">{message}</p>
          )}

          <div className="pt-3">
            <DuoButton type="submit" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar instruções'}
            </DuoButton>
          </div>
        </form>

        <div className="mt-12 text-center">
          <Link to="/" className="apple-link">
            Voltar para o login ›
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
