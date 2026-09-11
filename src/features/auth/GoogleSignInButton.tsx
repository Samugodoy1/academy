import React, { useEffect, useRef, useState } from 'react';
import {
  googleClientId,
  loadGoogleIdentity,
  type GoogleButtonText,
} from './googleClient';

interface GoogleSignInButtonProps {
  onCredential: (credential: string) => void;
  text?: GoogleButtonText;
}

export function GoogleSignInButton({
  onCredential,
  text = 'continue_with',
}: GoogleSignInButtonProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(onCredential);
  callbackRef.current = onCredential;
  const [error, setError] = useState('');
  const clientId = googleClientId();

  useEffect(() => {
    let cancelled = false;
    loadGoogleIdentity()
      .then(() => {
        if (cancelled || !hostRef.current || !window.google?.accounts?.id) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: response => {
            if (response?.credential) callbackRef.current(response.credential);
          },
        });
        hostRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(hostRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text,
          shape: 'rectangular',
          logo_alignment: 'center',
          width: hostRef.current.offsetWidth || 320,
          locale: 'pt-BR',
        });
      })
      .catch(() => {
        if (!cancelled) setError('Não foi possível carregar o login com Google.');
      });
    return () => {
      cancelled = true;
    };
  }, [clientId, text]);

  return (
    <div className="w-full">
      <div ref={hostRef} className="flex justify-center [color-scheme:light]" />
      {error && (
        <p className="mt-2 text-center text-[12px] text-red-400">{error}</p>
      )}
    </div>
  );
}
