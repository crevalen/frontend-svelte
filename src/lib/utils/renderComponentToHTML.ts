import { render } from 'svelte/server';
import type { SvelteComponent } from 'svelte';

export async function renderComponentToHTML(Component: typeof SvelteComponent, props: any): Promise<string> {
  const { html } = render(Component, { props });
  return html;
}
