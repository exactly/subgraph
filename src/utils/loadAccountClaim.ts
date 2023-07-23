import { BigInt, Bytes } from '@graphprotocol/graph-ts';
import { AccountClaim } from '../../generated/schema';

export default function loadAccountClaim(account: Bytes, reward: Bytes): AccountClaim {
  const id = `${account.toHexString()}-${reward.toHexString()}`;
  let accountClaim = AccountClaim.load(id);
  if (accountClaim) return accountClaim;

  accountClaim = new AccountClaim(id);
  accountClaim.account = account;
  accountClaim.reward = reward;
  accountClaim.amount = BigInt.zero();
  return accountClaim;
}
