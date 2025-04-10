import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';


const Test = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Simula o carregamento de transações (substituirá a chamada à API)
  useEffect(() => {
    const mockTransactions = [
      { id: '1', amount: 100, date: '2025-04-01', category: 'Food' },
      { id: '2', amount: -50, date: '2025-04-02', category: 'Transport' },
      { id: '3', amount: 200, date: '2025-04-03', category: 'Salary' },
    ];
    setTransactions(mockTransactions);
    setFilteredTransactions(mockTransactions);
  }, []);

  // Função para filtrar transações por data
  const handleFilter = () => {
    const filtered = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      return (
        (!start || transactionDate >= start) &&
        (!end || transactionDate <= end)
      );
    });
    setFilteredTransactions(filtered);
  };

  // Dados para o gráfico
  const chartData = {
    labels: filteredTransactions.map((t) => new Date(t.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Gastos ao longo do tempo',
        data: filteredTransactions.map((t) => t.amount),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div>
      <h1>Dashboard de Gastos</h1>
      <div className="filter-container">
        <label>
          Data Inicial:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          Data Final:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <button onClick={handleFilter}>Filtrar</button>
      </div>
      <div className="chart-container">
        {filteredTransactions.length > 0 ? (
          <Line data={chartData} />
        ) : (
          <p>Nenhuma transação encontrada para o período selecionado.</p>
        )}
      </div>
    </div>
  );
};

export default Test;