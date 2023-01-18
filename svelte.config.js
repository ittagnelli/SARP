import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    extensions: ['.svelte'], 
	kit: {
		adapter: adapter({ out: 'SARP_BUILD' }),
		csp: {
			directives: {
				'frame-ancestors': ['none'], // Non usiamo iframe nel sito per il momento
				'base-uri': ['self'],
				'connect-src': ['self', 'localhost', 'https://sarp.agnelli.it'],	// Quando sapremo il dominio potrebbe essere utile cambiarlo
				'default-src': ['self', 'https://accounts.google.com/'],
				'font-src': ['self'],
				'form-action': ['self'],
				'frame-src': ['https://accounts.google.com/'], // Non usiamo iframe nel sito per il momento
				'img-src': ['self', 'data:'],
				'manifest-src': ['none'],	// Non usiamo manifest nel sito per il momento, probabilmente in futuro
				'media-src': ['none'],    // Non usiamo media(audio e video) nel sito per il momento
                'object-src': ['none'],    // Non usiamo object, applet o embed nel sito per il momento
				'script-src': ['self', 'unsafe-inline'],// Dovremmo rimuovere gli script inline
				'script-src-elem': ['self', 'unsafe-inline'],
				'style-src': ['self', 'unsafe-inline', 'https://accounts.google.com/'],	// Dovremmo rimuovere gli stili inline
				'style-src-elem': ['self', 'unsafe-inline', 'https://accounts.google.com/'],
				'worker-src': ['none']	// Non usiamo service-worker per il momento, probabilmente in futuro
			}
		},
		csrf: {
			checkOrigin: true
		}
	}
};

export default config;