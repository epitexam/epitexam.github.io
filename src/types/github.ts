export interface Project {
    id: number;
    name: string;
    description: string;
    html_url: string;
    language: string | null;
    stargazers_count: number;
    pushed_at: string;
    owner: {
        login: string;
        avatar_url: string;
    };
}
