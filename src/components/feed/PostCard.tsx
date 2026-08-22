"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Post, Comment } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Heart, MessageCircle, Bookmark, Share2, MapPin, Calendar, Briefcase,
  MoreHorizontal, Send, Flag, EyeOff, Check, Link as LinkIcon, Zap,
} from "lucide-react";
import { imageFallback } from "@/lib/image-fallback";
import { relativeTime } from "@/lib/relative-time";
import { avatarColor } from "@/lib/avatar-color";
import { BoostDialog } from "@/components/shared/BoostDialog";
import { cn } from "@/lib/utils";

const typeConfig = {
  post:   { color: "bg-primary/10 text-primary border-primary/20",          label: null },
  forum:  { color: "bg-violet-100 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800",        label: "Foro" },
  job:    { color: "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",           label: "Trabajo" },
  event:  { color: "bg-rose-100 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800",              label: "Evento" },
};

const DEMO_COMMENTS: Comment[] = [
  { id: 1, post_id: 1, user_id: 2, body: "¡Me encanta ese sitio! El café con leche es increíble.", parent_id: null, created_at: new Date(Date.now() - 1800000).toISOString(), user: { id: 2, supabase_id: "2", email: "", name: "Elena Ruiz", username: "elenaruiz", avatar_url: null, banner_url: null, bio: null, website_url: null, instagram_url: null, profile_completed: true, is_private: false, posts_count: 0, followers_count: 0, following_count: 0, is_admin: false, is_verified: false, created_at: "" } },
  { id: 2, post_id: 1, user_id: 3, body: "¿Dónde está exactamente? Quiero ir este fin de semana.", parent_id: null, created_at: new Date(Date.now() - 900000).toISOString(), user: { id: 3, supabase_id: "3", email: "", name: "Pablo Torres", username: "pablotorres", avatar_url: null, banner_url: null, bio: null, website_url: null, instagram_url: null, profile_completed: true, is_private: false, posts_count: 0, followers_count: 0, following_count: 0, is_admin: false, is_verified: false, created_at: "" } },
];

export function PostCard({ post, isBoosted = false }: { post: Post; isBoosted?: boolean }) {
  const [liked, setLiked] = useState(post.is_liked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [bookmarked, setBookmarked] = useState(post.is_bookmarked || false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>(post.id === 1 ? DEMO_COMMENTS : []);
  const [commentsCount, setCommentsCount] = useState(post.comments_count || 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reported, setReported] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [posting, setPosting] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);
  const [bookmarkAnim, setBookmarkAnim] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const postUrl = `/post/${post.id}`;

  const handleLike = () => {
    setLiked(p => !p);
    setLikesCount(c => liked ? c - 1 : c + 1);
    if (!liked) { setHeartAnim(true); setTimeout(() => setHeartAnim(false), 500); }
  };

  const handleBookmark = () => {
    setBookmarked(p => !p);
    if (!bookmarked) { setBookmarkAnim(true); setTimeout(() => setBookmarkAnim(false), 400); }
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(postUrl);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handleComment = () => {
    if (!commentText.trim() || posting) return;
    setPosting(true);
    const newComment: Comment = {
      id: Date.now(), post_id: post.id, user_id: 0, body: commentText, parent_id: null,
      created_at: new Date().toISOString(),
      user: { id: 0, supabase_id: "0", email: "", name: "Tú", username: "tu", avatar_url: null, banner_url: null, bio: null, website_url: null, instagram_url: null, profile_completed: true, is_private: false, posts_count: 0, followers_count: 0, following_count: 0, is_admin: false, is_verified: false, created_at: "" },
    };
    setComments(c => [...c, newComment]);
    setCommentsCount(c => c + 1);
    setCommentText("");
    setTimeout(() => setPosting(false), 400);
  };

  const config = typeConfig[post.post_type as keyof typeof typeConfig] || typeConfig.post;

  if (hidden) {
    return (
      <article className="bg-card rounded-2xl border border-border/60 p-4 text-center slide-up">
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
          <EyeOff className="w-4 h-4" /> Post oculto
        </p>
        <button onClick={() => setHidden(false)} className="text-xs text-primary hover:underline mt-1">Deshacer</button>
      </article>
    );
  }

  return (
    <article className={cn(
      "bg-card rounded-2xl border transition-all duration-200 overflow-hidden group",
      isBoosted
        ? "border-amber-200 shadow-[0_0_0_1px_rgba(251,191,36,0.3),0_4px_24px_rgba(251,191,36,0.12)] hover:shadow-[0_0_0_1px_rgba(251,191,36,0.5),0_8px_32px_rgba(251,191,36,0.2)]"
        : "border-border/60 hover:border-border hover:shadow-lg hover:shadow-black/5"
    )}>
      {/* Boosted banner */}
      {isBoosted && (
        <div className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-b border-amber-100 dark:border-amber-800">
          <Zap className="w-3 h-3 text-amber-500" />
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Publicación impulsada</span>
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Link href={`/profile/${post.user_id}`} className="shrink-0">
              <Avatar className="w-10 h-10 ring-2 ring-transparent hover:ring-primary/30 transition-all">
                <AvatarImage src={post.user?.avatar_url || undefined} />
                <AvatarFallback className={cn(avatarColor(post.user?.username || String(post.user?.id)), "text-sm font-bold")}>
                  {(post.user?.name?.charAt(0) || "U").toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Link href={`/profile/${post.user_id}`} className="text-sm font-bold hover:text-primary transition-colors">
                  {post.user?.name || "Usuario"}
                </Link>
                {post.user?.is_verified && (
                  <span className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  </span>
                )}
                {config.label && (
                  <Badge variant="secondary" className={cn("text-[10px] px-2 py-0 h-5 border font-bold", config.color)}>
                    {config.label}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                @{post.user?.username || "user"} · {relativeTime(post.created_at)}
              </p>
            </div>
          </div>

          {/* Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="btn-press text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-9 z-50 bg-popover rounded-2xl border border-border shadow-xl py-1.5 min-w-[190px] slide-up">
                <button onClick={async () => { await navigator.clipboard.writeText(postUrl); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-muted transition-colors rounded-lg mx-1" style={{width:"calc(100% - 8px)"}}>
                  <LinkIcon className="w-4 h-4 text-muted-foreground" /> Copiar enlace
                </button>
                <div className="px-1">
                  <BoostDialog
                    targetType="post"
                    trigger={
                      <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-amber-50 dark:hover:bg-amber-950/30 text-amber-600 dark:text-amber-400 transition-colors rounded-lg">
                        <Zap className="w-4 h-4" /> Impulsar publicación
                      </button>
                    }
                  />
                </div>
                <button onClick={() => { setReported(true); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-muted transition-colors rounded-lg mx-1" style={{width:"calc(100% - 8px)"}}>
                  <Flag className="w-4 h-4 text-muted-foreground" /> {reported ? "Reportado ✓" : "Reportar"}
                </button>
                <button onClick={() => { setHidden(true); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition-colors rounded-lg mx-1" style={{width:"calc(100% - 8px)"}}>
                  <EyeOff className="w-4 h-4" /> Ocultar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {post.title && (
          <Link href={`/post/${post.id}`}>
            <h3 className="text-base font-bold mb-2 hover:text-primary transition-colors leading-snug">{post.title}</h3>
          </Link>
        )}
        {post.body && (
          <Link href={`/post/${post.id}`}>
            <p className="text-sm text-foreground/85 leading-relaxed mb-3 whitespace-pre-wrap">
              {post.body.length > 280 ? `${post.body.slice(0, 280)}` : post.body}
              {post.body.length > 280 && <span className="text-primary font-semibold">… ver más</span>}
            </p>
          </Link>
        )}

        {/* Job tags */}
        {post.post_type === "job" && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.location && <Badge variant="secondary" className="gap-1 text-xs rounded-lg"><MapPin className="w-3 h-3" />{post.location}</Badge>}
            {post.salary && <Badge variant="secondary" className="gap-1 text-xs rounded-lg"><Briefcase className="w-3 h-3" />{post.salary}</Badge>}
          </div>
        )}

        {/* Event date */}
        {post.post_type === "event" && post.event_date && (
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-400 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(post.event_date).toLocaleDateString("es-ES", { weekday: "long", month: "long", day: "numeric" })}
            {post.attendees > 0 && <span className="ml-1 text-rose-500">· {post.attendees} asistentes</span>}
          </div>
        )}

        {/* Image */}
        {post.image_url && (
          <div className="rounded-2xl overflow-hidden mb-3 bg-muted">
            <img src={post.image_url} alt="" loading="lazy" decoding="async"
              className="w-full object-cover max-h-96 hover:scale-[1.02] transition-transform duration-300"
              onError={imageFallback} />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-0.5 pt-3 border-t border-border/50">
          {/* Like */}
          <button onClick={handleLike} aria-pressed={liked}
            className={cn("btn-press flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all",
              liked ? "text-red-500 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/30" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
            <Heart className={cn("w-4 h-4 transition-transform", heartAnim && "heart-pop", liked && "fill-current")} />
            {likesCount > 0 && <span className="tabular-nums">{likesCount}</span>}
          </button>

          {/* Comment */}
          <button onClick={() => setShowComments(!showComments)} aria-expanded={showComments}
            className={cn("btn-press flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all",
              showComments ? "text-blue-500 bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-950/30" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
            <MessageCircle className="w-4 h-4" />
            {commentsCount > 0 && <span className="tabular-nums">{commentsCount}</span>}
          </button>

          {/* Bookmark */}
          <button onClick={handleBookmark} aria-pressed={bookmarked}
            className={cn("btn-press flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all",
              bookmarked ? "text-primary bg-primary/10 hover:bg-primary/15" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
            <Bookmark className={cn("w-4 h-4 transition-transform", bookmarkAnim && "scale-125", bookmarked && "fill-current")} />
          </button>

          {/* Share */}
          <button onClick={handleShare}
            className={cn("btn-press flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ml-auto",
              shareCopied ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
            {shareCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            {shareCopied && <span className="text-xs">Copiado</span>}
          </button>
        </div>

        {/* Comments */}
        {showComments && (
          <div className="mt-4 space-y-3 slide-up">
            {comments.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-3">Sé el primero en comentar 👋</p>
            )}
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-2.5">
                <Avatar className="w-7 h-7 shrink-0">
                  <AvatarFallback className={cn(avatarColor(comment.user?.username || ""), "text-[10px] font-bold")}>
                    {comment.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="bg-muted/70 rounded-2xl rounded-tl-sm px-3.5 py-2.5">
                    <p className="text-xs font-bold mb-0.5">{comment.user?.name}</p>
                    <p className="text-sm leading-relaxed">{comment.body}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1 px-1">{relativeTime(comment.created_at)}</p>
                </div>
              </div>
            ))}
            <div className="flex gap-2.5 pt-1">
              <Avatar className="w-7 h-7 shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">T</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex gap-2 bg-muted/50 rounded-2xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/30 transition-all">
                <input
                  placeholder="Escribe un comentario..."
                  className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleComment()}
                />
                <button onClick={handleComment} disabled={!commentText.trim() || posting}
                  className="btn-press shrink-0 disabled:opacity-30 transition-all">
                  <Send className={cn("w-4 h-4", commentText.trim() ? "text-primary" : "text-muted-foreground")} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
