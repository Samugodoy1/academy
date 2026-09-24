import { describe, expect, it } from 'vitest';
import { FREE_TENSION, STUDENT_PRIDE, UPGRADE_MOMENT } from './conversionCopy';

describe('conversionCopy', () => {
  it('coloca a falta no próximo paciente, não numa lista genérica', () => {
    expect(UPGRADE_MOMENT.cases.headline).toMatch(/próximo paciente/i);
    expect(UPGRADE_MOMENT.cases.dismiss).toMatch(/fora/i);
    expect(UPGRADE_MOMENT.box.body).toMatch(/memória|cadeira/i);
  });

  it('faz o Student ouvir posse, não um anúncio', () => {
    expect(STUDENT_PRIDE.owned.join(' ')).toMatch(/Seus casos/);
    expect(STUDENT_PRIDE.owned.join(' ')).toMatch(/Seu Modo Box/);
    expect(STUDENT_PRIDE.checkoutBody).toMatch(/Você é Student/);
    expect(FREE_TENSION.subscribeCta).toMatch(/Student/);
  });
});
