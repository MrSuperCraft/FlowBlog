import { Metadata, ResolvingMetadata } from 'next'
import { getPostBySlug } from '@/actions/post'
import { sanitizeMarkdown } from '@/shared/lib/utils'
import ArticlePage from './ArticlePage'
import { notFound } from 'next/navigation'

type Props = {
    params: Promise<{ username: string; slug: string }>
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { username, slug } = await params

    try {
        // Fetch article data
        const article = await getPostBySlug(slug)

        if (!article) {
            return {
                title: 'Article Not Found',
            }
        }

        // Get parent metadata (optional)
        const previousImages = (await parent).openGraph?.images || []

        // Create a clean description from the article content
        const cleanContent = sanitizeMarkdown(article.content)
        const description = cleanContent.substring(0, 160) + (cleanContent.length > 160 ? '...' : '')

        return {
            title: article.title,
            description: description,
            authors: [{ name: username }],
            openGraph: {
                title: article.title,
                description: description,
                type: 'article',
                publishedTime: article.published_at as string,
                authors: username,
                images: article.cover_image
                    ? [article.cover_image, ...previousImages]
                    : previousImages,
            },
            twitter: {
                card: 'summary_large_image',
                title: article.title,
                description: description,
                images: article.cover_image ? [article.cover_image] : [],
            },
        }
    } catch (error) {
        console.error('Error generating metadata:', error)
        return {
            title: 'Article',
            description: 'Read this article on our platform',
        }
    }
}

export default async function Page({ params }: Props) {
    const { slug } = await params;

    // You can perform an initial server-side check here if needed
    const article = await getPostBySlug(slug)

    if (!article) {
        notFound()
    }

    // Pass the slug to the client component
    return <ArticlePage />
}
