import { requireUser } from '@/lib/auth';
import { sql } from '@/lib/db';
import FormPartita from '../FormPartita';
import Err from '../Err';

export default async function Nuova({ searchParams }) {
  await requireUser();
  const noti = await sql`SELECT DISTINCT ON (campo) campo, lat, lon, indirizzo FROM partite WHERE lat IS NOT NULL ORDER BY campo, id DESC`;
  return <><h1>Nuova designazione</h1><Err sp={searchParams} /><FormPartita noti={noti} /></>;
}
