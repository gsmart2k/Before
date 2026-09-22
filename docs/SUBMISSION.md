# Before — Stocklana submission

## Project name
Before

## Team name
Before

## Tagline
Know your entry. Understand your exit.

## Short description
Before turns a PreStocks purchase into a clear decision: compare live entry prices, implied company valuations, and reverse sell quotes before connecting a wallet.

## Live demo
https://before-preipo.vividhub01.chatgpt.site

The demo is public. No wallet is required to explore companies or request entry and exit quotes.

## Source repository
https://github.com/gsmart2k/Before

## Primary track
Main track — analytics / investing experience

## Sponsor bounty
Best Use of PreStocks

Only PreStocks-issued pre-IPO assets are available for selection. Before does not integrate Tessera or another pre-IPO token issuer. Jupiter routes may use ordinary intermediary assets such as SOL and USDC.

## Project description

A familiar company name and a token price are not enough to understand an investment. A prospective PreStocks buyer needs to know what company valuation their executable price implies, how that compares with the issuer’s reference mark, and what an immediate exit might return.

Before puts those questions in one working interface. Choose a supported company, enter an amount in USDC, and receive a live buy quote. Before then requests a reverse sell quote for the exact raw token amount in that buy quote. It displays the quoted token amount, effective entry price, implied company valuation, premium or discount to the provider’s mark, and the USDC difference between the two quotes.

Changing the order size makes liquidity and execution costs tangible. Users can explore these results without a wallet. The app also includes an optional Phantom/Solflare purchase-review and receipt flow; funded-wallet signing and receipt confirmation have not yet been verified end to end.

The Solana integration is central to the product. Before verifies token addresses against the PreStocks catalog, reads mint settings from Solana, and uses Jupiter’s live routing. It applies Token-2022 display multipliers correctly while preserving raw units for quote requests—a distinction that matters for assets such as OpenAI and SpaceX.

Before gives PreStocks users a clear path from discovery to an informed review. Our next steps are a verified funded-wallet flow, more robust provider capacity, and user testing with PreStocks buyers.

## What makes it different

- Entry and exit are shown together, before a wallet is connected.
- Implied company valuation is derived from the user’s quoted entry price, not just a catalog price.
- Token display adjustments are read from the chain and handled separately from transaction units.
- The interface distinguishes reference marks, current quotes, and future liquidity instead of treating them as interchangeable.

## Important calculation limits

The reverse quote is an independent market snapshot. It does not simulate pool changes caused by executing the buy and does not guarantee a future exit. Route fees are included in quoted amounts; additional network costs are separate. USDC is displayed at dollar parity. The provider’s reference mark is not a fair-value estimate, and its effective date is not supplied by the catalog.

## Built with / credits

Original work: Before’s interface, catalog validation, quote orchestration, entry/exit explanations, scaled-token conversion, and regression tests.

Existing components and services: PreStocks catalog and issuer-hosted logos; Jupiter Swap V2; Solana RPC through PublicNode with Solana’s public endpoint as fallback; Solana web3.js; React; TypeScript; Vinext; Cloudflare Workers; the OpenAI Sites starter; shadcn/Radix UI; Lucide icons. Development was assisted by OpenAI Codex. Before does not deploy a new on-chain protocol or claim ownership of these components.

## Current validation

- Live hosted OpenAI and SpaceX quotes verified after the display-unit correction.
- On-chain display settings checked for all eight supported catalog assets.
- Company switching, search, amount presets, invalid-amount protection, quote expiry display, and wallet chooser checked.
- Mobile layout width checked at 390 px; desktop interface inspected.
- TypeScript checking and production build passed.
- Five token-unit regression tests passed.
- No real-money transaction was performed. Wallet signing and confirmed receipt remain an unverified integration path.
- Public access enabled on September 22, 2026.

## Submission destination
https://hackathons.solana.com/hackathons/stocklana/submit

Sign in using the organizer’s wallet login, complete registration if prompted, select the PreStocks bounty if the form provides a selector, and enter the project information above. Personal profile fields must be completed by the entrant. Do not claim the wallet purchase flow has been tested.

Official deadline: September 25, 2026, 4:00 p.m. Eastern / 9:00 p.m. Lagos.
Official rules: https://hackathons.solana.com/hackathons/stocklana

Status: submission materials prepared; project has not been registered or submitted by the assistant. No submission confirmation has been received.
