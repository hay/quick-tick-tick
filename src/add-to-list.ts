import { LaunchProps, LocalStorage, showHUD, showToast, Toast } from "@raycast/api";
import { withAccessToken } from "@raycast/utils";
import { authorize, client } from "./oauth";
import { createTask } from "./api";

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
            title: "No default list configured",
            message: 'Run "Set Default List" first',
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

export default withAccessToken({ authorize, client })(addToList);