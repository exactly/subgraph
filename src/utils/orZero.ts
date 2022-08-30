import { BigInt, ethereum } from '@graphprotocol/graph-ts';

export default function orZero(result: ethereum.CallResult<BigInt>): BigInt {
  if (result.reverted) return BigInt.zero();
  return result.value;
}
