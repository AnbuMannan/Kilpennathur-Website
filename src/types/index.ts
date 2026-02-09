/* ---------------------------------------------------------------------------
   User & auth
   --------------------------------------------------------------------------- */

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "editor";
  createdAt: Date;
  updatedAt: Date;
}

/* ---------------------------------------------------------------------------
   News & content
   --------------------------------------------------------------------------- */

export interface News {
  id: string;
  title: string;
  titleTamil?: string;
  slug: string;
  content: string;
  contentTamil?: string;
  excerpt?: string;
  image?: string;
  category: string;
  tags?: string[];
  status: "draft" | "published";
  authorId: string;
  author?: User;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  nameTamil?: string;
  slug: string;
  type: "news" | "business" | "event";
  createdAt: Date;
}

/* ---------------------------------------------------------------------------
   Business & directory
   --------------------------------------------------------------------------- */

export interface Business {
  id: string;
  name: string;
  nameTamil?: string;
  category: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  description?: string;
  image?: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}

/* ---------------------------------------------------------------------------
   Village
   --------------------------------------------------------------------------- */

export interface Village {
  id: string;
  name: string;
  nameTamil: string;
  slug: string;
  description?: string;
  createdAt: Date;
}

/* ---------------------------------------------------------------------------
   Events
   --------------------------------------------------------------------------- */

export interface Event {
  id: string;
  title: string;
  titleTamil?: string;
  description?: string;
  date: Date;
  image?: string;
  createdAt: Date;
}
