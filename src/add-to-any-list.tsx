import { Action, ActionPanel, Form, showHUD, showToast, Toast, popToRoot } from "@raycast/api";
import { withAccessToken } from "@raycast/utils";
import { authorize, client } from "./oauth";
import { createTask, getProjects } from "./api";
import { useEffect, useState } from "react";

interface FormValues {
    title: string;
    projectId: string;
}

interface Project {
    id: string;
    name: string;
}

function AddToAnyList() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getProjects()
            .then((data) => setProjects(data))
            .catch((error) => {
                const message = error instanceof Error ? error.message : "Unknown error";
                showToast({ style: Toast.Style.Failure, title: "Failed to load lists", message });
            })
            .finally(() => setIsLoading(false));
    }, []);

    async function handleSubmit(values: FormValues) {
        const title = values.title.trim();

        if (!title) {
            await showToast({ style: Toast.Style.Failure, title: "Task title cannot be empty" });
            return;
        }

        try {
            await createTask(title, values.projectId);
            await showHUD(`✅ Added "${title}" to list`);
            await popToRoot();
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown error";
            await showToast({ style: Toast.Style.Failure, title: "Failed to add task", message });
        }
    }

    return (
        <Form
            isLoading={isLoading}
            actions={
                <ActionPanel>
                    <Action.SubmitForm title="Add Task" onSubmit={handleSubmit} />
                </ActionPanel>
            }
        >
            <Form.TextField id="title" title="Title" placeholder="Task title" />
            <Form.Dropdown id="projectId" title="List">
                {projects.map((project) => (
                    <Form.Dropdown.Item key={project.id} value={project.id} title={project.name} />
                ))}
            </Form.Dropdown>
        </Form>
    );
}

export default withAccessToken({ authorize, client })(AddToAnyList);
