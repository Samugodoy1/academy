import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_URL } from '../../config';
import { AcademyMark } from '../../components/AcademyMark';
import { Siso } from '../../illustrations/Siso';
import { SpeechBubble } from '../../illustrations/SpeechBubble';
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
    <div className="min-h-screen bg-white flex items-center justify-center px-6 font-sans antialiased siso-stage">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[400px] comic-card p-8 sm:p-10"
      >
        <motion.div
          className="mb-8 flex flex-col items-center"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <Siso mood="think" size={120} />
          <div className="mt-3 flex items-center gap-2">
            <AcademyMark size={28} />
            <p className="font-display text-[13px] font-extrabold uppercase tracking-[0.16em] text-primary">
              Academy · Box do aluno
            </p>
          </div>
          <div className="mt-4 w-full">
            <SpeechBubble>
              <p className="text-[18px] leading-snug">Esqueceu a senha. Acontece — até em periodontia.</p>
              <p className="mt-1.5 text-[14px] font-bold text-[#3B0459]/75">
                Manda o e-mail da faculdade. Eu não julgo.
              </p>
            </SpeechBubble>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[13px] font-medium text-academy-muted mb-2">E-mail</label>
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
              className="text-[13px] text-academy-success-text"
            >
              {message}
            </motion.p>
          )}

          <div className="pt-3">
            <DuoButton type="submit" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar instruções'}
            </DuoButton>
            <p className="text-center text-[11px] font-bold text-academy-muted/70 mt-3.5">Ambiente da clínica-escola</p>
          </div>
        </form>

        <div className="mt-14 space-y-6">
          <div className="text-center">
            <Link to="/" className="text-[13px] text-academy-muted hover:text-academy-text transition-colors duration-200">
              Voltar para o login
            </Link>
          </div>

          <div className="flex justify-center items-center gap-3 text-[11px] text-academy-muted/60">
            <Link to="/termos" className="hover:text-academy-muted transition-colors duration-200">Termos</Link>
            <span>·</span>
            <Link to="/privacidade" className="hover:text-academy-muted transition-colors duration-200">Privacidade</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
