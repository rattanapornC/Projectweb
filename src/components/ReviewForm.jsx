import { useState } from 'react';

// ฟอร์มรีวิว (state 3 ตัว: ชื่อ, คะแนน, ข้อความ) เก็บใน localStorage ของเครื่องก่อน
// ถ้าต่อ Backend จริง ให้เปลี่ยนตรง submit ไปเรียก API แทน (ดู docs/api-wishlist.md)
export default function ReviewForm({ mangaId }) {
  const key = `reviews:${mangaId}`;
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [reviews, setReviews] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
  });

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    const next = [{ name, rating, text, at: Date.now() }, ...reviews];
    setReviews(next);
    localStorage.setItem(key, JSON.stringify(next));
    setName('');
    setText('');
    setRating(5);
  };

  return (
    <section>
      <h3>รีวิว</h3>
      <form className="review" onSubmit={submit}>
        <input placeholder="ชื่อของคุณ" value={name} onChange={(e) => setName(e.target.value)} />
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>{'★'.repeat(n)}</option>
          ))}
        </select>
        <textarea rows={3} placeholder="รู้สึกยังไงกับเรื่องนี้" value={text} onChange={(e) => setText(e.target.value)} />
        <button className="primary" type="submit">ส่งรีวิว</button>
      </form>
      {reviews.map((r) => (
        <div className="review-item" key={r.at}>
          <strong>{r.name}</strong> <span>{'★'.repeat(r.rating)}</span>
          <div>{r.text}</div>
        </div>
      ))}
    </section>
  );
}
