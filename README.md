# Before

Know your entry. Understand your exit.

[Live demo](https://before-preipo.vividhub01.chatgpt.site) · [Stocklana](https://hackathons.solana.com/hackathons/stocklana) · [Judge walkthrough](docs/JUDGE-GUIDE.md)

A Solana app for exploring exclusively PreStocks tokens, understanding the implied company valuation of an executable entry, and inspecting a reverse quote before signing a purchase.

## Run

Requires Node 22.13 or newer for the app. Regression tests use native TypeScript support; Node 22.18 or newer is needed to run the test command as written. The project was built and tested with Node 26.0.0.

```sh
npm ci
npm run dev
```

No API keys are needed for the current public PreStocks catalog, Solana RPC providers, and Jupiter keyless endpoints. Jupiter keyless access is rate limited; requests are spaced and 429s retried. Production traffic will need a shared rate limiter and an API-key plan before scaling.

```sh
npx tsc --noEmit
npm run build
```

## Data and transaction flow

- `/api/catalog` fetches https://prestocks.com/api/prestocks and caches the verified catalog for 30 seconds. Nothing is substituted with fixture prices on provider failures.
- `/api/quote` permits only mint addresses in that catalog, verifies decimals and the active scaled-UI multiplier from the token mint through Solana RPC, and requests a Jupiter Swap V2 USDC-to-token order followed by a token-to-USDC order for the exact quoted token amount.
- Token units = `buy.outAmount / 10^decimals × active UI multiplier`.
- Effective entry price = `USDC input / token units`.
- Entry implied valuation = `provider mark valuation × effective entry price / provider mark price`.
- Premium = `(effective entry price / provider mark price − 1) × 100`.
- Round-trip difference = `USDC input − sell.outAmount / 10^6`.
- USDC is presented at dollar parity for readability. This does not guarantee redemption value.
- The two quotes are independent snapshots; the reverse quote does not model the pool changes caused by executing the buy. They are not a simulated atomic round trip or a promise of future liquidity. Route fees are included; additional Solana network/rent costs are shown when supplied for a connected wallet.
- PreStocks does not supply a mark effective timestamp in the catalog. Retrieval time is explicitly distinct from the mark date. The provider mark is not described as fair value.
- Phantom and Solflare injected browser wallets are supported. A connected wallet triggers a new transaction-bearing quote. Review requires an eligibility acknowledgement, and quotes over 30 seconds old must be refreshed.
- `/api/execute` forwards only a user-signed transaction and the Jupiter request ID. Before never holds keys. Actual confirmed response amounts populate the session receipt. The receipt is not persisted and can be copied or opened on Solscan.

## Demo

1. Open the application and choose a company.
2. Compare a 100 USDC quote with a 5,000 USDC quote.
3. Explain how executable entry valuation differs from the issuer’s catalog price and reference mark.
4. Point to the reverse sell quote and round-trip difference.
5. Connect Phantom or Solflare, review an eligible purchase, and inspect the transaction in the wallet.
6. Only if choosing to transact with funded mainnet assets, sign and show the confirmed receipt.

No real-money purchase is part of automated verification. A funded-wallet confirmation is a remaining manual release check. Eligibility acknowledgement is a prototype gate, not a complete jurisdictional compliance system. Production launch requires a review of issuer terms and access restrictions.

## Architecture and credits

React, TypeScript, Vinext, Cloudflare Workers; the Sites starter and shadcn/Radix primitives; Lucide icons; Solana web3.js; PreStocks catalog and issuer-hosted logos; Solana public RPC and Jupiter Swap V2. All are existing third-party components/integrations, not original protocol implementations. Original product work is the Before interface and entry/exit explanation flow.

The live demo is public and its catalog was verified without login. The hackathon registration and submission are separate from deployment and have not yet been completed. This repository omits the live site’s deployment identity; `.openai/hosting.json` contains only portable binding settings.

## Regression tests

Run `node --test tests/*.test.mjs`. These cover token scaling, fractional multipliers, scheduled multiplier boundaries, ordinary tokens, and rejection of malformed or unsupported settings. Live integration checks separately confirmed that reverse quotes use the buy quote’s exact raw output amount. Mint display settings are refreshed at most every 30 seconds, sooner at a scheduled multiplier activation.

## Submission materials

- [Project description](docs/SUBMISSION.md)
- [Judge walkthrough](docs/JUDGE-GUIDE.md)
- [90-second demo recording script](docs/DEMO-SCRIPT.md)
- [Submission status](docs/STATUS.md)

A recording script is provided; no demo video is included. No real-money transaction was performed during validation.
