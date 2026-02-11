import { Product } from 'lib/backend';
import Link from 'next/link';
import { GridTileImage } from './grid/tile';

export function ProductListCarousel({ products, title }: { products: Product[], title: string }) {
    if (!products?.length) return null;

    return (
        <div className="w-full pb-10">
            <div className="flex items-center justify-between px-4 pb-8 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-black uppercase tracking-[0.2em] font-serif border-l-4 border-heritage-red pl-4">{title}</h2>
                <Link href="/search" className="text-[10px] font-black uppercase tracking-[0.2em] text-heritage-red hover:text-heritage-gold transition-colors">
                    View Dossier
                </Link>
            </div>
            <div className="w-full overflow-x-auto">
                <ul className="flex gap-4 px-4 sm:px-6 lg:px-8">
                    {products.map((product) => (
                        <li
                            key={product.id}
                            className="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none md:w-1/3 lg:w-1/4"
                        >
                            <Link href={`/product/${product.handle}`} className="relative h-full w-full group">
                                <GridTileImage
                                    alt={product.title}
                                    label={{
                                        title: product.title,
                                        amount: product.priceRange.maxVariantPrice.amount,
                                        currencyCode: product.priceRange.maxVariantPrice.currencyCode
                                    }}
                                    src={product.featuredImage?.url}
                                    fill
                                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                                />
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
