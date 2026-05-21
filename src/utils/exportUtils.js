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
  const doc = new jsPDF('portrait');
  const dataExportacao = format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });

  doc.setFontSize(16);
  doc.setTextColor(27, 67, 50);
  doc.text(`Relatório de Triagem de Pacientes`, 14, 15);
  
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Exportado em ${dataExportacao}`, 14, 22);

  leads.forEach((lead, index) => {
    const tableData = [
      ['Paciente', lead.nome || 'N/A'],
      ['Data da Triagem', lead.timestamp ? format(new Date(lead.timestamp), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : 'N/A'],
      ['WhatsApp', lead.whatsapp || 'N/A'],
      ['Qualificação', getLeadQualityLabel(lead.score)],
      ['Objetivo', objMap[lead.objetivo] || lead.objetivo || 'N/A'],
      ['Urgência', urgenciaMap[lead.urgencia] || lead.urgencia || 'N/A'],
      ['Modalidade', modalidadeMap[lead.modalidade] || lead.modalidade || 'N/A'],
      ['Investimento', investimentoMap[lead.investimento] || lead.investimento || 'N/A'],
      ['Prontidão', compromissoMap[lead.compromisso] || lead.compromisso || 'N/A'],
      ['LGPD (Consentimento)', lead.lgpdAceite ? 'Sim' : 'Não']
    ];

    autoTable(doc, {
      body: tableData,
      startY: index === 0 ? 30 : doc.lastAutoTable.finalY + 10,
      theme: 'grid',
      styles: { fontSize: 11, cellPadding: 4 },
      columnStyles: {
        0: { fontStyle: 'bold', fillColor: [245, 245, 245], textColor: [27, 67, 50], cellWidth: 60 },
        1: { textColor: [50, 50, 50] }
      },
      willDrawCell: (data) => {
        // A linha do WhatsApp é a de índice 2 e a coluna de valor é a 1
        if (data.row.index === 2 && data.column.index === 1) {
          doc.setTextColor(0, 102, 204); 
        }
      },
      didDrawCell: (data) => {
        if (data.row.index === 2 && data.column.index === 1 && data.cell.raw !== 'N/A') {
          const rawNumber = String(data.cell.raw).replace(/\D/g, '');
          const link = `https://wa.me/55${rawNumber}`;
          doc.link(data.cell.x, data.cell.y, data.cell.width, data.cell.height, { url: link });
        }
      }
    });
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
