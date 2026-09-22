/** Prompts do passo Explique — tom de colega na bancada, não redação genérica. */
export const EXPLAIN_BY_LESSON: Record<
  string,
  { prompt: string; mustInclude: string[]; model: string }
> = {
  'ad-notacao': {
    prompt: 'Explique para a paciente por que você anota “36 MOD” em vez de “primeiro molar embaixo”.',
    mustInclude: ['quadrante', 'posição', 'face'],
    model:
      'O primeiro número diz em qual quadrante o dente está; o segundo, a posição a partir da linha média. MOD nomeia as faces envolvidas — mesial, oclusal e distal — para qualquer colega achar a lesão sem adivinhar.',
  },
  'bf-desmineralizacao': {
    prompt: 'Explique em três frases por que chupar bala o tempo todo machuca o esmalte.',
    mustInclude: ['pH', 'ácido', 'tempo'],
    model:
      'Bactérias no biofilme transformam açúcar em ácido e o pH cai. Abaixo de cerca de 5,5 o esmalte perde mineral. Quanto mais tempo o pH fica crítico, mais fundo vai a desmineralização.',
  },
  'fa-anestesicos': {
    prompt: 'Explique para um colega como você calcula quantos tubetes de lidocaína 2% cabem neste paciente.',
    mustInclude: ['mg/kg', 'peso', 'tubete'],
    model:
      'Multiplico o peso pela dose máxima em mg/kg, divido pelos miligramas por tubete e nunca ultrapasso o teto do protocolo da faculdade. Vasoconstrictor entra na conta quando a ficha pede.',
  },
  'br-radioprotecao': {
    prompt: 'Explique por que você dobra a distância da fonte se quiser reduzir a dose pela metade.',
    mustInclude: ['distância', 'dose', 'proteção'],
    model:
      'A dose cai com o quadrado da distância: afastar a fonte reduz muito a exposição. Colimação e tempo também entram — não é só avental e distância, mas distância é o truque que mais impressiona na prova.',
  },
};
