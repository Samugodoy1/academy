import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SystemThemeProvider } from './theme/systemTheme';
import { AcademyNeoProvider } from './theme/AcademyNeoProvider';
import { AcademyNavProvider } from './theme/AcademyNavProvider';
import './index.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
    <ErrorBoundary fallbackTitle="OdontoHub Academy encontrou um problema">
      <SystemThemeProvider>
        <AcademyNeoProvider>
          <AcademyNavProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </AcademyNavProvider>
        </AcademyNeoProvider>
      </SystemThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
);
