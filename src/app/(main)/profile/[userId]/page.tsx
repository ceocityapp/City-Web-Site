"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PostCard } from "@/components/feed/PostCard";
import { BoostDialog } from "@/components/shared/BoostDialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/context/ToastContext";
import {
  ArrowLeft, MessageCircle, Share2, LinkIcon, Calendar,
  ShieldCheck, MapPin, Edit3, Zap, Grid3x3, FileText, Bookmark,
  ExternalLink, Globe, Check,
} from "lucide-react";
import { Post } from "@/types";
import { HUESCA_USERS, HUESCA_POSTS } from "@/lib/huesca-data";
import { avatarColor } from "@/lib/avatar-color";
import { formatCount } from "@/lib/format-number";
import { cn } from "@/lib/utils";

const BANNER_THEMES = [
  { id: "green",  gradient: "from-emerald-400 via-green-500 to-teal-500" },
  { id: "violet", gradient: "from-violet-500 via-purple-500 to-indigo-500" },
  { id: "amber",  gradient: "from-amber-400 via-orange-400 to-rose-500" },
  { id: "blue",   gradient: "from-sky-400 via-blue-500 to-indigo-600" },
  { id: "rose",   gradient: "from-pink-400 via-rose-500 to-red-500" },
  { id: "slate",  gradient: "from-slate-600 via-zinc-700 to-slate-800" },
];

const DEMO_PROFILES: Record<string, {
  name: string; username: string; bio: string; location: string;
  posts_count: number; followers_count: number; following_count: number;
  is_verified: boolean; is_private: boolean; website_url: string | null;
  instagram_url: string | null; created_at: string;
  highlights: { emoji: string; label: string }[];
}> = {
  "1": { name: "María García", username: "mariagarcia", bio: "Amante del café y la fotografía callejera. Explorando cada rincón de mi ciudad.", location: "Huesca, España", posts_count: 45, followers_count: 230, following_count: 180, is_verified: false, is_private: false, website_url: null, instagram_url: "mariagarcia_foto", created_at: "2024-03-10T00:00:00Z", highlights: [{ emoji: "☕", label: "Cafeterías" }, { emoji: "📷", label: "Fotos" }, { emoji: "🏙️", label: "Ciudad" }] },
  "2": { name: "Pablo Torres", username: "pablotorres", bio: "Senderista empedernido y desarrollador web. Si no estoy en el monte, estoy programando.", location: "Huesca", posts_count: 12, followers_count: 89, following_count: 120, is_verified: false, is_private: false, website_url: "pablotorres.dev", instagram_url: null, created_at: "2024-05-20T00:00:00Z", highlights: [{ emoji: "🏔️", label: "Senderismo" }, { emoji: "💻", label: "Dev" }] },
  "3": { name: "Café Central", username: "cafecentral", bio: "El mejor café de la ciudad desde 2010. Pastas recién hechas cada mañana.", location: "C/ Mayor 12, Huesca", posts_count: 8, followers_count: 350, following_count: 20, is_verified: true, is_private: false, website_url: "cafecentral.es", instagram_url: "cafecentral_hca", created_at: "2024-01-15T00:00:00Z", highlights: [{ emoji: "☕", label: "Café" }, { emoji: "🥐", label: "Pastas" }, { emoji: "🌅", label: "Desayunos" }] },
  "4": { name: "Ayuntamiento", username: "ayuntamiento", bio: "Cuenta oficial del Ayuntamiento. Información, eventos y servicios para la ciudadanía.", location: "Plaza de la Catedral, Huesca", posts_count: 120, followers_count: 2500, following_count: 50, is_verified: true, is_private: false, website_url: "huesca.es", instagram_url: null, created_at: "2023-09-01T00:00:00Z", highlights: [{ emoji: "🏛️", label: "Oficial" }, { emoji: "📢", label: "Avisos" }, { emoji: "🎉", label: "Eventos" }] },
  "5": { name: "Elena Ruiz", username: "elenaruiz", bio: "Diseñadora gráfica y amante de los atardeceres.", location: "Huesca", posts_count: 67, followers_count: 450, following_count: 200, is_verified: false, is_private: false, website_url: null, instagram_url: "elena_designs", created_at: "2024-02-28T00:00:00Z", highlights: [{ emoji: "🎨", label: "Diseño" }, { emoji: "🌄", label: "Atardeceres" }, { emoji: "✨", label: "Creativa" }] },
};

export default function UserProfilePage() {
  const { userId } = useParams();
  const { success } = useToast();

  const huescaUser = HUESCA_USERS.find(u => u.id === Number(userId));
  const profile = huescaUser
    ? {
        name: huescaUser.name,
        username: huescaUser.username,
        bio: huescaUser.bio,
        location: "Huesca, España",
        posts_count: huescaUser.posts_count,
        followers_count: huescaUser.followers_count,
        following_count: huescaUser.following_count,
        is_verified: huescaUser.is_verified,
        is_private: false,
        website_url: null as string | null,
        instagram_url: null as string | null,
        created_at: "2024-01-01T00:00:00Z",
        highlights: [{ emoji: "🏙️", label: "Ciudad" }] as { emoji: string; label: string }[],
      }
    : DEMO_PROFILES[userId as string] || DEMO_PROFILES["1"];

  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followersCount, setFollowersCount] = useState(profile.followers_count);
  const [shareCopied, setShareCopied] = useState(false);
  const [bannerTheme, setBannerTheme] = useState(BANNER_THEMES[0]);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  const isOwnProfile = userId === "1"; // demo: user 1 is "you"

  const handleFollow = async () => {
    setFollowLoading(true);
    await new Promise(r => setTimeout(r, 400));
    setIsFollowing(f => !f);
    setFollowersCount(c => isFollowing ? c - 1 : c + 1);
    setFollowLoading(false);
  };

  const userPosts = HUESCA_POSTS.filter(p => p.user_id === Number(userId));
  const profileUser = {
    id: Number(userId), supabase_id: String(userId), email: "", name: profile.name,
    username: profile.username, avatar_url: null, banner_url: null, bio: profile.bio,
    website_url: profile.website_url, instagram_url: null, profile_completed: true,
    is_private: profile.is_private, posts_count: profile.posts_count,
    followers_count: followersCount, following_count: profile.following_count,
    is_admin: false, is_verified: profile.is_verified, created_at: profile.created_at,
  };
  const postsToShow: Post[] = userPosts.map(p => ({ ...p, user: profileUser, is_liked: false, is_bookmarked: false }));
  const imagePosts = postsToShow.filter(p => p.image_url);

  const lastSeenHours = (Number(userId) * 7) % 48;
  const isOnline = profile.is_verified && profile.followers_count > 300 ? true : lastSeenHours < 1;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Back */}
      <Link href="/feed" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 group btn-press">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Volver al tablón
      </Link>

      {/* Banner */}
      <div className={cn("h-44 rounded-3xl bg-gradient-to-br relative overflow-hidden mb-[-3.5rem] shadow-lg", bannerTheme.gradient)}>
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 30% 70%, white 0%, transparent 60%)" }} />
        {/* Theme picker toggle (own profile) */}
        {isOwnProfile && (
          <button
            onClick={() => setShowThemePicker(p => !p)}
            className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/20 backdrop-blur text-white text-xs font-bold hover:bg-black/30 transition-colors btn-press"
          >
            <Edit3 className="w-3 h-3" /> Tema
          </button>
        )}
        {/* Theme picker */}
        {showThemePicker && (
          <div className="absolute top-11 right-3 flex gap-2 p-2.5 rounded-2xl bg-card/90 backdrop-blur shadow-xl slide-up">
            {BANNER_THEMES.map(theme => (
              <button
                key={theme.id}
                onClick={() => { setBannerTheme(theme); setShowThemePicker(false); }}
                className={cn("w-7 h-7 rounded-full bg-gradient-to-br btn-press transition-all ring-2", theme.gradient,
                  bannerTheme.id === theme.id ? "ring-white scale-110 shadow-lg" : "ring-transparent hover:scale-105")}
              />
            ))}
          </div>
        )}
      </div>

      {/* Profile card */}
      <div className="relative bg-card rounded-3xl border border-border shadow-sm px-5 pt-16 pb-5">
        {/* Avatar */}
        <div className="absolute -top-14 left-5">
          <div className="relative">
            <Avatar className="w-28 h-28 border-4 border-card shadow-xl">
              <AvatarFallback className={cn(avatarColor(profile.username), "text-3xl font-black")}>
                {profile.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {/* Online indicator */}
            <div className={cn("absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-card",
              isOnline ? "bg-primary pulse-ring" : "bg-muted-foreground/40")} />
          </div>
        </div>

        {/* Action buttons (top right) */}
        <div className="flex justify-end gap-2 mb-3">
          {isOwnProfile ? (
            <>
              <BoostDialog targetType="profile" trigger={
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold shadow hover:shadow-lg transition-all btn-press">
                  <Zap className="w-3.5 h-3.5" /> Impulsar
                </button>
              } />
              <Button variant="outline" size="sm" className="rounded-xl font-bold text-xs h-8 btn-press"
                onClick={() => success("Perfil", "Funcionalidad de edición próximamente")}>
                <Edit3 className="w-3.5 h-3.5 mr-1" /> Editar perfil
              </Button>
            </>
          ) : (
            <>
              <Link href="/chat">
                <Button variant="outline" size="sm" className="rounded-xl h-8 btn-press"><MessageCircle className="w-4 h-4" /></Button>
              </Link>
              <Button variant="outline" size="sm" className="rounded-xl h-8 btn-press"
                onClick={async () => { await navigator.clipboard.writeText(window.location.href); setShareCopied(true); setTimeout(() => setShareCopied(false), 2000); }}>
                {shareCopied ? <Check className="w-4 h-4 text-primary" /> : <Share2 className="w-4 h-4" />}
              </Button>
              <Button size="sm" onClick={handleFollow} disabled={followLoading}
                className={cn("rounded-full font-bold text-xs h-8 min-w-[90px] transition-all btn-press",
                  isFollowing ? "bg-card text-primary border-2 border-primary/30 hover:bg-red-50 hover:text-red-500 hover:border-red-200" : "bg-primary text-white shadow-md hover:shadow-lg glow-primary")}>
                {followLoading ? <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" /> : isFollowing ? "Siguiendo ✓" : "+ Seguir"}
              </Button>
            </>
          )}
        </div>

        {/* Name + verified */}
        <div className="flex items-center gap-2 mb-0.5">
          <h1 className="text-xl font-black">{profile.name}</h1>
          {profile.is_verified && (
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-1">@{profile.username}</p>
        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-3">
          {isOnline ? (
            <><span className="w-1.5 h-1.5 rounded-full bg-primary pulse-ring" /> En línea</>
          ) : (
            <>Última vez hace {lastSeenHours}h</>
          )}
        </p>

        {/* Bio */}
        <p className="text-sm leading-relaxed mb-4">{profile.bio}</p>

        {/* Highlights */}
        {profile.highlights && profile.highlights.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-4">
            {profile.highlights.map((h, i) => (
              <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted text-sm font-semibold hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer btn-press">
                <span>{h.emoji}</span> {h.label}
              </span>
            ))}
          </div>
        )}

        {/* Info chips */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground mb-4">
          {profile.location && (
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary" /> {profile.location}</span>
          )}
          {profile.website_url && (
            <a href={`https://${profile.website_url}`} target="_blank" rel="noopener" className="flex items-center gap-1.5 text-primary hover:underline">
              <Globe className="w-3.5 h-3.5" /> {profile.website_url}
            </a>
          )}
          {profile.instagram_url && (
            <a href={`https://instagram.com/${profile.instagram_url}`} target="_blank" rel="noopener" className="flex items-center gap-1.5 hover:text-foreground">
              <ExternalLink className="w-3.5 h-3.5" /> @{profile.instagram_url}
            </a>
          )}
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Miembro desde {new Date(profile.created_at).toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Publicaciones", value: profile.posts_count },
            { label: "Seguidores", value: followersCount },
            { label: "Siguiendo", value: profile.following_count },
          ].map(stat => (
            <div key={stat.label} className="text-center p-3 rounded-2xl bg-muted/60 hover:bg-primary/8 transition-colors cursor-default">
              <p className="text-xl font-black text-gradient-green">{formatCount(stat.value)}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs + Content */}
      <div className="mt-5">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full bg-card border border-border rounded-2xl h-11 p-1 mb-5">
            <TabsTrigger value="posts" className="flex-1 rounded-xl gap-2 data-[state=active]:bg-foreground data-[state=active]:text-white font-bold text-sm">
              <FileText className="w-4 h-4" /> Posts
            </TabsTrigger>
            <TabsTrigger value="media" className="flex-1 rounded-xl gap-2 data-[state=active]:bg-foreground data-[state=active]:text-white font-bold text-sm">
              <Grid3x3 className="w-4 h-4" /> Media
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex-1 rounded-xl gap-2 data-[state=active]:bg-foreground data-[state=active]:text-white font-bold text-sm">
              <Bookmark className="w-4 h-4" /> Guardados
            </TabsTrigger>
          </TabsList>

          {activeTab === "posts" && (
            <div className="space-y-4 stagger-children">
              {postsToShow.length > 0
                ? postsToShow.map(post => <div key={post.id} className="slide-up"><PostCard post={post} /></div>)
                : <p className="text-sm text-muted-foreground text-center py-12">Sin publicaciones todavía</p>}
            </div>
          )}

          {activeTab === "media" && (
            <div>
              {imagePosts.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {imagePosts.map(post => (
                    <Link key={post.id} href={`/post/${post.id}`}
                      className="aspect-square rounded-2xl overflow-hidden bg-muted group block btn-press">
                      <img src={post.image_url!} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Grid3x3 className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">No hay fotos todavía</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "saved" && (
            <div className="text-center py-16">
              <Bookmark className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">Los guardados son privados</p>
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
}
