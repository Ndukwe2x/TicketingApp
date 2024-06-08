/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: '**',
                port: '',
                pathname: '/**',
            }
            // 'picsum.photos', 
            // 'images.unsplash.com', 
            // 'fastly.picsum.photos', 
            // 'example.com', 
            // 'image.tmdb.org',
            // 'images.pexels.com',
        ],
    },
};

export default nextConfig;
