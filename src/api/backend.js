
const BASE = '/api';

// ฟังก์ชันกลางสำหรับเรียก Backend API
export async function api(path, options = {}) {
  // ถ้า path มี /api อยู่แล้ว ไม่ต้องเติมซ้ำ
  const url = path.startsWith('/api/')
    ? path
    : `${BASE}${path}`;

  let res;

  try {
    res = await fetch(url, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error('เชื่อมต่อ Backend ไม่ได้');
  }

  if (res.status === 204) return null;

  let data;

  try {
    data = await res.json();
  } catch {
    throw new Error(`Backend ส่งข้อมูลไม่ถูกต้อง (${res.status})`);
  }

  if (!res.ok) {
    throw new Error(data.error || `Backend ตอบกลับ ${res.status}`);
  }

  return data;
}

// ฟังก์ชันสำหรับระบบ Reviews
const call = (path, options = {}) => api(path, options);

export const getReviews = (mangaId) =>
  call(`/reviews?mangaId=${encodeURIComponent(mangaId)}`);

export const addReview = (review) =>
  call('/reviews', {
    method: 'POST',
    body: JSON.stringify(review),
  });
