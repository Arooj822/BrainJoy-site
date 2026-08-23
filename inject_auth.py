import re

with open('public/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

new_auth_scripts = """
      /* ===== Supabase Auth Overrides ===== */
      async function signupUser() {
        if (!supabase) return alert("Supabase is not initialized.");
        if (!currentSignupRole) return alert("Please go back and select a role.");

        const name = document.getElementById("signupName").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const password = document.getElementById("signupPassword").value;

        if (!name || !email || !password) {
            alert("⚠️ Please fill in all fields.");
            return;
        }

        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = "Creating Account...";
        btn.disabled = true;

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name,
              role: currentSignupRole
            }
          }
        });

        btn.textContent = originalText;
        btn.disabled = false;

        if (error) {
          alert("❌ " + error.message);
        } else {
          showSignupStep(3);
        }
      }

      async function loginUser() {
        if (!supabase) return alert("Supabase is not initialized.");
        
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        if (!email || !password) {
            alert("⚠️ Please enter your email and password.");
            return;
        }

        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = "Logging In...";
        btn.disabled = true;

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        
        btn.textContent = originalText;
        btn.disabled = false;

        if (error) {
            alert("❌ " + error.message);
        } else {
            closeModal('loginModal');
            const role = data.user.user_metadata?.role || 'student';
            if (role === 'teacher') {
                window.location.href = '/teacher';
            } else if (role === 'admin') {
                window.location.href = '/admin';
            } else {
                window.location.href = '/student';
            }
        }
      }
"""

# Try to replace the existing signup/login functions
# They start around `async function signupUser()` and end around `window.location.href = '/student';`
import re
# We'll replace everything from `async function signupUser` to `window.location.href = '/student';\s*}\s*}`
pattern = r'async\s+function\s+signupUser\(\)\s*\{.*?window\.location\.href\s*=\s*\'/student\';\s*\}\s*\}'

if re.search(pattern, html, re.DOTALL):
    html = re.sub(pattern, new_auth_scripts.strip(), html, flags=re.DOTALL)
    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Auth logic updated via regex.")
else:
    print("Regex failed to match auth section.")

