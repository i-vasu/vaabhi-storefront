import { getBlog } from 'lib/backend';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { id: string } }) {
    const blog = await getBlog(params.id);
    if (!blog) return {};

    return {
        title: `${blog.title} | Vaabhi Blog`,
        description: blog.content.substring(0, 150)
    };
}

export default async function BlogPostPage({ params }: { params: { id: string } }) {
    const blog = await getBlog(params.id);

    if (!blog) {
        notFound();
    }

    return (
        <article className="mx-auto max-w-screen-md px-4 py-12 sm:px-6 lg:px-8">
            <header className="mb-10 text-center">
                <div className="mb-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <span className="font-medium text-blue-600 uppercase tracking-widest">{blog.status}</span>
                    <span>•</span>
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>By {blog.author}</span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-black dark:text-white sm:text-5xl lg:text-6xl">
                    {blog.title}
                </h1>
            </header>

            <div className="prose prose-lg prose-blue mx-auto dark:prose-invert">
                {/* If content contains HTML from a rich text editor */}
                <div
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                    className="text-gray-700 dark:text-gray-300 leading-relaxed"
                />
            </div>

            <footer className="mt-16 border-t pt-8">
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="h-16 w-16 overflow-hidden rounded-full bg-gray-200">
                        <div className="flex h-full w-full items-center justify-center text-2xl">👤</div>
                    </div>
                    <h4 className="mt-4 text-lg font-bold text-black dark:text-white">{blog.author}</h4>
                    <p className="mt-1 text-sm text-gray-500">Contributor at Vaabhi Storefront</p>
                </div>
            </footer>
        </article>
    );
}
