'use client';

import { Dialog, Transition } from '@headlessui/react';
import { ShoppingCartIcon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import LoadingDots from 'components/loading-dots';
import Price from 'components/price';
import { DEFAULT_OPTION } from 'lib/constants';
import { createUrl } from 'lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { applyCouponCode, createCartAndSetCookie, redirectToCheckout } from './actions';
import { useCart } from './cart-context';
import { DeleteItemButton } from './delete-item-button';
import { EditItemQuantityButton } from './edit-item-quantity-button';
import OpenCart from './open-cart';

function CouponCode() {
  const [state, formAction] = useActionState(applyCouponCode, null);
  const { pending } = useFormStatus();
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state === 'Coupon applied') {
      toast.success('Coupon applied successfully!');
      if (inputRef.current) inputRef.current.value = '';
    } else if (state && state !== 'Coupon applied') {
      toast.error(state);
    }
  }, [state]);

  useEffect(() => {
    fetch('/api/coupons')
      .then((res) => res.json())
      .then((data) => setAvailableCoupons(data))
      .catch((err) => console.error(err));
  }, []);

  const selectCoupon = (code: string) => {
    if (inputRef.current) {
      inputRef.current.value = code;
    }
  };

  return (
    <div className="space-y-4 pt-4">
      <form action={formAction} className="relative">
        <input
          ref={inputRef}
          type="text"
          name="code"
          placeholder="ENTER COUPON CODE"
          className="w-full border-b border-neutral-300 bg-transparent py-2 pr-16 text-xs font-bold uppercase tracking-widest text-black placeholder:text-neutral-400 focus:border-black focus:outline-none dark:border-neutral-700 dark:text-white dark:focus:border-white"
        />
        <button
          type="submit"
          disabled={pending}
          className="absolute right-0 top-0 h-full text-xs font-black uppercase tracking-widest text-heritage-red hover:text-heritage-gold disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? <LoadingDots className="bg-heritage-red" /> : 'Apply'}
        </button>
      </form>

      {availableCoupons.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Available Offers</p>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {availableCoupons.map((coupon) => (
              <button
                key={coupon.couponId}
                onClick={() => selectCoupon(coupon.couponCode)}
                className="flex flex-none flex-col items-start border border-neutral-200 bg-neutral-50 p-3 text-left transition-colors hover:border-black dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-white w-40"
              >
                <span className="text-xs font-bold uppercase tracking-widest text-black dark:text-white mb-1">{coupon.couponCode}</span>
                <span className="text-[10px] text-neutral-500">
                  {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}% Off` : `₹${coupon.discountValue} Off`}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal() {
  const { cart, updateCartItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    if (!cart) {
      createCartAndSetCookie();
    }
  }, [cart]);

  useEffect(() => {
    if (
      cart?.totalQuantity &&
      cart?.totalQuantity !== quantityRef.current &&
      cart?.totalQuantity > 0
    ) {
      if (!isOpen) {
        setIsOpen(true);
      }
      quantityRef.current = cart?.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity, quantityRef]);

  return (
    <>
      <button aria-label="Open cart" onClick={openCart}>
        <OpenCart quantity={cart?.totalQuantity} />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeCart} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l border-neutral-100 bg-white p-6 text-black shadow-2xl md:w-[450px] dark:border-neutral-800 dark:bg-black dark:text-white">
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-heritage-gold/20">
                  <p className="text-3xl font-black uppercase tracking-tighter text-heritage-red">Maison Bag</p>
                  <button aria-label="Close cart" onClick={closeCart}>
                    <CloseCart />
                  </button>
                </div>

                {!cart || cart.lines.length === 0 ? (
                  <div className="mt-32 flex w-full flex-col items-center justify-center">
                    <div className="h-24 w-24 rounded-full bg-heritage-cream flex items-center justify-center mb-8">
                       <ShoppingCartIcon className="h-10 w-10 text-heritage-red/40" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-heritage-black/40">
                      Your bag is currently void.
                    </p>
                  </div>
                ) : (
                  <div className="flex h-full flex-col justify-between overflow-hidden">
                    <ul className="grow overflow-auto py-4 custom-scrollbar">
                      {cart.lines
                        .sort((a, b) =>
                          a.merchandise.product.title.localeCompare(
                            b.merchandise.product.title
                          )
                        )
                        .map((item, i) => {
                          const merchandiseSearchParams =
                            {} as MerchandiseSearchParams;

                          item.merchandise.selectedOptions.forEach(
                            ({ name, value }) => {
                              if (value !== DEFAULT_OPTION) {
                                merchandiseSearchParams[name.toLowerCase()] =
                                  value;
                              }
                            }
                          );

                          const merchandiseUrl = createUrl(
                            `/product/${item.merchandise.product.handle}`,
                            new URLSearchParams(merchandiseSearchParams)
                          );

                          return (
                            <li
                              key={i}
                              className="flex w-full flex-col border-b border-heritage-gold/10 last:border-0"
                            >
                              <div className="relative flex w-full flex-row justify-between py-8">
                                <div className="absolute z-40 -ml-2 -mt-2">
                                  <DeleteItemButton
                                    item={item}
                                    optimisticUpdate={updateCartItem}
                                  />
                                </div>
                                <div className="flex flex-row gap-6">
                                  <div className="relative h-24 w-20 overflow-hidden rounded-xl bg-heritage-cream border border-heritage-gold/10">
                                    <Image
                                      className="h-full w-full object-cover transition-transform hover:scale-110"
                                      width={80}
                                      height={96}
                                      alt={
                                        item.merchandise.product.featuredImage
                                          .altText ||
                                        item.merchandise.product.title
                                      }
                                      src={
                                        item.merchandise.product.featuredImage.url
                                      }
                                    />
                                  </div>
                                  <Link
                                    href={merchandiseUrl}
                                    onClick={closeCart}
                                    className="z-30 flex flex-col pt-1"
                                  >
                                    <span className="text-sm font-black uppercase tracking-widest text-heritage-black leading-tight group-hover:text-heritage-red">
                                      {item.merchandise.product.title}
                                    </span>
                                    {item.merchandise.title !==
                                      DEFAULT_OPTION ? (
                                      <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-heritage-black/40">
                                        Edition: {item.merchandise.title}
                                      </p>
                                    ) : null}
                                  </Link>
                                </div>
                                <div className="flex flex-col justify-between items-end">
                                  <Price
                                    className="text-xs font-black text-heritage-red"
                                    amount={item.cost.totalAmount.amount}
                                    currencyCode={
                                      item.cost.totalAmount.currencyCode
                                    }
                                  />
                                  <div className="flex h-10 flex-row items-center rounded-2xl border-2 border-heritage-gold/10 overflow-hidden bg-heritage-cream/20">
                                    <EditItemQuantityButton
                                      item={item}
                                      type="minus"
                                      optimisticUpdate={updateCartItem}
                                    />
                                    <p className="w-8 text-center text-[11px] font-black text-heritage-black">
                                      {item.quantity}
                                    </p>
                                    <EditItemQuantityButton
                                      item={item}
                                      type="plus"
                                      optimisticUpdate={updateCartItem}
                                    />
                                  </div>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                    </ul>
                    <div className="pt-8 space-y-4 border-t-2 border-heritage-gold/20">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-[10px] uppercase font-black tracking-widest text-heritage-black/40">
                          <p>Dossier Subtotal</p>
                          <Price
                            className="text-heritage-black"
                            amount={cart.cost.subtotalAmount.amount}
                            currencyCode={cart.cost.subtotalAmount.currencyCode}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] uppercase font-black tracking-widest text-heritage-black/40">
                          <p>Complimentary Transit</p>
                          <p className="text-heritage-red">Pre-Authorized</p>
                        </div>
                        <div className="flex items-center justify-between pt-4">
                          <p className="text-xs font-black uppercase tracking-[0.2em] text-heritage-black">Total Procurement</p>
                          <Price
                            className="text-2xl font-black tracking-tighter text-heritage-red"
                            amount={cart.cost.totalAmount.amount}
                            currencyCode={cart.cost.totalAmount.currencyCode}
                          />
                        </div>
                      </div>

                      <div className="py-4">
                         <CouponCode />
                      </div>

                      <form action={redirectToCheckout}>
                        <CheckoutButton />
                      </form>
                      <p className="text-center text-[8px] font-black uppercase tracking-[0.4em] text-heritage-black/30 pb-4">
                        Handcrafted with Passion • Secured by Heritage
                      </p>
                    </div>
                  </div>
                )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}

function CloseCart({ className }: { className?: string }) {
  return (
    <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-heritage-gold/20 text-heritage-black transition-all hover:bg-heritage-red hover:text-white group">
      <XMarkIcon
        className={clsx(
          'h-5 transition-transform group-hover:rotate-90',
          className
        )}
      />
    </div>
  );
}

function CheckoutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="block w-full rounded-2xl bg-heritage-red py-6 text-[10px] font-black uppercase tracking-[0.4em] text-white transition-all hover:bg-heritage-gold hover:text-heritage-black disabled:opacity-50 shadow-[0_10px_30px_rgba(139,0,0,0.3)] active:scale-95"
      type="submit"
      disabled={pending}
    >
      {pending ? <LoadingDots className="bg-white" /> : 'Authorize Procurement'}
    </button>
  );
}
