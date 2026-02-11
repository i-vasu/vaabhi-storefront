import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

interface EditorialProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  imageAlt: string;
  ctaText: string;
  ctaLink: string;
  alignment?: 'left' | 'right';
}

export function EditorialSection({
  title,
  subtitle,
  description,
  image,
  imageAlt,
  ctaText,
  ctaLink,
  alignment = 'left'
}: EditorialProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className={clsx("flex flex-col gap-16 lg:items-center", {
        "lg:flex-row": alignment === 'left',
        "lg:flex-row-reverse": alignment === 'right'
      })}>
        {/* Image Side */}
        <div className="relative aspect-[4/5] w-full flex-1 overflow-hidden lg:aspect-[3/4]">
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>

        {/* Text Side */}
        <div className="flex flex-1 flex-col justify-center text-center lg:text-left p-8 lg:p-16">
          <span className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-heritage-red">
            {subtitle}
          </span>
          <h2 className="mb-6 font-serif text-4xl font-black leading-tight text-heritage-black dark:text-white md:text-5xl lg:text-6xl">
            {title}
          </h2>
          <p className="mb-10 text-lg font-medium leading-relaxed text-neutral-600 dark:text-neutral-300 opacity-80">
            {description}
          </p>
          <div className="flex justify-center lg:justify-start">
             <Link
                href={ctaLink}
                className="group relative inline-flex items-center gap-2 overflow-hidden border-b-2 border-heritage-red pb-1 text-sm font-black uppercase tracking-widest text-heritage-black transition-all hover:border-heritage-gold hover:text-heritage-gold dark:text-white"
             >
                <span>{ctaText}</span>
             </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
