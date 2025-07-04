// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-05-15',
    devtools: {enabled: true},
    runtimeConfig: {
        jwtSecret: process.env.JWT_SECRET,
        emailHost: process.env.EMAIL_HOST,
        emailPort: process.env.EMAIL_PORT,
        emailUser: process.env.EMAIL_USER,
        emailPass: process.env.EMAIL_PASS,
        emailFrom: process.env.EMAIL_FROM
    }
})
