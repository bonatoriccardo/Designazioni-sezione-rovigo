import { CATEGORIE } from '@/lib/db';
import { salvaPartita, eliminaPartita } from './actions';

export default function FormPartita({ p = {} }) {
  return (<>
    <form action={salvaPartita} className="f">
      {p.id && <input type="hidden" name="id" value={p.id} />}
      <select name="categoria" defaultValue={p.categoria} required>
        {CATEGORIE.map(c => <option key={c}>{c}</option>)}
      </select>
      <div className="row"><input name="data" type="date" defaultValue={p.data} required style={{ flex: 1 }} />
        <input name="ora" type="time" defaultValue={p.ora} required style={{ flex: 1 }} /></div>
      <input name="casa" placeholder="Squadra di casa" defaultValue={p.casa} required />
      <input name="ospite" placeholder="Squadra ospite" defaultValue={p.ospite} required />
      <input name="campo" placeholder="Campo / indirizzo" defaultValue={p.campo} required />
      <button className="b">Salva</button>
    </form>
    {p.id && <form action={eliminaPartita} style={{ marginTop: 20 }}>
      <input type="hidden" name="id" value={p.id} />
      <button className="l" style={{ color: '#c33' }}>Elimina partita</button>
    </form>}
  </>);
}
