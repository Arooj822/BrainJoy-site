// BrainJoy quiz prototype. Browser-only until cloud authorization is verified.
(function (root) {
  'use strict';
  const LOCAL_KEY = 'bj_quizzes';
  function validateQuiz(input) {
    if (!input || typeof input !== 'object') throw new Error('Invalid quiz file.');
    const title = String(input.title || '').trim();
    if (!title || title.length > 160) throw new Error('Use a title between 1 and 160 characters.');
    if (!Array.isArray(input.questions) || input.questions.length < 1 || input.questions.length > 100) throw new Error('A quiz needs 1 to 100 questions.');
    const questions = input.questions.map((q, i) => {
      if (!q || !['mcq', 'tf', 'short'].includes(q.type)) throw new Error('Question ' + (i + 1) + ': unsupported question type.');
      const text = String(q.text || '').trim();
      if (!text || text.length > 2000) throw new Error('Question ' + (i + 1) + ': enter question text (up to 2,000 characters).');
      const item = { type: q.type, text };
      if (q.type === 'mcq') {
        if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 6) throw new Error('Question ' + (i + 1) + ': add 2 to 6 choices.');
        item.options = q.options.map(x => String(x).trim());
        if (item.options.some(x => !x || x.length > 500)) throw new Error('Question ' + (i + 1) + ': fill every choice (up to 500 characters).');
        if (new Set(item.options.map(x => x.toLowerCase())).size !== item.options.length) throw new Error('Question ' + (i + 1) + ': choices must be different.');
        if (!Number.isInteger(q.correct) || q.correct < 0 || q.correct >= item.options.length) throw new Error('Question ' + (i + 1) + ': select a correct choice.');
        item.correct = q.correct;
      } else if (q.type === 'tf') {
        if (typeof q.correct !== 'boolean') throw new Error('Question ' + (i + 1) + ': select True or False.');
        item.correct = q.correct;
      } else {
        item.answer = String(q.answer || '').trim();
        if (!item.answer || item.answer.length > 500) throw new Error('Question ' + (i + 1) + ': enter the expected answer.');
      }
      return item;
    });
    return { title, subject: String(input.subject || '').trim().slice(0, 100), grade: String(input.grade || '').trim().slice(0, 60), questions };
  }
  function readLocal() {
    const raw = root.localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    let list;
    try { list = JSON.parse(raw); } catch (_) { throw new Error('Saved browser data cannot be read. Export or recover it before resetting storage.'); }
    if (!Array.isArray(list)) throw new Error('Saved browser data has an unexpected format. Nothing was overwritten.');
    const ids = new Set();
    for (const q of list) {
      try { validateQuiz(q); if (typeof q.id !== 'string' || !/^local-[a-zA-Z0-9-]+$/.test(q.id) || ids.has(q.id)) throw Error('identifier'); ids.add(q.id); }
      catch (_) { throw new Error('Saved browser data contains an unreadable quiz. Nothing was overwritten. Preserve or export this browser data before repairing it.'); }
    }
    return list;
  }
  function writeLocal(list) {
    try { root.localStorage.setItem(LOCAL_KEY, JSON.stringify(list)); }
    catch (_) { throw new Error('Browser storage is full or unavailable. Your quiz was not saved. Export a copy before closing.'); }
  }
  root.bjQuizStore = {
    mode: 'local',
    validateQuiz,
    async init() { this.mode = 'local'; return this.mode; },
    async saveQuiz(input) {
      const quiz = validateQuiz(input);
      const list = readLocal();
      quiz.id = typeof input.id === 'string' && /^local-[a-zA-Z0-9-]+$/.test(input.id) ? input.id : 'local-' + (root.crypto && root.crypto.randomUUID ? root.crypto.randomUUID() : Date.now() + '-' + Math.random().toString(36).slice(2));
      quiz.updated_at = new Date().toISOString();
      const i = list.findIndex(x => x.id === quiz.id);
      if (i >= 0) list[i] = quiz; else list.push(quiz);
      writeLocal(list);
      return quiz;
    },
    async listQuizzes() { return readLocal().sort((a,b) => String(b.updated_at || '').localeCompare(String(a.updated_at || ''))); },
    async getQuiz(id) { return readLocal().find(x => x.id === id) || null; },
    async deleteQuiz(id) { writeLocal(readLocal().filter(x => x.id !== id)); },
    async importQuiz(text) {
      if (typeof text !== 'string' || text.length > 1000000) throw new Error('Choose a quiz JSON file smaller than 1 MB.');
      let input;
      try { input = JSON.parse(text); } catch (_) { throw new Error('This is not a valid JSON quiz file.'); }
      const quiz = validateQuiz(input);
      return this.saveQuiz(quiz); // Always a new copy. Never overwrite an existing quiz on import.
    },
    exportQuiz(quiz) { return JSON.stringify({ format: 'brainjoy-quiz', version: 1, ...validateQuiz(quiz) }, null, 2); }
  };
})(typeof window === 'undefined' ? globalThis : window);
