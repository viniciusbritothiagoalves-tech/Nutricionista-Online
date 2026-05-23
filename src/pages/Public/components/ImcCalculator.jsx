import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Scale, Ruler, AlertCircle, CheckCircle2, ChevronRight, Info, ArrowRight } from 'lucide-react';
import Reveal from '../../../components/ui/Reveal';

export default function ImcCalculator({ onGoToForm }) {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [imc, setImc] = useState(null);
  const [category, setCategory] = useState(null);
  const [error, setError] = useState('');

  const calculateImc = () => {
    setError('');
    
    // Converte vírgula para ponto e garante que o usuário pode digitar "175" ou "1,75" ou "1.75"
    let w = weight.replace(',', '.');
    let hRaw = height.replace(',', '.');
    
    w = parseFloat(w);
    hRaw = parseFloat(hRaw);
    
    if (!w || !hRaw || isNaN(w) || isNaN(hRaw)) {
      setError('Por favor, preencha a altura e o peso corretamente.');
      return;
    }
    
    // Se altura foi digitada em cm (ex: 175), converte para metros (1.75)
    const h = hRaw > 3 ? hRaw / 100 : hRaw;

    if (w > 0 && h > 0) {
      const result = w / (h * h);
      const imcValue = result.toFixed(1);
      setImc(imcValue);
      
      // Rastreamento para saber se o lead usou a calculadora
      sessionStorage.setItem('nutri_conecta_imc_usado', 'true');
      sessionStorage.setItem('nutri_conecta_imc_resultado', imcValue);
      
      if (result < 18.5) setCategory('abaixo');
      else if (result < 25) setCategory('normal');
      else if (result < 30) setCategory('sobrepeso');
      else if (result < 35) setCategory('obesidade1');
      else if (result < 40) setCategory('obesidade2');
      else setCategory('obesidade3');
    } else {
      setError('Valores inválidos. Verifique os dados inseridos.');
    }
  };

  const categories = {
    abaixo: {
      label: 'Abaixo do Peso',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      icon: Info,
      message: 'Você está abaixo do peso ideal. Um nutricionista pode te ajudar a ganhar massa com saúde e energia.'
    },
    normal: {
      label: 'Peso Normal',
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      icon: CheckCircle2,
      message: 'Parabéns, você está no peso saudável! Que tal um plano focado em otimizar sua performance ou tonificação?'
    },
    sobrepeso: {
      label: 'Sobrepeso',
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      icon: AlertCircle,
      message: 'Atenção: você está na faixa de sobrepeso. Esse é o momento perfeito para ajustar a rotina antes que vire um risco maior.'
    },
    obesidade1: {
      label: 'Obesidade Grau I',
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/30',
      icon: AlertCircle,
      message: 'Seu IMC indica Obesidade Grau I. É fortemente recomendado o acompanhamento nutricional para reverter o quadro e proteger sua saúde.'
    },
    obesidade2: {
      label: 'Obesidade Grau II',
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      icon: AlertCircle,
      message: 'Sinal de Alerta! Obesidade Grau II aumenta consideravelmente os riscos à saúde. Não adie mais a sua mudança.'
    },
    obesidade3: {
      label: 'Obesidade Grau III',
      color: 'text-red-600',
      bg: 'bg-red-600/10',
      border: 'border-red-600/30',
      icon: AlertCircle,
      message: 'Sinal Vermelho! A Obesidade Grau III traz riscos severos. A intervenção nutricional guiada é fundamental neste momento.'
    }
  };

  const currentStatus = category ? categories[category] : null;
  const StatusIcon = currentStatus?.icon;

  return (
    <section className="pb-14 pt-8 sm:pb-20 sm:pt-10 relative overflow-hidden bg-background">
      <div 
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, oklch(0.76 0.13 85) 1px, transparent 0)",
          backgroundSize: "24px 24px"
        }}
      />
      <div className="mx-auto max-w-xl px-6">
        <Reveal>
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-gold mb-3">
              <Activity className="h-3.5 w-3.5" />
              Descubra seu estado atual
            </span>
            <h2 className="font-display text-3xl font-semibold text-primary sm:text-4xl">
              Como está a sua saúde hoje?
            </h2>
            <p className="mx-auto mt-3 text-muted-foreground">
              O Índice de Massa Corporal (IMC) é o primeiro passo para entender as necessidades do seu corpo. Calcule agora.
            </p>
          </div>
        </Reveal>

        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-[var(--shadow-elevated)] relative overflow-hidden">
          <div className="relative z-10 flex flex-col gap-6">
            
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-foreground/90 flex items-center gap-2 mb-2">
                  <Ruler className="h-4 w-4 text-primary" />
                  Sua Altura (m)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ex: 1,75"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">m</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground/90 flex items-center gap-2 mb-2">
                  <Scale className="h-4 w-4 text-primary" />
                  Seu Peso (kg)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ex: 72,5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">kg</span>
                </div>
              </div>
            </div>

            {error && <p className="text-sm text-destructive font-medium animate-in fade-in">{error}</p>}

            <button
              onClick={calculateImc}
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all hover:bg-primary/90 hover:scale-[1.02] shadow-sm flex justify-center items-center gap-2"
            >
              Calcular meu IMC
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Resultado Expandível */}
            <AnimatePresence>
              {imc && currentStatus && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden border-t border-border/60 pt-6"
                >
                  <div className="space-y-4">
                    <div className={`p-5 rounded-2xl border ${currentStatus.border} ${currentStatus.bg}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                            Seu IMC
                          </p>
                          <div className="flex items-end gap-2">
                            <span className="font-display text-4xl font-bold text-foreground">
                              {imc}
                            </span>
                            <span className={`text-sm font-semibold mb-1.5 ${currentStatus.color}`}>
                              {currentStatus.label}
                            </span>
                          </div>
                        </div>
                        <StatusIcon className={`h-8 w-8 ${currentStatus.color}`} strokeWidth={1.5} />
                      </div>
                      <p className="mt-4 text-sm leading-relaxed text-foreground/80 font-medium">
                        {currentStatus.message}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-gold/20 to-gold/5 p-5 rounded-2xl border border-gold/20">
                      <p className="text-sm text-foreground/90 mb-4 font-medium">
                        O melhor momento para agir é agora. Inicie seu acompanhamento.
                      </p>
                      <button
                        onClick={onGoToForm}
                        className="w-full py-3.5 rounded-xl bg-gold text-gold-foreground font-semibold text-sm transition-all hover:bg-gold/90 shadow-[var(--shadow-gold)] flex justify-center items-center gap-2 hover:-translate-y-0.5"
                      >
                        Iniciar minha triagem grátis
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
          </div>
        </div>
      </div>
    </section>
  );
}
