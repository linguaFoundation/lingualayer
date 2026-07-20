import { StellarWalletsKit, Networks } from "@creit.tech/stellar-wallets-kit";
import { FREIGHTER_ID } from "@creit.tech/stellar-wallets-kit/modules/freighter";
import { LEDGER_ID, LedgerModule } from "@creit.tech/stellar-wallets-kit/modules/ledger";
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
    modules: [...defaultModules(), new LedgerModule()],
  });
  _initialized = true;
}

export async function openWalletModal(): Promise<{ address: string; walletId: string }> {
  initWalletsKit();
  const { address } = await StellarWalletsKit.authModal();
  const walletId = FREIGHTER_ID;
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

export { LEDGER_ID };

export async function connectLedger(): Promise<{ address: string; walletId: string }> {
  if (typeof window === "undefined") throw new Error("Must be called in the browser");
  const nav = navigator as Navigator & { usb?: unknown; hid?: unknown };
  if (!nav.usb && !nav.hid) {
    throw new Error(
      "WebUSB/WebHID is not supported in this browser. Please use Chrome or Edge."
    );
  }
  initWalletsKit();
  StellarWalletsKit.setWallet(LEDGER_ID);
  const { address } = await StellarWalletsKit.getAddress();
  return { address, walletId: LEDGER_ID };
}
