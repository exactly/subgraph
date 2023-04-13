import {
  MarketEntered as MarketEnteredEvent,
  MarketExited as MarketExitedEvent,
} from '../generated/Auditor/Auditor';

import { loadAccount } from './utils/loaders';

export function handleMarketEntered(event: MarketEnteredEvent): void {
  let account = loadAccount(event.params.account, event.params.market);
  account.isCollateral = true;
  account.save();
}

export function handleMarketExited(event: MarketExitedEvent): void {
  let account = loadAccount(event.params.account, event.params.market);
  account.isCollateral = false;
  account.save();
}
