import { requireUser } from '@/lib/auth';
import FormPartita from '../FormPartita';
import Err from '../Err';

export default async function Nuova({ searchParams }) {
  await requireUser();
  return <><h1>Nuova designazione</h1><Err sp={searchParams} /><FormPartita /></>;
}
