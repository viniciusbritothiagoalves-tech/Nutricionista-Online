import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Leaf } from 'lucide-react';

export default function PrivacyPolicy() {
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

        <h1 className="font-display text-3xl font-bold text-primary mb-6">Política de Privacidade</h1>
        
        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed pb-20">
          <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          
          <h2 className="text-lg font-semibold text-foreground">1. Informações Gerais</h2>
          <p>A Nutricionista Online respeita a sua privacidade e está comprometida em proteger os seus dados pessoais. Esta Política de Privacidade explica como coletamos, usamos, compartilhamos e protegemos as informações pessoais que você fornece ao utilizar nosso formulário e serviço de indicação de profissionais de nutrição, em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018).</p>

          <h2 className="text-lg font-semibold text-foreground">2. Dados Coletados</h2>
          <p>Coletamos os seguintes dados pessoais fornecidos voluntariamente por você através de nosso formulário:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Nome completo ou como prefere ser chamado;</li>
            <li>Número de telefone (WhatsApp);</li>
            <li>Informações sobre seu objetivo de saúde e preferências de atendimento (investimento, modalidade, etc.).</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground">3. Finalidade da Coleta</h2>
          <p>Os dados coletados são utilizados exclusivamente para as seguintes finalidades:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Avaliar seu perfil e necessidades;</li>
            <li>Identificar o profissional de nutrição mais adequado para o seu caso;</li>
            <li>Entrar em contato com você via WhatsApp para realizar a indicação profissional.</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground">4. Compartilhamento de Dados</h2>
          <p>Seus dados pessoais (Nome, WhatsApp e Objetivo) serão compartilhados exclusivamente com o profissional de nutrição previamente selecionado e indicado para você, a fim de que o contato inicial seja estabelecido. Não vendemos, alugamos ou repassamos seus dados a terceiros não autorizados ou para fins de marketing não relacionado ao serviço.</p>

          <h2 className="text-lg font-semibold text-foreground">5. Armazenamento e Segurança</h2>
          <p>Adotamos as medidas técnicas e organizacionais adequadas para proteger seus dados pessoais contra acesso, alteração, divulgação ou destruição não autorizada. Seus dados são armazenados em servidores seguros, acessíveis apenas por pessoal autorizado e por tempo necessário para cumprir com as finalidades mencionadas.</p>

          <h2 className="text-lg font-semibold text-foreground">6. Seus Direitos (LGPD)</h2>
          <p>Como titular dos dados, você tem o direito de, a qualquer momento, mediante requisição:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Confirmar a existência de tratamento de seus dados;</li>
            <li>Acessar seus dados;</li>
            <li>Solicitar a correção de dados incompletos, inexatos ou desatualizados;</li>
            <li>Solicitar a eliminação dos dados tratados com o seu consentimento.</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground">7. Contato</h2>
          <p>Se você tiver qualquer dúvida sobre esta Política de Privacidade ou quiser exercer seus direitos, por favor, entre em contato conosco através do email de suporte ou via WhatsApp disponível em nosso site.</p>
        </div>
      </div>
    </div>
  );
}
