
import { ArrowRightIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';
import { getBlogs } from 'lib/backend';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'The Vaabhi Journal',
  description: 'Editorial stories on fashion, heritage, and sustainable luxury.'
};

export default async function JournalPage() {
  const blogs = await getBlogs();

  // Sort by newest first
  const sortedBlogs = blogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  // Featured article (first one)
  const featured = sortedBlogs[0];
  const rest = sortedBlogs.slice(1);

  const getPlaceholderImage = (id: number) => {
    // Deterministic placeholder based on ID
    const images = [
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2574&auto=format&fit=crop', // Silk/Fashion
      'https://images.unsplash.com/photo-1605763240004-741b7f7215ca?q=80&w=2664&auto=format&fit=crop', // Embroidery
      'https://images.unsplash.com/photo-1596704017254-9b1b1b9e8023?q=80&w=2574&auto=format&fit=crop', // Jewelry
      'https://images.unsplash.com/photo-1509631179647-0177f95a64de?q=80&w=2576&auto=format&fit=crop', // Model
      'https://images.unsplash.com/photo-1574634534894-89d7576c8259?q=80&w=2000&auto=format&fit=crop'  // Texture
    ];
    return (images[id % images.length] || images[0]) as string;
  };

  const curatedTrends = [
    { title: 'The Banarasi Edit', tag: 'Banarasi', image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=2000&auto=format&fit=crop' },
    { title: 'Velvet Sovereignty', tag: 'Velvet', image: 'https://images.unsplash.com/photo-1621430259832-4411130e760c?q=80&w=2000&auto=format&fit=crop' },
    { title: 'Artisanal Zari', tag: 'Zari', image: 'https://images.unsplash.com/photo-1596704017254-9b1b1b9e8023?q=80&w=2574&auto=format&fit=crop' },
    { title: 'Modern Minimalism', tag: 'Modern', image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=2000&auto=format&fit=crop' }
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <header className="mb-16 text-center">
        <h1 className="text-5xl font-black uppercase tracking-tight font-serif md:text-7xl">The Journal</h1>
        <p className="mt-6 text-sm font-bold uppercase tracking-widest text-neutral-500">Chronicles of Heritage & Style</p>
      </header>

      {/* Atelier Trends Section */}
      <section className="mb-24">
        <div className="mb-10 flex items-center justify-between border-b border-neutral-100 pb-6 dark:border-neutral-800">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">Atelier Trends</h2>
            <Link href="/search" className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-black">Explore All →</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
            {curatedTrends.map((trend) => (
                <Link 
                    key={trend.title} 
                    href={`/search?q=${trend.tag}`}
                    className="group relative aspect-[4/5] overflow-hidden bg-neutral-100 dark:bg-neutral-800"
                >
                    <Image
                        src={trend.image}
                        alt={trend.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center opacity-0 transition-all duration-500 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 mb-2">Trend Report</p>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white">{trend.title}</h3>
                    </div>
                </Link>
            ))}
        </div>
      </section>

      {featured ? (
        <article className="mb-24 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <Link href={`/journal/${featured.blogId}`} className="group relative aspect-[4/3] overflow-hidden rounded-none lg:aspect-[16/9]">
             <Image
                src={getPlaceholderImage(featured.blogId)}
                alt={featured.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
              />
          </Link>
          <div className="flex flex-col justify-center">
            <div className="mb-4 flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-neutral-500">
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                {new Date(featured.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <span className="h-px w-8 bg-neutral-200"></span>
              <span className="flex items-center gap-1">
                <UserIcon className="h-3 w-3" />
                {featured.author}
              </span>
            </div>
            <h2 className="mb-6 text-3xl font-serif font-bold leading-tight text-neutral-900 group-hover:text-luxury-gold dark:text-white lg:text-5xl">
              <Link href={`/journal/${featured.blogId}`}>{featured.title}</Link>
            </h2>
            <p className="mb-8 line-clamp-3 text-lg text-neutral-600 dark:text-neutral-400 font-serif">
              {featured.content.replace(/<[^>]*>?/gm, '').substring(0, 200)}...
            </p>
            <Link 
              href={`/journal/${featured.blogId}`}
              className="group inline-flex items-center text-xs font-black uppercase tracking-widest hover:text-luxury-gold transition-colors decoration-1 underline-offset-4 hover:underline"
            >
              Read Full Story
              <ArrowRightIcon className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </article>
      ) : (
        <div className="py-20 text-center">
            <p className="font-serif italic text-neutral-500">The ink is still drying. Check back soon for our first story.</p>
        </div>
      )}

      {rest.length > 0 && (
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <article key={post.blogId} className="group flex flex-col items-start">
               <Link href={`/journal/${post.blogId}`} className="relative mb-6 w-full aspect-[3/4] overflow-hidden bg-neutral-100">
                  <Image
                    src={getPlaceholderImage(post.blogId)}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width: 768px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
               </Link>
               
               <div className="mb-3 flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  <span className="h-3 w-px bg-neutral-200"></span>
                  <span>{post.author}</span>
               </div>

               <h3 className="mb-3 text-xl font-serif font-bold text-neutral-900 group-hover:underline decoration-1 underline-offset-4 dark:text-white">
                 <Link href={`/journal/${post.blogId}`}>
                   {post.title}
                 </Link>
               </h3>
               
               <p className="line-clamp-3 text-sm text-neutral-500 dark:text-neutral-400 font-serif leading-relaxed">
                 {post.content.replace(/<[^>]*>?/gm, '').substring(0, 120)}...
               </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
