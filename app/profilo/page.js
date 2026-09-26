import { requireUser } from '@/lib/auth';
import { cambiaPassword } from '../actions';
import Err from '../Err';

export default async function Profilo({ searchParams }) {
  const u = await requireUser();
  const ok = (await searchParams)?.ok;
  return (<>
    <h1>{u.nome} {u.cognome}</h1>
    {ok && <p className="okmsg">Password aggiornata ✔</p>}
    <Err sp={searchParams} />
    <form action={cambiaPassword} className="form">
      <h3 style={{ margin: 0 }}>Cambia password</h3>
      <label>Password attuale<input name="old" type="password" required /></label>
      <label>Nuova password<input name="pass" type="password" required minLength={6} /></label>
      <div className="actions"><button className="btn">Aggiorna</button></div>
    </form>
  </>);
}
