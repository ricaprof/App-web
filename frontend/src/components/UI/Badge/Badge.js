import React from 'react';
import './Badge.css';

const Badge = ({ category }) => {
  // Mapeia categorias para cores
  const getCategoryClass = (cat) => {
    const categories = {
      'Trabalho': 'work',
      'Moradia': 'housing',
      'Alimentação': 'food',
      'Transporte': 'transport',
      'Saúde': 'health',
      'Lazer': 'leisure',
      'Outros': 'other'
    };
    return categories[cat] || 'other';
  };

  return (
    <span className={`badge badge--${getCategoryClass(category)}`}>
      {category}
    </span>
  );
};

export default Badge;