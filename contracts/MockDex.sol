// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockDEX {
    uint public constant MOCK_EXCHANGE_RATE = 100; // 1 ETH = 100 tokens

    function getAmountOut(address token, uint ethTransfered, uint minAmount) external returns (uint) {
        uint tokenAmount = ethTransfered * MOCK_EXCHANGE_RATE;
        require(minAmount <= tokenAmount, "Minimum amount is too high");
        return tokenAmount;
    }
}