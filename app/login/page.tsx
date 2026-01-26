'use client';

import { useAuth } from 'components/auth-context';
import { loginUser } from 'lib/backend';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await loginUser({ email, password });
            login(res['jwt-token'], res['refresh-token'], { email });
            toast.success('Welcome back!');
            router.push('/account');
        } catch (err: any) {
            toast.error(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12">
            <div className="w-full max-w-md space-y-8 rounded-2xl border border-neutral-200 bg-white/80 p-10 shadow-xl backdrop-blur-xl dark:border-neutral-800 dark:bg-black/80">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight">Welcome Back</h2>
                    <p className="mt-2 text-sm text-neutral-500">Sign in to your Vaabhi account</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
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
                        <div>
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-neutral-500">Password</label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs text-neutral-400 hover:text-black hover:underline dark:hover:text-white"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <input
                                required
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 w-full rounded-md border border-neutral-200 bg-transparent p-3 text-sm focus:border-black focus:ring-0 dark:border-neutral-800 dark:focus:border-white"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center rounded-full bg-black py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-black"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="text-center text-sm">
                    <p className="text-neutral-500">
                        Don't have an account?{' '}
                        <Link href="/register" className="font-bold text-black hover:underline dark:text-white">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
