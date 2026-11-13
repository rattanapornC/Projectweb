# MangaHub Frontend

Frontend ของ MangaHub (React + Vite) จัดโครงสร้างแยกตามแนวทาง MovieHub Starter โดยคงเครื่องมือเดิมของโปรเจกต์ไว้

## เริ่มใช้งาน
```bash
npm install
cp .env.example .env
npm run dev
```
ตั้งค่า `VITE_API_URL` ใน `.env` ให้ชี้ไป backend (ค่าเริ่มต้นใน `.env.example` คือ `http://localhost:8080`)

## โครงสร้าง
```text
src/
  api/          backend.js (apiFetch) และ manga.js (endpoint functions)
  auth/         AuthContext.jsx
  components/   Navbar.jsx, Footer.jsx
  pages/        Home, MangaDetail, Reader, AuthPage, Bookmarks, Admin
  utils/        helper ที่ใช้ร่วมกัน
  App.jsx       routes และ layout หลัก
  main.jsx      entry point ของ Vite
  style.css     stylesheet เดิม
docs/api.md     สัญญา API ที่ frontend ใช้อยู่
```

## หมายเหตุ
- โปรเจกต์ต้นฉบับใช้ Vite ไม่ใช่ Create React App จึงคง `npm run dev` และ `VITE_API_URL` ไว้ ไม่เปลี่ยนเป็น CRA เพื่อหลีกเลี่ยงการเปลี่ยนระบบ build โดยไม่จำเป็น
- Backend ไม่ได้อยู่ในไฟล์ frontend ที่ให้มา จึงยังไม่ได้สร้าง mock server หรือยืนยัน response/status code จริง รายละเอียดใน `docs/api.md` เป็นสัญญาที่อนุมานจากการเรียกใช้งานในหน้าเว็บ
- `vercel.json` เดิมยังคง rewrite สำหรับ React Router
