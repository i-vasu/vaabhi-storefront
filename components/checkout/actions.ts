'use server';

import { placeOrder } from 'lib/backend';

export async function createOrderAction(formData: FormData, cartId: number, paymentMethod: string = 'RAZORPAY') {
    const email = formData.get('email') as string;
    const request = {
        addressId: formData.get('addressId') ? Number(formData.get('addressId')) : undefined,
        couponCode: formData.get('couponCode') as string,
        street: formData.get('address') as string,
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        pincode: formData.get('pincode') as string,
        receiverPhoneNumber: formData.get('phone') as string,
        country: 'India',
        isGift: formData.get('isGift') === 'on',
        giftMessage: formData.get('giftMessage') as string,
        deliverySlot: formData.get('deliverySlot') as string
    };

    try {
        const orderRes = await placeOrder(email, cartId, paymentMethod, request);
        return { success: true, order: orderRes.data };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
