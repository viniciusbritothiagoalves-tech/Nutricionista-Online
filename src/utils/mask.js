export const maskWhatsApp = (value) => {
  if (!value) return "";
  
  let v = value.replace(/\D/g, "");
  
  // Se começar com 55 e tiver mais de 11 dígitos, remove o 55 (código do país)
  if (v.startsWith("55") && v.length > 11) {
    v = v.substring(2);
  }
  
  if (v.length > 11) {
    v = v.substring(0, 11);
  }
  
  if (v.length <= 2) {
    v = v.replace(/^(\d{0,2})/, "($1");
  } else if (v.length <= 6) {
    v = v.replace(/^(\d{2})(\d{0,4})/, "($1) $2");
  } else if (v.length <= 10) {
    v = v.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  } else {
    v = v.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  }
  
  return v;
};

export const validateWhatsApp = (value) => {
  if (!value) return false;
  
  const v = value.replace(/\D/g, "");
  
  // Deve ter exatamente 11 dígitos
  if (v.length !== 11) return false;
  
  // Validação de DDD (maior que 10 e bloqueio veemente do DDD 55 que os usuários confundem com +55)
  const ddd = parseInt(v.substring(0, 2), 10);
  if (ddd <= 10 || ddd === 55) return false;
  
  // Rejeitar números sequenciais (ex: 11111111111, 99999999999)
  if (/^(\d)\1+$/.test(v)) return false;
  
  return true;
};
