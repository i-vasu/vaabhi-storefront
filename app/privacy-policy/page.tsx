import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | Vaabhi',
    description: 'How we handle your data at Vaabhi.'
};

export default function PrivacyPolicy() {
    return (
        <div className="mx-auto max-w-3xl px-6 py-20">
            <h1 className="mb-8 text-4xl font-bold">Privacy Policy</h1>
            <div className="prose prose-neutral dark:prose-invert">
                <p>Last updated: February 03, 2026</p>
                <p>
                    At Vaabhi, we value your privacy. This policy explains how we collect, use, and protect your information when you use our storefront.
                </p>

                <h2 className="mt-8 text-2xl font-semibold">1. Information We Collect</h2>
                <p>
                    We collect information you provide directly to us, such as when you create an account, make a purchase, or contact support. This includes your name, email, address, and payment information (processed securely through Razorpay).
                </p>

                <h2 className="mt-8 text-2xl font-semibold">2. How We Use Information</h2>
                <p>
                    We use your information to process orders, provide AI-stylist designs, and improve our services. Your data helps us personalize your shopping experience.
                </p>

                <h2 className="mt-8 text-2xl font-semibold">3. Data Security</h2>
                <p>
                    We implement industry-standard security measures to protect your data. We do not sell your personal information to third parties.
                </p>

                <h2 className="mt-8 text-2xl font-semibold">4. AI Features</h2>
                <p>
                    Our AI features (Stylist and Virtual Try-On) process images and prompts you provide. These images are used solely for generating your results and are not stored permanently unless you save them to your account.
                </p>
            </div>
        </div>
    );
}
