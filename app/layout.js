import './globals.css';
import Link from 'next/link';
import { Barlow, Barlow_Condensed, Roboto_Slab } from 'next/font/google';
import { getUser } from '@/lib/auth';
import { logout } from './actions';

const cond = Barlow_Condensed({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--f-cond' });
const slab = Roboto_Slab({ subsets: ['latin'], weight: ['400', '700', '800'], variable: '--f-slab' });
const body = Barlow({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--f-body' });

export const metadata = { title: 'Designazioni · Arbitri Rovigo', appleWebApp: { title: 'Designazioni', statusBarStyle: 'black-translucent' } };
export const viewport = { themeColor: '#61111e' };

export default async function Layout({ children }) {
  const u = await getUser();
  return (
    <html lang="it" className={`${cond.variable} ${body.variable} ${slab.variable}`}>
      <body>
        <header><div className="hd">
          <Link href="/" className="brand"><img src="/emblema.png" alt="" />
            <span><b>Designazioni</b><small>ARBITRI ROVIGO</small></span></Link>
          <nav>
            {u ? (<>
              <Link href="/">Partite</Link>
              <Link href="/storico">Storico</Link>
              {u.admin && <Link href="/admin">Utenti</Link>}
              <Link href="/profilo">Profilo</Link>
              <form action={logout}><button>Esci</button></form>
              <Link href="/nuova" className="add">+ Designazione</Link>
            </>) : (<>
              <Link href="/login">Entra</Link>
              <Link href="/registrati" className="add">Registrati</Link>
            </>)}
          </nav>
        </div></header>
        <main>{children}</main>
      </body>
    </html>
  );
}
