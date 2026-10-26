export const CATEGORIE = ['U14', 'U16', 'U18', 'SERIE C', 'SERIE B', 'SERIE A', 'SERIE A ELITE', 'COPPA ITALIA', 'URC', 'RUGBY EUROPE', 'EPCR', 'INTERNAZIONALI', 'ALTRO'];
export const TRIANGOLARE = ['U14'];
export const CON_TERNA = ['SERIE A', 'SERIE A ELITE', 'COPPA ITALIA', 'URC', 'RUGBY EUROPE', 'EPCR', 'INTERNAZIONALI', 'ALTRO'];
export const CON_MTO = ['SERIE A ELITE', 'URC', 'RUGBY EUROPE', 'EPCR', 'INTERNAZIONALI'];
export const TERNA = [['ar1', 'AR1'], ['ar2', 'AR2'], ['quarto', '4° Uomo'], ['quinto', '5° Uomo'], ['sesto', '6° Uomo'], ['tmo', 'TMO'], ['mto', 'MTO']];
const SOLO_TOP = ['quinto', 'sesto', 'mto'];
export const ruoli = cat => CON_TERNA.includes(cat) ? TERNA.filter(([k]) => !SOLO_TOP.includes(k) || CON_MTO.includes(cat)) : [];
export const mapsUrl = (lat, lon) => `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
