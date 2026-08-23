import re

file_path = "c:/Users/USER/OneDrive/Desktop/brainjoy-elite-fresh/public/index.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace signupUser
signup_old = """        function signupUser() {
          if (!currentSignupRole) return alert("Please go back and select a role.");
          const name = document.getElementById("signupName").value.trim();
          const email = document.getElementById("signupEmail").value.trim();
          const password = document.getElementById("signupPassword").value;
          if (!name || !email || !password) {
            alert("⚠️ Please fill in all fields.");
            return;
          }
          // Simulate signup (store in localStorage for demo)
          localStorage.setItem('user', JSON.stringify({ name, email, role: currentSignupRole }));
          showSignupStep(3); // Go to success step
          alert("🎉 Signed up successfully as " + name + " (" + currentSignupRole + ")! (Stored locally for demo)");
          // Optional: Redirect based on role, e.g., window.location.href = currentSignupRole + '.html';
        }"""

signup_new = """        async function signupUser() {
          if (!currentSignupRole) return alert("Please go back and select a role.");
          const name = document.getElementById("signupName").value.trim();
          const email = document.getElementById("signupEmail").value.trim();
          const password = document.getElementById("signupPassword").value;
          
          if (!name || !email || !password) {
            alert("⚠️ Please fill in all fields.");
            return;
          }
          
          if (!supabase) {
             alert("⚠️ Supabase is not initialized.");
             return;
          }
          
          const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
              data: {
                full_name: name,
                role: currentSignupRole
              }
            }
          });

          if (error) {
             alert("❌ Sign up error: " + error.message);
             return;
          }
          
          // Show email verification message step
          showSignupStep(3);
        }"""

# Replace loginUser
login_old = """        function loginUser() {
          const email = document.getElementById("loginEmail").value.trim();
          const password = document.getElementById("loginPassword").value;
          if (!email || !password) {
            alert("⚠️ Please enter your email and password.");
            return;
          }
          // Simulate login (check against localStorage - ignore password for simplicity)
          const storedUser = JSON.parse(localStorage.getItem('user'));
          if (storedUser && storedUser.email === email) {
            closeModal('loginModal');
            alert("✅ Logged in as " + storedUser.name + " (" + storedUser.role + ")");
            // Optional: Redirect based on role, e.g., window.location.href = storedUser.role + '.html';
          } else {
            alert("❌ Invalid email or password. Try signing up first!");
          }
        }"""

login_new = """        async function loginUser() {
          const email = document.getElementById("loginEmail").value.trim();
          const password = document.getElementById("loginPassword").value;
          
          if (!email || !password) {
            alert("⚠️ Please enter your email and password.");
            return;
          }
          
          if (!supabase) {
             alert("⚠️ Supabase is not initialized.");
             return;
          }

          const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
          });

          if (error) {
            alert("❌ Login error: " + error.message);
            return;
          }
          
          closeModal('loginModal');
          
          const userMeta = data.user.user_metadata;
          const role = userMeta && userMeta.role ? userMeta.role : 'user';
          const name = userMeta && userMeta.full_name ? userMeta.full_name : email;
          
          alert(`✅ Logged in successfully as ${name} (${role})`);
          // Note: In a real app, you would redirect here based on role
          // window.location.href = role + '.html';
        }"""

if signup_old in content and login_old in content:
    content = content.replace(signup_old, signup_new)
    content = content.replace(login_old, login_new)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Successfully replaced Auth functions with Supabase calls.")
else:
    print("Could not find the exact old authentication functions. Proceed to manual replace.")
