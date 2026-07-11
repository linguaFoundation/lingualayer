import { StellarWalletsKit, Networks } from "@creit.tech/stellar-wallets-kit";
import { FREIGHTER_ID } from "@creit.tech/stellar-wallets-kit/modules/freighter";
import { defaultModules } from "@creit.tech/stellar-wallets-kit/modules/utils";

const NETWORK =
  process.env.NEXT_PUBLIC_STELLAR_NETWORK === "mainnet"
    ? Networks.PUBLIC
    : Networks.TESTNET;

let _initialized = false;

export function initWalletsKit(): void {
  if (_initialized) return;
  StellarWalletsKit.init({
    network: NETWORK,
    selectedWalletId: FREIGHTER_ID,
    modules: defaultModules(),
  });
  _initialized = true;
}

export async function openWalletModal(): Promise<{ address: string; walletId: string }> {
  initWalletsKit();
  const { address } = await StellarWalletsKit.authModal();
  const walletId = FREIGHTER_ID; // authModal sets the active wallet internally
  return { address, walletId };
}

export async function getConnectedAddress(): Promise<string> {
  initWalletsKit();
  const { address } = await StellarWalletsKit.getAddress();
  return address;
}

export async function signTransaction(
  xdr: string,
  networkPassphrase?: string
): Promise<string> {
  initWalletsKit();
  const { signedTxXdr } = await StellarWalletsKit.signTransaction(xdr, {
    networkPassphrase: networkPassphrase ?? NETWORK,
  });
  return signedTxXdr;
}

export async function disconnectWallet(): Promise<void> {
  initWalletsKit();
  await StellarWalletsKit.disconnect();
}
