import packageJson from "../package.json";

function installedPackageVersion(
  packageName: "@plurel/sdk" | "@plurel/react-sdk",
): string {
  const spec = packageJson.dependencies[packageName];
  if (!spec) return "0.0.0";
  if (spec.startsWith("file:")) {
    return "1.0.0";
  }
  return spec.replace(/^[\^~>=<]*/, "");
}

/** Installed @plurel/* versions from this app's package.json. */
export const INSTALLED_PLUREL_SDK_VERSION = installedPackageVersion("@plurel/sdk");
export const INSTALLED_PLUREL_REACT_SDK_VERSION = installedPackageVersion("@plurel/react-sdk");

/** @deprecated Use INSTALLED_PLUREL_SDK_VERSION */
export const INSTALLED_ANTE_SDK_VERSION = INSTALLED_PLUREL_SDK_VERSION;
/** @deprecated Use INSTALLED_PLUREL_REACT_SDK_VERSION */
export const INSTALLED_ANTE_REACT_SDK_VERSION = INSTALLED_PLUREL_REACT_SDK_VERSION;

/**
 * Correct upstream telemetry when the browser sends a version older than this app's
 * installed package.json dependency.
 */
export function correctStaleSdkVersionHeaders(
  headers: Headers,
  request: Request,
): void {
  const clientSdk =
    request.headers.get("x-plurel-sdk-version") ?? request.headers.get("x-ante-sdk-version");
  if (clientSdk && clientSdk !== INSTALLED_PLUREL_SDK_VERSION) {
    headers.set("X-Plurel-SDK-Version", INSTALLED_PLUREL_SDK_VERSION);
    headers.set("X-Ante-SDK-Version", INSTALLED_PLUREL_SDK_VERSION);
  }

  const clientReact =
    request.headers.get("x-plurel-react-sdk-version") ??
    request.headers.get("x-ante-react-sdk-version");
  if (clientReact && clientReact !== INSTALLED_PLUREL_REACT_SDK_VERSION) {
    headers.set("X-Plurel-React-SDK-Version", INSTALLED_PLUREL_REACT_SDK_VERSION);
    headers.set("X-Ante-React-SDK-Version", INSTALLED_PLUREL_REACT_SDK_VERSION);
  }
}
