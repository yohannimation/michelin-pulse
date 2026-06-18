import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Michelin pulse',
        short_name: 'MichelinPulse',
        description: '',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#27509b',
        icons: [
            { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
    }
}