import Link from 'next/link';
import { sql } from '@/lib/db';
import { toggleAdesione } from './actions';

const fmt = d => new Date(d + 'T12:00').toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' });

export default async function Lista({ u, passate }) {
  const rows = await sql`
    SELECT p.id, p.user_id, to_char(p.data,'YYYY-MM-DD') data, to_char(p.ora,'HH24:MI') ora, p.casa, p.ospite, p.campo, p.categoria,
      u.nome || ' ' || u.cognome arbitro,
      COALESCE((SELECT json_agg(json_build_object('id', x.id, 'n', x.nome || ' ' || x.cognome) ORDER BY x.cognome)
        FROM adesioni a JOIN users x ON x.id = a.user_id WHERE a.partita_id = p.id), '[]') ade
    FROM partite p JOIN users u ON u.id = p.user_id
    CROSS JOIN (SELECT (now() AT TIME ZONE 'Europe/Rome')::date oggi) t
    WHERE (p.data < t.oggi) = ${!!passate}
    ORDER BY CASE WHEN ${!!passate} THEN t.oggi - p.data ELSE p.data - t.oggi END, p.ora`;
  if (!rows.length) return <p className="mut">Nessuna partita.</p>;
  return rows.map(p => {
    const io = p.ade.some(a => a.id === u.id);
    const mia = p.user_id === u.id || u.admin;
    return (
      <div className="card" key={p.id}>
        <div className="row"><span className="tag">{p.categoria}</span><b>{fmt(p.data)} · {p.ora}</b></div>
        <h2>{p.casa} – {p.ospite}</h2>
        <div>📍 {p.campo}</div>
        <div className="mut">Arbitro: {p.arbitro}</div>
        <div className="mut">Vanno a vedere: {p.ade.length ? p.ade.map((a, i) => (
          <span key={a.id}>{i > 0 && ', '}{a.n}
            {u.admin && a.id !== u.id && <form action={toggleAdesione} style={{ display: 'inline' }}>
              <input type="hidden" name="id" value={p.id} /><input type="hidden" name="uid" value={a.id} />
              <button className="l" title="Rimuovi"> ✕</button></form>}
          </span>)) : 'nessuno'}</div>
        <div className="row" style={{ marginTop: 10 }}>
          {!passate && p.user_id !== u.id && <form action={toggleAdesione}>
            <input type="hidden" name="id" value={p.id} />
            <button className="b">{io ? 'Non vengo più' : 'Vengo io'}</button>
          </form>}
          {mia && <Link href={`/partita/${p.id}`}>Modifica</Link>}
        </div>
      </div>
    );
  });
}
