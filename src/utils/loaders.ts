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
  account.fixedPositions = [];
  return account;
}

export function loadFixedPosition(
  address: Bytes,
  market: Bytes,
  maturity: u32,
  borrow: boolean = false,
): FixedPosition {
  let id = `${address.toHexString()}-${market.toHexString()}-${maturity}-${borrow ? 1 : 0}`;
  let fixedPosition = FixedPosition.load(id);
  if (fixedPosition) return fixedPosition;

  let account = loadAccount(address, market);
  account.fixedPositions.push(id);
  account.save();

  fixedPosition = new FixedPosition(id);
  fixedPosition.account = address;
  fixedPosition.market = market;
  fixedPosition.maturity = maturity;
  fixedPosition.amount = BigInt.zero();
  fixedPosition.borrow = borrow;
  return fixedPosition;
}
