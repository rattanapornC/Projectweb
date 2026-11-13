
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAsync } from '../api/useAsync';
import { getManga, getChapters } from '../api/mangadex';
import { sampleManga } from '../data/data';

export default function MangaDetail() {
  const { id } = useParams();

  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const mangaState = useAsync(() => getManga(id), [id]);
  const chapterState = useAsync(() => getChapters(id), [id]);

  const manga =
    mangaState.data ||
    (mangaState.status === 'error'
      ? sampleManga.find((m) => m.id === id)
      : null);

  if (mangaState.status === 'loading') {
    return <p className="muted">กำลังโหลด…</p>;
  }

  if (!manga) {
    return (
      <p className="error">
        ไม่พบมังงะเรื่องนี้ ({mangaState.error?.message})
      </p>
    );
  }

  const cover = manga.cover || manga.cover_url || '';

  const chapters = Array.isArray(chapterState.data)
    ? chapterState.data
    : chapterState.data?.items || [];

  const filteredChapters = chapters
    .filter((chapter) => {
      const keyword = search.toLowerCase().trim();

      if (!keyword) return true;

      return (
        String(chapter.chapter || '').toLowerCase().includes(keyword) ||
        (chapter.title || '').toLowerCase().includes(keyword)
      );
    })
    .sort((a, b) => {
      const numA = parseFloat(a.chapter);
      const numB = parseFloat(b.chapter);

      const aSpecial = !Number.isFinite(numA);
      const bSpecial = !Number.isFinite(numB);

      if (aSpecial !== bSpecial) {
        return aSpecial ? 1 : -1;
      }

      if (aSpecial && bSpecial) {
        return (a.title || '').localeCompare(b.title || '');
      }

      return sortOrder === 'asc'
        ? numA - numB
        : numB - numA;
    });

  return (
    <div className="detail-page">

      {/* Manga information */}
      <div className="detail">
        {cover ? (
          <img
            src={cover}
            alt={manga.title}
            onError={(e) => {
              console.error('โหลดรูปปกไม่สำเร็จ:', e.currentTarget.src);
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="card cover">ไม่มีรูปปก</div>
        )}

        <div>
          <h1>{manga.title}</h1>

          <p className="muted">
            {manga.originalLanguage
              ? `ภาษา: ${manga.originalLanguage}`
              : ''}

            {manga.contentRating
              ? ` · ระดับเนื้อหา: ${manga.contentRating}`
              : ''}
          </p>

          <p>{manga.description}</p>
        </div>
      </div>

      {/* Chapter selector */}
      <section className="chapter-section">

        <div className="chapter-heading">
          <div>
            <h2>เลือกตอนที่ต้องการอ่าน</h2>
            <p className="chapter-subtitle">
              มีทั้งหมด {chapters.length} ตอน
            </p>
          </div>

          <span className="chapter-total">
            {filteredChapters.length} / {chapters.length} ตอน
          </span>
        </div>

        {chapterState.status === 'loading' && (
          <p className="muted">กำลังโหลดรายการตอน…</p>
        )}

        {chapterState.status === 'error' && (
          <p className="error">
            โหลดรายการตอนไม่สำเร็จ:
            {chapterState.error?.message}
          </p>
        )}

        {chapterState.status === 'success' && chapters.length === 0 && (
          <p className="muted">ยังไม่มีตอนให้อ่าน</p>
        )}

        {chapters.length > 0 && (
          <>
            <div className="chapter-toolbar">
              <div className="chapter-search">
                <span>⌕</span>
                <input
                  type="text"
                  placeholder="ค้นหาเลขตอน หรือชื่อตอน..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <button
                className="chapter-sort"
                onClick={() =>
                  setSortOrder((current) =>
                    current === 'asc' ? 'desc' : 'asc'
                  )
                }
              >
                {sortOrder === 'asc'
                  ? '↑ ตอนเก่าไปใหม่'
                  : '↓ ตอนใหม่ไปเก่า'}
              </button>
            </div>

            {filteredChapters.length > 0 ? (
              <div className="chapter-grid">
                {filteredChapters.map((chapter) => (
                  <Link
                    to={`/read/${chapter.id}`}
                    className="chapter-card"
                    key={chapter.id}
                  >
                    <div className="chapter-card-number">
                      <span>
                        {chapter.chapter
                          ? `CH. ${chapter.chapter}`
                          : 'SPECIAL'}
                      </span>
                      <span className="chapter-arrow">↗</span>
                    </div>

                    <div className="chapter-card-title">
                      {chapter.title || 'ไม่มีชื่อตอน'}
                    </div>

                    <div className="chapter-card-footer">
                      <span>
                        {chapter.language?.toUpperCase() || 'ไม่ระบุภาษา'}
                      </span>
                      <span>อ่านตอนนี้ →</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="chapter-empty">
                ไม่พบตอนที่ค้นหา ลองใช้คำค้นอื่นครับ
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
}
