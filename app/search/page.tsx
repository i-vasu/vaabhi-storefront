import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { getProducts } from 'lib/backend';
import { defaultSort, sorting } from 'lib/constants';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search for products in the store.'
};

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { sort, q: searchValue, minPrice, maxPrice, color, size, material, v } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  const products = await getProducts({
    sortKey,
    reverse,
    query: searchValue,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    color,
    size,
    material
  });
  const resultsText = products.length > 1 ? 'results' : 'result';

  return (
    <>
      {searchValue ? (
        <p className="mb-4">
          {products.length === 0
            ? 'There are no products that match '
            : `Showing ${products.length} ${resultsText} for `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : v ? (
        <p className="mb-4">Showing visual search results</p>
      ) : null}
      {products.length > 0 ? (
        <Grid className="grid-cols-2 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          <ProductGridItems products={products} />
        </Grid>
      ) : null}
    </>
  );
}
