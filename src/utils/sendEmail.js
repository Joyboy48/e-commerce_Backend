import nodemailer from "nodemailer";

export const sendEmail = async ({ email, subject, message }) => {
    try {
        // Create a transporter
        const transporter = nodemailer.createTransport({
            service: "Gmail", // Use Gmail as the email service
            auth: {
                user: process.env.EMAIL_USER, // Your Gmail address
                pass: process.env.EMAIL_PASS, // Your App Password
            },
        });

        // Define the email options
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender's email address
            to: email, // Recipient's email address
            subject: subject, // Email subject
            text: message, // Email body (plain text)
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error.message);
        throw new Error("Failed to send email");
    }
};