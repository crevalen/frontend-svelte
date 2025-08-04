// src/lib/types.ts
export interface Settings {
  site_title: string;
  site_description: string;
  site_favicon_url?: string;
  site_logo_url?: string;
  gsc_verification_code?: string;
  bing_verification_code?: string;
  yandex_verification_code?: string;
  ga4_id?: string;
  custom_head_script?: string;
  custom_footer_script?: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  publishedAt?: Date | string | null;
  featuredImage?: {
    url: string;
    url_medium: string;
    url_thumb: string;
    url_placeholder?: string;
  } | null;
  categories?: {
    slug: string;
    name: string;
  }[];
  author: {
    displayName: string;
  };
}