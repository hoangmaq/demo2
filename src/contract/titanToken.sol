pragma solidity ^0.8.3;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract TitansToken is ERC20 {
  constructor() ERC20('Titans Ventures', 'Titans') {
    _mint(msg.sender, 100000000 * 10 ** 18);
  }
}