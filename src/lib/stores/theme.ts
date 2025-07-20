import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

const initialValue: Theme = browser ? (localStorage.getItem('theme') as Theme) || 'light' : 'light';

export const theme = writable<Theme>(initialValue);

// Setiap kali nilai store berubah, simpan ke localStorage
theme.subscribe((value) => {
  if (browser) {
    localStorage.setItem('theme', value);
  }
});