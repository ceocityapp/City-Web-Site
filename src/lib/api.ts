const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function getAuthHeaders(): Promise<HeadersInit> {
  if (typeof window === "undefined") return {};
  const { supabase } = await import("./supabase");
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) return {};
  return { Authorization: `Bearer ${session.access_token}` };
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...options.headers,
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || `API error: ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth
  getMe: () => request("/api/auth/me"),
  completeProfile: (data: Record<string, unknown>) =>
    request("/api/auth/complete-profile", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateProfile: (data: Record<string, unknown>) =>
    request("/api/auth/profile", { method: "PUT", body: JSON.stringify(data) }),

  // Posts & Feed
  getFeed: (params?: string) =>
    request(`/api/feed${params ? `?${params}` : ""}`),
  getPosts: (params?: string) =>
    request(`/api/posts${params ? `?${params}` : ""}`),
  getPost: (id: number) => request(`/api/posts/${id}`),
  createPost: (data: Record<string, unknown>) =>
    request("/api/posts", { method: "POST", body: JSON.stringify(data) }),
  deletePost: (id: number) =>
    request(`/api/posts/${id}`, { method: "DELETE" }),
  likePost: (id: number) =>
    request(`/api/posts/${id}/like`, { method: "POST" }),
  bookmarkPost: (id: number) =>
    request(`/api/posts/${id}/bookmark`, { method: "POST" }),
  getComments: (postId: number) => request(`/api/posts/${postId}/comments`),
  addComment: (postId: number, body: string) =>
    request(`/api/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ body }),
    }),

  // Shops / Marketplace
  getShops: (params?: string) =>
    request(`/api/shops${params ? `?${params}` : ""}`),
  getShop: (id: number) => request(`/api/shops/${id}`),
  getProducts: (shopId: number) => request(`/api/shops/${shopId}/products`),
  getServices: (shopId: number) => request(`/api/shops/${shopId}/services`),
  getShopReviews: (shopId: number) => request(`/api/shops/${shopId}/reviews`),

  // Communities
  getCommunities: () => request("/api/communities"),
  getCommunity: (id: number) => request(`/api/communities/${id}`),
  joinCommunity: (id: number) =>
    request(`/api/communities/${id}/join`, { method: "POST" }),
  getCommunityMessages: (id: number) =>
    request(`/api/communities/${id}/messages`),

  // Chat
  getChats: () => request("/api/chats"),
  getChatMessages: (chatId: number) =>
    request(`/api/chats/${chatId}/messages`),
  sendMessage: (chatId: number, text: string) =>
    request(`/api/chats/${chatId}/messages`, {
      method: "POST",
      body: JSON.stringify({ text }),
    }),
  createDM: (userId: number) =>
    request("/api/chats/dm", {
      method: "POST",
      body: JSON.stringify({ user_id: userId }),
    }),

  // Users
  getUser: (id: number) => request(`/api/users/${id}`),
  getUserPosts: (id: number) => request(`/api/user/${id}/posts`),
  followUser: (id: number) =>
    request(`/api/users/${id}/follow`, { method: "POST" }),
  searchUsers: (q: string) => request(`/api/users/search?q=${q}`),

  // Stories
  getStories: () => request("/api/stories"),

  // Notifications
  getNotifications: () => request("/api/notifications"),
  getUnreadCount: () => request("/api/notifications/unread-count"),
  markAllRead: () =>
    request("/api/notifications/read-all", { method: "PUT" }),

  // Search
  search: (q: string) => request(`/api/search?q=${q}`),

  // Events
  attendEvent: (postId: number) =>
    request(`/api/events/${postId}/attend`, { method: "POST" }),
  getEventAttendees: (postId: number) =>
    request(`/api/events/${postId}/attendees`),
};
