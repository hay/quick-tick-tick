import { LaunchProps, showHUD, showToast, Toast } from "@raycast/api";
import { withAccessToken } from "@raycast/utils";
import { authorize, client } from "./oauth";
import { createTask } from "./api";

async function addToInbox(props: LaunchProps<{ arguments: Arguments.AddToInbox }>) {
    const title = props.arguments.title.trim();

    if (!title) {
        await showToast({ style: Toast.Style.Failure, title: "Task title cannot be empty" });
        return;
    }

    try {
        await createTask(title);
        await showHUD(`✅ Added "${title}" to inbox`);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        await showToast({ style: Toast.Style.Failure, title: "Failed to add task", message });
    }
}

export default withAccessToken({ authorize, client })(addToInbox);
