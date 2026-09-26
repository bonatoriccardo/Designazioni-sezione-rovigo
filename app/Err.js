export default async function Err({ sp }) {
  const e = (await sp)?.e;
  return e ? <p className="err">{e}</p> : null;
}
