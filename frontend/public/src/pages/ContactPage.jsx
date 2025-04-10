import React from 'react';
import './footer_pages_links.css';

const ContactPage = () => {
  return (

      <div className="content-page">
        <h1 className="page-title">Fale Conosco</h1>
        <div className="contact-container">
          <div className="contact-info">
            <h2 className="section-title">Informações de Contato</h2>
            
            <div className="contact-card">
              <div className="contact-icon">📧</div>
              <div>
                <h3>E-mail</h3>
                <p>contato@financecontrol.com</p>
                <p>suporte@financecontrol.com</p>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-icon">📱</div>
              <div>
                <h3>Telefone</h3>
                <p>(11) 98765-4321 (WhatsApp)</p>
                <p>(11) 4004-4004 (Comercial)</p>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-icon">🏢</div>
              <div>
                <h3>Endereço</h3>
                <p>Av. Paulista, 1000 - 10º andar</p>
                <p>Bela Vista, São Paulo - SP</p>
                <p>CEP: 01310-100</p>
              </div>
            </div>
          </div>

          <div className="contact-form">
            <h2 className="section-title">Envie sua Mensagem</h2>
            <form>
              <div className="form-group">
                <label htmlFor="name">Nome</label>
                <input type="text" id="name" placeholder="Seu nome completo" />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input type="email" id="email" placeholder="seu@email.com" />
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Assunto</label>
                <select id="subject">
                  <option value="">Selecione...</option>
                  <option value="support">Suporte Técnico</option>
                  <option value="suggestions">Sugestões</option>
                  <option value="business">Parcerias Comerciais</option>
                  <option value="other">Outros</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Mensagem</label>
                <textarea id="message" rows="5" placeholder="Escreva sua mensagem aqui..."></textarea>
              </div>
              
              <button type="submit" className="submit-button">
                Enviar Mensagem
              </button>
            </form>
          </div>
        </div>
      </div>
    
  );
};

export default ContactPage;