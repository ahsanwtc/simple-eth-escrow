// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract Escrow {
  address public lawyer;
  address public payer;
  address payable public payee;
  uint public amount;

  constructor(address _payer, address payable _payee, uint _amount) payable {
    lawyer = msg.sender;
    payer = _payer;
    payee = _payee;
    amount = _amount;
  }

  function deposit() public payable {
    require(msg.sender == payer, "sender must be the payer");
    require(address(this).balance <= amount, "funds must not exceed the agreed amount");
  }

  function release() public {
    require(msg.sender == lawyer, "only lawyer can release funds");
    require(address(this).balance == amount, "cannot release funds before the full amount is paid");
    payee.transfer(amount);
  }

  function getBalance() public view returns(uint) {
    return address(this).balance;
  }
}
