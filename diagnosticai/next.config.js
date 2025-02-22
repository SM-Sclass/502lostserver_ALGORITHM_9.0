/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['nextform.s3.eu-north-1.amazonaws.com'], // Add your image domain here
      },
    // i18n: {
    //     locales: ['en', 'fr', 'nl-NL'],
    //     defaultLocale: 'en',
    //   },
    // async rewrites() {
    //     return [
    //         {
    //             source: '/api/:path*',
    //             destination: process.env.NEXT_PUBLIC_PYTHON_LOCAL_IP + '/:path*'
    //         }
    //     ]
    // },
    // async headers() {
    //     return [
    //         {
    //             source: "/:path*",
    //             headers: [
    //                 { key: "Access-Control-Allow-Credentials", value: "true" },
    //                 { key: "Access-Control-Allow-Origin", value: "*" },
    //                 { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
    //                 { key: "Access-Control-Allow-Headers", value: "*" },
    //             ]
    //         }
    //     ];
    // }
};

module.exports = nextConfig;
