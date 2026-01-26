const requiredEnvVars = [
    'NEXT_PUBLIC_API_URL',
    'RAZORPAY_KEY_ID'
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
