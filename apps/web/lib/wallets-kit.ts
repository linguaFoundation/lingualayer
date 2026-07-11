import {
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
  FREIGHTER_ID,
} from "@creit.tech/stellar-wallets-kit";

const NETWORK =
  process.env.NEXT_PUBLIC_STELLAR_NETWORK === "mainnet"
    ? WalletNetwork.PUBLIC
    : WalletNetwork.TESTNET;

let _kit: StellarWalletsKit | null = null;

export function getWalletsKit(): StellarWalletsKit {
  if (_kit) return _kit;
  _kit = new StellarWalletsKit({
    network: NETWORK,
    selectedWalletId: FREIGHTER_ID,
    modules: allowAllModules(),
  });
  return _kit;
}

export async function openWalletModal(): Promise<{ address: string; walletId: string }> {
  const kit = getWalletsKit();
  return new Promise((resolve, reject) => {
    kit.openModal({
      onWalletSelected: async (option) => {
        try {
          await kit.setWallet(option.id);
          const { address } = await kit.getAddress();
          resolve({ address, walletId: option.id });
        } catch (e) {
          reject(e);
        }
      },
      onClosed: () => reject(new Error("wallet modal closed")),
      modalTitle: "Connect your Stellar Wallet",
      notAvailableText: "Not installed — click to get it",
    });
  });
}
