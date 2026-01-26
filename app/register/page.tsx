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
            // Backend automatically logs in after registration or provides token
            if (res['jwt-token']) {
                login(res['jwt-token'], res['refresh-token'] || '', { email: formData.email });
                toast.success('Account created successfully!');
                router.push('/account');
            } else {
                toast.success('Registration successful! Please login.');
                router.push('/login');
            }
        } catch (err: any) {
            toast.error(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12">
            <div className="w-full max-w-md space-y-8 rounded-2xl border border-neutral-200 bg-white/80 p-10 shadow-xl backdrop-blur-xl dark:border-neutral-800 dark:bg-black/80">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight">Create Account</h2>
                    <p className="mt-2 text-sm text-neutral-500">Join the Vaabhi community</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-500">First Name</label>
                                <input
                                    required
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-md border border-neutral-200 bg-transparent p-3 text-sm focus:border-black focus:ring-0 dark:border-neutral-800 dark:focus:border-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-500">Last Name</label>
                                <input
                                    required
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-md border border-neutral-200 bg-transparent p-3 text-sm focus:border-black focus:ring-0 dark:border-neutral-800 dark:focus:border-white"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-500">Email address</label>
                            <input
                                required
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md border border-neutral-200 bg-transparent p-3 text-sm focus:border-black focus:ring-0 dark:border-neutral-800 dark:focus:border-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-500">Mobile Number</label>
                            <input
                                required
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md border border-neutral-200 bg-transparent p-3 text-sm focus:border-black focus:ring-0 dark:border-neutral-800 dark:focus:border-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-500">Password</label>
                            <input
                                required
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-md border border-neutral-200 bg-transparent p-3 text-sm focus:border-black focus:ring-0 dark:border-neutral-800 dark:focus:border-white"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center rounded-full bg-black py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-black"
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <div className="text-center text-sm">
                    <p className="text-neutral-500">
                        Already have an account?{' '}
                        <Link href="/login" className="font-bold text-black hover:underline dark:text-white">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
