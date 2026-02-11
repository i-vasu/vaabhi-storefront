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
            login(res['jwt-token'], res['refresh-token'], res.user);
            toast.success('Welcome back to Vaabhi!');
            router.push('/account');
        } catch (err: any) {
            toast.error(err.message || 'Authentication failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
            {/* Animated Background Orbs */}
            <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-blue-100/50 blur-[120px] dark:bg-blue-900/20" />
            <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-purple-100/50 blur-[120px] dark:bg-purple-900/20" />

            <div className="relative w-full max-w-md">
                <div className="space-y-8 rounded-[2.5rem] border border-white/20 bg-white/40 p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] backdrop-blur-3xl dark:border-white/10 dark:bg-neutral-950/40">
                    <div className="text-center">
                        <h1 className="text-4xl font-black tracking-tight text-black dark:text-white uppercase transition-all">
                            Vaabhi
                        </h1>
                        <p className="mt-3 text-sm font-medium tracking-wide text-neutral-500 uppercase">
                            The Luxury Portfolio
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-10 space-y-6">
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">
                                    Email Address
                                </label>
                                <input
                                    required
                                    type="email"
                                    placeholder="email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-2xl border border-neutral-200 bg-white/50 p-4 text-sm outline-none transition-all focus:border-black focus:ring-4 focus:ring-black/5 dark:border-neutral-800 dark:bg-black/50 dark:focus:border-white dark:focus:ring-white/5"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                                        Password
                                    </label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                                    >
                                        Forgot?
                                    </Link>
                                </div>
                                <input
                                    required
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-2xl border border-neutral-200 bg-white/50 p-4 text-sm outline-none transition-all focus:border-black focus:ring-4 focus:ring-black/5 dark:border-neutral-800 dark:bg-black/50 dark:focus:border-white dark:focus:ring-white/5"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full items-center justify-center overflow-hidden rounded-full bg-black py-4 text-xs font-black uppercase tracking-[0.3em] text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 dark:bg-white dark:text-black"
                        >
                            <span className="relative z-10">{loading ? 'Verifying...' : 'Sign In'}</span>
                            <div className="absolute inset-0 translate-y-full bg-neutral-800 transition-transform group-hover:translate-y-0 dark:bg-neutral-200" />
                        </button>
                    </form>

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-neutral-200 dark:border-neutral-800" />
                        </div>
                        <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                            <span className="bg-transparent px-2 text-neutral-400">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center rounded-2xl border border-neutral-200 bg-white p-3 text-xs font-bold transition-all hover:bg-neutral-50 dark:border-neutral-800 dark:bg-black dark:hover:bg-neutral-900">
                            Google
                        </button>
                        <button className="flex items-center justify-center rounded-2xl border border-neutral-200 bg-white p-3 text-xs font-bold transition-all hover:bg-neutral-50 dark:border-neutral-800 dark:bg-black dark:hover:bg-neutral-900">
                            Apple
                        </button>
                    </div>

                    <div className="pt-4 text-center">
                        <p className="text-xs font-medium text-neutral-500">
                            New to Vaabhi?{' '}
                            <Link href="/register" className="font-black uppercase tracking-widest text-black hover:underline dark:text-white">
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
