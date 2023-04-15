import { BigInt } from '@graphprotocol/graph-ts';
import { Account, FixedPosition } from '../../generated/schema';

export default function loadFixedPosition(
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