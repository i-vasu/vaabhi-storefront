'use client';

import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
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
            <h2 className="text-2xl font-bold">Customer Reviews</h2>

            <div className="mt-8 grid gap-12 lg:grid-cols-2">
                {/* Review List */}
                <div className="space-y-8">
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review.reviewId} className="border-b border-neutral-100 pb-8 dark:border-neutral-800">
                                <div className="flex items-center gap-2">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            i < review.rating ? (
                                                <StarIcon key={i} className="h-4 w-4 text-yellow-500" />
                                            ) : (
                                                <StarOutline key={i} className="h-4 w-4 text-neutral-300" />
                                            )
                                        ))}
                                    </div>
                                    <span className="text-sm font-bold">{review.userName}</span>
                                </div>
                                <p className="mt-2 text-sm text-neutral-500">{review.comment}</p>
                                <p className="mt-2 text-xs text-neutral-400">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-neutral-500">No reviews yet. Be the first to review!</p>
                    )}
                </div>

                {/* Review Form */}
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-black">
                    <h3 className="text-lg font-bold">Write a Review</h3>
                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-500">Rating</label>
                            <div className="mt-1 flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="hover:scale-110 transition-transform"
                                    >
                                        {star <= rating ? (
                                            <StarIcon className="h-6 w-6 text-yellow-500" />
                                        ) : (
                                            <StarOutline className="h-6 w-6 text-neutral-300" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-500">Your Name</label>
                            <input
                                required
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="mt-1 w-full rounded-md border border-neutral-200 bg-white p-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-500">Comment</label>
                            <textarea
                                required
                                rows={4}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="mt-1 w-full rounded-md border border-neutral-200 bg-white p-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full rounded-full bg-black py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-black"
                        >
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
