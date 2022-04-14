const { basename, extname, join } = require('path');
const { readdirSync, readFileSync } = require('fs');

const { NETWORK: network } = process.env;
if (!network) throw new Error('network not set');

const dir = `node_modules/@exactly-finance/protocol/deployments/${network}/`;
const deployments = readdirSync(dir).filter((file) => extname(file) === '.json');
module.exports = {
  network,
  FixedLender: deployments.map((file) => {
    /** @type {{ address: string, receipt?: { blockNumber: number }, args?: any[] }} */
    const { address, receipt, args } = JSON.parse(readFileSync(join(dir, file)));
    const name = basename(file, '.json');

    if (!name.startsWith('FixedLender') || args?.length < 2) return null;

    return { name, address, startBlock: receipt?.blockNumber };
  }).filter(Boolean),
};
