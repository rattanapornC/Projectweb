import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <>
      <h1>404 · ไม่พบหน้านี้</h1>
      <Link to="/">กลับหน้าแรก</Link>
    </>
  );
}
