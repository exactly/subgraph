import { FixedPool, Market } from '../../generated/schema';

export default function loadFixedPool(market: Market, maturity: u32): FixedPool {
  let id = `${market.id}-${maturity}`;
  let fixedPool = FixedPool.load(id);
  if (fixedPool) return fixedPool;

  fixedPool = new FixedPool(id);
  fixedPool.market = market.id;
  fixedPool.maturity = maturity;
  return fixedPool;
}
