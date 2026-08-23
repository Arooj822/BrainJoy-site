import sys

with open(r'c:\Users\USER\OneDrive\Desktop\brainjoy-elite-fresh\public\css\style.css', 'r', encoding='utf-8') as f:
    content = f.read()

import re
# Find where the old sidebar CSS starts
marker = "/* ============== ADVANCED ROLE-BASED SIDEBAR (COMMAND CENTER) ============== */"
idx = content.find(marker)

new_css = """    /* ============== OUTCLASS UNIFIED SIDEBAR ============== */
    :root {
      --sidebar-bg: linear-gradient(160deg, #1e003b, #3b0066);
      --sidebar-width: 280px;
      --sidebar-text: #f0e6ff;
      --accent-glow: 0 0 15px rgba(216, 176, 255, 0.4);
    }

    .ns-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(5px);
      z-index: 9998; opacity: 0; pointer-events: none; transition: 0.3s ease;
    }
    .ns-overlay.active { opacity: 1; pointer-events: all; }

    .ns-sidebar {
      position: fixed; top: 0; left: -280px; width: 280px;
      height: 100vh; background: var(--sidebar-bg); z-index: 9999;
      display: flex; flex-direction: column; 
      box-shadow: 10px 0 40px rgba(0,0,0,0.5);
      transition: 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
      overflow-y: auto; color: var(--sidebar-text);
      border-right: 1px solid rgba(255,255,255,0.05);
    }
    .ns-sidebar.active { left: 0; }

    /* Custom scrollbar for sidebar */
    .ns-sidebar::-webkit-scrollbar { width: 5px; }
    .ns-sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }

    /* Header */
    .ns-header {
      padding: 24px 20px;
      display: flex; align-items: center; justify-content: space-between;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      background: rgba(0,0,0,0.2);
    }
    .ns-logo { display:flex; align-items:center; gap: 12px; font-weight: 800; font-size: 1.3rem; color: #fff; letter-spacing: 0.5px; }
    .ns-logo img { width: 32px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); }
    .ns-close { background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; opacity: 0.6; transition: 0.2s; }
    .ns-close:hover { opacity: 1; transform: scale(1.1); }

    /* Role Toggle Container */
    .ns-role-container {
      padding: 15px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .ns-role-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: #a88be3; margin-bottom: 8px; display:block; }
    .ns-role-select {
      width: 100%; padding: 12px 14px; border-radius: 12px;
      background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1);
      color: #fff; font-size: 0.95rem; font-weight: 600; cursor: pointer;
      outline: none; transition: 0.3s;
      appearance: none;
      background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%22%200%22%2012%22%208%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M1.41%200L6%204.58L10.59%200L12%201.41L6%207.41L0%201.41L1.41%200Z%22%20fill%3D%22%23ffffff%22%2F%3E%3C%2Fsvg%3E");
      background-repeat: no-repeat; background-position: right 14px center;
    }
    .ns-role-select:focus { background: rgba(255,255,255,0.15); border-color: #d8b0ff; box-shadow: var(--accent-glow); }
    .ns-role-select option { background: #2a0050; color: #fff; }

    /* Navigation Sections */
    .ns-nav { flex: 1; padding: 20px 0; }
    
    .ns-section { margin-bottom: 24px; padding: 0 20px; display: none; }
    .ns-section.active { display: block; animation: nsFadeIn 0.4s ease; }
    @keyframes nsFadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

    .ns-section-title {
      font-size: 0.75rem; text-transform: uppercase; color: #a88be3;
      letter-spacing: 1.2px; margin-bottom: 12px; font-weight: 700;
    }

    .ns-menu-item {
      display: flex; align-items: center; gap: 12px; padding: 10px 14px;
      margin-bottom: 4px; border-radius: 12px;
      color: var(--sidebar-text); text-decoration: none; font-size: 0.95rem;
      transition: 0.2s;
    }
    .ns-menu-item:hover { 
      background: rgba(255,255,255,0.08); transform: translateX(4px); 
      color: #fff;
    }
    .ns-menu-icon {
      font-size: 1.1rem; width: 24px; text-align: center;
      filter: drop-shadow(0 2px 2px rgba(0,0,0,0.2));
    }
    .ns-badge {
      margin-left: auto; font-size: 0.65rem; background: #ff007a; 
      padding: 2px 6px; border-radius: 10px; font-weight: 700; color: #fff;
      box-shadow: 0 0 8px rgba(255,0,122,0.6);
    }

    /* Global Shared Features (Bottom) */
    .ns-global {
      padding: 20px; border-top: 1px solid rgba(255,255,255,0.08);
      background: rgba(0,0,0,0.15);
    }
    .ns-global-title {
      font-size: 0.7rem; color: #8a6cbd; text-transform: uppercase; 
      letter-spacing: 1px; margin-bottom: 10px;
    }
    .ns-global-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .ns-global-btn {
      display: flex; flex-direction: column; align-items: center; gap: 6px;
      padding: 12px 8px; border-radius: 12px; background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.03); color: #cbb3ff;
      font-size: 0.8rem; cursor: pointer; transition: 0.2s;
      text-decoration: none;
    }
    .ns-global-btn:hover {
      background: rgba(255,255,255,0.12); color: #fff; transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    .ns-global-btn .icon { font-size: 1.2rem; }
"""

if idx != -1:
    new_content = content[:idx] + new_css
    with open(r'c:\Users\USER\OneDrive\Desktop\brainjoy-elite-fresh\public\css\style.css', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("CSS updated successfully.")
else:
    print("Marker not found in CSS!")
