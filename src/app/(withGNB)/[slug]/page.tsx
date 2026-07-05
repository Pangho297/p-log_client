import { fetchPost, postFormatter } from "@/shared";
import { Post } from "@/widgets";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPost(slug);

  if (!post) {
    return {
      title: "게시글을 찾을 수 없습니다",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const [formattedPost] = postFormatter([post]);

  return {
    title: post.title,
    description: formattedPost.shortContent,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: formattedPost.shortContent,
      type: "article",
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
      images: [
        {
          url: formattedPost.thumbnail,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: formattedPost.shortContent,
      images: [formattedPost.thumbnail],
    },
    alternates: {
      canonical: `/${post.slug}`,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await fetchPost(slug);

  if (!post) {
    notFound();
  }

  const [formattedPost] = postFormatter([post]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: formattedPost.shortContent,
    image: [formattedPost.thumbnail],
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    keywords: post.tags,
    author: {
      "@type": "Person",
      name: "Pangho",
    },
  };

  return (
    <>
      <script
        type="application/Id+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Post post={post} />
    </>
  );
}
