const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({
  user: 'local', // Substitua pelo seu usuário do PostgreSQL
  host: 'localhost',
  database: 'tarefas', // Nome do banco de dados
  password: '12345', // Substitua pela sua senha
  port: 5432, // Porta padrão do PostgreSQL
});

// Habilitar CORS para todas as rotas
app.use(cors());
app.use(express.json());

// Rota para buscar todas as tarefas
app.get('/tarefas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tarefas');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao buscar tarefas' });
  }
});

// Rota para buscar uma tarefa por ID
app.get('/tarefas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM tarefas WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao buscar tarefa' });
  }
});

// Rota para adicionar uma tarefa
app.post('/tarefas', async (req, res) => {
  const {
    id_usuarios = null,
    descricao = '',
    setor = '',
    prioridade = 'Média',
    status = '',
    situacao = 'começando',
  } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO tarefas (id_usuarios, descricao, setor, prioridade, status, situacao)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [id_usuarios, descricao, setor, prioridade, status, situacao]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao adicionar tarefa:", err.message);
    res.status(500).json({ error: 'Erro ao adicionar tarefa' });
  }
});

// Rota para atualizar uma tarefa
app.put('/tarefas/:id', async (req, res) => {
  const { id } = req.params;
  const { id_usuarios, descricao, setor, prioridade, status, situacao } = req.body;
  try {
    const result = await pool.query(
      `UPDATE tarefas
       SET id_usuarios = $1, descricao = $2, setor = $3, prioridade = $4, status = $5, situacao = $6
       WHERE id = $7 RETURNING *`,
      [id_usuarios, descricao, setor, prioridade, status, situacao, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao atualizar tarefa' });
  }
});

// Rota para deletar uma tarefa
app.delete('/tarefas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM tarefas WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    res.json({ message: 'Tarefa deletada com sucesso' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao deletar tarefa' });
  }
});

// Rota para adicionar um usuarios
app.post('/usuarios', async (req, res) => {
    const { nome, email } = req.body;
    console.log('Dados recebidos:', nome, email); // Depuração para verificar os dados recebidos
    try {
      const result = await pool.query(
        'INSERT INTO usuarios (nome, email) VALUES ($1, $2) RETURNING *',  // Alterar para a tabela 'usuarios'
        [nome, email]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Erro ao adicionar usuarios' });
    }
  });

// Rota para buscar todos os usuarios
app.get('/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao buscar usuarios' });
  }
});

// Inicializando o servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});