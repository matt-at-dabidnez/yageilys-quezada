/* ============================================
   Feliz Día de San Valentín — Yageilys
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('pink-overlay');
  const bloomBtn = document.getElementById('bloom-btn');
  const bouquet = document.getElementById('bouquet');
  const loveText = document.getElementById('love-text');
  const nameTextEl = document.getElementById('name-text');
  const messageTextEl = document.getElementById('message-text');
  const music = document.getElementById('bg-music');
  const muteBtn = document.getElementById('mute-btn');
  const heartsContainer = document.getElementById('hearts-container');
  const vignette = document.querySelector('.vignette');

  // Generate all SVG roses on load with unique IDs
  document.querySelectorAll('.rose-svg').forEach((svg, idx) => buildRoseSVG(svg, idx));

  /* -----------------------------------------
     STATE 1 → 2: Toca para comenzar
     ----------------------------------------- */
  overlay.addEventListener('click', () => {
    music.volume = 0.4;
    music.play().catch(() => {});

    muteBtn.classList.remove('hidden');
    muteBtn.classList.add('visible');

    overlay.classList.add('reveal');

    setTimeout(() => {
      overlay.style.display = 'none';
      bloomBtn.classList.add('visible');
    }, 1600);
  });

  /* -----------------------------------------
     STATE 3 → 4: Toca los capullos
     Buds grow UP while bouquet grows FROM them
     ----------------------------------------- */
  bloomBtn.addEventListener('click', () => {
    // Bud grows outward (scales up + fades)
    bloomBtn.classList.add('fade-out');

    // Bouquet emerges simultaneously — no delay, no hard cut
    bouquet.classList.add('growing');
    vignette.classList.add('active');

    // After bud fully fades (1s), remove it and start petal bloom
    setTimeout(() => {
      bloomBtn.style.display = 'none';
      bouquet.classList.add('blooming');
    }, 900);

    // Corazones flotantes
    setTimeout(() => spawnHearts(15), 2500);

    // Show text container
    setTimeout(() => {
      loveText.classList.remove('hidden');
      loveText.classList.add('visible');

      // Name types first — slow and romantic
      const nameLine = document.querySelector('.name-line');
      nameLine.classList.add('visible');
      typeMessage(nameTextEl, 'Yageilys Quezada', 140).then(() => {
        // Name settles, start glowing
        setTimeout(() => nameLine.classList.add('glow'), 800);

        // Then message types below — slightly faster
        setTimeout(() => {
          const msgLine = document.querySelector('.message-line');
          msgLine.classList.add('visible');
          typeMessage(
            messageTextEl,
            'Feliz Día de San Valentín mi fuerte y hermosa reina negra \u{1F60D}',
            70
          ).then(() => {
            setTimeout(() => {
              document.querySelector('.cursor').classList.add('fade');
            }, 1500);
            spawnHearts(10);

            // Love letter — types line by line after main message
            setTimeout(() => typeLoveLetter(), 2500);
          });
        }, 600);
      });
    }, 3800);
  });

  /* -----------------------------------------
     Silenciar / Activar música
     ----------------------------------------- */
  muteBtn.addEventListener('click', () => {
    music.muted = !music.muted;
    muteBtn.classList.toggle('muted', music.muted);
  });

  /* -----------------------------------------
     Efecto máquina de escribir
     ----------------------------------------- */
  function typeMessage(element, text, speed) {
    let i = 0;
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        element.textContent += text[i];
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          resolve();
        }
      }, speed);
    });
  }

  /* -----------------------------------------
     Love Letter — sequential typewriter
     ----------------------------------------- */
  const letterLines = [
    'Desde que te conocí... me robaste el corazón.',
    'Recuerdo nuestra primera cita, donde todo salió mal... pero aún así te hice reír.',
    'Eso es todo lo que quiero... hacerte reír y ser feliz.',
    'Quiero criar hijos juntos... quiero toda una vida contigo.',
    'Ahora mismo... esto es todo lo que puedo darte... pero tú mereces el mundo entero.',
    'Con todo mi amor, Matthew Rizaldi',
    'Gracias por llegar a mi vida. Te amo.'
  ];

  async function typeLoveLetter() {
    const scroll = document.getElementById('love-letter');
    scroll.classList.add('unrolling');

    for (let i = 0; i < letterLines.length; i++) {
      const el = document.getElementById(`letter-${i}`);
      el.classList.add('visible');

      // Grow scroll to fit content as each line types
      scroll.style.maxHeight = scroll.scrollHeight + 80 + 'px';

      await typeMessage(el, letterLines[i], 60);

      // Re-measure after text is fully typed
      scroll.style.maxHeight = scroll.scrollHeight + 40 + 'px';

      // Pause between lines
      await new Promise(r => setTimeout(r, 800));
      if (i === 4) spawnHearts(8);
    }
    // Final expand to ensure all content visible
    scroll.style.maxHeight = scroll.scrollHeight + 40 + 'px';
    spawnHearts(15);
  }

  /* -----------------------------------------
     Corazones flotantes
     ----------------------------------------- */
  function spawnHearts(count) {
    const hearts = ['\u2764\uFE0F', '\u{1F339}', '\u{1F497}', '\u{1F495}', '\u{1F493}', '\u{1F49E}'];
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const heart = document.createElement('span');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

        const centerX = window.innerWidth / 2;
        const spread = window.innerWidth * 0.4;
        heart.style.left = (centerX - spread / 2 + Math.random() * spread) + 'px';
        heart.style.bottom = '25%';
        heart.style.fontSize = (16 + Math.random() * 18) + 'px';
        heart.style.animationDuration = (3 + Math.random() * 3) + 's';

        heartsContainer.appendChild(heart);
        heart.addEventListener('animationend', () => heart.remove());
      }, i * 250);
    }
  }

  /* -----------------------------------------
     SVG Rose Builder — Realistic Petals
     Each rose = 4 layers of curved petals
     drawn with cubic bezier paths
     ----------------------------------------- */
  function buildRoseSVG(svg, roseIndex) {
    const ns = 'http://www.w3.org/2000/svg';
    const uid = `r${roseIndex}`;

    const defs = document.createElementNS(ns, 'defs');

    const outerGrad = createRadialGradient(ns, `${uid}-outer`, [
      { offset: '0%', color: '#ff6b7a' },
      { offset: '35%', color: '#e8364f' },
      { offset: '70%', color: '#c41e3a' },
      { offset: '100%', color: '#8b0000' }
    ]);

    const midGrad = createRadialGradient(ns, `${uid}-mid`, [
      { offset: '0%', color: '#ff8a9b' },
      { offset: '40%', color: '#ff6b7a' },
      { offset: '75%', color: '#e8364f' },
      { offset: '100%', color: '#b8162e' }
    ]);

    const innerGrad = createRadialGradient(ns, `${uid}-inner`, [
      { offset: '0%', color: '#ffb3c1' },
      { offset: '40%', color: '#ff8a9b' },
      { offset: '80%', color: '#ff6b7a' },
      { offset: '100%', color: '#e8364f' }
    ]);

    const centerGrad = createRadialGradient(ns, `${uid}-center`, [
      { offset: '0%', color: '#ffd1dc' },
      { offset: '50%', color: '#ff8a9b' },
      { offset: '100%', color: '#e8364f' }
    ]);

    defs.appendChild(outerGrad);
    defs.appendChild(midGrad);
    defs.appendChild(innerGrad);
    defs.appendChild(centerGrad);
    svg.appendChild(defs);

    // Each rose gets a unique random rotation for natural variety
    const roseRotation = (Math.random() - 0.5) * 40;

    // OUTER PETALS — 5 large petals with curled edges
    const outerGroup = document.createElementNS(ns, 'g');
    outerGroup.classList.add('petal-outer');
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60) + roseRotation;
      const petal = createPetal(ns, 50, 50, 26, 36, angle, `url(#${uid}-outer)`);
      outerGroup.appendChild(petal);
    }
    svg.appendChild(outerGroup);

    // MID PETALS — 5 medium petals, offset rotation
    const midGroup = document.createElementNS(ns, 'g');
    midGroup.classList.add('petal-mid');
    for (let i = 0; i < 5; i++) {
      const angle = (i * 72) + 36 + roseRotation;
      const petal = createPetal(ns, 50, 50, 20, 28, angle, `url(#${uid}-mid)`);
      midGroup.appendChild(petal);
    }
    svg.appendChild(midGroup);

    // INNER PETALS — 5 smaller, tighter
    const innerGroup = document.createElementNS(ns, 'g');
    innerGroup.classList.add('petal-inner');
    for (let i = 0; i < 5; i++) {
      const angle = (i * 72) + 15 + roseRotation;
      const petal = createPetal(ns, 50, 50, 14, 20, angle, `url(#${uid}-inner)`);
      innerGroup.appendChild(petal);
    }
    svg.appendChild(innerGroup);

    // INNERMOST PETALS — 4 tiny curled ones
    const coreGroup = document.createElementNS(ns, 'g');
    coreGroup.classList.add('petal-inner');
    for (let i = 0; i < 4; i++) {
      const angle = (i * 90) + 45 + roseRotation;
      const petal = createPetal(ns, 50, 50, 9, 14, angle, `url(#${uid}-inner)`);
      coreGroup.appendChild(petal);
    }
    svg.appendChild(coreGroup);

    // CENTER BUD
    const center = document.createElementNS(ns, 'circle');
    center.setAttribute('cx', '50');
    center.setAttribute('cy', '50');
    center.setAttribute('r', '7');
    center.setAttribute('fill', `url(#${uid}-center)`);
    center.classList.add('rose-center-circle');
    svg.appendChild(center);

    // Spiral detail in center
    const spiral = document.createElementNS(ns, 'path');
    spiral.setAttribute('d', 'M50 45 Q54 43 55 47 Q56 51 52 53 Q48 55 46 51 Q44 47 48 45 Q51 43 53 46');
    spiral.setAttribute('fill', 'none');
    spiral.setAttribute('stroke', '#c41e3a');
    spiral.setAttribute('stroke-width', '1.2');
    spiral.setAttribute('opacity', '0.5');
    spiral.setAttribute('stroke-linecap', 'round');
    spiral.classList.add('rose-center-circle');
    svg.appendChild(spiral);
  }

  /**
   * Creates a single realistic rose petal as an SVG path.
   * Uses cubic bezier curves to form a teardrop/heart shape
   * with natural curvature and asymmetry.
   */
  function createPetal(ns, cx, cy, width, height, angleDeg, fill) {
    const path = document.createElementNS(ns, 'path');

    // Petal shape: teardrop with curvature
    // Start at center, curve out to tip, curve back
    const w = width / 2;
    const h = height;

    // Slight asymmetry for realism
    const asym = (Math.random() - 0.5) * 3;

    const d = `
      M 0,0
      C ${-w - 2 + asym},${-h * 0.35}  ${-w - 4},${-h * 0.7}  ${asym},${-h}
      C ${w + 4},${-h * 0.7}  ${w + 2 - asym},${-h * 0.35}  0,0
      Z
    `;

    path.setAttribute('d', d);
    path.setAttribute('fill', fill);
    path.setAttribute('opacity', '0.92');
    path.setAttribute('transform', `translate(${cx}, ${cy}) rotate(${angleDeg})`);

    // Subtle shadow for depth
    path.setAttribute('filter', '');
    path.style.filter = 'drop-shadow(0px 1px 1px rgba(80,0,0,0.2))';

    return path;
  }

  function createRadialGradient(ns, id, stops) {
    const grad = document.createElementNS(ns, 'radialGradient');
    grad.setAttribute('id', id);
    grad.setAttribute('cx', '35%');
    grad.setAttribute('cy', '30%');
    grad.setAttribute('r', '65%');

    stops.forEach(s => {
      const stop = document.createElementNS(ns, 'stop');
      stop.setAttribute('offset', s.offset);
      stop.setAttribute('stop-color', s.color);
      grad.appendChild(stop);
    });

    return grad;
  }
});
