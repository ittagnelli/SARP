import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		csp: {
			directives: {
				'frame-ancestors': ['none'],	// Non usiamo iframe nel sito per il momento
				'base-uri': ['self'],
				'connect-src': ['self', 'localhost'],	// Quando sapremo il dominio potrebbe essere utile cambiarlo
				'default-src': ['self'],
				'font-src': ['self'],
				'form-action': ['self'],
				'frame-src': ['none'], // Non usiamo iframe nel sito per il momento
				'img-src': ['self', 'data:'],
				'manifest-src': ['none'],	// Non usiamo manifest nel sito per il momento, probabilmente in futuro
				'media-src': ['none'],    // Non usiamo media(audio e video) nel sito per il momento
                'object-src': ['none'],    // Non usiamo object, applet o embed nel sito per il momento
				'script-src': ['self', 'unsafe-inline'],// Dovremmo rimuovere gli script inline
				'script-src-elem': ['self', 'unsafe-inline'],
				'style-src': ['self', 'unsafe-inline'],	// Dovremmo rimuovere gli stili inline
				'style-src-elem': ['self', 'unsafe-inline'],
				'worker-src': ['none']	// Non usiamo service-worker per il momento, probabilmente in futuro
			}
		},
		csrf: {
			checkOrigin: true
		}
	}
};

export default config;
