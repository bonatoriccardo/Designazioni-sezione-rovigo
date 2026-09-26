import './globals.css';
import Link from 'next/link';
import { getUser } from '@/lib/auth';
import { logout } from './actions';

export const metadata = { title: 'Designazioni Rugby Rovigo' };

export default async function Layout({ children }) {
  const u = await getUser();
  return (
    <html lang="it">
      <body>
        <nav>
          <b>🏉 Designazioni</b>
          {u ? (<>
            <Link href="/">Partite</Link>
            <Link href="/nuova">+ Nuova</Link>
            <Link href="/storico">Storico</Link>
            {u.admin && <Link href="/admin">Admin</Link>}
            <form action={logout}><button>Esci ({u.nome})</button></form>
          </>) : (<>
            <Link href="/login">Entra</Link>
            <Link href="/registrati">Registrati</Link>
          </>)}
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
