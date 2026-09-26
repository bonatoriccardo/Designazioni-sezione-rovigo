import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { sql } from '@/lib/db';
import FormPartita from '../../FormPartita';
import Err from '../../Err';

export default async function Modifica({ params, searchParams }) {
  const u = await requireUser();
  const [p] = await sql`SELECT id, user_id, to_char(data,'YYYY-MM-DD') data, to_char(ora,'HH24:MI') ora, casa, ospite, campo, categoria
    FROM partite WHERE id = ${Number((await params).id)}`;
  if (!p || (p.user_id !== u.id && !u.admin)) notFound();
  return <><h1>Modifica partita</h1><Err sp={searchParams} /><FormPartita p={p} /></>;
}
