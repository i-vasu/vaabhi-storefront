const requiredEnvVars = [
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_RAZORPAY_KEY',
    'RAZORPAY_KEY_SECRET',
    'NEXT_PUBLIC_SITE_NAME'
];

export function validateEnv() {
    const missing = requiredEnvVars.filter((v) => !process.env[v]);
    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missing.join(', ')}. ` +
            `Check your .env file or production environment.`
        );
    }
}
