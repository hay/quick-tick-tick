import { LaunchProps, launchCommand, LaunchType, LocalStorage, showHUD, showToast, Toast } from "@raycast/api";
import { withAccessToken } from "@raycast/utils";
import { authorize, client } from "./oauth";
import { createTask } from "./api";
import { isSetupComplete } from "./setup";

async function addToList(props: LaunchProps<{ arguments: Arguments.AddToList }>) {
    const title = props.arguments.title.trim();

    if (!title) {
        await showToast({ style: Toast.Style.Failure, title: "Task title cannot be empty" });
        return;
    }

    const defaultProjectId = await LocalStorage.getItem<string>("defaultProjectId");

    if (!defaultProjectId) {
        await showToast({
            style: Toast.Style.Failure,
            title: "No favorite list configured",
            message: 'Run "Set Favorite List" first',
        });
        return;
    }

    try {
        await createTask(title, defaultProjectId);
        await showHUD(`✅ Added "${title}" to list`);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        await showToast({ style: Toast.Style.Failure, title: "Failed to add task", message });
    }
}

const authenticatedCommand = withAccessToken({ authorize, client })(addToList);

export default async function Command(props: LaunchProps<{ arguments: Arguments.AddToList }>) {
    if (!isSetupComplete()) {
        await showToast({ style: Toast.Style.Failure, title: "Setup required", message: "Opening setup guide…" });
        await launchCommand({ name: "setup-guide", type: LaunchType.UserInitiated });
        return;
    }

    return authenticatedCommand(props);
}
