type ClientImage =
  | { type: "svg"; content: string }
  | { type: "url"; src: string; alt: string; attribution?: string };

export default function QuestionImage({ image }: { image: ClientImage }) {
  if (image.type === "svg") {
    return (
      <div
        className="rounded-xl border border-border bg-card p-4 overflow-hidden"
        dangerouslySetInnerHTML={{ __html: image.content }}
      />
    );
  }
  return (
    <figure className="rounded-xl border border-border bg-card overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
        alt={image.alt}
        className="w-full h-auto object-contain max-h-64"
      />
      {image.attribution && (
        <figcaption className="text-[10px] text-muted-foreground px-3 py-1.5 border-t border-border">
          {image.attribution}
        </figcaption>
      )}
    </figure>
  );
}