# Manga Reader

เว็บอ่านมังงะฟรี (React + Vite) ดึงข้อมูลจาก [MangaDex API](https://api.mangadex.org/docs/)

## เริ่มใช้งาน

```bash
cp .env.example .env
npm install
npm run dev        # เปิด http://localhost:3000
```

เปิดใน GitHub Codespaces ได้เลย (`.devcontainer` จะ `npm install` ให้อัตโนมัติ)

## โครงสร้าง

```
src/
  api/mangadex.js      ชั้นกลางคุยกับ API (มี TODO ขั้นที่ 1 และ 2)
  api/cache.js         onceADay จำผลไว้ใน localStorage วันละครั้ง
  api/useAsync.js      hook ช่วยเรียก API ได้สถานะ loading/error/success
  components/          Navbar, Footer, DemoBanner, MangaCard, MangaGrid, FeaturedCarousel, ReviewForm
  pages/
    Home.jsx           หน้าแรก มังงะแนะนำ (TODO ขั้นที่ 5)
    Manga.jsx          รายการ + ค้นหา + เลือกแนว กรองในเครื่อง (TODO ขั้นที่ 3)
    MangaDetail.jsx    รายละเอียด + รายการตอน + รีวิว (TODO ขั้นที่ 4)
    Reader.jsx         หน้าอ่านตอน เลื่อนลงอ่านต่อเนื่อง
    ApiLab.jsx         ยิง API ดู JSON ดิบ เทียบความเร็วเมื่อมี cache
  data/data.js         ข้อมูลตัวอย่าง (id เป็นรหัสสมมติ)
docs/api-wishlist.md   รายการ API ที่จะขอจากทีม Backend (ขั้นที่ 6)
vercel.json            rewrites สำหรับ proxy API และไม่ให้ refresh แล้ว 404
```

## ข้อควรรู้เกี่ยวกับ MangaDex

- เรียกผ่านเส้นทาง `/mdx/...` เพื่อเลี่ยงปัญหา CORS: Vite proxy ตอน dev, `vercel.json` rewrites ตอน deploy
- ยิงถี่เกินไปจะโดน 429 (ราว 5 request/วินาที) ใช้ cache ช่วยได้
- ตอนบางตอนเป็นลิงก์ไปเว็บอื่น (`externalUrl`) โค้ดจะกรองออกให้
- รูปในตอนต้องถาม `at-home/server` ก่อน (ดู `getChapterPages`)
- ก่อนเปิดใช้งานจริง ควรอ่านเงื่อนไขการใช้ API ของ MangaDex (การให้เครดิต และข้อจำกัดเรื่องการหารายได้)
  ที่ https://api.mangadex.org/docs/
