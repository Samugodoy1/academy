import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_URL } from '../../config';

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
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-6 font-sans antialiased">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[372px]"
      >
        <motion.div
          className="mb-11"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-[26px] font-semibold text-[#0F1211] tracking-[-0.4px] leading-[1.2] mb-2.5">
            Redefinir sua senha
          </h1>
          <p className="text-[15px] text-[#8B918E] leading-relaxed">
            Informe seu e-mail para receber as instruções de acesso.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[13px] font-medium text-[#4B5250] mb-2">E-mail</label>
            <input
              type="email"
              required
              placeholder="voce@clinica.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[48px] px-4 bg-white border border-[#DFE3E1] rounded-[12px] text-base text-[#0F1211] placeholder-[#C0C7C3] outline-none transition-[border-color,box-shadow,background-color] duration-200 ease-out focus:border-[#2E6B53] focus:bg-[#FBFEFC] focus:shadow-[0_0_0_4px_rgba(46,107,83,0.08),0_1px_2px_rgba(0,0,0,0.04)]"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="text-[13px] text-red-400"
            >
              {error}
            </motion.p>
          )}

          {message && (
            <motion.p
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="text-[13px] text-[#2E6B53]"
            >
              {message}
            </motion.p>
          )}

          <div className="pt-3">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.005 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25, mass: 0.8 }}
              className="w-full h-[48px] bg-academy-primary hover:bg-academy-primary disabled:hover:bg-academy-primary text-white text-[15px] font-medium rounded-[12px] shadow-[0_1px_3px_rgba(139,92,246,0.1),0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_3px_8px_rgba(139,92,246,0.14),0_1px_2px_rgba(0,0,0,0.04)] disabled:opacity-50 disabled:cursor-not-allowed transition-[background-color,box-shadow,opacity] duration-[160ms] ease-in-out"
              style={{ willChange: 'transform' }}
            >
              {loading ? 'Enviando...' : 'Enviar instruções'}
            </motion.button>
            <p className="text-center text-[11px] text-[#C0C7C3] mt-3.5">Ambiente seguro · Dados criptografados</p>
          </div>
        </form>

        <div className="mt-14 space-y-6">
          <div className="text-center">
            <Link to="/" className="text-[13px] text-[#8B918E] hover:text-[#4B5250] transition-colors duration-200">
              Voltar para o login
            </Link>
          </div>

          <div className="flex justify-center items-center gap-3 text-[11px] text-[#C0C7C3]">
            <Link to="/termos" className="hover:text-[#8B918E] transition-colors duration-200">Termos</Link>
            <span>·</span>
            <Link to="/privacidade" className="hover:text-[#8B918E] transition-colors duration-200">Privacidade</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
