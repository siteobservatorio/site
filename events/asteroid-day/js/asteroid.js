// asteroid.js

// Smooth scroll para âncoras internas
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 60, // ajustar se houver header fixo
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Exemplo: foco automático no formulário ao clicar em "Inscreva-se"
  const btnInscricao = document.querySelector('.btn[href="#inscricao"]');
  if (btnInscricao) {
    btnInscricao.addEventListener('click', () => {
      setTimeout(() => {
        document.getElementById('inscricao').querySelector('iframe').focus();
      }, 700);
    });
  }

function atualizarContador() {
  const evento = new Date("2025-06-28T15:00:00");
  const agora = new Date();
  const tempoRestante = evento - agora;

  if (tempoRestante <= 0) return;

  const dias = Math.floor(tempoRestante / (1000 * 60 * 60 * 24));
  const horas = Math.floor((tempoRestante / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((tempoRestante / (1000 * 60)) % 60);
  const segundos = Math.floor((tempoRestante / 1000) % 60);

  document.getElementById("dias").textContent = dias;
  document.getElementById("horas").textContent = horas;
  document.getElementById("minutos").textContent = minutos;
  document.getElementById("segundos").textContent = segundos;
}

setInterval(atualizarContador, 1000);
atualizarContador(); // executa na primeira carga
