import { useState } from "react";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      <div className="flex gap-3 sm:flex-col">
        {images.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Ver imagen ${i + 1} de ${alt}`}
            aria-current={i === active}
            className={`overflow-hidden rounded-2xl border bg-secondary/70 p-2 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 ${
              i === active ? "border-primary shadow-[0_10px_22px_-16px_rgba(16,18,26,0.6)]" : "border-border"
            }`}
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-16 w-16 object-contain sm:h-20 sm:w-20"
            />
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden rounded-3xl border border-border/80 bg-secondary/70 p-6">
        <img
          src={images[active]}
          alt={alt}
          decoding="async"
          fetchPriority="high"
          width={900}
          height={1100}
          className="mx-auto h-[320px] w-full object-contain transition-transform duration-500 ease-out hover:scale-105 sm:h-[440px]"
        />
      </div>
    </div>
  );
}
