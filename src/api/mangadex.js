// ชั้นกลางคุยกับ MangaDex API (เอกสาร: https://api.mangadex.org/docs/)
// หน้าเพจเรียกใช้ฟังก์ชันจากไฟล์นี้เท่านั้น ไม่ fetch เองตรง ๆ
import { onceADay } from './cache';
import { api } from '../api';

const BASE = import.meta.env.VITE_API_BASE || '/mdx';
const COVER_BASE = 'https://uploads.mangadex.org/covers';
const RATINGS = ['safe', 'suggestive']; // ไม่ดึงเนื้อหา 18+ มาแสดง

// แปลง object เป็น query string ตามสไตล์ของ MangaDex
//   { includes: ['cover_art'] }   -> includes[]=cover_art
//   { order: { followedCount: 'desc' } } -> order[followedCount]=desc
function toQuery(params) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === '') continue;
    if (Array.isArray(v)) v.forEach((x) => q.append(`${k}[]`, x));
    else if (typeof v === 'object') {
      for (const [sk, sv] of Object.entries(v)) q.append(`${k}[${sk}]`, sv);
    } else q.append(k, v);
  }
  return q.toString();
}

// TODO ขั้นที่ 1: ทำให้ request() จัดการ error ได้ดีขึ้น
//   - status 429 (ยิงถี่เกินไป) -> โยน Error ข้อความภาษาไทยว่า "รอสักครู่แล้วลองใหม่"
//   - fetch ล้มเหลวเพราะเน็ต -> ข้อความ "เชื่อมต่อไม่ได้"
export async function request(path, params = {}) {
  const qs = toQuery(params);
  const res = await fetch(`${BASE}${path}${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error(`API ตอบกลับ ${res.status}`);
  return res.json();
}

// ---------- แปลงข้อมูลดิบให้อยู่ในรูปที่หน้าเพจใช้ง่าย ----------
const pick = (obj) => obj?.en || obj?.['ja-ro'] || Object.values(obj || {})[0] || '';

export function normalizeManga(m) {
  const a = m.attributes || {};
  const coverFile = m.relationships?.find((r) => r.type === 'cover_art')?.attributes?.fileName;
  return {
    id: m.id,
    title: pick(a.title),
    description: pick(a.description),
    status: a.status, // ongoing / completed / hiatus / cancelled
    year: a.year,
    tags: (a.tags || []).map((t) => pick(t.attributes?.name)),
    cover: coverFile ? `${COVER_BASE}/${m.id}/${coverFile}.256.jpg` : null,
  };
}

// ---------- ฟังก์ชันที่หน้าเพจเรียกใช้ ----------
export async function searchManga({ title, limit = 24, offset = 0, order = { followedCount: 'desc' } } = {}) {
  const json = await request('/manga', {
    title,
    limit,
    offset,
    order,
    includes: ['cover_art'],
    contentRating: RATINGS,
    availableTranslatedLanguage: ['en'],
    hasAvailableChapters: 'true',
  });
  return json.data.map(normalizeManga);
}



export async function getPopularManga(limit = 24) {
  const response = await api('/api/manga');

  const items = response.items || [];

  return items.slice(0, limit).map((m) => ({
    id: m.id,
    title: m.title || m.title_th || 'ไม่มีชื่อเรื่อง',
    description: m.description || '',
    status: m.status || 'ongoing',
    year: m.year || null,
    tags: m.tags || [],
    cover: m.cover || m.cover_url || null,
  }));
}

export async function getManga(id) {
  const json = await request(`/manga/${id}`, { includes: ['cover_art'] });
  return normalizeManga(json.data);
}

export async function getTags() {
  const json = await request('/manga/tag');
  return json.data.map((t) => ({ id: t.id, name: pick(t.attributes.name) }));
}

export async function getChapters(mangaId, lang = 'en') {
  const json = await request(`/manga/${mangaId}/feed`, {
    translatedLanguage: [lang],
    order: { chapter: 'asc' },
    contentRating: RATINGS,
    limit: 100,
  });
  return json.data
    .filter((c) => !c.attributes.externalUrl) // ตอนที่ลิงก์ไปเว็บอื่นอ่านในเว็บเราไม่ได้
    .map((c) => ({
      id: c.id,
      chapter: c.attributes.chapter,
      title: c.attributes.title,
      pages: c.attributes.pages,
    }));
}

export async function getChapterPages(chapterId) {
  const json = await request(`/at-home/server/${chapterId}`);
  const { hash, data } = json.chapter;
  return data.map((file) => `${json.baseUrl}/data/${hash}/${file}`);
}

export { onceADay };
