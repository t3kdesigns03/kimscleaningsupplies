/* Renders a product name so "6-Pack" / "18-Pack" never splits at the hyphen
   ("Cloths, 6-" / "Pack" on phones). Plain text otherwise. */
export default function PackName({ name }: { name: string }) {
  const parts = name.split(/(\d+-Pack)/);
  return (
    <>
      {parts.map((p, i) =>
        /^\d+-Pack$/.test(p) ? <span key={i} className="whitespace-nowrap">{p}</span> : p
      )}
    </>
  );
}
