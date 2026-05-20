import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, Users, Target, Menu, X, Trash, UserMinus } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { Dashboard } from './Dashboard';
import { LeadsTable } from './LeadsTable';
import { getLeads, hardDeleteLead } from '../../services/firebase';

export const AdminLayout = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await getLeads();
      
      const now = new Date();
      let cleanedData = [];
      
      for (const lead of data) {
        if (lead.deletedAt) {
          const daysInTrash = differenceInDays(now, new Date(lead.deletedAt));
          if (daysInTrash >= 7) {
            await hardDeleteLead(lead.id);
            continue;
          }
        }
        cleanedData.push(lead);
      }
      
      setLeads(cleanedData);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/leads', label: 'Todos os Leads', icon: Users },
    { path: '/admin/leads/emagrecimento', label: 'Emagrecimento', icon: Target, filter: 'emagrecimento' },
    { path: '/admin/leads/massa', label: 'Ganho de Massa', icon: Target, filter: 'massa' },
    { path: '/admin/leads/saude', label: 'Saúde', icon: Target, filter: 'saude' },
    { path: '/admin/leads/gestacao', label: 'Gestação', icon: Target, filter: 'gestacao' },
    { path: '/admin/leads/energia', label: 'Energia', icon: Target, filter: 'energia' },
    { path: '/admin/abandonados', label: 'Abandonos', icon: UserMinus, statusFilter: 'abandonado' },
    { path: '/admin/lixeira', label: 'Lixeira (7 dias)', icon: Trash },
  ];

  const activeLeads = leads.filter(l => !l.deletedAt);
  const trashLeads = leads.filter(l => l.deletedAt);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-30 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
          <h1 className="font-serif text-xl text-primary font-bold">Nutri Admin</h1>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
        </div>
        <div className="p-4 space-y-1 overflow-y-auto" style={{ height: 'calc(100vh - 64px - 80px)' }}>
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            let count = null;
            if (item.path === '/admin/lixeira') {
              count = trashLeads.length;
            } else if (item.statusFilter) {
              count = activeLeads.filter(l => l.status === item.statusFilter).length;
            } else if (item.filter) {
              count = activeLeads.filter(l => l.objetivo === item.filter).length;
            } else if (item.path === '/admin/leads') {
              count = activeLeads.length;
            }
            return (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <div className="flex items-center">
                  <item.icon size={18} className="mr-3" />
                  <span className="text-sm">{item.label}</span>
                </div>
                {count !== null && (
                  <span className="bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full text-xs font-medium">{count}</span>
                )}
              </button>
            );
          })}
        </div>
        <div className="absolute bottom-0 w-full p-4 border-t border-slate-200 bg-white">
          <button onClick={handleLogout} className="w-full flex items-center text-red-600 px-4 py-3 hover:bg-red-50 rounded-xl transition-colors">
            <LogOut size={18} className="mr-3" />
            <span className="text-sm font-medium">Sair</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 lg:px-8 justify-between">
          <button className="lg:hidden p-2 text-slate-600" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="flex-1 text-right">
            <button onClick={fetchLeads} className="text-sm font-medium text-primary bg-primary/10 px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors">Atualizar Dados</button>
          </div>
        </header>
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full text-slate-500">Carregando dados do Firebase...</div>
          ) : (
            <Routes>
              <Route path="/" element={<Dashboard leads={activeLeads} />} />
              <Route path="/leads" element={<LeadsTable leads={activeLeads} onRefresh={fetchLeads} />} />
              <Route path="/leads/:filterObj" element={<LeadsTable leads={activeLeads} onRefresh={fetchLeads} />} />
              <Route path="/abandonados" element={<LeadsTable leads={activeLeads.filter(l => l.status === 'abandonado')} onRefresh={fetchLeads} titleOverride="Abandonos" />} />
              <Route path="/lixeira" element={<LeadsTable leads={trashLeads} onRefresh={fetchLeads} isTrash={true} titleOverride="Lixeira" />} />
            </Routes>
          )}
        </div>
      </main>
    </div>
  );
};
