import './globals.css';
import Link from 'next/link';
import { Roboto_Slab, Inter } from 'next/font/google';
import { getUser } from '@/lib/auth';
import { logout } from './actions';

const slab = Roboto_Slab({ subsets: ['latin'], weight: ['400', '700', '800'], variable: '--f-slab' });
const body = Inter({ subsets: ['latin'], variable: '--f-body' });

export const metadata = { title: 'Designazioni · Arbitri Rovigo', appleWebApp: { title: 'Designazioni', statusBarStyle: 'black-translucent' } };
export const viewport = { themeColor: '#5e0f1e' };

export default async function Layout({ children }) {
  const u = await getUser();
  return (
    <html lang="it" className={`${slab.variable} ${body.variable}`}>
      <body>
        <header><div className="hd">
          <Link href="/" className="brand"><img src="/emblema.png" alt="" />
            <span>Designazioni<small>Arbitri Rovigo</small></span></Link>
          <nav>
            {u ? (<>
              <Link href="/">Partite</Link>
              <Link href="/storico">Storico</Link>
              {u.admin && <Link href="/admin">Admin</Link>}
              <Link href="/nuova" className="cta">+ Designazione</Link>
              <Link href="/profilo" title="Profilo">👤 {u.nome}</Link>
              <form action={logout}><button title="Esci">Esci</button></form>
            </>) : (<>
              <Link href="/login">Entra</Link>
              <Link href="/registrati" className="cta">Registrati</Link>
            </>)}
          </nav>
        </div></header>
        <main>{children}</main>
      </body>
    </html>
  );
}
