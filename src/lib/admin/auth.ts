"use client";

const TOKEN_KEY = "portfolio_admin_id_token";
const REFRESH_KEY = "portfolio_admin_refresh_token";
const EMAIL_KEY = "portfolio_admin_email";

/** Trim GitHub Actions / .env paste noise (trailing newlines break Cognito). */
function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(REFRESH_KEY);
}

export function getAdminEmail(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(EMAIL_KEY);
}

export function setAdminSession(
  idToken: string,
  email: string,
  refreshToken?: string,
) {
  sessionStorage.setItem(TOKEN_KEY, idToken);
  sessionStorage.setItem(EMAIL_KEY, email);
  if (refreshToken) {
    sessionStorage.setItem(REFRESH_KEY, refreshToken);
  }
}

export function clearAdminSession() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
  sessionStorage.removeItem(EMAIL_KEY);
}

export function isAdminConfigured() {
  return Boolean(
    env("NEXT_PUBLIC_API_URL") &&
      env("NEXT_PUBLIC_COGNITO_USER_POOL_ID") &&
      env("NEXT_PUBLIC_COGNITO_CLIENT_ID") &&
      env("NEXT_PUBLIC_COGNITO_REGION"),
  );
}

type CognitoAuthResult = {
  AuthenticationResult?: {
    IdToken?: string;
    AccessToken?: string;
    RefreshToken?: string;
  };
  message?: string;
  __type?: string;
};

async function cognitoInitiateAuth(body: Record<string, unknown>) {
  const region = env("NEXT_PUBLIC_COGNITO_REGION");
  const res = await fetch(`https://cognito-idp.${region}.amazonaws.com/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-amz-json-1.1",
      "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as CognitoAuthResult;
  return { res, data };
}

/** Browser login against Cognito USER_PASSWORD_AUTH (public app client). */
export async function loginAdmin(email: string, password: string) {
  const clientId = env("NEXT_PUBLIC_COGNITO_CLIENT_ID");
  const { res, data } = await cognitoInitiateAuth({
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: clientId,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  });

  if (!res.ok || !data.AuthenticationResult?.IdToken) {
    throw new Error(data.message ?? "Login failed");
  }

  setAdminSession(
    data.AuthenticationResult.IdToken,
    email,
    data.AuthenticationResult.RefreshToken,
  );
  return data.AuthenticationResult.IdToken;
}

/** Refresh ID token using the stored refresh token. */
async function refreshAdminSession(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  const email = getAdminEmail();
  const clientId = env("NEXT_PUBLIC_COGNITO_CLIENT_ID");
  if (!refreshToken || !email || !clientId) return null;

  const { res, data } = await cognitoInitiateAuth({
    AuthFlow: "REFRESH_TOKEN_AUTH",
    ClientId: clientId,
    AuthParameters: {
      REFRESH_TOKEN: refreshToken,
    },
  });

  if (!res.ok || !data.AuthenticationResult?.IdToken) {
    clearAdminSession();
    return null;
  }

  // Refresh flow does not return a new refresh token — keep the existing one
  setAdminSession(data.AuthenticationResult.IdToken, email, refreshToken);
  return data.AuthenticationResult.IdToken;
}

function authHeader(token: string) {
  return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
}

export async function adminFetch(
  path: string,
  init: RequestInit = {},
  retried = false,
): Promise<Response> {
  const base = env("NEXT_PUBLIC_API_URL").replace(/\/$/, "");
  const token = getAdminToken();
  if (!token) throw new Error("Not signed in");

  const headers = new Headers(init.headers);
  headers.set("Authorization", authHeader(token));
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${base}${path}`, { ...init, headers });

  if (res.status === 401 && !retried) {
    const next = await refreshAdminSession();
    if (next) return adminFetch(path, init, true);
    clearAdminSession();
    throw new Error("Session expired — sign in again at /admin/login");
  }

  return res;
}
