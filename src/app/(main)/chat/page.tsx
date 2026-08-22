"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  MessageCircle,
  Users,
  Pin,
  UserPlus,
  Phone,
  Paperclip,
} from "lucide-react";
import { avatarColor } from "@/lib/avatar-color";
import { cn } from "@/lib/utils";

const DEMO_CHATS = [
  {
    id: 1,
    name: "Maria Garcia",
    is_group: false,
    last_message: "Nos vemos en el mercadillo el sabado!",
    last_message_time: "hace 2m",
    unread: 2,
    pinned: true,
    avatar: "MG",
    online: true,
    members: 0,
  },
  {
    id: 2,
    name: "Grupo Senderismo",
    is_group: true,
    last_message: "Pablo: Alguien se apunta a la ruta este finde?",
    last_message_time: "hace 15m",
    unread: 5,
    pinned: true,
    avatar: "GS",
    online: false,
    members: 12,
  },
  {
    id: 3,
    name: "Elena Ruiz",
    is_group: false,
    last_message: "Gracias por la recomendacion!",
    last_message_time: "hace 1h",
    unread: 0,
    pinned: false,
    avatar: "ER",
    online: true,
    members: 0,
  },
  {
    id: 4,
    name: "Vecinos del Barrio",
    is_group: true,
    last_message: "Carlos: Ya arreglaron la farola de Calle Luna",
    last_message_time: "hace 3h",
    unread: 0,
    pinned: false,
    avatar: "VB",
    online: false,
    members: 34,
  },
  {
    id: 5,
    name: "Pablo Torres",
    is_group: false,
    last_message: "Ese restaurante estaba increible, gracias!",
    last_message_time: "Ayer",
    unread: 0,
    pinned: false,
    avatar: "PT",
    online: true,
    members: 0,
  },
];

const ONLINE_COUNT = DEMO_CHATS.filter((c) => !c.is_group && c.online).length;

export default function ChatPage() {
  const [search, setSearch] = useState("");
  const [selectedChat, setSelectedChat] = useState<number | null>(null);

  const filtered = DEMO_CHATS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const pinned = filtered.filter((c) => c.pinned);
  const regular = filtered.filter((c) => !c.pinned);

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] lg:h-[calc(100vh-4rem)] flex">
      {/* Chat List */}
      <div
        className={cn(
          "w-full md:w-80 lg:w-96 border-r border-border bg-background flex flex-col shrink-0",
          selectedChat !== null ? "hidden md:flex" : "flex"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-foreground">Mensajes</h1>
              {/* Online count chip */}
              <span className="flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-primary pulse-ring inline-block" />
                {ONLINE_COUNT} en línea
              </span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="rounded-lg btn-press hover:bg-primary/10 hover:text-primary"
              aria-label="Nueva conversación"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar chats..."
              className="pl-9 rounded-xl bg-muted border-0"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {pinned.length > 0 && (
            <div className="px-4 py-2">
              <p className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-1">
                <Pin className="w-3 h-3" /> Fijados
              </p>
              {pinned.map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  selected={selectedChat === chat.id}
                  onSelect={() => setSelectedChat(chat.id)}
                />
              ))}
            </div>
          )}
          <div className="px-4 py-2">
            {pinned.length > 0 && (
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Recientes
              </p>
            )}
            {regular.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                selected={selectedChat === chat.id}
                onSelect={() => setSelectedChat(chat.id)}
              />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16 px-4 text-muted-foreground">
              <div className="relative inline-flex items-center justify-center mb-4">
                <span className="absolute w-16 h-16 rounded-full bg-primary/10 pulse-ring" />
                <MessageCircle className="relative w-10 h-10 opacity-30" />
              </div>
              <p className="text-lg font-bold">No hay chats</p>
              <p className="text-sm mt-1 mb-4">
                {search
                  ? `Sin coincidencias para "${search}"`
                  : "Empieza una conversación con alguien"}
              </p>
              <Link href="/explore">
                <Button className="rounded-full bg-primary font-bold">
                  <UserPlus className="w-4 h-4 mr-1.5" /> Buscar usuarios
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Chat Conversation Area */}
      <div
        className={cn(
          "flex-1 flex flex-col",
          selectedChat === null ? "hidden md:flex" : "flex"
        )}
      >
        {selectedChat ? (
          <ChatConversation
            chat={DEMO_CHATS.find((c) => c.id === selectedChat)!}
            onBack={() => setSelectedChat(null)}
          />
        ) : (
          <div className="flex-1 hidden md:flex items-center justify-center flex-col text-center px-8">
            <div className="relative mb-5">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-10 h-10 text-primary" />
              </div>
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary pulse-ring" />
            </div>
            <p className="font-black text-lg mb-1">Tus mensajes</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Selecciona una conversación para empezar a chatear, o busca un
              usuario para iniciar una nueva.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ChatItem({
  chat,
  selected,
  onSelect,
}: {
  chat: (typeof DEMO_CHATS)[0];
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left relative overflow-hidden",
        selected
          ? "bg-primary/10 border border-primary/20"
          : "hover:bg-muted"
      )}
    >
      {/* Green left accent bar when selected */}
      {selected && (
        <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-primary" />
      )}

      <div className="relative shrink-0">
        <Avatar className="w-11 h-11">
          <AvatarFallback
            className={cn(
              "text-sm font-bold",
              chat.is_group
                ? "bg-primary/15 text-primary"
                : avatarColor(chat.name)
            )}
          >
            {chat.is_group ? <Users className="w-5 h-5" /> : chat.avatar}
          </AvatarFallback>
        </Avatar>
        {!chat.is_group && chat.online && (
          <span
            aria-label="En línea"
            className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-primary border-2 border-background pulse-ring"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold truncate">{chat.name}</p>
          <span className="text-[10px] text-muted-foreground shrink-0">
            {chat.last_message_time}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground truncate">
            {chat.last_message}
          </p>
          {chat.unread > 0 && (
            <Badge className="bg-primary text-white text-[10px] h-5 min-w-5 px-1.5 shrink-0 border-0">
              {chat.unread}
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
}

const FAKE_REPLIES = [
  "Perfecto, ahi estaremos!",
  "Genial, me parece bien!",
  "Jaja si, totalmente de acuerdo",
  "Buena idea! Lo hablamos luego",
  "Vale, te aviso cuando llegue",
  "Que bien! Me alegro mucho",
];

function ChatConversation({
  chat,
  onBack,
}: {
  chat: (typeof DEMO_CHATS)[0];
  onBack: () => void;
}) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<
    Array<{
      id: number;
      sender: string;
      text: string;
      isMe: boolean;
      time: string;
    }>
  >([
    {
      id: 1,
      sender: chat.name.split(" ")[0],
      text: chat.last_message,
      isMe: false,
      time: new Date().toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!message.trim() || sending) return;

    setSending(true);
    const now = new Date().toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "Tu", text: message, isMe: true, time: now },
    ]);
    setMessage("");
    setIsTyping(true);

    setTimeout(() => {
      const reply = FAKE_REPLIES[Math.floor(Math.random() * FAKE_REPLIES.length)];
      const replyTime = new Date().toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: chat.name.split(" ")[0],
          text: reply,
          isMe: false,
          time: replyTime,
        },
      ]);
      setSending(false);
    }, 1000);
  };

  return (
    <>
      {/* Chat Header */}
      <div className="h-16 border-b border-border flex items-center gap-3 px-4">
        <button
          onClick={onBack}
          className="md:hidden text-muted-foreground hover:text-foreground mr-1 text-lg leading-none"
        >
          &larr;
        </button>
        <Avatar className="w-9 h-9">
          <AvatarFallback
            className={cn(
              "text-xs font-bold",
              chat.is_group ? "bg-primary/15 text-primary" : avatarColor(chat.name)
            )}
          >
            {chat.is_group ? <Users className="w-4 h-4" /> : chat.avatar}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{chat.name}</p>
          <div className="flex items-center gap-1.5">
            {chat.is_group ? (
              <p className="text-xs text-muted-foreground">
                {chat.members} miembros
              </p>
            ) : (
              <>
                <span
                  className={cn(
                    "w-2 h-2 rounded-full shrink-0",
                    chat.online ? "bg-primary pulse-ring" : "bg-muted-foreground/40"
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  {chat.online ? "En línea" : "Desconectado"}
                </p>
              </>
            )}
          </div>
        </div>
        {/* Call icon — visual only */}
        <button
          aria-label="Llamar"
          className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        >
          <Phone className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex justify-center">
          <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
            Hoy
          </span>
        </div>
        {messages.map((msg) =>
          msg.isMe ? (
            <div key={msg.id} className="flex gap-2 justify-end">
              <div className="bubble-right bg-gradient-to-br from-primary to-emerald-500 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-xs shadow-sm">
                <p className="text-sm">{msg.text}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <p className="text-[10px] text-white/70">{msg.time}</p>
                  <span className="text-[10px] text-white/50">✓✓</span>
                </div>
              </div>
            </div>
          ) : (
            <div key={msg.id} className="flex gap-2">
              <Avatar className="w-7 h-7 shrink-0">
                <AvatarFallback
                  className={cn("text-xs font-bold", avatarColor(chat.name))}
                >
                  {chat.avatar.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="bubble-left bg-muted rounded-2xl rounded-tl-sm px-4 py-2 max-w-xs">
                <p className="text-sm">{msg.text}</p>
                <p className="text-[10px] text-muted-foreground text-right mt-1">
                  {msg.time}
                </p>
              </div>
            </div>
          )
        )}
        {isTyping && (
          <div className="flex gap-2 slide-up" aria-label="Escribiendo">
            <Avatar className="w-7 h-7 shrink-0">
              <AvatarFallback
                className={cn("text-xs font-bold", avatarColor(chat.name))}
              >
                {chat.avatar.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
              <span
                className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-2">
          {/* Emoji button — visual */}
          <button
            aria-label="Añadir emoji"
            className="text-xl leading-none text-muted-foreground hover:text-foreground transition-colors shrink-0 p-1"
          >
            😊
          </button>
          {/* Attachment button — visual */}
          <button
            aria-label="Adjuntar archivo"
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <div className="flex-1 input-glow rounded-xl">
            <Input
              placeholder="Escribe un mensaje..."
              className="rounded-xl border-border"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
          </div>

          <Button
            className="rounded-full bg-primary hover:bg-primary/90 text-white font-bold disabled:opacity-50 btn-press glow-primary"
            disabled={!message.trim() || sending}
            onClick={handleSend}
          >
            {sending ? (
              <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              "Enviar"
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
