'use server';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';
import { CATEGORIE, CON_TERNA, TERNA, TRIANGOLARE } from '@/lib/categorie';
import { getUser, requireUser, startSession, endSession } from '@/lib/auth';

const s = (f, k) => String(f.get(k) ?? '').trim();
const S = (f, k) => s(f, k).replace(/\s+/g, ' ').toUpperCase();
const err = (path, msg) => redirect(`${path}?e=${encodeURIComponent(msg)}`);

export async function registrati(f) {
  const nome = S(f, 'nome'), cognome = S(f, 'cognome'), pass = s(f, 'pass');
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
  const p = { data: s(f, 'data'), ora: s(f, 'ora'), casa: S(f, 'casa'), ospite: S(f, 'ospite'), campo: S(f, 'campo'), categoria: s(f, 'categoria') };
  if (Object.values(p).some(v => !v) || !CATEGORIE.includes(p.categoria)) err(back, 'Compila tutti i campi');
  p.terza = TRIANGOLARE.includes(p.categoria) && f.get('tri') ? S(f, 'terza') || null : null;
  p.arbitro_nome = CON_TERNA.includes(p.categoria) ? S(f, 'arbitro_nome') || null : null;
  for (const [k] of TERNA) p[k] = CON_TERNA.includes(p.categoria) ? S(f, k) || null : null;
  const lat = parseFloat(f.get('lat')), lon = parseFloat(f.get('lon'));
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) err(back, 'Verifica il campo sulla mappa prima di salvare');
  Object.assign(p, { lat, lon, indirizzo: s(f, 'indirizzo') || null });
  return p;
}

export async function salvaPartita(f) {
  const u = await requireUser();
  const id = Number(f.get('id')) || null;
  const p = leggiPartita(f, id ? `/partita/${id}` : '/nuova');
  if (id) {
    await sql`UPDATE partite SET data=${p.data}, ora=${p.ora}, casa=${p.casa}, ospite=${p.ospite}, terza=${p.terza}, campo=${p.campo}, categoria=${p.categoria},
      arbitro_nome=${p.arbitro_nome}, ar1=${p.ar1}, ar2=${p.ar2}, quarto=${p.quarto}, tmo=${p.tmo}, lat=${p.lat}, lon=${p.lon}, indirizzo=${p.indirizzo}
      WHERE id=${id} AND (user_id=${u.id} OR ${u.admin})`;
  } else {
    await sql`INSERT INTO partite (user_id, data, ora, casa, ospite, terza, campo, categoria, arbitro_nome, ar1, ar2, quarto, tmo, lat, lon, indirizzo)
      VALUES (${u.id}, ${p.data}, ${p.ora}, ${p.casa}, ${p.ospite}, ${p.terza}, ${p.campo}, ${p.categoria}, ${p.arbitro_nome}, ${p.ar1}, ${p.ar2}, ${p.quarto}, ${p.tmo}, ${p.lat}, ${p.lon}, ${p.indirizzo})`;
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

export async function cambiaPassword(f) {
  const u = await requireUser();
  const [r] = await sql`SELECT pass FROM users WHERE id=${u.id}`;
  if (!(await bcrypt.compare(s(f, 'old'), r.pass))) err('/profilo', 'Password attuale errata');
  if (s(f, 'pass').length < 6) err('/profilo', 'Nuova password almeno 6 caratteri');
  await sql`UPDATE users SET pass=${await bcrypt.hash(s(f, 'pass'), 10)} WHERE id=${u.id}`;
  redirect('/profilo?ok=1');
}

export async function resetPassword(f) {
  const u = await requireUser();
  const id = Number(f.get('id')), pass = s(f, 'pass');
  if (!u.admin || pass.length < 6) err('/admin', 'Password almeno 6 caratteri');
  await sql`UPDATE users SET pass=${await bcrypt.hash(pass, 10)} WHERE id=${id}`;
  await sql`DELETE FROM sessions WHERE user_id=${id}`;
  redirect('/admin?ok=1');
}
