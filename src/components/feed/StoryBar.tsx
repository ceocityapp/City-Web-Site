"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, X, Heart, Send, Image, Type, Check, Eye } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { imageFallback } from "@/lib/image-fallback";

const DEMO_STORIES = [
  { id: "me", username: "Tu historia", avatar: null, isOwn: true, hasStory: false, images: [] as string[] },
  {
    id: "1", username: "mariagarcia", avatar: null, hasStory: true, isOwn: false,
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80",
      "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&q=80",
    ],
  },
  {
    id: "2", username: "pablotorres", avatar: null, hasStory: true, isOwn: false,
    images: [
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    ],
  },
  {
    id: "3", username: "cafecentral", avatar: null, hasStory: true, isOwn: false,
    images: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
      "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&q=80",
    ],
  },
  {
    id: "4", username: "elenaruiz", avatar: null, hasStory: true, isOwn: false,
    images: [
      "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800&q=80",
      "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80",
    ],
  },
  {
    id: "5", username: "ayuntamiento", avatar: null, hasStory: true, isOwn: false,
    images: [
      "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80",
    ],
  },
  { id: "6", username: "carlosmendez", avatar: null, hasStory: false, isOwn: false, images: [] as string[] },
  { id: "7", username: "analopez", avatar: null, hasStory: false, isOwn: false, images: [] as string[] },
];

const STORY_DURATION = 5000;

/** Stable fake view count per story id */
function fakeViews(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return 12 + (Math.abs(h) % 78); // range 12-89
}

export function StoryBar() {
  const [viewingStory, setViewingStory] = useState<typeof DEMO_STORIES[0] | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [viewedStories, setViewedStories] = useState<Set<string>>(new Set());
  const [sentConfirmation, setSentConfirmation] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [storyImageUrl, setStoryImageUrl] = useState("");
  const [storyCaption, setStoryCaption] = useState("");
  const [storyPublished, setStoryPublished] = useState(false);
  const [paused, setPaused] = useState(false);
  const [fadeKey, setFadeKey] = useState(0);

  // Auto-advance timer ref
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressStartRef = useRef(Date.now());
  const remainingRef = useRef(STORY_DURATION);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const advanceImage = useCallback(() => {
    if (!viewingStory) return;
    const total = viewingStory.images.length;
    setImageIndex((prev) => {
      const next = prev + 1;
      if (next < total) {
        setFadeKey((k) => k + 1);
        return next;
      }
      // All images seen, go to next story
      const idx = DEMO_STORIES.findIndex((s) => s.id === viewingStory.id);
      const nextStory = DEMO_STORIES.slice(idx + 1).find((s) => s.hasStory);
      if (nextStory) {
        setViewingStory(nextStory);
        setLiked(false);
        setViewedStories((p) => new Set([...p, nextStory.id]));
        setFadeKey((k) => k + 1);
        return 0;
      }
      // No more stories — auto-close
      setViewingStory(null);
      return 0;
    });
  }, [viewingStory]);

  // Start / restart the auto-advance timer
  useEffect(() => {
    if (!viewingStory || paused) return;
    clearTimer();
    progressStartRef.current = Date.now();
    remainingRef.current = STORY_DURATION;
    timerRef.current = setTimeout(advanceImage, STORY_DURATION);
    return clearTimer;
  }, [viewingStory, imageIndex, paused, advanceImage, clearTimer]);

  // Pause / resume helpers
  const handlePointerDown = useCallback(() => {
    setPaused(true);
    clearTimer();
    remainingRef.current = Math.max(
      0,
      STORY_DURATION - (Date.now() - progressStartRef.current)
    );
  }, [clearTimer]);

  const handlePointerUp = useCallback(() => {
    setPaused(false);
  }, []);

  const openStory = (story: typeof DEMO_STORIES[0]) => {
    if (!story.hasStory) return;
    setViewingStory(story);
    setImageIndex(0);
    setLiked(false);
    setFadeKey((k) => k + 1);
    setViewedStories((prev) => new Set([...prev, story.id]));
  };

  const nextImage = () => {
    if (!viewingStory) return;
    const total = viewingStory.images.length;
    if (imageIndex + 1 < total) {
      setImageIndex((i) => i + 1);
      setFadeKey((k) => k + 1);
    } else {
      // Go to next story
      const idx = DEMO_STORIES.findIndex((s) => s.id === viewingStory.id);
      const next = DEMO_STORIES.slice(idx + 1).find((s) => s.hasStory);
      if (next) {
        openStory(next);
      } else {
        setViewingStory(null);
      }
    }
  };

  const prevImage = () => {
    if (!viewingStory) return;
    if (imageIndex > 0) {
      setImageIndex((i) => i - 1);
      setFadeKey((k) => k + 1);
    } else {
      // Go to prev story
      const idx = DEMO_STORIES.findIndex((s) => s.id === viewingStory.id);
      const prev = DEMO_STORIES.slice(0, idx).reverse().find((s) => s.hasStory);
      if (prev) openStory(prev);
    }
  };

  const handleSend = () => {
    setSentConfirmation(true);
    setTimeout(() => setSentConfirmation(false), 1500);
  };

  const handleOwnStoryClick = () => {
    setShowCreateDialog(true);
    setStoryPublished(false);
    setStoryImageUrl("");
    setStoryCaption("");
  };

  const handlePublishStory = () => {
    if (!storyImageUrl.trim()) return;
    setStoryPublished(true);
    setTimeout(() => {
      setShowCreateDialog(false);
      setStoryPublished(false);
    }, 1500);
  };

  const viewCount = useMemo(
    () => (viewingStory ? fakeViews(viewingStory.id) : 0),
    [viewingStory]
  );

  return (
    <>
      {/* ── Story avatar row ──────────────────────────── */}
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        {DEMO_STORIES.map((story) => {
          const unseen = story.hasStory && !viewedStories.has(story.id);
          const seen = story.hasStory && viewedStories.has(story.id);

          return (
            <button
              key={story.id}
              onClick={() => story.isOwn ? handleOwnStoryClick() : openStory(story)}
              className="flex flex-col items-center gap-1.5 shrink-0 group btn-press"
            >
              <div className="relative hover:scale-105 transition-transform">
                <div
                  className={`w-16 h-16 rounded-full p-[2.5px] ${
                    story.isOwn
                      ? "border-2 border-dashed border-border"
                      : unseen
                      ? "bg-gradient-to-br from-primary via-emerald-400 to-teal-500"
                      : seen
                      ? "bg-muted-foreground/30"
                      : "border-2 border-dashed border-border"
                  }`}
                >
                  <div className="w-full h-full rounded-full bg-card p-[2px]">
                    <Avatar className="w-full h-full">
                      <AvatarImage src={story.avatar || undefined} />
                      <AvatarFallback
                        className={`text-xs font-bold ${
                          story.hasStory
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {story.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                {story.isOwn && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center border-2 border-background">
                    <Plus className="w-3 h-3" />
                  </div>
                )}
              </div>
              <span
                className={`text-[10px] max-w-16 truncate leading-tight ${
                  story.isOwn
                    ? "font-semibold"
                    : viewedStories.has(story.id)
                    ? "text-muted-foreground"
                    : "font-medium"
                }`}
              >
                {story.isOwn ? "Tu historia" : story.username}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Create Story Dialog ───────────────────────── */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent
          showCloseButton={false}
          className="max-w-md p-0 gap-0 rounded-2xl overflow-hidden border-0"
        >
          {storyPublished ? (
            <div className="p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4 success-pop">
                <Check className="w-8 h-8 text-white" />
              </div>
              <p className="text-lg font-black">¡Historia publicada!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Tu historia será visible durante 24 horas
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="font-black text-lg">Crear historia</h2>
                <button
                  onClick={() => setShowCreateDialog(false)}
                  aria-label="Cerrar"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Image preview area */}
              <div className="aspect-[9/16] max-h-[320px] bg-muted/30 relative flex items-center justify-center mx-4 mt-4 rounded-xl overflow-hidden">
                {storyImageUrl ? (
                  <img
                    key={storyImageUrl}
                    src={storyImageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover animate-in fade-in-0 duration-300"
                    onError={imageFallback}
                  />
                ) : (
                  <div className="text-center p-6">
                    <Image className="w-10 h-10 mx-auto mb-2 text-muted-foreground/40" />
                    <p className="text-sm font-bold text-muted-foreground">
                      Añade una imagen
                    </p>
                    <p className="text-xs text-muted-foreground/60">
                      Introduce la URL de la imagen abajo
                    </p>
                  </div>
                )}
                {storyCaption && storyImageUrl && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <p className="text-white text-sm font-bold">{storyCaption}</p>
                  </div>
                )}
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <label className="text-xs font-bold mb-1 block flex items-center gap-1">
                    <Image className="w-3 h-3" /> URL de imagen
                  </label>
                  <Input
                    placeholder="https://ejemplo.com/foto.jpg"
                    className="rounded-xl"
                    value={storyImageUrl}
                    onChange={(e) => setStoryImageUrl(e.target.value)}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold flex items-center gap-1">
                      <Type className="w-3 h-3" /> Texto (opcional)
                    </label>
                    <span
                      className={`text-[10px] tabular-nums ${
                        storyCaption.length >= 100
                          ? "text-destructive font-bold"
                          : "text-muted-foreground"
                      }`}
                    >
                      {storyCaption.length}/100
                    </span>
                  </div>
                  <Input
                    placeholder="Añade un texto a tu historia..."
                    className="rounded-xl"
                    value={storyCaption}
                    onChange={(e) => setStoryCaption(e.target.value)}
                    maxLength={100}
                  />
                </div>
                <Button
                  className="w-full rounded-full bg-primary font-bold h-11 btn-press"
                  disabled={!storyImageUrl.trim()}
                  onClick={handlePublishStory}
                >
                  Publicar historia
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Story Viewer ──────────────────────────────── */}
      <Dialog open={!!viewingStory} onOpenChange={(v) => !v && setViewingStory(null)}>
        <DialogContent
          showCloseButton={false}
          className="max-w-sm p-0 gap-0 rounded-2xl overflow-hidden bg-black border-0 h-[80vh] max-h-[700px]"
        >
          {viewingStory && (
            <div className="relative w-full h-full select-none">
              {/* Multi-segment progress bar */}
              <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2">
                {viewingStory.images.map((_, i) => (
                  <div key={i} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
                    {i < imageIndex ? (
                      /* Completed segment */
                      <div className="h-full w-full bg-white rounded-full" />
                    ) : i === imageIndex ? (
                      /* Current segment — animating */
                      <div
                        className="h-full bg-white rounded-full"
                        style={{
                          animation: paused
                            ? "none"
                            : `story-progress ${STORY_DURATION}ms linear forwards`,
                          animationPlayState: paused ? "paused" : "running",
                        }}
                      />
                    ) : null /* Upcoming — stays empty (bg-white/30 shows through) */}
                  </div>
                ))}
              </div>

              {/* Header */}
              <div className="absolute top-4 left-0 right-0 z-20 flex items-center gap-3 px-4">
                <Avatar className="w-8 h-8 border-2 border-white">
                  <AvatarFallback className="bg-primary text-white text-xs">
                    {viewingStory.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-white text-sm font-bold">
                  {viewingStory.username}
                </span>
                <button
                  onClick={() => setViewingStory(null)}
                  aria-label="Cerrar"
                  className="ml-auto text-white/80 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Story image with fade transition */}
              <img
                key={`${viewingStory.id}-${imageIndex}-${fadeKey}`}
                src={viewingStory.images[imageIndex]}
                alt=""
                className="w-full h-full object-cover animate-in fade-in-0 duration-300"
                onError={imageFallback}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                draggable={false}
              />

              {/* Navigation zones */}
              <button
                onClick={prevImage}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                aria-label="Anterior"
                className="absolute left-0 top-0 bottom-20 w-1/3 z-10"
              />
              <button
                onClick={nextImage}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                aria-label="Siguiente"
                className="absolute right-0 top-0 bottom-20 w-2/3 z-10"
              />

              {/* View count badge */}
              <div className="absolute bottom-20 left-4 z-20 flex items-center gap-1.5 text-white/70 text-xs">
                <Eye className="w-3.5 h-3.5" />
                <span>{viewCount} visto</span>
              </div>

              {/* Bottom actions */}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <div className="flex items-center gap-3">
                  <input
                    placeholder={`Responder a ${viewingStory.username}...`}
                    className="flex-1 h-10 px-4 rounded-full bg-white/15 backdrop-blur-sm text-white placeholder:text-white/50 text-sm border border-white/20 outline-none focus:bg-white/25 focus:border-white/40 transition-colors"
                  />
                  <button
                    onClick={() => setLiked(!liked)}
                    aria-label="Me gusta"
                    aria-pressed={liked}
                    className={`p-2 rounded-full transition-colors ${
                      liked
                        ? "text-red-500"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    <Heart
                      className={`w-6 h-6 ${liked ? "fill-current heart-pop" : ""}`}
                    />
                  </button>
                  <button
                    onClick={handleSend}
                    aria-label="Enviar"
                    className="p-2 text-white/80 hover:text-white transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                  {sentConfirmation && (
                    <span className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-card text-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg slide-up">
                      Enviado
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
