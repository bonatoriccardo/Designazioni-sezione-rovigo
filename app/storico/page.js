import { requireUser } from '@/lib/auth';
import Lista from '../Lista';

export default async function Storico() {
  const u = await requireUser();
  return <><h1>Storico</h1><Lista u={u} passate /></>;
}
