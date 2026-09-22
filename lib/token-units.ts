export type MintInfo = {
  decimals: number;
  extensions?: { extension: string; state?: Record<string, unknown> }[];
};

// Transfers and Jupiter orders use raw base units. Only presentation is scaled.
// https://solana.com/docs/tokens/extensions/scaled-ui-amount/integration-guide
export function tokenDisplayConfig(info: MintInfo, nowSeconds: number) {
  if (!Number.isInteger(info.decimals) || info.decimals < 0 || info.decimals > 18) {
    throw new Error('Token precision could not be verified.');
  }
  if (info.extensions?.some(e => e.extension === 'interestBearingConfig')) {
    throw new Error('This token uses an unsupported amount conversion.');
  }
  const extension = info.extensions?.find(e => e.extension === 'scaledUiAmountConfig');
  let multiplier = 1;
  let validUntil: number | null = null;
  if (extension) {
    const state = extension.state;
    if (!state || state.newMultiplierEffectiveTimestamp == null || state.multiplier == null || state.newMultiplier == null) {
      throw new Error('Token display settings could not be verified.');
    }
    const effectiveAt = Number(state.newMultiplierEffectiveTimestamp);
    if (!Number.isFinite(effectiveAt)) throw new Error('Invalid token multiplier date.');
    multiplier = Number(nowSeconds >= effectiveAt ? state.newMultiplier : state.multiplier);
    if (effectiveAt > nowSeconds) validUntil = effectiveAt * 1000;
  }
  if (!Number.isFinite(multiplier) || multiplier <= 0) throw new Error('Invalid token display multiplier.');
  return { decimals: info.decimals, multiplier, validUntil };
}

export function displayTokenAmount(raw: string, decimals: number, multiplier: number) {
  if (!/^\d+$/.test(raw) || !Number.isInteger(decimals) || decimals < 0 || decimals > 18 || !Number.isFinite(multiplier) || multiplier <= 0) {
    throw new Error('Invalid token amount.');
  }
  const amount = Number(raw) / 10 ** decimals * multiplier;
  if (!Number.isFinite(amount)) throw new Error('Token amount is too large.');
  return amount;
}
