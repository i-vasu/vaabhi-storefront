'use client';

import { AddressDTO } from 'lib/backend';
import { useState } from 'react';
import { toast } from 'sonner';
import { handleDeleteAddress } from '../../app/account/actions';

export function AddressCard({ address }: { address: AddressDTO }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const onDelete = async () => {
        if (!confirm('Are you sure you want to delete this address?')) return;
        setIsDeleting(true);
        try {
            const res = await handleDeleteAddress(address.addressId);
            if (res.success) {
                toast.success('Address deleted');
            } else {
                toast.error(res.error || 'Failed to delete');
            }
        } catch (e) {
            toast.error('An error occurred');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="rounded-xl border border-neutral-200 p-6 transition-colors hover:border-black dark:border-neutral-800 dark:hover:border-white group">
            <div className="flex items-start justify-between">
                <div>
                    <p className="font-bold">{address.building}</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{address.street}</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {address.city}, {address.state} {address.pincode}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{address.country}</p>
                </div>
                <button
                    onClick={onDelete}
                    disabled={isDeleting}
                    className="opacity-0 group-hover:opacity-100 p-2 text-neutral-400 hover:text-red-600 transition-all disabled:opacity-50"
                    title="Delete Address"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>
    );
}
