/**
 * IPFS gateway failover for metadata retrieval (Issue #135).
 *
 * Tries each gateway in order. On timeout or non-2xx response the next
 * gateway is attempted. Throws AggregateError only after all gateways fail.
 */

export const IPFS_GATEWAYS = [
  "https://gateway.pinata.cloud",
  "https://cloudflare-ipfs.com",
  "https://ipfs.io",
  "https://dweb.link",
  "https://4everland.io",
] as const;

const DEFAULT_TIMEOUT_MS = 8_000;

function cidToUrl(gateway: string, cid: string): string {
  const bare = cid.replace(/^ipfs:\/\//, "").replace(/^\/ipfs\//, "");
  return `${gateway}/ipfs/${bare}`;
}

async function tryGateway<T>(
  gateway: string,
  cid: string,
  timeoutMs: number
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(cidToUrl(gateway, cid), {
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} from ${gateway}`);
    return res.json() as Promise<T>;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fetch JSON metadata from IPFS with automatic gateway failover.
 *
 * Accepts a bare CID (`Qm…` / `bafy…`) or an `ipfs://` URI.
 * The first gateway to respond with a successful result wins; the rest
 * are skipped. All gateway errors are collected and surfaced together
 * only when every gateway has been exhausted.
 *
 * @example
 * const meta = await fetchIpfsMetadata<DatasetMetadata>("Qm...");
 *
 * @param cid - Bare CID or ipfs:// URI
 * @param options.timeoutMs - Per-gateway timeout (default 8 000 ms)
 * @param options.gateways  - Override the default gateway list
 */
export async function fetchIpfsMetadata<T = unknown>(
  cid: string,
  options?: { timeoutMs?: number; gateways?: readonly string[] }
): Promise<T> {
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const gateways = options?.gateways ?? IPFS_GATEWAYS;
  const errors: Error[] = [];

  for (const gateway of gateways) {
    try {
      return await tryGateway<T>(gateway, cid, timeoutMs);
    } catch (err) {
      errors.push(err instanceof Error ? err : new Error(String(err)));
    }
  }

  throw new AggregateError(errors, `All IPFS gateways failed for CID: ${cid}`);
}
