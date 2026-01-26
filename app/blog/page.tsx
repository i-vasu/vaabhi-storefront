import { getBlogs } from 'lib/backend';
import Link from 'next/link';

export const metadata = {
    title: 'Blog | Vaabhi Storefront',
    description: 'Latest updates and fashion guides from Vaabhi.'
};

export default async function BlogPage() {
    const blogs = await getBlogs();

    return (
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
            <header className="mb-8 border-b pb-4">
                <h1 className="text-3xl font-bold text-black dark:text-white sm:text-4xl">Editorial</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Discover the latest trends, guides, and stories from the house of Vaabhi.
                </p>
            </header>

            {blogs.length === 0 ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
                    <p className="text-xl font-medium text-gray-500">No blog posts found.</p>
                    <p className="mt-2 text-gray-400 text-sm">Check back later for fresh content.</p>
                </div>
            ) : (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {blogs.map((blog) => (
                        <Link
                            key={blog.blogId}
                            href={`/blog/${blog.blogId}`}
                            className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 transition-all hover:shadow-xl dark:border-gray-800"
                        >
                            <div className="aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-900">
                                {/* Placeholder for blog image if we add it to entity later */}
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 text-6xl dark:from-gray-900 dark:to-black">
                                    📰
                                </div>
                            </div>
                            <div className="flex flex-1 flex-col p-6">
                                <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
                                    {blog.status}
                                </span>
                                <h3 className="mb-2 text-xl font-bold text-black transition-colors group-hover:text-blue-600 dark:text-white">
                                    {blog.title}
                                </h3>
                                <p className="mb-4 line-clamp-3 flex-1 text-sm text-gray-600 dark:text-gray-400">
                                    {blog.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                                </p>
                                <div className="flex items-center justify-between border-t pt-4 text-xs text-gray-500">
                                    <span>By {blog.author}</span>
                                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
