import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { CONFIG } from '../../../config';

export const SuccessScreen = ({ data }) => {
  const getDestaqueDinâmico = () => {
    switch (data.objetivo) {
      case 'emagrecimento': return "Identificamos que você busca emagrecimento com acompanhamento individualizado. Em até 24h você receberá o contato de um(a) profissional especialista nesse perfil.";
      case 'massa': return "Seu objetivo é ganho de massa e performance. Em até 24h você receberá o contato de um(a) nutricionista esportivo(a) com foco nesse resultado.";
      case 'saude': return "Seu caso envolve condição de saúde específica. Vamos indicar um(a) profissional com experiência clínica nessa área.";
      case 'gestacao': return "Gestação e pós-parto exigem atenção especializada. Em até 24h você receberá o contato de um(a) profissional dedicado(a) a essa fase.";
      case 'energia': return "Sua queixa é falta de energia e disposição. Vamos indicar um(a) profissional focado(a) em nutrição funcional.";
      default: return "Vamos indicar o melhor profissional para o seu caso.";
    }
  };

  const primeiroNome = data.nome.split(' ')[0];

  return (
    <div className="text-center py-8">
      <div className="flex justify-center mb-6">
        <CheckCircle2 size={80} className="text-primary animate-pop-in" />
      </div>
      <h2 className="text-3xl font-bold mb-4">Triagem recebida, {primeiroNome}!</h2>
      <p className="text-lg text-slate-700 mb-6 bg-primary/5 p-6 rounded-2xl border border-primary/10">
        {getDestaqueDinâmico()}
      </p>
      <p className="text-slate-500 font-medium">
        Fique de olho no seu WhatsApp <strong className="text-slate-800">{data.whatsapp}</strong>. Você receberá o contato em até {CONFIG.plataforma.prazoContato}.
      </p>
    </div>
  );
};

export const RejectedScreen = () => {
  return (
    <div className="text-center py-8">
      <div className="flex justify-center mb-6 text-slate-300">
        <XCircle size={80} strokeWidth={1} />
      </div>
      <h2 className="text-3xl font-bold mb-4">Agradecemos seu interesse.</h2>
      <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
        Avaliamos suas respostas e, no momento, o seu perfil não se encaixa nas vagas disponíveis para acompanhamento com nossos especialistas indicados. 
        <br /><br />
        Por enquanto, não poderemos seguir com seu atendimento.
      </p>
    </div>
  );
};
