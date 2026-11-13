import { Link } from 'react-router-dom';

export default function MangaCard({ manga }) {
  return (
    <Link to={`/manga/${manga.id}`} className="card">
      {manga.cover ? (
        <img className="cover" src={manga.cover} alt={manga.title} loading="lazy" />
      ) : (
        <div className="cover" />
      )}
      <div className="info">
        <div className="title">{manga.title}</div>
        <div className="muted" style={{ fontSize: 12 }}>
          {manga.status}{manga.year ? ` · ${manga.year}` : ''}
        </div>
      </div>
    </Link>
  );
}
