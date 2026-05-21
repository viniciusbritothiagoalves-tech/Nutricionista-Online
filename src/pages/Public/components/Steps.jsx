import React, { useState } from 'react';
import { Target, Activity, Baby, Zap, Clock, ChevronRight, Dumbbell, MapPin, Monitor, Globe, Check } from 'lucide-react';
import { RadioCard } from '../../../components/ui/RadioCard';
import { maskWhatsApp, validateWhatsApp } from '../../../utils/mask';
import { checkWhatsAppBlocked } from '../../../services/firebase';

export const Step1 = ({ data, updateData, onNext }) => {
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const handleNext = async () => {
    const nome = data.nome.trim();
    if (!nome) {
      setError('Por favor, insira seu nome ou como prefere ser chamado.');
      return;
    }
    if (!validateWhatsApp(data.whatsapp)) {
      const v = data.whatsapp.replace(/\D/g, "");
      if (v.startsWith("55") && v.length === 11) {
        setError('O número não pode começar com 55. Digite APENAS o DDD do seu estado + número do telefone.');
      } else {
        setError('Por favor, insira um número de WhatsApp válido com DDD.');
      }
      return;
    }
    
    setIsChecking(true);
    try {
      const isBlocked = await checkWhatsAppBlocked(data.whatsapp);
      if (isBlocked) {
        setError('Este número já participou da triagem recentemente. Aguarde nosso contato.');
        setIsChecking(false);
        return;
      }
    } catch (e) {
      console.error(e);
    }
    setIsChecking(false);
    
    setError('');
    onNext();
  };

  return (
    <div>
      <h2 className="text-xl sm:text-3xl font-display font-bold text-primary tracking-tight mb-1 sm:mb-2 leading-tight">Vamos começar pela sua identificação</h2>
      <p className="text-slate-500 text-[14px] sm:text-base mb-3 sm:mb-6 leading-tight">Seus dados são usados apenas para enviar sua indicação.</p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Nome completo</label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            placeholder="Ex: João da Silva"
            value={data.nome}
            onChange={(e) => updateData({ nome: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">WhatsApp</label>
          <input
            type="tel"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            placeholder="(00) 00000-0000"
            value={data.whatsapp}
            onChange={(e) => updateData({ whatsapp: maskWhatsApp(e.target.value) })}
          />
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-500 p-4 rounded-xl mt-4">
            <p className="text-red-700 font-bold flex items-center">
              ⚠️ ATENÇÃO: {error}
            </p>
          </div>
        )}

        <button
          onClick={handleNext}
          disabled={isChecking}
          className="w-full mt-6 bg-accent text-white font-semibold py-4 rounded-xl flex items-center justify-center hover:bg-yellow-600 transition-colors disabled:opacity-70"
        >
          {isChecking ? 'Verificando...' : (
            <>Continuar <ChevronRight className="ml-2" size={20} /></>
          )}
        </button>
      </div>
    </div>
  );
};

export const Step2 = ({ data, updateData, onNext, onDemitir }) => {
  const options = [
    { id: 'emagrecimento', label: 'Emagrecer de forma saudável e duradoura', icon: Target, score: 3 },
    { id: 'massa', label: 'Ganhar massa muscular e definição', icon: Dumbbell, score: 3 },
    { id: 'saude', label: 'Controlar condição de saúde (diabetes, hipertensão...)', icon: Activity, score: 3 },
    { id: 'gestacao', label: 'Gestação ou pós-parto', icon: Baby, score: 3 },
    { id: 'energia', label: 'Melhorar energia, disposição e bem-estar geral', icon: Zap, score: 2 },
    { id: 'nao_sei', label: 'Não sei bem, quero orientação geral', icon: Clock, score: 0 }
  ];

  const handleNext = (valToUse) => {
    const val = valToUse || data.objetivo;
    if (!val) return;
    const selected = options.find(o => o.id === val);
    if (selected.score === 0) {
      onDemitir();
    } else {
      onNext();
    }
  };

  return (
    <div>
      <h2 className="text-xl sm:text-3xl font-display font-bold text-primary tracking-tight mb-1 sm:mb-2 leading-tight">Qual é o seu principal objetivo com a nutrição?</h2>
      <p className="text-slate-500 text-[14px] sm:text-base mb-3 sm:mb-6 leading-tight">Escolha o que mais representa o que você quer alcançar.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
        {options.map((opt) => (
          <RadioCard
            key={opt.id}
            id={opt.id}
            label={opt.label}
            icon={opt.icon}
            selected={data.objetivo === opt.id}
            onChange={(val) => {
              updateData({ objetivo: val });
              setTimeout(() => handleNext(val), 350);
            }}
          />
        ))}
      </div>

    </div>
  );
};

export const Step3 = ({ data, updateData, onNext, onDemitir }) => {
  const getTitle = () => {
    switch (data.objetivo) {
      case 'emagrecimento': return "Há quanto tempo você tenta emagrecer?";
      case 'massa': return "Há quanto tempo você busca ganhar massa muscular?";
      case 'saude': return "Há quanto tempo você lida com essa condição de saúde?";
      case 'gestacao': return "Em que fase você está?";
      case 'energia': return "Há quanto tempo você sente essa falta de energia?";
      default: return "Há quanto tempo você tem esse objetivo?";
    }
  };

  const options = [
    { id: 'recente', label: 'Acabei de decidir que quero resolver isso agora', score: 2 },
    { id: 'meses', label: 'Estou tentando resolver há alguns meses', score: 3 },
    { id: 'tentou', label: 'Já tentei antes e não consegui manter — quero uma solução definitiva', score: 3 },
    { id: 'curiosidade', label: 'Só estou pesquisando por curiosidade por enquanto', score: 0 }
  ];

  const handleNext = (valToUse) => {
    const val = valToUse || data.urgencia;
    if (!val) return;
    const selected = options.find(o => o.id === val);
    if (selected.score === 0) {
      onDemitir();
    } else {
      onNext();
    }
  };

  return (
    <div>
      <h2 className="text-xl sm:text-3xl font-display font-bold text-primary tracking-tight mb-1 sm:mb-2 leading-tight">{getTitle()}</h2>
      <p className="text-slate-500 text-[14px] sm:text-base mb-3 sm:mb-6 leading-tight">Isso nos ajuda a entender a urgência e atenção que seu caso precisa.</p>

      <div className="space-y-3">
        {options.map((opt) => (
          <label key={opt.id} className={`block py-1.5 px-2.5 sm:p-2.5 border rounded-[14px] cursor-pointer transition-all duration-300 ${data.urgencia === opt.id ? 'border-primary bg-primary/[0.03] shadow-[0_4px_20px_-4px_rgba(27,67,50,0.1)] ring-1 ring-primary/20 scale-[1.01]' : 'border-border/60 hover:border-gold/40 hover:bg-slate-50/50 hover:shadow-md hover:-translate-y-[1.5px]'}`}>
            <div className="flex items-center">
              <input
                type="radio"
                name="urgencia"
                className="w-5 h-5 text-primary border-slate-300 focus:ring-primary"
                checked={data.urgencia === opt.id}
                onChange={() => {
                  updateData({ urgencia: opt.id });
                  setTimeout(() => handleNext(opt.id), 350);
                }}
                onClick={() => {
                  if (data.urgencia === opt.id) {
                    setTimeout(() => handleNext(opt.id), 350);
                  }
                }}
              />
              <span className="ml-3 text-[15px] font-medium text-slate-700 leading-tight">{opt.label}</span>
            </div>
          </label>
        ))}
      </div>

    </div>
  );
};

export const Step4 = ({ data, updateData, onNext }) => {
  const options = [
    { id: 'online', label: 'Videochamada (Google Meet, Zoom)', icon: Monitor },
    { id: 'indiferente', label: 'Apenas por WhatsApp', icon: Globe }
  ];

  return (
    <div>
      <h2 className="text-xl sm:text-3xl font-display font-bold text-primary tracking-tight mb-1 sm:mb-2 leading-tight">Como você prefere ser atendido(a)?</h2>
      <p className="text-slate-500 text-[14px] sm:text-base mb-3 sm:mb-6 leading-tight">Nosso atendimento é 100% online para todo o Brasil. Qual a sua preferência de formato?</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
        {options.map((opt) => (
          <RadioCard
            key={opt.id}
            id={opt.id}
            label={opt.label}
            icon={opt.icon}
            selected={data.modalidade === opt.id}
            onChange={(val) => {
              updateData({ modalidade: val });
              setTimeout(() => onNext(), 350);
            }}
          />
        ))}
      </div>

    </div>
  );
};

export const Step5 = ({ data, updateData, onNext }) => {
  const options = [
    { id: 'ate200', label: 'De R$200 a R$300/mês — estou com orçamento bem limitado agora', score: 0 },
    { id: '200_500', label: 'De R$300 a R$500/mês — consigo investir com planejamento', score: 1 },
    { id: '500_800', label: 'Entre R$500 e R$800/mês — quero um acompanhamento de qualidade', score: 2 },
    { id: '800mais', label: 'Acima de R$800/mês — quero o melhor acompanhamento disponível', score: 3 }
  ];

  const handleNext = (valToUse) => {
    const val = valToUse || data.investimento;
    if (!val) return;
    onNext();
  };

  return (
    <div>
      <h2 className="text-xl sm:text-3xl font-display font-bold text-primary tracking-tight mb-1 sm:mb-2 leading-tight">Quanto você está disposto(a) a investir mensalmente para alcançar seu objetivo?</h2>
      <p className="text-slate-500 text-[14px] sm:text-base mb-3 sm:mb-6 leading-tight">Seja honesto(a). Isso define qual profissional consegue te dar o melhor resultado — não existe resposta certa ou errada.</p>

      <div className="space-y-3">
        {options.map((opt) => (
          <label key={opt.id} className={`block py-1.5 px-2.5 sm:p-2.5 border rounded-[14px] cursor-pointer transition-all duration-300 ${data.investimento === opt.id ? 'border-primary bg-primary/[0.03] shadow-[0_4px_20px_-4px_rgba(27,67,50,0.1)] ring-1 ring-primary/20 scale-[1.01]' : 'border-border/60 hover:border-gold/40 hover:bg-slate-50/50 hover:shadow-md hover:-translate-y-[1.5px]'}`}>
            <div className="flex items-center">
              <input
                type="radio"
                name="investimento"
                className="w-5 h-5 text-primary border-slate-300 focus:ring-primary"
                checked={data.investimento === opt.id}
                onChange={() => {
                  updateData({ investimento: opt.id });
                  setTimeout(() => handleNext(opt.id), 350);
                }}
                onClick={() => {
                  if (data.investimento === opt.id) {
                    setTimeout(() => handleNext(opt.id), 350);
                  }
                }}
              />
              <span className="ml-3 text-[15px] font-medium text-slate-700 leading-tight">{opt.label}</span>
            </div>
          </label>
        ))}
      </div>

    </div>
  );
};

export const StepRefinamento = ({ data, updateData, onNext, onDemitir }) => {
  const options = [
    { id: 'qualidade', label: 'A qualidade e a certeza de resultados, mesmo precisando me esforçar um pouco mais financeiramente.', score: 2 },
    { id: 'equilibrio', label: 'Um bom equilíbrio: não precisa ser o mais caro, mas valorizo um trabalho bem feito.', score: 1 },
    { id: 'preco', label: 'Procuro apenas a opção mais barata, não estou disposto(a) a investir em algo premium.', score: 0 }
  ];

  const handleNext = (valToUse) => {
    const val = valToUse || data.prioridade_valor;
    if (!val) return;
    const selected = options.find(o => o.id === val);
    if (selected.score === 0) {
      onDemitir();
    } else {
      onNext();
    }
  };

  return (
    <div>
      <h2 className="text-xl sm:text-3xl font-display font-bold text-primary tracking-tight mb-1 sm:mb-2 leading-tight">Entendido. O que é mais importante para você ao escolher um profissional?</h2>
      <p className="text-slate-500 text-[14px] sm:text-base mb-3 sm:mb-6 leading-tight">Queremos ter certeza de que conectaremos você com a pessoa certa para seu momento.</p>

      <div className="space-y-3">
        {options.map((opt) => (
          <label key={opt.id} className={`block py-1.5 px-2.5 sm:p-2.5 border rounded-[14px] cursor-pointer transition-all duration-300 ${data.prioridade_valor === opt.id ? 'border-primary bg-primary/[0.03] shadow-[0_4px_20px_-4px_rgba(27,67,50,0.1)] ring-1 ring-primary/20 scale-[1.01]' : 'border-border/60 hover:border-gold/40 hover:bg-slate-50/50 hover:shadow-md hover:-translate-y-[1.5px]'}`}>
            <div className="flex items-center">
              <input
                type="radio"
                name="prioridade_valor"
                className="w-5 h-5 text-primary border-slate-300 focus:ring-primary"
                checked={data.prioridade_valor === opt.id}
                onChange={() => {
                  updateData({ prioridade_valor: opt.id });
                  setTimeout(() => handleNext(opt.id), 350);
                }}
                onClick={() => {
                  if (data.prioridade_valor === opt.id) {
                    setTimeout(() => handleNext(opt.id), 350);
                  }
                }}
              />
              <span className="ml-3 text-[15px] font-medium text-slate-700 leading-tight">{opt.label}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export const Step6 = ({ data, updateData, onSubmit, isSubmitting, onDemitir }) => {
  const [lgpd, setLgpd] = useState(false);

  const options = [
    { id: 'sim_agora', label: 'Sim — estou pronto(a) para começar em breve', score: 3 },
    { id: 'sim_semanas', label: 'Sim, mas precisaria de 2 a 4 semanas para me organizar', score: 2 },
    { id: 'talvez', label: 'Talvez — ainda estou avaliando se é o momento certo', score: 1 },
    { id: 'nao', label: 'Não — ainda não estou pronto(a) para começar', score: 0 }
  ];

  const handleSubmit = () => {
    if (!data.compromisso || !lgpd) return;
    const selected = options.find(o => o.id === data.compromisso);
    if (selected.score === 0) {
      onDemitir();
    } else {
      onSubmit({ ...data, lgpdAceite: true });
    }
  };

  return (
    <div>
      <h2 className="text-xl sm:text-3xl font-display font-bold mb-1 sm:mb-2 leading-tight tracking-tight text-primary">Uma última pergunta — e ela é importante</h2>
      <p className="text-slate-500 text-[14px] sm:text-base mb-2 sm:mb-6 leading-tight">Se um profissional indicado entrar em contato amanhã, você estaria disponível para conversar sobre o início do acompanhamento?</p>

      <div className="space-y-1.5 sm:space-y-2 mb-2 sm:mb-6">
        {options.map((opt) => (
          <label key={opt.id} className={`block py-1.5 px-2.5 sm:p-2.5 border rounded-[14px] cursor-pointer transition-all duration-300 ${data.compromisso === opt.id ? 'border-primary bg-primary/[0.03] shadow-[0_4px_20px_-4px_rgba(27,67,50,0.1)] ring-1 ring-primary/20 scale-[1.01]' : 'border-border/60 hover:border-gold/40 hover:bg-slate-50/50 hover:shadow-md hover:-translate-y-[1.5px]'}`}>
            <div className="flex items-center">
              <input
                type="radio"
                name="compromisso"
                className="w-4 h-4 sm:w-5 sm:h-5 text-primary border-slate-300 focus:ring-primary"
                checked={data.compromisso === opt.id}
                onChange={() => updateData({ compromisso: opt.id })}
              />
              <span className="ml-2.5 text-[14px] sm:text-[15px] font-medium text-slate-700 leading-tight">{opt.label}</span>
            </div>
          </label>
        ))}
      </div>

      <div 
        onClick={() => setLgpd(!lgpd)}
        className={`mb-3 sm:mb-6 py-1.5 px-2 sm:p-3 border rounded-xl cursor-pointer transition-all duration-300 flex items-start gap-2 hover:-translate-y-[1px] hover:shadow-sm
          ${lgpd ? 'bg-primary/5 border-primary/30 ring-1 ring-primary/10' : 'bg-slate-50 border-slate-200 hover:border-gold/30'}`}
      >
        <div className="flex items-center h-4 mt-[1px] pointer-events-none">
          <input
            type="checkbox"
            className="w-4 h-4 text-primary bg-white border-slate-300 rounded focus:ring-primary cursor-pointer transition-colors"
            checked={lgpd}
            readOnly
          />
        </div>
        <div className="text-[10.5px] sm:text-xs leading-snug text-slate-500">
          Concordo em receber o contato via WhatsApp. As informações serão usadas apenas para este fim (LGPD).
        </div>
      </div>

      {(!data.compromisso || !lgpd) && (
        <p className="text-center text-[12px] sm:text-[13px] text-red-500 mb-3 font-medium animate-pulse">
          {!data.compromisso ? 'Selecione uma resposta acima' : ''}
          {!data.compromisso && !lgpd ? ' e ' : ''}
          {!lgpd ? 'marque a caixa de autorização' : ''}
          {' para liberar o botão.'}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={!data.compromisso || !lgpd || isSubmitting}
        className={`w-full font-semibold py-3.5 sm:py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2 
          ${(!data.compromisso || !lgpd || isSubmitting) 
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none border border-slate-300' 
            : 'bg-gradient-to-r from-gold to-[#d4af37] text-gold-foreground hover:brightness-110 shadow-[0_8px_20px_-6px_rgba(201,168,76,0.5)] hover:-translate-y-0.5 active:translate-y-0'
          }`}
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
            Finalizando...
          </>
        ) : (
          <>
            Enviar minha triagem
            <Check size={20} strokeWidth={2.5} />
          </>
        )}
      </button>
    </div>
  );
};
