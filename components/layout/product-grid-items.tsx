import Grid from 'components/grid';
import { GridTileImage } from 'components/grid/tile';
import Price from 'components/price';
import { Product } from 'lib/backend';
import Link from 'next/link';

export default function ProductGridItems({ products }: { products: Product[] }) {
  return (
    <>
      {products.map((product) => (
        <Grid.Item key={product.handle} className="animate-fadeIn aspect-[3/4]">
          <Link
            className="relative inline-block h-full w-full"
            href={`/product/${product.handle}`}
            prefetch={true}
          >
            <div className="group block h-full w-full">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-white dark:bg-neutral-900">
                  <GridTileImage
                    alt={product.title}
                    src={product.featuredImage?.url}
                    fill
                    sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                    isInteractive={false}
                    active={false}
                  />
              </div>
              
              <div className="mt-4 flex flex-col gap-1 text-center">
                  <h3 className="text-sm font-medium text-neutral-900 dark:text-white">
                    {product.title}
                  </h3>
                  <div className="flex justify-center gap-2">
                      <Price
                        className="font-serif text-sm text-neutral-500 dark:text-neutral-400"
                        amount={product.priceRange.maxVariantPrice.amount}
                        currencyCode={product.priceRange.maxVariantPrice.currencyCode}
                      />
                  </div>
              </div>
            </div>
          </Link>
        </Grid.Item>
      ))}
    </>
  );
}
