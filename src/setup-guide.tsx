import { Action, ActionPanel, Detail, openExtensionPreferences } from "@raycast/api";
import { SETUP_MARKDOWN } from "./setup";

export function SetupGuideView() {
    return (
        <Detail
            markdown={SETUP_MARKDOWN}
            actions={
                <ActionPanel>
                    <Action.OpenInBrowser
                        title="Open TickTick Developer Page"
                        url="https://developer.ticktick.com/manage"
                    />
                    <Action title="Open Extension Preferences" onAction={openExtensionPreferences} />
                </ActionPanel>
            }
        />
    );
}

export default function Command() {
    return <SetupGuideView />;
}
