
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getChapterPages,
  getChapterInfo,
  getChapters,
} from '../api/mangadex';

export default function Reader() {
  const { chapterId } = useParams();
  const navigate = useNavigate();

  const [pages, setPages] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  const [chapters, setChapters] = useState([]);
  const [chapterInfo, setChapterInfo] = useState(null);
  const [navLoading, setNavLoading] = useState(true);

  // โหลดหน้ามังงะ
  useEffect(() => {
    let alive = true;

    setStatus('loading');
    setError('');
    setPages([]);

    getChapterPages(chapterId)
      .then((data) => {
        if (!alive) return;
        setPages(data);
        setStatus('success');
      })
      .catch((err) => {
        if (!alive) return;
        setError(err.message || 'โหลดหน้ามังงะไม่สำเร็จ');
        setStatus('error');
      });

    return () => {
      alive = false;
    };
  }, [chapterId]);

  // โหลดข้อมูลตอนปัจจุบันและรายการตอนของเรื่อง
  useEffect(() => {
    let alive = true;

    setNavLoading(true);
    setChapters([]);
    setChapterInfo(null);

    async function loadNavigation() {
      try {
        const info = await getChapterInfo(chapterId);
        if (!alive) return;

        setChapterInfo(info);

        const result = await getChapters(info.mangaId);
        if (!alive) return;

        // เรียงตอนจากเก่าไปใหม่
        const list = [...result].filter((chapter) => {
          return !info.language ||
            chapter.language === info.language;
        });

        list.sort((a, b) => {
          const numA = parseFloat(a.chapter);
          const numB = parseFloat(b.chapter);

          const specialA = !Number.isFinite(numA);
          const specialB = !Number.isFinite(numB);

          if (specialA !== specialB) {
            return specialA ? 1 : -1;
          }

          if (specialA && specialB) {
            return (a.title || '').localeCompare(b.title || '');
          }

          return numA - numB;
        });

        setChapters(list);
      } catch (err) {
        console.error('โหลดรายการตอนสำหรับนำทางไม่สำเร็จ:', err);
      } finally {
        if (alive) setNavLoading(false);
      }
    }

    loadNavigation();

    return () => {
      alive = false;
    };
  }, [chapterId]);

  const currentIndex = chapters.findIndex(
    (chapter) => chapter.id === chapterId
  );

  const previousChapter =
    currentIndex > 0 ? chapters[currentIndex - 1] : null;

  const nextChapter =
    currentIndex >= 0 && currentIndex < chapters.length - 1
      ? chapters[currentIndex + 1]
      : null;

  const goToChapter = (id) => {
    if (id) {
      navigate(`/read/${id}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ปุ่มนำทาง ใช้ทั้งด้านบนและด้านล่าง
  const navigation = (
    <div className="reader-navigation">
      <button
        type="button"
        disabled={!previousChapter || navLoading}
        onClick={() => goToChapter(previousChapter?.id)}
      >
        ← ตอนก่อนหน้า
      </button>

      <select
        value={currentIndex >= 0 ? chapterId : ''}
        disabled={navLoading || chapters.length === 0}
        onChange={(e) => goToChapter(e.target.value)}
      >
        {currentIndex < 0 && (
          <option value="">กำลังค้นหาตอน...</option>
        )}

        {chapters.map((chapter) => (
          <option key={chapter.id} value={chapter.id}>
            {chapter.chapter
              ? `ตอนที่ ${chapter.chapter}`
              : chapter.title || 'ตอนพิเศษ'}
            {chapter.title ? ` - ${chapter.title}` : ''}
          </option>
        ))}
      </select>

      <button
        type="button"
        disabled={!nextChapter || navLoading}
        onClick={() => goToChapter(nextChapter?.id)}
      >
        ตอนถัดไป →
      </button>
    </div>
  );

  if (status === 'loading') {
    return <p className="muted">กำลังโหลดหน้ามังงะ…</p>;
  }

  if (status === 'error') {
    return <p className="error">{error}</p>;
  }

  if (!pages.length) {
    return <p className="muted">ไม่พบหน้ามังงะ</p>;
  }

  return (
    <div className="reader-page">
      {navigation}

      <div className="reader">
        {pages.map((src, i) => (
          <img
            key={`${i}-${src}`}
            src={src}
            loading="lazy"
            alt={`หน้า ${i + 1}`}
          />
        ))}
      </div>

      <div className="reader-end">
        <p className="muted">อ่านจบตอนนี้แล้ว</p>

        {nextChapter ? (
          <button
            type="button"
            className="reader-next-button"
            onClick={() => goToChapter(nextChapter.id)}
          >
            อ่านตอนถัดไป ตอนที่ {nextChapter.chapter || nextChapter.title} →
          </button>
        ) : (
          <p className="muted">
            {navLoading
              ? 'กำลังตรวจสอบตอนถัดไป…'
              : 'ไม่มีตอนถัดไปแล้ว'}
          </p>
        )}
      </div>

      {navigation}
    </div>
  );
}
