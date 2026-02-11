import Footer from 'components/layout/footer';
import FilterSidebar from 'components/layout/search/filter/filter-sidebar';
import MobileFilters from 'components/layout/search/mobile-filters';
import { Suspense } from 'react';
import ChildrenWrapper from './children-wrapper';

// app/search/layout.tsx


export default function SearchLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="mx-auto flex max-w-[1920px] flex-col gap-8 px-4 pb-20 pt-8 text-black md:flex-row md:px-12 dark:text-white">
        <div className="order-first flex-none md:w-64 lg:w-72 hidden md:block">
          <div className="sticky top-32">
             <FilterSidebar />
          </div>
        </div>
        
        {/* Mobile Filter Wrapper */}
        <div className="md:hidden">
            <MobileFilters>
                <FilterSidebar />
            </MobileFilters>
        </div>

        <div className="min-h-screen w-full">
           <Suspense fallback={null}>
            <ChildrenWrapper>{children}</ChildrenWrapper>
          </Suspense>
        </div>
      </div>
      <Footer />
    </>
  );
}
