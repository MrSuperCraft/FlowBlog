'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getPostBySlug } from '@/actions/post';
import { PostType } from '@/shared/types';
import { Header } from '@/components/Header';
import { ModeToggle } from '@/components/ThemeToggle';
import { sanitizeMarkdown } from '@/shared/lib/utils';
import { ArticleInner } from '@/components/articles/ArticleInner';

const ArticlePage = () => {
    const [article, setArticle] = useState<PostType | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const username = window.location.pathname.split("/")[1];  // Fixed to grab the correct part of the URL
        const slug = window.location.pathname.split("/")[2];

        if (!slug || typeof username !== "string") {
            router.push('/404');  // Redirect if parameters are invalid
            return;
        }

        setUsername(username);

        const fetchArticle = async () => {
            try {
                const fetchedArticle = await getPostBySlug(slug);
                if (fetchedArticle) {
                    setArticle(fetchedArticle);
                } else {
                    router.push('/404');  // Redirect to 404 if the article doesn't exist
                }
            } catch {
                router.push('/404');  // Redirect to 404 on fetch failure
            }
        };

        fetchArticle();
    }, [router]);

    if (!article) return null;  // Article is fetched, or redirect happens, no need to show loading or no article states.

    const articleDate = article?.published_at
        ? new Date(article.published_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
        : 'Unknown Date';

    const articleReadTime =
        Math.ceil(sanitizeMarkdown(article?.content).split(/\s+/).length / 200) + ' minute read';

    return (
        <>
            <Header>
                <ModeToggle />
            </Header>
            <ArticleInner
                article={article}
                articleDate={articleDate}
                username={username ?? ''}  // Ensure this is the correct username field from your data
                articleReadTime={articleReadTime}
            />
        </>
    );
};

export default ArticlePage;
