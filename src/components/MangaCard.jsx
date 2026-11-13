
import { Link } from 'react-router-dom';

export default function MangaCard({ manga }) {
  // manga.cover เป็น URL ของ Image Proxy อยู่แล้ว
  const cover = manga.cover || manga.cover_url || '';

  return (
    <Link to={`/manga/${manga.id}`} className="card">
      {cover ? (
        <img
          className="cover"
          src={cover}
          alt={manga.title}
          loading="lazy"
          onError={(e) => {
            console.error('โหลดรูปไม่สำเร็จ:', e.currentTarget.src);
          }}
        />
      ) : (
        <div className="cover">ไม่มีรูปปก</div>
      )}

      <div className="info">
        <div className="title">{manga.title}</div>
      </div>
    </Link>
  );
}
