const container = document.getElementById('container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

// Toggle between Login and Register views
registerBtn.addEventListener('click', () => {
    container.classList.add('active');
    // Clear messages
    document.getElementById('loginMessage').textContent = '';
    document.getElementById('regMessage').textContent = '';
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
    // Clear messages
    document.getElementById('loginMessage').textContent = '';
    document.getElementById('regMessage').textContent = '';
});

// Check if there's a URL parameter to start in register mode
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('mode') === 'register') {
    container.classList.add('active');
}

// Role Selector Logic
let activeLoginRole = 'student';
let activeRegRole = 'student';

document.querySelectorAll('#loginRoleSelector .role-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('#loginRoleSelector .role-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        activeLoginRole = e.target.dataset.role;
    });
});

document.querySelectorAll('#regRoleSelector .role-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('#regRoleSelector .role-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        activeRegRole = e.target.dataset.role;
    });
});

// ----- SUPABASE AUTHENTICATION -----
const SUPABASE_URL = "https://kxqjyqohhjkggtqnwubd.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4cWp5cW9oaGprZ2d0cW53dWJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyNjc5OTcsImV4cCI6MjA3NTg0Mzk5N30.5i3FOotMp470xJ3q5eyjxefg2crOEpXFxuW0M1DOCPo";
let supabaseClient;

if (typeof supabase !== 'undefined' && supabase.createClient) {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("Supabase Client Initialized for Auth");
} else {
    console.error("Supabase could not be initialized.");
}

const loginForm = document.getElementById('loginForm');
const regForm = document.getElementById('registerForm');

// LOGIN HANDLER
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const msgElement = document.getElementById('loginMessage');
    const submitBtn = loginForm.querySelector('button[type="submit"]');

    if(!supabaseClient) {
        msgElement.textContent = "Error: Authentication service is offline.";
        return;
    }

    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;

    try {
        let dbRole;
        const mockEmail = localStorage.getItem('mock_email');
        
        // 1. Check if this is a locally bypassed test account
        const hardcodedRoles = {
            'student@test.com': 'student',
            'teacher@test.com': 'teacher',
            'parent@test.com': 'parent',
            'admin@test.com': 'admin'
        };

        if (hardcodedRoles[email]) {
            alert(`⚠️ Using hardcoded test account for role: ${hardcodedRoles[email].toUpperCase()}`);
            dbRole = hardcodedRoles[email];
        } else if (email === mockEmail) {
            alert("⚠️ Supabase email limit reached. Logging in via your temporary local test account!");
            dbRole = localStorage.getItem('mock_role');
        } else {
            // 2. Normal Supabase attempt
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                // Handle unconfirmed emails from rate limits
                if (error.message.includes("Email not confirmed")) {
                    alert("⚠️ Since the Supabase confirmation email failed to send, your account wasn't activated. Bypassing and logging you in locally!");
                    dbRole = localStorage.getItem('mock_role') || activeLoginRole;
                } else {
                    throw error;
                }
            } else {
                dbRole = data.user?.user_metadata?.role || 'student';
            }
        }
        
        // 3. THE SMART CHECK (The Gatekeeper)
        // We use activeLoginRole (the tab they clicked) instead of currentPage since everything is on auth.html
        if (dbRole !== activeLoginRole) {
            alert(`⚠️ Access Denied! You are registered as a ${dbRole.toUpperCase()}. Please use the ${dbRole.toUpperCase()} tab.`);
            await supabaseClient.auth.signOut(); // Kick them out so they can't sneak in
            throw new Error(`Access Denied!`);
        }

        msgElement.style.color = "green";
        msgElement.textContent = "Success! Redirecting...";
        
        // 4. If everything matches, let them in!
        const rolePaths = {
            'teacher': 'assets/teacher/portfolio.html',
            'student': 'assets/student/dashboard.html',
            'parent': 'assets/parent/portal.html',
            'admin': 'assets/admin/portal.html'
        };

        setTimeout(() => {
            window.location.href = rolePaths[dbRole] || 'index.html';
        }, 800);

    } catch (err) {
        msgElement.style.color = "red";
        msgElement.textContent = err.message || "Login failed.";
        submitBtn.textContent = 'Login';
        submitBtn.disabled = false;
    }
});

// REGISTER HANDLER
regForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const msgElement = document.getElementById('regMessage');
    const submitBtn = regForm.querySelector('button[type="submit"]');

    if(!supabaseClient) {
        msgElement.textContent = "Error: Authentication service is offline.";
        return;
    }

    if(password.length < 6) {
        msgElement.style.color = "red";
        msgElement.textContent = "Password must be at least 6 characters.";
        return;
    }

    submitBtn.textContent = 'Registering...';
    submitBtn.disabled = true;

    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name,
                    role: activeRegRole
                }
            }
        });

        if (error) {
            // MOCK TEST BYPASS FOR SUPABASE RATE LIMITS
            if (error.message.includes("Error sending confirmation email") || error.message.includes("rate limit")) {
                alert("⚠️ Supabase hourly email limit reached! Bypassing their server and registering your test account locally so you can test the features!");
                localStorage.setItem('mock_role', activeRegRole);
                localStorage.setItem('mock_email', email);
                
                msgElement.style.color = "orange";
                msgElement.textContent = "Test account created locally!";
                setTimeout(() => {
                    regForm.reset();
                    submitBtn.textContent = 'Register';
                    submitBtn.disabled = false;
                    container.classList.remove('active');
                    document.getElementById('loginMessage').style.color = "orange";
                    document.getElementById('loginMessage').textContent = "Please log in with your local test account.";
                }, 1500);
                return;
            }
            throw error;
        }

        // Supabase silently ignores new signups with existing emails for security (email enumeration protection).
        // If identities is empty, the user already exists!
        if (data?.user?.identities && data.user.identities.length === 0) {
            alert("❌ This email is already registered. Please login instead.");
            throw new Error("This email is already registered.");
        }

        msgElement.style.color = "green";
        msgElement.textContent = "Account created! You can now login.";
        
        // Clear forms and switch back to Login View
        setTimeout(() => {
            regForm.reset();
            submitBtn.textContent = 'Register';
            submitBtn.disabled = false;
            container.classList.remove('active'); // Slide back to login side
            document.getElementById('loginMessage').style.color = "green";
            document.getElementById('loginMessage').textContent = "Please log in with your new account.";
        }, 1500);

    } catch (err) {
        msgElement.style.color = "red";
        msgElement.textContent = err.message || "Registration failed.";
        submitBtn.textContent = 'Register';
        submitBtn.disabled = false;
    }
});
