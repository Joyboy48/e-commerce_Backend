import nodemailer from "nodemailer";

export const sendEmail = async ({ email, subject, message }) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail", // Use your email service
        auth: {
            user: process.env.EMAIL_USER, // Your email
            pass: process.env.EMAIL_PASS, // Your email password
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        text: message,
    };

    await transporter.sendMail(mailOptions);
};