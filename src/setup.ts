import { getPreferenceValues } from "@raycast/api";

export const SETUP_MARKDOWN = `
# Quick TickTick Setup
This extension connects directly to the TickTick API using OAuth. Before you can use it, you need to create an OAuth app on TickTick's developer portal. It's easier than it sounds, it will take you no more than a couple of minutes!

1. Go to https://developer.ticktick.com/manage and click 'New App'
2. Enter 'Quick TickTick' in the 'Name' field and press add
3. Click 'Edit' and enter 'https://raycast.com/redirect?packageName=quick-tick-tick' in the 'OAuth redirect URL' field
4. Open up the Quick TickTick extension settings by either opening up Raycast preferences or selecting them from the 'Actions' panel.
5. Copy Client ID and Client Secret from the App Setting page and paste them in the settings.
6. Try adding a task. You'll need to authorize the app. This just means you need to click a link to connect the extension.
7. Done! Happy TickTicking!
`.trim();

export function isSetupComplete(): boolean {
    const { clientId, clientSecret } = getPreferenceValues<Preferences>();
    return Boolean(clientId) && Boolean(clientSecret);
}
