'use client';

import { updateUserProfile } from 'lib/backend';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ProfileForm({ profile }: { profile: any }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: profile?.firstName || '',
        lastName: profile?.lastName || '',
        mobileNumber: profile?.mobileNumber || '',
    });
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await updateUserProfile(profile.userId, formData);
            toast.success('Profile updated successfully');
            setIsEditing(false);
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isEditing) {
        return (
            <div className="rounded-2xl border border-neutral-100 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900">
                <h2 className="mb-6 text-lg font-bold">Identity</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500">Full Name</label>
                        <p className="mt-1 font-medium">{profile?.firstName || 'Fashionista'} {profile?.lastName || ''}</p>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500">Email Address</label>
                        <p className="mt-1 font-medium">{profile?.email || 'customer@example.com'}</p>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500">Phone</label>
                        <p className="mt-1 font-medium text-neutral-400">{profile?.mobileNumber || 'Not provided'}</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsEditing(true)}
                    className="mt-8 rounded-full border border-neutral-200 px-8 py-2 text-sm font-bold hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800"
                >
                    Edit Profile
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-neutral-100 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="mb-6 text-lg font-bold">Edit Profile</h2>
            <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500">First Name</label>
                        <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className="mt-1 w-full rounded-xl border border-neutral-200 p-2 text-sm dark:border-neutral-800 dark:bg-black"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500">Last Name</label>
                        <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className="mt-1 w-full rounded-xl border border-neutral-200 p-2 text-sm dark:border-neutral-800 dark:bg-black"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500">Phone Number</label>
                    <input
                        type="text"
                        value={formData.mobileNumber}
                        onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-neutral-200 p-2 text-sm dark:border-neutral-800 dark:bg-black"
                    />
                </div>
            </div>
            <div className="mt-8 flex gap-4">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-full bg-black px-8 py-2 text-sm font-bold text-white hover:opacity-90 dark:bg-white dark:text-black"
                >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="rounded-full border border-neutral-200 px-8 py-2 text-sm font-bold hover:bg-neutral-50 dark:border-neutral-800"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
