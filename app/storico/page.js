import { requireUser } from '@/lib/auth';
import Lista from '../Lista';
import Filtro from '../Filtro';

export default async function Page({ searchParams }) {
  const u = await requireUser();
  const cat = (await searchParams)?.cat;
  return <><h1>Storico</h1><Filtro base="/storico" cat={cat} /><Lista u={u} cat={cat} passate /></>;
}
