import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';

import Escrow from './contracts/Escrow.json';

export const getWeb3 = () => {
  return new Promise(async (resolve, reject) => {
    let provider = await detectEthereumProvider();    
    if (provider) {
      await provider.request({ method: 'eth_requestAccounts' });
      try {
        const web3 = new Web3(window.ethereum);
        resolve(web3);
      } catch(error) {
        reject(error);
      }
    } 
    
    reject('Install Metamask');    
  });
};

export const getContract = async web3 => {
  const networkId = await web3.eth.net.getId();
  return new web3.eth.Contract(Escrow.abi, Escrow.networks[networkId] && Escrow.networks[networkId].address);
};

export const whichAccount = ({ account, lawyer, payer, payee }) => { 
  if (account.toLowerCase() === lawyer.toLowerCase()) { return 'Lawyer account'; }
  if (account.toLowerCase() === payer.toLowerCase()) { return 'Payer account'; }
  if (account.toLowerCase() === payee.toLowerCase()) { return 'Payee account'; }

  return 'N/A';
};