const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const url = 'mongodb://localhost:27017'; // URL do seu MongoDB local
const dbName = 'loginapp'; // Nome do banco de dados
let db;

app.use(bodyParser.json());
app.use(express.static('public'));

// Conexão com o MongoDB
MongoClient.connect(url, { useUnifiedTopology: true })
  .then(client => {
    db = client.db(dbName);
    console.log('Conectado ao MongoDB');
  })
  .catch(err => console.error(err));

// Rota de cadastro
app.post('/cadastro', async (req, res) => {
  const { nome, email, senha } = req.body;

  // Validação Nubank/serviço bancário: nome completo, email válido, senha forte
  const nomeValido = typeof nome === 'string' && nome.trim().split(' ').length >= 2;
  const emailValido = typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const senhaValida = typeof senha === 'string' && senha.length >= 8 && /[A-Z]/.test(senha) && /[a-z]/.test(senha) && /\d/.test(senha);

  if (!nomeValido) {
    return res.json({ erro: 'Informe o nome completo (nome e sobrenome).' });
  }
  if (!emailValido) {
    return res.json({ erro: 'Informe um email válido.' });
  }
  if (!senhaValida) {
    return res.json({ erro: 'A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e números.' });
  }

  try {
    await db.collection('usuarios').insertOne({ nome: nome.trim(), email: email.trim(), senha });
    res.json({ mensagem: 'Usuário cadastrado com sucesso!' });
  } catch (err) {
    res.json({ erro: 'Erro ao cadastrar usuário.' });
  }
});
// Rota de login
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  const usuario = await db.collection('usuarios').findOne({ email, senha });
  if (usuario) {
    res.json({ mensagem: 'Login realizado com sucesso!' });
  } else {
    res.json({ erro: 'Email ou senha incorretos.' });
  }
});

// Rota para servir o arquivo index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});