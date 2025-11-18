// ===== Observatório Estrela do Sul - JavaScript Principal =====

// Esperar o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
  
  // ===== Menu Mobile =====
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');
  const navLinks = document.querySelectorAll('.nav-list a');
  
  if (navToggle) {
    navToggle.addEventListener('click', function() {
      navToggle.classList.toggle('active');
      navList.classList.toggle('active');
      document.body.style.overflow = navList.classList.contains('active') ? 'hidden' : '';
    });
  }
  
  // Fechar menu ao clicar em um link
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (navToggle && navList.classList.contains('active')) {
        navToggle.classList.remove('active');
        navList.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
  
  // ===== Header com scroll =====
  const header = document.querySelector('.site-header');
  let lastScroll = 0;
  
  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });
  
  // ===== Smooth Scroll para links internos =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      // Ignorar links vazios ou apenas "#"
      if (targetId === '#' || targetId === '') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        
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
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);
  
  // Adicionar classe fade-in aos elementos que queremos animar
  const animateElements = document.querySelectorAll('.card-experience, .feature-item, .step, .gallery-item');
  animateElements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });
  
  // ===== Animação de contagem (para números) =====
  function animateCounter(element, target, duration = 2000) {
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
          <img src="${img.src}" alt="${img.alt}">
        </div>
      `;
      
      document.body.appendChild(modal);
      document.body.style.overflow = 'hidden';
      
      // Adicionar estilos do modal dinamicamente
      if (!document.getElementById('gallery-modal-styles')) {
        const styles = document.createElement('style');
        styles.id = 'gallery-modal-styles';
        styles.textContent = `
          .gallery-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease-out;
          }
          
          .gallery-modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
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
      
      // Fechar modal
      const closeModal = () => {
        modal.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
          modal.remove();
          document.body.style.overflow = '';
        }, 300);
      };
      
      modal.querySelector('.gallery-modal-close').addEventListener('click', closeModal);
      modal.querySelector('.gallery-modal-overlay').addEventListener('click', closeModal);
      
      // Fechar com ESC
      const escHandler = (e) => {
        if (e.key === 'Escape') {
          closeModal();
          document.removeEventListener('keydown', escHandler);
        }
      };
      document.addEventListener('keydown', escHandler);
    });
  });
  
  // ===== Adicionar efeito parallax suave no hero =====
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', function() {
      const scrolled = window.pageYOffset;
      const parallaxSpeed = 0.5;
      hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    });
  }
  
  // ===== Adicionar efeito de hover nos cards =====
  const cards = document.querySelectorAll('.card-experience, .feature-item');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.3s ease';
    });
  });
  
  // ===== Detectar se está em dispositivo móvel =====
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    document.body.classList.add('is-mobile');
  }
  
  // ===== Adicionar loading lazy para imagens =====
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
  });
  
  // ===== Adicionar efeito de digitação no título (opcional) =====
  function typeWriter(element, text, speed = 50) {
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
  
  // ===== Performance: Debounce para eventos de scroll =====
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
  
  // ===== Adicionar indicador de progresso de leitura =====
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #4a90e2, #8b5cf6);
    z-index: 10000;
    transition: width 0.1s ease;
  `;
  document.body.appendChild(progressBar);
  
  window.addEventListener('scroll', debounce(function() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.pageYOffset;
    const progress = (scrolled / documentHeight) * 100;
    progressBar.style.width = progress + '%';
  }));
  
  // ===== Log de inicialização =====
  console.log('🌟 Observatório Estrela do Sul - Site carregado com sucesso!');
  console.log('📍 Sarandi/PR - Brasil');
  console.log('🔭 Explore o universo conosco!');
});

// ===== Adicionar animação de fade-out no CSS =====
const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = `
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;
document.head.appendChild(fadeOutStyle);
