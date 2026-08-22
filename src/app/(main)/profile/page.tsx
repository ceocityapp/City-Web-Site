"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PostCard } from "@/components/feed/PostCard";
import { BoostDialog } from "@/components/shared/BoostDialog";
import { EditProfileDialog } from "@/components/profile/EditProfileDialog";
import { formatCount } from "@/lib/format-number";
import {
  Settings,
  LinkIcon,
  Calendar,
  Bookmark,
  Compass,
  Palette,
  BadgeCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Post } from "@/types";
import { HUESCA_POSTS } from "@/lib/huesca-data";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

const BANNER_THEMES = [
  "bg-gradient-to-br from-primary/20 to-emerald-300/20",
  "bg-gradient-to-br from-violet-200 to-purple-300",
  "bg-gradient-to-br from-amber-200 to-orange-300",
  "bg-gradient-to-br from-sky-200 to-blue-300",
  "bg-gradient-to-br from-rose-200 to-pink-300",
  "bg-gradient-to-br from-slate-200 to-zinc-300",
];

const HIGHLIGHTS = [
  { emoji: "📍", label: "Ciudad" },
  { emoji: "📸", label: "Fotos" },
  { emoji: "🏃", label: "Rutas" },
  { emoji: "☕", label: "Cafés" },
  { emoji: "⭐", label: "Favoritos" },
];

const DEMO_USER = {
  name: "Carlos Mendez",
  username: "carlosmendez",
  bio: "Entusiasta de la fotografia y amante del cafe. Explorando la ciudad foto a foto.",
  avatar_url: null as string | null,
  banner_url: null as string | null,
  posts_count: 42,
  followers_count: 315,
  following_count: 198,
  website_url: "carlosmendez.com",
  is_verified: false,
  created_at: "2024-06-15T00:00:00Z",
};

const DEMO_POSTS: Post[] = [
  {
    id: 10,
    user_id: 10,
    title: null,
    body: "La luz de la manana golpeando la catedral justo en el momento perfecto. Estos momentos hacen que ame aun mas esta ciudad.",
    image_url: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800&q=80",
    video_url: null,
    post_type: "post",
    location: null,
    salary: null,
    event_date: null,
    event_month: null,
    attendees: 0,
    replies_count: 0,
    last_activity: null,
    likes_count: 34,
    comments_count: 7,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    user: {
      id: 10,
      supabase_id: "10",
      email: "carlos@example.com",
      name: DEMO_USER.name,
      username: DEMO_USER.username,
      avatar_url: null,
      banner_url: null,
      bio: DEMO_USER.bio,
      website_url: DEMO_USER.website_url,
      instagram_url: null,
      profile_completed: true,
      is_private: false,
      posts_count: DEMO_USER.posts_count,
      followers_count: DEMO_USER.followers_count,
      following_count: DEMO_USER.following_count,
      is_admin: false,
      is_verified: false,
      created_at: DEMO_USER.created_at,
    },
    is_liked: false,
    is_bookmarked: false,
  },
];

// Images from HUESCA_POSTS for the Multimedia tab
const MEDIA_POSTS = HUESCA_POSTS.filter((p) => p.image_url);

export default function ProfilePage() {
  const { user } = useAuth();
  const [bannerIndex, setBannerIndex] = useState(0);
  const [showPalette, setShowPalette] = useState(false);

  const profile = user
    ? {
        name: user.name || "Usuario",
        username: user.username || "usuario",
        bio: user.bio || "",
        avatar_url: user.avatar_url,
        banner_url: user.banner_url,
        posts_count: user.posts_count || 0,
        followers_count: user.followers_count || 0,
        following_count: user.following_count || 0,
        website_url: user.website_url || "",
        is_verified: user.is_verified || false,
        created_at: user.created_at || new Date().toISOString(),
      }
    : DEMO_USER;

  return (
    <div className="max-w-2xl mx-auto pb-8">
      {/* Banner */}
      <AnimatedSection animation="fade-in">
      <div className={`h-40 rounded-b-3xl relative overflow-hidden ${BANNER_THEMES[bannerIndex]}`}>
        {/* Palette picker button */}
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={() => setShowPalette((v) => !v)}
            className="w-8 h-8 rounded-full bg-white/70 backdrop-blur flex items-center justify-center shadow hover:bg-white transition-colors"
            aria-label="Cambiar tema del banner"
          >
            <Palette className="w-4 h-4 text-foreground/70" />
          </button>

          {showPalette && (
            <div className="absolute top-10 right-0 bg-card border border-border rounded-2xl shadow-xl p-3 flex gap-2 animate-in slide-in-from-top-2">
              {BANNER_THEMES.map((theme, i) => (
                <button
                  key={i}
                  onClick={() => { setBannerIndex(i); setShowPalette(false); }}
                  className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${theme} ${bannerIndex === i ? "border-primary scale-110" : "border-transparent"}`}
                  aria-label={`Tema ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      </AnimatedSection>

      {/* Avatar overlapping banner */}
      <div className="px-4">
        <AnimatedSection delay={200} animation="fade-up">
        <div className="flex items-end justify-between -mt-14 mb-3">
          <div className="relative">
            <Avatar className="w-28 h-28 border-4 border-background shadow-xl">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="bg-primary text-white text-3xl font-black">
                {profile.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {/* Online indicator */}
            <span className="pulse-ring absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-background" />
          </div>

          {/* Action row */}
          <div className="flex gap-2 mt-14">
            <EditProfileDialog
              profile={{
                name: profile.name,
                username: profile.username,
                bio: profile.bio,
                website_url: profile.website_url,
              }}
            />
            <Link href="/profile/settings">
              <Button variant="outline" size="sm" className="rounded-xl gap-1.5 font-bold">
                <Settings className="w-4 h-4" />
                Ajustes
              </Button>
            </Link>
            <BoostDialog
              targetType="profile"
              trigger={
                <Button size="sm" className="rounded-xl gap-1.5 font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:opacity-90 boost-glow">
                  <Zap className="w-4 h-4" />
                  Impulsar
                </Button>
              }
            />
          </div>
        </div>
        </AnimatedSection>

        {/* Name + verified */}
        <div className="flex items-center gap-2 mb-0.5">
          <h1 className="text-xl font-black">{profile.name}</h1>
          {profile.is_verified && (
            <BadgeCheck className="w-5 h-5 text-primary" aria-label="Cuenta verificada" />
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-2">@{profile.username}</p>

        {profile.bio && (
          <p className="text-sm leading-relaxed mb-3">{profile.bio}</p>
        )}

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
          {profile.website_url && (
            <span className="flex items-center gap-1">
              <LinkIcon className="w-3 h-3" /> {profile.website_url}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Se unió en{" "}
            {new Date(profile.created_at).toLocaleDateString("es-ES", {
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Stats row */}
        <div className="flex gap-3 mb-5">
          <div className="flex-1 bg-card border border-border rounded-2xl py-3 px-4 text-center">
            <p className="text-lg font-black text-gradient-green">{formatCount(profile.posts_count)}</p>
            <p className="text-xs text-muted-foreground">Posts</p>
          </div>
          <Link href="/profile/followers" className="flex-1 bg-card border border-border rounded-2xl py-3 px-4 text-center hover:border-primary/40 transition-colors">
            <p className="text-lg font-black text-gradient-green">{formatCount(profile.followers_count)}</p>
            <p className="text-xs text-muted-foreground">Seguidores</p>
          </Link>
          <Link href="/profile/followers" className="flex-1 bg-card border border-border rounded-2xl py-3 px-4 text-center hover:border-primary/40 transition-colors">
            <p className="text-lg font-black text-gradient-green">{formatCount(profile.following_count)}</p>
            <p className="text-xs text-muted-foreground">Siguiendo</p>
          </Link>
        </div>

        {/* Highlights strip */}
        <AnimatedSection delay={300}>
        <div className="flex gap-2 overflow-x-auto pb-1 mb-5 no-scrollbar">
          {HIGHLIGHTS.map((h) => (
            <button
              key={h.label}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-card border border-border text-sm font-semibold whitespace-nowrap hover:border-primary/40 hover:bg-primary/5 transition-colors shrink-0"
            >
              <span>{h.emoji}</span>
              <span>{h.label}</span>
            </button>
          ))}
        </div>
        </AnimatedSection>
      </div>

      {/* Tabs */}
      <AnimatedSection delay={400}>
      <div className="px-4">
        <Tabs defaultValue="posts">
          <TabsList className="w-full justify-start bg-card border border-border rounded-xl h-11 p-1 mb-4">
            <TabsTrigger
              value="posts"
              className="rounded-lg data-[state=active]:bg-foreground data-[state=active]:text-white"
            >
              Publicaciones
            </TabsTrigger>
            <TabsTrigger
              value="media"
              className="rounded-lg data-[state=active]:bg-foreground data-[state=active]:text-white"
            >
              Multimedia
            </TabsTrigger>
            <TabsTrigger
              value="bookmarks"
              className="rounded-lg data-[state=active]:bg-foreground data-[state=active]:text-white"
            >
              Guardados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            {DEMO_POSTS.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </TabsContent>

          <TabsContent value="media">
            <div className="grid grid-cols-3 gap-1 rounded-2xl overflow-hidden">
              {MEDIA_POSTS.map((post) => (
                <Link key={post.id} href={`/post/${post.id}`} className="aspect-square block overflow-hidden relative group">
                  <img
                    src={post.image_url!}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              ))}
            </div>
            {MEDIA_POSTS.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg font-bold">Sin fotos todavía</p>
                <p className="text-sm mt-1">Las publicaciones con imagen aparecerán aquí</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="bookmarks">
            <div className="text-center py-16 text-muted-foreground">
              <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-bold">Aún no hay guardados</p>
              <p className="text-sm mt-1 mb-4">Guarda publicaciones para encontrarlas aquí</p>
              <Link href="/feed">
                <Button className="rounded-full bg-primary font-bold">
                  <Compass className="w-4 h-4 mr-1.5" /> Explorar publicaciones
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      </AnimatedSection>
    </div>
  );
}
