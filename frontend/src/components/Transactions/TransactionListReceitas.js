import React, { useEffect, useState } from 'react';
import TransactionItem from './TransactionItem';
import './Transactions.css';

const TransactionsList = () => {
  const [transactions, setTransactions] = useState([]); // Estado para armazenar as transações
  const [loading, setLoading] = useState(true); // Estado para indicar carregamento
  const [error, setError] = useState(null); // Estado para erros

  // Função para buscar transações do backend
  const fetchTransactions = async () => {
    try {
      setLoading(true); // Inicia o estado de carregamento
      const response = await fetch('http://localhost:8801/getTransactions'); // Endpoint para buscar transações
      if (!response.ok) {
        throw new Error('Erro ao buscar transações');
      }
      const data = await response.json();
      setTransactions(data); // Atualiza o estado com as transações recebidas
    } catch (err) {
      console.error('Erro ao buscar transações:', err);
      setError('Erro ao se conectar com o Banco de Dados'); // Atualiza o estado de erro
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  // useEffect para buscar transações ao carregar o componente
  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading) {
    return <div className="loading-state">Carregando transações...</div>;
  }

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <p>Nenhuma transação cadastrada</p>
      </div>
    );
  }

  return (
    <div className="transactions-container">
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Categoria</th>
            <th>Data</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {transactions
            .filter((transaction) => transaction.valor > 0)
            .map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
              />
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsList;