"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Send } from "lucide-react";
import { HUESCA_POSTS, HUESCA_USERS } from "@/lib/huesca-data";
import { PostCard } from "@/components/feed/PostCard";
import { useToast } from "@/context/ToastContext";
import { avatarColor } from "@/lib/avatar-color";

interface DetailComment {
  id: number;
  author: string;
  username: string;
  body: string;
  time: string;
  likes: number;
}

const DEMO_COMMENTS: DetailComment[] = [
  {
    id: 1,
    author: "María García",
    username: "mariagarcia",
    body: "¡Totalmente de acuerdo! Las croquetas son su plato estrella. También recomiendo las vieiras, impresionantes.",
    time: "hace 30m",
    likes: 8,
  },
  {
    id: 2,
    author: "Carlos Mendez",
    username: "carlosmendez",
    body: "¿Qué precio tienen más o menos? Quiero ir con mi pareja este finde.",
    time: "hace 1h",
    likes: 2,
  },
  {
    id: 3,
    author: "Pablo Torres",
    username: "pablotorres",
    body: "Tatau es siempre un acierto. Cada vez que voy descubro algo nuevo. Los postres de temporada están increíbles.",
    time: "hace 2h",
    likes: 12,
  },
  {
    id: 4,
    author: "Elena Ruiz",
    username: "elenaruiz",
    body: "Me alegra que lo hayas descubierto. Es uno de los mejores secretos de la ciudad 🍽️",
    time: "hace 3h",
    likes: 5,
  },
  {
    id: 5,
    author: "Ayuntamiento de Huesca",
    username: "ayuntamientohuesca",
    body: "¡Gracias por apoyar el comercio local! Huesca tiene una oferta gastronómica excelente.",
    time: "hace 5h",
    likes: 19,
  },
];

// Build a minimal Post-shaped object for PostCard from HUESCA_POSTS entry
function buildPost(raw: (typeof HUESCA_POSTS)[number]) {
  const user = HUESCA_USERS.find((u) => u.id === raw.user_id) || HUESCA_USERS[0];
  return {
    ...raw,
    user: {
      id: user.id,
      supabase_id: String(user.id),
      email: `${user.username}@city.es`,
      name: user.name,
      username: user.username,
      avatar_url: user.avatar_url,
      banner_url: null,
      bio: user.bio,
      website_url: null,
      instagram_url: null,
      profile_completed: true,
      is_private: false,
      posts_count: user.posts_count,
      followers_count: user.followers_count,
      following_count: user.following_count,
      is_admin: false,
      is_verified: user.is_verified,
      created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    },
    is_liked: false,
    is_bookmarked: false,
  };
}

export default function PostDetailPage() {
  const { postId } = useParams();
  const router = useRouter();
  const { success } = useToast();

  const rawPost = HUESCA_POSTS.find((p) => String(p.id) === String(postId));
  const post = rawPost ? buildPost(rawPost) : null;

  const [comments, setComments] = useState<DetailComment[]>(DEMO_COMMENTS);
  const [commentText, setCommentText] = useState("");
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());

  const handleSendComment = () => {
    if (!commentText.trim()) return;
    const newComment: DetailComment = {
      id: Date.now(),
      author: "Tú",
      username: "tu",
      body: commentText,
      time: "ahora",
      likes: 0,
    };
    setComments([newComment, ...comments]);
    setCommentText("");
    success("Comentario publicado");
  };

  const handleLikeComment = (id: number) => {
    setLikedComments((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-xl font-black mb-2">Publicación no encontrada</p>
        <p className="text-muted-foreground mb-6 text-sm">
          Esta publicación no existe o ha sido eliminada.
        </p>
        <Link href="/feed">
          <Button className="rounded-full bg-primary font-bold">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Volver al tablón
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 font-semibold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Volver
      </button>

      {/* Full post card */}
      <div className="mb-6">
        <PostCard post={post} />
      </div>

      {/* Comments section */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <h2 className="text-base font-black mb-4">
          Comentarios <span className="text-muted-foreground font-normal text-sm">({comments.length})</span>
        </h2>

        {/* Comment list */}
        <div className="space-y-4 mb-5">
          {comments.map((comment) => {
            const huescaUser = HUESCA_USERS.find((u) => u.username === comment.username);
            const isLiked = likedComments.has(comment.id);
            return (
              <div key={comment.id} className="flex gap-3">
                <Link href={huescaUser ? `/profile/${huescaUser.id}` : "#"} className="shrink-0">
                  <Avatar className="w-9 h-9">
                    <AvatarFallback className={`text-sm font-bold ${avatarColor(comment.username)}`}>
                      {comment.author.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="bg-muted/50 rounded-2xl px-4 py-2.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Link
                        href={huescaUser ? `/profile/${huescaUser.id}` : "#"}
                        className="text-sm font-black hover:underline leading-none"
                      >
                        {comment.author}
                      </Link>
                      <span className="text-xs text-muted-foreground">@{comment.username}</span>
                    </div>
                    <p className="text-sm leading-relaxed">{comment.body}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-1 px-2 text-xs text-muted-foreground">
                    <span>{comment.time}</span>
                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      className={`flex items-center gap-1 font-semibold hover:text-foreground transition-colors ${isLiked ? "text-red-500" : ""}`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-current" : ""}`} />
                      {comment.likes + (isLiked ? 1 : 0)}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comment input */}
        <div className="flex gap-3 items-center border-t border-border pt-4">
          <Avatar className="w-9 h-9 shrink-0">
            <AvatarFallback className={`text-sm font-bold ${avatarColor("tu")}`}>T</AvatarFallback>
          </Avatar>
          <div className="flex-1 flex gap-2">
            <Input
              placeholder="Añade un comentario..."
              className="rounded-full"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
            />
            <Button
              onClick={handleSendComment}
              disabled={!commentText.trim()}
              className="rounded-full bg-primary hover:bg-primary/90 shrink-0 btn-press"
            >
              <Send className="w-4 h-4" />
              <span className="sr-only">Comentar</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
