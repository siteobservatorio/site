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
  