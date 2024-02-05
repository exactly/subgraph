import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import { FixedPoolState, Market, MarketState } from '../../generated/schema';
import { Market as MarketContract } from '../../generated/Auditor/Market';
import toId from './toId';

const INTERVAL = 4 * 7 * 86_400;

export default function saveMarketState(event: ethereum.Event, market: Market): void {
  const marketState = new MarketState(toId(event));

  marketState.market = market.id;
  marketState.timestamp = event.block.timestamp.toU32();
  marketState.totalFloatingBorrowShares = market.totalFloatingBorrowShares;
  marketState.floatingAssets = market.floatingAssets;
  marketState.floatingDebt = market.floatingDebt;
  marketState.floatingBackupBorrowed = market.floatingBackupBorrowed;
  marketState.earningsAccumulator = market.earningsAccumulator;
  marketState.floatingCurveA = market.floatingCurveA;
  marketState.floatingCurveB = market.floatingCurveB;
  marketState.floatingMaxUtilization = market.floatingMaxUtilization;
  marketState.naturalUtilization = market.naturalUtilization;
  marketState.sigmoidSpeed = market.sigmoidSpeed;
  marketState.growthSpeed = market.growthSpeed;
  marketState.maxRate = market.maxRate;
  marketState.spreadFactor = market.spreadFactor;
  marketState.timePreference = market.timePreference;
  marketState.fixedAllocation = market.fixedAllocation;
  marketState.maturitySpeed = market.maturitySpeed;
  marketState.fixedCurveA = market.fixedCurveA;
  marketState.fixedCurveB = market.fixedCurveB;
  marketState.fixedMaxUtilization = market.fixedMaxUtilization;
  marketState.lastAccumulatorAccrual = market.lastAccumulatorAccrual;
  marketState.earningsAccumulatorSmoothFactor = market.earningsAccumulatorSmoothFactor;
  marketState.treasuryFeeRate = market.treasuryFeeRate;
  marketState.totalSupply = market.totalSupply;
  marketState.lastFloatingDebtUpdate = market.lastFloatingDebtUpdate;
  marketState.rewardsController = market.rewardsController;

  const contract = MarketContract.bind(Address.fromString(market.id));
  const timestamp = event.block.timestamp.toU32();
  const maxFuturePools = contract.maxFuturePools();
  const minMaturity = timestamp - (timestamp % INTERVAL) + INTERVAL;

  for (let i = 0; i < maxFuturePools; ++i) {
    const fixedPoolInstance = contract.fixedPools(BigInt.fromU32(minMaturity + INTERVAL * i));
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
