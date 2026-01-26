import { getActiveCoupons } from 'lib/backend';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const coupons = await getActiveCoupons();
        return NextResponse.json(coupons);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
    }
}
