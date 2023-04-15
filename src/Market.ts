import { Address } from '@graphprotocol/graph-ts';
import { InterestRateModel } from '../generated/MarketWETH/InterestRateModel';
import {
  Deposit as DepositEvent,
  Withdraw as WithdrawEvent,
  Borrow as BorrowEvent,
  Repay as RepayEvent,
  Transfer as TransferEvent,

  DepositAtMaturity as DepositAtMaturityEvent,
  WithdrawAtMaturity as WithdrawAtMaturityEvent,
  BorrowAtMaturity as BorrowAtMaturityEvent,
  RepayAtMaturity as RepayAtMaturityEvent,

  Liquidate as LiquidateEvent,
  Seize as SeizeEvent,

  EarningsAccumulatorSmoothFactorSet as EarningsAccumulatorSmoothFactorSetEvent,
  InterestRateModelSet as InterestRateModelSetEvent,
  TreasurySet as TreasurySetEvent,

  MarketUpdate as MarketUpdateEvent,
  FixedEarningsUpdate as FixedEarningsUpdateEvent,
  AccumulatorAccrual as AccumulatorAccrualEvent,
  FloatingDebtUpdate as FloatingDebtUpdateEvent,
} from '../generated/MarketWETH/MarketWETH';
import {
  Deposit, Withdraw, Borrow, Repay, Transfer,
  DepositAtMaturity, WithdrawAtMaturity, BorrowAtMaturity, RepayAtMaturity,
  Liquidate, Seize,
  EarningsAccumulatorSmoothFactorSet, InterestRateModelSet, TreasurySet,
  MarketUpdate, FixedEarningsUpdate, AccumulatorAccrual, FloatingDebtUpdate,
} from '../generated/schema';
import toId from './utils/toId';
import loadFixedPosition from './utils/loadFixedPosition';
import loadAccount from './utils/loadAccount';
import loadMarket from './utils/loadMarket';
import loadFixedPool from './utils/loadFixedPool';

export function handleDeposit(event: DepositEvent): void {
  let entity = new Deposit(toId(event));
  entity.market = event.address;
  entity.timestamp = event.block.timestamp.toU32();
  entity.caller = event.params.caller;
  entity.owner = event.params.owner;
  entity.assets = event.params.assets;
  entity.shares = event.params.shares;
  entity.save();
}

export function handleWithdraw(event: WithdrawEvent): void {
  let entity = new Withdraw(toId(event));
  entity.market = event.address;
  entity.timestamp = event.block.timestamp.toU32();
  entity.caller = event.params.caller;
  entity.receiver = event.params.receiver;
  entity.owner = event.params.owner;
  entity.assets = event.params.assets;
  entity.shares = event.params.shares;
  entity.save();
}

export function handleBorrow(event: BorrowEvent): void {
  let entity = new Borrow(toId(event));
  entity.market = event.address;
  entity.timestamp = event.block.timestamp.toU32();
  entity.caller = event.params.caller;
  entity.receiver = event.params.receiver;
  entity.borrower = event.params.borrower;
  entity.assets = event.params.assets;
  entity.shares = event.params.shares;
  entity.save();

  let account = loadAccount(entity.borrower, entity.market);
  account.borrowShares = account.borrowShares.plus(entity.shares);
  account.save();
}

export function handleRepay(event: RepayEvent): void {
  let entity = new Repay(toId(event));
  entity.market = event.address;
  entity.timestamp = event.block.timestamp.toU32();
  entity.caller = event.params.caller;
  entity.borrower = event.params.borrower;
  entity.assets = event.params.assets;
  entity.shares = event.params.shares;
  entity.save();

  let account = loadAccount(entity.borrower, entity.market);
  account.borrowShares = (account.borrowShares).minus(entity.shares);
  account.save();
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(toId(event));
  entity.market = event.address;
  entity.timestamp = event.block.timestamp.toU32();
  entity.from = event.params.from;
  entity.to = event.params.to;
  entity.shares = event.params.amount;
  entity.save();

  if (entity.to.notEqual(Address.zero())) {
    let accountTo = loadAccount(entity.to, entity.market);
    accountTo.depositShares = accountTo.depositShares.plus(entity.shares);
    accountTo.save();
  }
  if (entity.from.notEqual(Address.zero())) {
    let accountFrom = loadAccount(entity.from, entity.market);
    accountFrom.depositShares = (accountFrom.depositShares).minus(entity.shares);
    accountFrom.save();
  }
}

export function handleDepositAtMaturity(event: DepositAtMaturityEvent): void {
  let entity = new DepositAtMaturity(toId(event));
  entity.market = event.address;
  entity.timestamp = event.block.timestamp.toU32();
  entity.maturity = event.params.maturity.toU32();
  entity.caller = event.params.caller;
  entity.owner = event.params.owner;
  entity.assets = event.params.assets;
  entity.fee = event.params.fee;
  entity.save();

  let position = loadFixedPosition(loadAccount(entity.owner, entity.market), entity.maturity);
  position.amount = position.amount.plus(entity.assets.plus(entity.fee));
  position.save();
}

export function handleWithdrawAtMaturity(event: WithdrawAtMaturityEvent): void {
  let entity = new WithdrawAtMaturity(toId(event));
  entity.market = event.address;
  entity.timestamp = event.block.timestamp.toU32();
  entity.maturity = event.params.maturity.toU32();
  entity.caller = event.params.caller;
  entity.receiver = event.params.receiver;
  entity.owner = event.params.owner;
  entity.positionAssets = event.params.positionAssets;
  entity.assets = event.params.assets;
  entity.save();

  let position = loadFixedPosition(loadAccount(entity.owner, entity.market), entity.maturity);
  position.amount = position.amount.minus(entity.positionAssets);
  position.save();
}

export function handleBorrowAtMaturity(event: BorrowAtMaturityEvent): void {
  let entity = new BorrowAtMaturity(toId(event));
  entity.market = event.address;
  entity.timestamp = event.block.timestamp.toU32();
  entity.maturity = event.params.maturity.toU32();
  entity.caller = event.params.caller;
  entity.receiver = event.params.receiver;
  entity.borrower = event.params.borrower;
  entity.assets = event.params.assets;
  entity.fee = event.params.fee;
  entity.save();

  let position = loadFixedPosition(
    loadAccount(entity.borrower, entity.market),
    entity.maturity,
    true,
  );
  position.amount = position.amount.plus(entity.assets.plus(entity.fee));
  position.save();
}

export function handleRepayAtMaturity(event: RepayAtMaturityEvent): void {
  let entity = new RepayAtMaturity(toId(event));
  entity.market = event.address;
  entity.timestamp = event.block.timestamp.toU32();
  entity.maturity = event.params.maturity.toU32();
  entity.caller = event.params.caller;
  entity.borrower = event.params.borrower;
  entity.assets = event.params.assets;
  entity.debtCovered = event.params.positionAssets;
  entity.save();

  let position = loadFixedPosition(
    loadAccount(entity.borrower, entity.market),
    entity.maturity,
    true,
  );
  position.amount = position.amount.minus(entity.debtCovered);
  position.save();
}

export function handleLiquidate(event: LiquidateEvent): void {
  let entity = new Liquidate(toId(event));
  entity.market = event.address;
  entity.timestamp = event.block.timestamp.toU32();
  entity.receiver = event.params.receiver;
  entity.borrower = event.params.borrower;
  entity.assets = event.params.assets;
  entity.collateralMarket = event.params.seizeMarket;
  entity.seizedAssets = event.params.seizedAssets;
  entity.save();
}

export function handleSeize(event: SeizeEvent): void {
  let entity = new Seize(toId(event));
  entity.market = event.address;
  entity.timestamp = event.block.timestamp.toU32();
  entity.liquidator = event.params.liquidator;
  entity.borrower = event.params.borrower;
  entity.assets = event.params.assets;
  entity.save();
}

export function handleEarningsAccumulatorSmoothFactorSet(
  event: EarningsAccumulatorSmoothFactorSetEvent,
): void {
  let entity = new EarningsAccumulatorSmoothFactorSet(toId(event));
  entity.market = event.address;
  entity.timestamp = event.block.timestamp.toU32();
  entity.earningsAccumulatorSmoothFactor = event.params.earningsAccumulatorSmoothFactor;
  entity.save();

  let market = loadMarket(entity.market);
  market.timestamp = entity.timestamp;
  market.block = event.block.number.toU32();
  market.earningsAccumulatorSmoothFactor = entity.earningsAccumulatorSmoothFactor;
  market.save();
}

export function handleInterestRateModelSet(event: InterestRateModelSetEvent): void {
  let entity = new InterestRateModelSet(toId(event));
  entity.market = event.address;
  entity.timestamp = event.block.timestamp.toU32();
  entity.interestRateModel = event.params.interestRateModel;

  const irm = InterestRateModel.bind(event.params.interestRateModel);
  entity.fixedCurveA = irm.fixedCurveA();
  entity.fixedCurveB = irm.fixedCurveB();
  entity.fixedMaxUtilization = irm.fixedMaxUtilization();
  entity.floatingCurveA = irm.floatingCurveA();
  entity.floatingCurveB = irm.floatingCurveB();
  entity.floatingMaxUtilization = irm.floatingMaxUtilization();

  entity.save();

  let market = loadMarket(entity.market);
  market.timestamp = entity.timestamp;
  market.block = event.block.number.toU32();

  market.interestRateModel = entity.interestRateModel;
  market.fixedCurveA = entity.fixedCurveA;
  market.fixedCurveB = entity.fixedCurveB;
  market.fixedMaxUtilization = entity.fixedMaxUtilization;
  market.floatingCurveA = entity.floatingCurveA;
  market.floatingCurveB = entity.floatingCurveB;
  market.floatingMaxUtilization = entity.floatingMaxUtilization;
  market.save();
}

export function handleTreasurySet(event: TreasurySetEvent): void {
  let entity = new TreasurySet(toId(event));
  entity.market = event.address;
  entity.timestamp = event.block.timestamp.toU32();
  entity.treasury = event.params.treasury;
  entity.treasuryFeeRate = event.params.treasuryFeeRate;
  entity.save();

  let market = loadMarket(entity.market);
  market.timestamp = entity.timestamp;
  market.block = event.block.number.toU32();
  market.treasury = entity.treasury;
  market.treasuryFeeRate = entity.treasuryFeeRate;
  market.save();
}

export function handleMarketUpdate(event: MarketUpdateEvent): void {
  let entity = new MarketUpdate(toId(event));
  entity.market = event.address;
  entity.timestamp = event.params.timestamp.toU32();
  entity.floatingDepositShares = event.params.floatingDepositShares;
  entity.floatingAssets = event.params.floatingAssets;
  entity.floatingBorrowShares = event.params.floatingBorrowShares;
  entity.floatingDebt = event.params.floatingDebt;
  entity.earningsAccumulator = event.params.earningsAccumulator;
  entity.save();

  let market = loadMarket(entity.market);
  market.timestamp = entity.timestamp;
  market.block = event.block.number.toU32();
  market.lastMarketUpdate = entity.timestamp;
  market.floatingDepositShares = entity.floatingDepositShares;
  market.floatingAssets = entity.floatingAssets;
  market.floatingBorrowShares = entity.floatingBorrowShares;
  market.floatingDebt = entity.floatingDebt;
  market.earningsAccumulator = entity.earningsAccumulator;
  market.save();
}

export function handleFixedEarningsUpdate(event: FixedEarningsUpdateEvent): void {
  let entity = new FixedEarningsUpdate(toId(event));
  entity.market = event.address;
  entity.timestamp = event.params.timestamp.toU32();
  entity.maturity = event.params.maturity.toU32();
  entity.unassignedEarnings = event.params.unassignedEarnings;
  entity.save();

  let fixedPool = loadFixedPool(loadMarket(entity.market), entity.maturity);
  fixedPool.timestamp = entity.timestamp;
  fixedPool.unassignedEarnings = entity.unassignedEarnings;
  fixedPool.save();
}

export function handleAccumulatorAccrual(event: AccumulatorAccrualEvent): void {
  let entity = new AccumulatorAccrual(toId(event));
  entity.market = event.address;
  entity.timestamp = event.params.timestamp.toU32();
  entity.save();

  let market = loadMarket(entity.market);
  market.timestamp = entity.timestamp;
  market.block = event.block.number.toU32();
  market.lastAccumulatorAccrual = entity.timestamp;
  market.save();
}

export function handleFloatingDebtUpdate(event: FloatingDebtUpdateEvent): void {
  let entity = new FloatingDebtUpdate(toId(event));
  entity.market = event.address;
  entity.timestamp = event.params.timestamp.toU32();
  entity.utilization = event.params.utilization;
  entity.save();

  let market = loadMarket(entity.market);
  market.timestamp = entity.timestamp;
  market.block = event.block.number.toU32();
  market.floatingUtilization = entity.utilization;
  market.lastFloatingDebtUpdate = entity.timestamp;
  market.save();
}
