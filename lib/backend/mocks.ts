import { Collection, Product } from 'lib/shopify/types';

export const MOCK_PRODUCTS: Product[] = [
    {
        id: '1',
        handle: 'mock-product-1',
        availableForSale: true,
        title: 'Boho Summer Dress',
        description: 'A beautiful boho summer dress with floral patterns.',
        descriptionHtml: '<p>A beautiful boho summer dress with floral patterns.</p>',
        options: [],
        priceRange: {
            maxVariantPrice: { amount: '2499', currencyCode: 'INR' },
            minVariantPrice: { amount: '2499', currencyCode: 'INR' }
        },
        variants: [
            {
                id: '1',
                title: 'Default',
                availableForSale: true,
                selectedOptions: [],
                price: { amount: '2499', currencyCode: 'INR' }
            }
        ],
        featuredImage: {
            url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=600&h=400&auto=format&fit=crop',
            altText: 'Boho Summer Dress',
            width: 600,
            height: 400
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=600&h=400&auto=format&fit=crop',
                altText: 'Boho Summer Dress',
                width: 600,
                height: 400
            }
        ],
        seo: { title: 'Boho Summer Dress', description: 'A beautiful boho summer dress' },
        tags: ['new', 'dress'],
        updatedAt: new Date().toISOString(),
        materialStory: 'Hand-woven organic cotton from the coastal regions of India.',
        stylistNotes: 'Pair this with our signature leather sandals for a complete bohemian look.',
        modelMeasurements: 'Model is 5\'8" and wearing a size Small.'
    },
    {
        id: '2',
        handle: 'mock-product-2',
        availableForSale: true,
        title: 'Silk Evening Gown',
        description: 'Elegant silk gown for special occasions.',
        descriptionHtml: '<p>Elegant silk gown for special occasions.</p>',
        options: [],
        priceRange: {
            maxVariantPrice: { amount: '8999', currencyCode: 'INR' },
            minVariantPrice: { amount: '8999', currencyCode: 'INR' }
        },
        variants: [
            {
                id: '2',
                title: 'Default',
                availableForSale: true,
                selectedOptions: [],
                price: { amount: '8999', currencyCode: 'INR' }
            }
        ],
        featuredImage: {
            url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&h=400&auto=format&fit=crop',
            altText: 'Silk Evening Gown',
            width: 600,
            height: 400
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&h=400&auto=format&fit=crop',
                altText: 'Silk Evening Gown',
                width: 600,
                height: 400
            }
        ],
        seo: { title: 'Silk Evening Gown', description: 'Elegant silk gown' },
        tags: ['luxury', 'gown'],
        updatedAt: new Date().toISOString(),
        materialStory: '100% Mulberry silk, sustainably sourced and meticulously stitched.',
        stylistNotes: 'A statement piece that needs minimal accessories. Perfect for black-tie events.',
        modelMeasurements: 'Model is 5\'10" and wearing a size Medium.'
    },
    {
        id: '3',
        handle: 'mock-product-3',
        availableForSale: true,
        title: 'Linen Casual Shirt',
        description: 'Breathable linen shirt for everyday wear.',
        descriptionHtml: '<p>Breathable linen shirt for everyday wear.</p>',
        options: [],
        priceRange: {
            maxVariantPrice: { amount: '1899', currencyCode: 'INR' },
            minVariantPrice: { amount: '1899', currencyCode: 'INR' }
        },
        variants: [
            {
                id: '3',
                title: 'Default',
                availableForSale: true,
                selectedOptions: [],
                price: { amount: '1899', currencyCode: 'INR' }
            }
        ],
        featuredImage: {
            url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&h=400&auto=format&fit=crop',
            altText: 'Linen Casual Shirt',
            width: 600,
            height: 400
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&h=400&auto=format&fit=crop',
                altText: 'Linen Casual Shirt',
                width: 600,
                height: 400
            }
        ],
        seo: { title: 'Linen Casual Shirt', description: 'Breathable linen shirt' },
        tags: ['casual', 'shirt'],
        updatedAt: new Date().toISOString()
    }
];

export const MOCK_COLLECTIONS: Collection[] = [
    {
        handle: 'new-arrivals',
        title: 'New Arrivals',
        description: 'Our latest fashion pieces.',
        seo: { title: 'New Arrivals', description: 'New Arrivals' },
        updatedAt: new Date().toISOString(),
        path: '/search/new-arrivals'
    },
    {
        handle: 'summer-collection',
        title: 'Summer Collection',
        description: 'Beat the heat with our summer style.',
        seo: { title: 'Summer Collection', description: 'Summer Collection' },
        updatedAt: new Date().toISOString(),
        path: '/search/summer-collection'
    }
];
