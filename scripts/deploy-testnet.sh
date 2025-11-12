#!/usr/bin/env bash
set -e
echo "Deploying lingualayer contracts to Stellar testnet..."
NETWORK="testnet"

for contract in dataset-registry license-router royalty-splitter; do
  echo "Building $contract..."
  cd contracts/$contract
  cargo build --target wasm32-unknown-unknown --release
  WASM=$(find target/wasm32-unknown-unknown/release -name "*.wasm" | head -1)
  echo "Deploying $contract from $WASM..."
  stellar contract deploy \
    --wasm "$WASM" \
    --network $NETWORK \
    --source mykey
  cd ../..
done
echo "Deployment complete!"
