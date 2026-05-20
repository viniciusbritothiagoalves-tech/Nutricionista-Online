import { CONFIG } from '../config';

export const fireGoogleAdsConversion = (isQualified = false) => {
  if (!isQualified) {
    console.log("Teste/Desqualificado: Disparo do Google Ads bloqueado garantidamente.");
    return;
  }
  
  if (!CONFIG.googleAds.enabled) {
    console.log("Teste: Disparo do Google Ads bloqueado por segurança (enabled: false no config.js).");
    return;
  }
  
  if (typeof window !== 'undefined' && window.gtag) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log("Teste local: Conversão do Google Ads ignorada (localhost).");
      return;
    }
    window.gtag('event', 'conversion', {
      'send_to': `${CONFIG.googleAds.gtagId}/${CONFIG.googleAds.conversionLabel}`
    });
    console.log("Google Ads conversion event fired!");
  } else {
    console.warn("Google Ads (gtag) is not initialized or not found.");
  }
};
