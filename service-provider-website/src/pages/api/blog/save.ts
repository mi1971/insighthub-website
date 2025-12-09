import type { APIRoute } from 'astro';
import { saveFile } from '../../../lib/github';
// @ts-ignore
import matter from 'gray-matter';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
    if (!cookies.has('auth_token')) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    try {
        const data = await request.json();
        const { filename, frontmatter, content, sha } = data;

        if (!filename || !frontmatter || content === undefined) {
            return new Response(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
        }

        // Construct file content
        const fileContent = matter.stringify(content, frontmatter);
        const path = `src/content/blog/${filename}`;
        const message = `Update ${filename}`;

        const result = await saveFile(path, fileContent, message, sha);

        return new Response(JSON.stringify(result), { status: 200 });

    } catch (e: any) {
        console.error("Save error:", e);
        return new Response(JSON.stringify({ message: e.message || "Failed to save" }), { status: 500 });
    }
};
