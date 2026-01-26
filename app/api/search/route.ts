import { getProducts } from 'lib/backend';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    if (!query) return NextResponse.json([]);

    try {
        const products = await getProducts({ query });
        return NextResponse.json(products.slice(0, 5));
    } catch (error) {
        return NextResponse.json({ error: 'Search failed' }, { status: 500 });
    }
}
