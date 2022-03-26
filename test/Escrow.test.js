const Escrow = artifacts.require("Escrow");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */

const asserError = async (promise, error) => {
  try {
    await promise;
  } catch (e) {
    assert(e.message.includes(error));
  }
  assert(false);
};

contract('Escrow', accounts => {
  const [lawyer, payer, payee] = accounts;
  let escrow = null;

  before(async () => {
    escrow = await Escrow.deployed();
  });

  
});
