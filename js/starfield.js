// ===== Animação de Campo de Estrelas =====

(function() {
  'use strict';
  
  // Configurações
  const config = {
    starCount: 200,
    starSize: 2,
    starSpeed: 0.05,
    shootingStarChance: 0.001,
    twinkleSpeed: 0.02
  };
  
  // Obter canvas
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Ajustar tamanho do canvas
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Classe Star (Estrela)
  class Star {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height;
      this.opacity = Math.random();
      this.twinkleSpeed = Math.random() * config.twinkleSpeed + 0.01;
      this.twinkleDirection = Math.random() > 0.5 ? 1 : -1;
    }
    
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * config.starSize + 0.5;
      this.speed = Math.random() * config.starSpeed + 0.01;
      this.opacity = Math.random();
    }
    
    update() {
      // Movimento lento para baixo
      this.y += this.speed;
      
      // Efeito de cintilação
      this.opacity += this.twinkleSpeed * this.twinkleDirection;
      
      if (this.opacity >= 1) {
        this.opacity = 1;
        this.twinkleDirection = -1;
      } else if (this.opacity <= 0.2) {
        this.opacity = 0.2;
        this.twinkleDirection = 1;
      }
      
      // Resetar quando sair da tela
      if (this.y > canvas.height) {
        this.y = 0;
        this.x = Math.random() * canvas.width;
      }
    }
    
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Adicionar brilho para estrelas maiores
      if (this.size > 1.5) {
        ctx.globalAlpha = this.opacity * 0.3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    }
  }
  
  // Classe ShootingStar (Estrela Cadente)
  class ShootingStar {
    constructor() {
      this.reset();
    }
    
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height * 0.5; // Apenas na metade superior
      this.length = Math.random() * 80 + 40;
      this.speed = Math.random() * 8 + 4;
      this.angle = Math.PI / 4; // 45 graus
      this.opacity = 1;
      this.fadeSpeed = 0.02;
      this.active = true;
    }
    
    update() {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.opacity -= this.fadeSpeed;
      
      if (this.opacity <= 0 || this.x > canvas.width || this.y > canvas.height) {
        this.active = false;
      }
    }
    
    draw() {
      if (!this.active) return;
      
      ctx.save();
      ctx.globalAlpha = this.opacity;
      
      // Criar gradiente para o rastro
      const gradient = ctx.createLinearGradient(
        this.x,
        this.y,
        this.x - Math.cos(this.angle) * this.length,
        this.y - Math.sin(this.angle) * this.length
      );
      
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(
        this.x - Math.cos(this.angle) * this.length,
        this.y - Math.sin(this.angle) * this.length
      );
      ctx.stroke();
      
      ctx.restore();
    }
  }
  
  // Criar estrelas
  const stars = [];
  for (let i = 0; i < config.starCount; i++) {
    stars.push(new Star());
  }
  
  // Array para estrelas cadentes
  const shootingStars = [];
  
  // Função de animação
  function animate() {
    // Limpar canvas com um fade suave para criar rastro
    ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Atualizar e desenhar estrelas
    stars.forEach(star => {
      star.update();
      star.draw();
    });
    
    // Criar estrelas cadentes aleatoriamente
    if (Math.random() < config.shootingStarChance) {
      shootingStars.push(new ShootingStar());
    }
    
    // Atualizar e desenhar estrelas cadentes
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      shootingStars[i].update();
      shootingStars[i].draw();
      
      if (!shootingStars[i].active) {
        shootingStars.splice(i, 1);
      }
    }
    
    requestAnimationFrame(animate);
  }
  
  // Iniciar animação
  animate();
  
  // Adicionar interatividade com o mouse
  let mouseX = 0;
  let mouseY = 0;
  
  canvas.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Criar efeito de parallax nas estrelas próximas ao mouse
    stars.forEach(star => {
      const dx = mouseX - star.x;
      const dy = mouseY - star.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        const force = (100 - distance) / 100;
        star.x -= dx * force * 0.01;
        star.y -= dy * force * 0.01;
      }
    });
  });
  
  // Criar constelações (linhas conectando estrelas próximas)
  function drawConstellations() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          ctx.beginPath();
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(stars[j].x, stars[j].y);
          ctx.stroke();
        }
      }
    }
  }
  
  // Adicionar nebulosas (efeito de nuvem)
  function drawNebula() {
    const nebulaCount = 3;
    
    for (let i = 0; i < nebulaCount; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 200 + 100;
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, 'rgba(74, 144, 226, 0.03)');
      gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.02)');
      gradient.addColorStop(1, 'rgba(74, 144, 226, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }
  
  // Desenhar nebulosas uma vez (estáticas)
  drawNebula();
  
  console.log('✨ Campo de estrelas inicializado com sucesso!');
  console.log(`⭐ ${config.starCount} estrelas criadas`);
})();
