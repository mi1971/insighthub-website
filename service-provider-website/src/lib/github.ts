
const GITHUB_API_URL = "https://api.github.com";

function getHeaders() {
    const token = import.meta.env.GITHUB_TOKEN;
    if (!token) {
        throw new Error("GITHUB_TOKEN is not defined in environment variables");
    }
    return {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "Astro-Blog-Editor",
    };
}

export interface GitHubFile {
    sha: string;
    content: string;
    path: string;
    name: string;
    type: "file";
}

export interface GitHubDirectoryItem {
    name: string;
    path: string;
    type: string;
    sha: string;
}

export async function getFile(path: string): Promise<GitHubFile | GitHubDirectoryItem[] | null> {
    const owner = import.meta.env.GITHUB_OWNER;
    const repo = import.meta.env.GITHUB_REPO;

    const url = `${GITHUB_API_URL}/repos/${owner}/${repo}/contents/${path}`;

    const response = await fetch(url, { headers: getHeaders() });

    if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (Array.isArray(data)) {
        return data.map((file: any) => ({
            name: file.name,
            path: file.path,
            type: file.type,
            sha: file.sha
        }));
    }

    // GitHub API returns content as base64
    const content = Buffer.from(data.content, 'base64').toString('utf-8');

    return {
        sha: data.sha,
        content,
        path: data.path,
        name: data.name,
        type: 'file'
    };
}

export async function saveFile(path: string, content: string, message: string, sha?: string) {
    const owner = import.meta.env.GITHUB_OWNER;
    const repo = import.meta.env.GITHUB_REPO;

    const url = `${GITHUB_API_URL}/repos/${owner}/${repo}/contents/${path}`;

    const body: any = {
        message,
        content: Buffer.from(content).toString('base64'),
    };

    if (sha) {
        body.sha = sha;
    }

    const response = await fetch(url, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`GitHub API Error: ${response.status} ${error}`);
    }

    return response.json();
}
