import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Step1, Step2, Step3, Step4, Step5, StepRefinamento, Step6 } from './components/Steps';
import { SuccessScreen, RejectedScreen } from './components/StatusScreens';
import { saveLead, updateLead, checkDeviceLiberado } from '../../services/firebase';
import { fireGoogleAdsConversion } from '../../services/googleAds';
import { trackEvent } from '../../services/analytics';
import { CONFIG } from '../../config';

const getInitialData = () => ({
  nome: '',
  whatsapp: '',
  objetivo: '',
  urgencia: '',
  modalidade: '',
  investimento: '',
  prioridade_valor: '',
  compromisso: '',
});

export const FormFlow = ({ onInteract }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(getInitialData());
  const [status, setStatus] = useState('filling');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadId, setLeadId] = useState(null);

  
  useEffect(() => {
    if (typeof onInteract === 'function') {
      onInteract(step > 1 && status === 'filling');
    }
    if (step > 1) {
      const formElement = document.getElementById("triagem");
      if (formElement) {
         // Ajusta o scroll com um pequeno offset para o header fixo não cobrir o form
         const y = formElement.getBoundingClientRect().top + window.scrollY - 130;
         window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  }, [step, status]);

  useEffect(() => {
    const checkBlockStatus = async () => {
      const isBlocked = localStorage.getItem('nutri_conecta_blocked');
      const deviceId = localStorage.getItem('nutri_conecta_deviceId');
      if (isBlocked === 'true' && deviceId) {
        const isLiberado = await checkDeviceLiberado(deviceId);
        if (isLiberado) {
          localStorage.removeItem('nutri_conecta_blocked');
        } else {
          setStatus('rejected');
        }
      }
    };
    checkBlockStatus();
  }, []);

  const blockDevice = () => {
    let deviceId = localStorage.getItem('nutri_conecta_deviceId');
    if (!deviceId) {
      deviceId = Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('nutri_conecta_deviceId', deviceId);
    }
    localStorage.setItem('nutri_conecta_blocked', 'true');
    return deviceId;
  };

  const handleNext = () => {
    trackEvent('avancou_etapa_triagem', { etapa_atual: step, proxima_etapa: step + 1 });
    
    if (step === 1 && !leadId) {
      saveLead({
        ...data,
        status: 'abandonado',
        score: 0,
        origem: 'nutricionista-online'
      }).then(id => setLeadId(id)).catch(console.error);
    } else if (leadId) {
      updateLead(leadId, { ...data }).catch(console.error);
    }

    setStep((s) => s + 1);
  };

  const updateData = (fields) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  const handleDemissaoImediata = async () => {
    trackEvent('lead_barrado_na_triagem', { motivo: 'demissao_imediata', etapa: step });
    const deviceId = blockDevice();
    const finalLead = {
      ...data,
      status: 'desqualificado',
      deviceId,
      origem: 'nutricionista-online',
      score: 0
    };
    try {
      if (leadId) {
        await updateLead(leadId, finalLead);
      } else {
        await saveLead(finalLead);
      }
    } catch (e) {
      console.error(e);
    }
    setStatus('rejected');
  };

  const handleSubmit = async (finalData) => {
    setIsSubmitting(true);
    
    const scoreMap = {
      objetivo: { emagrecimento: 3, massa: 3, saude: 3, gestacao: 3, energia: 2, nao_sei: 0 },
      urgencia: { recente: 2, meses: 3, tentou: 3, curiosidade: 0 },
      modalidade: { online: 2, indiferente: 2 },
      investimento: { ate200: 0, '200_500': 1, '500_800': 2, '800mais': 3 },
      prioridade_valor: { qualidade: 2, equilibrio: 1, preco: 0 },
      compromisso: { sim_agora: 3, sim_semanas: 2, talvez: 1, nao: 0 }
    };

    let totalScore = 0;
    totalScore += scoreMap.objetivo[finalData.objetivo] || 0;
    totalScore += scoreMap.urgencia[finalData.urgencia] || 0;
    totalScore += scoreMap.modalidade[finalData.modalidade] || 0;
    totalScore += scoreMap.investimento[finalData.investimento] || 0;
    totalScore += scoreMap.prioridade_valor[finalData.prioridade_valor] || 0;
    totalScore += scoreMap.compromisso[finalData.compromisso] || 0;

    const usouImc = sessionStorage.getItem('nutri_conecta_imc_usado') === 'true';
    const resultadoImc = sessionStorage.getItem('nutri_conecta_imc_resultado') || null;

    const finalLead = { 
      ...finalData, 
      score: totalScore, 
      origem: 'nutricionista-online',
      usou_calculadora_imc: usouImc,
      resultado_imc: resultadoImc
    };

    if (totalScore >= CONFIG.scoreMinimo) {
      try {
        finalLead.status = 'novo';
        if (leadId) {
          await updateLead(leadId, finalLead);
        } else {
          await saveLead(finalLead);
        }
        trackEvent('lead_aprovado_triagem', { pontuacao: totalScore, objetivo: finalData.objetivo });
        fireGoogleAdsConversion(true); // Garantia de que só dispara para leads qualificados
        setStatus('success');
      } catch (error) {
        console.error("Erro ao salvar:", error);
        alert("Ocorreu um erro ao salvar sua triagem. Tente novamente.");
      }
    } else {
      trackEvent('lead_barrado_na_triagem', { motivo: 'pontuacao_baixa', pontuacao: totalScore });
      const deviceId = blockDevice();
      try {
        finalLead.status = 'desqualificado';
        finalLead.deviceId = deviceId;
        if (leadId) {
          await updateLead(leadId, finalLead);
        } else {
          await saveLead(finalLead);
        }
      } catch (error) {
        console.error("Erro ao salvar desqualificado:", error);
      }
      setStatus('rejected');
    }
    setIsSubmitting(false);
  };

  const resetForm = () => {
    setData(getInitialData());
    setStep(1);
    setLeadId(null);
    setStatus('filling');
  };

  if (status === 'success') {
    return <SuccessScreen data={data} />;
  }

  if (status === 'rejected') {
    return <RejectedScreen onRetry={resetForm} />;
  }

  const stepNames = data.investimento === 'ate200'
    ? ["Início", "Objetivo", "Situação atual", "Preferência", "Investimento", "Alinhamento", "Finalizar"]
    : ["Início", "Objetivo", "Situação atual", "Preferência", "Investimento", "Finalizar"];

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1 data={data} updateData={updateData} onNext={handleNext} />;
      case 2: return <Step2 data={data} updateData={updateData} onNext={handleNext} onDemitir={handleDemissaoImediata} />;
      case 3: return <Step3 data={data} updateData={updateData} onNext={handleNext} onDemitir={handleDemissaoImediata} />;
      case 4: return <Step4 data={data} updateData={updateData} onNext={handleNext} />;
      case 5: return <Step5 data={data} updateData={updateData} onNext={handleNext} onDemitir={handleDemissaoImediata} />;
      case 6: 
        if (data.investimento === 'ate200') {
          return <StepRefinamento data={data} updateData={updateData} onNext={handleNext} onDemitir={handleDemissaoImediata} />;
        } else {
          return <Step6 data={data} updateData={updateData} onSubmit={handleSubmit} isSubmitting={isSubmitting} onDemitir={handleDemissaoImediata} />;
        }
      case 7:
        if (data.investimento === 'ate200') {
          return <Step6 data={data} updateData={updateData} onSubmit={handleSubmit} isSubmitting={isSubmitting} onDemitir={handleDemissaoImediata} />;
        }
        return null;
      default: return null;
    }
  };

  const isFormStarted = step > 1 || data.nome.trim().length > 0 || data.whatsapp.length > 0;

  return (
    <div className="w-full h-full flex flex-col">
      <motion.div 
        animate={isFormStarted ? {
          scale: 1,
          boxShadow: "0px 20px 60px -15px rgba(201,168,76,0.15)",
          borderColor: "rgba(201,168,76,0.1)"
        } : { 
          scale: [1, 1.02, 1],
          boxShadow: [
            "0px 20px 60px -15px rgba(201,168,76,0.2)",
            "0px 30px 80px -10px rgba(201,168,76,0.8)",
            "0px 20px 60px -15px rgba(201,168,76,0.2)"
          ],
          borderColor: [
            "rgba(201,168,76,0.3)",
            "rgba(201,168,76,1)",
            "rgba(201,168,76,0.3)"
          ]
        }}
        transition={isFormStarted ? { duration: 0.5 } : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="w-full max-w-2xl bg-white/95 backdrop-blur-sm rounded-[2rem] px-4 py-5 sm:p-8 border-[1.5px] relative overflow-hidden"
      >
        {/* Decorator background */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-primary/80 to-gold"></div>
        <ProgressBar currentStep={step} totalSteps={stepNames.length} stepName={stepNames[step - 1]} />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
