import {
  Deposit as DepositEvent,
  Withdraw as WithdrawEvent,
  Transfer as TransferEvent,

  DepositAtMaturity as DepositAtMaturityEvent,
  WithdrawAtMaturity as WithdrawAtMaturityEvent,
  BorrowAtMaturity as BorrowAtMaturityEvent,
  RepayAtMaturity as RepayAtMaturityEvent,

  LiquidateBorrow as LiquidateBorrowEvent,
  AssetSeized as AssetSeizedEvent,

  SmartPoolEarningsAccrued as SmartPoolEarningsAccruedEvent,
  MarketUpdated as MarketUpdatedEvent,
} from '../generated/FixedLenderWETH/FixedLenderWETH';
import {
  Deposit, Withdraw, Transfer,
  DepositAtMaturity, WithdrawAtMaturity, BorrowAtMaturity, RepayAtMaturity,
  LiquidateBorrow, AssetSeized,
  SmartPoolEarningsAccrued,
  MarketUpdated,
} from '../generated/schema';
import toId from './utils/toId';

export function handleDeposit(event: DepositEvent): void {
  let entity = new Deposit(toId(event));
  entity.market = event.address;
  entity.timestamp = event.block.timestamp;
  entity.caller = event.params.caller;
  entity.owner = event.params.owner;
  entity.assets = event.params.assets;
  entity.shares = event.params.shares;
  entity.save();
}

export function handleWithdraw(event: WithdrawEvent): void {
  let entity = new Withdraw(toId(event));
  entity.market = event.address;
  entity.timestamp = event.block.timestamp;
  entity.caller = event.params.caller;
  entity.receiver = event.params.receiver;
  entity.owner = event.params.owner;
  entity.assets = event.params.assets;
  entity.shares = event.params.shares;
  entity.save();
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(toId(event));
  entity.market = event.address;
  entity.timestamp = event.block.timestamp;
  entity.from = event.params.from;
  entity.to = event.params.to;
  entity.shares = event.params.amount;
  entity.save();
}

export function handleDepositAtMaturity(event: DepositAtMaturityEvent): void {
  let entity = new DepositAtMaturity(toId(event));
  entity.market = event.address;
  entity.timestamp = event.block.timestamp;
  entity.maturity = event.params.maturity;
  entity.caller = event.params.caller;
  entity.owner = event.params.owner;
  entity.assets = event.params.assets;
  entity.fee = event.params.fee;
  entity.save();
}

export function handleWithdrawAtMaturity(event: WithdrawAtMaturityEvent): void {
  let entity = new WithdrawAtMaturity(toId(event));
  entity.market = event.address;
  entity.timestamp = event.block.timestamp;
  entity.maturity = event.params.maturity;
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
  entity.timestamp = event.block.timestamp;
  entity.maturity = event.params.maturity;
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
  entity.timestamp = event.block.timestamp;
  entity.maturity = event.params.maturity;
  entity.caller = event.params.caller;
  entity.borrower = event.params.borrower;
  entity.assets = event.params.assets;
  entity.debtCovered = event.params.positionAssets;
  entity.save();
}

export function handleLiquidateBorrow(event: LiquidateBorrowEvent): void {
  let entity = new LiquidateBorrow(toId(event));
  entity.market = event.address;
  entity.timestamp = event.block.timestamp;
  entity.receiver = event.params.receiver;
  entity.borrower = event.params.borrower;
  entity.assets = event.params.assets;
  entity.collateralMarket = event.params.collateralMarket;
  entity.seizedAssets = event.params.seizedAssets;
  entity.save();
}

export function handleAssetSeized(event: AssetSeizedEvent): void {
  let entity = new AssetSeized(toId(event));
  entity.market = event.address;
  entity.timestamp = event.block.timestamp;
  entity.liquidator = event.params.liquidator;
  entity.borrower = event.params.borrower;
  entity.assets = event.params.assets;
  entity.save();
}

export function handleSmartPoolEarningsAccrued(event: SmartPoolEarningsAccruedEvent): void {
  let entity = new SmartPoolEarningsAccrued(toId(event));
  entity.market = event.address;
  entity.timestamp = event.block.timestamp;
  entity.previousAssets = event.params.previousAssets;
  entity.earnings = event.params.earnings;
  entity.save();
}

export function handleMarketUpdated(event: MarketUpdatedEvent): void {
  let entity = new MarketUpdated(toId(event));
  entity.market = event.address;
  entity.timestamp = event.params.timestamp;
  entity.smartPoolShares = event.params.smartPoolShares;
  entity.smartPoolAssets = event.params.smartPoolAssets;
  entity.smartPoolEarningsAccumulator = event.params.smartPoolEarningsAccumulator;
  entity.maturity = event.params.maturity;
  entity.maturityUnassignedEarnings = event.params.maturityUnassignedEarnings;
  entity.save();
}
