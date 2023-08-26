const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// Conexão com o banco de dados SQLite
const db = new sqlite3.Database('./db/database.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conexão com o banco de dados estabelecida.');
  }
});

// Middleware para permitir o uso de JSON no corpo das requisições
app.use(express.json());

// Rota para criar um novo aluno
app.post('/alunos', (req, res) => {
  const { nome, linguagem } = req.body;
  
  db.run('INSERT INTO alunos (nome, linguagem) VALUES (?, ?)', [nome, linguagem], function(err) {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json({ message: 'Aluno criado com sucesso!', alunoId: this.lastID });
  });
});

// Rota para obter todos os alunos
app.get('/alunos', (req, res) => {
  db.all('SELECT * FROM alunos', (err, rows) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(rows);
  });
});

// Rota para obter um aluno pelo ID
app.get('/alunos/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM alunos WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(row);
  });
});

// Rota para atualizar os dados de um aluno
app.put('/alunos/:id', (req, res) => {
  const id = req.params.id;
  const { nome, linguagem } = req.body;
  db.run('UPDATE alunos SET nome = ?, linguagem = ? WHERE id = ?', [nome, linguagem, id], (err) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json({ message: 'Dados do aluno atualizados com sucesso!' });
  });
});

// Rota para deletar um aluno
app.delete('/alunos/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM alunos WHERE id = ?', [id], (err) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json({ message: 'Aluno deletado com sucesso!' });
  });
});


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
