import { Action, ActionPanel, Form, LocalStorage, showHUD, showToast, Toast, popToRoot } from "@raycast/api";
import { withAccessToken } from "@raycast/utils";
import { authorize, client } from "./oauth";
import { getProjects } from "./api";
import { isSetupComplete } from "./setup";
import { SetupGuideView } from "./setup-guide";
import { useEffect, useState } from "react";

interface Project {
    id: string;
    name: string;
}

function SetFavoriteList() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentProjectId, setCurrentProjectId] = useState<string>("");

    useEffect(() => {
        Promise.all([getProjects(), LocalStorage.getItem<string>("defaultProjectId")])
            .then(([data, savedId]) => {
                setProjects(data);
                if (savedId) {
                    setCurrentProjectId(savedId);
                }
            })
            .catch((error) => {
                const message = error instanceof Error ? error.message : "Unknown error";
                showToast({ style: Toast.Style.Failure, title: "Failed to load lists", message });
            })
            .finally(() => setIsLoading(false));
    }, []);

    async function handleSubmit(values: { projectId: string }) {
        await LocalStorage.setItem("defaultProjectId", values.projectId);
        const project = projects.find((p) => p.id === values.projectId);
        await showHUD(`✅ Favorite list set to "${project?.name ?? "Unknown"}"`);
        await popToRoot();
    }

    return (
        <Form
            isLoading={isLoading}
            actions={
                <ActionPanel>
                    <Action.SubmitForm title="Save Favorite List" onSubmit={handleSubmit} />
                </ActionPanel>
            }
        >
            <Form.Dropdown id="projectId" title="Favorite List" value={currentProjectId} onChange={setCurrentProjectId}>
                {projects.map((project) => (
                    <Form.Dropdown.Item key={project.id} value={project.id} title={project.name} />
                ))}
            </Form.Dropdown>
        </Form>
    );
}

const AuthenticatedCommand = withAccessToken({ authorize, client })(SetFavoriteList);

export default function Command() {
    if (!isSetupComplete()) {
        return <SetupGuideView />;
    }

    return <AuthenticatedCommand />;
}
