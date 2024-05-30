# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```
# Deployments
## Sepolia

```shell
ERC20Swapper contract deployed to: 0x15154eE28A19A37b5b8049a1731B1Fb6DC9FFb0e
MockDEX contract deployed to: 0xeE45D3882248920B11EECe0028A09Fa5161f8D50
Token contract deployed to: 0x37fAFC25C6CB598592e6d713522D418478fd7eAA
```

### ERC20Swapper - Consideration
This example covers the minimum, but it is not production ready. The ERC20Swapper contract is not safe for production use. It is a simple example to demonstrate the concept of a swapper contract. It is not safe for production use because it does not have any checks to ensure that the user is not being scammed. For example, the user could send tokens to the swapper contract and the swapper contract could keep the tokens without sending the user the other token. The contract also uses a Mocking of a Dex that returns a fix value of the exchange rate to demonstrate the concept and agilize the development.