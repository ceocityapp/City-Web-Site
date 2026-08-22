"use client";

import { useState } from "react";
import { PostCard } from "@/components/feed/PostCard";
import { StoryBar } from "@/components/feed/StoryBar";
import { RightSidebar } from "@/components/layout/RightSidebar";
import { useCity } from "@/context/CityContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreatePostDialog } from "@/components/feed/CreatePostDialog";
import { Post, User } from "@/types";
import { HUESCA_POSTS, HUESCA_USERS } from "@/lib/huesca-data";
import { BackToTop } from "@/components/shared/BackToTop";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { FileText } from "lucide-react";

function buildUser(id: number): User {
  const u = HUESCA_USERS.find((x) => x.id === id) || HUESCA_USERS[0];
  return {
    id: u.id,
    supabase_id: String(u.id),
    email: "",
    name: u.name,
    username: u.username,
    avatar_url: u.avatar_url,
    banner_url: null,
    bio: u.bio,
    website_url: null,
    instagram_url: null,
    profile_completed: true,
    is_private: false,
    posts_count: u.posts_count,
    followers_count: u.followers_count,
    following_count: u.following_count,
    is_admin: false,
    is_verified: u.is_verified,
    created_at: new Date().toISOString(),
  };
}

const DEMO_POSTS: Post[] = HUESCA_POSTS.map((p) => ({
  ...p,
  user: buildUser(p.user_id),
  is_liked: false,
  is_bookmarked: false,
}));

type FeedTab = "all" | "posts" | "forums" | "jobs" | "events";

export default function FeedPage() {
  const { selectedCity } = useCity();
  const [activeTab, setActiveTab] = useState<FeedTab>("all");

  const filteredPosts = DEMO_POSTS.filter((post) => {
    if (activeTab === "all") return true;
    if (activeTab === "posts") return post.post_type === "post";
    if (activeTab === "forums") return post.post_type === "forum";
    if (activeTab === "jobs") return post.post_type === "job";
    if (activeTab === "events") return post.post_type === "event";
    return true;
  });

  return (
    <div className="flex justify-center">
      <div className="flex-1 max-w-2xl px-4 py-6">
        {/* Header */}
        <AnimatedSection animation="fade-up" className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-foreground">Tablón</h1>
            {selectedCity && (
              <p className="text-sm text-muted-foreground">Qué está pasando en {selectedCity.name}</p>
            )}
          </div>
          <CreatePostDialog />
        </AnimatedSection>

        {/* Stories */}
        <AnimatedSection animation="fade-up" delay={80}>
          <div className="bg-card rounded-2xl border border-border p-4 mb-6">
            <StoryBar />
          </div>
        </AnimatedSection>

        {/* Tabs */}
        <AnimatedSection animation="fade-up" delay={160}>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FeedTab)} className="mb-6">
          <TabsList className="w-full justify-start bg-card border border-border rounded-xl h-11 p-1">
            <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-foreground data-[state=active]:text-white font-bold">Todo</TabsTrigger>
            <TabsTrigger value="posts" className="rounded-lg data-[state=active]:bg-foreground data-[state=active]:text-white font-bold">Posts</TabsTrigger>
            <TabsTrigger value="forums" className="rounded-lg data-[state=active]:bg-foreground data-[state=active]:text-white font-bold">Foros</TabsTrigger>
            <TabsTrigger value="jobs" className="rounded-lg data-[state=active]:bg-foreground data-[state=active]:text-white font-bold">Trabajo</TabsTrigger>
            <TabsTrigger value="events" className="rounded-lg data-[state=active]:bg-foreground data-[state=active]:text-white font-bold">Eventos</TabsTrigger>
          </TabsList>
        </Tabs>
        </AnimatedSection>

        {/* Posts */}
        <div className="space-y-4">
          {filteredPosts.map((post, i) => (
            <AnimatedSection key={post.id} delay={i * 80} animation="fade-up">
              <PostCard post={post} />
            </AnimatedSection>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-bold">Aún no hay publicaciones en esta categoría</p>
            <p className="text-sm mt-1 mb-4">¡Sé el primero en compartir algo!</p>
            <div className="inline-flex">
              <CreatePostDialog />
            </div>
          </div>
        )}
      </div>
      <RightSidebar />
      <BackToTop />
    </div>
  );
}
