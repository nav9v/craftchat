<script>
	import { fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	export let ariaLabelledBy = null;
	export let ariaLabel = null;
	export let placeholder = null;
	export let value = '';
	export let name = null;
	export let maxLength = 5000;
	export let maxRows = 8;
	export let disabled = false;
	export let multiline = false;

	const CHARS_PER_LINE = 40;

	function calcRows(v) {
		let textRows = Math.floor(v.length / CHARS_PER_LINE) + 1;
		const numberOfReturns = (v.match(/\n/g) || []).length;
		textRows += numberOfReturns;
		return Math.min(maxRows, textRows);
	}

	$: rows = calcRows(value);

	function handleKeyPress(e) {
		if (e.which === 13 && !e.shiftKey) {
			e.target.form.dispatchEvent(
				new Event('submit', {
					cancelable: true
				})
			);
			e.preventDefault();
		}
	}
</script>

<div class="input-with-button">
	{#if multiline}
		<textarea
			{disabled}
			{rows}
			class="input"
			type="text"
			{maxLength}
			{name}
			bind:value
			on:keypress={handleKeyPress}
			aria-labelledby={ariaLabelledBy}
			aria-label={ariaLabel}
			{placeholder}
		/>
	{:else}
		<input
			{disabled}
			{rows}
			class="input"
			type="text"
			{maxLength}
			{name}
			bind:value
			aria-labelledby={ariaLabelledBy}
			aria-label={ariaLabel}
			{placeholder}
		/>
	{/if}
	{#if value}
		<input class="submit" type="submit" value="Send" in:fade out:fade />
	{/if}
</div>

<style>
	.input-with-button {
		position: relative;
	}

	.input {
		padding: 0.6em 2em 0.6em 0.6em;
		border-radius: 1em;
		width: 100%;
		resize: vertical; /* Allow vertical resizing */
		min-height: 2.5em;
		max-height: 200px;
		overflow-x: hidden;
		overflow-y: auto;
	}

	.input:disabled {
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==)
			repeat;
		cursor: not-allowed;
	}

	.input:focus {
		outline: none;
		box-shadow: 0 0 0 2px rgba(238, 214, 55, 0.772);
	}

	.submit {
		position: absolute;
		top: 0.4em;
		right: 0.4em;
		width: 1.5em;
		height: 1.5em;
		background: no-repeat 50% 50% url(/up.svg);
		background-size: 0.75em;
		border: none;
		border-radius: 50%;
		background-color: #f16b0c;
		text-indent: -9999px;
		cursor: pointer;
	}
</style>
