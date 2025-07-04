import nodemailer from 'nodemailer';

// Perhatikan: Kita tidak menggunakan useRuntimeConfig di sini.
// Config akan diteruskan sebagai parameter dari event handler yang memanggilnya.
export const sendEmail = async (options) => {
    // Ambil config dari options
    const config = options.config;

    // 1) Buat transporter menggunakan variabel dari runtimeConfig
    const transporter = nodemailer.createTransport({
        host: config.emailHost,
        port: config.emailPort,
        auth: {
            user: config.emailUser,
            pass: config.emailPass,
        },
    });

    // 2) Tentukan opsi email
    const mailOptions = {
        from: `Express Auth JS <${config.emailFrom}>`, // Anda bisa ganti "Express Auth JS"
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    // 3) Kirim email
    await transporter.sendMail(mailOptions);
};