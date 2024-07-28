import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()]
	// server: {
	// 	proxy: {
	// 		'/gun': 'http://localhost:3000'
	// 	}
	// },
});
