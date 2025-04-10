import React from 'react';
import './footer_pages_links.css';

const TermsPage = () => {
  return (

      <div className="content-page">
        <h1 className="page-title">Termos de Serviço</h1>
        <div className="page-content">
          <section className="section-block">
            <h2 className="section-title">1. Aceitação dos Termos</h2>
            <p>Ao utilizar o FinanceControl, você concorda com estes Termos de Serviço e com nossa Política de Privacidade.</p>
          </section>

          <section className="section-block">
            <h2 className="section-title">2. Uso do Serviço</h2>
            <p>Você concorda em:</p>
            <ul className="styled-list">
              <li>Fornecer informações precisas e atualizadas</li>
              <li>Manter a segurança de sua conta</li>
              <li>Não utilizar o serviço para atividades ilegais</li>
              <li>Não reproduzir, duplicar ou comercializar nosso serviço</li>
            </ul>
          </section>

          <section className="section-block">
            <h2 className="section-title">3. Responsabilidades</h2>
            <p>O FinanceControl se compromete a:</p>
            <ul className="styled-list">
              <li>Manter o serviço disponível e seguro</li>
              <li>Proteger seus dados conforme nossa política</li>
              <li>Notificar sobre mudanças significativas</li>
            </ul>
            <p>No entanto, não garantimos:</p>
            <ul className="styled-list">
              <li>Disponibilidade ininterrupta do serviço</li>
              <li>Precisão absoluta dos cálculos financeiros</li>
              <li>Compatibilidade com todos os dispositivos</li>
            </ul>
          </section>

          <section className="section-block">
            <h2 className="section-title">4. Modificações</h2>
            <p>Podemos alterar estes Termos periodicamente. Alterações significativas serão comunicadas por e-mail ou através de avisos no aplicativo.</p>
          </section>

          <section className="section-block">
            <h2 className="section-title">5. Rescisão</h2>
            <p>Reservamo-nos o direito de suspender ou encerrar contas que violem estes Termos ou que sejam utilizadas de forma inadequada.</p>
          </section>

          <div className="last-update">
            <p>Última atualização: 15 de Novembro de 2023</p>
          </div>
        </div>
      </div>

  );
};

export default TermsPage;