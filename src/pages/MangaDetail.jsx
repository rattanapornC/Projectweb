import { Link, useParams } from 'react-router-dom';
import { useAsync } from '../api/useAsync';
import { getManga, getChapters } from '../api/mangadex';
import { sampleManga } from '../data/data';
import ReviewForm from '../components/ReviewForm';

export default function MangaDetail() {
  const { id } = useParams();
  const mangaState = useAsync(() => getManga(id), [id]);
  const chaptersState = useAsync(() => getChapters(id), [id]);

  const manga =
    mangaState.data || (mangaState.status === 'error' ? sampleManga.find((m) => m.id === id) : null);

  if (mangaState.status === 'loading') return <p className="muted">กำลังโหลด…</p>;
  if (!manga) return <p className="error">ไม่พบมังงะเรื่องนี้ ({mangaState.error?.message})</p>;

  const chapters = chaptersState.data || [];

  // TODO ขั้นที่ 4: เพิ่มปุ่ม "อ่านตอนแรก" และ "อ่านตอนล่าสุด" (ลิงก์ไป /read/:chapterId)
  //   และแสดงจำนวนตอนทั้งหมดข้างหัวข้อ "รายการตอน"
  return (
    <>
      <div className="detail">
        {manga.cover ? <img src={manga.cover} alt={manga.title} /> : <div className="card cover" />}
        <div>
          <h1>{manga.title}</h1>
          <p className="muted">{manga.status}{manga.year ? ` · ${manga.year}` : ''}</p>
          <div className="tags">{manga.tags.map((t) => <span key={t}>{t}</span>)}</div>
          <p>{manga.description}</p>
        </div>
      </div>

      <h2>รายการตอน</h2>
      {chaptersState.status === 'loading' && <p className="muted">กำลังโหลดตอน…</p>}
      {chaptersState.status === 'error' && <p className="error">โหลดตอนไม่สำเร็จ: {chaptersState.error.message}</p>}
      {chaptersState.status === 'success' && chapters.length === 0 && <p className="muted">ยังไม่มีตอนภาษาอังกฤษให้อ่าน</p>}
      <ul className="chapters">
        {chapters.map((c) => (
          <li key={c.id}>
            <Link to={`/read/${c.id}`}>
              ตอนที่ {c.chapter ?? '-'} {c.title ? `· ${c.title}` : ''}
            </Link>
          </li>
        ))}
      </ul>

      <ReviewForm mangaId={id} />
    </>
  );
}
