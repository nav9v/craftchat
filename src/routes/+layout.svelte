<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { darkMode } from './stores.js';

	let darkModeClass = '';
	$: darkModeClass = $darkMode ? 'dark-mode' : '';

	onMount(() => {
		document.body.classList.toggle('dark-mode', $darkMode);
	});

	$: {
		document.body.classList.toggle('dark-mode', $darkMode);
	}
</script>

<slot />
