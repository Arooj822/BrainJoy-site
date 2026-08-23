import re

with open('public/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace openJoinGame
old_open_join = r'function\s+openJoinGame\(\)\s*\{[^}]+\}'
new_open_join = "function openJoinGame() { window.location.href = 'join.html'; }"
# It might have multiple lines and nested braces, let's use a simpler replace or regex.
# Actually let's just find the exact block since it's simple:
# function openJoinGame() {
#   document.getElementById("joinGameOverlay").classList.add("show");
#   document.getElementById("joinGameModal").classList.add("jg-join-animate");
# }
html = re.sub(r'function openJoinGame\(\)\s*\{[^\}]+\n[^\}]+\n\s*\}', new_open_join, html)
# also replace any simple ones
html = re.sub(r'function openJoinGame\(\)\s*\{\s*document\.getElementById[^}]+\}\s*\}?', new_open_join, html)

# Inject Toast CSS & JS right before </body>
toast_css_js = """
    <!-- Global BrainJoy Toast/Alerts for Missing Sections -->
    <style>
      #bj-global-toast {
        position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%) translateY(100px);
        background: linear-gradient(90deg, #6a0dad, #f50057); color: #fff;
        padding: 12px 24px; border-radius: 30px; font-weight: 700; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        opacity: 0; transition: 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); z-index: 999999;
        display: flex; align-items: center; gap: 10px; pointer-events: none;
      }
      #bj-global-toast.show { transform: translateX(-50%) translateY(0); opacity: 1; pointer-events: all; }
    </style>
    <div id="bj-global-toast">✨ Feature coming in Phase 2!</div>
    <script>
      function showBjToast(msg) {
        const t = document.getElementById('bj-global-toast');
        if(msg) t.innerHTML = msg;
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
    </script>
"""

if "id=\"bj-global-toast\"" not in html:
    html = html.replace("</body>", toast_css_js + "\n</body>")

with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated index.html button logics.")
