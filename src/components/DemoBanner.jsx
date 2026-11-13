// แถบเตือนตอนเรียก API ไม่สำเร็จแล้วเว็บสลับไปใช้ข้อมูลตัวอย่างแทน
export default function DemoBanner({ show }) {
  if (!show) return null;
  return (
    <div className="banner">
      เชื่อมต่อ MangaDex ไม่ได้ในตอนนี้ จึงแสดงข้อมูลตัวอย่างแทน
      (ลองเช็ก proxy ใน vite.config.js หรือ rewrites ใน vercel.json)
    </div>
  );
}
