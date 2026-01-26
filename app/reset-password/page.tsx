'use client';

import { resetPassword } from 'lib/backend';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { toast } from 'sonner';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast.error('Invalid or missing reset token');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await resetPassword(token, password);
            toast.success('Password reset successfully!');
            router.push('/login');
        } catch (err: any) {
            toast.error(err.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="text-center">
                <p className="text-red-500">Invalid reset link. Please request a new one.</p>
                <div className="mt-4">
                    <a href="/forgot-password" className="text-sm font-bold hover:underline">Request new link</a>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-500">New Password</label>
                    <input
                        required
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 w-full rounded-md border border-neutral-200 bg-transparent p-3 text-sm focus:border-black focus:ring-0 dark:border-neutral-800 dark:focus:border-white"
                        minLength={8}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-neutral-500">Confirm New Password</label>
                    <input
                        required
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1 w-full rounded-md border border-neutral-200 bg-transparent p-3 text-sm focus:border-black focus:ring-0 dark:border-neutral-800 dark:focus:border-white"
                        minLength={8}
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-full bg-black py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-black"
            >
                {loading ? 'Resetting...' : 'Reset Password'}
            </button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12">
            <div className="w-full max-w-md space-y-8 rounded-2xl border border-neutral-200 bg-white/80 p-10 shadow-xl backdrop-blur-xl dark:border-neutral-800 dark:bg-black/80">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight">Reset Password</h2>
                    <p className="mt-2 text-sm text-neutral-500">Enter your new password below.</p>
                </div>

                <Suspense fallback={<div className="text-center">Loading...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
