import { CONFIG } from '../config';

/**
 * Envia um evento customizado para o Google Analytics 4
 * @param {string} eventName Nome da ação (ex: 'click_btn_whatsapp', 'form_step_1')
 * @param {object} params Dados adicionais que você quer mandar (ex: { passo: 1, plano: 'alto_valor' })
 */
export const trackEvent = (eventName, params = {}) => {
  if (!CONFIG.googleAds.enabled) {
    console.log(`[Analytics Teste] Evento rastreado: ${eventName}`, params);
    return;
  }

  if (typeof window !== 'undefined' && window.gtag) {
    // Evita disparar em localhost para não sujar os dados da conta oficial
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log(`[Analytics Local] Evento rastreado: ${eventName}`, params);
      return;
    }

    window.gtag('event', eventName, params);
  } else {
    console.warn("Analytics (gtag) não está inicializado.");
  }
};
