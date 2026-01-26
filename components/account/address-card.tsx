import { AddressDTO } from 'lib/backend';

export function AddressCard({ address }: { address: AddressDTO }) {
    return (
        <div className="rounded-xl border border-neutral-200 p-6 transition-colors hover:border-black dark:border-neutral-800 dark:hover:border-white">
            <div className="flex items-start justify-between">
                <div>
                    <p className="font-bold">{address.building}</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{address.street}</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {address.city}, {address.state} {address.pincode}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{address.country}</p>
                </div>
                {/* Actions could go here */}
            </div>
        </div>
    );
}
