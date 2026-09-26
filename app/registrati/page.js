import Link from 'next/link';
import { registrati } from '../actions';
import Err from '../Err';

export default function Page({ searchParams }) {
  return (
    <div className="auth">
      <img src="/logo.png" alt="Arbitri Rovigo" />
      <h1>Registrati</h1>
      <p className="mut">Crea il tuo profilo con nome, cognome e password.</p>
      <Err sp={searchParams} />
      <form action={registrati} className="f">
        <label>Nome<input name="nome" required autoComplete="given-name" /></label>
        <label>Cognome<input name="cognome" required autoComplete="family-name" /></label>
        <label>Password<input name="pass" type="password" required minLength={6} /></label>
        <button className="b">Registrati</button>
      </form>
      <p className="mut">Hai già un account? <Link href="/login">Entra</Link></p>
    </div>
  );
}
