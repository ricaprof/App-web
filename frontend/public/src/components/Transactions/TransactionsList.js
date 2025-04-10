import React, { useEffect, useState } from 'react';
import TransactionItem from './TransactionItem';
import './Transactions.css';

const TransactionsList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortBy, setSortBy] = useState('date');
  const [filterCategory, setFilterCategory] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table', 'cards', 'list'
  const [groupBy, setGroupBy] = useState('none'); // 'none', 'category', 'month'

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:8801/getTransactions');
      
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Formato de dados inválido');
      }
      
      setTransactions(data);
    } catch (err) {
      console.error('Falha ao carregar transações:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8801/deleteTransaction/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Falha ao deletar transação');
      }
      
      setTransactions(prev => prev.filter(t => t.id_gastos !== id));
    } catch (err) {
      console.error('Erro ao deletar:', err);
      alert('Não foi possível deletar a transação');
    }
  };

  // Obtém categorias únicas para o filtro
  const uniqueCategories = ['all', ...new Set(transactions.map(t => t.categoria))];

  // Função para filtrar transações
  const filterTransactions = (transactions) => {
    return transactions.filter(transaction => {
      // Filtro por categoria
      const categoryMatch = filterCategory === 'all' || transaction.categoria === filterCategory;
      
      // Filtro por termo de busca
      const searchMatch = searchTerm === '' || 
        transaction.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.categoria.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro por período de data
      const dateMatch = isWithinDateRange(transaction.data, dateRange.start, dateRange.end);
      
      return categoryMatch && searchMatch && dateMatch;
    });
  };

  // Verifica se a data está dentro do intervalo selecionado
  const isWithinDateRange = (date, start, end) => {
    if (!start && !end) return true;
    
    const transactionDate = new Date(date);
    const startDate = start ? new Date(start) : null;
    const endDate = end ? new Date(end) : null;
    
    if (startDate && endDate) {
      return transactionDate >= startDate && transactionDate <= endDate;
    } else if (startDate) {
      return transactionDate >= startDate;
    } else if (endDate) {
      return transactionDate <= endDate;
    }
    
    return true;
  };

  // Função para agrupar transações
  const groupTransactions = (transactions) => {
    if (groupBy === 'none') return { 'Todas Transações': transactions };
    
    const grouped = {};
    
    if (groupBy === 'category') {
      transactions.forEach(t => {
        if (!grouped[t.categoria]) {
          grouped[t.categoria] = [];
        }
        grouped[t.categoria].push(t);
      });
    } else if (groupBy === 'month') {
      transactions.forEach(t => {
        const date = new Date(t.data);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        if (!grouped[monthYear]) {
          grouped[monthYear] = [];
        }
        grouped[monthYear].push(t);
      });
    }
    
    return grouped;
  };

  // Ordenação de transações
  const sortTransactions = (transactions) => {
    return [...transactions].sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.data) - new Date(b.data) 
          : new Date(b.data) - new Date(a.data);
      } else if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.descricao.localeCompare(b.descricao) 
          : b.descricao.localeCompare(a.descricao);
      } else if (sortBy === 'value') {
        return sortOrder === 'asc' 
          ? parseFloat(a.valor) - parseFloat(b.valor) 
          : parseFloat(b.valor) - parseFloat(a.valor);
      } else if (sortBy === 'category') {
        return sortOrder === 'asc' 
          ? a.categoria.localeCompare(b.categoria) 
          : b.categoria.localeCompare(a.categoria);
      }
      return 0;
    });
  };

  // Aplicar filtros e ordenação
  const filteredTransactions = filterTransactions(transactions);
  const groupedTransactions = groupTransactions(filteredTransactions);
  
  // Para cada grupo, ordenamos as transações
  Object.keys(groupedTransactions).forEach(key => {
    groupedTransactions[key] = sortTransactions(groupedTransactions[key]);
  });

  // Renderizar a visualização em tabel a
  const renderTableView = (transactions) => (
    <div className="transactions-table-container">
      <table className="transactions-table">
        <thead>
          <tr>
            <th onClick={() => setSortBy('date')} className={sortBy === 'date' ? 'active-sort' : ''}>
              Data {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => setSortBy('name')} className={sortBy === 'name' ? 'active-sort' : ''}>
              Descrição {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => setSortBy('category')} className={sortBy === 'category' ? 'active-sort' : ''}>
              Categoria {sortBy === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>

            <th onClick={() => setSortBy('value')} className={sortBy === 'value' ? 'active-sort' : ''}>
              Valor {sortBy === 'value' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>

            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <TransactionItem
              key={transaction.id_gastos}
              transaction={transaction}
              onDelete={handleDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );

  // Renderizar a visualização em cartões
  const renderCardsView = (transactions) => (
    <div className="transactions-cards">
      {transactions.map((transaction) => (
        <div key={transaction.id_gastos} className="transaction-card">
          <h3>{transaction.descricao}</h3>
          <div className="card-details">
            <p className="card-date">{new Date(transaction.data).toLocaleDateString()}</p>
            <p className="card-category">{transaction.categoria}</p>
            <p className="card-value">R$ {parseFloat(transaction.valor).toFixed(2)}</p>
          </div>
          <div className="card-actions">
            <button onClick={() => handleDelete(transaction.id_gastos)} className="delete-btn">Excluir</button>
          </div>
        </div>
      ))}
    </div>
  );

  // Renderizar a visualização em lista
  const renderListView = (transactions) => (
    <ul className="transactions-list">
      {transactions.map((transaction) => (
        <li key={transaction.id_gastos} className="transaction-list-item">
          <div className="list-item-content">
            <span className="list-item-date">{new Date(transaction.data).toLocaleDateString()}</span>
            <span className="list-item-desc">{transaction.descricao}</span>
            <span className="list-item-value">R$ {parseFloat(transaction.valor).toFixed(2)}</span>
            <span className="list-item-category">{transaction.categoria}</span>
          </div>
          <div className="list-item-actions">
            <button onClick={() => handleDelete(transaction.id_gastos)} className="delete-btn">Excluir</button>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="transactions-section">
    <h2 className="section-title">
      <span className="section-title__icon">📋</span>
      Últimas Transações
    </h2>
    <div className="transactions-container">
      <div className="controls-panel">
        <div className="controls-row">
          <div className="search-control">
            <input
              type="text"
              placeholder="Buscar transações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="view-modes">
            <button 
              className={`view-mode-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              Tabela
            </button>
            <button 
              className={`view-mode-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
            >
              Cartões
            </button>
            <button 
              className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              Lista
            </button>
          </div>
        </div>

        <div className="controls-row">
          <div className="filter-control">

            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="date">Data</option>
              <option value="name">Descrição</option>
              <option value="value">Valor</option>
              <option value="category">Categoria</option>
            </select>
          </div>
          
          <div className="sort-order">
            <button 
              className={`sort-button ${sortOrder === 'asc' ? 'active' : ''}`}
              onClick={() => setSortOrder('asc')}
            >
              Crescente
            </button>
            <button 
              className={`sort-button ${sortOrder === 'desc' ? 'active' : ''}`}
              onClick={() => setSortOrder('desc')}
            >
              Decrescente
            </button>
          </div>
          
          <div className="filter-control">

            <select
              id="filter-category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="category-select"
            >
              {uniqueCategories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Todas Categorias' : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="controls-row">
          <div className="date-range">
            <div className="date-input">
              <label htmlFor="start-date">Data inicial:</label>
              <input
                type="date"
                id="start-date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              />
            </div>
            <div className="date-input">
              <label htmlFor="end-date">Data final:</label>
              <input
                type="date"
                id="end-date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              />
            </div>
          </div>
          
          <div className="group-control">
            <select
              id="group-by"
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="group-select"
            >
              <option value="none">Sem agrupamento</option>
              <option value="category">Categoria</option>
              <option value="month">Mês</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Carregando transações...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>Erro ao carregar transações</p>
          <p className="error-detail">{error}</p>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="empty-state">
          <p>Nenhuma transação encontrada</p>
        </div>
      ) : (
        <div className="transactions-content">
          {Object.keys(groupedTransactions).map(group => (
            <div key={group} className="transaction-group">
              <h2 className="group-header">{group}</h2>
              {viewMode === 'table' && renderTableView(groupedTransactions[group])}
              {viewMode === 'cards' && renderCardsView(groupedTransactions[group])}
              {viewMode === 'list' && renderListView(groupedTransactions[group])}
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
};

export default TransactionsList;