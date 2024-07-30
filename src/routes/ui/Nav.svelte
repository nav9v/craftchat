<script>
	import { createEventDispatcher } from 'svelte';
	import { darkMode, toggleDarkMode } from '../stores.js';
  $: icon = $darkMode ? '🌞' : '🌝';

	export let showBack = false;
	export let backText = null;
	export let showSignIn = false; 
	const dispatch = createEventDispatcher();
</script>

<nav>
	{#if showBack}
		<button class="back-button" on:click={() => dispatch('back')}>
			<svg height="40" width="40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
				<path
					fill="currentColor"
					d="M13.7 15.3a1 1 0 0 1-1.4 1.4l-4-4a1 1 0 0 1 0-1.4l4-4a1 1 0 0 1 1.4
                1.4L10.42 12l3.3 3.3z"
				/>
			</svg>
			{#if backText}
				<span>{backText}</span>
			{/if}
		</button>
	{:else}
		<div class="placeholder"></div>
		<!-- Add a placeholder div here -->
	{/if}
	<h1>
		<slot />
	</h1>
	{#if showSignIn}
		<button class="sign-in-button"> Sign In </button>
	{:else}
		<div class="placeholder"></div>
		<!-- Add a placeholder div here -->
	{/if}
	<button class="dark-mode-b" on:click={toggleDarkMode}>{icon}</button>
</nav>

<style>
	nav {
		position: -webkit-sticky;
		position: sticky;
		z-index: 10;
		top: 0;
		margin: 0;
		padding: 0.75em;
		display: flex;
		justify-content: space-between;
		align-items: center;
		min-height: 2em;
	}

	button {
		display: flex;
		border: none;
		background-color: white;
		align-items: center;
		color: #f16b0c;
	}

	button:hover {
		transition: 0.75s cubic-bezier(0, 1.2, 0.2, 1.5);
		transform: scale(1.1);
	}

	span {
		margin: 0 0 0 -1em;
		font-size: 0.8em;
	}

	h1 {
		flex-grow: 1;
		text-align: center;
		margin: 0;
		font-size: 1.4em;
	}

	.dark-mode-b {
		border: none;
		background-color: transparent;
		cursor: pointer;
		margin-right: 1em;
    font-size: 20px;
	}

	.dark-mode-b:hover {
		transition: 0.75s cubic-bezier(0, 1.2, 0.2, 1.5);
		transform: scale(1.1);
	}

	.sign-in-button {
		margin-left: auto;
	}

	.placeholder {
		width: 25px;
	}

	:global(.dark-mode) nav {
		background-color: #333;
		border-bottom: 1px solid #ffffff;
	}

	:global(.dark-mode) button {
		background-color: #333;
		color: white;
	}
</style>
