import re

with open('public/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# CSS and HTML for login and signup modals
modals_code = """
    <!-- ================== AUTH MODALS ================== -->
    <style>
      .auth-overlay {
        position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(5px);
        display: none; align-items: center; justify-content: center; z-index: 100000;
        opacity: 0; transition: opacity 0.3s ease;
      }
      .auth-overlay[style*="display: flex"] { opacity: 1; }
      .auth-modal {
        background: #fff; width: 100%; max-width: 440px; border-radius: 24px;
        box-shadow: 0 15px 40px rgba(0,0,0,0.2); padding: 30px; position: relative;
        transform: translateY(20px); transition: 0.3s;
      }
      .auth-overlay[style*="display: flex"] .auth-modal { transform: translateY(0); }
      .auth-close { position: absolute; top: 15px; right: 20px; font-size: 1.5rem; background:none; border:none; cursor:pointer; color:#888; }
      .auth-close:hover { color: #333; }
      .auth-title { text-align: center; color: #6a0dad; font-family: 'Baloo 2', cursive; font-size: 2rem; margin-top:0; margin-bottom: 20px; }
      .auth-input { width: 100%; padding: 12px 16px; margin-bottom: 15px; border-radius: 12px; border: 1px solid #ddd; font-size: 1rem; outline:none; }
      .auth-input:focus { border-color: #6a0dad; box-shadow: 0 0 0 3px rgba(106,13,173,0.1); }
      .auth-btn { width: 100%; padding: 14px; background: linear-gradient(90deg, #6a0dad, #9a5cff); color: #fff; border:none; border-radius: 12px; font-weight: 700; font-size: 1.1rem; cursor: pointer; transition: 0.2s; margin-bottom: 10px; }
      .auth-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(106,13,173,0.3); }
      .auth-footer { text-align: center; font-size: 0.9rem; color: #666; }
      .auth-footer a { color: #6a0dad; text-decoration: underline; cursor: pointer; }
    </style>

    <!-- Login Modal -->
    <div id="loginModal" class="auth-overlay">
      <div class="auth-modal">
        <button class="auth-close" onclick="closeModal('loginModal')">&times;</button>
        <h2 class="auth-title">Welcome Back</h2>
        <input type="email" id="loginEmail" class="auth-input" placeholder="Email Address">
        <input type="password" id="loginPassword" class="auth-input" placeholder="Password">
        <button class="auth-btn" onclick="loginUser()">Log In</button>
        <div class="auth-footer">
          Don't have an account? <a onclick="closeModal('loginModal'); openModal('signupModal')">Sign Up</a>
        </div>
      </div>
    </div>

    <!-- Signup Modal -->
    <div id="signupModal" class="auth-overlay">
      <div class="auth-modal">
        <button class="auth-close" onclick="closeModal('signupModal')">&times;</button>
        <div id="signupStep1">
          <h2 class="auth-title">Join BrainJoy</h2>
          <p style="text-align:center; color:#555; margin-bottom:20px;">I am a...</p>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:20px;">
            <button class="auth-input role-btn" style="cursor:pointer;" onclick="selectRole('student')">🎓 Student</button>
            <button class="auth-input role-btn" style="cursor:pointer;" onclick="selectRole('teacher')">👩‍🏫 Teacher</button>
            <button class="auth-input role-btn" style="cursor:pointer;" onclick="selectRole('parent')">👪 Parent</button>
            <button class="auth-input role-btn" style="cursor:pointer;" onclick="selectRole('admin')">🏛 Admin</button>
          </div>
        </div>
        <div id="signupStep2" style="display:none;">
          <h2 class="auth-title" id="signupRoleTitle">Sign Up</h2>
          <input type="text" id="signupName" class="auth-input" placeholder="Full Name">
          <input type="email" id="signupEmail" class="auth-input" placeholder="Email Address">
          <input type="password" id="signupPassword" class="auth-input" placeholder="Password">
          <button class="auth-btn" onclick="signupUser()">Create Account</button>
          <button class="auth-input" style="background:#f5f5f5; border:none; cursor:pointer;" onclick="showSignupStep(1)">Back</button>
        </div>
        <div id="signupStep3" style="display:none; text-align:center;">
          <h2 class="auth-title">Check Your Email</h2>
          <p>We've sent a magic link to verify your account.</p>
          <button class="auth-btn" onclick="closeModal('signupModal')">Got it!</button>
        </div>
        <div class="auth-footer" style="margin-top:15px;">
          Already have an account? <a onclick="closeModal('signupModal'); openModal('loginModal')">Log In</a>
        </div>
      </div>
    </div>
"""

# Remove old basic modals if they existed to prevent duplicates
html = re.sub(r'<!-- Login Modal -->[\s\S]*?<!-- End Login Modal -->', '', html)
html = re.sub(r'<div id="loginModal".*?</div>\s*</div>', '', html, flags=re.DOTALL)
html = re.sub(r'<div id="signupModal".*?</div>\s*</div>\s*</div>', '', html, flags=re.DOTALL)

# Insert before closing body
if "auth-overlay" not in html:
    html = html.replace("</body>", modals_code + "\n</body>")

with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Modals injected.")
