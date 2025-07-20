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
