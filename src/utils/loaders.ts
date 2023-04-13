import { BigInt, Bytes } from '@graphprotocol/graph-ts';
import { Account, FixedPosition } from '../../generated/schema';

export function loadAccount(address: Bytes, market: Bytes): Account {
  let id = `${address.toHexString()}-${market.toHexString()}`;
  let account = Account.load(id);
  if (account) return account;

  account = new Account(id);
  account.address = address;
  account.market = market;
  account.depositShares = BigInt.zero();
  account.borrowShares = BigInt.zero();
  return account;
}

export function loadFixedPosition(
  account: Account,
  maturity: u32,
  borrow: boolean = false,
): FixedPosition {
  let id = `${account.id}-${maturity}-${borrow ? 1 : 0}`;
  let fixedPosition = FixedPosition.load(id);
  if (fixedPosition) return fixedPosition;

  fixedPosition = new FixedPosition(id);
  fixedPosition.account = account.id;
  fixedPosition.maturity = maturity;
  fixedPosition.amount = BigInt.zero();
  fixedPosition.borrow = borrow;
  return fixedPosition;
}
