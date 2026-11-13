import { useRef } from 'react';
import MangaCard from './MangaCard';

// แถบมังงะแนะนำ เลื่อนซ้ายขวาได้ (ปุ่ม หรือ ลากนิ้ว/สกอลล์เมาส์)
export default function FeaturedCarousel({ items = [] }) {
  const trackRef = useRef(null);
  const scroll = (dir) => trackRef.current?.scrollBy({ left: dir * 340, behavior: 'smooth' });

  if (items.length === 0) return null;
  return (
    <div className="carousel">
      <button className="nav prev" onClick={() => scroll(-1)} aria-label="ก่อนหน้า">‹</button>
      <div className="track" ref={trackRef}>
        {items.map((m) => (
          <MangaCard key={m.id} manga={m} />
        ))}
      </div>
      <button className="nav next" onClick={() => scroll(1)} aria-label="ถัดไป">›</button>
    </div>
  );
}
