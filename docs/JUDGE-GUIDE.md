# Before — two-minute judge walkthrough

Live app: https://before-preipo.vividhub01.chatgpt.site

No wallet, deposit, or purchase is required for this walkthrough.

1. Select OpenAI and choose $100. Wait for the live quote.
2. Read the token amount, effective entry price, and immediate reverse sell quote. The difference is quoted in USDC and as a percentage.
3. Change the amount to $5,000. Observe the updated entry and exit results. Prices are live, so do not expect fixed values.
4. Scroll to “The valuation behind your price.” Compare the quoted entry valuation with the provider’s reference mark.
5. Select SpaceX and return to $100. This token uses a display multiplier; Before reads it on-chain and adjusts displayed units without altering the raw amount passed to the reverse quote.
6. If a quote expires, use the refresh button. If a data provider is temporarily unavailable, use Retry; the app does not silently replace live quotes with sample data.

## What the demo proves

A user can explore verified PreStocks assets, get current executable entry and reverse-exit quotes, and understand how their entry relates to an implied company valuation.

## What it does not prove

Future liquidity, fair value, profit, an atomic round-trip execution, or a completed funded-wallet purchase. The optional wallet signing and confirmed-receipt path has not been tested end to end.

## Source and reproduction

This repository contains the source and dependency lockfile. Clone it, follow the README, and run the five token-unit tests with `node --test tests/*.test.mjs`. Site-specific deployment identity and local build metadata are excluded from the repository. Public repository: https://github.com/gsmart2k/Before
