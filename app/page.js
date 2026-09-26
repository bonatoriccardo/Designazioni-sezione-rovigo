import { requireUser } from '@/lib/auth';
import Lista from './Lista';
import Filtro from './Filtro';

export default async function Page({ searchParams }) {
  const u = await requireUser();
  const cat = (await searchParams)?.cat;
  return <><h1>Prossime partite</h1><Filtro base="/" cat={cat} /><Lista u={u} cat={cat} /></>;
}
