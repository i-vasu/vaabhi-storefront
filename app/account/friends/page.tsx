import { getCurrentUser } from 'lib/auth-utils';
import { getFriends } from 'lib/backend';
import Link from 'next/link';
import { handleAddFriend } from '../actions';

export default async function FriendsPage() {
    const user = await getCurrentUser();
    const userId = user?.userId || 1;
    const friends = await getFriends(userId);

    return (
        <div className="mx-auto max-w-4xl space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Friends & Connection</h1>
                    <p className="text-neutral-500">Share the Vaabhi experience with your circle.</p>
                </div>
            </header>

            <section className="grid gap-8 md:grid-cols-2">
                {/* Friend List */}
                <div className="rounded-2xl border border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="border-b border-neutral-100 p-6 dark:border-neutral-800">
                        <h2 className="text-lg font-bold">Your Circle</h2>
                    </div>
                    <div className="p-6">
                        {friends.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center text-neutral-500">
                                <div className="mb-2 text-2xl">🤝</div>
                                <p className="text-sm">No friends added yet. Start connecting!</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {friends.map((friend: any) => (
                                    <li key={friend.userId || friend.id} className="flex items-center justify-between py-4">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-black dark:bg-indigo-900/30">
                                                {(friend.firstName?.[0] || friend.email[0]).toUpperCase()}
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-bold">{friend.firstName || 'Fashionista'}</p>
                                                <p className="text-xs text-neutral-500">{friend.email}</p>
                                            </div>
                                        </div>
                                        <button className="text-xs font-bold text-red-600 hover:underline">Remove</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Add Friend Form */}
                <div className="rounded-2xl border border-neutral-100 bg-neutral-900 p-8 text-white">
                    <h2 className="text-xl font-bold">Invite Someone</h2>
                    <p className="mt-2 text-sm text-neutral-400">Add a friend to your circle and unlock curated social features.</p>

                    <form action={handleAddFriend} className="mt-8 space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500">Friend's Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="style-icon@example.com"
                                className="mt-2 w-full rounded-2xl border border-neutral-800 bg-black px-6 py-4 text-sm focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full rounded-full bg-white py-4 text-sm font-black uppercase tracking-[0.2em] text-black hover:bg-neutral-200">
                            Send Connection
                        </button>
                    </form>
                </div>
            </section>

            <div className="flex justify-center pt-6">
                <Link href="/account" className="text-sm font-medium text-blue-600 hover:underline">
                    ← Back to Account Dashboard
                </Link>
            </div>
        </div>
    );
}
