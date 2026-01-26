
import { cookies } from 'next/headers';

export default async function ContactPage() {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('vaabhi_user')?.value;
    const user = userCookie ? JSON.parse(userCookie) : null;
    const email = user?.email || '';

    return (
        <div className="mx-auto max-w-4xl px-6 py-20">
            <div className="grid gap-16 md:grid-cols-2">
                <div>
                    <h1 className="mb-6 text-4xl font-bold tracking-tight">How can we help?</h1>
                    <p className="mb-8 text-lg text-neutral-600 dark:text-neutral-400">
                        Whether you have a question about artisanal fabrics, your order status, or our AI Stylist, our team is here to assist you.
                    </p>

                    <div className="space-y-8">
                        <div>
                            <h3 className="mb-2 font-bold uppercase tracking-widest text-neutral-500 text-xs">Email Us</h3>
                            <p className="text-xl font-medium">support@vaabhi.com</p>
                        </div>
                        <div>
                            <h3 className="mb-2 font-bold uppercase tracking-widest text-neutral-500 text-xs">Call Us</h3>
                            <p className="text-xl font-medium">+91 98765 43210</p>
                        </div>
                        <div>
                            <h3 className="mb-2 font-bold uppercase tracking-widest text-neutral-500 text-xs">Our Studio</h3>
                            <p className="text-neutral-600 dark:text-neutral-400">
                                4th Floor, Design Hub<br />
                                Bandra West, Mumbai 400050<br />
                                India
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-neutral-100 bg-white p-8 dark:border-neutral-800 dark:bg-black shadow-xl">
                    <h2 className="mb-6 text-2xl font-bold">Send a Message</h2>
                    <form className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-neutral-500">Email Address</label>
                            <input
                                required
                                type="email"
                                defaultValue={email}
                                placeholder="you@example.com"
                                className="w-full rounded-lg border border-neutral-200 p-3 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-neutral-500">Subject</label>
                            <select className="w-full rounded-lg border border-neutral-200 p-3 text-sm dark:border-neutral-700 dark:bg-neutral-900">
                                <option>Order Inquiry</option>
                                <option>Product Question</option>
                                <option>AI Stylist Feedback</option>
                                <option>Returns & Refunds</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-neutral-500">Message</label>
                            <textarea
                                required
                                rows={5}
                                placeholder="How can we help you today?"
                                className="w-full rounded-lg border border-neutral-200 p-3 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                            />
                        </div>
                        <button className="w-full rounded-full bg-blue-600 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90">
                            Submit Ticket
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
