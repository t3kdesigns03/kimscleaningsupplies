/* Renders a schema.org block as JSON-LD.
   The `<` escape is deliberate: without it a stray "</script>" inside any
   product copy would close the tag early and break the page. */
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
