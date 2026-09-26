import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { sql } from '@/lib/db';
import { toggleAdmin, resetPassword } from '../actions';
import Err from '../Err';

export default async function Admin({ searchParams }) {
  const u = await requireUser();
  if (!u.admin) notFound();
  const ok = (await searchParams)?.ok;
  const users = await sql`SELECT id, nome, cognome, admin FROM users ORDER BY cognome, nome`;
  return (<>
    <h1>Utenti ({users.length})</h1>
    {ok && <p className="okmsg">Password reimpostata ✔ Comunicala all'interessato.</p>}
    <Err sp={searchParams} />
    {users.map(x => (
      <div className="box" key={x.id} style={{ marginBottom: 10 }}>
        <div className="row">
          <span style={{ flex: 1 }}><b>{x.cognome} {x.nome}</b> {x.admin && <span className="tag">admin</span>}</span>
          {x.id !== u.id && <form action={toggleAdmin}><input type="hidden" name="id" value={x.id} />
            <button className="l">{x.admin ? 'Togli admin' : 'Rendi admin'}</button></form>}
        </div>
        {x.id !== u.id && <details><summary className="mut">Reimposta password</summary>
          <form action={resetPassword} className="row" style={{ marginTop: 8 }}>
            <input type="hidden" name="id" value={x.id} />
            <input name="pass" placeholder="Nuova password" minLength={6} required style={{ flex: 1 }} />
            <button className="b">Imposta</button>
          </form></details>}
      </div>
    ))}
  </>);
}
