declare global {
  namespace App {

    interface Locals {
      user: User | null;
      session: Session | null;
    }

    // Daftarkan interface SiteSettings di sini
    interface SiteSettings {
      site_title?: string;
      site_description?: string;
      site_favicon_url?: string;
      site_logo_url?: string;
      publisher_name?: string;
      publisher_logo_url?: string;
      gsc_verification_code?: string;
      bing_verification_code?: string;
      yandex_verification_code?: string;
      ga4_id?: string;
      custom_head_script?: string;
      custom_footer_script?: string;
    }


    // SvelteKit akan secara otomatis menambahkan 'settings: SiteSettings' ke PageData
    // jadi kita tidak perlu menuliskannya di sini.
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
  }
  
  namespace svelteHTML {
    interface HTMLAttributes<T> {
      'on:intersect'?: (event: CustomEvent<any>) => any;
    }
  }
}

export {};