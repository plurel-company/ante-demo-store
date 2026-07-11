import packageJson from "../package.json";

function installedPackageVersion(
  packageName: "@splitante/sdk" | "@splitante/react-sdk",
): string {
  const spec = packageJson.dependencies[packageName];
  return spec.replace(/^[\^~>=<]*/, "");
}

/** Installed @splitante/* versions from this app's package.json. */
export const INSTALLED_ANTE_SDK_VERSION = installedPackageVersion("@splitante/sdk");
export const INSTALLED_ANTE_REACT_SDK_VERSION = installedPackageVersion(
  "@splitante/react-sdk",
);

/**
 * npm @splitante/sdk@0.1.11–0.1.12 shipped a stale SDK_VERSION constant (0.1.10).
 * Correct upstream telemetry when the browser sends a version older than this app's
 * installed package.json dependency. Safe to remove after @splitante/sdk@0.1.13+.
 */
export function correctStaleSdkVersionHeaders(
  headers: Headers,
  request: Request,
): void {
  const clientSdk = request.headers.get("x-ante-sdk-version");
  if (clientSdk && clientSdk !== INSTALLED_ANTE_SDK_VERSION) {
    headers.set("X-Ante-SDK-Version", INSTALLED_ANTE_SDK_VERSION);
  }

  const clientReact = request.headers.get("x-ante-react-sdk-version");
  if (clientReact && clientReact !== INSTALLED_ANTE_REACT_SDK_VERSION) {
    headers.set("X-Ante-React-SDK-Version", INSTALLED_ANTE_REACT_SDK_VERSION);
  }
}
