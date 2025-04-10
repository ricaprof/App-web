import React from 'react';
import { FiDollarSign, FiPieChart, FiTrendingUp, FiShield, FiSmartphone, FiBarChart2 } from 'react-icons/fi';
import './Intro.css';
import './WelcomePage.css';
import Footer from '../components/Footer/footer'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import { useNavigate } from 'react-router-dom';



const WelcomePage = () => {
  
  const navigate = useNavigate();

  return (
    <div>
      <div className="welcome-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="gradient-text">Domine suas finanças</span> com inteligência
            </h1>
            <p className="hero-subtitle">
              A ferramenta definitiva para controle financeiro pessoal e tomada de decisões conscientes
            </p>
            <div className="cta-buttons">
            <button className="primary-button" onClick={() => navigate("/dashboard")}>Comece agora</button>
              <button className="secondary-button">Ver demonstração</button>
            </div>
          </div>
          <div className="hero-image">
            <div className="dashboard-preview"></div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2 className="section-title">
            <span className="highlight">Tudo que você precisa</span> em um só lugar
          </h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FiDollarSign size={32} />
              </div>
              <h3>Controle total</h3>
              <p>
                Registre todas suas receitas e despesas com categorização inteligente e relatórios detalhados
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FiPieChart size={32} />
              </div>
              <h3>Visualização clara</h3>
              <p>
                Gráficos e dashboards interativos que mostram exatamente para onde seu dinheiro está indo
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FiTrendingUp size={32} />
              </div>
              <h3>Metas financeiras</h3>
              <p>
                Defina objetivos e acompanhe seu progresso com alertas e recomendações personalizadas
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FiShield size={32} />
              </div>
              <h3>Segurança</h3>
              <p>
                Seus dados protegidos com criptografia de ponta a ponta e autenticação de dois fatores
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FiSmartphone size={32} />
              </div>
              <h3>Acesso multiplataforma</h3>
              <p>
                Disponível na web e em breve em aplicativo móvel para você acompanhar de qualquer lugar
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FiBarChart2 size={32} />
              </div>
              <h3>Relatórios avançados</h3>
              <p>
                Exporte seus dados em múltiplos formatos e receba insights sobre seus hábitos financeiros
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section">
          <h2 className="section-title">
            O que nossos <span className="highlight">usuários dizem</span>
          </h2>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                "Finalmente consegui organizar minhas finanças! Em 3 meses já economizei 30% mais do que antes."
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">A</div>
                <div className="author-info">
                  <strong>Ana Silva</strong>
                  <span>Usuária desde 2022</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                "A funcionalidade de metas transformou como eu lido com dinheiro. Alcançei meu primeiro objetivo em 2 meses!"
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">R</div>
                <div className="author-info">
                  <strong>Roberto Costa</strong>
                  <span>Usuário desde 2023</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="final-cta">
          <h2>Pronto para transformar sua vida financeira?</h2>
          <p>
            Cadastre-se agora e tenha controle total sobre seu dinheiro em menos de 5 minutos
          </p>
          <button className="primary-button large">Criar minha conta gratuita</button>
        </section>

        
      </div>
        <Footer></Footer>

    </div>



  );
};

export default WelcomePage;