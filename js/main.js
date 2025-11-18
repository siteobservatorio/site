// ===== Observatório Estrela do Sul - JavaScript Principal =====
const fadeOutStyle = 'some-value';
// ===== Animação de fade-out global para o modal =====
const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = `
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;
document.head.appendChild(fadeOutStyle);
document.addEventListener('DOMContentLoaded', function() {
  // ===== Menu Mobile =====
  // Atenção: aqui eu deixei o código preparado, mas ele só roda
  // se existirem .nav-toggle e .nav-list no HTML.
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');
  const navLinks = document.querySelectorAll('.nav a, .nav-link');

  if (navToggle && navList) {
    navToggle.addEventListener('click', function() {
      navToggle.classList.toggle('active');
      navList.classList.toggle('active');
      document.body.style.overflow = navList.classList.contains('active') ? 'hidden' : '';
    });
  }

  // Fechar menu ao clicar em um link
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (navToggle && navList && navList.classList.contains('active')) {
        navToggle.classList.remove('active');
        navList.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // ===== Header com scroll =====
  const header = document.querySelector('.site-header');

  window.addEventListener('scroll', function() {
    if (!header) return;

    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ===== Smooth Scroll para links internos =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');

      // Ignorar links vazios ou apenas "#"
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);

      if (targetElement && header) {
        e.preventDefault();

        const headerHeight = header.offsetHeight || 0;
        const rect = targetElement.getBoundingClientRect();
        const targetPosition = rect.top + window.pageYOffset - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== Animação de elementos ao scroll (Intersection Observer) =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  // Classes ajustadas para o layout atual
  const animateElements = document.querySelectorAll(
    '.card, .feature-item, .step-item, .gallery-item, .about-text-block, .hints-card, .location-info, .contact-cta-card'
  );

  if ('IntersectionObserver' in window && animateElements.length > 0) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Depois que aparecer uma vez, não precisa mais observar
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animateElements.forEach(el => {
      el.classList.add('fade-in');
      observer.observe(el);
    });
  } else {
    // Fallback simples caso o navegador não suporte IntersectionObserver
    animateElements.forEach(el => {
      el.classList.add('visible');
    });
  }

  // ===== Animação de contagem (para números) =====
  function animateCounter(element, target, duration = 2000) {
    if (!element || typeof target !== 'number') return;

    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        element.textContent = Math.round(target);
        clearInterval(timer);
      } else {
        element.textContent = Math.round(start);
      }
    }, 16);
  }

  // ===== Galeria com modal (lightbox simples) =====
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', function() {
      const img = this.querySelector('img');
      if (!img) return;

      // Criar modal
      const modal = document.createElement('div');
      modal.className = 'gallery-modal';
      modal.innerHTML = `
        <div class="gallery-modal-overlay"></div>
        <div class="gallery-modal-content">
          <button class="gallery-modal-close">&times;</button>
          <img src="${img.src}" alt="${img.alt || ''}">
        </div>
      `;

      document.body.appendChild(modal);
      document.body.style.overflow = 'hidden';

      // Adicionar estilos do modal dinamicamente apenas uma vez
      if (!document.getElementById('gallery-modal-styles')) {
        const styles = document.createElement('style');
        styles.id = 'gallery-modal-styles';
        styles.textContent = `
          .gallery-modal {
            position: fixed;
            inset: 0;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease-out;
          }

          .gallery-modal-overlay {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(10px);
          }

          .gallery-modal-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
            z-index: 10000;
          }

          .gallery-modal-content img {
            max-width: 100%;
            max-height: 90vh;
            border-radius: 1rem;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
          }

          .gallery-modal-close {
            position: absolute;
            top: -50px;
            right: 0;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 2rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
          }

          .gallery-modal-close:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: rotate(90deg);
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `;
        document.head.appendChild(styles);
      }

      const closeModal = () => {
        modal.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
          modal.remove();
          document.body.style.overflow = '';
        }, 300);
      };

      const closeButton = modal.querySelector('.gallery-modal-close');
      const overlay = modal.querySelector('.gallery-modal-overlay');

      if (closeButton) {
        closeButton.addEventListener('click', closeModal);
      }

      if (overlay) {
        overlay.addEventListener('click', closeModal);
      }

      const escHandler = (e) => {
        if (e.key === 'Escape') {
          closeModal();
          document.removeEventListener('keydown', escHandler);
        }
      };
      document.addEventListener('keydown', escHandler);
    });
  });

  // ===== Efeito parallax no hero =====
  const hero = document.querySelector('.hero');
  const heroText = document.querySelector('.hero-text');
  const heroHighlights = document.querySelector('.hero-highlights');

  if (hero) {
    const parallaxSpeed = 0.3;

    window.addEventListener('scroll', function() {
      const scrolled = window.pageYOffset || document.documentElement.scrollTop;
      const heroHeight = hero.offsetHeight || 1;

      // Efeito sutil de parallax
      hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;

      const opacity = Math.max(0, 1 - (scrolled / (heroHeight * 0.6)));

      if (heroText) heroText.style.opacity = opacity;
      if (heroHighlights) heroHighlights.style.opacity = opacity;
    });
  }

  // ===== Efeito de hover nos cards =====
  const cards = document.querySelectorAll('.card, .feature-item, .step-item');

  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
      this.style.transform = 'translateY(-4px)';
      this.style.boxShadow = '0 20px 45px rgba(15, 23, 42, 0.9)';
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = '';
      this.style.boxShadow = '';
    });
  });

  // ===== Detectar dispositivo móvel =====
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  if (isMobile) {
    document.body.classList.add('is-mobile');
  }

  // ===== loading="lazy" para imagens =====
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
  });

  // ===== Função de digitação (opcional, não chamada por padrão) =====
  function typeWriter(element, text, speed = 50) {
    if (!element) return;

    let i = 0;
    element.textContent = '';

    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }

    type();
  }

  // ===== Debounce para eventos de scroll =====
  function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // ===== Indicador de progresso de leitura =====
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #4a90e2, #8b5cf6);
    z-index: 10000;
    width: 0;
    transition: width 0.1s ease;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener(
    'scroll',
    debounce(function() {
      const windowHeight = window.innerHeight || 1;
      const doc = document.documentElement;
      const scrollHeight = doc.scrollHeight || 0;
      const documentHeight = scrollHeight - windowHeight;

      if (documentHeight <= 0) {
        progressBar.style.width = '0%';
        return;
      }

      const scrolled = window.pageYOffset || doc.scrollTop;
      const progress = (scrolled / documentHeight) * 100;
      progressBar.style.width = progress + '%';
    }, 20)
  );

  // ===== Log de inicialização =====
  console.log('🌟 Observatório Estrela do Sul - Site carregado com sucesso!');
  console.log('📍 Sarandi PR - Brasil');
  console.log('🔭 Explore o universo conosco!');
});


