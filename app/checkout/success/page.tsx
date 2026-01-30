
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import Price from "components/price";
import { getImageUrl, getOrderById, verifyPayment } from "lib/backend";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

export default async function CheckoutSuccessPage({
    searchParams
}: {
    searchParams: {
        id?: string;
        razorpay_payment_id?: string;
        razorpay_order_id?: string;
        razorpay_signature?: string;
    };
}) {
    const orderId = searchParams.id;
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("vaabhi_user")?.value;
    const user = userCookie ? JSON.parse(decodeURIComponent(userCookie)) : null;
    const email = user?.email || "customer@example.com";

    let order = null;
    let verificationError = false;

    if (orderId && searchParams.razorpay_payment_id && searchParams.razorpay_signature) {
        try {
            const verification = await verifyPayment(
                Number(orderId),
                searchParams.razorpay_payment_id,
                searchParams.razorpay_signature
            );
            if (verification && (verification.status === "error" || verification.success === false)) {
                verificationError = true;
            }
        } catch (e) {
            console.error("Payment verification failed:", e);
            verificationError = true;
        }
    }

    if (orderId && !verificationError) {
        order = await getOrderById(email, Number(orderId));
    }
    return (
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
            <div className="mb-8 flex justify-center">
                <CheckCircleIcon className="h-24 w-24 text-green-500" />
            </div>
            {verificationError ? (
                <h1 className="mb-4 text-4xl font-bold tracking-tight text-red-500">Payment Verification Failed</h1>
            ) : (
                <h1 className="mb-4 text-4xl font-bold tracking-tight">Order Confirmed!</h1>
            )}
            {verificationError ? (
                <p className="mb-12 text-lg text-neutral-600 dark:text-neutral-400">
                    We could not verify your payment. If the amount was deducted, please contact support with your order ID: #{orderId}.
                </p>
            ) : (
                <p className="mb-12 text-lg text-neutral-600 dark:text-neutral-400">
                    Thank you for your purchase. We've received your order and are getting it ready for shipment.
                </p>
            )}

            {order && !verificationError ? (
                <div className="rounded-xl border border-neutral-200 bg-white p-8 text-left dark:border-neutral-800 dark:bg-black">
                    <div className="mb-6 flex items-center justify-between border-b border-neutral-100 pb-6 dark:border-neutral-800">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Order Number</p>
                            <p className="text-lg font-bold">#{order.orderId}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Date</p>
                            <p className="text-lg font-bold">{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="mb-8 space-y-4">
                        {order.orderItems?.map((item: any) => (
                            <div key={item.orderItemId} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="relative h-16 w-16 overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
                                        <Image
                                            src={getImageUrl(item.product?.image)}
                                            alt={item.product?.productName}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium">{item.product?.productName}</p>
                                        <p className="text-sm text-neutral-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <Price
                                    amount={item.orderedProductPrice.toString()}
                                    currencyCode="INR"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-neutral-100 pt-6 dark:border-neutral-800">
                        <div className="flex justify-between font-bold">
                            <span>Total Amount</span>
                            <Price
                                amount={order.totalAmount.toString()}
                                currencyCode="INR"
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="rounded-xl border border-neutral-200 p-8 dark:border-neutral-800">
                    <p className="text-neutral-500">{verificationError ? "Please check your email for order status or contact support." : "Loading order details..."}</p>
                </div>
            )}

            <div className="mt-12 space-x-4">
                <Link
                    href="/account/orders"
                    className="inline-block rounded-full border border-neutral-200 px-8 py-3 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
                >
                    Track Order
                </Link>
                <Link
                    href="/"
                    className="inline-block rounded-full bg-blue-600 px-8 py-3 text-sm font-medium text-white hover:opacity-90"
                >
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}
