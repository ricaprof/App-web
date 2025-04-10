import React, { useState } from 'react';
import Button from '../Button/Button';
import './Modal.css';




const TransactionForm = ({  onCancel }) => {
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    tipo: 'income',
    categoria: 'Outros',
    date: new Date().toISOString().split('T')[0],
  });

  const [message, setMessage] = useState(""); // Corrigido para incluir "message"

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:8801/addTransaction/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setMessage("Transação adicionada com sucesso!");
        setFormData({
          descricao: '',
          valor: '',
          tipo: 'income',
          categoria: 'Outros',
          date: new Date().toISOString().split('T')[0],
        });
      } else {
        setMessage("Erro ao adicionar transação: " + data.error);
      }
    } catch (error) {
      setMessage("Erro ao conectar com o servidor");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="modal-title">Nova Transação</h2>
      {message && <div className="message">{message}</div>} {/* Exibe a mensagem */}
      <div className="form-group">
        <label htmlFor="description">Descrição</label>
        <input
          type="text"
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          placeholder="Ex: Salário, Aluguel..."
          required
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="amount">Valor (R$)</label>
          <input
            type="number"
            name="valor"
            value={formData.valor}
            onChange={handleChange}
            placeholder="0,00"
            step="0.01"
            min="0"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="date">Data</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Tipo</label>
          <div className="type-selector">
            <button
              type="button"
              className={`type-option ${formData.tipo === 'income' ? 'active' : ''}`}
              onClick={() => setFormData({ ...formData, tipo: 'income' })}
            >
              Receita
            </button>
            <button
              type="button"
              className={`type-option ${formData.tipo === 'expense' ? 'active' : ''}`}
              onClick={() => setFormData({ ...formData, tipo: 'expense' })}
            >
              Despesa
            </button>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="category">Categoria</label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
          >
            <option value="Trabalho">Trabalho</option>
            <option value="Moradia">Moradia</option>
            <option value="Alimentação">Alimentação</option>
            <option value="Transporte">Transporte</option>
            <option value="Saúde">Saúde</option>
            <option value="Lazer">Lazer</option>
            <option value="Outros">Outros</option>
          </select>
        </div>
      </div>
      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary">
          Adicionar
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;