'use server';

import { getCurrentUser } from 'lib/auth-utils';
import { addFriend, createTicket, submitReturnRequest, transferRewards } from 'lib/backend';
import { revalidatePath } from 'next/cache';

export async function handleAddFriend(formData: FormData) {
    const friendEmail = formData.get('email') as string;
    const user = await getCurrentUser();
    const userId = user?.userId || 1;

    if (!friendEmail) return { error: 'Email is required' };

    try {
        await addFriend(userId, friendEmail);
        revalidatePath('/account/friends');
        return { success: true };
    } catch (e) {
        return { error: 'Failed to add friend' };
    }
}

export async function handleTransferPoints(formData: FormData) {
    const email = formData.get('email') as string;
    const points = Number(formData.get('points'));
    const user = await getCurrentUser();
    const userId = user?.userId || 1;

    try {
        await transferRewards(userId, email, points);
        revalidatePath('/account/rewards');
        return { success: true };
    } catch (e) {
        return { error: 'Transfer failed' };
    }
}

export async function handleCreateTicket(formData: FormData) {
    const subject = formData.get('subject') as string;
    const description = formData.get('description') as string;
    const user = await getCurrentUser();
    const email = user?.email || 'customer@example.com';

    try {
        await createTicket({ subject, description, userEmail: email });
        revalidatePath('/account/support');
        return { success: true };
    } catch (e) {
        return { error: 'Failed to open ticket' };
    }
}

export async function handleReturnRequest(orderId: number, formData: FormData) {
    const reason = formData.get('reason') as string;
    const refundType = formData.get('refundType') as string;

    // In a real app, we'd collect item counts from the form
    const items = {};

    try {
        await submitReturnRequest(orderId, { items, reason, refundType });
        revalidatePath(`/account/orders/${orderId}`);
        return { success: true };
    } catch (e) {
        return { error: 'Failed to submit return' };
    }
}
