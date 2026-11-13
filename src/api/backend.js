const BASE = '/api';

async function call(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`Backend ตอบกลับ ${res.status}`);
  return res.json();
}

export const getReviews = (mangaId) => call(`/reviews?mangaId=${mangaId}`);
export const addReview = (review) =>
  call('/reviews', { method: 'POST', body: JSON.stringify(review) });