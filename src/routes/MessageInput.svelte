<script>
	import { createEventDispatcher } from 'svelte';
	import { user } from './stores.js';
	import Input from './ui/Input.svelte';
	import { gun } from './initGun.js';
	import { getMessageSizeInBytes, formatBytes } from './utils/messageUtils.js';

	const dispatch = createEventDispatcher();
	let msgInput;
	let messageSize = 0;

	$: if (msgInput) {
		messageSize = getMessageSizeInBytes(msgInput);
	} else {
		messageSize = 0;
	}

	const MAX_SIZE = 1024 * 100;
</script>

<div>
	<form
		method="get"
		autocomplete="off"
		on:submit|preventDefault={(e) => {
			if (!msgInput || !msgInput.trim()) return;
			if (messageSize > MAX_SIZE) {
				alert(
					`Message too large (${formatBytes(messageSize)}). Maximum size is ${formatBytes(MAX_SIZE)}.`
				);
				return;
			}
			dispatch('message', msgInput);
			msgInput = '';
			messageSize = 0;
			e.target.msg.focus();
		}}
	>
		<Input
			multiline
			disabled={!$user}
			maxRows={8}
			bind:value={msgInput}
			name="msg"
			placeholder="Type your message"
			ariaLabel="Message"
		/>
		{#if messageSize > 0}
			<div
				class="message-size"
				class:warning={messageSize > MAX_SIZE * 0.8}
				class:error={messageSize > MAX_SIZE}
			>
				Size: {formatBytes(messageSize)}
			</div>
		{/if}
	</form>
</div>

<div>
	<form
		method="get"
		autocomplete="off"
		on:submit|preventDefault={(e) => {
			if (!msgInput || !msgInput.trim()) return;
			dispatch('message', msgInput);
			msgInput = '';
			e.target.msg.focus();
		}}
	>
		<Input
			multiline
			disabled={!$user}
			maxRows={8}
			bind:value={msgInput}
			name="msg"
			placeholder="Type your message"
			ariaLabel="Message"
		/>
	</form>
</div>

<style>
	div {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
	}

	form {
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		max-width: 640px;
		background-color: white;
		padding: 0.25em 1em;
	}
	:global(.dark-mode) form {
		background-color: #333;
		color: white;
	}

	.message-size {
		font-size: 0.75rem;
		text-align: right;
		padding: 0.25em 0.5em;
		color: #666;
	}

	.warning {
		color: #f16b0c;
	}

	.error {
		color: #ff0000;
		font-weight: bold;
	}
</style>
