const Escrow = artifacts.require('Escrow');

module.exports = async function(deployer) {
  const accounts = await web3.eth.getAccounts();
  const [_, payer, payee] = accounts;
  const amount = 1000;
  deployer.deploy(Escrow, payer, payee, amount);
};
