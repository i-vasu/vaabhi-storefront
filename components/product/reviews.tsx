'use client';

import { StarIcon } from '@heroicons/react/24/solid';
import { addReview } from 'lib/backend';
import { useState } from 'react';
import { toast } from 'sonner';

interface Review {
    reviewId: number;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export default function ProductReviews({
    productId,
    initialReviews = []
}: {
    productId: string;
    initialReviews?: any[]
}) {
    const [reviews, setReviews] = useState<any[]>(initialReviews);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [userName, setUserName] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await addReview(Number(productId), { rating, comment, userName });
            // The backend returns the updated product DTO or the review.
            // Assuming it returns the updated product with reviews based on our previous service check.
            if (res.data && res.data.reviews) {
                setReviews(res.data.reviews);
            }
            setComment('');
            setUserName('');
            setRating(5);
            toast.success('Review submitted successfully!');
        } catch (err) {
            console.error('Failed to submit review:', err);
            toast.error('Failed to submit review. please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-12 border-t border-neutral-200 pt-12 dark:border-neutral-800">
            <h2 className="text-2xl font-serif font-bold uppercase tracking-widest text-center mb-12">Customer Reviews</h2>

            <div className="mt-8 grid gap-16 lg:grid-cols-2">
                {/* Review List */}
                <div className="space-y-8">
                    {reviews.length > 0 ? (
                        reviews.map((review, index) => (
                            <div key={index} className="border-b border-neutral-100 pb-8 dark:border-neutral-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex text-heritage-gold">
                                        {[...Array(5)].map((_, i) => (
                                            <StarIcon key={i} className={`h-4 w-4 ${i < review.rating ? 'text-heritage-gold' : 'text-neutral-300 dark:text-neutral-700'}`} />
                                        ))}
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest">{review.userName || "Anonymous"}</span>
                                </div>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 italic font-medium leading-relaxed">"{review.comment}"</p>
                                <p className="mt-2 text-[10px] uppercase tracking-widest text-neutral-400">
                                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recently'}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-neutral-500 italic text-center">No reviews yet. Be the first to review!</p>
                    )}
                </div>

                {/* Review Form */}
                <div className="bg-neutral-50 p-8 dark:bg-neutral-900/40">
                    <h3 className="text-lg font-serif font-bold uppercase tracking-widest mb-6">Write a Review</h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Rating</label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="hover:scale-110 transition-transform focus:outline-none"
                                    >
                                        <StarIcon className={`h-6 w-6 ${star <= rating ? 'text-heritage-gold' : 'text-neutral-300 dark:text-neutral-700'}`} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Your Name</label>
                            <input
                                required
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="w-full border-b border-neutral-300 bg-transparent py-2 text-sm focus:border-black focus:outline-none dark:border-neutral-700 dark:focus:border-white"
                                placeholder="Enter your name"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Comment</label>
                            <textarea
                                required
                                rows={4}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full border-b border-neutral-300 bg-transparent py-2 text-sm focus:border-black focus:outline-none dark:border-neutral-700 dark:focus:border-white resize-none"
                                placeholder="Share your thoughts..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-heritage-red py-4 text-xs font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-heritage-gold hover:text-black disabled:opacity-50 shadow-xl"
                        >
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
