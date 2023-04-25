import { Address } from '@graphprotocol/graph-ts';
import {
  AdjustFactorSet as AdjustFactorSetEvent,
  LiquidationIncentiveSet as LiquidationIncentiveSetEvent,
  MarketEntered as MarketEnteredEvent,
  MarketExited as MarketExitedEvent,
  MarketListed as MarketListedEvent,
  PriceFeedSet as PriceFeedSetEvent,
} from '../generated/Auditor/Auditor';
import {
  MarketExit, MarketEnter, MarketList, AdjustFactorSet, LiquidationIncentiveSet, PriceFeedSet,
} from '../generated/schema';
import loadAccount from './utils/loadAccount';
import loadMarket from './utils/loadMarket';
import { Market } from '../generated/Auditor/Market';
import { ERC20 } from '../generated/Auditor/ERC20';

export function handleMarketListed(event: MarketListedEvent): void {
  const marketList = new MarketList(event.transaction.hash.toHex());
  marketList.market = event.params.market;
  marketList.decimals = event.params.decimals;
  marketList.timestamp = event.block.timestamp.toU32();
  marketList.block = event.block.number.toU32();
  marketList.save();

  const market = loadMarket(marketList.market);

  const instance = Market.bind(Address.fromString(market.id));
  market.decimals = instance.decimals();

  const asset = ERC20.bind(instance.asset());
  market.asset = instance.asset();
  market.assetSymbol = asset.symbol();

  market.save();
}

export function handleMarketEntered(event: MarketEnteredEvent): void {
  const account = loadAccount(event.params.account, event.params.market);
  account.isCollateral = true;
  account.save();

  const marketEnter = new MarketEnter(event.transaction.hash.toHex());
  marketEnter.account = event.params.account;
  marketEnter.market = event.params.market;
  marketEnter.timestamp = event.block.timestamp.toU32();
  marketEnter.block = event.block.number.toU32();
  marketEnter.save();
}

export function handleMarketExited(event: MarketExitedEvent): void {
  const account = loadAccount(event.params.account, event.params.market);
  account.isCollateral = false;
  account.save();

  const marketExit = new MarketExit(event.transaction.hash.toHex());
  marketExit.account = event.params.account;
  marketExit.market = event.params.market;
  marketExit.timestamp = event.block.timestamp.toU32();
  marketExit.block = event.block.number.toU32();
  marketExit.save();
}

export function handleAdjustFactorSet(event: AdjustFactorSetEvent): void {
  const adjustFactorSet = new AdjustFactorSet(event.transaction.hash.toHex());
  adjustFactorSet.market = event.params.market;
  adjustFactorSet.adjustFactor = event.params.adjustFactor;
  adjustFactorSet.timestamp = event.block.timestamp.toU32();
  adjustFactorSet.block = event.block.number.toU32();
  adjustFactorSet.save();

  const market = loadMarket(event.params.market);
  market.adjustFactor = adjustFactorSet.adjustFactor;
  market.save();
}

export function handleLiquidationIncentiveSet(event: LiquidationIncentiveSetEvent): void {
  const liquidationIncentiveSet = new LiquidationIncentiveSet(event.transaction.hash.toHex());
  liquidationIncentiveSet.liquidator = event.params.liquidationIncentive.liquidator;
  liquidationIncentiveSet.lenders = event.params.liquidationIncentive.lenders;
  liquidationIncentiveSet.timestamp = event.block.timestamp.toU32();
  liquidationIncentiveSet.block = event.block.number.toU32();
  liquidationIncentiveSet.save();
}

export function handlePriceFeedSet(event: PriceFeedSetEvent): void {
  const priceFeedSet = new PriceFeedSet(event.transaction.hash.toHex());
  priceFeedSet.market = event.params.market;
  priceFeedSet.priceFeed = event.params.priceFeed;
  priceFeedSet.timestamp = event.block.timestamp.toU32();
  priceFeedSet.block = event.block.number.toU32();
  priceFeedSet.save();

  const market = loadMarket(event.params.market);
  market.priceFeed = priceFeedSet.priceFeed;
  market.save();
}
