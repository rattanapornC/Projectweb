# API Wishlist (รายการ API ที่จะขอจากทีม Backend)

> กรอกในขั้นที่ 6: เขียนว่าหน้าไหนต้องการข้อมูลอะไร จาก MangaDex เรามีให้แล้วแค่ไหน
> และอะไรที่ต้องให้ทีม Backend ทำเองเพิ่ม (เช่น ระบบสมาชิก, รีวิว, บุ๊กมาร์ก, ประวัติการอ่าน)

## ใช้ MangaDex ได้เลย (มีแล้ว)

| หน้า | ต้องการ | Endpoint |
|---|---|---|
| Home / Manga | รายการมังงะ + ปก | `GET /manga?includes[]=cover_art` |
| Manga | รายชื่อแนว | `GET /manga/tag` |
| MangaDetail | ข้อมูลเรื่อง | `GET /manga/{id}` |
| MangaDetail | รายการตอน | `GET /manga/{id}/feed` |
| Reader | รูปในตอน | `GET /at-home/server/{chapterId}` |

## ต้องขอจากทีม Backend (ยังไม่มี)

| หน้า | ต้องการ | เสนอ Endpoint | Request | Response |
|---|---|---|---|---|
| MangaDetail | ดู/เพิ่มรีวิว | `GET/POST /reviews?mangaId=` | `{ name, rating, text }` | `[{ id, name, rating, text, createdAt }]` |
| (กรอกเพิ่ม) | บุ๊กมาร์ก | | | |
| (กรอกเพิ่ม) | ประวัติการอ่าน | | | |
| (กรอกเพิ่ม) | สมัคร/เข้าสู่ระบบ | | | |
