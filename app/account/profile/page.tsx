import ProfileForm from 'components/account/profile-form';
import { getUserProfile } from 'lib/backend';
import Link from 'next/link';

export default async function ProfilePage() {
    const profile = await getUserProfile();

    return (
        <div className="mx-auto max-w-4xl space-y-10">
            <header>
                <Link href="/account" className="text-sm font-medium text-neutral-500 hover:underline">← Back to Dashboard</Link>
                <h1 className="mt-2 text-4xl font-black tracking-tight uppercase">Profile Details</h1>
                <p className="mt-2 text-sm text-neutral-500 uppercase tracking-widest font-medium">Identity & Preferences</p>
            </header>

            <section className="grid gap-8 md:grid-cols-2">
                <ProfileForm profile={profile} />

                <div className="rounded-2xl border border-neutral-100 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900">
                    <h2 className="mb-6 text-lg font-bold">Preferences</h2>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Marketing Emails</p>
                            <p className="mt-1 text-sm font-medium">Subscribed (Elite member benefit)</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Style Profile</p>
                            <p className="mt-1 text-sm font-medium">Minimalist, Premium Cotton Enthusiast</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
