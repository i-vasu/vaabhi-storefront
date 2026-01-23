'use server';

import { login, register } from 'lib/vasu';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
        const response = await login({ email, password });

        // Response should be { "jwt-token": "...", "refresh-token": "..." }
        const token = response['jwt-token'];
        const refreshToken = response['refresh-token'];

        if (token) {
            const cookieStore = await cookies();
            cookieStore.set('token', token, { httpOnly: true, path: '/' });
            if (refreshToken) {
                cookieStore.set('refreshToken', refreshToken, { httpOnly: true, path: '/' });
            }
        } else {
            return 'Login failed: No token received';
        }
    } catch (error) {
        return 'Invalid credentials';
    }

    redirect('/');
}

export async function registerAction(prevState: any, formData: FormData) {
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const mobileNumber = formData.get('mobileNumber') as string;

    try {
        const user = {
            firstName,
            lastName,
            email,
            password,
            mobileNumber,
            // Default stub data required by backend DTO if strict, otherwise backend defaults apply
            role: { roleId: 2, roleName: 'USER' } // Assuming this might be needed or backend handles it
        };

        const response = await register(user);
        // Response { "jwt-token": "..." }
        const token = response['jwt-token'];

        if (token) {
            const cookieStore = await cookies();
            cookieStore.set('token', token, { httpOnly: true, path: '/' });
        } else {
            return 'Registration failed';
        }

    } catch (error) {
        return 'Registration failed';
    }

    redirect('/');
}
