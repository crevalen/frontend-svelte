<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import LinkEditor from './LinkEditor.svelte';
	import ImageModal from './ImageModal.svelte';
	import StarterKit from '@tiptap/starter-kit';
	import Link from '@tiptap/extension-link';
	import ImageExtension from '@tiptap/extension-image';
	import TextAlign from '@tiptap/extension-text-align';
	import Blockquote from '@tiptap/extension-blockquote';
	import HorizontalRule from '@tiptap/extension-horizontal-rule';
	import { BubbleMenu } from '@tiptap/extension-bubble-menu';
	
	// **PERBAIKAN FINAL UNTUK LOWLIGHT**
	import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
	import { createLowlight } from 'lowlight';
	import css from 'highlight.js/lib/languages/css';
	import js from 'highlight.js/lib/languages/javascript';
	import ts from 'highlight.js/lib/languages/typescript';
	import html from 'highlight.js/lib/languages/xml';

	// Dependensi untuk Tabel
	import { Table } from '@tiptap/extension-table';
	import { TableCell } from '@tiptap/extension-table-cell';
	import { TableHeader } from '@tiptap/extension-table-header';
	import { TableRow } from '@tiptap/extension-table-row';

	import {
		Bold, Italic, Link2, Pilcrow, Heading2, Heading3, Heading4, AlignLeft,
		AlignCenter, AlignRight, AlignJustify, List, ListOrdered, Quote, Minus,
		Code, Image as ImageIcon, Table2, Columns3, Rows3, Trash2
	} from 'lucide-svelte';

	// Inisialisasi lowlight
	const lowlight = createLowlight();
	lowlight.register({ html, css, js, ts });
	
	export let value: string = '';

	let element: HTMLElement;
	let bubbleMenuElement: HTMLElement;
	let editor: Editor;
	let showLinkEditor = false;
	let showImageModal = false;
	let currentLinkAttrs = { href: '', target: '' };

	let activeState = {
		bold: false, italic: false, heading2: false, heading3: false, heading4: false,
		bulletList: false, orderedList: false, blockquote: false, alignLeft: true,
		alignCenter: false, alignRight: false, alignJustify: false, link: false,
		codeBlock: false, table: false
	};

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
				StarterKit.configure({ codeBlock: false }),
				Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: null, target: null } }),
				ImageExtension,
				TextAlign.configure({ types: ['heading', 'paragraph'] }),
				Blockquote,
				HorizontalRule,
				CodeBlockLowlight.configure({ lowlight }),
				BubbleMenu.configure({ element: bubbleMenuElement, tippyOptions: { duration: 100 } }),
				Table.configure({ resizable: true }),
				TableRow,
				TableHeader,
				TableCell,
			],
			content: value,
			onUpdate: () => {
				value = editor.getHTML();
			},
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
					codeBlock: editor.isActive('codeBlock'),
					table: editor.isActive('table')
				};
			}
		});
	});

	onDestroy(() => {
		if (editor) editor.destroy();
	});

	function openLinkEditor() {
		const attrs = editor.getAttributes('link');
		currentLinkAttrs = { href: attrs.href, target: attrs.target };
		showLinkEditor = true;
	}

	function handleSaveLink(event: CustomEvent) {
		const { href, target } = event.detail;
		if (href) {
			editor.chain().focus().extendMarkRange('link').setLink({ href, target }).run();
		}
		showLinkEditor = false;
	}
	
	function handleRemoveLink() {
		editor.chain().focus().extendMarkRange('link').unsetLink().run();
		showLinkEditor = false;
	}
	
	function handleInsertImage(event: CustomEvent) {
		const { src, alt } = event.detail;
		if (src) {
			editor.chain().focus().setImage({ src, alt }).run();
		}
		showImageModal = false;
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

{#if showImageModal}
	<ImageModal
		on:insert={handleInsertImage}
		on:close={() => (showImageModal = false)}
	/>
{/if}

<div bind:this={bubbleMenuElement}>
	{#if editor}
		{#if editor.isActive('link')}
			<div class="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 p-2 shadow-xl">
				<a href={editor.getAttributes('link').href} target="_blank" rel="noopener noreferrer" class="text-sm text-blue-400 hover:underline">{editor.getAttributes('link').href}</a>
				<div class="h-4 w-px bg-slate-700"></div>
				<button type="button" on:click={openLinkEditor} class="text-sm text-slate-300 hover:text-white">Edit</button>
			</div>
		{/if}
		{#if activeState.table}
			<div class="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 p-1 shadow-xl">
				<button type="button" on:click={() => editor.chain().focus().addColumnBefore().run()} title="Add Column Before"><Columns3 size={16}/></button>
				<button type="button" on:click={() => editor.chain().focus().deleteColumn().run()} title="Delete Column"><Trash2 size={16}/></button>
				<div class="h-4 w-px bg-slate-700"></div>
				<button type="button" on:click={() => editor.chain().focus().addRowBefore().run()} title="Add Row Before"><Rows3 size={16}/></button>
				<button type="button" on:click={() => editor.chain().focus().deleteRow().run()} title="Delete Row"><Trash2 size={16}/></button>
				<div class="h-4 w-px bg-slate-700"></div>
				<button type="button" on:click={() => editor.chain().focus().mergeOrSplit().run()} title="Merge/Split Cells">Merge</button>
				<button type="button" on:click={() => editor.chain().focus().deleteTable().run()} title="Delete Table" class="text-red-400"><Trash2 size={16}/></button>
			</div>
		{/if}
	{/if}
</div>

<div class="rounded-lg border border-slate-200 bg-white shadow-sm">
	{#if editor}
		<div class="flex flex-wrap items-center gap-1 border-b border-slate-200 p-2">
			<button type="button" on:click={() => editor.chain().focus().toggleBold().run()} class:is-active={activeState.bold} title="Bold"><Bold size={18} /></button>
			<button type="button" on:click={() => editor.chain().focus().toggleItalic().run()} class:is-active={activeState.italic} title="Italic"><Italic size={18} /></button>
			<div class="divider"></div>
			<button type="button" on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} class:is-active={activeState.heading2} title="Heading 2"><Heading2 size={18} /></button>
			<button type="button" on:click={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} class:is-active={activeState.heading3} title="Heading 3"><Heading3 size={18} /></button>
			<button type="button" on:click={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} class:is-active={activeState.heading4} title="Heading 4"><Heading4 size={18} /></button>
			<div class="divider"></div>
			<button type="button" on:click={() => editor.chain().focus().setParagraph().run()} title="Paragraph"><Pilcrow size={18} /></button>
			<button type="button" on:click={() => editor.chain().focus().toggleBlockquote().run()} class:is-active={activeState.blockquote} title="Blockquote"><Quote size={18} /></button>
			<div class="divider"></div>
			<button type="button" on:click={() => editor.chain().focus().toggleBulletList().run()} class:is-active={activeState.bulletList} title="Bullet List"><List size={18} /></button>
			<button type="button" on:click={() => editor.chain().focus().toggleOrderedList().run()} class:is-active={activeState.orderedList} title="Ordered List"><ListOrdered size={18} /></button>
			<div class="divider"></div>
			<button type="button" on:click={() => editor.chain().focus().setTextAlign('left').run()} class:is-active={activeState.alignLeft} title="Align Left"><AlignLeft size={18} /></button>
			<button type="button" on:click={() => editor.chain().focus().setTextAlign('center').run()} class:is-active={activeState.alignCenter} title="Align Center"><AlignCenter size={18} /></button>
			<button type="button" on:click={() => editor.chain().focus().setTextAlign('right').run()} class:is-active={activeState.alignRight} title="Align Right"><AlignRight size={18} /></button>
			<button type="button" on:click={() => editor.chain().focus().setTextAlign('justify').run()} class:is-active={activeState.alignJustify} title="Align Justify"><AlignJustify size={18} /></button>
			<div class="divider"></div>
			<button type="button" on:click={openLinkEditor} class:is-active={activeState.link} title="Add Link"><Link2 size={18} /></button>
			<button type="button" on:click={() => showImageModal = true} title="Add Image"><ImageIcon size={18} /></button>
			<button type="button" on:click={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule"><Minus size={18} /></button>
			<button type="button" on:click={() => editor.chain().focus().toggleCodeBlock().run()} class:is-active={activeState.codeBlock} title="Code Block"><Code size={18} /></button>
			<button type="button" on:click={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Add Table"><Table2 size={18}/></button>
		</div>
	{/if}
	<div bind:this={element} class="editor-content"></div>
</div>

<style>
	.editor-content :global(.ProseMirror) {
		min-height: 400px; padding: 1rem; color: #1a1a1a;
		transition: all 0.2s; font-family: 'Inter', sans-serif;
	}
	.editor-content :global(.ProseMirror:focus) { outline: none; }
	.editor-content :global(.ProseMirror > * + *) { margin-top: 0.75em; }
	.editor-content :global(h2) { font-size: 1.5em; font-weight: 700; }
	.editor-content :global(h3) { font-size: 1.25em; font-weight: 700; }
	.editor-content :global(h4) { font-size: 1.125em; font-weight: 700; }
	.editor-content :global(blockquote) { padding-left: 1rem; border-left: 3px solid #e2e8f0; color: #64748b; }
	.editor-content :global(ul), .editor-content :global(ol) { padding-left: 1.75rem; }
	.editor-content :global(ul) { list-style-type: disc; }
	.editor-content :global(ol) { list-style-type: decimal; }
	.editor-content :global(img) { max-width: 100%; height: auto; border-radius: 0.5rem; }
	.editor-content :global(img.ProseMirror-selectednode) { outline: 3px solid #60a5fa; }
	.editor-content :global(pre) {
		background: #0D1117; color: #C9D1D9; font-family: 'JetBrains Mono', monospace;
		padding: 1rem; border-radius: 0.5rem; white-space: pre-wrap;
	}
	.editor-content :global(pre code) { background: none; color: inherit; padding: 0; font-size: 0.9em; }
	.editor-content :global(table) { width: 100%; border-collapse: collapse; margin: 1em 0; table-layout: fixed; }
	.editor-content :global(th), .editor-content :global(td) { border: 1px solid #cbd5e1; padding: 0.75rem; vertical-align: top; position: relative; }
	.editor-content :global(th) { background-color: #f1f5f9; font-weight: bold; text-align: left; }
	.editor-content :global(.resize-cursor) { cursor: col-resize; }
	
	button {
		padding: 0.375rem; border-radius: 0.375rem; color: #334155;
		transition: all 150ms; min-width: 36px; font-weight: 500;
		border: none; background: transparent; cursor: pointer;
	}
	button:hover { background-color: #e2e8f0; color: #1e293b; }
	.is-active { background-color: #3b82f6; color: white; }
	.divider { width: 1px; height: 1.25rem; background-color: #e2e8f0; margin: 0 0.5rem; }
</style>
