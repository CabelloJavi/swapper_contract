require("@nomicfoundation/hardhat-toolbox");
require('@openzeppelin/hardhat-upgrades');
require("@nomiclabs/hardhat-solhint");
require('solidity-coverage');
require('hardhat-gas-reporter');
require("hardhat-tracer");
const { secrets } = require('.');

module.exports = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 10000,
      },
    },
  },
  gasReporter: {
    enabled: secrets.REPORT_GAS,
    currency: "ETH",
    coinmarketcap: secrets.COINMKT_API_KEY
  },
  networks: {
    local: {
      url: "http://127.0.0.1:8545",
      accounts: secrets.ACCOUNTS,
      plugins: ["hardhat-network-tracer", "hardhat-gas-reporter", "solidity-coverage"]
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${secrets.INFURA_API_KEY}`,
      chainId: 11155111,
      accounts: secrets.ACCOUNTS
    },
  }
};

