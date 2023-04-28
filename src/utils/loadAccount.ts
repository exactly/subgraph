import { BigInt, Bytes } from '@graphprotocol/graph-ts';
import { Account } from '../../generated/schema';

export default function loadAccount(address: Bytes, market: Bytes): Account {
  const id = `${address.toHexString()}-${market.toHexString()}`;
  let account = Account.load(id);
  if (account) return account;

  account = new Account(id);
  account.address = address;
  account.market = market;
  account.depositShares = BigInt.zero();
  account.borrowShares = BigInt.zero();
  return account;
}
