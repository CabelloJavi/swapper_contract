// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.5.0) (token/ERC20/ERC20.sol)

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/utils/Context.sol";

contract ERC20Token is ERC20{
    uint8 _decimals;
    constructor(string memory name, string memory symbol,uint256 supply, uint8 decimals)
    ERC20(name,symbol){
        _decimals = decimals;
        _mint(msg.sender, supply);
    }
    function decimals() public view override virtual returns (uint8) {
        return _decimals;
    }

}