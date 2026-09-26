'use client';
import { useState } from 'react';
import { mapsUrl } from '@/lib/categorie';


export default function Campo({ p, noti }) {
  const [campo, setCampo] = useState(p.campo || '');
  const [pos, setPos] = useState(p.lat ? { lat: p.lat, lon: p.lon, indirizzo: p.indirizzo } : null);
  const [ris, setRis] = useState(null);
  const [stato, setStato] = useState('');

  const scrivi = v => {
    setCampo(v);
    const n = noti.find(c => c.campo === v.toUpperCase());
    setPos(n ? { lat: n.lat, lon: n.lon, indirizzo: n.indirizzo } : null);
    setRis(null);
  };
  const cerca = async () => {
    setStato('Ricerca…'); setRis(null);
    try {
      const r = await fetch('/api/luoghi?q=' + encodeURIComponent(campo));
      const d = await r.json();
      if (!r.ok) throw 0;
      setRis(d); setStato(d.length ? '' : 'Nessun risultato: prova ad aggiungere via e città.');
    } catch { setStato('Servizio mappe non raggiungibile, riprova tra poco.'); }
  };

  return (
    <div className="campo">
      <label>Campo
        <div className="inl">
          <input name="campo" value={campo} onChange={e => scrivi(e.target.value)} list="campi-noti" required placeholder="Es. Stadio Battaglini, Rovigo" />
          <button type="button" className="btn sec" onClick={cerca} disabled={campo.trim().length < 3}>Cerca</button>
        </div>
      </label>
      <datalist id="campi-noti">{noti.map(c => <option key={c.campo} value={c.campo}>{c.indirizzo}</option>)}</datalist>
      <input type="hidden" name="lat" value={pos?.lat ?? ''} />
      <input type="hidden" name="lon" value={pos?.lon ?? ''} />
      <input type="hidden" name="indirizzo" value={pos?.indirizzo ?? ''} />
      {stato && <p className="hint">{stato}</p>}
      {ris?.length > 0 && <ul className="ris">{ris.map((r, i) => (
        <li key={i}><button type="button" onClick={() => { setPos(r); setRis(null); }}>
          <b>{r.nome}</b><span>{r.indirizzo}</span></button></li>))}</ul>}
      {pos ? <p className="ok">Posizione verificata · {pos.indirizzo || `${pos.lat.toFixed(4)}, ${pos.lon.toFixed(4)}`} · <a href={mapsUrl(pos.lat, pos.lon)} target="_blank" rel="noopener">Controlla su Google Maps</a></p>
        : !ris && <p className="hint">Premi «Cerca» e scegli il risultato giusto: così il link a Google Maps porta esattamente al campo.</p>}
    </div>
  );
}
