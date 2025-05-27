const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const navLinks = document.getElementById('nav-links');

mobileMenuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const formData = new FormData(contactForm);
  const jsonData = {};
  formData.forEach((value, key) => {
    jsonData[key] = value;
  });

  fetch('http://localhost:3000/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(jsonData)
  })
  .then(response => {
    if (response.ok) {
      alert('Message sent successfully!');
      contactForm.reset();
    } else {
      alert('Error sending message.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error sending message.');
  });
});

const canvas = document.getElementById('sparkle-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let sparkles = [];
const maxParticles = 50;
const maxSparkles = 100;
const maxDistance = 150;

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.radius = 2;
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = 'rgba(167, 139, 250, 0.8)';
    ctx.shadowColor = 'rgba(167, 139, 250, 0.8)';
    ctx.shadowBlur = 10;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

class Sparkle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = (Math.random() - 0.5) * 0.6;
    this.radius = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.8 + 0.2;
    this.alphaChange = (Math.random() * 0.02 + 0.005) * (Math.random() < 0.5 ? -1 : 1);
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha += this.alphaChange;

    if (this.alpha <= 0.2 || this.alpha >= 1) {
      this.alphaChange *= -1;
    }

    if (this.x < 0) this.x = width;
    else if (this.x > width) this.x = 0;

    if (this.y < 0) this.y = height;
    else if (this.y > height) this.y = 0;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = `rgba(167, 139, 250, ${this.alpha})`;
    ctx.shadowColor = `rgba(167, 139, 250, ${this.alpha})`;
    ctx.shadowBlur = 15;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function distance(p1, p2) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

function findGroups(particles) {
  let groups = [];
  for (let i = 0; i < particles.length; i++) {
    let group = [particles[i]];
    for (let j = 0; j < particles.length; j++) {
      if (i !== j && distance(particles[i], particles[j]) < maxDistance) {
        group.push(particles[j]);
      }
    }
    if (group.length >= 3 && group.length <= 5) {
      group.sort((a, b) => a.x - b.x || a.y - b.y);
      if (!groups.some(g => g.length === group.length && g.every((p, idx) => p === group[idx]))) {
        groups.push(group);
      }
    }
  }
  return groups;
}

function drawConnections(groups) {
  groups.forEach(group => {
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(167, 139, 250, 0.4)';
    ctx.lineWidth = 1;
    for (let i = 0; i < group.length; i++) {
      const p1 = group[i];
      const p2 = group[(i + 1) % group.length];
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
    }
    ctx.stroke();
  });
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  particles.forEach(p => {
    p.move();
    p.draw();
  });
  sparkles.forEach(s => {
    s.move();
    s.draw();
  });
  const groups = findGroups(particles);
  drawConnections(groups);
  requestAnimationFrame(animate);
}

function init() {
  resize();
  particles = [];
  sparkles = [];
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }
  for (let i = 0; i < maxSparkles; i++) {
    sparkles.push(new Sparkle());
  }
  animate();
}

window.addEventListener('resize', resize);
init();
