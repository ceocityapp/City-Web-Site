"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Search, Check } from "lucide-react";
import { HUESCA_USERS } from "@/lib/huesca-data";

type TabType = "followers" | "following";

const DEMO_FOLLOWERS = HUESCA_USERS.slice(0, 6);
const DEMO_FOLLOWING = HUESCA_USERS.slice(1, 5);

export default function FollowersPage() {
  const [tab, setTab] = useState<TabType>("followers");
  const [search, setSearch] = useState("");
  const [following, setFollowing] = useState<Set<number>>(new Set(DEMO_FOLLOWING.map((u) => u.id)));

  const users = tab === "followers" ? DEMO_FOLLOWERS : DEMO_FOLLOWING;
  const filtered = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.username.toLowerCase().includes(search.toLowerCase()));

  const toggleFollow = (id: number) => {
    setFollowing((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Link href="/profile" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Mi perfil
      </Link>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-muted rounded-full p-1">
        <button
          onClick={() => setTab("followers")}
          className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${tab === "followers" ? "bg-card shadow-sm" : "text-muted-foreground"}`}
        >
          Seguidores <span className="text-muted-foreground font-normal ml-1">{DEMO_FOLLOWERS.length}</span>
        </button>
        <button
          onClick={() => setTab("following")}
          className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${tab === "following" ? "bg-card shadow-sm" : "text-muted-foreground"}`}
        >
          Siguiendo <span className="text-muted-foreground font-normal ml-1">{DEMO_FOLLOWING.length}</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Buscar personas..." className="pl-9 rounded-full h-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* User list */}
      <div className="space-y-2">
        {filtered.map((user) => {
          const isFollowing = following.has(user.id);
          return (
            <div key={user.id} className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3 hover:shadow-sm transition-all">
              <Link href={`/profile/${user.id}`} className="shrink-0">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Link>
              <Link href={`/profile/${user.id}`} className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-sm truncate">{user.name}</p>
                  {user.is_verified && <Check className="w-4 h-4 text-primary shrink-0" />}
                </div>
                <p className="text-xs text-muted-foreground">@{user.username}</p>
                {user.bio && <p className="text-xs text-foreground/70 line-clamp-1 mt-0.5">{user.bio}</p>}
              </Link>
              <Button
                size="sm"
                onClick={() => toggleFollow(user.id)}
                className={`rounded-full font-bold shrink-0 ${
                  isFollowing
                    ? "bg-card text-foreground border border-border hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                    : "bg-foreground text-white hover:bg-foreground/90"
                }`}
              >
                {isFollowing ? "Siguiendo" : "Seguir"}
              </Button>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="font-bold">No se encontraron personas</p>
        </div>
      )}
    </div>
  );
}
