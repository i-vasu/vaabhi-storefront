import { getStaticPage } from 'lib/backend';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
    const page = await getStaticPage(params.handle);
    if (!page) return notFound();

    return {
        title: page.title,
        description: page.title
    };
}

export default async function Page({ params }: { params: { handle: string } }) {
    const page = await getStaticPage(params.handle);

    if (!page) {
        notFound();
    }

    return (
        <div className="mx-auto max-w-4xl px-6 py-12">
            <h1 className="mb-8 text-4xl font-bold">{page.title}</h1>
            <div
                className="prose prose-neutral dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: page.content }}
            />
        </div>
    );
}
