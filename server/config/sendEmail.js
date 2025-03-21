import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
dotenv.config();

if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    console.log("Provide GMAIL_USER and GMAIL_PASS inside the .env file");
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

const sendEmail = async ({ sendTo, subject, html }) => {
    try {
        const info = await transporter.sendMail({
            from: `Feelustration <${process.env.GMAIL_USER}>`,
            to: sendTo,
            subject: subject,
            html: html,
        });

        console.log("Email sent: ", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email: ", error);
    }
};

export default sendEmail;
