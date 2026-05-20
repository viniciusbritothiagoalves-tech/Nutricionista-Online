import React from 'react';
import { Users, UserCheck, Download, Star } from 'lucide-react';
import { subDays, isAfter } from 'date-fns';

export const Dashboard = ({ leads }) => {
  const qualificados = leads.length;
  const novos = leads.filter(l => l.status === 'novo').length;
  const exportados = leads.filter(l => l.exportado).length;
  const scoreMedio = leads.length > 0 ? (leads.reduce((acc, l) => acc + l.score, 0) / leads.length).toFixed(1) : 0;

  const last7DaysDate = subDays(new Date(), 7);
  const leadsRecentes = leads.filter(l => isAfter(new Date(l.timestamp), last7DaysDate)).length;

  const cards = [
    { label: 'Leads Qualificados', value: qualificados, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Leads Novos', value: novos, icon: UserCheck, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Leads Exportados', value: exportados, icon: Download, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Score Médio', value: scoreMedio, icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-serif font-bold text-slate-800 mb-6">Visão Geral</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
            <div className={`${card.bg} ${card.color} p-4 rounded-xl mr-4`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{card.label}</p>
              <h3 className="text-2xl font-bold text-slate-800">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Métricas Recentes</h3>
        <p className="text-slate-600">
          Você capturou <strong className="text-primary">{leadsRecentes} leads</strong> nos últimos 7 dias.
        </p>
      </div>
    </div>
  );
};
