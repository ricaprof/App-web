import React from 'react';
import Button from '../UI/Button/Button';
import { FiPlus } from 'react-icons/fi';
import './Header.css';

const Header = ({ onAddTransaction }) => {
  return (
    <header className="header">
      <div className="header__content">
        <h1 className="header__title">
          <span className="header__icon">💰</span>
          Meu Financeiro
        </h1>
        <Button 
          variant="primary" 
          size="medium"
          icon={<FiPlus />}
          onClick={onAddTransaction}
        >
          Nova Transação
        </Button>
      </div>
    </header>
  );
};

export default Header;