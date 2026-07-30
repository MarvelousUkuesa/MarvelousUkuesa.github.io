type Props = {
  images: string[];
  label?: string;
};

export function MediaGallery({ images, label = "Gallery" }: Props) {
  if (!images.length) return null;

  return (
    <section className="media-gallery" aria-label={label}>
      <ul className="media-gallery__grid">
        {images.map((src) => (
          <li key={src}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" loading="lazy" />
          </li>
        ))}
      </ul>
    </section>
  );
}
