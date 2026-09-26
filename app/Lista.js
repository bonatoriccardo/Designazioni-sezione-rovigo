import { headers } from 'next/headers';
import { sql } from '@/lib/db';
import { toggleAdesione } from './actions';
import { TERNA, mapsUrl } from '@/lib/categorie';

const COL = { U14: 'var(--oli)', U16: 'var(--olid)', U18: '#c0661c', 'SERIE C': 'var(--red)', 'SERIE B': 'var(--bord)', 'SERIE A': '#34406b', 'SERIE A ELITE': '#1d1a1a' };
const d = x => new Date(x + 'T12:00');
const giorno = x => d(x).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
const maps = p => p.lat ? mapsUrl(p.lat, p.lon) : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.campo)}`;

export default async function Lista({ u, passate, cat = null }) {
  const h = await headers();
  const site = `${h.get('x-forwarded-proto') || 'https'}://${h.get('host')}`;
  const rows = await sql`
    SELECT p.id, p.user_id, to_char(p.data,'YYYY-MM-DD') data, to_char(p.ora,'HH24:MI') ora, p.casa, p.ospite, p.campo, p.categoria,
      p.ar1, p.ar2, p.quarto, p.tmo, p.lat, p.lon, p.indirizzo,
      u.nome || ' ' || u.cognome arbitro,
      COALESCE((SELECT json_agg(json_build_object('id', x.id, 'n', x.nome || ' ' || x.cognome) ORDER BY x.cognome)
        FROM adesioni a JOIN users x ON x.id = a.user_id WHERE a.partita_id = p.id), '[]') ade
    FROM partite p JOIN users u ON u.id = p.user_id
    CROSS JOIN (SELECT (now() AT TIME ZONE 'Europe/Rome')::date oggi) t
    WHERE (p.data < t.oggi) = ${!!passate} AND (${cat}::text IS NULL OR p.categoria = ${cat})
    ORDER BY CASE WHEN ${!!passate} THEN t.oggi - p.data ELSE p.data - t.oggi END, p.ora`;
  if (!rows.length) return <p className="empty">Nessuna partita{passate ? ' nello storico' : ' in programma'}{cat ? ` per ${cat}` : ''}.</p>;

  const gruppi = Object.entries(Object.groupBy(rows, p => p.data));
  return gruppi.map(([data, partite]) => (
    <section className="giorno" key={data}>
      <h3>{giorno(data)}</h3>
      {partite.map(p => {
        const io = p.ade.some(a => a.id === u.id);
        const mia = p.user_id === u.id || u.admin;
        const wa = `*${p.categoria}* · ${giorno(p.data)} ore ${p.ora}\n${p.casa} – ${p.ospite}\nCampo: ${p.campo}\n${maps(p)}\nArbitro: ${p.arbitro}\n\nChi viene a vederlo? ${site}`;
        return (
          <article className="match" key={p.id} style={{ '--c': COL[p.categoria] }}>
            <div className="ora"><b>{p.ora}</b></div>
            <div className="info">
              <span className="tag">{p.categoria}</span>
              <div className="teams">{p.casa}<i>v</i>{p.ospite}</div>
              <div className="meta"><a href={maps(p)} target="_blank" rel="noopener">{p.campo}</a></div>
              <div className="meta">Arbitro <b>{p.arbitro}</b>
                {TERNA.filter(([k]) => p[k]).map(([k, l]) => <span key={k}> · {l} <b>{p[k]}</b></span>)}</div>
              <div className="obs"><span className="lab">Osservatori</span>
                {p.ade.length ? p.ade.map(a => (
                  <span className="chip" key={a.id}>{a.n}
                    {u.admin && a.id !== u.id && <form action={toggleAdesione} style={{ display: 'inline' }}>
                      <input type="hidden" name="id" value={p.id} /><input type="hidden" name="uid" value={a.id} />
                      <button className="x" title="Rimuovi">×</button></form>}
                  </span>)) : <span className="mut">nessuno</span>}
              </div>
              <div className="ops">
                {!passate && p.user_id !== u.id && <form action={toggleAdesione}>
                  <input type="hidden" name="id" value={p.id} />
                  <button className={io ? 'btn sm ghost' : 'btn sm'}>{io ? 'Annulla' : 'Vengo a vedere'}</button>
                </form>}
                <a href={`https://wa.me/?text=${encodeURIComponent(wa)}`} target="_blank" rel="noopener">WhatsApp</a>
                <a href={`/partita/${p.id}/ics`}>Calendario</a>
                {mia && <a href={`/partita/${p.id}`}>Modifica</a>}
              </div>
            </div>
          </article>
        );
      })}
    </section>
  ));
}
