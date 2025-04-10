import React, { createContext, useState, useEffect } from 'react';
import { getTransactions, saveTransactions } from '../services/storageService';

export const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getTransactions();
        setTransactions(data);
      } catch (error) {
        console.error('Error loading transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const addTransaction = async (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now(),
      date: transaction.date || new Date().toISOString().split('T')[0]
    };
    
    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    await saveTransactions(updatedTransactions);
  };

  const updateTransaction = async (id, updatedTransaction) => {
    const updatedTransactions = transactions.map(t => 
      t.id === id ? { ...updatedTransaction, id } : t
    );
    setTransactions(updatedTransactions);
    await saveTransactions(updatedTransactions);
  };

  const deleteTransaction = async (id) => {
    console.log("Deleting transaction with ID:", id);
    const updatedTransactions = transactions.filter(t => t.id !== id);
    setTransactions(updatedTransactions);
    await saveTransactions(updatedTransactions);
  };

  const value = {
    transactions,
    isLoading,
    addTransaction,
    deleteTransaction
  };

  return (
    <FinanceContext.Provider value={{ transactions, addTransaction, deleteTransaction, updateTransaction }}>
      {children}
    </FinanceContext.Provider>
  );
};