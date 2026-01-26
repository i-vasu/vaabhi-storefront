import { Instagram } from 'lucide-react';

const feed = [
    { id: 1, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400', handle: '@vaabhi_official' },
    { id: 2, image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=400', handle: '@vaabhi_official' },
    { id: 3, image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=400', handle: '@vaabhi_official' },
    { id: 4, image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&q=80&w=400', handle: '@vaabhi_official' },
];

export default function SocialFeed() {
    return (
        <div className="py-20 px-4">
            <div className="mx-auto max-w-7xl">
                <div className="mb-12 flex flex-col items-center justify-center text-center">
                    <Instagram className="mb-4 h-8 w-8 text-neutral-400" />
                    <h2 className="text-3xl font-bold">Shop the Look</h2>
                    <p className="mt-2 text-neutral-500">Join our community and share your style with #Vaabhi</p>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {feed.map((item) => (
                        <div key={item.id} className="group relative aspect-square overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
                            <img
                                src={item.image}
                                alt="Social feed"
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                <span className="text-sm font-medium text-white">{item.handle}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
