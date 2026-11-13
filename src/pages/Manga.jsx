import { useMemo, useState } from 'react';
import { useAsync } from '../api/useAsync';
import { searchManga } from '../api/mangadex';
import { sampleManga } from '../data/data';
import DemoBanner from '../components/DemoBanner';
import MangaGrid from '../components/MangaGrid';

export default function Manga() {
  const [q, setQ] = useState('');
  const [tag, setTag] = useState('');

  // ดึงมาก้อนเดียว (60 เรื่อง) แล้วค้นหา/กรองในเครื่อง ไม่ยิง API ทุกครั้งที่พิมพ์
  const { status, data, error } = useAsync(() => searchManga({ limit: 60 }), []);
  const useSample = status === 'error';
  const items = useSample ? sampleManga : data || [];

  const tags = useMemo(
    () => [...new Set(items.flatMap((m) => m.tags))].sort(),
    [items]
  );

  // TODO ขั้นที่ 3: กรอง items ด้วย q (ชื่อเรื่อง ไม่สนตัวพิมพ์เล็กใหญ่) และ tag ที่เลือก
  //   ตอนนี้ยังแสดงทั้งหมดอยู่
  const shown = items;

  return (
    <>
      <DemoBanner show={useSample} />
      <h1>มังงะทั้งหมด</h1>
      <div className="toolbar">
        <input placeholder="ค้นหาชื่อเรื่อง…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={tag} onChange={(e) => setTag(e.target.value)}>
          <option value="">ทุกแนว</option>
          {tags.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <MangaGrid status={useSample ? 'success' : status} items={shown} error={error} />
    </>
  );
}
