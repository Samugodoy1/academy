export const GSI_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

/** Mesmo client OAuth do OdontoHub Sistema. Pode ser sobrescrito por VITE_GOOGLE_CLIENT_ID. */
export const DEFAULT_GOOGLE_CLIENT_ID =
  '223513165936-6o0tr737hdbhsrlcmgjpssc4mf4a8gqm.apps.googleusercontent.com';

export type GoogleButtonText = 'signin_with' | 'signup_with' | 'continue_with' | 'signin';

export interface GoogleCredentialResponse {
  credential?: string;
  select_by?: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: 'standard' | 'icon';
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: GoogleButtonText;
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              logo_alignment?: 'left' | 'center';
              width?: number;
              locale?: string;
            },
          ) => void;
        };
      };
    };
  }
}

export function googleClientId(): string {
  const fromEnv = import.meta.env?.VITE_GOOGLE_CLIENT_ID;
  return (typeof fromEnv === 'string' && fromEnv.trim()) || DEFAULT_GOOGLE_CLIENT_ID;
}

let gsiLoader: Promise<void> | null = null;

export function loadGoogleIdentity(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'));
  if (window.google?.accounts?.id) return Promise.resolve();
  if (gsiLoader) return gsiLoader;

  gsiLoader = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GSI_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Falha ao carregar Google Identity Services')));
      if (window.google?.accounts?.id) resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = GSI_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Falha ao carregar Google Identity Services'));
    document.head.appendChild(script);
  });

  return gsiLoader;
}
