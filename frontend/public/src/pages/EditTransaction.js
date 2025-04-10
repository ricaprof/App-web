import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function UpdateRegistro() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [registro, setRegistro] = useState({
    descricao: '',
    valor: '',
    data: '',
    categoria: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Busca os dados do registro
  useEffect(() => {
    fetch(`http://localhost:8801/getTransaction/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar registro');
        return res.json();
      })
      .then(data => {
        setRegistro(data);
        setLoading(false);
        //console.log(data);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
        
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegistro(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8801/updateTransaction/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registro)
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao atualizar registro');
        alert('Registro atualizado com sucesso!');
        navigate('/registros'); // redireciona para a lista
      })
      .catch(err => {
        alert('Erro: ' + err.message);
      });
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Editar Registro</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Descrição:</label><br />
          <input
            type="text"
            name="descricao"
            value={registro.descricao}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Valor:</label><br />
          <input
            type="number"
            step="0.01"
            name="valor"
            value={registro.valor}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Data:</label><br />
          <input
            type="date"
            name="data"
            value={registro.data}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Categoria:</label><br />
          <input
            type="text"
            name="categoria"
            value={registro.categoria}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>
          Salvar Alterações
        </button>
      </form>
    </div>
  );
}

export default UpdateRegistro;
