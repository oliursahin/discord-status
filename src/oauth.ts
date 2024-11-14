import { OAuth, getPreferenceValues, showToast, Toast } from "@raycast/api";
import fetch from "node-fetch";

interface Preferences {
  clientId: string;
  clientSecret: string;
}

const preferences = getPreferenceValues<Preferences>();

const REDIRECT_URI = "https://raycast.com/redirect?packageName=discord-status";
const client = new OAuth.PKCEClient({
  redirectMethod: OAuth.RedirectMethod.Web,
  providerName: "Discord",
  providerIcon: "discord-icon.png",
  description: "Connect your Discord account to set status"
});

export async function authorize() {
  try {
    const tokenSet = await client.getTokens();
    
    if (tokenSet?.accessToken) {
      return tokenSet.accessToken;
    }

    const authRequest = await client.authorizationRequest({
      endpoint: "https://discord.com/api/oauth2/authorize",
      clientId: preferences.clientId,
      scope: "identify email",
      redirectURI: REDIRECT_URI,
      extraParameters: {
        response_type: "code",
        prompt: "consent"
      }
    });

    const { authorizationCode } = await client.authorize(authRequest);
    const tokens = await fetchTokens(authorizationCode, authRequest.codeVerifier);
    await client.setTokens(tokens);
    return tokens.access_token;
  } catch (error) {
    console.error("Authorization error:", error);
    await showToast({
      style: Toast.Style.Failure,
      title: "Authorization Failed",
      message: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

async function fetchTokens(authCode: string, codeVerifier: string): Promise<OAuth.TokenResponse> {
  try {
    const params = new URLSearchParams();
    params.append("client_id", preferences.clientId);
    params.append("client_secret", preferences.clientSecret);
    params.append("code", authCode);
    params.append("code_verifier", codeVerifier);
    params.append("grant_type", "authorization_code");
    params.append("redirect_uri", REDIRECT_URI);

    const response = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      body: params,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Token fetch error:", error);
      throw new Error(`Token fetch failed: ${error}`);
    }

    return response.json();
  } catch (error) {
    console.error("Token fetch error:", error);
    throw error;
  }
}

export async function getUser(token: string) {
  try {
    const response = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept": "application/json"
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("User fetch error:", error);
      throw new Error(`Failed to fetch user: ${error}`);
    }

    return response.json();
  } catch (error) {
    console.error("User fetch error:", error);
    throw error;
  }
} 