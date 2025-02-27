<script>
	import { createEventDispatcher } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { user } from './stores.js';
	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import { toHSL } from './toHSL.js';

	const dispatch = createEventDispatcher();

	export let chats;

	let copiedMessageId = null;
	let copyTimeout;

	function copyToClipboard(text, messageId) {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				if (copyTimeout) clearTimeout(copyTimeout);

				copiedMessageId = messageId;

				copyTimeout = setTimeout(() => {
					copiedMessageId = null;
				}, 2000);
			})
			.catch((err) => {
				console.error('Failed to copy text: ', err);
			});
	}

	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 200),

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: (t) => `
          transform: ${transform} scale(${t});
          opacity: ${t}
				`
			};
		}
	});
</script>

{#each chats as chat (chat.msgId)}
	<article class:user={chat.user === $user} in:fade out:send={{ key: chat.msgId }}>
		<div class="meta">
			<span class="time">
				{new Date(parseFloat(chat.time)).toLocaleString('en-US', {
					hour12: false
				})}
			</span>
			<span class="user">{chat.user}</span>
		</div>
		<div class="msg" style="background-color: {chat.user !== $user && toHSL(chat.user)}">
			{chat.msg}
			<button
				class="copy"
				title="Copy message"
				on:click|preventDefault={() => copyToClipboard(chat.msg, chat.msgId)}
			>
				{copiedMessageId === chat.msgId ? 'copied!' : 'copy'}
			</button>
			{#if chat.user === $user}
				<button
					class="delete"
					on:click|preventDefault={() => {
						const yes = confirm('Are you sure?');
						if (yes) dispatch('delete', chat.msgId);
					}}
				>
					delete
				</button>
			{/if}
		</div>
	</article>
{/each}

<style>
	article {
		margin: 1em 0;
	}
	.meta {
		font-size: 10px;
		margin: 0.5em;
	}

	.msg {
		display: inline-block;
		position: relative;
		line-height: 1.8;
		padding: 0.4em 1em;
		background-color: #ffffff;
		border-radius: 1em 1em 1em 0;
		white-space: pre-wrap;
		max-width: 85%;
		overflow-wrap: break-word;
		word-wrap: break-word;

		-ms-word-break: break-all;
		word-break: break-all;
		word-break: break-word;
		color: rgb(0, 0, 0);
	}

	.user {
		text-align: right;
	}

	.user > .msg {
		margin-left: 4em;
		background-color: #d6b025;
		color: rgb(0, 0, 0);
		border-radius: 1em 1em 0 1em;
	}

	.msg:hover button {
		opacity: 1;
	}

	button.delete {
		position: absolute;
		top: 0;
		left: -2em;
		width: 2em;
		height: 100%;
		background: no-repeat 50% 50% url(/trash.svg);
		background-size: 1.4em 1.4em;
		border: none;
		opacity: 0;
		transition: opacity 0.2s;
		text-indent: -9999px;
		cursor: pointer;
	}

	button.copy {
		position: absolute;
		top: 0;
		right: -2em;
		width: 2em;
		height: 100%;
		background: no-repeat 50% 50%
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='9' y='9' width='13' height='13' rx='2' ry='2'%3E%3C/rect%3E%3Cpath d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'%3E%3C/path%3E%3C/svg%3E");
		background-size: 1.2em 1.2em;
		border: none;
		opacity: 0;
		transition: opacity 0.2s;
		text-indent: -9999px;
		cursor: pointer;
	}

	.user button.copy {
		right: auto;
		left: -4em;
	}
</style>
