import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { sql } from '@/lib/db';
import { toggleAdmin } from '../actions';

export default async function Admin() {
  const u = await requireUser();
  if (!u.admin) notFound();
  const users = await sql`SELECT id, nome, cognome, admin FROM users ORDER BY cognome, nome`;
  return (<>
    <h1>Utenti</h1>
    {users.map(x => (
      <div className="box row" key={x.id} style={{ marginBottom: 10 }}>
        <span style={{ flex: 1 }}>{x.cognome} {x.nome} {x.admin && <span className="tag">admin</span>}</span>
        {x.id !== u.id && <form action={toggleAdmin}><input type="hidden" name="id" value={x.id} />
          <button className="l">{x.admin ? 'Togli admin' : 'Rendi admin'}</button></form>}
      </div>
    ))}
  </>);
}
