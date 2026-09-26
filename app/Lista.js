import { sql } from '@/lib/db';
import { toggleAdesione } from './actions';
import { TERNA } from '@/lib/categorie';

const COL = { U14: 'var(--oli)', U16: 'var(--olid)', U18: '#c8651b', 'SERIE C': 'var(--red)', 'SERIE B': 'var(--bord)', 'SERIE A': '#3a2a5e', 'SERIE A ELITE': '#1d1a1a' };
const d = x => new Date(x + 'T12:00');
const gg = x => d(x).toLocaleDateString('it-IT', { weekday: 'short' });
const mm = x => d(x).toLocaleDateString('it-IT', { month: 'short' });

export default async function Lista({ u, passate }) {
  const rows = await sql`
    SELECT p.id, p.user_id, to_char(p.data,'YYYY-MM-DD') data, to_char(p.ora,'HH24:MI') ora, p.casa, p.ospite, p.campo, p.categoria, p.ar1, p.ar2, p.quarto, p.tmo,
      u.nome || ' ' || u.cognome arbitro,
      COALESCE((SELECT json_agg(json_build_object('id', x.id, 'n', x.nome || ' ' || x.cognome) ORDER BY x.cognome)
        FROM adesioni a JOIN users x ON x.id = a.user_id WHERE a.partita_id = p.id), '[]') ade
    FROM partite p JOIN users u ON u.id = p.user_id
    CROSS JOIN (SELECT (now() AT TIME ZONE 'Europe/Rome')::date oggi) t
    WHERE (p.data < t.oggi) = ${!!passate}
    ORDER BY CASE WHEN ${!!passate} THEN t.oggi - p.data ELSE p.data - t.oggi END, p.ora`;
  if (!rows.length) return <div className="empty">🏉<p>Nessuna partita{passate ? ' nello storico' : ' in programma'}.</p></div>;
  return rows.map(p => {
    const io = p.ade.some(a => a.id === u.id);
    const mia = p.user_id === u.id || u.admin;
    return (
      <div className="card" key={p.id} style={{ '--c': COL[p.categoria] }}>
        <div className="cal"><span>{gg(p.data)}</span><b>{d(p.data).getDate()}</b><span>{mm(p.data)}</span><i>{p.ora}</i></div>
        <div className="body">
          <span className="tag">{p.categoria}</span>
          <h2>{p.casa} <span className="mut">vs</span> {p.ospite}</h2>
          <div>📍 <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.campo)}`} target="_blank" rel="noopener">{p.campo}</a></div>
          <div className="mut">🟢 Arbitro: <b>{p.arbitro}</b>
            {TERNA.filter(([k]) => p[k]).map(([k, l]) => <span key={k}> · {l}: <b>{p[k]}</b></span>)}</div>
          <div className="chips">
            {p.ade.length ? p.ade.map(a => (
              <span className="chip" key={a.id}>👀 {a.n}
                {u.admin && a.id !== u.id && <form action={toggleAdesione} style={{ display: 'inline' }}>
                  <input type="hidden" name="id" value={p.id} /><input type="hidden" name="uid" value={a.id} />
                  <button className="l" title="Rimuovi">✕</button></form>}
              </span>)) : <span className="mut">Ancora nessun collega segnato</span>}
          </div>
          <div className="row" style={{ marginTop: 12 }}>
            {!passate && p.user_id !== u.id && <form action={toggleAdesione}>
              <input type="hidden" name="id" value={p.id} />
              <button className={io ? 'b o' : 'b'}>{io ? 'Non vengo più' : '🙋 Vengo a vederti'}</button>
            </form>}
            {mia && <a href={`/partita/${p.id}`}>Modifica</a>}
          </div>
        </div>
      </div>
    );
  });
}
