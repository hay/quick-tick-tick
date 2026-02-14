import { OAuth, getPreferenceValues } from "@raycast/api";

const AUTHORIZE_URL = "https://ticktick.com/oauth/authorize";
const TOKEN_URL = "https://ticktick.com/oauth/token";
const SCOPE = "tasks:write tasks:read";

const client = new OAuth.PKCEClient({
    redirectMethod: OAuth.RedirectMethod.Web,
    providerName: "TickTick",
    providerIcon: "extension-icon.png",
    description: "To use this extension you need to click the button below to allow it to create tasks on TickTick",
});

async function fetchTokens(authRequest: OAuth.AuthorizationRequest, authCode: string): Promise<OAuth.TokenResponse> {
    const { clientId, clientSecret } = getPreferenceValues<Preferences>();

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);
    params.append("code", authCode);
    params.append("code_verifier", authRequest.codeVerifier);
    params.append("grant_type", "authorization_code");
    params.append("redirect_uri", authRequest.redirectURI);

    const response = await fetch(TOKEN_URL, { method: "POST", body: params });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Token exchange failed (${response.status}): ${text}`);
    }

    return (await response.json()) as OAuth.TokenResponse;
}

async function refreshTokens(refreshToken: string): Promise<OAuth.TokenResponse> {
    const { clientId, clientSecret } = getPreferenceValues<Preferences>();

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);
    params.append("refresh_token", refreshToken);
    params.append("grant_type", "refresh_token");

    const response = await fetch(TOKEN_URL, { method: "POST", body: params });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Token refresh failed (${response.status}): ${text}`);
    }

    return (await response.json()) as OAuth.TokenResponse;
}

export async function authorize(): Promise<string> {
    const { clientId } = getPreferenceValues<Preferences>();

    const tokenSet = await client.getTokens();

    if (tokenSet?.accessToken) {
        if (tokenSet.refreshToken && tokenSet.isExpired()) {
            const tokenResponse = await refreshTokens(tokenSet.refreshToken);
            await client.setTokens(tokenResponse);
            return tokenResponse.access_token;
        }
        return tokenSet.accessToken;
    }

    const authRequest = await client.authorizationRequest({
        endpoint: AUTHORIZE_URL,
        clientId,
        scope: SCOPE,
    });

    const { authorizationCode } = await client.authorize(authRequest);
    const tokenResponse = await fetchTokens(authRequest, authorizationCode);
    await client.setTokens(tokenResponse);

    return tokenResponse.access_token;
}

export { client };
