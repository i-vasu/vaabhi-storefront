'use client';

import { createAddress } from 'lib/backend';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function NewAddressPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        building: '',
        street: '',
        city: '',
        state: '',
        country: 'India',
        pincode: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createAddress(formValues);
            toast.success('Address added successfully');
            router.push('/account/addresses');
            router.refresh();
        } catch (err: any) {
            toast.error(err.message || 'Failed to add address');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl space-y-8">
            <header>
                <Link href="/account/addresses" className="text-sm font-medium text-neutral-500 hover:underline">← Back to Addresses</Link>
                <h1 className="mt-2 text-3xl font-bold tracking-tight">Add New Address</h1>
                <p className="text-neutral-500">Enter your shipping details below.</p>
            </header>

            <form onSubmit={handleSubmit} className="rounded-2xl border border-neutral-100 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500">Building / Flat No.</label>
                        <input
                            required
                            name="building"
                            value={formValues.building}
                            onChange={handleInputChange}
                            className="mt-1 w-full rounded-md border border-neutral-200 p-3 text-sm dark:border-neutral-800 dark:bg-black"
                            placeholder="e.g. Flat 402, Crystal Tower"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500">Street / Locality</label>
                        <input
                            required
                            name="street"
                            value={formValues.street}
                            onChange={handleInputChange}
                            className="mt-1 w-full rounded-md border border-neutral-200 p-3 text-sm dark:border-neutral-800 dark:bg-black"
                            placeholder="e.g. MG Road, Near Central Park"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500">City</label>
                        <input
                            required
                            name="city"
                            value={formValues.city}
                            onChange={handleInputChange}
                            className="mt-1 w-full rounded-md border border-neutral-200 p-3 text-sm dark:border-neutral-800 dark:bg-black"
                            placeholder="Mumbai"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500">State</label>
                        <input
                            required
                            name="state"
                            value={formValues.state}
                            onChange={handleInputChange}
                            className="mt-1 w-full rounded-md border border-neutral-200 p-3 text-sm dark:border-neutral-800 dark:bg-black"
                            placeholder="Maharashtra"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500">Pincode</label>
                        <input
                            required
                            name="pincode"
                            value={formValues.pincode}
                            onChange={handleInputChange}
                            className="mt-1 w-full rounded-md border border-neutral-200 p-3 text-sm dark:border-neutral-800 dark:bg-black"
                            placeholder="400001"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500">Country</label>
                        <input
                            required
                            name="country"
                            value={formValues.country}
                            onChange={handleInputChange}
                            className="mt-1 w-full rounded-md border border-neutral-200 p-3 text-sm dark:border-neutral-800 dark:bg-black"
                            placeholder="India"
                        />
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 rounded-full bg-black py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-black"
                    >
                        {loading ? 'Adding...' : 'Save Address'}
                    </button>
                </div>
            </form>
        </div>
    );
}
