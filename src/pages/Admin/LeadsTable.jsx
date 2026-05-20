import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { Search, FileText, Table, Trash2, RefreshCcw, Check } from 'lucide-react';
import { exportToPDF, exportToExcel } from '../../utils/exportUtils';
import { updateLead, deleteLead, restoreLead, hardDeleteLead, liberarLead } from '../../services/firebase';

const objMap = {
  emagrecimento: 'Emagrecimento',
  massa: 'Ganho de Massa',
  saude: 'Saúde',
  gestacao: 'Gestação',
  energia: 'Energia'
};

const objColorMap = {
  emagrecimento: 'bg-green-100 text-green-800',
  massa: 'bg-blue-100 text-blue-800',
  saude: 'bg-red-100 text-red-800',
  gestacao: 'bg-pink-100 text-pink-800',
  energia: 'bg-yellow-100 text-yellow-800'
};

const investimentoMap = {
  ate300: 'Até R$300',
  '300_500': 'R$300 - R$500',
  '500_800': 'R$500 - R$800',
  '800mais': 'Acima R$800'
};

export const LeadsTable = ({ leads, onRefresh, isTrash = false, titleOverride }) => {
  const { filterObj } = useParams();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [selectedLeads, setSelectedLeads] = useState([]);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      // Filtro de objetivo via URL
      if (filterObj && lead.objetivo !== filterObj) return false;
      
      // Filtro de busca (nome ou whats)
      const searchTerm = search.toLowerCase();
      if (search && !lead.nome.toLowerCase().includes(searchTerm) && !lead.whatsapp.includes(searchTerm)) return false;
      
      // Filtro de status
      if (statusFilter !== 'todos' && lead.status !== statusFilter) return false;

      return true;
    });
  }, [leads, filterObj, search, statusFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateLead(id, { status: newStatus });
      onRefresh();
    } catch (e) {
      console.error(e);
      alert("Erro ao atualizar status");
    }
  };

  const handleDelete = async (id) => {
    if (isTrash) {
      if (window.confirm("Atenção: Excluir da lixeira apagará o lead permanentemente. Deseja continuar?")) {
        try {
          await hardDeleteLead(id);
          onRefresh();
        } catch (e) {
          console.error(e);
          alert("Erro ao excluir permanentemente.");
        }
      }
    } else {
      if (window.confirm("Deseja mover este lead para a lixeira?")) {
        try {
          await deleteLead(id);
          onRefresh();
        } catch (e) {
          console.error(e);
          alert("Erro ao mover para a lixeira");
        }
      }
    }
  };

  const handleRestore = async (id) => {
    try {
      await restoreLead(id);
      onRefresh();
    } catch (e) {
      console.error(e);
      alert("Erro ao restaurar lead");
    }
  };

  const handleLiberar = async (id) => {
    if (window.confirm("Isso irá DESBLOQUEAR o dispositivo e o WhatsApp desta pessoa para que ela tente novamente. Deseja liberar?")) {
      try {
        await liberarLead(id);
        onRefresh();
      } catch (e) {
        console.error(e);
        alert("Erro ao liberar número");
      }
    }
  };

  const markAsExported = async (leadIds, type) => {
    for (const id of leadIds) {
      const lead = leads.find(l => l.id === id);
      const novasExportacoes = [...(lead.exportacoes || []), { tipo: type, data: new Date().toISOString() }];
      await updateLead(id, { exportado: true, exportacoes: novasExportacoes });
    }
    onRefresh();
  };

  const handleExportIndividual = async (lead, format) => {
    if (format === 'pdf') {
      exportToPDF([lead], true);
      await markAsExported([lead.id], 'pdf');
    } else {
      exportToExcel([lead]);
      await markAsExported([lead.id], 'planilha');
    }
  };

  const handleExportMass = async (format) => {
    const leadsToExport = filteredLeads.filter(l => selectedLeads.includes(l.id));
    if (leadsToExport.length === 0) return;

    if (format === 'pdf') {
      exportToPDF(leadsToExport, false);
      await markAsExported(selectedLeads, 'pdf');
    } else {
      exportToExcel(leadsToExport);
      await markAsExported(selectedLeads, 'planilha');
    }
    setSelectedLeads([]);
  };

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedLeads(filteredLeads.map(l => l.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleDeleteMass = async () => {
    if (selectedLeads.length === 0) return;
    
    const confirmMsg = isTrash 
      ? `Atenção: Excluir permanentemente ${selectedLeads.length} potenciais pacientes?` 
      : `Deseja mover ${selectedLeads.length} potenciais pacientes para a lixeira?`;

    if (window.confirm(confirmMsg)) {
      try {
        for (const id of selectedLeads) {
          if (isTrash) {
            await hardDeleteLead(id);
          } else {
            await deleteLead(id);
          }
        }
        setSelectedLeads([]);
        onRefresh();
      } catch (e) {
        console.error(e);
        alert("Erro ao excluir em massa.");
      }
    }
  };

  const toggleSelect = (id) => {
    if (selectedLeads.includes(id)) {
      setSelectedLeads(selectedLeads.filter(lId => lId !== id));
    } else {
      setSelectedLeads([...selectedLeads, id]);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-serif font-bold text-slate-800">
          {titleOverride ? titleOverride : (filterObj ? objMap[filterObj] : 'Todos os Leads')}
        </h2>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar nome ou WhatsApp..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none w-full sm:w-64 text-sm"
            />
          </div>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm bg-white"
          >
            <option value="todos">Todos os Status</option>
            <option value="novo">Novo</option>
            <option value="contatado">Contatado</option>
            <option value="convertido">Convertido</option>
            <option value="descartado">Descartado</option>
            <option value="desqualificado">Desqualificado</option>
            <option value="abandonado">Abandonado (Incompleto)</option>
          </select>
        </div>
      </div>

      {selectedLeads.length > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6 flex justify-between items-center">
          <span className="text-primary font-medium">{selectedLeads.length} selecionado(s)</span>
          <div className="flex gap-2">
            <button onClick={() => handleExportMass('pdf')} className="flex items-center text-sm bg-white text-primary px-3 py-1.5 rounded border border-primary/20 hover:bg-primary hover:text-white transition-colors">
              <FileText size={16} className="mr-2" /> PDF
            </button>
            <button onClick={() => handleExportMass('planilha')} className="flex items-center text-sm bg-white text-primary px-3 py-1.5 rounded border border-primary/20 hover:bg-primary hover:text-white transition-colors">
              <Table size={16} className="mr-2" /> Planilha
            </button>
            <button onClick={handleDeleteMass} className="flex items-center text-sm bg-white text-red-600 px-3 py-1.5 rounded border border-red-200 hover:bg-red-50 transition-colors">
              <Trash2 size={16} className="mr-2" /> {isTrash ? 'Excluir Permanentemente' : 'Excluir'}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 w-12">
                  <input type="checkbox" className="rounded text-primary focus:ring-primary" onChange={toggleSelectAll} checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0} />
                </th>
                <th className="p-4 font-medium">Nome</th>
                <th className="p-4 font-medium">WhatsApp</th>
                <th className="p-4 font-medium">Objetivo</th>
                <th className="p-4 font-medium">Investimento</th>
                <th className="p-4 font-medium">Score</th>
                <th className="p-4 font-medium">Data</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className={`hover:bg-slate-50 transition-colors ${lead.exportado ? 'bg-slate-50/50' : ''}`}>
                  <td className="p-4">
                    <input type="checkbox" className="rounded text-primary focus:ring-primary" checked={selectedLeads.includes(lead.id)} onChange={() => toggleSelect(lead.id)} />
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-slate-800">{lead.nome}</div>
                    {lead.exportado && (
                      <span className="inline-flex items-center mt-1 mr-2 text-[10px] font-semibold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded" title={`Última exportação: ${lead.exportacoes && lead.exportacoes.length > 0 ? format(new Date(lead.exportacoes[lead.exportacoes.length - 1].data), "dd/MM/yyyy HH:mm") : 'Desconhecido'}`}>
                        📤 Exportado
                      </span>
                    )}
                    {lead.lgpdAceite && (
                      <span className="inline-flex items-center mt-1 text-[10px] font-semibold text-green-700 bg-green-100 px-1.5 py-0.5 rounded">
                        ✅ LGPD
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <a href={`https://wa.me/55${lead.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium">
                      {lead.whatsapp}
                    </a>
                    {lead.tentativas_bloqueadas > 0 && (
                      <div className="mt-1">
                        <span className="inline-flex items-center text-[10px] font-semibold text-orange-700 bg-orange-100 px-1.5 py-0.5 rounded" title="Quantas vezes esse número tentou preencher o formulário novamente após o primeiro cadastro">
                          ⚠️ +{lead.tentativas_bloqueadas} tentativa(s) extra
                        </span>
                      </div>
                    )}
                    {lead.liberado && (
                      <div className="mt-1">
                        <span className="inline-flex items-center text-[10px] font-semibold text-green-700 bg-green-100 px-1.5 py-0.5 rounded">
                          🔓 Número Liberado
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${objColorMap[lead.objetivo] || 'bg-slate-100 text-slate-800'}`}>
                      {objMap[lead.objetivo] || lead.objetivo}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    {investimentoMap[lead.investimento] || lead.investimento}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <span className="font-bold text-slate-700 mr-2">{lead.score}</span>
                      <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-accent" style={{ width: `${Math.min((lead.score / 15) * 100, 100)}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-500 whitespace-nowrap">
                    {format(new Date(lead.timestamp), "dd/MM/yyyy HH:mm")}
                  </td>
                  <td className="p-4">
                    <select 
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      className="text-xs font-medium bg-slate-100 border border-slate-200 text-slate-700 rounded py-1 px-2 outline-none focus:border-primary"
                    >
                      <option value="novo">Novo</option>
                      <option value="contatado">Contatado</option>
                      <option value="convertido">Convertido</option>
                      <option value="descartado">Descartado</option>
                      <option value="desqualificado">Desqualificado</option>
                      <option value="abandonado">Abandonado (Incompleto)</option>
                    </select>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      {!isTrash ? (
                        <>
                          <button onClick={() => handleExportIndividual(lead, 'pdf')} className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded transition-colors" title="Exportar PDF">
                            <FileText size={16} />
                          </button>
                          <button onClick={() => handleExportIndividual(lead, 'planilha')} className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded transition-colors" title="Exportar Planilha">
                            <Table size={16} />
                          </button>
                          {!lead.liberado && lead.status === 'desqualificado' && (
                            <button onClick={() => handleLiberar(lead.id)} className="p-1.5 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded transition-colors" title="Desbloquear Aparelho/Número (Permitir novo cadastro)">
                              <Check size={16} />
                            </button>
                          )}
                          <button onClick={() => handleDelete(lead.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors" title="Mover para Lixeira">
                            <Trash2 size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleRestore(lead.id)} className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors" title="Restaurar Lead">
                            <RefreshCcw size={16} />
                          </button>
                          <button onClick={() => handleDelete(lead.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Excluir Permanentemente">
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-slate-500">Nenhum lead encontrado com os filtros atuais.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
