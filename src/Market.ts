import { Address } from "@graphprotocol/graph-ts";
import { InterestRateModel } from "../generated/MarketWETH/InterestRateModel";
import {
  AccumulatorAccrual as AccumulatorAccrualEvent,
  BackupFeeRateSet as BackupFeeRateSetEvent,
  BorrowAtMaturity as BorrowAtMaturityEvent,
  Borrow as BorrowEvent,
  DepositAtMaturity as DepositAtMaturityEvent,
  Deposit as DepositEvent,
  EarningsAccumulatorSmoothFactorSet as EarningsAccumulatorSmoothFactorSetEvent,
  FixedEarningsUpdate as FixedEarningsUpdateEvent,
  FloatingDebtUpdate as FloatingDebtUpdateEvent,
  InterestRateModelSet as InterestRateModelSetEvent,
  Liquidate as LiquidateEvent,
  MarketUpdate as MarketUpdateEvent,
  MarketWETH,
  MaxFuturePoolsSet as MaxFuturePoolsSetEvent,
  PenaltyRateSet as PenaltyRateSetEvent,
  RepayAtMaturity as RepayAtMaturityEvent,
  Repay as RepayEvent,
  ReserveFactorSet as ReserveFactorSetEvent,
  Seize as SeizeEvent,
  Transfer as TransferEvent,
  TreasurySet as TreasurySetEvent,
  WithdrawAtMaturity as WithdrawAtMaturityEvent,
  Withdraw as WithdrawEvent,
} from "../generated/MarketWETH/MarketWETH";

import {
  AccumulatorAccrual,
  BackupFeeRateSet,
  Borrow,
  BorrowAtMaturity,
  Deposit,
  DepositAtMaturity,
  EarningsAccumulatorSmoothFactorSet,
  FixedEarningsUpdate,
  FloatingDebtUpdate,
  InterestRateModelSet,
  Liquidate,
  MarketUpdate,
  MaxFuturePoolsSet,
  PenaltyRateSet,
  Repay,
  RepayAtMaturity,
  ReserveFactorSet,
  Seize,
  Transfer,
  TreasurySet,
  Withdraw,
  WithdrawAtMaturity,
} from "../generated/schema";
import loadAccount from "./utils/loadAccount";
import loadFixedPool from "./utils/loadFixedPool";
import loadFixedPosition from "./utils/loadFixedPosition";
import loadMarket from "./utils/loadMarket";
import toId from "./utils/toId";

export function handleDeposit(event: DepositEvent): void {
  let entity = new Deposit(toId(event));
  entity.market = event.address;
  entity.timestamp = event.block.timestamp.toU32();
  entity.caller = event.params.caller;
  entity.owner = event.params.owner;
  entity.assets = event.params.assets;
  entity.shares = event.params.shares;
  entity.save();

  const market = loadMarket(entity.market);
  market.totalAssets = market.totalAssets.plus(entity.assets);
  market.save();
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

  const market = loadMarket(entity.market);
  market.totalAssets = market.totalAssets.minus(entity.assets);
  market.save();
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

  const market = loadMarket(entity.market);
  market.totalFloatingBorrowAssets = market.totalFloatingBorrowAssets.plus(
    entity.assets,
  );
  market.totalFloatingBorrowShares = market.totalFloatingBorrowShares.plus(
    entity.shares,
  );
  market.save();
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
  account.borrowShares = account.borrowShares.minus(entity.shares);
  account.save();

  const market = loadMarket(entity.market);
  market.totalFloatingBorrowAssets = market.totalFloatingBorrowAssets.minus(
    entity.assets,
  );
  market.totalFloatingBorrowShares = market.totalFloatingBorrowShares.minus(
    entity.shares,
  );
  market.save();
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(toId(event));
  entity.market = event.address;
  entity.timestamp = event.block.timestamp.toU32();
  entity.from = event.params.from;
  entity.to = event.params.to;
  entity.shares = event.params.amount;
  entity.save();
  const market = loadMarket(entity.market);

  if (entity.from.equals(Address.zero())) {
    market.totalSupply = market.totalSupply.plus(entity.shares);
  } else {
    const accountFrom = loadAccount(entity.from, entity.market);
    accountFrom.depositShares = accountFrom.depositShares.minus(entity.shares);
    accountFrom.save();
  }

  if (entity.to.equals(Address.zero())) {
    market.totalSupply = market.totalSupply.minus(entity.shares);
  } else {
    let accountTo = loadAccount(entity.to, entity.market);
    accountTo.depositShares = accountTo.depositShares.plus(entity.shares);
    accountTo.save();
  }

  market.save();
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

  const position = loadFixedPosition(
    loadAccount(entity.owner, entity.market),
    entity.maturity,
  );
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

  const position = loadFixedPosition(
    loadAccount(entity.owner, entity.market),
    entity.maturity,
  );
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

export function handleInterestRateModelSet(
  event: InterestRateModelSetEvent,
): void {
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

  const instance = MarketWETH.bind(Address.fromBytes(entity.market));
  market.decimals = instance.decimals();
  market.symbol = instance.symbol();

  const asset = MarketWETH.bind(instance.asset());
  market.assetSymbol = asset.symbol();
  market.asset = instance.asset();
  market.save();
}

export function handleFixedEarningsUpdate(
  event: FixedEarningsUpdateEvent,
): void {
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

export function handleMaxFuturePoolsSet(event: MaxFuturePoolsSetEvent): void {
  const entity = new MaxFuturePoolsSet(toId(event));
  entity.market = event.address;
  entity.block = event.block.number.toU32();
  entity.maxFuturePools = event.params.maxFuturePools.toI32();
  entity.timestamp = event.block.timestamp.toU32();
  entity.save();

  const market = loadMarket(entity.market);
  market.maxFuturePools = entity.maxFuturePools;
  market.block = event.block.number.toU32();
  market.timestamp = entity.timestamp;
  market.save();
}

export function handlePenaltyRateSet(event: PenaltyRateSetEvent): void {
  const entity = new PenaltyRateSet(toId(event));
  entity.market = event.address;
  entity.block = event.block.number.toU32();
  entity.penaltyRate = event.params.penaltyRate;
  entity.timestamp = event.block.timestamp.toU32();
  entity.save();

  const market = loadMarket(entity.market);
  market.penaltyRate = entity.penaltyRate;
  market.block = event.block.number.toU32();
  market.timestamp = entity.timestamp;
  market.save();
}

export function handleReserveFactorSet(event: ReserveFactorSetEvent): void {
  const entity = new ReserveFactorSet(toId(event));
  entity.market = event.address;
  entity.block = event.block.number.toU32();
  entity.reserveFactor = event.params.reserveFactor;
  entity.timestamp = event.block.timestamp.toU32();
  entity.save();

  const market = loadMarket(entity.market);
  market.reserveFactor = entity.reserveFactor;
  market.block = event.block.number.toU32();
  market.timestamp = entity.timestamp;
  market.save();
}

export function handleBackupFeeRateSet(event: BackupFeeRateSetEvent): void {
  const entity = new BackupFeeRateSet(toId(event));
  entity.market = event.address;
  entity.block = event.block.number.toU32();
  entity.backupFeeRate = event.params.backupFeeRate;
  entity.timestamp = event.block.timestamp.toU32();
  entity.save();

  const market = loadMarket(entity.market);
  market.backupFeeRate = entity.backupFeeRate;
  market.block = event.block.number.toU32();
  market.timestamp = entity.timestamp;
  market.save();
}
