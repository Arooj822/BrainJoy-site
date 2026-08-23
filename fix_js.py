import re

with open('public/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Define the robust replacement for the scroll listener and fakeBrainjoyAI
new_js_block = """
      window.addEventListener('scroll', () => {
        const s = document.getElementById('stats');
        if (s && !statsStarted && s.getBoundingClientRect().top < window.innerHeight) {
          statsStarted = true;
          animateValue("stat1", 0, 5000, 2000);
          animateValue("stat2", 0, 1200, 2000);
          animateValue("stat3", 0, 850, 2000);
          animateValue("stat4", 0, 42, 2000);
        }
      });

      /* AI placeholder with Loading State */
      function fakeBrainjoyAI() {
        const qInput = document.getElementById('brainjoyQuery');
        const q = qInput ? qInput.value.trim() : "";
        const box = document.getElementById('brainjoyResponse');

        if (!q) {
          if (qInput) qInput.style.borderColor = 'red';
          if (box) box.innerHTML = "<span style='color:red'>⚠️ Please type a question first!</span>";
          setTimeout(() => { if (qInput) qInput.style.borderColor = '#d8b0ff'; }, 2000);
          return;
        }

        if (qInput) qInput.style.borderColor = '#4CAF50';
        if (box) box.innerHTML = "⏳ <span style='color:#6a0dad'>BrainJoy AI is thinking...</span>";

        // Simulate network request
        setTimeout(() => {
          if (box) {
            box.innerHTML = "🧠 <b>BrainJoy AI:</b> Here is a smart, joyful explanation for: <i>“" + q + "”</i><br><br>(AI connection pending, but imagine a perfect personalized answer here!)";
          }
        }, 1500);
      }
"""

# Pattern to find the existing block (even if slightly varied)
# We look for the scroll listener and fakeBrainjoyAI function
pattern = r"window\.addEventListener\('scroll', .*?function fakeBrainjoyAI\(\) \{.*?\}\n"

if re.search(pattern, content, re.DOTALL):
    new_content = re.sub(pattern, new_js_block, content, flags=re.DOTALL)
    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Done! Block replaced successfully using pattern matching.")
else:
    print("Pattern not found. The file might already be fixed or structured differently.")

