import { LaunchProps, showHUD, showToast, Toast } from "@raycast/api";
import { withAccessToken, getAccessToken } from "@raycast/utils";
import { authorize, client } from "./oauth";

const TICKTICK_API = "https://api.ticktick.com/open/v1";

async function addToInbox(props: LaunchProps<{ arguments: Arguments.AddToInbox }>) {
    const title = props.arguments.title.trim();

    if (!title) {
        await showToast({ style: Toast.Style.Failure, title: "Task title cannot be empty" });
        return;
    }

    try {
        const { token } = getAccessToken();

        const response = await fetch(`${TICKTICK_API}/task`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title }),
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`${response.status}: ${text}`);
        }

        await showHUD(`✅ Added "${title}" to inbox`);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        await showToast({ style: Toast.Style.Failure, title: "Failed to add task", message });
    }
}

export default withAccessToken({ authorize, client })(addToInbox);
