import Link from 'next/link';
import { registrati } from '../actions';
import Err from '../Err';

export default function Page({ searchParams }) {
  return (<>
    <h1>Registrati</h1>
    <Err sp={searchParams} />
    <form action={registrati} className="f">
      <input name="nome" placeholder="Nome" required />
      <input name="cognome" placeholder="Cognome" required />
      <input name="pass" type="password" placeholder="Password" required minLength={6} />
      <button className="b">Registrati</button>
    </form>
    <p className="mut">Hai già un account? <Link href="/login">Entra</Link></p>
  </>);
}
