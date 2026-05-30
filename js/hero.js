(function () {
  var canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var particles = [];
  var RAF;

  var mouse = { x: null, y: null, active: false };

  var CONFIG = {
    count: 60,
    minR: 1,
    maxR: 2.6,
    maxSpeed: 0.28,
    colors: ['#3d8c55', '#2e5e3e', '#d4b96a', '#1f3d2a'],
    connectDist: 130,
    connectOpacity: 0.12,
    repelRadius: 130,
    repelForce: 0.9,
    ease: 0.04,
  };

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function Particle() {
    this.reset();
  }

  Particle.prototype.reset = function () {
    this.x  = rand(0, canvas.width);
    this.y  = rand(0, canvas.height);
    this.baseVx = rand(-CONFIG.maxSpeed, CONFIG.maxSpeed);
    this.baseVy = rand(-CONFIG.maxSpeed, CONFIG.maxSpeed);
    this.offsetX = 0;
    this.offsetY = 0;
    this.r     = rand(CONFIG.minR, CONFIG.maxR);
    this.color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
    this.alpha = rand(0.2, 0.7);
  };

  Particle.prototype.update = function () {
    this.x += this.baseVx;
    this.y += this.baseVy;

    if (this.x < -10) this.x = canvas.width  + 10;
    if (this.x > canvas.width  + 10) this.x = -10;
    if (this.y < -10) this.y = canvas.height + 10;
    if (this.y > canvas.height + 10) this.y = -10;

    if (mouse.active && mouse.x !== null) {
      var dx = this.x + this.offsetX - mouse.x;
      var dy = this.y + this.offsetY - mouse.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONFIG.repelRadius && dist > 0) {
        var push = (1 - dist / CONFIG.repelRadius) * CONFIG.repelForce;
        this.offsetX += (dx / dist) * push * 6;
        this.offsetY += (dy / dist) * push * 6;
      }
    }

    this.offsetX += (0 - this.offsetX) * CONFIG.ease;
    this.offsetY += (0 - this.offsetY) * CONFIG.ease;
  };

  Particle.prototype.px = function () { return this.x + this.offsetX; };
  Particle.prototype.py = function () { return this.y + this.offsetY; };

  Particle.prototype.draw = function () {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle   = this.color;
    ctx.beginPath();
    ctx.arc(this.px(), this.py(), this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  function connect() {
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx   = particles[i].px() - particles[j].px();
        var dy   = particles[i].py() - particles[j].py();
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.connectDist) {
          var op = CONFIG.connectOpacity * (1 - dist / CONFIG.connectDist);
          ctx.save();
          ctx.globalAlpha = op;
          ctx.strokeStyle = '#3d8c55';
          ctx.lineWidth   = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].px(), particles[i].py());
          ctx.lineTo(particles[j].px(), particles[j].py());
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    connect();
    for (var i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    RAF = requestAnimationFrame(loop);
  }

  function init() {
    resize();
    particles = [];
    for (var i = 0; i < CONFIG.count; i++) {
      particles.push(new Particle());
    }
    cancelAnimationFrame(RAF);
    loop();
  }

  function bindMouse() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    hero.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;

      var cx = rect.width / 2;
      var cy = rect.height / 2;
      var nx = (mouse.x - cx) / cx;
      var ny = (mouse.y - cy) / cy;

      var bg    = hero.querySelector('.hero-bg');
      var grid  = hero.querySelector('.hero-grid-lines');
      var stage = hero.querySelector('.hero-stage');
      if (bg)    bg.style.transform = 'translate(' + (nx * 14) + 'px,' + (ny * 14) + 'px)';
      if (grid)  grid.style.transform = 'translate(' + (nx * 22) + 'px,' + (ny * 22) + 'px)';
      if (stage) stage.style.transform =
        'rotateY(' + (nx * 5) + 'deg) rotateX(' + (-ny * 5) + 'deg) translateZ(0)';
    });

    hero.addEventListener('mouseleave', function () {
      mouse.active = false;
      mouse.x = null;
      mouse.y = null;
      var bg    = hero.querySelector('.hero-bg');
      var grid  = hero.querySelector('.hero-grid-lines');
      var stage = hero.querySelector('.hero-stage');
      if (bg)    bg.style.transform = '';
      if (grid)  grid.style.transform = '';
      if (stage) stage.style.transform = '';
    });
  }

  function entrance() {
    if (typeof anime === 'undefined') {
      var sels = ['.hero-eyebrow', 'h1', '.hero-desc', '.hero-ctas .btn',
                  '.hero-photo-aside', '.hero-card', '.skill-tag'];
      sels.forEach(function (s) {
        document.querySelectorAll(s).forEach(function (el) {
          el.style.opacity = '1';
        });
      });
      return;
    }

    anime.timeline({ easing: 'easeOutExpo' })
      .add({
        targets: '.hero-eyebrow',
        opacity: [0, 1],
        translateY: [16, 0],
        duration: 700,
      })
      .add({
        targets: 'h1',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
      }, '-=450')
      .add({
        targets: '.hero-desc',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 700,
      }, '-=500')
      .add({
        targets: '.hero-ctas .btn',
        opacity: [0, 1],
        translateY: [18, 0],
        delay: anime.stagger(110),
        duration: 600,
      }, '-=450')
      .add({
        targets: '.hero-photo-aside',
        opacity: [0, 1],
        translateX: [40, 0],
        duration: 900,
      }, '-=700')
      .add({
        targets: '.hero-card',
        opacity: [0, 1],
        translateY: [40, 0],
        scale: [0.94, 1],
        duration: 800,
      }, '-=750')
      .add({
        targets: '.skill-tag',
        opacity: [0, 1],
        scale: [0.8, 1],
        delay: anime.stagger(70),
        duration: 500,
      }, '-=500');
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 150);
  });

  document.addEventListener('DOMContentLoaded', function () {
    init();
    bindMouse();
    entrance();
  });
})();