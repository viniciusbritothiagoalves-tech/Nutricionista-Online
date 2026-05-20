export const CONFIG = {
  // Firebase (Substitua pelas credenciais do seu projeto)
  firebase: {
    apiKey: "AIzaSyBK7-Oy21rX0Rhpa1bjdfo70EIIxq9vFmw",
    authDomain: "nutricionista-online-bb185.firebaseapp.com",
    projectId: "nutricionista-online-bb185",
    storageBucket: "nutricionista-online-bb185.firebasestorage.app",
    messagingSenderId: "673772976181",
    appId: "1:673772976181:web:10f0516146e73cdc52597c",
    databaseURL: "https://nutricionista-online-bb185-default-rtdb.firebaseio.com"
  },

  // Google Ads
  googleAds: {
    enabled: true,                   // Mude para true quando for rodar os anúncios reais
    gtagId: "AW-18082117538",           // ID da conta
    conversionLabel: "2AaiCNztyK8cEKLvnK5D"    // Nova label da conversão "Lead Qualificado - Nutricionista Online"
  },

  // Google Analytics 4
  analytics: {
    measurementId: "G-VMMJPKD1EL" // Tag GA4 do cliente (extraída do print)
  },

  // Admin (Acesso ao painel)
  admin: {
    usuario: "admin",
    senha: "admin" // Sugiro alterar para algo mais seguro
  },

  // Qualificação
  scoreMinimo: 7,

  // Plataforma
  plataforma: {
    nome: "Nutricionista Online",
    cidade: "Brasil",
    prazoContato: "24 horas úteis"
  }
};
