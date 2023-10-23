import { Bytes } from '@graphprotocol/graph-ts';
import { TimelockControllerCall } from '../../generated/schema';

export default function loadTimelockControllerCall(
  eventId: Bytes,
): TimelockControllerCall {
  const id = eventId.toHex();
  const entity = TimelockControllerCall.load(id);
  if (!entity) return new TimelockControllerCall(id);
  return entity;
}
