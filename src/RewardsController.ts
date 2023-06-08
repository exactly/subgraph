import {
  DistributionSet as DistributionSetEvent,
  IndexUpdate as IndexUpdateEvent,
} from '../generated/RewardsController/RewardsController';
import { Config, DistributionSet, IndexUpdate } from '../generated/schema';
import toId from './utils/toId';

export function handleIndexUpdate(event: IndexUpdateEvent): void {
  const indexUpdate = new IndexUpdate(toId(event));
  indexUpdate.market = event.params.market;
  indexUpdate.reward = event.params.reward;
  indexUpdate.borrowIndex = event.params.borrowIndex;
  indexUpdate.depositIndex = event.params.depositIndex;
  indexUpdate.newUndistributed = event.params.newUndistributed;
  indexUpdate.timestamp = event.block.timestamp.toU32();
  indexUpdate.save();
}

export function handleDistributionSet(event: DistributionSetEvent): void {
  const distributionSet = new DistributionSet(toId(event));
  distributionSet.market = event.params.market;
  distributionSet.reward = event.params.reward;
  distributionSet.timestamp = event.block.timestamp.toU32();
  distributionSet.block = event.block.number.toI32();

  const config = new Config(distributionSet.id);
  config.distributionSet = distributionSet.id;
  config.market = event.params.config.market;
  config.reward = event.params.config.reward;
  config.priceFeed = event.params.config.priceFeed;
  config.start = event.params.config.start;
  config.distributionPeriod = event.params.config.distributionPeriod;
  config.targetDebt = event.params.config.targetDebt;
  config.totalDistribution = event.params.config.totalDistribution;
  config.undistributedFactor = event.params.config.undistributedFactor;
  config.flipSpeed = event.params.config.flipSpeed;
  config.compensationFactor = event.params.config.compensationFactor;
  config.transitionFactor = event.params.config.transitionFactor;
  config.borrowAllocationWeightFactor = event.params.config.borrowAllocationWeightFactor;
  config.depositAllocationWeightAddend = event.params.config.depositAllocationWeightAddend;
  config.depositAllocationWeightFactor = event.params.config.depositAllocationWeightFactor;
  config.save();

  distributionSet.save();
}
