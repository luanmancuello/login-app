// public/script.js

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

  const res = await fetch('/cadastro', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, senha })
  });

  const data = await res.json();
  const msg = document.getElementById('mensagem');
  msg.textContent = data.mensagem || data.erro;
  msg.style.color = data.erro ? 'red' : 'green';
}
