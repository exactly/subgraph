import { Bytes } from '@graphprotocol/graph-ts';
import { Market } from '../../generated/schema';

export default function loadMarket(market: Bytes): Market {
  let id = market.toHexString();
  let entity = Market.load(id);
  if (entity) return entity;

  entity = new Market(id);
  entity.address = market;
  return entity;
}
