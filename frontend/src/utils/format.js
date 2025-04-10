export const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  export const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };
  
  export const getCategoryColor = (category) => {
    const colors = {
      'Trabalho': 'primary',
      'Moradia': 'warning',
      'Alimentação': 'secondary',
      'Transporte': 'info',
      'Saúde': 'negative',
      'Lazer': 'pink',
      'Outros': 'gray'
    };
    
    return colors[category] || 'gray';
  };