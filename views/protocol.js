const { basename, extname, join } = require('path');
const { readdirSync, readFileSync } = require('fs');

const { NETWORK: network } = process.env;
if (!network) throw new Error('network not set');

const dir = `node_modules/@exactly/protocol/deployments/${network}/`;
const deployments = readdirSync(dir).filter((file) => extname(file) === '.json');

/** @type {function(string): Deployment} */
const get = (name) => JSON.parse(readFileSync(join(dir, `${name}.json`)));

/** @type {function(Deployment, string): { name? string, address: string, startBlock: number }} */
const from = ({ address, receipt }, name) => ({ name, address, startBlock: receipt?.blockNumber });

module.exports = {
  network,
  Market: deployments.map((file) => {
    const name = basename(file, '.json');
    if (!name.startsWith('Market') || name.includes('_') || name.includes('Router')) return null;

    const deployment = get(name);
    if (deployment.args?.length < 2) return null;

    return from(deployment, name);
  }).filter(Boolean),
};

/** @typedef {{ address: string, receipt?: { blockNumber: number }, args?: any[] }} Deployment */
