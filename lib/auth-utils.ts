import { cookies } from 'next/headers';

export interface UserSession {
    email: string;
    userId?: number;
}

export async function getCurrentUser(): Promise<UserSession | null> {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('vaabhi_user')?.value;

    if (!userCookie) return null;

    try {
        return JSON.parse(decodeURIComponent(userCookie));
    } catch (e) {
        return null;
    }
}

export async function getSessionEmail(): Promise<string> {
    const user = await getCurrentUser();
    return user?.email || 'customer@example.com'; // Default fallback for development
}
