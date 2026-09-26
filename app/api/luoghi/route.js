import { getUser } from '@/lib/auth';

// Geocoding OpenStreetMap (Nominatim): gratuito, 1 richiesta/s, solo su click (no autocompletamento).
export async function GET(req) {
  if (!(await getUser())) return Response.json([], { status: 401 });
  const q = new URL(req.url).searchParams.get('q')?.trim();
  if (!q || q.length < 3) return Response.json([]);
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&countrycodes=it&accept-language=it&addressdetails=1&q=${encodeURIComponent(q)}`;
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'designazioni-arbitri-rovigo/1.0 (vercel)' }, next: { revalidate: 86400 } });
    const data = await r.json();
    return Response.json(data.map(x => ({
      nome: x.name || x.display_name.split(',')[0],
      indirizzo: x.display_name.split(',').slice(0, 4).join(',').trim(),
      lat: +x.lat, lon: +x.lon,
    })));
  } catch {
    return Response.json({ errore: true }, { status: 502 });
  }
}
