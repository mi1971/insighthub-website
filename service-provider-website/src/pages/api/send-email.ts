export const prerender = false;

import type { APIRoute } from "astro";
import Mailgun from "mailgun.js";
import FormData from "form-data";

export const POST: APIRoute = async ({ request }) => {
    const data = await request.json();
    const { name, email, message } = data;

    if (!name || !email || !message) {
        return new Response(
            JSON.stringify({
                message: "Missing required fields",
            }),
            { status: 400 }
        );
    }

    try {
        const mailgun = new Mailgun(FormData);
        const client = mailgun.client({
            username: "api",
            key: import.meta.env.MAILGUN_API_KEY,
        });

        const domain = import.meta.env.MAILGUN_DOMAIN;
        const recipient = import.meta.env.CONTACT_EMAIL_RECIPIENT;

        const emailData = {
            from: `Contact Form <noreply@${domain}>`,
            to: recipient,
            subject: `New Contact Form Submission from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        };

        await client.messages.create(domain, emailData);

        return new Response(
            JSON.stringify({
                message: "Email sent successfully!",
            }),
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Mailgun Error:", error);
        return new Response(
            JSON.stringify({
                message: "Error sending email",
                error: error.message,
            }),
            { status: 500 }
        );
    }
};
