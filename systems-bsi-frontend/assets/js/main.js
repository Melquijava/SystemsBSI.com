(() => {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));


  const toggle = $('.nav-toggle');
  toggle?.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  $$('.nav a').forEach(a => a.addEventListener('click', () => {
    document.body.classList.remove('nav-open');
    toggle?.setAttribute('aria-expanded', 'false');
  }));


  $('#year').textContent = new Date().getFullYear();


  const header = $('.site-header');
  const onScroll = () => header.style.boxShadow = (window.scrollY > 8) ? '0 8px 24px rgba(0,0,0,.25)' : 'none';
  document.addEventListener('scroll', onScroll, { passive: true }); onScroll();


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
      ctx.clearRect(0, 0, w, h);
      const grad = ctx.createRadialGradient(w * 0.8, h * 0.1, 20, w * 0.8, h * 0.1, Math.max(w, h));
      grad.addColorStop(0, 'rgba(0,204,255,0.08)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(173, 235, 255, .7)';
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
          if (d < 110) {
            ctx.strokeStyle = 'rgba(77, 230, 255, .12)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    };
    new ResizeObserver(resize).observe(canvas);
    resize(); draw();
  }

  $$('.demo-tile').forEach(tile => {
    let rAF = null;
    const onMove = (e) => {
      const rect = tile.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rx = ((y / rect.height) - 0.5) * -6; 
      const ry = ((x / rect.width) - 0.5) * 8;  
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
(function () {
  const marquee = document.querySelector('.logo-marquee');
  if (!marquee) return;

  const track = marquee.querySelector('.track');
  const GAP = parseFloat(getComputedStyle(marquee).getPropertyValue('--gap')) || 16;
  const pps = parseFloat(marquee.dataset.pps || '90'); 

  const totalWidth = () => {
    const items = Array.from(track.children);
    if (!items.length) return 0;
    const widths = items.map(el => el.getBoundingClientRect().width);
    return widths.reduce((a, b) => a + b, 0) + GAP * (items.length - 1);
  };

  const fill = () => {
    const containerW = marquee.getBoundingClientRect().width;
    let tw = totalWidth();
    const original = Array.from(track.children);

    while (tw < containerW * 2 && original.length) {
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
    track.innerHTML += track.innerHTML; 
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
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - marquee.offsetLeft;
  const walk = (x - startX) * 2; 
  marquee.scrollLeft = scrollLeft - walk;
});


window.addEventListener('load', function() {
  const popupOverlay = document.getElementById('popup-overlay');

  if (popupOverlay) {
    const closePopupButton = document.getElementById('close-popup');

    function showPopup() {
      popupOverlay.classList.add('active');
    }

    function hidePopup() {
      popupOverlay.classList.remove('active');
    }

    setTimeout(showPopup, 3000);
    closePopupButton.addEventListener('click', hidePopup);

    popupOverlay.addEventListener('click', function(event) {
      if (event.target === popupOverlay) {
        hidePopup();
      }
    });
  }
});