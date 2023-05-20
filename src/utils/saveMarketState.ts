import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import { FixedPoolState, Market, MarketState } from '../../generated/schema';
import toId from './toId';
import { Market as MarketContract } from '../../generated/MarketWETH/Market';

const INTERVAL = 60 * 60 * 24 * 7 * 4;

export default function saveMarketState(event: ethereum.Event, market: Market): void {
  const marketState = new MarketState(toId(event));

  marketState.market = market.id;
  marketState.timestamp = event.block.timestamp.toU32();
  marketState.totalFloatingBorrowShares = market.totalFloatingBorrowShares;
  marketState.floatingAssets = market.floatingAssets;
  marketState.floatingDebt = market.floatingDebt;
  marketState.earningsAccumulator = market.earningsAccumulator;
  marketState.floatingUtilization = market.floatingUtilization;
  marketState.floatingCurveA = market.floatingCurveA;
  marketState.floatingCurveB = market.floatingCurveB;
  marketState.floatingMaxUtilization = market.floatingMaxUtilization;
  marketState.lastAccumulatorAccrual = market.lastAccumulatorAccrual;
  marketState.earningsAccumulatorSmoothFactor = market.earningsAccumulatorSmoothFactor;
  marketState.treasuryFeeRate = market.treasuryFeeRate;
  marketState.totalSupply = market.totalSupply;
  marketState.lastFloatingDebtUpdate = market.lastFloatingDebtUpdate;

  const instance = MarketContract.bind(Address.fromString(market.id));
  const timestamp = event.block.timestamp.toI32();
  const maxFuturePools = instance.maxFuturePools();
  const minMaturity = timestamp - (timestamp % INTERVAL) + INTERVAL;

  for (let i = 0; i < maxFuturePools; ++i) {
    const fixedPoolInstance = instance.fixedPools(BigInt.fromI32(minMaturity + INTERVAL * i));
    const fixedPoolState = new FixedPoolState(`${toId(event)}-${i}`);
    fixedPoolState.unassignedEarnings = fixedPoolInstance.getUnassignedEarnings();
    fixedPoolState.borrowed = fixedPoolInstance.getBorrowed();
    fixedPoolState.supplied = fixedPoolInstance.getSupplied();
    fixedPoolState.lastAccrual = fixedPoolInstance.getLastAccrual().toU32();
    fixedPoolState.marketState = marketState.id;
    fixedPoolState.maturity = minMaturity + INTERVAL * i;
    fixedPoolState.timestamp = timestamp;
    fixedPoolState.save();
  }
  marketState.save();
}
