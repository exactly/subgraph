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
  MarketExited, MarketEntered, MarketListed, AdjustFactorSet, LiquidationIncentiveSet, PriceFeedSet,
} from '../generated/schema';
import { ERC20 as ERC20Contract } from '../generated/Auditor/ERC20';
import { Market as MarketContract } from '../generated/Auditor/Market';
import saveMarketState from './utils/saveMarketState';
import loadAccount from './utils/loadAccount';
import loadMarket from './utils/loadMarket';
import toId from './utils/toId';

export function handleMarketListed(event: MarketListedEvent): void {
  const marketListed = new MarketListed(toId(event));
  marketListed.market = event.params.market;
  marketListed.decimals = event.params.decimals;
  marketListed.timestamp = event.block.timestamp.toU32();
  marketListed.block = event.block.number.toU32();
  marketListed.save();

  const market = loadMarket(marketListed.market, event);

  const contract = MarketContract.bind(Address.fromString(market.id));
  market.decimals = contract.decimals();
  const asset = contract.asset();
  market.asset = asset;
  market.assetSymbol = ERC20Contract.bind(asset).symbol();
  market.save();
  saveMarketState(event, market);
}

export function handleMarketEntered(event: MarketEnteredEvent): void {
  const account = loadAccount(event.params.account, event.params.market);
  account.isCollateral = true;
  account.save();

  const marketEntered = new MarketEntered(toId(event));
  marketEntered.account = event.params.account;
  marketEntered.market = event.params.market;
  marketEntered.timestamp = event.block.timestamp.toU32();
  marketEntered.block = event.block.number.toU32();
  marketEntered.save();
}

export function handleMarketExited(event: MarketExitedEvent): void {
  const account = loadAccount(event.params.account, event.params.market);
  account.isCollateral = false;
  account.save();

  const marketExited = new MarketExited(toId(event));
  marketExited.account = event.params.account;
  marketExited.market = event.params.market;
  marketExited.timestamp = event.block.timestamp.toU32();
  marketExited.block = event.block.number.toU32();
  marketExited.save();
}

export function handleAdjustFactorSet(event: AdjustFactorSetEvent): void {
  const adjustFactorSet = new AdjustFactorSet(toId(event));
  adjustFactorSet.market = event.params.market;
  adjustFactorSet.adjustFactor = event.params.adjustFactor;
  adjustFactorSet.timestamp = event.block.timestamp.toU32();
  adjustFactorSet.block = event.block.number.toU32();
  adjustFactorSet.save();

  const market = loadMarket(event.params.market, event);
  market.adjustFactor = adjustFactorSet.adjustFactor;
  market.save();
  saveMarketState(event, market);
}

export function handleLiquidationIncentiveSet(event: LiquidationIncentiveSetEvent): void {
  const liquidationIncentiveSet = new LiquidationIncentiveSet(toId(event));
  liquidationIncentiveSet.liquidator = event.params.liquidationIncentive.liquidator;
  liquidationIncentiveSet.lenders = event.params.liquidationIncentive.lenders;
  liquidationIncentiveSet.timestamp = event.block.timestamp.toU32();
  liquidationIncentiveSet.block = event.block.number.toU32();
  liquidationIncentiveSet.save();
}

export function handlePriceFeedSet(event: PriceFeedSetEvent): void {
  const priceFeedSet = new PriceFeedSet(toId(event));
  priceFeedSet.market = event.params.market;
  priceFeedSet.priceFeed = event.params.priceFeed;
  priceFeedSet.timestamp = event.block.timestamp.toU32();
  priceFeedSet.block = event.block.number.toU32();
  priceFeedSet.save();

  const market = loadMarket(event.params.market, event);
  market.priceFeed = priceFeedSet.priceFeed;
  market.save();
  saveMarketState(event, market);
}
