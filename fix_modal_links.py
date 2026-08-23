import re

file_path = "c:/Users/USER/OneDrive/Desktop/brainjoy-elite-fresh/public/index.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace all occurrences of Sign Up and Login links to open the modals
# Currently they might be `<a class="btn signup-btn" href="#newsletter">Sign Up</a>`
# We want them to be `<a class="btn signup-btn" onclick="openModal('signupModal')">Sign Up</a>`

content = re.sub(
    r'<a class="btn signup-btn"\s*href="(#newsletter|#)">Sign Up</a>',
    r'<a class="btn signup-btn" style="cursor:pointer;" onclick="openModal(\'signupModal\')">Sign Up</a>',
    content
)

content = re.sub(
    r'<a class="btn login-btn"\s*href="(#newsletter|#)">Login</a>',
    r'<a class="btn login-btn" style="cursor:pointer;" onclick="openModal(\'loginModal\')">Login</a>',
    content
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated links to open modals instead of redirecting.")
