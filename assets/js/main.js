// Systems_BSI — Interações aprimoradas
(() => {
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

  // Menu mobile
  const toggle = $('.nav-toggle');
  toggle?.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  $$('.nav a').forEach(a => a.addEventListener('click', () => {
    document.body.classList.remove('nav-open');
    toggle?.setAttribute('aria-expanded', 'false');
  }));

  // Ano do rodapé
  $('#year').textContent = new Date().getFullYear();

  // Header shadow
  const header = $('.site-header');
  const onScroll = () => header.style.boxShadow = (window.scrollY > 8) ? '0 8px 24px rgba(0,0,0,.25)' : 'none';
  document.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Counters
  const counters = $$('.stat-value');
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    let current = 0;
    const inc = Math.max(1, Math.floor(target / 80));
    const step = () => {
      current += inc;
      if (current >= target) { current = target; }
      el.textContent = current.toLocaleString('pt-BR');
      if (current < target) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('show');
        if (e.target.classList.contains('stat')) {
          const span = e.target.querySelector('.stat-value');
          span && animateCount(span);
        }
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  $$('.reveal, .stat').forEach(el => io.observe(el));

  // Validação de formulários
  const contact = $('#contact-form');
  const showError = (id, msg) => {
    const small = contact.querySelector(`.error[data-for="${id}"]`);
    if (small) small.textContent = msg || '';
  };
  contact?.addEventListener('submit', (ev) => {
    ev.preventDefault();
    let ok = true;

    const nome = $('#nome');
    if (!nome.value.trim()) { showError('nome', 'Informe seu nome.'); ok = false; } else showError('nome');

    const email = $('#email');
    const mailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
    if (!mailOk) { showError('email', 'E-mail inválido.'); ok = false; } else showError('email');

    const msg = $('#mensagem');
    if (msg.value.trim().length < 10) { showError('mensagem', 'Descreva melhor sua solicitação.'); ok = false; } else showError('mensagem');

    if (ok) {
      contact.querySelector('.form-success').hidden = false;
      contact.reset();
      setTimeout(() => contact.querySelector('.form-success').hidden = true, 4000);
    }
  });

  // Newsletter simples
  $('#newsletter')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = e.target.querySelector('input[type="email"]');
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
    if (valid) { alert('Inscrição realizada com sucesso!'); input.value=''; }
    else { alert('Digite um e-mail válido.'); }
  });

  // Partículas do hero
  const canvas = $('#particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, particles;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * DPR; canvas.height = h * DPR;
      ctx.scale(DPR, DPR);
      particles = new Array(64).fill(0).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - .5) * .4,
        vy: (Math.random() - .5) * .4
      }));
    };
    const draw = () => {
      ctx.clearRect(0,0,w,h);
      // gradient background glow subtle
      const grad = ctx.createRadialGradient(w*0.8, h*0.1, 20, w*0.8, h*0.1, Math.max(w,h));
      grad.addColorStop(0, 'rgba(0,204,255,0.08)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad; ctx.fillRect(0,0,w,h);

      for (let i=0;i<particles.length;i++){
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x<0||p.x>w) p.vx*=-1;
        if (p.y<0||p.y>h) p.vy*=-1;

        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle = 'rgba(173, 235, 255, .7)';
        ctx.fill();
      }
      // lines
      for (let i=0;i<particles.length;i++){
        for (let j=i+1;j<particles.length;j++){
          const a=particles[i], b=particles[j];
          const dx=a.x-b.x, dy=a.y-b.y, d=Math.hypot(dx,dy);
          if (d<110){
            ctx.strokeStyle = 'rgba(77, 230, 255, .12)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    };
    new ResizeObserver(resize).observe(canvas);
    resize(); draw();
  }

  // Hover tilt básico nos tiles
  $$('.demo-tile').forEach(tile => {
    let rAF = null;
    const onMove = (e) => {
      const rect = tile.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rx = ((y / rect.height) - 0.5) * -6; // rotateX
      const ry = ((x / rect.width) - 0.5) * 8;   // rotateY
      if (rAF) cancelAnimationFrame(rAF);
      rAF = requestAnimationFrame(() => {
        tile.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
      });
    };
    const reset = () => { tile.style.transform = ''; };
    tile.addEventListener('mousemove', onMove);
    tile.addEventListener('mouseleave', reset);
  });
})();

// ==========================
// Marquee infinito de parceiros
// ==========================
(function(){
  const marquee = document.querySelector('.logo-marquee');
  if (!marquee) return;

  const track = marquee.querySelector('.track');
  const GAP = parseFloat(getComputedStyle(marquee).getPropertyValue('--gap')) || 16;
  const pps = parseFloat(marquee.dataset.pps || '90'); // pixels por segundo (ajuste a gosto)

  const totalWidth = () => {
    const items = Array.from(track.children);
    if (!items.length) return 0;
    const widths = items.map(el => el.getBoundingClientRect().width);
    return widths.reduce((a,b)=>a+b,0) + GAP * (items.length - 1);
  };

  const fill = () => {
    const containerW = marquee.getBoundingClientRect().width;
    let tw = totalWidth();
    const original = Array.from(track.children);

    while (tw < containerW * 2 && original.length){
      original.forEach(node => {
        const clone = node.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      });
      tw = totalWidth();
    }

    const distance = tw / 2;
    const duration = distance / pps;
    track.style.setProperty('--duration', `${duration.toFixed(2)}s`);
  };

  if (document.readyState === 'complete') fill();
  else window.addEventListener('load', fill);

  let t;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(() => {
      const items = Array.from(track.children);
      const n = items.length / 2;
      if (Number.isInteger(n) && n > 0) {
        for (let i = items.length - 1; i >= n; i--) track.removeChild(items[i]);
      }
      fill();
    }, 150);
  });
})();

document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.marquee-track');
  if (track && track.children.length) {
    track.innerHTML += track.innerHTML; // duplica os 3 perfis
  }
});

const marquee = document.querySelector('.team-marquee');
let isDown = false;
let startX;
let scrollLeft;

marquee.addEventListener('mousedown', (e) => {
  isDown = true;
  marquee.classList.add('active');
  startX = e.pageX - marquee.offsetLeft;
  scrollLeft = marquee.scrollLeft;
});
marquee.addEventListener('mouseleave', () => {
  isDown = false;
});
marquee.addEventListener('mouseup', () => {
  isDown = false;
});
marquee.addEventListener('mousemove', (e) => {
  if(!isDown) return;
  e.preventDefault();
  const x = e.pageX - marquee.offsetLeft;
  const walk = (x - startX) * 2; // velocidade de arraste
  marquee.scrollLeft = scrollLeft - walk;
});
