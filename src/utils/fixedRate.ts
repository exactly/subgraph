import { BigInt } from '@graphprotocol/graph-ts';

const WAD = BigInt.fromString('1000000000000000000');

export default function fixedRate(
  assets: BigInt,
  fee: BigInt,
  timestamp: i32,
  maturity: i32,
): BigInt {
  const rate = fee.times(WAD).div(assets);
  const timeFactor = BigInt.fromI32(31536000).times(WAD).div(BigInt.fromI32(maturity - timestamp));
  return rate.times(timeFactor).div(WAD);
}
