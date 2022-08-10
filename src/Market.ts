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
  MarketUpdate as MarketUpdateEvent,
  FixedEarningsUpdate as FixedEarningsUpdateEvent,
  AccumulatorAccrual as AccumulatorAccrualEvent,
  FloatingDebtUpdate as FloatingDebtUpdateEvent,
} from '../generated/MarketWETH/MarketWETH';
import {
  Deposit, Withdraw, Borrow, Repay, Transfer,
  DepositAtMaturity, WithdrawAtMaturity, BorrowAtMaturity, RepayAtMaturity,
  Liquidate, Seize,
  EarningsAccumulatorSmoothFactorSet,
  MarketUpdate, FixedEarningsUpdate, AccumulatorAccrual, FloatingDebtUpdate,
} from '../generated/schema';
import toId from './utils/toId';

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
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(toId(event));
  entity.market = event.address;
  entity.timestamp = event.block.timestamp.toU32();
  entity.from = event.params.from;
  entity.to = event.params.to;
  entity.shares = event.params.amount;
  entity.save();
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
}

export function handleWithdrawAtMaturity(event: WithdrawAtMaturityEvent): void {
  let entity = new WithdrawAtMaturity(toId(event));
  entity.market = event.address;
  entity.timestamp = event.block.timestamp.toU32();
  entity.maturity = event.params.maturity.toU32();
  entity.caller = event.params.caller;
  entity.receiver = event.params.receiver;
  entity.owner = event.params.owner;
  entity.assets = event.params.assets;
  entity.assetsDiscounted = event.params.assetsDiscounted;
  entity.save();
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
}

export function handleLiquidate(event: LiquidateEvent): void {
  let entity = new Liquidate(toId(event));
  entity.market = event.address;
  entity.timestamp = event.block.timestamp.toU32();
  entity.receiver = event.params.receiver;
  entity.borrower = event.params.borrower;
  entity.assets = event.params.assets;
  entity.collateralMarket = event.params.collateralMarket;
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
}

export function handleFixedEarningsUpdate(event: FixedEarningsUpdateEvent): void {
  let entity = new FixedEarningsUpdate(toId(event));
  entity.market = event.address;
  entity.timestamp = event.params.timestamp.toU32();
  entity.maturity = event.params.maturity.toU32();
  entity.unassignedEarnings = event.params.unassignedEarnings;
  entity.save();
}

export function handleAccumulatorAccrual(event: AccumulatorAccrualEvent): void {
  let entity = new AccumulatorAccrual(toId(event));
  entity.market = event.address;
  entity.timestamp = event.params.timestamp.toU32();
  entity.save();
}

export function handleFloatingDebtUpdate(event: FloatingDebtUpdateEvent): void {
  let entity = new FloatingDebtUpdate(toId(event));
  entity.market = event.address;
  entity.timestamp = event.params.timestamp.toU32();
  entity.utilization = event.params.utilization;
  entity.save();
}
