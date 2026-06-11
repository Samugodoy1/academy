/**
 * Configuracao central da API.
 *
 * Em producao, VITE_API_URL deve apontar para a API central:
 *   VITE_API_URL=https://api.odontohub.app.br
 *
 * Em desenvolvimento local, pode apontar para o servidor local:
 *   VITE_API_URL=http://localhost:3001
 *
 * Se nao definido, usa string vazia (proxy Vite) ou fallback em *.odontohub.app.br.
 */
function resolveApiUrl(): string {
  const fromEnv = import.meta.env.VITE_API_URL as string | undefined;
  if (fromEnv) return fromEnv.replace(/\/+$/, '');

  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host.endsWith('odontohub.app.br')) {
      return 'https://api.odontohub.app.br';
    }
  }

  return '';
}

export const API_URL = resolveApiUrl();
