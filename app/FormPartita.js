'use client';
import { useState } from 'react';
import { CATEGORIE, CON_TERNA, TERNA } from '@/lib/categorie';
import { salvaPartita, eliminaPartita } from './actions';

export default function FormPartita({ p = {} }) {
  const [cat, setCat] = useState(p.categoria || CATEGORIE[0]);
  return (<>
    <form action={salvaPartita} className="f box">
      {p.id && <input type="hidden" name="id" value={p.id} />}
      <label>Categoria<select name="categoria" value={cat} onChange={e => setCat(e.target.value)} required>
        {CATEGORIE.map(c => <option key={c}>{c}</option>)}
      </select></label>
      <div className="row">
        <label style={{ flex: 1 }}>Data<input name="data" type="date" defaultValue={p.data} required /></label>
        <label style={{ flex: 1 }}>Ora<input name="ora" type="time" defaultValue={p.ora} required /></label>
      </div>
      <label>Squadra di casa<input name="casa" defaultValue={p.casa} required /></label>
      <label>Squadra ospite<input name="ospite" defaultValue={p.ospite} required /></label>
      <label>Campo / indirizzo (es. "Stadio Battaglini, Rovigo")<input name="campo" defaultValue={p.campo} required /></label>
      {CON_TERNA.includes(cat) && <fieldset className="terna"><legend>Team arbitrale (facoltativo)</legend>
        {TERNA.map(([k, l]) => <label key={k}>{l}<input name={k} defaultValue={p[k] ?? ''} /></label>)}
      </fieldset>}
      <div><button className="b">Salva designazione</button></div>
    </form>
    {p.id && <form action={eliminaPartita} style={{ marginTop: 20 }}>
      <input type="hidden" name="id" value={p.id} />
      <button className="l" style={{ color: '#c33' }}>Elimina partita</button>
    </form>}
  </>);
}
