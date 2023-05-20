import { BigInt } from '@graphprotocol/graph-ts';

const WAD = BigInt.fromU64(1_000_000_000_000_000_000);

export default function fixedRate(
  assets: BigInt,
  fee: BigInt,
  timestamp: u32,
  maturity: u32,
): BigInt {
  return fee.times(WAD.times(BigInt.fromU32(31_536_000)))
    .div(assets.times(BigInt.fromU32(maturity - timestamp)));
}
