const STORAGE_KEY = 'finance_app_transactions';

export const getTransactions = async () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting transactions from storage:', error);
    return [];
  }
};

export const saveTransactions = async (transactions) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions to storage:', error);
  }
};