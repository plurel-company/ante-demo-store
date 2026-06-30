/**
 * Cart HMAC signing — thin re-export of @splitante/sdk/signing.
 * Canonical JSON rules must match splitante.com; do not reimplement locally.
 */
export {
  canonicalizeCart,
  createCartSignature,
  verifyCartSignature,
} from "@splitante/sdk/signing";
