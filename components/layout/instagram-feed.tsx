'use client';

import { Instagram } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

// This is a mock implementation as real Instagram API requires Access Tokens which expire.
// In a real production app, we would use the Instagram Basic Display API.
const MOCK_INSTAGRAM_POSTS = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=600&auto=format&fit=crop',
    caption: 'Embracing the timeless elegance of handwoven silk. #Vaabhi #LuxuryFashion',
    permalink: 'https://instagram.com'
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=600&auto=format&fit=crop',
    caption: 'Details that define craftsmanship. Discover our new collection. #Artisanal',
    permalink: 'https://instagram.com'
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop',
    caption: 'Sustainable luxury, crafted for the modern muse. #SustainableFashion',
    permalink: 'https://instagram.com'
  },
  {
    id: '4',
    imageUrl: 'https://images.unsplash.com/photo-1550614000-4b9519e07d04?q=80&w=600&auto=format&fit=crop',
    caption: 'Behind the scenes at our latest photoshoot. #VaabhiLife',
    permalink: 'https://instagram.com'
  },
  {
    id: '5',
    imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600&auto=format&fit=crop',
    caption: 'Elegance is an attitude. #VaabhiStyle',
    permalink: 'https://instagram.com'
  },
  {
    id: '6',
    imageUrl: 'https://images.unsplash.com/photo-1534126416832-79f350875883?q=80&w=600&auto=format&fit=crop',
    caption: 'The golden hour glow. #FashionDiaries',
    permalink: 'https://instagram.com'
  }
];

export function InstagramFeed() {
  const [posts, setPosts] = useState(MOCK_INSTAGRAM_POSTS);

  // In a real implementation:
  // useEffect(() => {
  //   fetch('/api/instagram').then(res => res.json()).then(setPosts);
  // }, []);

  return (
    <section className="w-full py-16 md:py-24 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Instagram className="h-6 w-6 text-luxury-gold" />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500">
              @VAABHI_OFFICIAL
            </span>
          </div>
          <h2 className="font-serif text-3xl font-light uppercase tracking-widest md:text-5xl">
            The Vaabhi Journal
          </h2>
          <p className="mt-4 text-xs font-medium uppercase tracking-widest text-neutral-500">
            Curated moments of inspiration
          </p>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-1 md:gap-2">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={post.permalink}
              target="_blank"
              className="group relative block aspect-square overflow-hidden bg-neutral-200"
            >
              <Image
                src={post.imageUrl}
                alt={post.caption}
                fill
                className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                sizes="(min-width: 1024px) 16vw, 50vw"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center p-4">
                <p className="text-white text-xs font-medium text-center line-clamp-3">
                  {post.caption}
                </p>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Instagram className="h-4 w-4 text-white drop-shadow-md" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="https://instagram.com"
            target="_blank"
            className="inline-block border-b border-black pb-1 text-xs font-black uppercase tracking-widest hover:border-luxury-gold hover:text-luxury-gold transition-colors dark:border-white dark:hover:border-luxury-gold"
          >
            Follow Our Journey
          </Link>
        </div>
      </div>
    </section>
  );
}
