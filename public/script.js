const API_URL = 'http://localhost:3000';

const inputs = {
  nome: document.getElementById('nome'),
  email: document.getElementById('email'),
  senha: document.getElementById('senha'),
};
const msg = document.getElementById('mensagem');

function limparCampos() {
  inputs.nome.value = '';
  inputs.email.value = '';
  inputs.senha.value = '';
  msg.textContent = '';
  atualizarCheckmarks();
}

// Validações
function validarNome(nome) {
  return typeof nome === 'string' && nome.trim().split(' ').length >= 2;
}
function validarEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
function validarSenha(senha) {
  return (
    typeof senha === 'string' &&
    senha.length === 8 &&
    /[A-Z]/.test(senha) &&
    /[a-z]/.test(senha) &&
    /\d/.test(senha)
  );
}

// Atualiza ✔️ visualmente
function atualizarCheckmarks() {
  document.getElementById('check-nome').textContent = validarNome(inputs.nome.value) ? '✔️' : '';
  document.getElementById('check-email').textContent = validarEmail(inputs.email.value) ? '✔️' : '';
  document.getElementById('check-senha').textContent = validarSenha(inputs.senha.value) ? '✔️' : '';
}

// Feedback visual
function mostrarMensagem(texto, cor = 'black') {
  msg.textContent = texto;
  msg.style.color = cor;
}

// Cadastrar
async function cadastrar(event) {
  event.preventDefault();
  const nome = inputs.nome.value.trim();
  const email = inputs.email.value.trim();
  const senha = inputs.senha.value.trim();

  if (!nome || !email || !senha) {
    mostrarMensagem('Preencha nome, email e senha.', 'red');
    return;
  }

  if (!validarNome(nome)) {
    mostrarMensagem('Digite nome completo (ex: João Silva).', 'red');
    return;
  }

  if (!validarEmail(email)) {
    mostrarMensagem('Email inválido.', 'red');
    return;
  }

  if (!validarSenha(senha)) {
    mostrarMensagem('Senha deve ter 8 caracteres, com letra maiúscula, minúscula e número.', 'red');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/cadastro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha }),
    });
    const data = await res.json();
    mostrarMensagem(data.mensagem || data.erro || 'Erro inesperado.', data.erro ? 'red' : 'green');
    if (!data.erro) limparCampos();
  } catch (e) {
    mostrarMensagem('Erro de conexão com o servidor.', 'red');
  }
}

// Login
async function logar(event) {
  event.preventDefault();
  const email = inputs.email.value.trim();
  const senha = inputs.senha.value.trim();

  if (!email || !senha) {
    mostrarMensagem('Preencha email e senha.', 'red');
    return;
  }

  if (!validarEmail(email) || !validarSenha(senha)) {
    mostrarMensagem('Email ou senha inválidos.', 'red');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });
    const data = await res.json();
    mostrarMensagem(data.mensagem || data.erro, data.erro ? 'red' : 'green');
    if (!data.erro) limparCampos();
  } catch (e) {
    mostrarMensagem('Erro de conexão com o servidor.', 'red');
  }
}

// Inicializa
window.onload = limparCampos;

// Eventos para validação ao digitar
['input', 'blur'].forEach(evento => {
  inputs.nome.addEventListener(evento, atualizarCheckmarks);
  inputs.email.addEventListener(evento, atualizarCheckmarks);
  inputs.senha.addEventListener(evento, atualizarCheckmarks);
});
