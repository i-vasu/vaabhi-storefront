import Collections from 'components/layout/search/collections';
import FilterList from 'components/layout/search/filter';
import FacetFilter from 'components/layout/search/filter/facet-filter';
import PriceRangeFilter from 'components/layout/search/filter/price-range';
import { sorting } from 'lib/constants';

export default function FilterSidebar() {
  return (
    <div className="space-y-10">
      <div>
         <h3 className="mb-4 font-serif text-lg font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-100">
            Filters
         </h3>
         <div className="h-px w-full bg-neutral-200 dark:bg-neutral-800 mb-6" />
         <Collections />
      </div>
      
      <div>
         <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
            Price
         </h3>
         <PriceRangeFilter />
      </div>

      <div>
         <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
            Sort By
         </h3>
         <FilterList list={sorting} />
      </div>
      
      <div className='space-y-8'>
         <FacetFilter 
            title="Color" 
            paramName="color" 
            type="color"
            items={[
                { title: 'Black', value: 'Black', colorCode: '#000000' },
                { title: 'White', value: 'White', colorCode: '#ffffff' },
                { title: 'Red', value: 'Red', colorCode: '#ef4444' },
                { title: 'Blue', value: 'Blue', colorCode: '#3b82f6' },
                { title: 'Gold', value: 'Gold', colorCode: '#D4AF37' },
                { title: 'Silver', value: 'Silver', colorCode: '#C0C0C0' },
                { title: 'Cream', value: 'Cream', colorCode: '#FFFDD0' }
            ]}
         />
         
         <FacetFilter 
            title="Size" 
            paramName="size" 
            items={[
                { title: 'XS', value: 'XS' },
                { title: 'S', value: 'S' },
                { title: 'M', value: 'M' },
                { title: 'L', value: 'L' },
                { title: 'XL', value: 'XL' },
                { title: 'XXL', value: 'XXL' }
            ]}
         />

         <FacetFilter 
            title="Material" 
            paramName="material" 
            items={[
                { title: 'Silk', value: 'Silk' },
                { title: 'Cotton', value: 'Cotton' },
                { title: 'Velvet', value: 'Velvet' },
                { title: 'Chiffon', value: 'Chiffon' },
                { title: 'Georgette', value: 'Georgette' }
            ]}
         />
      </div>
    </div>
  );
}
