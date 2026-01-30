import { getWalletDetails } from 'lib/backend';
import Link from 'next/link';

export default async function WalletPage() {
    const wallet = await getWalletDetails();

    return (
        <div className="mx-auto max-w-4xl space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
                    <p className="text-neutral-500">View your balance and transaction history.</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-semibold uppercase tracking-wider text-neutral-400">Available Balance</p>
                    <p className="text-4xl font-black text-blue-600">₹{wallet.balance.toFixed(2)}</p>
                </div>
            </header>

            <section className="rounded-2xl border border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <div className="border-b border-neutral-100 p-6 dark:border-neutral-800">
                    <h2 className="text-lg font-bold">Transaction History</h2>
                </div>

                {wallet.transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="mb-4 text-4xl">💸</div>
                        <p className="text-neutral-500">No transactions yet. Start shopping to see your wallet in action!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="bg-neutral-50 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:bg-neutral-950">
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Description</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {wallet.transactions.map((tx: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-950/50">
                                        <td className="px-6 py-4 whitespace-nowrap text-neutral-500">
                                            {new Date(tx.createdAt || Date.now()).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            {tx.description || 'Order Payment'}
                                        </td>
                                        <td className={`px-6 py-4 font-bold ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                                            {tx.type === 'CREDIT' ? '+' : '-'} ₹{tx.amount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                                Completed
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <div className="flex justify-center">
                <Link href="/account" className="text-sm font-medium text-blue-600 hover:underline">
                    ← Back to Account Dashboard
                </Link>
            </div>
        </div>
    );
}
