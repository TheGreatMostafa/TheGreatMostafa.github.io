(function () {
  'use strict';

  /* ── Custom cursor (Hardware Accelerated) ── */
  const cur = document.getElementById('cur');
  const curRing = document.getElementById('curRing');
  const canUseCustomCursor =
    cur &&
    curRing &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (canUseCustomCursor) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    // We only track coordinates on mousemove. 
    // Updating DOM directly here causes lag, so we save it for requestAnimationFrame.
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Let the GPU update the visuals smoothly based on the screen's refresh rate
    function animateCursor() {
      cur.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    
      // Lerp math for the ring so it follows the dot with a slight delay
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      curRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    
      requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);

    // Expand the cursor when hovering over clickable items
    document.querySelectorAll('a, button, .work-card, .stat, .skill-item').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cur.classList.add('expanded');
        curRing.classList.add('expanded');
      });
      el.addEventListener('mouseleave', () => {
        cur.classList.remove('expanded');
        curRing.classList.remove('expanded');
      });
    });
  }

  /* ── Navbar Drop Shadow on Scroll ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true }); // passive:true improves scroll performance on mobile

  /* ── Infinite Marquee Builder ── */
  // We duplicate the array 4 times so it loops seamlessly on ultrawide monitors
  const skills = [
    'C', 'C++', 'Java', 'Python',
    'JavaScript', 'HTML5', 'CSS3', 'JavaFX',
    'MySQL', 'SQLite', 'Git', 'GitHub',
    'Linux', 'Fedora', 'Open Source', 'Algorithms'
  ];

  const marqueeEl = document.getElementById('marquee');
  if (marqueeEl) {
    const doubled = [...skills, ...skills, ...skills, ...skills];
    const fragment = document.createDocumentFragment();

    doubled.forEach((skill) => {
      const item = document.createElement('span');
      const dot = document.createElement('span');

      item.className = 'marquee-item';
      dot.className = 'marquee-dot';
      dot.textContent = '·';

      item.append(dot, document.createTextNode(skill));
      fragment.appendChild(item);
    });

    marqueeEl.replaceChildren(fragment);
  }

  /* ── Scroll Spy (Highlights Nav Links) ── */
  const sections = document.querySelectorAll('section');
  const navTextLinks = document.querySelectorAll('.nav-links a:not(.nav-icon)');

  window.addEventListener('scroll', () => {
    let current = '';
    
    // Check which section we are currently looking at
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      // Trigger 150px before the top hits the screen edge so it feels natural
      if (scrollY >= (sectionTop - 150)) {
        if (section.hasAttribute('id')) {
          current = section.getAttribute('id');
        }
      }
    });

    // Fail-safe: Because 'contact' is so small and at the bottom, 
    // it rarely hits the top trigger. This forces it active if we hit the bottom of the page.
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
      current = 'contact';
    }

    // Loop through links, remove active class, and add it to the correct one
    navTextLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });

})();
