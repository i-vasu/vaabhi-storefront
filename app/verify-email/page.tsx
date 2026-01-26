'use client';

import { verifyEmail } from 'lib/backend';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const code = searchParams.get('code');

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!email || !code) {
            setStatus('error');
            setMessage('Missing email or verification code.');
            return;
        }

        const verify = async () => {
            try {
                await verifyEmail(email, code);
                setStatus('success');
                setMessage('Your email has been verified successfully!');
            } catch (err: any) {
                setStatus('error');
                setMessage(err.message || 'Verification failed. The link may be expired.');
            }
        };

        verify();
    }, [email, code]);

    return (
        <div className="text-center">
            {status === 'loading' && (
                <div className="space-y-4">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                    <p className="text-neutral-500">Verifying your email...</p>
                </div>
            )}

            {status === 'success' && (
                <div className="space-y-6">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl dark:bg-green-900/20">
                        ✅
                    </div>
                    <h2 className="text-2xl font-bold">Success!</h2>
                    <p className="text-neutral-500">{message}</p>
                    <Link
                        href="/login"
                        className="inline-block rounded-full bg-black px-8 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-black"
                    >
                        Sign In
                    </Link>
                </div>
            )}

            {status === 'error' && (
                <div className="space-y-6">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl dark:bg-red-900/20">
                        ❌
                    </div>
                    <h2 className="text-2xl font-bold">Verification Failed</h2>
                    <p className="text-neutral-500">{message}</p>
                    <Link
                        href="/contact"
                        className="inline-block rounded-full border border-neutral-200 px-8 py-3 text-sm font-bold hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
                    >
                        Contact Support
                    </Link>
                </div>
            )}
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12">
            <div className="w-full max-w-md space-y-8 rounded-3xl border border-neutral-200 bg-white/80 p-10 shadow-xl backdrop-blur-xl dark:border-neutral-800 dark:bg-black/80">
                <Suspense fallback={<div>Loading...</div>}>
                    <VerifyEmailContent />
                </Suspense>
            </div>
        </div>
    );
}
