import { useState } from 'react';
import { request, onceADay } from '../api/mangadex';
import { clearCache } from '../api/cache';

const PRESETS = [
  '/manga?limit=3&includes[]=cover_art',
  '/manga/tag',
  '/manga?title=one&limit=2',
];

// สนามทดลองยิง API ดู JSON ดิบ และเทียบความเร็วเมื่อมี cache
export default function ApiLab() {
  const [path, setPath] = useState(PRESETS[0]);
  const [useCache, setUseCache] = useState(false);
  const [result, setResult] = useState(null);
  const [ms, setMs] = useState(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    setErr('');
    const t0 = performance.now();
    try {
      const fetcher = () => request(path);
      const json = useCache ? await onceADay(`lab:${path}`, fetcher) : await fetcher();
      setResult(json);
    } catch (e) {
      setResult(null);
      setErr(e.message);
    }
    setMs(Math.round(performance.now() - t0));
    setLoading(false);
  };

  return (
    <>
      <h1>API Lab</h1>
      <div className="toolbar">
        <select onChange={(e) => setPath(e.target.value)} value="">
          <option value="" disabled>ตัวอย่าง endpoint…</option>
          {PRESETS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <input style={{ flex: 1, minWidth: 260 }} value={path} onChange={(e) => setPath(e.target.value)} />
        <label>
          <input type="checkbox" checked={useCache} onChange={(e) => setUseCache(e.target.checked)} /> ใช้ cache วันละครั้ง
        </label>
        <button className="primary" onClick={run} disabled={loading}>{loading ? 'กำลังยิง…' : 'ยิง'}</button>
        <button onClick={() => { clearCache(); setMs(null); }}>ล้าง cache</button>
      </div>
      {ms !== null && <p className="muted">ใช้เวลา {ms} ms {useCache && '(ถ้ากดซ้ำควรเร็วขึ้นมาก)'}</p>}
      {err && <p className="error">{err}</p>}
      {result && <pre className="json">{JSON.stringify(result, null, 2)}</pre>}
    </>
  );
}
