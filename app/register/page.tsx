'use client';

import { useAuth } from 'components/auth-context';
import { registerUser } from 'lib/backend';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        mobileNumber: ''
    });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await registerUser(formData);
            if (res['jwt-token']) {
                login(res['jwt-token'], res['refresh-token'] || '', { email: formData.email });
                toast.success('Account created successfully! Welcome to Vaabhi.');
                router.push('/account');
            } else {
                toast.success('Registration successful! Please sign in.');
                router.push('/login');
            }
        } catch (err: any) {
            toast.error(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-20">
            {/* Animated Background Orbs */}
            <div className="absolute -top-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-blue-100/50 blur-[120px] dark:bg-blue-900/20" />
            <div className="absolute -bottom-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-purple-100/50 blur-[120px] dark:bg-purple-900/20" />

            <div className="relative w-full max-w-lg">
                <div className="space-y-8 rounded-[2.5rem] border border-white/20 bg-white/40 p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] backdrop-blur-3xl dark:border-white/10 dark:bg-neutral-950/40">
                    <div className="text-center">
                        <h1 className="text-4xl font-black tracking-tight text-black dark:text-white uppercase">
                            Join Vaabhi
                        </h1>
                        <p className="mt-3 text-sm font-medium tracking-wide text-neutral-500 uppercase">
                            Experience Unrivaled Luxury
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-10 space-y-6">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label htmlFor="firstName" className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">
                                    First Name
                                </label>
                                <input
                                    required
                                    id="firstName"
                                    name="firstName"
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-neutral-200 bg-white/50 p-4 text-sm outline-none transition-all focus:border-black focus:ring-4 focus:ring-black/5 dark:border-neutral-800 dark:bg-black/50 dark:focus:border-white dark:focus:ring-white/5"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="lastName" className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">
                                    Last Name
                                </label>
                                <input
                                    required
                                    id="lastName"
                                    name="lastName"
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-neutral-200 bg-white/50 p-4 text-sm outline-none transition-all focus:border-black focus:ring-4 focus:ring-black/5 dark:border-neutral-800 dark:bg-black/50 dark:focus:border-white dark:focus:ring-white/5"
                                />
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">
                                    Email Address
                                </label>
                                <input
                                    required
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="email@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-neutral-200 bg-white/50 p-4 text-sm outline-none transition-all focus:border-black focus:ring-4 focus:ring-black/5 dark:border-neutral-800 dark:bg-black/50 dark:focus:border-white dark:focus:ring-white/5"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="mobileNumber" className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">
                                    Mobile Number
                                </label>
                                <input
                                    required
                                    id="mobileNumber"
                                    name="mobileNumber"
                                    placeholder="+91 999 999 9999"
                                    value={formData.mobileNumber}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-neutral-200 bg-white/50 p-4 text-sm outline-none transition-all focus:border-black focus:ring-4 focus:ring-black/5 dark:border-neutral-800 dark:bg-black/50 dark:focus:border-white dark:focus:ring-white/5"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">
                                    Choose Password
                                </label>
                                <input
                                    required
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-neutral-200 bg-white/50 p-4 text-sm outline-none transition-all focus:border-black focus:ring-4 focus:ring-black/5 dark:border-neutral-800 dark:bg-black/50 dark:focus:border-white dark:focus:ring-white/5"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative mt-4 flex w-full items-center justify-center overflow-hidden rounded-full bg-black py-4 text-xs font-black uppercase tracking-[0.3em] text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 dark:bg-white dark:text-black"
                        >
                            <span className="relative z-10">{loading ? 'Creating Portfolio...' : 'Register'}</span>
                            <div className="absolute inset-0 translate-y-full bg-neutral-800 transition-transform group-hover:translate-y-0 dark:bg-neutral-200" />
                        </button>
                    </form>

                    <div className="pt-4 text-center">
                        <p className="text-xs font-medium text-neutral-500">
                            Already a member?{' '}
                            <Link href="/login" className="font-black uppercase tracking-widest text-black hover:underline dark:text-white">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
