# MangaHub API Contract (Frontend)

เอกสารนี้สรุป endpoint ที่ frontend เรียกใช้อยู่ ปรับ status code / response ให้ตรงกับ backend จริงก่อนเชื่อมต่อ

| Method | Path | Auth | Request body / query | Response ที่หน้าเว็บคาดหวัง |
|---|---|---|---|---|
| GET | `/api/manga?q={keyword}` | ไม่ | query `q` | `{ items: Manga[] }` |
| GET | `/api/manga/:id` | ไม่ | — | `Manga` |
| GET | `/api/manga/:id/chapters?lang=th,en` | ไม่ | query `lang` | `{ items: Chapter[] }` |
| GET | `/api/chapters/:id/pages` | ไม่ | — | `{ pages: string[] }` |
| POST | `/api/auth/login` | ไม่ | `{ email, password }` | `{ token, member }` |
| POST | `/api/auth/register` | ไม่ | `{ email, password, display_name }` | `{ token, member }` |
| GET | `/api/me` | Bearer token | — | `Member` |
| GET | `/api/me/bookmarks` | Bearer token | — | `{ items: Manga[] }` |
| PUT | `/api/me/bookmarks/:mangaId` | Bearer token | — | JSON หรือ `204 No Content` |
| GET | `/api/admin/stats` | Admin | — | `{ mangas, members, chapters }` |
| GET | `/api/admin/members` | Admin | — | `{ items: Member[] }` |
| PUT | `/api/admin/members/:memberId/role` | Admin | `{ role: "member" | "admin" }` | Member หรือ JSON success |
| POST | `/api/admin/sync` | Admin | — | `{ synced: number }` |

## Data shapes (ขั้นต่ำ)
- `Manga`: `id`, `title`, `title_th?`, `cover_url?`, `original_language?`, `content_rating?`, `description?`
- `Chapter`: `id`, `chapter_number?`, `title?`, `translated_language`, `scanlation_group?`, `is_free?`
- `Member`: `id`, `email`, `display_name`, `role`

## Error handling
- ทุก error ควรส่ง JSON `{ "error": "ข้อความอธิบาย" }` พร้อม HTTP status ที่เหมาะสม
- `401` เมื่อ token ไม่ถูกต้อง/หมดอายุ, `403` เมื่อไม่มีสิทธิ์, `404` เมื่อไม่พบข้อมูล, `204` สำหรับคำขอที่สำเร็จแต่ไม่มี response body
