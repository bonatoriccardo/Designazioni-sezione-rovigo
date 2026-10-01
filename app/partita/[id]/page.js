import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { sql } from '@/lib/db';
import FormPartita from '../../FormPartita';
import Err from '../../Err';

export default async function Modifica({ params, searchParams }) {
  const u = await requireUser();
  const [p] = await sql`SELECT p.id, p.user_id, u.nome || ' ' || u.cognome autore, p.arbitro_nome, to_char(data,'YYYY-MM-DD') data, to_char(ora,'HH24:MI') ora, casa, ospite, terza, campo, categoria,
    ar1, ar2, quarto, tmo, lat, lon, indirizzo FROM partite p JOIN users u ON u.id = p.user_id WHERE p.id = ${Number((await params).id)}`;
  if (!p || (p.user_id !== u.id && !u.admin)) notFound();
  const noti = await sql`SELECT DISTINCT ON (campo) campo, lat, lon, indirizzo FROM partite WHERE lat IS NOT NULL ORDER BY campo, id DESC`;
  return <><h1>Modifica partita</h1><Err sp={searchParams} /><FormPartita p={p} noti={noti} /></>;
}
