// public/script.js

const API_URL = 'https://login-app-bw1l.onrender.com';

async function cadastrar(event) {
  event.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();

  if (!nome || !email || !senha) {
    const msg = document.getElementById('mensagem');
    msg.textContent = 'Preencha nome, email e senha.';
    msg.style.color = 'red';
    return;
  }

  const res = await fetch(`${API_URL}/cadastro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, senha })
  });

  const data = await res.json();
  const msg = document.getElementById('mensagem');
  msg.textContent = data.mensagem || data.erro;
  msg.style.color = data.erro ? 'red' : 'green';
}

async function logar(event) {
  event.preventDefault();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();

  if (!email || !senha) {
    const msg = document.getElementById('mensagem');
    msg.textContent = 'Preencha email e senha.';
    msg.style.color = 'red';
    return;
  }

  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  });

  const data = await res.json();
  const msg = document.getElementById('mensagem');
  msg.textContent = data.mensagem || data.erro;
  msg.style.color = data.erro ? 'red' : 'green';
}

window.onload = function() {
  document.getElementById('nome').value = '';
  document.getElementById('email').value = '';
  document.getElementById('senha').value = '';
  document.getElementById('mensagem').textContent = '';
};

// Validação visual dos campos
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

function atualizarCheckmarks() {
  document.getElementById('check-nome').textContent = validarNome(document.getElementById('nome').value) ? '✔️' : '';
  document.getElementById('check-email').textContent = validarEmail(document.getElementById('email').value) ? '✔️' : '';
  document.getElementById('check-senha').textContent = validarSenha(document.getElementById('senha').value) ? '✔️' : '';
}

document.getElementById('nome').addEventListener('input', atualizarCheckmarks);
document.getElementById('email').addEventListener('input', atualizarCheckmarks);
document.getElementById('senha').addEventListener('input', atualizarCheckmarks);