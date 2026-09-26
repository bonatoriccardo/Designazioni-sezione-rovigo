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
      <div className="rowu" key={x.id}>
        <span className="n">{x.cognome} {x.nome}{x.admin && <span className="badge">ADMIN</span>}</span>
        {x.id !== u.id && <form action={toggleAdmin}><input type="hidden" name="id" value={x.id} />
          <button className="link">{x.admin ? 'Togli admin' : 'Rendi admin'}</button></form>}
        {x.id !== u.id && <details><summary>Reimposta password</summary>
          <form action={resetPassword} className="inl" style={{ marginTop: 8 }}>
            <input type="hidden" name="id" value={x.id} />
            <input name="pass" type="password" placeholder="Nuova password" minLength={6} required />
            <button className="btn sm">Imposta</button>
          </form></details>}
      </div>
    ))}
  </>);
}
