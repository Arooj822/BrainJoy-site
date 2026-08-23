import re

file_path = "c:/Users/USER/OneDrive/Desktop/brainjoy-elite-fresh/public/index.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Start string matching the top section
start_pattern = r'<section style="background:#d8b0ff;padding:30px 0;text-align:center">\s*<h2 style="color:#4a148c">🧠 Explore BrainJoy by Role</h2>'

# A robust way to chop out the end: Look for the end of the feature cards section
end_pattern = r'<div class="feature-card-title anim-wiggle-hover">🚀 Coming Soon</div>.*?</section>\s*</section>'

start_match = re.search(start_pattern, content)
end_match = re.search(end_pattern, content, re.DOTALL)

if not start_match or not end_match:
    print("Could not find start or end pattern.")
    if not start_match: print("Start missing")
    if not end_match: print("End missing")
    exit(1)

start_idx = start_match.start()
end_idx = end_match.end()

new_html = """
      <!-- ================== ROLE-BASED FEATURES MAIN SECTION ================== -->
      <section id="role-features" style="padding: 80px 20px; text-align: center; background: #faf8ff;">
        <h2 style="font-size: 2.8rem; color: #4a148c; margin-bottom: 5px;">Discover Your Universe</h2>
        <p style="color: #6a0dad; font-size: 1.1rem; max-width: 600px; margin: 0 auto 40px auto;">
          Everything you need to learn, teach, and grow — tailored perfectly for you.
        </p>

        <!-- AI Tool / Search (keeping the search from old style) -->
        <div style="max-width:620px;margin:0 auto 50px;position:relative">
          <input id="brainjoyQuery" type="text" placeholder="Ask BrainJoy AI (e.g., Explain photosynthesis)"
            style="width:100%;padding:15px 20px;border-radius:50px;border:2px solid #d8b0ff;font-size:1rem;outline:none;box-shadow:0 4px 15px rgba(0,0,0,0.05);" />
          <button onclick="fakeBrainjoyAI()"
            style="position:absolute;right:7px;top:6px;background:var(--purple);color:#fff;border:none;border-radius:30px;padding:10px 18px;cursor:pointer;font-weight:700">Ask</button>
        </div>
        <div id="brainjoyResponse" style="max-width:700px;margin:0 auto 34px;color:var(--purple)"></div>

        <!-- NEW MODERN ROLE TABS -->
        <div class="pf-role-tabs">
          <button class="pf-role-btn active" onclick="switchPfRole('student')">
            <span class="pf-icon">🎓</span> Students
          </button>
          <button class="pf-role-btn" onclick="switchPfRole('teacher')">
            <span class="pf-icon">👩‍🏫</span> Teachers
          </button>
          <button class="pf-role-btn" onclick="switchPfRole('parent')">
            <span class="pf-icon">👪</span> Parents
          </button>
          <button class="pf-role-btn" onclick="switchPfRole('admin')">
            <span class="pf-icon">🏛</span> Admins
          </button>
        </div>

        <!-- FEATURE PANELS -->
        <div class="pf-panels">
          
          <!-- STUDENT PANEL -->
          <div id="pf-panel-student" class="pf-panel active">
            <div class="pf-panel-header">
              <h3>Student Learning Hub</h3>
              <p>Master any subject, track your progress, and play fun games.</p>
            </div>
            <div class="pf-grid">
              <div class="pf-card" onclick="window.location.href='#learning-tools'">
                <div class="pf-card-icon">📚</div>
                <h4>Study Guides</h4>
                <p>Quick outlines & core concepts.</p>
              </div>
              <div class="pf-card" onclick="window.location.href='#study-tools'">
                <div class="pf-card-icon">🤖</div>
                <h4>BrainJoy Tutor</h4>
                <p>AI-powered 24/7 homework help.</p>
              </div>
              <div class="pf-card" onclick="window.location.href='#learning-tools'">
                <div class="pf-card-icon">🗂</div>
                <h4>Flashcards</h4>
                <p>Visual learning for quick recall.</p>
              </div>
              <div class="pf-card" onclick="window.location.href='#quizzes'">
                <div class="pf-card-icon">🎮</div>
                <h4>Games & Quizzes</h4>
                <p>Play challenges & join live games.</p>
              </div>
              <div class="pf-card" onclick="window.location.href='#learners'">
                <div class="pf-card-icon">⏱</div>
                <h4>Focus Timer</h4>
                <p>Stay productive & earn rewards.</p>
              </div>
              <div class="pf-card" onclick="window.location.href='#learners'">
                <div class="pf-card-icon">🏆</div>
                <h4>Daily Challenge</h4>
                <p>Complete quests & top leaderboards.</p>
              </div>
            </div>
          </div>

          <!-- TEACHER PANEL -->
          <div id="pf-panel-teacher" class="pf-panel">
            <div class="pf-panel-header">
              <h3>Teacher Command Center</h3>
              <p>Create dynamic lessons, monitor students, and free up your time.</p>
            </div>
            <div class="pf-grid">
              <div class="pf-card" onclick="window.location.href='#planner-section'">
                <div class="pf-card-icon">📝</div>
                <h4>AI Lesson Planner</h4>
                <p>Generate full lessons in seconds.</p>
              </div>
              <div class="pf-card" onclick="window.location.href='#teaching-games'">
                <div class="pf-card-icon">🎯</div>
                <h4>Live Review Game</h4>
                <p>Host whole-class interactive quizzes.</p>
              </div>
              <div class="pf-card" onclick="window.location.href='#teachers'">
                <div class="pf-card-icon">🧮</div>
                <h4>Quiz Builder AI</h4>
                <p>Auto-generate tests from topics.</p>
              </div>
              <div class="pf-card" onclick="window.location.href='#teachers'">
                <div class="pf-card-icon">📂</div>
                <h4>Classroom Dash</h4>
                <p>Organize assignments & grades.</p>
              </div>
              <div class="pf-card" onclick="window.location.href='#teachers'">
                <div class="pf-card-icon">📊</div>
                <h4>Student Progress</h4>
                <p>Real-time analytics and alerts.</p>
              </div>
              <div class="pf-card" onclick="window.location.href='#teachers'">
                <div class="pf-card-icon">⚡</div>
                <h4>BrainBlast Mode</h4>
                <p>High-energy review sessions.</p>
              </div>
            </div>
          </div>

          <!-- PARENT PANEL -->
          <div id="pf-panel-parent" class="pf-panel">
            <div class="pf-panel-header">
              <h3>Parent Insights Portal</h3>
              <p>Stay connected with your child's learning journey invisibly.</p>
            </div>
            <div class="pf-grid">
              <div class="pf-card" onclick="window.location.href='#impact'">
                <div class="pf-card-icon">📈</div>
                <h4>Progress Reports</h4>
                <p>Weekly insights on strengths & gaps.</p>
              </div>
              <div class="pf-card" onclick="window.location.href='#subjects-menu'">
                <div class="pf-card-icon">🎯</div>
                <h4>Curriculum Guide</h4>
                <p>Understand what they're learning.</p>
              </div>
              <div class="pf-card" onclick="window.location.href='#impact'">
                <div class="pf-card-icon">🎁</div>
                <h4>Reward System</h4>
                <p>Set goals & unlock real rewards.</p>
              </div>
              <div class="pf-card" onclick="window.location.href='#impact'">
                <div class="pf-card-icon">⏳</div>
                <h4>Screen Time Limits</h4>
                <p>Healthy learning boundaries.</p>
              </div>
            </div>
          </div>

          <!-- ADMIN PANEL -->
          <div id="pf-panel-admin" class="pf-panel">
            <div class="pf-panel-header">
              <h3>Admin & School Console</h3>
              <p>Manage your entire school district with powerful insights.</p>
            </div>
            <div class="pf-grid">
              <div class="pf-card" onclick="window.location.href='#stats'">
                <div class="pf-card-icon">🏛</div>
                <h4>District Overview</h4>
                <p>School-wide analytics & health.</p>
              </div>
              <div class="pf-card" onclick="window.location.href='#partners'">
                <div class="pf-card-icon">👥</div>
                <h4>Mass Import</h4>
                <p>Sync via Clever, CSV, or Google.</p>
              </div>
              <div class="pf-card" onclick="window.location.href='#teachers'">
                <div class="pf-card-icon">🧰</div>
                <h4>Teacher Controls</h4>
                <p>Manage staff access & curriculum.</p>
              </div>
              <div class="pf-card" onclick="window.location.href='#stats'">
                <div class="pf-card-icon">📉</div>
                <h4>Engagement Reports</h4>
                <p>Detailed ROI & usage metrics.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      <style>
        /* Professional Features UI Styles */
        .pf-role-tabs {
          display: flex;
          justify-content: center;
          gap: 15px;
          flex-wrap: wrap;
          margin-bottom: 40px;
        }
        .pf-role-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fff;
          border: 2px solid #e0d4ff;
          color: #6a0dad;
          padding: 14px 32px;
          border-radius: 50px;
          font-size: 1.15rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          box-shadow: 0 4px 10px rgba(0,0,0,0.03);
        }
        .pf-role-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(106, 13, 173, 0.15);
          border-color: #6a0dad;
        }
        .pf-role-btn.active {
          background: linear-gradient(135deg, #6a0dad, #9a5cff);
          color: #fff;
          border-color: transparent;
          box-shadow: 0 8px 25px rgba(106, 13, 173, 0.35);
        }
        .pf-role-btn.active .pf-icon {
          transform: scale(1.2);
        }
        .pf-icon {
          transition: transform 0.3s ease;
          font-size: 1.3rem;
        }
        
        .pf-panels {
          max-width: 1000px;
          margin: 0 auto;
          text-align: left;
        }
        .pf-panel {
          display: none;
          animation: fade-up 0.4s ease forwards;
        }
        .pf-panel.active {
          display: block;
        }

        .pf-panel-header {
          text-align: center;
          margin-bottom: 35px;
        }
        .pf-panel-header h3 {
          font-size: 2.2rem;
          color: #333;
          margin-bottom: 8px;
        }
        .pf-panel-header p {
          color: #666;
          font-size: 1.1rem;
        }

        .pf-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }
        
        .pf-card {
          background: #fff;
          border: 1px solid #eee;
          border-radius: 16px;
          padding: 24px;
          transition: all 0.3s ease;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-decoration: none;
        }
        .pf-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(106, 13, 173, 0.12);
          border-color: #d8b0ff;
        }
        .pf-card-icon {
          font-size: 2.2rem;
          margin-bottom: 16px;
          background: #fdfcff;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.04);
        }
        .pf-card h4 {
          margin: 0 0 8px 0;
          font-size: 1.25rem;
          color: #222;
        }
        .pf-card p {
          margin: 0;
          color: #666;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      </style>

      <script>
        function switchPfRole(role) {
          // Update buttons
          document.querySelectorAll('.pf-role-btn').forEach(btn => {
            btn.classList.remove('active');
          });
          event.currentTarget.classList.add('active');

          // Update panels
          document.querySelectorAll('.pf-panel').forEach(panel => {
            panel.classList.remove('active');
          });
          document.getElementById('pf-panel-' + role).classList.add('active');
        }
      </script>
"""

new_content = content[:start_idx] + new_html + content[end_idx:]

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Successfully updated index.html!")
