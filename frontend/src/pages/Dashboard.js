import React, { useState, useEffect } from 'react';
import Header from '../components/Header/Header';
import SummaryCard from '../components/SummaryCards/SummaryCard';
import TransactionsList from '../components/Transactions/TransactionsList';
import Modal from '../components/UI/Modal/Modal';
import TransactionForm from '../components/UI/Modal/TransactionForm';
import { formatCurrency } from '../utils/format';
import './Dashboard.css';
import Intro from './Intro';
import Footer from '../components/Footer/footer';


const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("income");




  // Função para buscar receitas (income)
  const fetchIncome = async () => {
    console.log("DarkThemeLayout", filter, setFilter);
    try {
      const response = await fetch('http://localhost:8801/getIncome/'); // Certifique-se de que o endpoint está correto
      if (!response.ok) {
        throw new Error('Erro ao buscar receitas');
      }
      const data = await response.json();
      setIncome(data.totalIncome); // Corrigido para acessar "totalIncome"
    } catch (error) {
      console.error('Erro ao buscar receitas:', error);
    }
  };

  // Função para buscar despesas (expenses)
  const fetchExpenses = async () => {
    try {
      const response = await fetch('http://localhost:8801/getExpense/'); // Certifique-se de que o endpoint está correto
      if (!response.ok) {
        throw new Error('Erro ao buscar despesas');
      }
      const data = await response.json();
      console.log(data)
      setExpenses(-1 * data.totalExpense); // Corrigido para acessar "totalExpenses"
    } catch (error) {
      console.error('Erro ao buscar despesas:', error);
    }
  };

  

  // useEffect para buscar dados ao carregar o componente
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchIncome(), fetchExpenses()]);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleSubmit = async (transactionData) => {
    try {
      const response = await fetch('http://localhost:8801/addTransaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });
      if (!response.ok) {
        throw new Error('Erro ao adicionar transação');
      }
      await fetchIncome(); // Atualiza receitas
      await fetchExpenses(); // Atualiza despesas
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
    }
  };

  if (isLoading) {
    return <div className="loading">Carregando...</div>;
  }

  return (

    <div className="dashboard">
      <Intro
      currentFilter={filter}
      onFilterChange={setFilter}
      ></Intro>
      


      <main className="dashboard__content">
        <div className="summary-cards">
          <SummaryCard
            title="Saldo Atual"
            value={formatCurrency(income-expenses)}
            icon={income-expenses >= 0 ? '📈' : '📉'}
          />
          <SummaryCard
            title="Receitas"
            value={formatCurrency(income)} // Corrigido para passar o valor de "income"
            type="positive"
            icon="📈"
          />
          <SummaryCard
            title="Despesas"
            value={formatCurrency(expenses)}
            type="negative"
            icon="📉"
          />
        </div>


          <TransactionsList transactions={transactions} filter={filter} />


      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TransactionForm
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          onSuccess={() => {
            fetchIncome();
            fetchExpenses();
          }}
          
        />
      </Modal>
      <Footer></Footer>
    </div>
  );
};

export default Dashboard;