
      function showBjToast(msg) {
        const t = document.getElementById('bj-global-toast');
        if (msg) t.innerHTML = msg;
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 3000);
      }
      // Intercept all internal links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          const targetId = this.getAttribute('href');
          if (targetId === '#' || targetId === '') {
            e.preventDefault();
            showBjToast('🚀 Coming Soon!');
            return;
          }
          const targetEl = document.querySelector(targetId);
          if (!targetEl) {
            e.preventDefault();
            // Try to extract name
            const name = targetId.replace('#', '').replace(/-/g, ' ');
            showBjToast(`✨ The <b>${name}</b> module is arriving in Phase 2!`);
          }
        });
      });
      // Also intercept any a href="#"
      document.querySelectorAll('a[href="#"]').forEach(a => {
        a.addEventListener('click', e => { e.preventDefault(); showBjToast('🚀 Coming Soon!'); });
      });
    