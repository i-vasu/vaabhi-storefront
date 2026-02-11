
import { CalendarIcon, UserIcon } from '@heroicons/react/24/outline';
import Prose from 'components/prose';
import { getBlog } from 'lib/backend';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getBlog(id);
  if (!post) return notFound();

  return {
    title: `${post.title} | The Vaabhi Journal`,
    description: post.content.substring(0, 160),
    openGraph: {
      type: 'article',
      publishedTime: post.createdAt,
      authors: [post.author]
    }
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getBlog(id);

  if (!post) return notFound();

  const getPlaceholderImage = (id: string) => {
    // Deterministic placeholder based on ID
    const images = [
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2574&auto=format&fit=crop', 
      'https://images.unsplash.com/photo-1605763240004-741b7f7215ca?q=80&w=2664&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596704017254-9b1b1b9e8023?q=80&w=2574&auto=format&fit=crop'
    ];
    // Simple hash
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
       hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return (images[Math.abs(hash) % images.length] || images[0]) as string;
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
      <header className="mb-12 text-center">
        <div className="mb-6 flex justify-center gap-6 text-xs font-bold uppercase tracking-widest text-neutral-500">
           <span className="flex items-center gap-2">
             <CalendarIcon className="h-4 w-4" />
             {new Date(post.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
           </span>
           <span className="flex items-center gap-2">
             <UserIcon className="h-4 w-4" />
             {post.author}
           </span>
        </div>
        <h1 className="text-4xl font-serif font-black leading-tight text-neutral-900 dark:text-white md:text-6xl">
          {post.title}
        </h1>
      </header>
      
      <div className="relative mb-16 aspect-video w-full overflow-hidden rounded-xl bg-neutral-100">
         <Image
            src={getPlaceholderImage(id)}
            alt={post.title}
            fill
            className="object-cover"
            priority
         />
      </div>

      <div className="prose prose-neutral mx-auto dark:prose-invert lg:prose-xl font-serif">
         <Prose html={post.content} />
      </div>

      {/* Recommended/Latest - simplified for now */}
      <div className="mt-20 border-t border-neutral-200 pt-12 dark:border-neutral-800">
         <h4 className="mb-8 text-center text-xs font-black uppercase tracking-widest text-neutral-400">Continue Reading</h4>
         {/* Could fetch more blogs here if needed */}
      </div>
    </div>
  );
}
