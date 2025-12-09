import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
    const data = await request.formData();
    const password = data.get('password');

    const adminPassword = import.meta.env.ADMIN_PASSWORD;

    if (!adminPassword) {
        return new Response(JSON.stringify({
            message: "Server misconfigured: ADMIN_PASSWORD not set"
        }), { status: 500 });
    }

    if (password === adminPassword) {
        cookies.set('auth_token', 'authenticated', {
            path: '/',
            httpOnly: true,
            secure: import.meta.env.PROD,
            maxAge: 60 * 60 * 24 * 7, // 1 week
        });
        return new Response(null, {
            status: 302,
            headers: {
                'Location': '/admin'
            }
        });
    }

    return new Response(JSON.stringify({
        message: "Incorrect password"
    }), { status: 401 });
};
