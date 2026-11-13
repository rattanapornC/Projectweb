import { useAsync } from '../api/useAsync';
import { getPopularManga } from '../api/mangadex';
import { sampleManga } from '../data/data';
import DemoBanner from '../components/DemoBanner';
import FeaturedCarousel from '../components/FeaturedCarousel';
import MangaGrid from '../components/MangaGrid';

export default function Home() {
  const { status, data, error } = useAsync(() => getPopularManga(24), []);
  const useSample = status === 'error';
  const items = useSample ? sampleManga : data || [];

  // TODO ขั้นที่ 5: สุ่มเรื่องแนะนำ 6 เรื่องจาก items (สลับลำดับแบบ shuffle)
  //   ตอนนี้ใช้ 6 เรื่องแรกไปก่อน
  const featured = items.slice(0, 6);

  return (
    <>
      <DemoBanner show={useSample} />
      <h1>มังงะแนะนำ</h1>
      {status !== 'loading' && <FeaturedCarousel items={featured} />}

      <h2>ยอดนิยม</h2>
      <MangaGrid status={useSample ? 'success' : status} items={items} error={error} />
    </>
  );
}
