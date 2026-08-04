/**
 * Public browser config for the portfolio API + Cognito app client.
 *
 * These values are safe to commit: Cognito app client IDs and API URLs are
 * exposed in any SPA bundle. Real secrets (admin passwords, AWS keys) never
 * belong here. Env vars still override when set (local or CI).
 */
export const PUBLIC_API = {
  apiUrl: "https://yvsh2fai4l.execute-api.eu-central-1.amazonaws.com/prod",
  cognitoRegion: "eu-central-1",
  cognitoUserPoolId: "eu-central-1_Ouc8DVOzM",
  cognitoClientId: "7flmfss5sptb2cm3p2evthc3g",
} as const;

function trim(value: string | undefined): string {
  return (value ?? "").trim();
}

/** Prefer env when present; otherwise use committed public defaults. */
export function getApiUrl(): string {
  const fromEnv = trim(process.env.NEXT_PUBLIC_API_URL);
  return (fromEnv || PUBLIC_API.apiUrl).replace(/\/$/, "");
}

export function getCognitoRegion(): string {
  return trim(process.env.NEXT_PUBLIC_COGNITO_REGION) || PUBLIC_API.cognitoRegion;
}

export function getCognitoUserPoolId(): string {
  const fromEnv = trim(process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID);
  // Pool IDs look like `eu-central-1_AbCdEfGh` — reject mis-pasted client IDs.
  if (/^[a-z0-9-]+_[A-Za-z0-9]+$/.test(fromEnv)) return fromEnv;
  return PUBLIC_API.cognitoUserPoolId;
}

export function getCognitoClientId(): string {
  const fromEnv = trim(process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID);
  // App client IDs are long alphanumeric without underscores.
  if (fromEnv && !fromEnv.includes("_")) return fromEnv;
  return PUBLIC_API.cognitoClientId;
}

export function isPublicApiConfigured(): boolean {
  return Boolean(
    getApiUrl() &&
      getCognitoUserPoolId() &&
      getCognitoClientId() &&
      getCognitoRegion(),
  );
}
