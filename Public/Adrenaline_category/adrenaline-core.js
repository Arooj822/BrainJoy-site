/**
 * adrenaline-core.js
 * Shared engine for the Adrenaline Category game hub (quiz-sprint, podium-heist).
 * Works standalone with localStorage. If a global `supabase` client exists
 * (from supabaseClient.js) and a "questions" / "leaderboard" table is set up,
 * it will sync there too — otherwise everything just works locally.
 */

const AdrenalineCore = (() => {

  const LS_QUESTIONS = 'adrenaline_questions';
  const LS_LEADERBOARD = 'adrenaline_leaderboard';
  const LS_PLAYER = 'adrenaline_player_name';

  // ---------- Default question bank (used if nothing else is set) ----------
  const DEFAULT_QUESTIONS = [
    { q: "What is 7 x 8?", options: ["54", "56", "58", "64"], answer: 1 },
    { q: "Capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], answer: 2 },
    { q: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], answer: 1 },
    { q: "H2O is commonly known as?", options: ["Salt", "Water", "Oxygen", "Hydrogen"], answer: 1 },
    { q: "How many continents are there?", options: ["5", "6", "7", "8"], answer: 2 },
    { q: "Who wrote 'Romeo and Juliet'?", options: ["Dickens", "Shakespeare", "Austen", "Twain"], answer: 1 },
    { q: "What is the square root of 81?", options: ["7", "8", "9", "10"], answer: 2 },
    { q: "Largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: 3 },
  ];

  // ---------- Question bank management ----------
  function getQuestions() {
    const stored = localStorage.getItem(LS_QUESTIONS);
    if (stored) {
      try { return JSON.parse(stored); } catch (e) { /* fall through */ }
    }
    return DEFAULT_QUESTIONS;
  }

  function setQuestions(questionsArray) {
    localStorage.setItem(LS_QUESTIONS, JSON.stringify(questionsArray));
  }

  function addQuestion(q, options, answerIndex) {
    const all = getQuestions();
    all.push({ q, options, answer: answerIndex });
    setQuestions(all);
  }

  function resetToDefaultQuestions() {
    localStorage.removeItem(LS_QUESTIONS);
  }

  /**
   * Try to load questions from Supabase (table: "questions" with columns
   * q, option_a, option_b, option_c, option_d, answer_index).
   * Falls back silently to local questions if supabase isn't configured
   * or the table doesn't exist.
   */
  async function loadQuestionsFromSupabase() {
    if (typeof window.supabase === 'undefined' || !window.supabase) {
      return getQuestions();
    }
    try {
      const { data, error } = await window.supabase.from('questions').select('*');
      if (error || !data || data.length === 0) return getQuestions();
      return data.map(row => ({
        q: row.q,
        options: [row.option_a, row.option_b, row.option_c, row.option_d],
        answer: row.answer_index
      }));
    } catch (e) {
      console.warn('Supabase question load failed, using local questions.', e);
      return getQuestions();
    }
  }

  // ---------- Player identity ----------
  function getPlayerName() {
    let name = localStorage.getItem(LS_PLAYER);
    if (!name) {
      name = 'Player' + Math.floor(Math.random() * 9000 + 1000);
      localStorage.setItem(LS_PLAYER, name);
    }
    return name;
  }

  function setPlayerName(name) {
    localStorage.setItem(LS_PLAYER, name);
  }

  // ---------- Leaderboard ----------
  function getLeaderboard() {
    const stored = localStorage.getItem(LS_LEADERBOARD);
    if (!stored) return [];
    try { return JSON.parse(stored); } catch (e) { return []; }
  }

  function submitScore(name, score, mode) {
    const board = getLeaderboard();
    board.push({ name, score, mode, date: new Date().toISOString() });
    // keep top 50 to avoid unbounded growth
    board.sort((a, b) => b.score - a.score);
    localStorage.setItem(LS_LEADERBOARD, JSON.stringify(board.slice(0, 50)));

    // Best-effort sync to Supabase if available
    if (typeof window.supabase !== 'undefined' && window.supabase) {
      window.supabase.from('leaderboard').insert([{ name, score, mode }])
        .then(() => {})
        .catch(() => {});
    }
  }

  function getTopScores(n = 3, mode = null) {
    let board = getLeaderboard();
    if (mode) board = board.filter(entry => entry.mode === mode);
    return board.sort((a, b) => b.score - a.score).slice(0, n);
  }

  function resetLeaderboard() {
    localStorage.removeItem(LS_LEADERBOARD);
  }

  // ---------- Timer utility ----------
  function startCountdown(seconds, onTick, onEnd) {
    let remaining = seconds;
    onTick(remaining);
    const interval = setInterval(() => {
      remaining -= 1;
      onTick(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onEnd();
      }
    }, 1000);
    return () => clearInterval(interval); // return a cancel function
  }

  // ---------- Scoring helper ----------
  // Faster correct answers score more points (speed-race style),
  // but any correct answer within the time limit still counts for timed mode.
  function calculatePoints(isCorrect, secondsTaken, maxSeconds = 10) {
    if (!isCorrect) return 0;
    const base = 100;
    const speedBonus = Math.max(0, Math.round(((maxSeconds - secondsTaken) / maxSeconds) * 50));
    return base + speedBonus;
  }

  return {
    getQuestions, setQuestions, addQuestion, resetToDefaultQuestions,
    loadQuestionsFromSupabase,
    getPlayerName, setPlayerName,
    getLeaderboard, submitScore, getTopScores, resetLeaderboard,
    startCountdown, calculatePoints
  };
})();
