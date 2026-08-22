"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, X, Send, Loader2, RefreshCw } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "¿Qué hacer este fin de semana en Huesca?",
  "Recomiéndame un restaurante",
  "¿Cómo publico un post?",
  "Cuéntame sobre San Lorenzo",
];

const GREETING = "¡Hola! Soy City AI 👋 Tu asistente para descubrir Huesca y usar City App. ¿En qué puedo ayudarte?";

export function CityAIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState("");
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Listen for global "open-city-ai" event to allow other components to open chatbot
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-city-ai", handler);
    return () => window.removeEventListener("open-city-ai", handler);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || loading) return;

    setError("");
    setInput("");
    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: messageText.trim() },
    ];
    setMessages(newMessages);
    setLoading(true);
    setStreaming("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Error desconocido" }));
        throw new Error(errorData.error || `Error ${res.status}`);
      }

      if (!res.body) {
        throw new Error("No response body");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setStreaming(accumulated);
      }

      setMessages([...newMessages, { role: "assistant", content: accumulated }]);
      setStreaming("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al conectar con City AI";
      setError(msg);
      setStreaming("");
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const resetChat = () => {
    setMessages([]);
    setStreaming("");
    setError("");
    setInput("");
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="m-ai-orb fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full text-[#04120C] flex items-center justify-center transition-transform duration-300 hover:scale-110 active:scale-95 group"
          aria-label="Abrir City AI"
        >
          <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-[60] w-[calc(100vw-3rem)] sm:w-96 h-[calc(100vh-3rem)] sm:h-[600px] max-h-[85vh] bg-card rounded-2xl border border-border shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in">
          {/* Header */}
          <div className="bg-foreground text-white px-5 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-black text-sm">City AI</h3>
                <p className="text-[10px] text-white/60 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Asistente de Huesca
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={resetChat}
                  className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10"
                  title="Nueva conversación"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {/* Greeting */}
            {messages.length === 0 && (
              <div className="flex gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-muted/80 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%]">
                  <p className="text-sm leading-relaxed">{GREETING}</p>
                </div>
              </div>
            )}

            {/* Suggested questions */}
            {messages.length === 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide px-1">Sugerencias</p>
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="w-full text-left text-xs px-3 py-2 rounded-xl bg-card border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors font-medium"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Message history */}
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-2.5 max-w-[85%] ${
                    msg.role === "user"
                      ? "bg-foreground text-white rounded-tr-sm"
                      : "bg-muted/80 rounded-tl-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {/* Streaming response */}
            {streaming && (
              <div className="flex gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-muted/80 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%]">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {streaming}
                    <span className="inline-block w-1 h-3 bg-primary ml-0.5 animate-pulse" />
                  </p>
                </div>
              </div>
            )}

            {/* Loading */}
            {loading && !streaming && (
              <div className="flex gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-muted/80 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl p-3">
                <p className="font-bold mb-0.5">Error</p>
                <p>{error}</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-border p-3 shrink-0 bg-card">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Pregúntame sobre Huesca..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="flex-1 h-10 px-4 rounded-full bg-muted border-0 text-sm outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
              />
              <Button
                type="submit"
                disabled={!input.trim() || loading}
                className="rounded-full w-10 h-10 p-0 bg-primary hover:bg-primary/90 shrink-0"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-[9px] text-muted-foreground text-center mt-2">
              Potenciado por Claude · Las respuestas pueden no ser siempre precisas
            </p>
          </form>
        </div>
      )}
    </>
  );
}
