import { OAuth, getPreferenceValues } from "@raycast/api";
import fetch from "node-fetch";

const preferences = getPreferenceValues();
const CLIENT_ID = preferences.clientId;
const CLIENT_SECRET = preferences.clientSecret;
const REDIRECT_URI = "https://raycast.com/redirect/oauth";
const SCOPE = "identify email";

const oauthClient = new OAuth.PKCEClient({
  redirectMethod: OAuth.RedirectMethod.Web,
  providerName: "Discord",
  providerIcon: "discord-icon.png",
  providerId: "discord",
  description: "Connect your Discord account",
});

export async function authorize(): Promise<string | undefined> {
  console.log("Starting authorization process");
  
  try {
    const existingTokens = await oauthClient.getTokens();
    console.log("Existing tokens:", existingTokens ? "Found" : "Not found");
    
    if (existingTokens?.accessToken) {
      console.log("Using existing access token");
      return existingTokens.accessToken;
    }

    console.log("Creating authorization request");
    const authRequest = await oauthClient.authorizationRequest({
      endpoint: "https://discord.com/api/oauth2/authorize",
      clientId: CLIENT_ID,
      scope: SCOPE,
      redirectURI: REDIRECT_URI,
      extraParameters: {
        response_type: "code",
        prompt: "consent"
      }
    });

    console.log("Authorization request created");
    console.log("Waiting for authorization code");
    
    const { authorizationCode } = await oauthClient.authorize(authRequest);
    console.log("Authorization code received");
    
    const tokens = await fetchTokens(authorizationCode, authRequest.codeVerifier);
    console.log("Tokens fetched successfully");
    
    await oauthClient.setTokens(tokens);
    console.log("Tokens stored successfully");
    
    return tokens.access_token;
  } catch (error) {
    console.error("Authorization error:", error);
    throw error;
  }
}

async function fetchTokens(authCode: string, codeVerifier: string): Promise<OAuth.TokenResponse> {
  console.log("Fetching tokens with auth code");
  
  const response = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: authCode,
      code_verifier: codeVerifier,
      grant_type: "authorization_code",
      redirect_uri: REDIRECT_URI,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Token fetch failed:", errorText);
    throw new Error(`Failed to fetch tokens: ${errorText}`);
  }

  const tokens = await response.json();
  console.log("Tokens fetched successfully");
  return tokens;
}

export async function getUser(token: string) {
  console.log("Fetching user data");
  
  const response = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("User fetch failed:", errorText);
    throw new Error(`Failed to fetch user data: ${errorText}`);
  }

  const userData = await response.json();
  console.log("User data fetched successfully");
  return userData;
} 