import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, set, get, update, remove } from 'firebase/database';
import { CONFIG } from '../config';

const app = initializeApp(CONFIG.firebase);
export const database = getDatabase(app);

export const saveLead = async (leadData) => {
  const leadsRef = ref(database, 'leads');
  const newLeadRef = push(leadsRef);
  await set(newLeadRef, {
    ...leadData,
    timestamp: new Date().toISOString(),
    status: leadData.status || 'novo',
    exportado: false,
    exportacoes: []
  });
  return newLeadRef.key;
};

export const getLeads = async () => {
  const leadsRef = ref(database, 'leads');
  const snapshot = await get(leadsRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }
  return [];
};

export const updateLead = async (id, data) => {
  const leadRef = ref(database, `leads/${id}`);
  await update(leadRef, data);
};

export const deleteLead = async (id) => {
  const leadRef = ref(database, `leads/${id}`);
  // Soft delete: adiciona a data de exclusão
  await update(leadRef, { deletedAt: new Date().toISOString() });
};

export const restoreLead = async (id) => {
  const leadRef = ref(database, `leads/${id}`);
  await update(leadRef, { deletedAt: null });
};

export const hardDeleteLead = async (id) => {
  const leadRef = ref(database, `leads/${id}`);
  await remove(leadRef);
};

export const checkWhatsAppBlocked = async (whatsapp) => {
  const dbRef = ref(database, 'leads');
  const snapshot = await get(dbRef);
  if (snapshot.exists()) {
    const leads = snapshot.val();
    for (const key in leads) {
      const lead = leads[key];
      if (lead.whatsapp === whatsapp && !lead.deletedAt && !lead.liberado) {
        const tentativas = (lead.tentativas_bloqueadas || 0) + 1;
        await update(ref(database, `leads/${key}`), { tentativas_bloqueadas: tentativas });
        return true; 
      }
    }
  }
  return false;
};

export const liberarLead = async (id) => {
  const leadRef = ref(database, `leads/${id}`);
  await update(leadRef, { liberado: true });
};

export const checkDeviceLiberado = async (deviceId) => {
  if (!deviceId) return false;
  const dbRef = ref(database, 'leads');
  const snapshot = await get(dbRef);
  if (snapshot.exists()) {
    const leads = snapshot.val();
    for (const key in leads) {
      if (leads[key].deviceId === deviceId && leads[key].liberado) {
        return true;
      }
    }
  }
  return false;
};
