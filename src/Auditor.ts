import {
  AdjustFactorSet as AdjustFactorSetEvent,
  LiquidationIncentiveSet as LiquidationIncentiveSetEvent,
  MarketEntered as MarketEnteredEvent,
  MarketExited as MarketExitedEvent,
  MarketListed as MarketListedEvent,
  PriceFeedSet as PriceFeedSetEvent,
} from '../generated/Auditor/Auditor';
import {
  AdjustFactorSet, LiquidationIncentiveSet,
  MarketEnter,
  MarketExit,
  MarketList,
  PriceFeedSet,
} from '../generated/schema';
import loadAccount from './utils/loadAccount';
import loadMarket from './utils/loadMarket';

export function handleMarketListed(event: MarketListedEvent): void {
  let marketList = new MarketList(event.transaction.hash.toHex());
  marketList.market = event.params.market;
  marketList.decimals = event.params.decimals;
  marketList.timestamp = event.block.timestamp.toU32();
  marketList.block = event.block.number.toU32();
  marketList.save();
}

export function handleMarketEntered(event: MarketEnteredEvent): void {
  let account = loadAccount(event.params.account, event.params.market);
  account.isCollateral = true;
  account.save();

  let marketEnter = new MarketEnter(event.transaction.hash.toHex());
  marketEnter.account = event.params.account;
  marketEnter.market = event.params.market;
  marketEnter.timestamp = event.block.timestamp.toU32();
  marketEnter.block = event.block.number.toU32();
  marketEnter.save();
}

export function handleMarketExited(event: MarketExitedEvent): void {
  let account = loadAccount(event.params.account, event.params.market);
  account.isCollateral = false;
  account.save();

  let marketExit = new MarketExit(event.transaction.hash.toHex());
  marketExit.account = event.params.account;
  marketExit.market = event.params.market;
  marketExit.timestamp = event.block.timestamp.toU32();
  marketExit.block = event.block.number.toU32();
  marketExit.save();
}

export function handleAdjustFactorSet(event: AdjustFactorSetEvent): void {
  let adjustFactorSet = new AdjustFactorSet(event.transaction.hash.toHex());
  adjustFactorSet.market = event.params.market;
  adjustFactorSet.adjustFactor = event.params.adjustFactor;
  adjustFactorSet.timestamp = event.block.timestamp.toU32();
  adjustFactorSet.block = event.block.number.toU32();
  adjustFactorSet.save();

  let market = loadMarket(event.params.market);
  market.adjustFactor = adjustFactorSet.adjustFactor;
  market.save();
}

export function handleLiquidationIncentiveSet(event: LiquidationIncentiveSetEvent): void {
  let liquidationIncentiveSet = new LiquidationIncentiveSet(event.transaction.hash.toHex());
  liquidationIncentiveSet.liquidator = event.params.liquidationIncentive.liquidator;
  liquidationIncentiveSet.lenders = event.params.liquidationIncentive.lenders;
  liquidationIncentiveSet.timestamp = event.block.timestamp.toU32();
  liquidationIncentiveSet.block = event.block.number.toU32();
  liquidationIncentiveSet.save();
}

export function handlePriceFeedSet(event: PriceFeedSetEvent): void {
  let priceFeedSet = new PriceFeedSet(event.transaction.hash.toHex());
  priceFeedSet.market = event.params.market;
  priceFeedSet.priceFeed = event.params.priceFeed;
  priceFeedSet.timestamp = event.block.timestamp.toU32();
  priceFeedSet.block = event.block.number.toU32();
  priceFeedSet.save();

  let market = loadMarket(event.params.market);
  market.priceFeed = priceFeedSet.priceFeed;
  market.save();
}
