(function () {
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var dotsEl = document.getElementById('dots');
  var progress = document.getElementById('progress');
  var hint = document.getElementById('hint');
  var current = 0;

  // nav dots
  slides.forEach(function (s, i) {
    var b = document.createElement('button');
    b.setAttribute('aria-label', s.getAttribute('data-title') || 'Slide ' + (i + 1));
    b.title = s.getAttribute('data-title') || '';
    b.onclick = function () { slides[i].scrollIntoView({ behavior: 'smooth' }); };
    dotsEl.appendChild(b);
  });

  // reveal on view
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        var idx = slides.indexOf(e.target);
        if (idx > -1) { current = idx; updateDots(); }
      }
    });
  }, { threshold: 0.35 });
  slides.forEach(function (s) { io.observe(s); });

  function updateDots() {
    Array.prototype.forEach.call(dotsEl.children, function (d, i) { d.classList.toggle('on', i === current); });
  }
  updateDots();

  window.addEventListener('scroll', function () {
    var h = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + '%';
    if (scrollY > 80) hint.classList.add('gone');
  }, { passive: true });

  // keyboard presenting
  function go(n) {
    n = Math.max(0, Math.min(slides.length - 1, n));
    slides[n].scrollIntoView({ behavior: 'smooth' });
  }
  document.addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;
    if (['ArrowDown', 'PageDown', ' ', 'ArrowRight'].indexOf(e.key) > -1) { e.preventDefault(); go(current + 1); }
    if (['ArrowUp', 'PageUp', 'ArrowLeft'].indexOf(e.key) > -1) { e.preventDefault(); go(current - 1); }
    if (e.key === 'Home') go(0);
    if (e.key === 'End') go(slides.length - 1);
    if (e.key === 'f' || e.key === 'F') {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
      else document.exitFullscreen();
    }
  });

  // then vs now slider
  var slider = document.getElementById('slider');
  var newLayer = document.getElementById('newLayer');
  var handle = document.getElementById('handle');
  function setSlide() {
    var v = slider.value;
    newLayer.style.clipPath = 'inset(0 0 0 ' + v + '%)';
    handle.style.left = v + '%';
  }
  slider.addEventListener('input', setSlide);
  setSlide();

  // stakeholders
  var STAKE = {
    eng: ['Engineers & designers', 'They build the product, so they decide how personality is specified, tested, and maintained.', 'Gain: more creative ownership. Concern: personality can turn into inconsistency, so a small set of signature elements helps.'],
    org: ['Organizations', 'They decide what gets funded and how AI tools are adopted.', 'Gain: products that stand out. Concern: personality costs more than a template in the short term.'],
    sh: ['Shareholders', 'They reward certain metrics, and efficiency alone can hide long-term costs.', 'Gain: visibility into design value. Concern: the evidence is correlational, so test it before assuming returns.'],
    usr: ['Users', 'They live with the result every day.', 'Gain: products that feel good and are clearer to use. Concern: decoration that gets in the way of usability.']
  };
  var box = document.getElementById('stakebox');
  function showStake(k) {
    var s = STAKE[k];
    box.innerHTML = '<b>' + s[0] + '</b><br>' + s[1] + '<br><br>' + s[2];
  }
  Array.prototype.forEach.call(document.querySelectorAll('#stake .chip'), function (c) {
    c.onclick = function () {
      document.querySelectorAll('#stake .chip').forEach(function (x) { x.classList.remove('on'); });
      c.classList.add('on'); showStake(c.dataset.k);
    };
  });
  showStake('eng');

  // click-test demo
  var cueDemo = document.getElementById('cueDemo');
  var cueBtn = document.getElementById('revealCues');
  var resA = document.getElementById('resA'), resB = document.getElementById('resB');
  var revealed = false;
  cueBtn.onclick = function () {
    revealed = !revealed;
    cueDemo.classList.toggle('show', revealed);
    cueBtn.textContent = revealed ? 'Hide again' : "Reveal what's clickable";
    if (revealed) {
      resA.textContent = 'Six clickable items, and nothing told you which ones.';
      resB.textContent = 'Same six items, and the design told you up front.';
      resA.classList.add('done'); resB.classList.add('done');
    } else {
      resA.textContent = resB.textContent = 'Look closely. Can you tell?';
      resA.classList.remove('done'); resB.classList.remove('done');
    }
  };

  // AI field
  var field = document.getElementById('field');
  var dots = [];
  var colors = ['#7c5cff', '#22d3ee', '#f97316', '#10b981', '#ec4899', '#eab308'];
  function rnd(a, b) { return a + Math.random() * (b - a); }
  for (var i = 0; i < 36; i++) {
    var d = document.createElement('div');
    d.className = 'dot';
    d.style.background = colors[i % colors.length];
    d.home = [rnd(4, 92), rnd(6, 90)];
    d.close = [rnd(38, 58), rnd(38, 58)];
    field.appendChild(d); dots.push(d);
  }
  function place(mode) {
    dots.forEach(function (d) {
      var p = mode ? d.close : d.home;
      d.style.left = p[0] + '%'; d.style.top = p[1] + '%';
    });
  }
  place(false);
  var off = document.getElementById('aiOff'), on = document.getElementById('aiOn');
  off.onclick = function () { place(false); off.classList.add('on'); on.classList.remove('on'); };
  on.onclick = function () { place(true); on.classList.add('on'); off.classList.remove('on'); };

  // phone
  var phone = document.getElementById('phone');
  function togglePhone() { phone.classList.toggle('on'); }
  phone.addEventListener('click', togglePhone);
  phone.addEventListener('keydown', function (e) { if (e.key === 'Enter') togglePhone(); });
  setTimeout(function () { phone.classList.add('on'); }, 800);

  // recommendations
  var RECS = [
    { t: '1. Personality as a requirement', what: 'Write a short "character brief" at the start of a project and review features against it like performance goals.', ben: 'Expressive choices become deliberate and maintainable. Engineers get a clear role.', ch: 'Can turn into inconsistency. Define a few signature elements (motion, sound, color) and apply them everywhere.' },
    { t: '2. Cues + character', what: 'Test interfaces with simple click-timing or eye-tracking checks before adopting a minimalist trend. Add depth, motion, or labels where flat designs slow people down.', ben: 'Personality earns its place by also helping users.', ch: 'Testing takes time. Small teams can start with a handful of users and a prototype.' },
    { t: '3. AI widens, not replaces', what: 'Sketch or write your own ideas first, then use AI to extend or critique them. Collect inspiration from outside your industry.', ben: 'Keep the creativity gains of AI without everyone converging on the same output.', ch: 'Slower than taking the first good option. Run small experiments comparing AI-first and human-first drafts.' },
    { t: '4. Measure design quality', what: 'Track design indicators next to efficiency: leadership reviews of the product experience, designers in planning, user ratings of how it feels.', ben: 'Long-term value stays visible under quarterly pressure. Shareholders get something concrete to ask about.', ch: 'McKinsey shows correlation, not causation. Treat it as a hypothesis and compare products with and without extra design investment.' },
    { t: '5. Stay collaborative', what: 'Share small experiments and results across levels of the organization so decisions rest on data from your own products.', ben: 'Engineers, managers, and investors align instead of blocking each other.', ch: 'Different companies will find different answers, and some may reasonably choose plain.' }
  ];
  var tabs = document.getElementById('tabs'), recbox = document.getElementById('recbox');
  function showRec(i) {
    var r = RECS[i];
    recbox.innerHTML = '<div><h3>' + r.t + '</h3><h5>What to do</h5><p>' + r.what + '</p></div><div><h5>Benefit</h5><p>' + r.ben + '</p></div><div><h5>Challenge</h5><p>' + r.ch + '</p></div>';
    Array.prototype.forEach.call(tabs.children, function (b, j) { b.classList.toggle('on', i === j); });
  }
  RECS.forEach(function (r, i) {
    var b = document.createElement('button');
    b.textContent = ['1. Requirement', '2. Cues + character', '3. Smart AI use', '4. Measure design', '5. Collaborate'][i];
    b.onclick = function () { showRec(i); };
    tabs.appendChild(b);
  });
  showRec(0);
})();
