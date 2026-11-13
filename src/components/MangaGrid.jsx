import MangaCard from './MangaCard';

// วาดตามสถานะ loading / error / success
export default function MangaGrid({ status, items = [], error }) {
  if (status === 'loading') return <p className="muted">กำลังโหลด…</p>;
  if (status === 'error') return <p className="error">โหลดไม่สำเร็จ: {error?.message}</p>;
  if (items.length === 0) return <p className="muted">ไม่พบเรื่องที่ค้นหา</p>;

  return (
    <div className="grid">
      {items.map((m) => (
        <MangaCard key={m.id} manga={m} />
      ))}
    </div>
  );
}
