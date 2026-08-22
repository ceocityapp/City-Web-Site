"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, X, FileText, MessageSquare, Briefcase, User, ShoppingBag, ArrowRight, Clock, Trash2 } from "lucide-react";
import { HUESCA_USERS, HUESCA_SHOPS, HUESCA_POSTS, HUESCA_JOBS } from "@/lib/huesca-data";

const RECENT_KEY = "city-recent-searches";
const MAX_RECENT = 5;

function loadRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENT) : [];
  } catch { return []; }
}

function saveRecent(q: string) {
  try {
    const trimmed = q.trim();
    if (!trimmed) return;
    const current = loadRecent();
    const next = [trimmed, ...current.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch { /* noop */ }
}

const SUGGESTED_QUERIES = ["San Lorenzo", "Cafetería", "Senderismo", "Trabajos", "Eventos fin de semana"];

type SearchTab = "all" | "posts" | "forums" | "jobs" | "users" | "shops";

const TABS: { key: SearchTab; label: string; icon: typeof FileText }[] = [
  { key: "all", label: "Todo", icon: Search },
  { key: "posts", label: "Posts", icon: FileText },
  { key: "forums", label: "Foros", icon: MessageSquare },
  { key: "jobs", label: "Trabajo", icon: Briefcase },
  { key: "users", label: "Personas", icon: User },
  { key: "shops", label: "Tiendas", icon: ShoppingBag },
];

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<SearchTab>("all");
  const [recent, setRecent] = useState<string[]>([]);
  const [lastOpen, setLastOpen] = useState(open);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset/load state when `open` transitions (state-during-render pattern)
  if (lastOpen !== open) {
    setLastOpen(open);
    if (open) {
      setRecent(loadRecent());
    } else {
      setQuery("");
      setActiveTab("all");
    }
  }

  // Auto-focus input when opened
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Escape closes overlay
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  // Derive `showResults` from `query` instead of storing in state
  const showResults = query.trim().length >= 2;

  const q = query.toLowerCase();
  const filteredUsers = HUESCA_USERS.filter((u) => u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q));
  const filteredShops = HUESCA_SHOPS.filter((s) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
  const filteredPosts = HUESCA_POSTS.filter((p) => (p.body && p.body.toLowerCase().includes(q)) || (p.title && p.title.toLowerCase().includes(q)));
  const filteredJobs = HUESCA_JOBS.filter((j) => j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q));

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="max-w-2xl mx-auto mt-20 bg-popover rounded-2xl border border-border shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 h-14 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            placeholder="Buscar en City App..."
            className="flex-1 text-base outline-none bg-transparent"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Cerrar" className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="text-sm text-muted-foreground font-medium hover:text-foreground">Esc</button>
        </div>

        {/* Tabs */}
        {showResults && (
          <div className="flex gap-1 px-4 py-2 border-b border-border overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab.key ? "bg-foreground text-white" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <tab.icon className="w-3 h-3" /> {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {!showResults ? (
            <div className="p-4">
              {recent.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between px-2 mb-2">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> Recientes
                    </p>
                    <button
                      onClick={() => { localStorage.removeItem(RECENT_KEY); setRecent([]); }}
                      aria-label="Borrar historial de búsquedas"
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Borrar
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recent.map((r) => (
                      <button
                        key={r}
                        onClick={() => { setQuery(r); saveRecent(r); setRecent(loadRecent()); }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted transition-colors text-left text-sm"
                      >
                        <Clock className="w-4 h-4 text-muted-foreground/40" />
                        <span className="flex-1 truncate">{r}</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground/40" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide px-2 mb-2">Sugerencias</p>
                <div className="flex flex-wrap gap-2 px-2">
                  {SUGGESTED_QUERIES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setQuery(s)}
                      className="px-3 py-1.5 rounded-full text-xs font-bold bg-muted hover:bg-muted/70 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 space-y-4">
              {/* Users */}
              {(activeTab === "all" || activeTab === "users") && filteredUsers.length > 0 && (
                <div>
                  {activeTab === "all" && <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide px-2 mb-2">Personas</p>}
                  {filteredUsers.map((user) => (
                    <Link key={user.id} href={`/profile/${user.id}`} onClick={() => { saveRecent(query); onClose(); }} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors">
                      <Avatar className="w-10 h-10"><AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">{user.name.charAt(0)}</AvatarFallback></Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">{user.name}</p>
                        <p className="text-xs text-muted-foreground">@{user.username}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground/40" />
                    </Link>
                  ))}
                </div>
              )}

              {/* Posts */}
              {(activeTab === "all" || activeTab === "posts") && filteredPosts.length > 0 && (
                <div>
                  {activeTab === "all" && <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide px-2 mb-2">Posts</p>}
                  {filteredPosts.map((post) => (
                    <Link key={post.id} href={`/post/${post.id}`} onClick={() => { saveRecent(query); onClose(); }} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{post.title || post.body?.slice(0, 60)}</p>
                        <p className="text-xs text-muted-foreground">{post.post_type === "forum" ? "Foro" : post.post_type === "job" ? "Trabajo" : post.post_type === "event" ? "Evento" : "Post"}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Jobs */}
              {(activeTab === "all" || activeTab === "jobs") && filteredJobs.length > 0 && (
                <div>
                  {activeTab === "all" && <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide px-2 mb-2">Trabajo</p>}
                  {filteredJobs.map((job) => (
                    <Link key={job.id} href={`/jobs/${job.id}`} onClick={() => { saveRecent(query); onClose(); }} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center shrink-0">
                        <Briefcase className="w-5 h-5 text-amber-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{job.title}</p>
                        <p className="text-xs text-muted-foreground">{job.company}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Shops */}
              {(activeTab === "all" || activeTab === "shops") && filteredShops.length > 0 && (
                <div>
                  {activeTab === "all" && <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide px-2 mb-2">Tiendas</p>}
                  {filteredShops.map((shop) => (
                    <Link key={shop.id} href={`/marketplace/${shop.id}`} onClick={() => { saveRecent(query); onClose(); }} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <ShoppingBag className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{shop.name}</p>
                        <p className="text-xs text-muted-foreground">{shop.category}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* No results */}
              {filteredUsers.length === 0 && filteredShops.length === 0 && filteredPosts.length === 0 && filteredJobs.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  <Search className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No se encontraron resultados para &quot;{query}&quot;</p>
                </div>
              )}

              {/* Ver todos */}
              {(filteredUsers.length > 0 || filteredShops.length > 0 || filteredPosts.length > 0 || filteredJobs.length > 0) && (
                <div className="border-t border-border pt-3">
                  <Link href={`/search?q=${encodeURIComponent(query)}`} onClick={() => { saveRecent(query); onClose(); }} className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors text-sm font-semibold text-primary">
                    Ver todos los resultados <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
