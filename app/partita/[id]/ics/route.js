import { getUser } from '@/lib/auth';
import { sql } from '@/lib/db';

const esc = s => String(s).replace(/[\;,]/g, m => '\\' + m).replace(/\n/g, '\\n');

export async function GET(req, { params }) {
  if (!(await getUser())) return new Response('Non autorizzato', { status: 401 });
  const [p] = await sql`SELECT p.id, to_char(p.data,'YYYYMMDD') d, to_char(p.ora,'HH24MISS') o,
      to_char(p.data + p.ora + interval '2 hours','YYYYMMDD"T"HH24MISS') fine,
      p.casa, p.ospite, p.terza, p.campo, p.categoria, p.lat, p.lon, p.indirizzo, u.nome || ' ' || u.cognome arbitro
    FROM partite p JOIN users u ON u.id = p.user_id WHERE p.id = ${Number((await params).id)}`;
  if (!p) return new Response('Non trovata', { status: 404 });
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Arbitri Rovigo//Designazioni//IT', 'BEGIN:VEVENT',
    `UID:partita-${p.id}@arbitri-rovigo`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
    `DTSTART;TZID=Europe/Rome:${p.d}T${p.o}`, `DTEND;TZID=Europe/Rome:${p.fine}`,
    `SUMMARY:${esc(`${p.categoria} · ${[p.casa, p.ospite, p.terza].filter(Boolean).join(' – ')}${p.terza ? ' (triangolare)' : ''}`)}`, `LOCATION:${esc(p.indirizzo ? `${p.campo}, ${p.indirizzo}` : p.campo)}`,
    ...(p.lat ? [`GEO:${p.lat};${p.lon}`] : []),
    `DESCRIPTION:${esc(`Arbitro: ${p.arbitro}`)}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  return new Response(ics, { headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Content-Disposition': `attachment; filename="partita-${p.id}.ics"` } });
}
