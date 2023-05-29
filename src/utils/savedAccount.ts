import { Bytes } from '@graphprotocol/graph-ts';
import { Account } from '../../generated/schema';
import loadAccount from './loadAccount';

export default function savedAccount(address: Bytes, market: Bytes): Account {
  const account = loadAccount(address, market);

  if (!Account.load(account.id)) account.save();
  return account;
}
