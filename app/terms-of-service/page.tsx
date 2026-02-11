import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service | Vaabhi',
    description: 'Terms and conditions for using Vaabhi storefront.'
};

export default function TermsOfService() {
    return (
        <div className="mx-auto max-w-3xl px-6 py-20">
            <h1 className="mb-8 text-4xl font-bold">Terms of Service</h1>
            <div className="prose prose-neutral dark:prose-invert">
                <p>Last updated: February 03, 2026</p>
                <p>
                    By accessing or using the Vaabhi storefront, you agree to be bound by these terms.
                </p>

                <h2 className="mt-8 text-2xl font-semibold">1. Account Terms</h2>
                <p>
                    You are responsible for maintaining the security of your account and password. Vaabhi cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.
                </p>

                <h2 className="mt-8 text-2xl font-semibold">2. Payments and Refunds</h2>
                <p>
                    Payments are processed through Razorpay. All sales are subject to our return policy. Return requests can be initiated through your account dashboard.
                </p>

                <h2 className="mt-8 text-2xl font-semibold">3. AI-Generated Content</h2>
                <p>
                    The AI Stylist and Virtual Try-On features provide simulations. Final physical products may have slight variations from AI-generated previews. You retain ownership of prompts, but we retain ownership of the underlying AI models.
                </p>

                <h2 className="mt-8 text-2xl font-semibold">4. Limitation of Liability</h2>
                <p>
                    Vaabhi shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the service.
                </p>
            </div>
        </div>
    );
}
