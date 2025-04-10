import React from 'react';
import './SummaryCard.css';

const SummaryCard = ({ title, value, type, icon }) => {
  return (
    <div className={`summary-card summary-card--${type}`}>
      <div className="summary-card__icon">
        <span className="summary-card__emoji">{icon}</span>
      </div>
      <div className="summary-card__info">
        <h3 className="summary-card__title">{title}</h3>
        <p className="summary-card__value">{value}</p>
      </div>
    </div>
  );
};

export default SummaryCard;