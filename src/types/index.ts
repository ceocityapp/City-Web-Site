export interface City {
  id: string;
  name: string;
  slug: string;
  country: string;
  region: string;
  image: string;
  description: string;
  population?: string;
  coordinates: { lat: number; lng: number };
  featured?: boolean;
}

export interface User {
  id: number;
  supabase_id: string;
  email: string;
  name: string;
  username: string;
  avatar_url: string | null;
  banner_url: string | null;
  bio: string | null;
  website_url: string | null;
  instagram_url: string | null;
  profile_completed: boolean;
  is_private: boolean;
  posts_count: number;
  followers_count: number;
  following_count: number;
  is_admin: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface Post {
  id: number;
  user_id: number;
  title: string | null;
  body: string;
  image_url: string | null;
  video_url: string | null;
  post_type: "post" | "forum" | "job" | "event";
  location: string | null;
  salary: string | null;
  event_date: string | null;
  event_month: string | null;
  attendees: number;
  replies_count: number;
  last_activity: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  user?: User;
  is_liked?: boolean;
  is_bookmarked?: boolean;
}

export interface Shop {
  id: number;
  name: string;
  category: string;
  address: string | null;
  description: string | null;
  opening_hours: string | null;
  phone: string | null;
  email: string | null;
  image_url: string | null;
  logo_url: string | null;
  rating: number;
  is_featured: boolean;
  is_draft: boolean;
  owner_id: number;
  created_at: string;
}

export interface Product {
  id: number;
  shop_id: number;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export interface Service {
  id: number;
  shop_id: number;
  name: string;
  price: number;
  price_type: "fixed" | "from" | "free" | "quote";
  duration: string | null;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export interface Community {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  category: string;
  members_count: number;
  status: string;
  created_by: number;
  created_at: string;
}

export interface Chat {
  id: number;
  name: string | null;
  is_group: boolean;
  created_at: string;
  last_message?: ChatMessage;
  members?: ChatMember[];
  unread_count?: number;
}

export interface ChatMember {
  id: number;
  chat_id: number;
  user_id: number;
  user?: User;
}

export interface ChatMessage {
  id: number;
  chat_id: number;
  sender_id: number;
  text: string;
  type: "text" | "media";
  media_url: string | null;
  duration: string | null;
  created_at: string;
  sender?: User;
}

export interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  body: string;
  parent_id: number | null;
  created_at: string;
  user?: User;
  replies?: Comment[];
}

export interface Notification {
  id: number;
  user_id: number;
  type: "like" | "comment" | "follow" | "event" | "community" | "job";
  post_id: number | null;
  text: string;
  detail: string | null;
  read: boolean;
  actor_id: number | null;
  actor?: User;
  created_at: string;
}

export interface Story {
  id: number;
  user_id: number;
  image_url: string;
  created_at: string;
  user?: User;
  likes_count: number;
  is_liked?: boolean;
}

export interface CartItem {
  product: Product;
  shop: Shop;
  quantity: number;
}
