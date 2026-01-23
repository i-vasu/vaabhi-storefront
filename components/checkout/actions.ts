'use server';

import { submitCheckout } from 'lib/vasu';
import { redirect } from 'next/navigation';

export async function performCheckout(prevState: any, formData: FormData) {
    const email = formData.get('email');
    const address = formData.get('address');
    const city = formData.get('city');
    const zip = formData.get('zip');
    const card = formData.get('card');

    if (!email || !address || !card) {
        return 'All fields required';
    }

    try {
        await submitCheckout({
            email,
            shippingAddress: {
                address1: address,
                city: city,
                zip: zip,
                country: 'US'
            },
            payment: {
                method: 'CREDIT_CARD',
                cardNumber: card
            }
        });
    } catch (e) {
        return 'Detailed Error: ' + (e instanceof Error ? e.message : 'Unknown');
    }

    // Redirect to success page or clear cart
    redirect('/checkout/success');
}
