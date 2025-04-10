import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Calendar, ChevronDown, DollarSign, CreditCard, TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react';
import './Manageee.css'
import Intro from './Intro';
import Footer from '../components/Footer/footer';
import TransactionForm from '../components/UI/Modal/TransactionForm';
import { color } from 'chart.js/helpers';

// Registramos os componentes necessários do Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

// Componente principal do Dashboard
const Dashboard = () => {
  // Estados para controlar filtros e dados
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getMonth() - 3);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [categories, setCategories] = useState(['Todos']);
  const [selectedCategories, setSelectedCategories] = useState(['Todos']);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [refresh, setRefresh] = useState(0);

  // Buscar transações da API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // URL com parâmetros de filtro
        const url = `http://localhost:8801/getTransactions?startDate=${startDate}&endDate=${endDate}`;
        
        const response = await fetch(url);
        
        
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(data)
        
        if (!Array.isArray(data)) {
          throw new Error('Formato de dados inválido');
        }
        
        setTransactions(data);
        
        // Extrair categorias únicas dos dados
        const uniqueCategories = [...new Set(data.map(item => item.categoria))];
        setCategories(['Todos', ...uniqueCategories]);
        
      } catch (err) {
        console.error('Falha ao carregar transações:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [startDate, endDate, refresh]);

  // Processar transações para gerar dados dos gráficos
  const processTransactions = () => {
    if (!transactions || transactions.length === 0) return null;
    
    // Filtrar transações por categorias selecionadas
    const filteredTransactions = selectedCategories.includes('Todos')
      ? transactions
      : transactions.filter(t => selectedCategories.includes(t.categoria));
    
// Preparar dados para os gráficos
const days = [];
const startDateObj = new Date(startDate);
const endDateObj = new Date(endDate);

// Gerar array de dias entre startDate e endDate
let currentDate = new Date(startDateObj);
while (currentDate <= endDateObj) {
  days.push(currentDate.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: 'short' 
  }));
  currentDate.setDate(currentDate.getDate() + 1);
}

// Inicializar estrutura de dados
const categoriesData = {};
const uniqueCategories = [...new Set(filteredTransactions.map(t => t.categoria))];

uniqueCategories.forEach(cat => {
  categoriesData[cat] = Array(days.length).fill(0);
});

// Agrupar transações por dia e categoria
filteredTransactions.forEach(transaction => {
  const transDate = new Date(transaction.data);
  const dayMonthStr = transDate.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: 'short' 
  });
  const dayIndex = days.indexOf(dayMonthStr);
  
  if (dayIndex !== -1) {
    categoriesData[transaction.categoria][dayIndex] += transaction.valor;
  }
});
    
    // Dados para o gráfico de pizza
    const pieData = {};
    uniqueCategories.forEach(cat => {
      const total = filteredTransactions
        .filter(t => t.categoria === cat)
        .reduce((sum, t) => sum + t.valor , 0);
      pieData[cat] = Math.abs(total); // Valor absoluto para o gráfico de pizza
    });
    
    // Calcular totais para o resumo
    const totalIncome = filteredTransactions
      .filter(t => t.valor > 0)
      .reduce((sum, t) => sum + t.valor , 0);
      
    const totalExpense = filteredTransactions
      .filter(t => t.valor < 0)
      .reduce((sum, t) => sum + Math.abs(t.valor ), 0);
      
    const balance = totalIncome - totalExpense;
    
    // Estatísticas por categoria
    const categoryStats = uniqueCategories.map(category => {
      const total = filteredTransactions
        .filter(t => t.categoria === category)
        .reduce((sum, t) => sum + t.valor , 0);
        
      return {
        category,
        total,
        isExpense: total < 0,
        value: Math.abs(total)
      };
    }).sort((a, b) => Math.abs(b.total) - Math.abs(a.total));
    
    return {
      labels: days,
      datasets: categoriesData,
      pieData,
      summary: {
        income: totalIncome,
        expense: totalExpense,
        balance,
        categoryStats
      }
    };
  };

  const chartData = processTransactions();

  // Preparar dados conforme categorias selecionadas
  const prepareChartData = () => {
    if (!chartData) return null;
    
    const filteredCategories = selectedCategories.includes('Todos') 
      ? Object.keys(chartData.datasets) 
      : selectedCategories;
    
    const lineChartData = {
      labels: chartData.labels,
      datasets: filteredCategories.map((category, index) => ({
        label: category,
        data: chartData.datasets[category],
        borderColor: getColor(index),
        backgroundColor: getColorWithOpacity(index, 0.2),
        tension: 0.4,
        fill: true,
      }))
    };

    const groupedByDateAndCategory = {};

    transactions
      .filter(t =>
        selectedCategories.length === 0 ||
        selectedCategories.includes(t.categoria) ||
        selectedCategories.includes('Todos')
      )
      .forEach(t => {
        const date = new Date(t.data).toISOString().split('T')[0]; // formato YYYY-MM-DD
        const categoria = t.categoria;
    
        if (!groupedByDateAndCategory[categoria]) {
          groupedByDateAndCategory[categoria] = {};
        }
    
        groupedByDateAndCategory[categoria][date] = (groupedByDateAndCategory[categoria][date] || 0) + 1;
      });

      const allDatesSet = new Set();
Object.values(groupedByDateAndCategory).forEach(dateMap => {
  Object.keys(dateMap).forEach(date => allDatesSet.add(date));
});
const allDates = Array.from(allDatesSet).sort();

const tentativa = {
  labels: allDates,
  datasets: Object.entries(groupedByDateAndCategory).map(([categoria, dateMap], index) => ({
    label: categoria,
    data: allDates.map(date => dateMap[date] || 0), // preenche com 0 onde não tem valor
    backgroundColor: getColorWithOpacity(index, 0.4),
    borderColor: getColor(index),
    borderWidth: 2,
    fill: false,
    tension: 0.4,
  }))
};



    const barChartData = {
      labels: chartData.labels,
      datasets: filteredCategories.map((category, index) => ({
        label: category,
        data: chartData.datasets[category],
        backgroundColor: getColorWithOpacity(index, 0.7),
        borderColor: getColor(index),
        borderWidth: 1,
      }))
    };
    
    const pieChartData = {
      labels: filteredCategories,
      datasets: [{
        data: filteredCategories.map(cat => chartData.pieData[cat] || 0),
        backgroundColor: filteredCategories.map((_, index) => getColor(index)),
        borderColor: '#1e1e2f',
        borderWidth: 2,
      }]
    };
    
    return { tentativa,lineChartData, barChartData, pieChartData };
  };

  // Função para gerar cores diferentes por categoria
  const getColor = (index) => {
    const colors = ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40', '#4c72b0', '#55a868', '#c44e52', '#8172b3'];
    return colors[index % colors.length];
  };
  
  // Função para gerar cores com opacidade
  const getColorWithOpacity = (index, opacity) => {
    const colors = [
      `rgba(255, 99, 132, ${opacity})`,
      `rgba(54, 162, 235, ${opacity})`,
      `rgba(255, 206, 86, ${opacity})`,
      `rgba(75, 192, 192, ${opacity})`,
      `rgba(153, 102, 255, ${opacity})`,
      `rgba(255, 159, 64, ${opacity})`,
      `rgba(76, 114, 176, ${opacity})`,
      `rgba(85, 168, 104, ${opacity})`,
      `rgba(196, 78, 82, ${opacity})`,
      `rgba(129, 114, 179, ${opacity})`
    ];
    return colors[index % colors.length];
  };

  // Configurações dos gráficos
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            family: 'Inter, sans-serif',
            size: 12
          },
          boxWidth: 15,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.9)',
        bodyFont: {
          family: 'Inter, sans-serif'
        },
        titleFont: {
          family: 'Inter, sans-serif',
          size: 14
        },
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            let value = context.raw;
            if (value !== null) {
              return `${context.dataset.label}: R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }
            return '';
          }
        }
      }
    },
    scales: {
      responsive: true,
    maintainAspectRatio: false,
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
          callback: function(value) {
            return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          }
        }
      }
    }
  };

  const options2 = {
    
    maintainAspectRatio: false,
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'},
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
          callback: function(value) {
            return Number.isInteger(value) ? value : null;
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'},

        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
          callback: function(value, index, ticks) {
            const date = new Date(this.getLabelForValue(value));
            return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
          }
        }
      }
    }
  };
  

  // Configurações para o gráfico de pizza
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            family: 'Inter, sans-serif',
            size: 12
          },
          boxWidth: 15,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.9)',
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
            const value = context.raw;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${percentage}%)`;
          }
        }
      }
    }
  };

  // Toggle para seleção de categorias
  const toggleCategory = (category) => {
    if (category === 'Todos') {
      setSelectedCategories(['Todos']);
      return;
    }
    
    const newSelection = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories.filter(c => c !== 'Todos'), category];
    
    // Se nenhuma categoria selecionada, volta para 'Todos'
    if (newSelection.length === 0) {
      setSelectedCategories(['Todos']);
    } else {
      setSelectedCategories(newSelection);
    }
  };

  const preparedChartData = prepareChartData();

  // Formatador de moeda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleRefresh = () => {
    setRefresh(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 font-sans">
      <style jsx global>{`
      
        
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
body {

  display: flex;
  flex-direction: column;
  min-height: 100vh;



}

#root{
min-height: 100vh;}

* {
  box-sizing: border-box;
    margin: 0;
padding: 0;
box-sizing: border-box;
}

.gradient-text {
  background: linear-gradient(45deg, #3b82f6, #60a5fa);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}


.text-red-400 {
    color: var(--danger-color);
  }
  
  .border {
    border-width: 1px;
    border-style: solid;
  }
  
  /* Tabela */
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th {
    text-align: left;
    padding: 0.5rem;
    color: var(--text-muted);
    font-weight: normal;
  }
  
  td {
    padding: 0.5rem;
    font-size: 0.875rem;
  }
  
  .border-b {
    border-bottom: 1px solid var(--border-dark);
  }
  
  tr.hover\:bg-gray-700:hover {
    background-color: var(--bg-card-hover);
  }
  
  .text-right {
    text-align: right;
  }
  
  .text-left {
    text-align: left;
  }
  
  /* Badges */
  .px-2 {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  
  .py-1 {
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
  }
  
  .text-xs {
    font-size: 0.75rem;
  }
  
  main {
  
       margin: auto;
    width: 50%;
    border: 3px solid green;
    padding: 10px;
      
      background-color: var(--surface);
      border-radius: var(--radius-lg);
   
      box-shadow: var(--shadow-md);
      border: 2px var(--bg-dark);
      width: 70%;
  }
  
  
  
  
  /* Media queries */
  @media (min-width: 768px) {
    .md\:grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    
    .md\:grid-cols-3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
  
  @media (min-width: 1024px) {
    .lg\:grid-cols-3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    
    .lg\:grid-cols-4 {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
    
    .lg\:col-span-2 {
      grid-column: span 2 / span 2;
    }
    
    .lg\:col-span-3 {
      grid-column: span 3 / span 3;
    }
  }
  
  .col-span-1 {
    grid-column: span 1 / span 1;
  }
  
  .overflow-x-auto {
    overflow-x: auto;
  }
  
  .mb-1 {
    margin-bottom: 0.25rem;
  }
  
  .mb-2 {
    margin-bottom: 0.5rem;
  }
  
  .mb-4 {
    margin-bottom: 1rem;
  }
  
  .mt-8 {
    margin-top: 2rem;
  }
  
  .space-x-3 > * + * {
    margin-left: 0.75rem;
  }
  
  /* Componentes adicionais */
  .w-3 {
    width: 0.75rem;
    }
    
    .h-3 {
      height: 0.75rem;
      }
      
      .justify-between {
        justify-content: space-between;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .h-64 {
            height: 16rem;
          }
          
          .justify-center {
            justify-content: center;
          }
          
          /* Mensagens de erro */
          .bg-red-900 {
            background-color: var(--danger-bg);
          }
          
          .border-red-500 {
            border-color: var(--danger-color);
          }
          
          .text-red-300 {
            color: #fca5a5;
          }
          

          .max-w-7xl {
            max-width: 80rem;
            margin-left: auto;
            margin-right: auto;
          }
          
          /* Cabeçalho */
          
          
          .gradient-text {
            background: linear-gradient(90deg, var(--blue-color), var(--primary-color));
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            font-size: 1.875rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
          }
          
          header p {
            color: var(--text-muted);
            margin-top: 0;
          }
          
          /* Botões */
          .btn {
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 0.5rem;
            padding: 0.5rem 1rem;
            cursor: pointer;
            transition: background-color 0.2s;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          
          .btn:hover {
            background-color: var(--primary-hover);
          }
          
          .refresh-button {
            background-color: var(--primary-color);
            border: none;
            border-radius: 9999px;
            color: white;
            width: 2.5rem;
            height: 2.5rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s;
          }
          
          .refresh-button:hover {
            background-color: var(--primary-hover);
          }
          
          /* Área de filtros */
          
          
          
          
          .mb-8 {
            margin-bottom: 2rem;
          }
          
          .flex {
            display: flex;
          }
          
          .flex-wrap {
            flex-wrap: wrap;
          }
          
          .gap-4 {
            gap: 1rem;
          }
          
          .gap-2 {
            gap: 0.5rem;
          }
          
          .items-center {
            align-items: center;
          }
          
          .space-x-2 > * + * {
            margin-left: 0.5rem;
          }
          
          .text-blue-400 {
            color: var(--blue-color);
          }
          
          .text-gray-300 {
            color: var(--text-light);
          }
          
          .text-gray-400 {
            color: var(--text-muted);
          }
          
          .self-center {
            align-self: center;
          }
          
          .ml-auto {
            margin-left: auto;
          }
          
          /* Inputs e formulários */
          .date-input {
            background-color: var(--bg-dark);
            border: 1px solid var(--border-dark);
            border-radius: 0.375rem;
            color: var(--text-light);
            padding: 0.5rem;
            outline: none;
          }
          
          .date-input:focus {
            border-color: var(--primary-color);
          }
          
          /* Dropdown */
          .relative {
            position: relative;
          }
          
          .dropdown-menu {
            position: absolute;
            right: 0;
            margin-top: 0.5rem;
            width: 14rem;
            background-color: var(--bg-card);
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 10;
            border: 1px solid var(--black);
          }
          
          .custom-checkbox {
            display: flex;
            align-items: center;
            padding: 0.5rem;
            cursor: pointer;
            color: var(--text-light);
            transition: background-color 0.2s;
          }
          
          .custom-checkbox:hover {
            background-color: var(--bg-card-hover);
          }
          
          .checkbox-indicator {
            width: 1rem;
            height: 1rem;
            border-radius: 0.25rem;
            margin-right: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          /* Grid layout */
          .grid {
            display: grid;
          }
          
          .grid-cols-1 {
            grid-template-columns: repeat(1, minmax(0, 1fr));
          }
          
          /* Cards */
          .card {
            background-color: var(--bg-card);
            border-radius: 0.5rem;
            padding: 1rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s, box-shadow 0.3s;
            margin-bottom: 1.5rem;
          }
          
          .card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }
          
          .income-card {
            background-color: var(--bg-card);
            border-left: 4px solid var(--success-color);
          }
          
          .expense-card {
            background-color: var(--bg-card);
            border-left: 4px solid var(--danger-color);
          }
          
          .balance-card {
            background-color: var(--bg-card);
            border-left: 4px solid var(--blue-color);
          }
          
          /* Tipografia */
          .text-sm {
            font-size: 0.875rem;
          }
          
          .text-xl {
            font-size: 1.25rem;
          }
          
          .text-2xl {
            font-size: 1.5rem;
          }
          
          .text-3xl {
            font-size: 1.875rem;
          }
          
          .font-bold {
            font-weight: 700;
          }
          
          .font-semibold {
            font-weight: 600;
          }
          
          .font-medium {
            font-weight: 500;
          }
          
          .text-green-400 {
            color: var(--success-color);
          }
          
          .text-red-400 {
            color: var(--danger-color);
          }
          
          .text-gray-200 {
            color: #e5e7eb;
          }
          
          /* Ícones */
          .p-3 {
            padding: 0.75rem;
          }
          
          .bg-green-900 {
            background-color: var(--success-bg);
          }
          
          .bg-red-900 {
            background-color: var(--danger-bg);
          }
          
          .bg-blue-900 {
            background-color: var(--blue-bg);
          }
          
          .bg-opacity-20 {
            opacity: 0.8;
          }
          
          .rounded-full {
            border-radius: 9999px;
          }
          
          /* Áreas de gráficos */
          .chart-container {
            height: 300px;
            width: 100%;
          }
          
          /* Loader */
          .loader {
            border: 4px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            border-top: 4px solid var(--primary-color);
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .refresh-button {
            transition: transform 0.3s ease;
          }
          
          .refresh-button:hover {
            transform: rotate(180deg);
          }
          
          /* Botões */
          .btn {
            transition: all 0.2s;
          }
          
          .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          }
          
          .btn:active {
            transform: translateY(1px);
          }
          
          /* Inputs customizados */
          .date-input {
            background-color: rgba(31, 41, 55, 0.8);
            border: 1px solid rgba(75, 85, 99, 0.5);
            border-radius: 6px;
            padding: 8px 12px;
            font-size: 14px;
            color: white;
            transition: all 0.2s;
          }
          
          .date-input:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
            outline: none;
          }
            /* Estilos gerais */
  :root {
    --primary-color: #3b82f6;
    --primary-hover: #2563eb;
    --success-color: #4ade80;
    --success-bg: rgba(16, 185, 129, 0.2);
    --danger-color: #f87171;
    --danger-bg: rgba(220, 38, 38, 0.2);
    --blue-color: #60a5fa;
    --blue-bg: rgba(59, 130, 246, 0.2);
    --text-light: #f3f4f6;
    --text-muted: #9ca3af;
    --bg-dark: #111827;
    --bg-card: #1f2937;
    --bg-card-hover: #374151;
    --border-dark: #374151;
    --black: #000000;
  }
  
      
        /* Estilizar checkbox customizado */
        .custom-checkbox {
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 4px;
          transition: all 0.2s;
        }
        
        .custom-checkbox:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .checkbox-indicator {
          width: 18px;
          height: 18px;
          border-radius: 4px;
          margin-right: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        
        /* Loader animado */
        .loader {
          width: 48px;
          height: 48px;
          border: 5px solid rgba(59, 130, 246, 0.3);
          border-radius: 50%;
          border-top-color: rgba(59, 130, 246, 1);
          animation: spin 1s linear infinite;
        }
        
  



      `}</style>
    
        


        <Intro></Intro>
       <br></br>
      <main>
        
      <div className="max-w-7xl mx-auto" style={{ backgroundColor: '#16213e' }}>
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 gradient-text">Dashboard Financeiro</h1>
            <p className="text-gray-400">Visualize e analise seus dados financeiros por Data</p>
          </div>
          
          <button 
            onClick={handleRefresh}
            className="p-2 bg-blue-600 rounded-full hover:bg-blue-700 refresh-button"
            title="Atualizar dados"
            >
            <RefreshCcw size={20} />
          </button>
        </header>
        
        {/* Filtros */}
        <div className="bg-gray-800 rounded-lg p-4 mb-8 flex flex-wrap gap-4 items-center shadow-lg">
          <div className="flex items-center space-x-2">
            <Calendar className="text-blue-400" size={20} />
            <span className="text-gray-300">Período:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <input
              type="date"
              className="date-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              />
            <span className="text-gray-400 self-center">até</span>
            <input
              type="date"
              className="date-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              />
          </div>
          
          <div className="relative ml-auto">
            <button 
              className="flex items-center bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 space-x-2 transition duration-200 btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              >
              <span>Categorias</span>
              <ChevronDown size={16} />
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-lg z-10 border border-gray-700 dropdown-menu">
                <div className="p-2">
                  {categories.map(category => (
                    <div 
                    key={category} 
                    className="custom-checkbox"
                    onClick={() => toggleCategory(category)}
                    >
                      <div className={`checkbox-indicator ${selectedCategories.includes(category) ? 'bg-blue-500 border-blue-500' : 'border-2 border-gray-500'}`}>
                        {selectedCategories.includes(category) && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <span>{category}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Cards de resumo */}
          {!loading && chartData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="income-card rounded-lg p-4 shadow-lg card">
                <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm mb-1">Receitas</p> 
              <h3 className="text-2xl font-bold text-green-400">{formatCurrency(chartData.summary.income)}</h3>
            </div>
            <div className="p-3 bg-green-900 bg-opacity-20 rounded-full">
              <TrendingUp className="text-green-400" size={24} />
            </div>
                </div>
              </div>
              
              <div className="expense-card rounded-lg p-4 shadow-lg card">
                <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm mb-1">Despesas</p>
              <h3 className="text-2xl font-bold text-red-400">{formatCurrency(chartData.summary.expense)}</h3>
            </div>
            <div className="p-3 bg-red-900 bg-opacity-20 rounded-full">
              <TrendingDown className="text-red-400" size={24} />
            </div>
                </div>
              </div>
              
              <div className="balance-card rounded-lg p-4 shadow-lg card">
                <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm mb-1">Saldo</p>
              <h3 className={`text-2xl font-bold ${chartData.summary.balance >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                {formatCurrency(chartData.summary.balance)}
              </h3>
            </div>
            <div className="p-3 bg-blue-900 bg-opacity-20 rounded-full"> 
              <DollarSign className="text-blue-400" size={24} />
            </div>
                </div>
              </div>
            </div>
          )}

        

          <TransactionForm></TransactionForm>
        {error && (
          <div className="bg-red-900 bg-opacity-20 border border-red-500 text-red-300 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-red-400 mb-1">Erro ao carregar dados</h3>
            <p>{error}</p>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Gráfico de Linha */}
            <div className="bg-gray-800 rounded-lg p-4 shadow-lg col-span-1 lg:col-span-2 card">
              <h2 className="text-xl font-semibold mb-4 text-gray-200">Volume Diário</h2>
              <div className="chart-container">
                {preparedChartData && <Line data={preparedChartData.tentativa} options={options2} />}
              </div>
            </div>


                        {/* Gráfico de Linha */}
                        <div className="bg-gray-800 rounded-lg p-4 shadow-lg col-span-1 lg:col-span-2 card">
              <h2 className="text-xl font-semibold mb-4 text-gray-200">Valor Diário</h2>
              <div className="chart-container">
                {preparedChartData && <Line data={preparedChartData.lineChartData} options={options} />}
              </div>
            </div>
            
            {/* Gráfico de Pizza */}
            <div className="bg-gray-800 rounded-lg p-4 shadow-lg card">
              <h2 className="text-xl font-semibold mb-4 text-gray-200">Distribuição por Categoria</h2>
              <div className="chart-container">
                {preparedChartData && <Pie data={preparedChartData.pieChartData} options={pieOptions} />}
              </div>
            </div>
            
            {/* Gráfico de Barras */}
            <div className="bg-gray-800 rounded-lg p-4 shadow-lg col-span-1 lg:col-span-3 card">
              <h2 className="text-xl font-semibold mb-4 text-gray-200">Comparação por Período</h2>
              <div className="chart-container">
                {preparedChartData && <Bar data={preparedChartData.barChartData} options={options} />}
              </div>
            </div>
          </div>
                )}

        {/* Contagem de categorias */}
        {!loading && transactions.length > 0 && (
          <div className="mt-8 bg-gray-800 rounded-lg p-4 shadow-lg"> 
            <h2 className="text-xl font-semibold mb-4 text-gray-200">Contagem por Categoria: ({transactions.length} ao total)</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(
                transactions
                  .filter(t =>
                    selectedCategories.length === 0 || selectedCategories.includes(t.categoria) || selectedCategories.includes('Todos')
                  )
                  .reduce((acc, t) => {
                    acc[t.categoria] = (acc[t.categoria] || 0) + 1;
                    return acc;
                  }, {})
              ).map(([categoria, count], index) => (
                <div key={categoria} className="bg-gray-700 rounded-lg p-4 flex items-center space-x-3 card">
                  <div className="p-3 rounded-full" style={{ backgroundColor: getColorWithOpacity(index, 0.2) }}>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getColor(index) }}></div>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-400">{categoria}</h3>
                    <p className="text-xl font-semibold text-blue-400">
                      {count} transação{count > 1 ? 'es' : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


    

        {/* Resumo por categoria */}
        {!loading && chartData && (
          <div className="mt-8 bg-gray-800 rounded-lg p-4 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-200">Valor por Categoria</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {chartData.summary.categoryStats.map((item, index) => (
                <div key={item.category} className="bg-gray-700 rounded-lg p-4 flex items-center space-x-3 card">
                  <div className="p-3 rounded-full" style={{ backgroundColor: getColorWithOpacity(index, 0.2) }}>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getColor(index) }}></div>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-400">{item.category}</h3>
                    <p className={`text-xl font-semibold ${item.isExpense ? 'text-red-400' : 'text-green-400'}`}>
                      {formatCurrency(item.total)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Últimas transações */}
        {!loading && transactions.length > 0 && (
          <div className="mt-8 bg-gray-800 rounded-lg p-4 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-200">Últimas Transações</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-2 text-gray-400">Data</th>
                    <th className="text-left p-2 text-gray-400">Descrição</th>
                    <th className="text-left p-2 text-gray-400">Categoria</th>
                    <th className="text-right p-2 text-gray-400">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 5).map((transaction, index) => (
                    <tr key={transaction.id_gastos} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="p-2 text-sm">{new Date(transaction.data).toLocaleDateString('pt-BR')}</td>
                      <td className="p-2 text-sm">{transaction.descricao}</td>
                      <td className="p-2 text-sm">
                        <span 
                          className="px-2 py-1 rounded-full text-xs"
                          style={{ 
                            backgroundColor: getColorWithOpacity(categories.indexOf(transaction.categoria), 0.2),
                            color: getColor(categories.indexOf(transaction.categoria))
                          }}
                          >
                          {transaction.categoria}
                        </span>
                      </td>
                      <td className={`p-2 text-sm text-right font-medium ${transaction.valor >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatCurrency(transaction.valor )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
       
      </div>
        </main>
        <Footer></Footer>
    </div>
  );
};

export default Dashboard;