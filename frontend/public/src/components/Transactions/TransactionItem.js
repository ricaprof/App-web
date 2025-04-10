import React from 'react';
import { formatCurrency, formatDate } from '../../utils/format';
import Badge from '../UI/Badge/Badge';
import Button from '../UI/Button/Button';
import { FiX, FiEdit } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './Transactions.css';

async function deletarTransacao(id, onDelete) {
  try {
    console.log(`Deletar transação com ID: ${id}`);
    const response = await fetch(`http://localhost:8801/deleteTransaction/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar transação');
    }

    // Chama a função de callback para remover a transação do frontend
    if (onDelete) {
      onDelete(id);
    }
  } catch (error) {
    console.error('Erro ao deletar transação:', error);
  }
}

const TransactionItem = ({ transaction, onDelete }) => {
  const transactionType = transaction.valor > 0 ? 'income' : 'expense';

  return (
    <tr className="transaction-item">
          <td>
            {formatDate(transaction.data)}
            
          </td>
      
      <td>
        <Badge category={transaction.categoria} />
      </td>

          <td>
            <div className="transaction-description">
             {transactionType === 'income' ? (
            <span className="type-icon income">↑</span>
                  ) : (
            <span className="type-icon expense">↓</span>
                 )}
                  {transaction.descricao}
             </div>
          </td>


      <td className={transactionType === 'income' ? 'positive' : 'negative'}>
        {formatCurrency(Math.abs(transaction.valor))}
      </td>


      <td>
        <Link to={`/edit/${transaction.id_gastos}`}>
          <Button variant="text" size="small" className="delete-button">
          ✏️
          </Button>
        </Link>
        <Button
          variant="text"
          size="small"
          className="delete-button"
          onClick={() => deletarTransacao(transaction.id_gastos, onDelete)}
        >
          🗑️
        </Button>
      </td>
    </tr>
  );
};

export default TransactionItem;
