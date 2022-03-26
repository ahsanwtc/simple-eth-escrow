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
    assert(e.reason === error);
    return;
  }
  assert(false, 'should not reach here');
};

contract('Escrow', accounts => {
  const [lawyer, payer, payee] = accounts;
  let escrow = null;

  before(async () => {
    escrow = await Escrow.deployed();
  });

  it('should deposit', async () => {
    await escrow.deposit({ from: payer, value: 900 });
    const balance = parseInt(await web3.eth.getBalance(escrow.address));
    assert(balance === 900, 'wrong balance');
  });

  it('should NOT deposit if sender is not payer', async () => {
    await asserError(escrow.deposit({ from: accounts[3], value: 100 }), 'sender must be the payer');
  });

  it('should NOT deposit if funds exceed amount', async () => {
    await asserError(escrow.deposit({ from: payer, value: 600 }), 'funds must not exceed the agreed amount');
  });

  it('should NOT release funds if full amount has not been received', async () => {
    await asserError(escrow.release({ from: lawyer }), 'cannot release funds before the full amount is paid');
  });

  it('should NOT release funds if called is not lawyer', async () => {
    /**
     * deposit the remaing 100
     */
    await escrow.deposit({ from: payer, value: 100 });
    await asserError(escrow.release({ from: payee }), 'only lawyer can release funds');
  });

  it('should release funds', async () => {
    const balanceBefore = web3.utils.toBN(await web3.eth.getBalance(payee));
    await escrow.release({ from: lawyer });    
    const balanceAfter = web3.utils.toBN(await web3.eth.getBalance(payee));
    
    const balance = balanceAfter.sub(balanceBefore);
    assert(balance.toNumber() === 1000);
    const constratBalance = await web3.eth.getBalance(escrow.address);
    assert(parseInt(constratBalance) === 0);
  });
  
});
  