// onceADay: เรียก fetcher ครั้งเดียวต่อวัน แล้วจำผลไว้ใน localStorage
// วันถัดไปค่อยดึงใหม่ (ลดการยิง API และเร็วขึ้นเมื่อเปิดซ้ำ)
const today = () => new Date().toISOString().slice(0, 10);

export async function onceADay(key, fetcher) {
  const storageKey = `cache:${key}`;
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const { day, data } = JSON.parse(raw);
      if (day === today()) return data;
    }
  } catch {
    // อ่าน cache ไม่ได้ก็ดึงใหม่
  }

  const data = await fetcher();

  try {
    localStorage.setItem(storageKey, JSON.stringify({ day: today(), data }));
  } catch {
    // เต็มหรือถูกบล็อก ก็ข้ามไป
  }
  return data;
}

export function clearCache() {
  Object.keys(localStorage)
    .filter((k) => k.startsWith('cache:'))
    .forEach((k) => localStorage.removeItem(k));
}
