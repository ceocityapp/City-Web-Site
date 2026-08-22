"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BoostDialog } from "@/components/shared/BoostDialog";
import { useToast } from "@/context/ToastContext";
import {
  ArrowLeft, Users, Globe, Lock, Send, MessageCircle, Heart, Pin,
  Image as ImageIcon, MoreHorizontal, Check, Zap, Settings,
  Bell, BellOff, Crown, ShieldCheck, UserPlus,
} from "lucide-react";
import { HUESCA_COMMUNITIES } from "@/lib/huesca-data";
import { imageFallback } from "@/lib/image-fallback";
import { avatarColor } from "@/lib/avatar-color";
import { cn } from "@/lib/utils";

type Post = { id: number; author: string; username: string; text: string; image: string | null; likes: number; comments: number; pinned: boolean; time: string };
type Message = { id: number; sender: string; text: string; time: string; isMe: boolean };

const CATEGORY_THEMES: Record<string, { gradient: string; accent: string; icon: string }> = {
  "Deportes":      { gradient: "from-emerald-500 via-green-600 to-teal-700",   accent: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-800", icon: "🏃" },
  "Gastronomía":   { gradient: "from-amber-500 via-orange-500 to-red-600",      accent: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-800",       icon: "🍽️" },
  "Arte y Cultura":{ gradient: "from-violet-500 via-purple-600 to-indigo-700",  accent: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/20 border-violet-100 dark:border-violet-800",    icon: "🎨" },
  "Familia":       { gradient: "from-rose-400 via-pink-500 to-fuchsia-600",     accent: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-800",          icon: "👨‍👩‍👧" },
  "Negocios":      { gradient: "from-sky-500 via-blue-600 to-indigo-700",       accent: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-800",          icon: "💼" },
};

function generateCommunityPosts(community: typeof HUESCA_COMMUNITIES[0]): Post[] {
  const cat = community.category;
  const name = community.name;
  if (cat === "Deportes" && name.includes("Senderistas")) return [
    { id: 1, author: "Pablo Torres", username: "pablotorres", text: "¡Este fin de semana descubrí una ruta increíble por el Salto de Roldán! Las vistas son espectaculares.", image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80", likes: 18, comments: 5, pinned: true, time: "hace 2h" },
    { id: 2, author: "María García", username: "mariagarcia", text: "¿Alguien se apunta a la ruta del Pico del Águila el sábado? Salida a las 8:00 desde el parking del parque.", image: null, likes: 12, comments: 8, pinned: false, time: "hace 5h" },
    { id: 3, author: "Carlos Mendez", username: "carlosmendez", text: "Fotos del atardecer desde el Mirador de los Buitres ayer. Una pasada total.", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", likes: 32, comments: 11, pinned: false, time: "hace 1d" },
  ];
  if (cat === "Gastronomía") return [
    { id: 1, author: "Ana López", username: "analopez", text: "Acabo de probar el nuevo menú degustación de Tatau Bistro. Las croquetas de rabo de toro son una obra maestra.", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80", likes: 45, comments: 12, pinned: true, time: "hace 1h" },
    { id: 2, author: "Carlos Mendez", username: "carlosmendez", text: "¿Alguien ha probado el nuevo restaurante de tapas en el Coso Alto? ¿Merece la pena?", image: null, likes: 8, comments: 15, pinned: false, time: "hace 4h" },
    { id: 3, author: "María García", username: "mariagarcia", text: "Receta del día: migas a la oscense con uvas y chorizo. Plato de nuestra tierra que nunca falla.", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", likes: 27, comments: 9, pinned: false, time: "hace 1d" },
  ];
  if (cat === "Arte y Cultura") return [
    { id: 1, author: "Elena Ruiz", username: "elenaruiz", text: "Atardecer desde el Mirador de los Mallos de Riglos. Sin filtros, sin edición. La naturaleza es la mejor artista.", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", likes: 56, comments: 14, pinned: true, time: "hace 2h" },
    { id: 2, author: "María García", username: "mariagarcia", text: "Salida fotográfica este domingo por el Casco Antiguo. Tema: puertas y ventanas. ¿Os apuntáis?", image: null, likes: 18, comments: 7, pinned: false, time: "hace 5h" },
    { id: 3, author: "Pablo Torres", username: "pablotorres", text: "Serie nocturna de la Catedral de Huesca. Larga exposición con trípode.", image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=600&q=80", likes: 41, comments: 9, pinned: false, time: "hace 1d" },
  ];
  return [
    { id: 1, author: "María García", username: "mariagarcia", text: `¡Bienvenidos a ${community.name}! Encantada de formar parte de esta comunidad.`, image: null, likes: 15, comments: 3, pinned: true, time: "hace 2h" },
    { id: 2, author: "Pablo Torres", username: "pablotorres", text: "¿Qué planes tenéis para este fin de semana? ¡Proponed ideas!", image: null, likes: 8, comments: 6, pinned: false, time: "hace 5h" },
    { id: 3, author: "Carlos Mendez", username: "carlosmendez", text: "Comparto un enlace interesante que encontré. Seguro que os gustará.", image: null, likes: 12, comments: 4, pinned: false, time: "hace 1d" },
  ];
}

function generateCommunityMessages(community: typeof HUESCA_COMMUNITIES[0]): Message[] {
  const cat = community.category;
  if (cat === "Deportes") return [
    { id: 1, sender: "Pablo", text: "¿Alguien sabe si la ruta del río está transitable después de las lluvias?", time: "10:30", isMe: false },
    { id: 2, sender: "María", text: "Sí, fui ayer y estaba perfecta. Solo hay un tramo un poco embarrado.", time: "10:45", isMe: false },
    { id: 3, sender: "Tú", text: "¡Genial! Entonces voy este finde 🏃‍♂️", time: "11:02", isMe: true },
  ];
  if (cat === "Gastronomía") return [
    { id: 1, sender: "Ana", text: "¿Habéis probado las nuevas tapas del Rincón del Jamón?", time: "12:00", isMe: false },
    { id: 2, sender: "Tú", text: "Sí, las croquetas de boletus están increíbles 😍", time: "12:15", isMe: true },
    { id: 3, sender: "María", text: "Tengo que ir. ¿Aceptan reservas para grupos?", time: "12:20", isMe: false },
  ];
  return [
    { id: 1, sender: "Pablo", text: `¡Hola! ¿Qué tal todo?`, time: "10:00", isMe: false },
    { id: 2, sender: "Tú", text: "¡Todo genial! Encantada de estar aquí 😊", time: "10:15", isMe: true },
    { id: 3, sender: "Elena", text: "¡Bienvenidos todos!", time: "10:30", isMe: false },
  ];
}

const DEMO_MEMBERS = [
  { id: 1, name: "Pablo Torres", username: "pablotorres", role: "admin" },
  { id: 2, name: "María García", username: "mariagarcia", role: "admin" },
  { id: 3, name: "Carlos Mendez", username: "carlosmendez", role: "member" },
  { id: 4, name: "Elena Ruiz", username: "elenaruiz", role: "member" },
  { id: 5, name: "Ana López", username: "analopez", role: "member" },
  { id: 6, name: "Luis Fernández", username: "luisfernandez", role: "member" },
];

export default function CommunityDetailPage() {
  const { communityId } = useParams();
  const { success } = useToast();
  const community = HUESCA_COMMUNITIES.find(c => c.id === Number(communityId)) || HUESCA_COMMUNITIES[0];
  const theme = CATEGORY_THEMES[community.category] || CATEGORY_THEMES["Deportes"];

  const [isMember, setIsMember] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [newPostText, setNewPostText] = useState("");
  const [posts, setPosts] = useState(generateCommunityPosts(community));
  const [messages, setMessages] = useState(generateCommunityMessages(community));
  const [newMessage, setNewMessage] = useState("");
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [heartAnim, setHeartAnim] = useState<Set<number>>(new Set());
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleJoin = async () => {
    setJoinLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setIsMember(m => !m);
    setJoinLoading(false);
    if (!isMember) success("¡Bienvenido/a!", `Te has unido a ${community.name}`);
  };

  const handleLikePost = (postId: number) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId); else { next.add(postId); setHeartAnim(h => { const hn = new Set(h); hn.add(postId); setTimeout(() => setHeartAnim(hh => { const hhn = new Set(hh); hhn.delete(postId); return hhn; }), 500); return hn; }); }
      return next;
    });
  };

  const handleNewPost = () => {
    if (!newPostText.trim()) return;
    setPosts(p => [{ id: Date.now(), author: "Tú", username: "tu", text: newPostText, image: null, likes: 0, comments: 0, pinned: false, time: "ahora" }, ...p]);
    setNewPostText("");
    success("Publicado", "Tu post se ha compartido en la comunidad");
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const now = new Date();
    setMessages(m => [...m, { id: Date.now(), sender: "Tú", text: newMessage, time: `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`, isMe: true }]);
    setNewMessage("");
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Banner */}
      <div className={cn("relative overflow-hidden bg-gradient-to-br", theme.gradient)}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, white 0%, transparent 50%), radial-gradient(circle at 80% 20%, white 0%, transparent 50%)" }} />
        <div className="relative px-6 pt-6 pb-8">
          <Link href="/communities" className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white mb-5 btn-press">
            <ArrowLeft className="w-4 h-4" /> Comunidades
          </Link>
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center shadow-xl shrink-0 text-4xl">
              {theme.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl font-black text-white">{community.name}</h1>
                {community.status === "public"
                  ? <Globe className="w-4 h-4 text-white/70" />
                  : <Lock className="w-4 h-4 text-white/70" />}
              </div>
              <p className="text-white/70 text-sm mb-1">{community.members_count.toLocaleString("es-ES")} miembros · {community.category}</p>
              <p className="text-white/85 text-sm leading-relaxed">{community.description}</p>
            </div>
          </div>

          {/* Action row */}
          <div className="flex items-center gap-3 mt-5 flex-wrap">
            <button
              onClick={handleJoin}
              disabled={joinLoading}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm shadow-lg transition-all btn-press",
                isMember
                  ? "bg-white/15 backdrop-blur text-white border border-white/30 hover:bg-white/25"
                  : "bg-white text-foreground hover:shadow-xl"
              )}
            >
              {joinLoading
                ? <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                : isMember ? <><Check className="w-4 h-4 text-green-400" /> Miembro</> : <><UserPlus className="w-4 h-4" /> Unirse</>}
            </button>

            {isMember && (
              <button onClick={() => setNotificationsOn(n => !n)}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-full font-bold text-xs text-white/80 bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 transition-all btn-press">
                {notificationsOn ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
              </button>
            )}

            <BoostDialog targetType="page" trigger={
              <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-full font-bold text-xs bg-amber-400/90 text-white shadow-lg hover:shadow-xl transition-all btn-press ml-auto boost-glow">
                <Zap className="w-3.5 h-3.5" /> Impulsar
              </button>
            } />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 sm:px-6 py-5">
        <Tabs defaultValue="feed">
          <TabsList className="w-full bg-card border border-border rounded-2xl h-12 p-1 mb-5 shadow-sm">
            <TabsTrigger value="feed" className="flex-1 rounded-xl font-bold data-[state=active]:bg-foreground data-[state=active]:text-white transition-all">
              📋 Feed
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex-1 rounded-xl font-bold data-[state=active]:bg-foreground data-[state=active]:text-white transition-all">
              💬 Chat
            </TabsTrigger>
            <TabsTrigger value="members" className="flex-1 rounded-xl font-bold data-[state=active]:bg-foreground data-[state=active]:text-white transition-all">
              👥 Miembros
            </TabsTrigger>
          </TabsList>

          {/* FEED TAB */}
          <TabsContent value="feed" className="space-y-4 stagger-children">
            {/* Composer */}
            <div className="bg-card rounded-2xl border border-border/60 p-4 shadow-sm">
              <div className="flex gap-3">
                <Avatar className="w-10 h-10 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">T</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="¿Qué quieres compartir con la comunidad?"
                    className="rounded-xl resize-none min-h-[72px] mb-3 text-sm focus-visible:ring-primary/30 border-border/60"
                    value={newPostText}
                    onChange={e => setNewPostText(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleNewPost(); }}
                  />
                  <div className="flex items-center justify-between">
                    <button className="text-muted-foreground hover:text-primary p-1.5 rounded-lg hover:bg-primary/5 transition-colors btn-press">
                      <ImageIcon className="w-5 h-5" />
                    </button>
                    <Button size="sm" onClick={handleNewPost} disabled={!newPostText.trim()}
                      className="rounded-full bg-primary font-bold shadow hover:shadow-md glow-primary btn-press px-5">
                      Publicar
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts */}
            {posts.map((post, i) => (
              <article
                key={post.id}
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
                className={cn(
                  "bg-card rounded-2xl border p-5 shadow-sm slide-up transition-all hover:shadow-md",
                  post.pinned ? "border-amber-200 ring-1 ring-amber-100 bg-gradient-to-br from-amber-50/50 to-card" : "border-border/60"
                )}
              >
                {post.pinned && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <Pin className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-bold text-amber-600">Fijado por el admin</span>
                  </div>
                )}
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="w-10 h-10 ring-2 ring-border">
                    <AvatarFallback className={cn(avatarColor(post.username), "text-sm font-bold")}>
                      {post.author.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{post.author}</p>
                    <p className="text-xs text-muted-foreground">@{post.username} · {post.time}</p>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted btn-press">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm mb-3 leading-relaxed whitespace-pre-wrap">{post.text}</p>
                {post.image && (
                  <div className="rounded-2xl overflow-hidden mb-3 bg-muted">
                    <img src={post.image} alt="" onError={imageFallback} loading="lazy" decoding="async"
                      className="w-full object-cover max-h-80 hover:scale-[1.02] transition-transform duration-300" />
                  </div>
                )}
                <div className="flex gap-1 pt-3 border-t border-border/50">
                  <button onClick={() => handleLikePost(post.id)}
                    className={cn("btn-press flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all",
                      likedPosts.has(post.id) ? "text-red-500 bg-red-50" : "text-muted-foreground hover:bg-muted")}>
                    <Heart className={cn("w-4 h-4", heartAnim.has(post.id) && "heart-pop", likedPosts.has(post.id) && "fill-current")} />
                    <span className="tabular-nums">{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                  </button>
                  <button className="btn-press flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-muted transition-all">
                    <MessageCircle className="w-4 h-4" />
                    <span className="tabular-nums">{post.comments}</span>
                  </button>
                </div>
              </article>
            ))}
          </TabsContent>

          {/* CHAT TAB */}
          <TabsContent value="chat">
            <div className="bg-card rounded-2xl border border-border/60 overflow-hidden shadow-sm">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border/60 bg-muted/30">
                <div className="w-2 h-2 rounded-full bg-primary pulse-ring" />
                <span className="text-sm font-bold">{community.members_count} miembros en línea</span>
              </div>
              <div className="h-96 overflow-y-auto p-4 space-y-3">
                {messages.map(msg => (
                  <div key={msg.id} className={cn("flex gap-2.5 slide-up", msg.isMe && "flex-row-reverse")}>
                    {!msg.isMe && (
                      <Avatar className="w-8 h-8 shrink-0">
                        <AvatarFallback className={cn(avatarColor(msg.sender), "text-xs font-bold")}>
                          {msg.sender.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className={cn("max-w-[75%]", msg.isMe && "items-end flex flex-col")}>
                      {!msg.isMe && <p className="text-xs font-semibold text-muted-foreground mb-1 px-1">{msg.sender}</p>}
                      <div className={cn("px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                        msg.isMe
                          ? "bg-primary text-white rounded-br-sm"
                          : "bg-muted rounded-bl-sm")}>
                        {msg.text}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 px-1">{msg.time}</p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="border-t border-border/60 p-3 flex gap-2 bg-muted/20">
                <div className="flex-1 flex items-center gap-2 bg-card rounded-2xl px-4 py-2 border border-border/60 focus-within:ring-2 focus-within:ring-primary/30 transition-all">
                  <input
                    placeholder="Escribe un mensaje..."
                    className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                  />
                </div>
                <Button
                  className="rounded-2xl bg-primary font-bold shrink-0 w-11 h-11 p-0 shadow hover:shadow-md glow-primary btn-press"
                  disabled={!newMessage.trim()}
                  onClick={handleSendMessage}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* MEMBERS TAB */}
          <TabsContent value="members">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DEMO_MEMBERS.map(member => (
                <Link key={member.id} href={`/profile/${member.id}`}
                  className="flex items-center gap-3 p-4 bg-card rounded-2xl border border-border/60 hover:border-primary/20 hover:shadow-md transition-all group btn-press">
                  <Avatar className="w-11 h-11 ring-2 ring-border group-hover:ring-primary/30 transition-all">
                    <AvatarFallback className={cn(avatarColor(member.username), "text-sm font-bold")}>
                      {member.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{member.name}</p>
                    <p className="text-xs text-muted-foreground">@{member.username}</p>
                  </div>
                  {member.role === "admin" && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-primary">
                      <Crown className="w-3 h-3" />
                      <span className="text-[10px] font-bold">Admin</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
