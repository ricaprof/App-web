import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

const DarkThemeLayout = ({ children }) => {
  return (
    <div className="footer-layout">
    
   


     

      {/* Footer */}
      <footer className="dark-footer">
        <div className="footer-content">
          <p>© 2023 FinanceControl - Todos os direitos reservados</p>
          <div className="footer-links">
            <Link to="/privacy">Política de Privacidade</Link>
            <Link to="/terms">Termos de Serviço</Link>
            <Link to="/contact">Contato</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DarkThemeLayout;