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
    <form action={cambiaPassword} className="f box">
      <b className="slab">Cambia password</b>
      <label>Password attuale<input name="old" type="password" required /></label>
      <label>Nuova password<input name="pass" type="password" required minLength={6} /></label>
      <div><button className="b">Aggiorna</button></div>
    </form>
  </>);
}
