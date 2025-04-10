import React from 'react';
import './footer_pages_links.css'; // Importa o CSS corretamente

export const PrivacyPage = () => {
  return (
    <div className="content-page">
      <h1 className="page-title">Política de Privacidade</h1>
      <div className="page-content">
        <section className="section-block">
          <h2 className="section-title">1. Introdução</h2>
          <p>
            Nós da FinanceControl levamos sua privacidade a sério. Esta política
            descreve como coletamos, usamos e protegemos suas informações
            pessoais quando você utiliza nossos serviços.
          </p>
        </section>

        <section className="section-block">
          <h2 className="section-title">2. Dados Coletados</h2>
          <p>Podemos coletar as seguintes informações:</p>
          <ul className="styled-list">
            <li>Informações de cadastro (nome, e-mail)</li>
            <li>Dados de transações financeiras</li>
            <li>Informações de dispositivo e acesso</li>
            <li>Cookies e dados de navegação</li>
          </ul>
        </section>

        <section className="section-block">
          <h2 className="section-title">3. Uso dos Dados</h2>
          <p>Utilizamos seus dados para:</p>
          <ul className="styled-list">
            <li>Fornecer e melhorar nossos serviços</li>
            <li>Personalizar sua experiência</li>
            <li>Garantir a segurança da plataforma</li>
            <li>Cumprir obrigações legais</li>
          </ul>
        </section>

        <section className="section-block">
          <h2 className="section-title">4. Compartilhamento</h2>
          <p>Não vendemos seus dados. Podemos compartilhar informações apenas:</p>
          <ul className="styled-list">
            <li>Com prestadores de serviços essenciais</li>
            <li>Por exigência legal</li>
            <li>Com seu consentimento explícito</li>
          </ul>
        </section>

        <section className="section-block">
          <h2 className="section-title">5. Seus Direitos</h2>
          <p>Você tem direito a:</p>
          <ul className="styled-list">
            <li>Acessar seus dados pessoais</li>
            <li>Solicitar correção ou exclusão</li>
            <li>Revogar consentimentos</li>
            <li>Opor-se a determinados processamentos</li>
          </ul>
        </section>

        <div className="last-update">
          <p>Última atualização: 15 de Novembro de 2023</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;