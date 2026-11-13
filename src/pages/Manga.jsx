
import { useMemo, useState } from 'react';
import { useAsync } from '../api/useAsync';
import { searchManga } from '../api/mangadex';
import { sampleManga } from '../data/data';
import DemoBanner from '../components/DemoBanner';
import MangaGrid from '../components/MangaGrid';

export default function Manga() {
  const [q, setQ] = useState('');
  const [tag, setTag] = useState('');

  // โหลดรายการมังงะทั้งหมดจาก Backend เพียงครั้งเดียว
  const { status, data, error } = useAsync(
    () => searchManga(''),
    []
  );

  const useSample = status === 'error';
  const items = useSample ? sampleManga : data || [];

  // รวบรวมแนวเรื่องที่มีอยู่
  const tags = useMemo(() => {
    const allTags = items.flatMap((manga) =>
      Array.isArray(manga.tags)
        ? manga.tags.filter((item) => typeof item === 'string')
        : []
    );

    return [...new Set(allTags)].sort();
  }, [items]);

  // ค้นหาชื่อเรื่องและกรองตามแนว
  const shown = useMemo(() => {
    const keyword = q.trim().toLowerCase();

    return items.filter((manga) => {
      const title = (manga.title || '').toLowerCase();

      const matchesName =
        !keyword || title.includes(keyword);

      const mangaTags = Array.isArray(manga.tags)
        ? manga.tags
        : [];

      const matchesTag =
        !tag || mangaTags.includes(tag);

      return matchesName && matchesTag;
    });
  }, [items, q, tag]);

  return (
    <>
      <DemoBanner show={useSample} />

      <h1>มังงะทั้งหมด</h1>

      <div className="toolbar">
        <input
          type="text"
          placeholder="ค้นหาชื่อเรื่อง…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        >
          <option value="">ทุกแนว</option>

          {tags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <MangaGrid
        status={useSample ? 'success' : status}
        items={shown}
        error={error}
      />

      {status === 'success' && (
        <p className="result-count">
          พบมังงะ {shown.length} เรื่อง
        </p>
      )}
    </>
  );
}
