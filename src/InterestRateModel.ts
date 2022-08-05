import {
  FixedParametersSet as FixedParametersSetEvent,
  FloatingParametersSet as FloatingParametersSetEvent,
} from '../generated/InterestRateModel/InterestRateModel';
import { FixedParametersSet, FloatingParametersSet } from '../generated/schema';
import toId from './utils/toId';

export function handleFixedParametersSet(event: FixedParametersSetEvent): void {
  let entity = new FixedParametersSet(toId(event));
  entity.timestamp = event.block.timestamp.toU32();
  entity.curveA = event.params.curve.a;
  entity.curveB = event.params.curve.b;
  entity.maxUtilization = event.params.curve.maxUtilization;
  entity.fullUtilization = event.params.fullUtilization;
  entity.save();
}

export function handleFloatingParametersSet(event: FloatingParametersSetEvent): void {
  let entity = new FloatingParametersSet(toId(event));
  entity.timestamp = event.block.timestamp.toU32();
  entity.curveA = event.params.curve.a;
  entity.curveB = event.params.curve.b;
  entity.maxUtilization = event.params.curve.maxUtilization;
  entity.fullUtilization = event.params.fullUtilization;
  entity.save();
}
