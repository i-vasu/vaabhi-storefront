import { AddressCard } from 'components/account/address-card';
import { getSessionEmail } from 'lib/auth-utils';
import { getAddresses } from 'lib/backend';
import Link from 'next/link';

export default async function AddressesPage() {
    const email = await getSessionEmail();
    const addresses = await getAddresses();

    return (
        <div className="mx-auto max-w-4xl space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Your Addresses</h1>
                    <p className="text-neutral-500">Manage your shipping and billing locations.</p>
                </div>
                <Link
                    href="/account/addresses/new"
                    className="rounded-full bg-black px-6 py-2 text-sm font-bold text-white hover:opacity-90 dark:bg-white dark:text-black"
                >
                    Add New Address
                </Link>
            </header>

            {addresses.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2">
                    {addresses.map((address) => (
                        <AddressCard key={address.addressId} address={address} />
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-neutral-200 p-12 text-center dark:border-neutral-800">
                    <p className="text-neutral-500">No addresses saved yet.</p>
                </div>
            )}
        </div>
    );
}
