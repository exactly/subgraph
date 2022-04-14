import { ethereum } from '@graphprotocol/graph-ts';

export default function toId(event: ethereum.Event): string {
  return `${event.transaction.hash.toHex()}-${event.logIndex.toString()}`;
}
