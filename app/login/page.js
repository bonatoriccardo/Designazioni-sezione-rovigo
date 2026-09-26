import Link from 'next/link';
import { login } from '../actions';
import Err from '../Err';

export default function Page({ searchParams }) {
  return (<>
    <h1>Entra</h1>
    <Err sp={searchParams} />
    <form action={login} className="f">
      <input name="nome" placeholder="Nome" required />
      <input name="cognome" placeholder="Cognome" required />
      <input name="pass" type="password" placeholder="Password" required minLength={6} />
      <button className="b">Entra</button>
    </form>
    <p className="mut">Non hai un account? <Link href="/registrati">Registrati</Link></p>
  </>);
}
