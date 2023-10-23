import {
  CallScheduled as CallScheduledEvent,
  CallExecuted as CallExecutedEvent,
  Cancelled as CancelledEvent,
  MinDelayChange as MinDelayChangeEvent,
} from '../generated/TimelockController/TimelockController';
import {
  TimelockControllerOperation,
  TimelockControllerMinDelaySet,
} from '../generated/schema';
import loadTimelockControllerCall from './utils/loadTimelockControllerCall';
import toId from './utils/toId';

export function handleCallScheduled(event: CallScheduledEvent): void {
  const entity = loadTimelockControllerCall(event.params.id);
  entity.predecessor = event.params.predecessor;
  entity.delay = event.params.delay.toU32();
  entity.scheduler = event.transaction.from;
  entity.scheduledAt = event.block.timestamp.toU32();

  entity.save();

  const operation = new TimelockControllerOperation(
    `${entity.id}-${event.params.index.toU32()}`,
  );
  operation.call = entity.id;
  operation.index = event.params.index.toU32();
  operation.target = event.params.target;
  operation.value = event.params.value;
  operation.data = event.params.data;

  operation.save();
}

export function handleCallExecuted(event: CallExecutedEvent): void {
  const entity = loadTimelockControllerCall(event.params.id);
  entity.executor = event.transaction.from;
  entity.executedAt = event.block.timestamp.toU32();

  entity.save();
}

export function handleCancelled(event: CancelledEvent): void {
  const entity = loadTimelockControllerCall(event.params.id);
  entity.canceller = event.transaction.from;
  entity.cancelledAt = event.block.timestamp.toU32();

  entity.save();
}

export function handleMinDelayChange(event: MinDelayChangeEvent): void {
  const entity = new TimelockControllerMinDelaySet(toId(event));
  entity.caller = event.transaction.from;
  entity.timestamp = event.block.timestamp.toU32();
  entity.block = event.block.number.toU32();
  entity.oldDuration = event.params.oldDuration.toU32();
  entity.newDuration = event.params.newDuration.toU32();

  entity.save();
}
