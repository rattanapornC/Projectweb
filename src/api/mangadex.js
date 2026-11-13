
import { onceADay } from './cache';
import { api } from '../api';

const BASE = import.meta.env.VITE_API_BASE || '/mdx';

// สร้าง query string
function toQuery(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;

    if (Array.isArray(value)) {
      value.forEach((item) => query.append(`${key}[]`, item));
    } else if (typeof value === 'object') {
      Object.entries(value).forEach(([subKey, subValue]) => {
        query.append(`${key}[${subKey}]`, subValue);
      });
    } else {
      query.append(key, value);
    }
  });

  return query.toString();
}

// Request สำหรับ ApiLab
export async function request(path, params = {}) {
  const query = toQuery(params);
  const url = `${BASE}${path}${query ? `?${query}` : ''}`;

  let response;

  try {
    response = await fetch(url);
  } catch {
    throw new Error('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้');
  }

  if (response.status === 429) {
    throw new Error('มีการเรียก API มากเกินไป กรุณารอสักครู่');
  }

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

// แปลงข้อมูลมังงะ
export function normalizeManga(manga) {
  if (!manga) return null;

  let cover = manga.cover || manga.cover_url || '';

  // ใช้ Image Proxy สำหรับรูปปก
  if (
    cover &&
    cover.startsWith('https://uploads.mangadex.org/covers/')
  ) {
    cover = `/api/cover?url=${encodeURIComponent(cover)}`;
  }

  return {
    id: manga.id,
    title: manga.title || manga.title_en || manga.title_th || 'ไม่มีชื่อ',
    description: manga.description || '',
    status: manga.status || '',
    year: manga.year || null,
    tags: manga.tags || [],
    cover,
    originalLanguage: manga.original_language || manga.originalLanguage || '',
    contentRating: manga.content_rating || manga.contentRating || '',
  };
}

// ค้นหามังงะ
export async function searchManga(query) {
  const response = await api(
    `/api/manga?q=${encodeURIComponent(query)}`
  );

  return (response.items || []).map(normalizeManga);
}

// มังงะยอดนิยม
export async function getPopularManga() {
  const response = await api('/api/manga/popular');

  return (response.items || []).map(normalizeManga);
}

// รายละเอียดมังงะ
export async function getManga(id) {
  const response = await api(
    `/api/manga/${encodeURIComponent(id)}`
  );

  const manga = response.item || response.manga || response;

  return normalizeManga(manga);
}

// Tags
export async function getTags() {
  return [];
}

// รายการตอน
export async function getChapters(mangaId) {
  const response = await api(
    `/api/manga/${encodeURIComponent(mangaId)}/chapters`
  );

  return (response.items || []).map((chapter) => ({
    id: chapter.id,
    chapter: chapter.chapter_number,
    title: chapter.title || '',
    pages: null,
    language: chapter.translated_language,
    scanlationGroup: chapter.scanlation_group,
  }));
}

export async function getChapterInfo(chapterId) {
  return api(`/api/chapters/${encodeURIComponent(chapterId)}`);
}

// หน้ามังงะ
// ประกาศฟังก์ชันนี้เพียงจุดเดียว
export async function getChapterPages(chapterId) {
  const response = await api(
    `/api/chapters/${encodeURIComponent(chapterId)}/pages`
  );

  return (response.pages || []).map((url) =>
    `/api/page?url=${encodeURIComponent(url)}`
  );
}

export { onceADay };
