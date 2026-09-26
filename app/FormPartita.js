'use client';
import { useState } from 'react';
import { CATEGORIE, CON_TERNA, TERNA, TRIANGOLARE } from '@/lib/categorie';
import { salvaPartita, eliminaPartita } from './actions';
import Campo from './Campo';

export default function FormPartita({ p = {}, noti = [] }) {
  const [cat, setCat] = useState(p.categoria || CATEGORIE[0]);
  const [tri, setTri] = useState(!!p.terza);
  const isTri = TRIANGOLARE.includes(cat) && tri;
  return (<>
    <form action={salvaPartita} className="form">
      {p.id && <input type="hidden" name="id" value={p.id} />}
      <label>Categoria<select name="categoria" value={cat} onChange={e => setCat(e.target.value)} required>
        {CATEGORIE.map(c => <option key={c}>{c}</option>)}
      </select></label>
      <div className="two keep">
        <label>Data<input name="data" type="date" defaultValue={p.data} required /></label>
        <label>Ora<input name="ora" type="time" defaultValue={p.ora} required /></label>
      </div>
      <div className="two">
        <label>Squadra di casa<input name="casa" defaultValue={p.casa} required /></label>
        <label>{isTri ? 'Seconda squadra' : 'Squadra ospite'}<input name="ospite" defaultValue={p.ospite} required /></label>
      </div>
      {TRIANGOLARE.includes(cat) && <label className="check"><input type="checkbox" name="tri" checked={tri} onChange={e => setTri(e.target.checked)} /> Triangolare</label>}
      {isTri && <label>Terza squadra<input name="terza" defaultValue={p.terza ?? ''} required /></label>}
      <Campo p={p} noti={noti} />
      {CON_TERNA.includes(cat) && <fieldset><legend>Team arbitrale · facoltativo</legend>
        <div className="two">{TERNA.map(([k, l]) => <label key={k}>{l}<input name={k} defaultValue={p[k] ?? ''} /></label>)}</div>
      </fieldset>}
      <div className="actions"><button className="btn">Salva designazione</button></div>
    </form>
    {p.id && <form action={eliminaPartita} className="danger">
      <input type="hidden" name="id" value={p.id} />
      <button className="link red">Elimina questa partita</button>
    </form>}
  </>);
}
