// BrainJoy quiz core - shared backend helpers.
// Uses Supabase when reachable; falls back to localStorage so quizzes still
// save and play on this device while the backend is being restored.
(function () {
  const SUPABASE_URL = 'https://kxqjyqohhjkggtqnwubd.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_sQjeQCi8f6J4iQgyP3jGSA_7fK1Noek';
  const LOCAL_KEY = 'bj_quizzes';

  let client = null;
  try {
    if (window.supabase && window.supabase.createClient) {
      client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
  } catch (e) { client = null; }

  function readLocal() {
    try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]'); }
    catch (e) { return []; }
  }
  function writeLocal(list) {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
  }

  window.bjQuizStore = {
    mode: 'checking',

    async init() {
      if (!client) { this.mode = 'local'; return this.mode; }
      try {
        const ctrl = new AbortController();
        setTimeout(() => ctrl.abort(), 4000);
        const { error } = await client.from('quizzes').select('id', { head: true, count: 'exact' }).limit(1);
        this.mode = error ? 'local' : 'cloud';
      } catch (e) { this.mode = 'local'; }
      return this.mode;
    },

    async saveQuiz(quiz) {
      quiz.updated_at = new Date().toISOString();
      if (this.mode === 'cloud') {
        const row = {
          title: quiz.title, subject: quiz.subject, grade: quiz.grade,
          questions: quiz.questions, updated_at: quiz.updated_at
        };
        let q;
        if (quiz.id && !String(quiz.id).startsWith('local-')) {
          q = client.from('quizzes').update(row).eq('id', quiz.id).select().single();
        } else {
          q = client.from('quizzes').insert([row]).select().single();
        }
        const { data, error } = await q;
        if (error) throw new Error(error.message);
        return data;
      }
      const list = readLocal();
      if (!quiz.id) quiz.id = 'local-' + Date.now();
      const i = list.findIndex(x => x.id === quiz.id);
      if (i >= 0) list[i] = quiz; else list.push(quiz);
      writeLocal(list);
      return quiz;
    },

    async listQuizzes() {
      if (this.mode === 'cloud') {
        const { data, error } = await client.from('quizzes').select('*').order('updated_at', { ascending: false });
        if (error) throw new Error(error.message);
        return data || [];
      }
      return readLocal().sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || ''));
    },

    async getQuiz(id) {
      if (this.mode === 'cloud' && !String(id).startsWith('local-')) {
        const { data, error } = await client.from('quizzes').select('*').eq('id', id).single();
        if (error) throw new Error(error.message);
        return data;
      }
      return readLocal().find(x => x.id === id) || null;
    },

    async deleteQuiz(id) {
      if (this.mode === 'cloud' && !String(id).startsWith('local-')) {
        const { error } = await client.from('quizzes').delete().eq('id', id);
        if (error) throw new Error(error.message);
        return;
      }
      writeLocal(readLocal().filter(x => x.id !== id));
    }
  };
})();
