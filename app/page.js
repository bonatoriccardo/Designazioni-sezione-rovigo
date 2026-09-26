import { requireUser } from '@/lib/auth';
import Lista from './Lista';

export default async function Home() {
  const u = await requireUser();
  return <><h1>Prossime partite</h1><Lista u={u} /></>;
}
