'use client';

import { forgotPassword } from 'lib/backend';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await forgotPassword(email);
            setSubmitted(true);
            toast.success('Reset link sent to your email!');
        } catch (err: any) {
            toast.error(err.message || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12">
            <div className="w-full max-w-md space-y-8 rounded-2xl border border-neutral-200 bg-white/80 p-10 shadow-xl backdrop-blur-xl dark:border-neutral-800 dark:bg-black/80">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight">Forgot Password</h2>
                    <p className="mt-2 text-sm text-neutral-500">
                        Enter your email and we'll send you a link to reset your password.
                    </p>
                </div>

                {!submitted ? (
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-neutral-500">Email address</label>
                            <input
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 w-full rounded-md border border-neutral-200 bg-transparent p-3 text-sm focus:border-black focus:ring-0 dark:border-neutral-800 dark:focus:border-white"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full justify-center rounded-full bg-black py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-black"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                ) : (
                    <div className="mt-8 text-center">
                        <div className="mb-4 rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900/20 dark:text-green-400 mx-auto w-fit">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            If an account exists for {email}, you will receive a password reset link shortly.
                        </p>
                    </div>
                )}

                <div className="text-center text-sm">
                    <Link href="/login" className="font-bold text-black hover:underline dark:text-white">
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
}
