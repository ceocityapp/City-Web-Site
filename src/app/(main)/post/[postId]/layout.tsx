import type { Metadata } from "next";
import { HUESCA_POSTS } from "@/lib/huesca-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ postId: string }>;
}): Promise<Metadata> {
  const { postId } = await params;
  const post = HUESCA_POSTS.find((p) => p.id === Number(postId));
  const title = post?.title || post?.body?.slice(0, 60) || "Post";
  const description = post?.body?.slice(0, 160) || "Descubre posts de la comunidad City App";
  return {
    title: `${title} - City App`,
    description,
    openGraph: {
      title: post?.title || title,
      description,
      type: "article",
      images: post?.image_url ? [post.image_url] : undefined,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
