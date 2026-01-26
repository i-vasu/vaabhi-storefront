
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function ReturnsPage() {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('vaabhi_user')?.value;
    const user = userCookie ? JSON.parse(userCookie) : null;
    const email = user?.email || 'customer@example.com';

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Returns & Exchanges</h1>
                <p className="text-neutral-500">Track and manage your return requests.</p>
            </div>

            <div className="rounded-2xl border border-neutral-100 bg-neutral-50 px-8 py-12 text-center dark:border-neutral-800 dark:bg-black">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl dark:bg-blue-900/20">
                    📦
                </div>
                <h2 className="text-xl font-bold">No Active Returns</h2>
                <p className="mt-2 text-sm text-neutral-500">
                    You don't have any active return or exchange requests at the moment.
                </p>
                <Link
                    href="/account/orders"
                    className="mt-8 inline-block rounded-full bg-black px-8 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-black"
                >
                    Return an Item
                </Link>
            </div>

            <div className="rounded-2xl border border-neutral-100 p-8 dark:border-neutral-800">
                <h3 className="mb-4 text-lg font-bold">Our Return Policy</h3>
                <ul className="list-disc space-y-2 pl-6 text-sm text-neutral-600 dark:text-neutral-400">
                    <li>Items must be returned within 15 days of delivery.</li>
                    <li>Garments must be unworn, unwashed, and have original tags attached.</li>
                    <li>Personalized and custom-designed items are not eligible for return.</li>
                    <li>Refunds are processed within 5-7 business days of receipt.</li>
                </ul>
            </div>
        </div>
    );
}
