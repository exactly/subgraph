import {
  Address, BigInt, Bytes, ethereum,
} from '@graphprotocol/graph-ts';

import { Market } from '../../generated/schema';
import { ERC20 } from '../../generated/Auditor/ERC20';
import { Market as MarketContract } from '../../generated/Auditor/Market';
import { InterestRateModel } from '../../generated/Auditor/InterestRateModel';

export default function loadMarket(market: Bytes, event: ethereum.Event): Market {
  const id = market.toHexString();
  let entity = Market.load(id);
  if (entity) return entity;

  entity = new Market(id);
  entity.address = market;
  entity.timestamp = event.block.timestamp.toU32();
  entity.block = event.block.number.toU32();

  const mkt = MarketContract.bind(Address.fromBytes(market));
  entity.totalSupply = mkt.totalSupply();
  entity.totalFloatingBorrowShares = mkt.totalFloatingBorrowShares();
  entity.lastAccumulatorAccrual = mkt.lastAccumulatorAccrual().toU32();
  entity.floatingAssets = mkt.floatingAssets();
  entity.floatingDebt = mkt.floatingDebt();
  entity.earningsAccumulator = mkt.earningsAccumulator();
  entity.decimals = mkt.decimals();
  entity.symbol = mkt.symbol();
  entity.asset = mkt.asset();
  entity.lastFloatingDebtUpdate = mkt.lastFloatingDebtUpdate().toU32();

  entity.interestRateModel = mkt.interestRateModel();
  entity.earningsAccumulatorSmoothFactor = mkt.earningsAccumulatorSmoothFactor();
  entity.treasury = mkt.treasury();
  entity.treasuryFeeRate = mkt.treasuryFeeRate();
  entity.maxFuturePools = mkt.maxFuturePools();
  entity.backupFeeRate = mkt.backupFeeRate();
  entity.reserveFactor = mkt.reserveFactor();
  entity.penaltyRate = mkt.penaltyRate();
  entity.totalFloatingBorrowShares = mkt.totalFloatingBorrowShares();

  const asset = ERC20.bind(mkt.asset());
  entity.assetSymbol = asset.symbol();

  const irm = InterestRateModel.bind(mkt.interestRateModel());
  entity.fixedCurveA = irm.fixedCurveA();
  entity.fixedCurveB = irm.fixedCurveB();
  entity.fixedMaxUtilization = irm.fixedMaxUtilization();
  entity.floatingCurveA = irm.floatingCurveA();
  entity.floatingCurveB = irm.floatingCurveB();
  entity.floatingMaxUtilization = irm.floatingMaxUtilization();
  entity.floatingUtilization = entity.floatingAssets > BigInt.zero()
    ? entity.floatingDebt.div(entity.floatingAssets) : BigInt.zero();

  return entity;
}
