import { getAccessToken } from "@raycast/utils";

const TICKTICK_API = "https://api.ticktick.com/open/v1";

interface TickTickProject {
    id: string;
    name: string;
}

export async function createTask(title: string, projectId?: string): Promise<void> {
    const { token } = getAccessToken();

    const body: Record<string, string> = { title };
    if (projectId) {
        body.projectId = projectId;
    }

    const response = await fetch(`${TICKTICK_API}/task`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`${response.status}: ${text}`);
    }
}

export async function getProjects(): Promise<TickTickProject[]> {
    const { token } = getAccessToken();

    const response = await fetch(`${TICKTICK_API}/project`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`${response.status}: ${text}`);
    }

    return (await response.json()) as TickTickProject[];
}
