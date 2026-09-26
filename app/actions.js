'use server';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { sql, CATEGORIE } from '@/lib/db';
import { getUser, requireUser, startSession, endSession } from '@/lib/auth';

const s = (f, k) => String(f.get(k) ?? '').trim();
const err = (path, msg) => redirect(`${path}?e=${encodeURIComponent(msg)}`);

export async function registrati(f) {
  const nome = s(f, 'nome'), cognome = s(f, 'cognome'), pass = s(f, 'pass');
  if (!nome || !cognome || pass.length < 6) err('/registrati', 'Compila tutto, password almeno 6 caratteri');
  const hash = await bcrypt.hash(pass, 10);
  const [u] = await sql`INSERT INTO users (nome, cognome, pass, admin)
    SELECT ${nome}, ${cognome}, ${hash}, NOT EXISTS (SELECT 1 FROM users)
    ON CONFLICT DO NOTHING RETURNING id`;
  if (!u) err('/registrati', 'Utente già registrato');
  await startSession(u.id);
  redirect('/');
}

export async function login(f) {
  const [u] = await sql`SELECT id, pass FROM users WHERE lower(nome) = lower(${s(f, 'nome')}) AND lower(cognome) = lower(${s(f, 'cognome')})`;
  if (!u || !(await bcrypt.compare(s(f, 'pass'), u.pass))) err('/login', 'Credenziali errate');
  await startSession(u.id);
  redirect('/');
}

export async function logout() {
  await endSession();
  redirect('/login');
}

function leggiPartita(f, back) {
  const p = { data: s(f, 'data'), ora: s(f, 'ora'), casa: s(f, 'casa'), ospite: s(f, 'ospite'), campo: s(f, 'campo'), categoria: s(f, 'categoria') };
  if (Object.values(p).some(v => !v) || !CATEGORIE.includes(p.categoria)) err(back, 'Compila tutti i campi');
  return p;
}

export async function salvaPartita(f) {
  const u = await requireUser();
  const id = Number(f.get('id')) || null;
  const p = leggiPartita(f, id ? `/partita/${id}` : '/nuova');
  if (id) {
    await sql`UPDATE partite SET data=${p.data}, ora=${p.ora}, casa=${p.casa}, ospite=${p.ospite}, campo=${p.campo}, categoria=${p.categoria}
      WHERE id=${id} AND (user_id=${u.id} OR ${u.admin})`;
  } else {
    await sql`INSERT INTO partite (user_id, data, ora, casa, ospite, campo, categoria)
      VALUES (${u.id}, ${p.data}, ${p.ora}, ${p.casa}, ${p.ospite}, ${p.campo}, ${p.categoria})`;
  }
  revalidatePath('/');
  redirect('/');
}

export async function eliminaPartita(f) {
  const u = await requireUser();
  await sql`DELETE FROM partite WHERE id=${Number(f.get('id'))} AND (user_id=${u.id} OR ${u.admin})`;
  revalidatePath('/');
  redirect('/');
}

export async function toggleAdesione(f) {
  const u = await getUser();
  if (!u) redirect('/login');
  const pid = Number(f.get('id'));
  // admin può rimuovere l'adesione di altri passando uid
  const uid = u.admin && f.get('uid') ? Number(f.get('uid')) : u.id;
  const del = await sql`DELETE FROM adesioni WHERE partita_id=${pid} AND user_id=${uid} RETURNING 1`;
  if (!del.length && uid === u.id) await sql`INSERT INTO adesioni VALUES (${pid}, ${u.id}) ON CONFLICT DO NOTHING`;
  revalidatePath('/');
}

export async function toggleAdmin(f) {
  const u = await requireUser();
  const id = Number(f.get('id'));
  if (u.admin && id !== u.id) await sql`UPDATE users SET admin = NOT admin WHERE id=${id}`;
  revalidatePath('/admin');
}
