import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Leaf } from 'lucide-react';

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-6">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-8 font-medium">
          <ArrowLeft className="h-4 w-4" />
          Voltar para o início
        </Link>
        
        <div className="flex items-center gap-2 font-display text-lg font-semibold text-primary mb-10">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Leaf className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <span>Nutricionista Online</span>
        </div>

        <h1 className="font-display text-3xl font-bold text-primary mb-6">Termos de Uso</h1>
        
        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed pb-20">
          <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

          <h2 className="text-lg font-semibold text-foreground">1. Aceitação dos Termos</h2>
          <p>Ao acessar e utilizar os serviços fornecidos pela Nutricionista Online ("Site", "Serviço"), você concorda em cumprir e sujeitar-se a estes Termos de Uso. Se você não concorda com qualquer parte destes termos, não deve utilizar nosso serviço de indicação.</p>

          <h2 className="text-lg font-semibold text-foreground">2. Descrição do Serviço</h2>
          <p>A Nutricionista Online atua como uma plataforma gratuita de triagem e encaminhamento. Nosso objetivo é facilitar a conexão entre pessoas que buscam acompanhamento nutricional e profissionais de nutrição qualificados para atendimento 100% online em todo o Brasil.</p>

          <h2 className="text-lg font-semibold text-foreground">3. Gratuidade e Não Vinculação</h2>
          <p>O serviço de triagem e indicação fornecido pela Nutricionista Online é totalmente gratuito para o usuário. A Nutricionista Online atua apenas como uma ponte de contato inicial. O usuário não tem qualquer obrigação de agendar, contratar ou pagar por consultas com o profissional indicado. A decisão final é inteiramente do usuário.</p>

          <h2 className="text-lg font-semibold text-foreground">4. Responsabilidade Profissional</h2>
          <p>A Nutricionista Online realiza uma pré-seleção baseada no perfil e nas respostas fornecidas. Contudo, não somos responsáveis pelo atendimento, pelos resultados, diagnósticos ou tratamentos conduzidos pelos profissionais indicados. A relação paciente-nutricionista, incluindo pagamentos, regras de cancelamento e conduta clínica, ocorre exclusivamente entre as duas partes, eximindo a Nutricionista Online de qualquer responsabilidade civil, criminal ou médica após o repasse do contato.</p>

          <h2 className="text-lg font-semibold text-foreground">5. Veracidade das Informações</h2>
          <p>O usuário se compromete a fornecer informações verdadeiras, exatas, atuais e completas no momento do preenchimento do formulário. A veracidade dessas informações é fundamental para que possamos indicar o profissional mais adequado.</p>

          <h2 className="text-lg font-semibold text-foreground">6. Uso Inadequado (Anti-Spam)</h2>
          <p>É estritamente proibido o uso automatizado do formulário, envios repetitivos e abusivos ou o fornecimento de dados falsos de terceiros. A Nutricionista Online reserva-se o direito de bloquear dispositivos ou números de WhatsApp que façam uso indevido da plataforma.</p>

          <h2 className="text-lg font-semibold text-foreground">7. Alterações nestes Termos</h2>
          <p>Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. Alterações significativas serão destacadas no site. O uso contínuo de nossos serviços após tais modificações constitui sua aceitação dos novos termos.</p>
        </div>
      </div>
    </div>
  );
}
