import { getCurrentUser } from 'lib/auth-utils';
import { getUserProfile } from 'lib/backend';
import Link from 'next/link';

export default async function ProfilePage() {
    const user = await getCurrentUser();
    const email = user?.email || 'customer@example.com';
    const profile = await getUserProfile(email);

    return (
        <div className="mx-auto max-w-4xl space-y-10">
            <header>
                <Link href="/account" className="text-sm font-medium text-neutral-500 hover:underline">← Back to Dashboard</Link>
                <h1 className="mt-2 text-3xl font-bold tracking-tight">Personal Details</h1>
                <p className="text-neutral-500">Manage your profile information and account security.</p>
            </header>

            <section className="grid gap-8 md:grid-cols-2">
                <div className="rounded-2xl border border-neutral-100 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900">
                    <h2 className="mb-6 text-lg font-bold">Identity</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500">Full Name</label>
                            <p className="mt-1 font-medium">{profile?.firstName || 'Fashionista'} {profile?.lastName || ''}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500">Email Address</label>
                            <p className="mt-1 font-medium">{profile?.email || email}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500">Phone</label>
                            <p className="mt-1 font-medium text-neutral-400">{profile?.mobileNumber || 'Not provided'}</p>
                        </div>
                    </div>
                    <button className="mt-8 rounded-full border border-neutral-200 px-6 py-2 text-sm font-bold hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800">
                        Edit Profile
                    </button>
                </div>

                <div className="rounded-2xl border border-neutral-100 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900">
                    <h2 className="mb-6 text-lg font-bold">Preferences</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500">Marketing Emails</label>
                            <p className="mt-1 text-sm">Subscribed (Elite member benefit)</p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500">Style Profile</label>
                            <p className="mt-1 text-sm">Minimalist, Premium Cotton Enthusiast</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
