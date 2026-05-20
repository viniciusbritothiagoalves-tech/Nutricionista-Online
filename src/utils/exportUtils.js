import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const objMap = {
  emagrecimento: 'Emagrecimento',
  massa: 'Ganho de Massa',
  saude: 'Saúde',
  gestacao: 'Gestação',
  energia: 'Energia',
  nao_sei: 'Não sabe'
};

const investimentoMap = {
  ate200: 'De R$ 200 a R$ 300',
  '200_500': 'De R$ 300 a R$ 500',
  '500_800': 'Entre R$ 500 e R$ 800',
  '800mais': 'Acima de R$ 800'
};

const urgenciaMap = {
  recente: 'Agora',
  meses: 'Há meses',
  tentou: 'Já tentou antes',
  curiosidade: 'Curiosidade'
};

const modalidadeMap = {
  online: 'Videochamada (Zoom/Meet)',
  indiferente: 'Apenas WhatsApp'
};

const compromissoMap = {
  sim_agora: 'Imediato',
  sim_semanas: '2 a 4 semanas',
  talvez: 'Avaliando',
  nao: 'Não pronto'
};

const getLeadQualityLabel = (score) => {
  const s = parseInt(score, 10);
  if (isNaN(s)) return '0/14 (Desqualificado)';
  if (s < 7) return `${s}/14 (Desqualificado)`;
  if (s >= 7 && s <= 9) return `${s}/14 (Frio)`;
  if (s >= 10 && s <= 12) return `${s}/14 (Quente)`;
  return `${s}/14 (Muito Quente)`;
};

export const exportToPDF = (leads, isIndividual = false) => {
  const doc = new jsPDF('landscape');
  const dataExportacao = format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });

  doc.setFontSize(14);
  doc.setTextColor(27, 67, 50);
  doc.text(`Relatório de Triagem de Potenciais Pacientes`, 14, 15);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Exportado em ${dataExportacao}`, 14, 22);

  const tableColumn = ["Data/Hora", "Nome", "WhatsApp", "Objetivo", "Urg.", "Mod.", "Investimento", "Pront.", "Score", "LGPD"];
  const tableRows = [];

  leads.forEach(lead => {
    const leadData = [
      format(new Date(lead.timestamp), "dd/MM/yyyy HH:mm"),
      lead.nome,
      lead.whatsapp,
      objMap[lead.objetivo] || lead.objetivo,
      urgenciaMap[lead.urgencia] || lead.urgencia,
      modalidadeMap[lead.modalidade] || lead.modalidade,
      investimentoMap[lead.investimento] || lead.investimento,
      compromissoMap[lead.compromisso] || lead.compromisso,
      getLeadQualityLabel(lead.score),
      lead.lgpdAceite ? 'Sim' : 'Não'
    ];
    tableRows.push(leadData);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 28,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [27, 67, 50] },
    willDrawCell: (data) => {
      // Coluna do WhatsApp (índice 2) no corpo da tabela
      if (data.section === 'body' && data.column.index === 2) {
        doc.setTextColor(0, 102, 204); 
      }
    },
    didDrawCell: (data) => {
      if (data.section === 'body' && data.column.index === 2) {
        const rawNumber = data.cell.raw.replace(/\D/g, '');
        const link = `https://wa.me/55${rawNumber}`;
        doc.link(data.cell.x, data.cell.y, data.cell.width, data.cell.height, { url: link });
      }
    }
  });

  const fileName = isIndividual ? `Potencial_Paciente_${leads[0].nome.replace(/\s+/g, '_')}.pdf` : `Potenciais_Pacientes_${format(new Date(), 'dd-MM-yyyy')}.pdf`;
  doc.save(fileName);
};

export const exportToExcel = (leads) => {
  const worksheetData = leads.map(lead => ({
    Nome: lead.nome,
    WhatsApp: lead.whatsapp,
    Objetivo: objMap[lead.objetivo] || lead.objetivo,
    Urgência: urgenciaMap[lead.urgencia] || lead.urgencia,
    Modalidade: modalidadeMap[lead.modalidade] || lead.modalidade,
    Investimento: investimentoMap[lead.investimento] || lead.investimento,
    Comprometimento: compromissoMap[lead.compromisso] || lead.compromisso,
    Score: getLeadQualityLabel(lead.score),
    LGPD: lead.lgpdAceite ? 'Sim' : 'Não',
    'Data da Triagem': format(new Date(lead.timestamp), "dd/MM/yyyy HH:mm", { locale: ptBR }),
    Status: lead.status
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Potenciais Pacientes");
  
  const fileName = `Potenciais_Pacientes_${format(new Date(), 'dd-MM-yyyy')}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};
