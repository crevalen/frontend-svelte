<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import LinkEditor from './LinkEditor.svelte';
	import StarterKit from '@tiptap/starter-kit';
	import Link from '@tiptap/extension-link';
	import ImageExtension from '@tiptap/extension-image';
	import TextAlign from '@tiptap/extension-text-align';
	import Blockquote from '@tiptap/extension-blockquote';
	import HorizontalRule from '@tiptap/extension-horizontal-rule';
	import CodeBlock from '@tiptap/extension-code-block';
	import { BubbleMenu } from '@tiptap/extension-bubble-menu';

	
	import {
		Bold,
		Italic,
		Link2,
		Pilcrow,
		Heading2,
		Heading3,
		Heading4,
		AlignLeft,
		AlignCenter,
		AlignRight,
		AlignJustify,
		List,
		ListOrdered,
		Quote,
		Minus,
		Code,
		Image as ImageIcon
	} from 'lucide-svelte';

	export let value: string = '';

	let element: HTMLElement;
	let bubbleMenuElement: HTMLElement;
	let editor: Editor;
	let showLinkEditor = false;
	let currentLinkAttrs = { href: '', target: '' };

	// PERBAIKAN: Gunakan objek reaktif untuk melacak status tombol
	let activeState = {
		bold: false,
		italic: false,
		heading2: false,
		heading3: false,
		heading4: false,
		bulletList: false,
		orderedList: false,
		blockquote: false,
		alignLeft: true, // Default
		alignCenter: false,
		alignRight: false,
		alignJustify: false,
		link: false,
		codeBlock: false
	};

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
				StarterKit,
				Link.configure({
					openOnClick: false,
					autolink: true,
					HTMLAttributes: {
						rel: null, 
						target: null
					}
				}),
				ImageExtension,
				TextAlign.configure({ types: ['heading', 'paragraph'] }),
				Blockquote,
				HorizontalRule,
				CodeBlock,
				BubbleMenu.configure({
					element: bubbleMenuElement
				})
			],
			content: value,
			onUpdate: () => {
				value = editor.getHTML();
			},
			// PERBAIKAN: Update status setiap kali ada perubahan
			onTransaction: () => {
				if (!editor) return;
				activeState = {
					bold: editor.isActive('bold'),
					italic: editor.isActive('italic'),
					heading2: editor.isActive('heading', { level: 2 }),
					heading3: editor.isActive('heading', { level: 3 }),
					heading4: editor.isActive('heading', { level: 4 }),
					bulletList: editor.isActive('bulletList'),
					orderedList: editor.isActive('orderedList'),
					blockquote: editor.isActive('blockquote'),
					alignLeft: editor.isActive({ textAlign: 'left' }),
					alignCenter: editor.isActive({ textAlign: 'center' }),
					alignRight: editor.isActive({ textAlign: 'right' }),
					alignJustify: editor.isActive({ textAlign: 'justify' }),
					link: editor.isActive('link'),
					codeBlock: editor.isActive('codeBlock')
				};
			}
		});
	});

	onDestroy(() => {
		if (editor) editor.destroy();
	});

	// 3. Fungsi untuk MEMBUKA modal, bukan window.prompt
	function openLinkEditor() {
		const attrs = editor.getAttributes('link');
		currentLinkAttrs = { href: attrs.href, target: attrs.target };
		showLinkEditor = true;
	}

	// 4. Fungsi untuk MENYIMPAN link dari data modal
	function handleSaveLink(event: CustomEvent) {
		const { href, target } = event.detail;
		if (href) {
			editor.chain().focus().extendMarkRange('link').setLink({ href, target }).run();
		}
		showLinkEditor = false;
	}

	// 5. Fungsi untuk MENGHAPUS link
	function handleRemoveLink() {
		editor.chain().focus().extendMarkRange('link').unsetLink().run();
		showLinkEditor = false;
	}
</script>

{#if showLinkEditor}
	<LinkEditor
		href={currentLinkAttrs.href}
		target={currentLinkAttrs.target}
		on:save={handleSaveLink}
		on:remove={handleRemoveLink}
		on:close={() => (showLinkEditor = false)}
	/>
{/if}

<div bind:this={bubbleMenuElement}>
	{#if editor && editor.isActive('link')}
		<div class="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 p-2 shadow-xl">
			<a
				href={editor.getAttributes('link').href}
				target="_blank"
				rel="noopener noreferrer"
				class="text-sm text-blue-400 hover:underline">{editor.getAttributes('link').href}</a
			>
			<!-- svelte-ignore element_invalid_self_closing_tag -->
			<div class="h-4 w-px bg-slate-700" />
			<button on:click={openLinkEditor} class="text-sm text-slate-300 hover:text-white">Edit</button>
		</div>
	{/if}
</div>

<div class="rounded-lg border border-slate-900 bg-slate-50">
	{#if editor}
		<div class="flex flex-wrap items-center gap-1 border-b border-slate-900 p-2">
			<div class="flex items-center gap-1">
				<button
					type="button"
					on:click={() => editor.chain().focus().toggleBold().run()}
					class:is-active={activeState.bold}><Bold size={18} /></button
				>
				<button
					type="button"
					on:click={() => editor.chain().focus().toggleItalic().run()}
					class:is-active={activeState.italic}><Italic size={18} /></button
				>
			</div>
			<!-- svelte-ignore element_invalid_self_closing_tag -->
			<div class="divider" />
			<div class="flex items-center gap-1">
				<button
					type="button"
					on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
					class:is-active={activeState.heading2}><Heading2 size={18} /></button
				>
				<button
					type="button"
					on:click={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
					class:is-active={activeState.heading3}><Heading3 size={18} /></button
				>
				<button
					type="button"
					on:click={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
					class:is-active={activeState.heading4}><Heading4 size={18} /></button
				>
			</div>
			<!-- svelte-ignore element_invalid_self_closing_tag -->
			<div class="divider" />
			<div class="flex items-center gap-1">
				<button
					type="button"
					on:click={() => editor.chain().focus().setParagraph().run()}
					class:is-active={!Object.values(activeState).some(v => typeof v === 'boolean' && v)}><Pilcrow size={18} /></button
				>
				<button
					type="button"
					on:click={() => editor.chain().focus().toggleBlockquote().run()}
					class:is-active={activeState.blockquote}><Quote size={18} /></button
				>
			</div>
			<!-- svelte-ignore element_invalid_self_closing_tag -->
			<div class="divider" />
			<div class="flex items-center gap-1">
				<button
					type="button"
					on:click={() => editor.chain().focus().toggleBulletList().run()}
					class:is-active={activeState.bulletList}><List size={18} /></button
				>
				<button
					type="button"
					on:click={() => editor.chain().focus().toggleOrderedList().run()}
					class:is-active={activeState.orderedList}><ListOrdered size={18} /></button
				>
			</div>
			<!-- svelte-ignore element_invalid_self_closing_tag -->
			<div class="divider" />
			<div class="flex items-center gap-1">
				<button
					type="button"
					on:click={() => editor.chain().focus().setTextAlign('left').run()}
					class:is-active={activeState.alignLeft}><AlignLeft size={18} /></button
				>
				<button
					type="button"
					on:click={() => editor.chain().focus().setTextAlign('center').run()}
					class:is-active={activeState.alignCenter}><AlignCenter size={18} /></button
				>
				<button
					type="button"
					on:click={() => editor.chain().focus().setTextAlign('right').run()}
					class:is-active={activeState.alignRight}><AlignRight size={18} /></button
				>
				<button
					type="button"
					on:click={() => editor.chain().focus().setTextAlign('justify').run()}
					class:is-active={activeState.alignJustify}><AlignJustify size={18} /></button
				>
			</div>
			<!-- svelte-ignore element_invalid_self_closing_tag -->
			<div class="divider" />
			<div class="flex items-center gap-1">
				<button type="button" on:click={openLinkEditor} class:is-active={activeState.link}><Link2 size={18} /></button
				>
				<button type="button"><ImageIcon size={18} /></button>
				<button type="button" on:click={() => editor.chain().focus().setHorizontalRule().run()}
					><Minus size={18} /></button
				>
				<button
					type="button"
					on:click={() => editor.chain().focus().toggleCodeBlock().run()}
					class:is-active={activeState.codeBlock}><Code size={18} /></button
				>
			</div>
		</div>
	{/if}
	<!-- svelte-ignore element_invalid_self_closing_tag -->
	<div bind:this={element} class="editor-content" />
</div>

<style>
	.editor-content :global(.ProseMirror) {
		min-height: 400px;
		padding: 0.75rem;
		color: hsl(0, 0%, 4%);
		transition: all 0.2s;
	}
	.editor-content :global(.ProseMirror:focus) {
		outline: none;
	}
	.editor-content :global(.ProseMirror > * + *) {
		margin-top: 0.75em;
	}
	.editor-content :global(.ProseMirror h2) {
		font-size: 1.5em;
		font-weight: 700;
		line-height: 1.3;
		color: hsl(0, 0%, 1%);
	}
	.editor-content :global(.ProseMirror h3) {
		font-size: 1.25em;
		font-weight: 700;
		line-height: 1.3;
		color: hsl(0, 0%, 3%);
	}
	.editor-content :global(.ProseMirror h4) {
		font-size: 1.125em;
		font-weight: 700;
		line-height: 1.3;
		color: hsl(0, 0%, 2%);
	}
	.editor-content :global(.ProseMirror blockquote) {
		padding-left: 1rem;
		border-left: 3px solid hsl(217, 93%, 18%);
		color: hsl(180, 8%, 3%);
	}
	.editor-content :global(.ProseMirror ul),
	.editor-content :global(.ProseMirror ol) {
		padding-left: 1.75rem;
	}
	.editor-content :global(.ProseMirror ul) {
		list-style-type: disc;
	}
	.editor-content :global(.ProseMirror ol) {
		list-style-type: decimal;
	}
	.editor-content :global(.ProseMirror code) {
		background-color: hsl(222, 96%, 28%);
		color: hsl(210, 17%, 5%);
		padding: 0.2rem 0.4rem;
		border-radius: 0.25rem;
	}
	.editor-content :global(.ProseMirror pre) {
		background: hsl(220, 9%, 94%);
		color: hsl(180, 11%, 2%);
		font-family: 'JetBrains Mono', monospace;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
	}

	button {
		padding: 0.375rem;
		border-radius: 0.25rem;
		color: hsl(210, 20%, 4%);
		transition: all 150ms;
		min-width: 34px;
		font-weight: 600;
		font-size: 0.875rem;
	}
	button:hover {
		background-color: hsl(222, 97%, 44%);
		color: hsl(210 40% 98%);
	}
	.is-active {
		background-color: hsl(222, 97%, 44%);
		color: hsl(210 40% 98%);
	}
	.divider {
		width: 1px;
		height: 1.25rem;
		background-color: hsl(217.2 32.6% 25%);
		margin-left: 0.25rem;
		margin-right: 0.25rem;
	}
</style>