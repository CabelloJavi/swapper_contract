// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "hardhat/console.sol";

/**
* @title Interface to interact with the MockDEX contract
*/
interface IMockDEX {
   function getAmountOut(address token, uint ethTransfered, uint minAmount) external returns (uint);
}

/**
* @title Contract to swap Ether for ERC20 tokens
* @author Javier Cabello
* @notice This contract allows users to swap Ether for ERC20 tokens through an external MockDEX contract. This contract is upgradable and pausable.
* @dev This contract is upgradable and pausable. The contract owner can pause the contract in case of an emergency. The contract owner can also set a maximum gas limit for the swapEtherToToken function.
*/
contract ERC20Swapper is ReentrancyGuardUpgradeable, OwnableUpgradeable, PausableUpgradeable {
   using SafeERC20 for IERC20;

   /**
    * @dev Instance of the MockDEX contract
    */
   IMockDEX public mockDEX;

   /**
    * @dev Maximum gas limit allowed for the swapEtherToToken function
    */
   uint public maxGasLimit;

   /**
    * @dev Event emitted when tokens are transferred
    * @param from Address from which tokens are transferred
    * @param to Address to which tokens are transferred
    * @param value Amount of tokens transferred
    */
   event logTokenTransfer(address indexed from, address indexed to, uint256 value);

   /**
    * @dev Initialization function that is executed once during deployment
    * @param _mockDEX Address of the MockDEX contract
    * @param _maxGasLimit Maximum gas limit allowed
    */
   function initialize(address _mockDEX, uint _maxGasLimit) public initializer {
       require(_mockDEX != address(0), "DEX address cannot be zero");
       __ReentrancyGuard_init();
       __Ownable_init();
       __Pausable_init();
       mockDEX = IMockDEX(_mockDEX);
       maxGasLimit = _maxGasLimit;
   }

   /**
    * @dev Function to swap Ether for tokens
    * @notice This function swaps Ether for tokens using the MockDEX contract that returns a fix value
    * @param token Address of the ERC20 token to receive
    * @param minAmount Minimum amount of tokens to receive
    * @return tokenAmount Amount of tokens received
    */
   function swapEtherToToken(address token, uint minAmount) public payable nonReentrant whenNotPaused returns (uint) {
       require(token != address(0), "Token address cannot be zero");
       require(minAmount > 0, "Minimum amount should be greater than zero");
       require(gasleft() <= maxGasLimit, "Gas limit exceeded");

       uint tokenAmount = mockDEX.getAmountOut(address(token), msg.value, minAmount);

       require(tokenAmount >= minAmount, "Minimum amount is too high");
       require(IERC20(token).balanceOf(address(this)) >= tokenAmount, "Not enough tokens in the contract");
       IERC20(token).transfer(msg.sender, tokenAmount);
       emit logTokenTransfer(address(this), msg.sender, tokenAmount);
       return tokenAmount;
   }

   /**
    * @dev Function to pause the contract
    */
   function pause() external onlyOwner {
       _pause();
   }

   /**
    * @dev Function to unpause the contract
    */
   function unpause() external onlyOwner {
       _unpause();
   }
}