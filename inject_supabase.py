import re

file_path = "c:/Users/USER/OneDrive/Desktop/brainjoy-elite-fresh/public/index.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Inject Supabase script tag into the head
script_tag = '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>'
# Replace the comment indicating removal with the actual tag
content = content.replace('<!-- Removed Supabase JS script here, as we\'re not using it -->', script_tag)

# 2. Inject Supabase client initialization at the top of the general <script> block
# Let's find the main <script> tag towards the bottom
script_start_idx = content.find('<!-- ================== SCRIPTS ================== -->\n      <script>')

if script_start_idx != -1:
    script_insertion_point = script_start_idx + len('<!-- ================== SCRIPTS ================== -->\n      <script>')
    
    supabase_init_code = """
        /* ===== Supabase Initialization ===== */
        const SUPABASE_URL = 'https://kxqjyqohhjkggtqnwubd.supabase.co';
        const SUPABASE_ANON_KEY = 'sb_publishable_sQjeQCi8f6J4iQgyP3jGSA_7fK1Noek';
        let supabase;
        if (window.supabase) {
           supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        } else {
           console.error("Supabase script not loaded properly.");
        }
"""
    
    new_content = content[:script_insertion_point] + "\n" + supabase_init_code + content[script_insertion_point:]
else:
    print("Could not find scripts block to inject Supabase init.")
    exit(1)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Successfully injected Supabase script and client initialization into index.html!")
