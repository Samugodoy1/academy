import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SystemThemeProvider } from './theme/systemTheme';
import { AcademyNeoProvider } from './theme/AcademyNeoProvider';
import { AcademyWidgetsProvider } from './theme/AcademyWidgetsProvider';
import { AcademyNavProvider } from './theme/AcademyNavProvider';
import { AcademyStageProvider } from './theme/AcademyStageProvider';
import './index.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
    <ErrorBoundary fallbackTitle="OdontoHub Academy encontrou um problema">
      <SystemThemeProvider>
        <AcademyNeoProvider>
          <AcademyWidgetsProvider>
            <AcademyNavProvider>
              <AcademyStageProvider>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </AcademyStageProvider>
            </AcademyNavProvider>
          </AcademyWidgetsProvider>
        </AcademyNeoProvider>
      </SystemThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
);
