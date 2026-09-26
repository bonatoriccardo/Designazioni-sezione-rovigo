import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { sql } from './db';

const COOKIE = 'sess';

export async function getUser() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const [u] = await sql`SELECT u.id, u.nome, u.cognome, u.admin FROM sessions s JOIN users u ON u.id = s.user_id
    WHERE s.token = ${token} AND s.created > now() - interval '90 days'`;
  return u ?? null;
}

export async function requireUser() {
  const u = await getUser();
  if (!u) redirect('/login');
  return u;
}

export async function startSession(userId) {
  const token = crypto.randomUUID() + crypto.randomUUID();
  await sql`INSERT INTO sessions (token, user_id) VALUES (${token}, ${userId})`;
  (await cookies()).set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 60 * 60 * 24 * 90, path: '/' });
}

export async function endSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) await sql`DELETE FROM sessions WHERE token = ${token}`;
  jar.delete(COOKIE);
}
