import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Apple,
  Activity,
  CalendarCheck,
  Check,
  ChevronDown,
  ClipboardList,
  Clock,
  HeartPulse,
  Leaf,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  X,
} from "lucide-react";
import Reveal from "../../components/ui/Reveal";
import { FormFlow } from "../Public/FormFlow";
import { trackEvent } from "../../services/analytics";

function scrollToForm(location) {
  if (typeof location === 'string') {
    trackEvent('clique_botao_iniciar_triagem', { section: location });
  }
  document.getElementById("triagem")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Index() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isFormActive, setIsFormActive] = useState(false);

  const shouldBlur = isFormActive;

  useEffect(() => {
    // Observer para esconder o MobileCTA quando o formulário está visível
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFormVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    const formElement = document.getElementById("triagem");
    if (formElement) observer.observe(formElement);

    // Lógica de desembaçamento manual por rolagem
    const handleManualScroll = () => {
      if (isFormActive) {
        setIsFormActive(false);
      }
    };

    window.addEventListener('wheel', handleManualScroll, { passive: true });
    window.addEventListener('touchmove', handleManualScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('wheel', handleManualScroll);
      window.removeEventListener('touchmove', handleManualScroll);
    };
  }, [isFormActive]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-700">
      <Header shouldBlur={shouldBlur} />
      <Hero isFormActive={isFormActive} shouldBlur={shouldBlur} onFormInteract={setIsFormActive} />
      <div className={`transition-all duration-700 ${shouldBlur ? 'blur-[4px] opacity-30 pointer-events-none' : ''}`}>
        <TrustStrip />
        <HowItWorks />
        <WhoFor />
        <WhyNotGoogle />
        <FAQ />
        <FinalCTA />
        <Footer />
      </div>
      {!isFormVisible && <MobileCTA isFormActive={isFormActive} />}
    </div>
  );
}

function Header({ shouldBlur }) {
  return (
    <header className={`sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md transition-all duration-700 ${shouldBlur ? 'blur-[4px] opacity-30 pointer-events-none' : ''}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <a
          href="#"
          className="flex items-center gap-2 font-display text-base font-semibold text-primary"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Leaf className="h-4 w-4" strokeWidth={2.2} />
          </span>
          <span>
            Nutricionista Online
          </span>
        </a>
        <button
          onClick={() => scrollToForm('header')}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90 sm:text-sm"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Receber indicação
        </button>
      </div>
    </header>
  );
}

function Hero({ isFormActive, shouldBlur, onFormInteract }) {
  return (
    <section className="relative overflow-hidden">
      <div className={`absolute inset-0 -z-10 transition-all duration-700 ${shouldBlur ? 'blur-[4px] opacity-60 pointer-events-none' : ''}`}>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 95% 5%, oklch(0.76 0.13 85 / 0.22), transparent 60%), radial-gradient(75% 60% at -5% 10%, oklch(0.30 0.06 155 / 0.16), transparent 60%), linear-gradient(180deg, oklch(0.985 0.008 90) 0%, oklch(0.95 0.014 90) 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, oklch(0.20 0.04 155) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="mx-auto grid max-w-6xl items-start gap-10 px-6 pb-20 pt-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pt-20">
        <div className={`lg:pt-4 transition-all duration-700 ${shouldBlur ? 'blur-[4px] opacity-30 pointer-events-none' : ''}`}>
          <Reveal>
            <h1 className="font-display text-[2.5rem] font-semibold leading-[1.02] text-primary sm:text-5xl lg:text-[3.6rem]">
              O cuidado com sua alimentação começa pela escolha{" "}
              <span className="relative inline-block italic">
                <span className="relative z-10">certa</span>
                <span className="absolute inset-x-0 bottom-1 -z-0 h-3 bg-gold/45" />
              </span>
              .
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Conectamos você ao profissional de nutrição ideal para o seu objetivo em
              todo o Brasil. Uma triagem rápida, gratuita e sem compromisso.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <ul className="mt-7 space-y-2.5 text-sm text-foreground/85 sm:text-[15px]">
              {[
                { icon: Stethoscope, t: "Profissionais com atendimento 100% online por videochamada" },
                { icon: Clock, t: "Resposta no WhatsApp em até 24 horas" },
              ].map(({ icon: Icon, t }) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.32}>
            <div className="mt-8 hidden items-center gap-3 lg:flex">
              <button
                onClick={() => scrollToForm('hero_desktop')}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition hover:scale-[1.02] hover:bg-primary/90"
              >
                Quero minha indicação
                <Sparkles className="h-4 w-4" />
              </button>
              <span className="text-xs text-muted-foreground">
                Leva menos de 1 minuto · 100% gratuito
              </span>
            </div>
          </Reveal>
        </div>

        {/* FORMULÁRIO EM DESTAQUE */}
        <Reveal delay={0.1}>
          <div id="triagem" className={`lg:sticky lg:top-24 transition-all duration-700 ${isFormActive ? 'relative z-50' : ''}`}>
            <div className="mb-4 text-center lg:text-left px-2">
              <p className="text-sm text-muted-foreground/90 font-medium">
                Responda rápido para encontrarmos seu profissional ideal:
              </p>
            </div>
            <FormFlow onInteract={onFormInteract} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TrustStrip() {
  const items = [
    { icon: ShieldCheck, t: "Sem custo para você" },
    { icon: Leaf, t: "Planos alimentares adaptáveis" },
    { icon: Activity, t: "Atendimento 100% online" },
  ];
  return (
    <section className="border-y border-border bg-card/50">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-6 py-5 sm:grid-cols-4">
        {items.map(({ icon: Icon, t }) => (
          <div
            key={t}
            className="flex items-center justify-center gap-2.5 text-[12px] font-medium text-foreground/75 sm:text-sm"
          >
            <Icon className="h-4 w-4 text-gold" strokeWidth={2.2} />
            <span>{t}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: ClipboardList,
      title: "Você nos conta o essencial",
      desc: "Em poucos segundos, registramos seu contato e seu objetivo principal.",
    },
    {
      icon: Search,
      title: "Identificamos o perfil ideal",
      desc: "Cruzamos seu objetivo com o profissional de nutrição mais alinhado ao seu caso.",
    },
    {
      icon: CalendarCheck,
      title: "Receba a indicação em até 24h",
      desc: "Enviamos pelo WhatsApp o contato direto para você dar o próximo passo.",
    },
  ];

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold">
              Como funciona
            </span>
            <h2 className="mt-2 font-display text-3xl font-semibold text-primary sm:text-4xl">
              Um processo simples, direto e cuidadoso
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Sem formulários longos, sem burocracia. Apenas o necessário para encontrar o
              profissional certo para você.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-border bg-card p-7 transition-all duration-500 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[var(--shadow-elevated)]">
                <span className="absolute right-5 top-5 font-display text-5xl font-semibold text-primary/[0.06]">
                  0{i + 1}
                </span>
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground transition-transform duration-500 group-hover:scale-110">
                  <s.icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <div className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                  Passo {i + 1}
                </div>
                <h3 className="font-display text-lg font-semibold text-primary">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhoFor() {
  const items = [
    { icon: Apple, t: "Quer emagrecer de forma saudável e duradoura, sem dieta genérica." },
    {
      icon: HeartPulse,
      t: "Tem alguma condição como diabetes, hipertensão ou SOP e precisa de acompanhamento especializado.",
    },
    {
      icon: Sparkles,
      t: "Está em fase de gestação ou pós-parto e quer cuidar da alimentação com segurança.",
    },
    {
      icon: Activity,
      t: "Pratica atividade física e quer otimizar performance e recuperação.",
    },
    {
      icon: ClipboardList,
      t: "Já tentou outras dietas e não conseguiu manter os resultados.",
    },
    {
      icon: Stethoscope,
      t: "Não sabe por onde começar e quer um plano feito sob medida para você.",
    },
  ];
  return (
    <section className="relative overflow-hidden bg-secondary/60 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold">
              Para quem é
            </span>
            <h2 className="mt-2 font-display text-3xl font-semibold text-primary sm:text-4xl">
              Pensado para o seu momento
            </h2>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-3 sm:grid-cols-2">
          {items.map(({ icon: Icon, t }, i) => (
            <Reveal key={t} delay={i * 0.05}>
              <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-[var(--shadow-card)]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
                  <Icon className="h-4.5 w-4.5" strokeWidth={2} />
                </span>
                <p className="text-sm leading-relaxed text-foreground/90">{t}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <div className="mt-12 flex flex-col items-center gap-3">
            <button
              onClick={() => scrollToForm('who_for')}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 text-sm font-semibold text-gold-foreground shadow-[var(--shadow-gold)] transition hover:scale-[1.02]"
            >
              <Sparkles className="h-4 w-4" />
              Quero receber minha indicação
            </button>
            <span className="text-xs text-muted-foreground">
              Sem custo · Sem compromisso
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function WhyNotGoogle() {
  const problems = [
    "Perfis sem especialização clara para o seu caso",
    "Dúvida se o profissional realmente atende seu objetivo",
    "Risco de pagar consulta sem alinhamento de expectativas",
  ];
  const solutions = [
    "Indicação alinhada ao seu objetivo específico",
    "Conexão direta com profissional do seu perfil",
    "Primeiro contato já com contexto — sem perder tempo",
  ];
  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold">
              A diferença
            </span>
            <h2 className="mt-2 font-display text-3xl font-semibold text-primary sm:text-4xl">
              Por que não basta pesquisar no Google?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Existe muita gente boa por aí. Mas escolher no escuro pode custar tempo e dinheiro.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-3xl border border-destructive/20 bg-destructive/5 p-7">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-destructive/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-destructive">
                <X className="h-3.5 w-3.5" strokeWidth={2.4} />
                Pesquisando por conta própria
              </div>
              <ul className="space-y-3.5">
                {problems.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm text-foreground/90">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" strokeWidth={2.4} />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="relative h-full overflow-hidden rounded-3xl border border-gold/30 p-7 text-primary-foreground"
              style={{
                background:
                  "linear-gradient(180deg, oklch(0.30 0.06 155) 0%, oklch(0.24 0.05 155) 100%)",
              }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, oklch(0.76 0.13 85) 1px, transparent 0)",
                  backgroundSize: "22px 22px",
                }}
              />
              <div className="relative">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-gold/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gold">
                  <Check className="h-3.5 w-3.5" strokeWidth={2.4} />
                  Com a Nutricionista Online
                </div>
                <ul className="space-y-3.5">
                  {solutions.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={2.4} />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    {
      q: "Esse serviço tem algum custo para mim?",
      a: "Não. A indicação é totalmente gratuita para quem busca um profissional de nutrição online.",
    },
    {
      q: "Como vocês escolhem o profissional indicado?",
      a: "Identificamos um profissional com experiência no seu objetivo e disponibilidade para atendimento 100% online.",
    },
    {
      q: "Em quanto tempo recebo o contato?",
      a: "Em até 24 horas úteis após o envio dos seus dados, direto no WhatsApp informado.",
    },
    {
      q: "Posso ser atendido(a) de qualquer lugar do Brasil?",
      a: "Sim. Nossos nutricionistas parceiros atendem exclusivamente de forma online, por videochamada, garantindo praticidade e conforto.",
    },
    {
      q: "E se eu não me identificar com a indicação?",
      a: "Sem problema. Você não tem qualquer compromisso. O contato é apenas uma apresentação — quem decide se quer agendar é você.",
    },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section className="bg-secondary/60 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <div className="text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold">
              Tire suas dúvidas
            </span>
            <h2 className="mt-2 font-display text-3xl font-semibold text-primary sm:text-4xl">
              Perguntas frequentes
            </h2>
          </div>
        </Reveal>
        <div className="mt-10 space-y-2.5">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={it.q} delay={i * 0.04}>
                <div
                  className={`overflow-hidden rounded-2xl border bg-card transition-all ${
                    isOpen
                      ? "border-gold/40 shadow-[var(--shadow-card)]"
                      : "border-border"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (!isOpen) trackEvent('abriu_pergunta_faq', { question: it.q });
                      setOpen(isOpen ? null : i);
                    }}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-display text-base font-semibold text-primary sm:text-lg">
                      {it.q}
                    </span>
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/8 text-primary transition-transform duration-500 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" strokeWidth={2.2} />
                    </span>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground">
                      {it.a}
                    </p>
                  </motion.div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section
      className="relative overflow-hidden py-12 text-primary-foreground sm:py-16"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.28 0.06 155) 0%, oklch(0.20 0.04 155) 100%)",
      }}
    >
      <div
        className="absolute inset-0 -z-0 opacity-60"
        style={{
          background:
            "radial-gradient(50% 60% at 80% 30%, oklch(0.76 0.13 85 / 0.35), transparent 70%), radial-gradient(40% 50% at 10% 80%, oklch(0.76 0.13 85 / 0.18), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, oklch(0.76 0.13 85) 1px, transparent 0)",
          backgroundSize: "26px 26px",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            <Sparkles className="h-3.5 w-3.5" />
            Dê o próximo passo
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-tight sm:text-[2.6rem]">
            Seu próximo passo merece o cuidado de um profissional certo para você.
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Envie seus dados agora e receba a indicação em até 24 horas, no seu WhatsApp.
          </p>
        </Reveal>
        <Reveal delay={0.22}>
          <div className="mt-8 flex flex-col items-center gap-3">
            <button
              onClick={() => scrollToForm('final_cta')}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-semibold text-gold-foreground shadow-[var(--shadow-gold)] transition hover:scale-[1.02] sm:text-base"
            >
              <MessageCircle className="h-4 w-4" />
              Receber minha indicação gratuita
            </button>
            <span className="text-xs text-white/55">
              Leva menos de 1 minuto · Sem compromisso
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-background py-10 pb-24 sm:pb-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-5 px-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 font-display text-base font-semibold text-primary">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Leaf className="h-4 w-4" strokeWidth={2.2} />
            </span>
            Nutricionista Online
          </div>
          <p className="mt-2 max-w-md text-xs text-muted-foreground">
            Conectando você aos melhores nutricionistas online de todo o Brasil.
          </p>
        </div>
        <div className="flex flex-col items-start gap-1.5 text-xs text-muted-foreground sm:items-end">
          <div className="flex gap-3">
            <Link to="/privacidade" className="transition hover:text-primary">
              Política de Privacidade
            </Link>
            <span>·</span>
            <Link to="/termos" className="transition hover:text-primary">
              Termos de Uso
            </Link>
          </div>
          <span>© 2026 Nutricionista Online — Todos os direitos reservados</span>
        </div>
      </div>
    </footer>
  );
}

function MobileCTA({ isFormActive }) {
  return (
    <div className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur sm:hidden transition-all duration-700 ${isFormActive ? 'translate-y-full opacity-0' : ''}`}>
      <button
        onClick={() => scrollToForm('mobile_sticky')}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-gold-foreground shadow-[var(--shadow-gold)]"
      >
        <Sparkles className="h-4 w-4" />
        Receber indicação gratuita
      </button>
    </div>
  );
}

export default Index;
