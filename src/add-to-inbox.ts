import { LaunchProps, launchCommand, LaunchType, showHUD, showToast, Toast } from "@raycast/api";
import { withAccessToken } from "@raycast/utils";
import { authorize, client } from "./oauth";
import { createTask } from "./api";
import { isSetupComplete } from "./setup";

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

const authenticatedCommand = withAccessToken({ authorize, client })(addToInbox);

export default async function Command(props: LaunchProps<{ arguments: Arguments.AddToInbox }>) {
    if (!isSetupComplete()) {
        await showToast({ style: Toast.Style.Failure, title: "Setup required", message: "Opening setup guide…" });
        await launchCommand({ name: "setup-guide", type: LaunchType.UserInitiated });
        return;
    }

    return authenticatedCommand(props);
}
