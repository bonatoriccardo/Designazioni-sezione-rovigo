import Link from 'next/link';
import { CATEGORIE } from '@/lib/categorie';

export default function Filtro({ base, cat }) {
  return (
    <div className="filtro">
      <Link href={base} className={!cat ? 'on' : ''}>Tutte</Link>
      {CATEGORIE.map(c => <Link key={c} href={`${base}?cat=${encodeURIComponent(c)}`} className={cat === c ? 'on' : ''}>{c}</Link>)}
    </div>
  );
}
