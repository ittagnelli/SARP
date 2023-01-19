import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    extensions: ['.svelte'], 
	kit: {
		adapter: adapter({ out: 'SARP_BUILD' }),
		csp: {
			directives: {
				'frame-ancestors': ['none'],	// Non usiamo iframe nel sito per il momento
				'base-uri': ['self'],
				'connect-src': ['self', 'localhost', 'https://sarp.agnelli.it'],
				'default-src': ['self', 'https://accounts.google.com/'],
				'font-src': ['self'],
				'form-action': ['self'],
				'frame-src': ['https://accounts.google.com/'], // Non usiamo iframe nel sito per il momento
				'img-src': ['self', 'data:'],
				'manifest-src': ['self'],
				'media-src': ['none'],    // Non usiamo media(audio e video) nel sito per il momento
                'object-src': ['none'],    // Non usiamo object, applet o embed nel sito per il momento
				'script-src': ['self', "unsafe-inline"],// Dovremmo rimuovere gli script inline
				'script-src-elem': ['self', "unsafe-inline"],
				'style-src': ['self', 'https://accounts.google.com/', "unsafe-inline"],	// Dovremmo rimuovere gli stili inline
				'style-src-elem': ['self','https://accounts.google.com/', "unsafe-inline"],
				'worker-src': ['self']
			}
		},
		version: {
			name: "0.11.0"
		},
		csrf: {
			checkOrigin: true
		}
	}
};

export default config;