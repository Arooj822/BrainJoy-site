import re

file_path = "c:/Users/USER/OneDrive/Desktop/brainjoy-elite-fresh/public/index.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# We need to make sure the loginUser is correctly closed.
# It looks like the issue was introduced when replacing the function blocks.

# Let's cleanly replace the entire Auth section 
auth_start_marker = "/* ===== Auth (No Supabase - Use LocalStorage for Demo) ===== */"
donation_marker = "/* ===== Donation helpers (PayPal / Stripe / BMC) ===== */"

start_idx = content.find(auth_start_marker)
end_idx = content.find(donation_marker)

if start_idx != -1 and end_idx != -1:
    new_auth_section = """/* ===== Auth Options ===== */
        async function signupUser() {
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
        }

        async function loginUser() {
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
        }
        """
    
    content = content[:start_idx] + new_auth_section + content[end_idx:]
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Replaced auth functions cleanly.")
else:
    print("Could not find markers.")
