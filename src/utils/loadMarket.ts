import { BigInt, Bytes } from '@graphprotocol/graph-ts';
import { Market } from '../../generated/schema';

export default function loadMarket(market: Bytes): Market {
  const id = market.toHexString();
  let entity = Market.load(id);
  if (entity) return entity;

  entity = new Market(id);
  entity.address = market;
  entity.totalSupply = BigInt.zero();
  entity.totalFloatingBorrowShares = BigInt.zero();
  return entity;
}
