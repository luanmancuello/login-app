require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'loginapp';

let db;

app.use(bodyParser.json());
app.use(express.static('public'));

// Conectar ao MongoDB
MongoClient.connect(MONGODB_URI, { useUnifiedTopology: true })
  .then(client => {
    db = client.db(DB_NAME);
    console.log('✅ Conectado ao MongoDB');
  })
  .catch(err => {
    console.error('Erro ao conectar ao MongoDB:', err);
    process.exit(1);
  });

// 🔒 Funções de validação
function validarNome(nome) {
  return typeof nome === 'string' && nome.trim().split(' ').length >= 2;
}
function validarEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
function validarSenha(senha) {
  return typeof senha === 'string'
    && senha.length === 8
    && /[A-Z]/.test(senha)
    && /[a-z]/.test(senha)
    && /\d/.test(senha);
}

// 📥 Rota de cadastro
app.post('/cadastro', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!validarNome(nome)) return res.status(400).json({ erro: 'Informe o nome completo.' });
  if (!validarEmail(email)) return res.status(400).json({ erro: 'Email inválido.' });
  if (!validarSenha(senha)) return res.status(400).json({ erro: 'Senha fraca. Use 8 caracteres com maiúsculas, minúsculas e números.' });

  try {
    const existente = await db.collection('usuarios').findOne({ email: email.trim() });
    if (existente) return res.status(400).json({ erro: 'Email já cadastrado.' });

    const senhaHash = await bcrypt.hash(senha, 10);

    await db.collection('usuarios').insertOne({
      nome: nome.trim(),
      email: email.trim(),
      senha: senhaHash,
    });

    console.log(`🟢 Novo usuário: ${nome.trim()} (${email.trim()})`);
    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
  } catch (err) {
    console.error('Erro no cadastro:', err);
    res.status(500).json({ erro: 'Erro interno ao cadastrar usuário.' });
  }
});

// 🔐 Rota de login
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await db.collection('usuarios').findOne({ email: email.trim() });
    if (!usuario) return res.status(401).json({ erro: 'Email ou senha incorretos.' });

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) return res.status(401).json({ erro: 'Email ou senha incorretos.' });

    res.status(200).json({ mensagem: 'Login realizado com sucesso!' });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ erro: 'Erro interno no login.' });
  }
});

// Página principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
