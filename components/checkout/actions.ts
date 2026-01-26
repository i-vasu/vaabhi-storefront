'use server';

import { placeOrder } from 'lib/backend';

export async function createOrderAction(formData: FormData, cartId: number, paymentMethod: string = 'RAZORPAY') {
    const email = formData.get('email') as string;

    try {
        const orderRes = await placeOrder(email, cartId, paymentMethod);
        return { success: true, order: orderRes.data };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
