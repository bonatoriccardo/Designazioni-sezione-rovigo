import Link from 'next/link';
import { login } from '../actions';
import Err from '../Err';

export default function Page({ searchParams }) {
  return (
    <div className="auth">
      <img src="/logo.png" alt="Arbitri Rovigo" />
      <h1>Entra</h1>
      <p className="mut">Accedi per vedere le designazioni della sezione.</p>
      <Err sp={searchParams} />
      <form action={login} className="f">
        <label>Nome<input name="nome" required autoComplete="given-name" /></label>
        <label>Cognome<input name="cognome" required autoComplete="family-name" /></label>
        <label>Password<input name="pass" type="password" required minLength={6} /></label>
        <button className="b">Entra</button>
      </form>
      <p className="mut">Non hai un account? <Link href="/registrati">Registrati</Link></p>
    </div>
  );
}
