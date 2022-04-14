const { NETWORK: network } = process.env;
if (!network) throw new Error('network not set');

module.exports = {
  network,
};
