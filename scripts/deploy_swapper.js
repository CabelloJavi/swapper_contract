const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer, scrow] = await ethers.getSigners();
  console.log(
    "Deploying the Swapper contract with the account:",
    deployer.address
  );

  const MockDEX = await ethers.getContractFactory("MockDEX");
  const dex = await MockDEX.deploy();

  const maxGasLimit = 1000000;

  const SWAPPER = await ethers.getContractFactory("ERC20Swapper");
  const swap_contract = await upgrades.deployProxy(SWAPPER, [
    dex.address,
    maxGasLimit,
  ]);

  MyERC20 = await ethers.getContractFactory("ERC20Token");
    token = await MyERC20.deploy(
      "ERC20 Token",
      "CUTO",
      "1000000000000000000000000000",
      18
    ); // Initial supply
    await token.deployed();

  await token.transfer(swap_contract.address, "100000000000000000000000"); // Transfer tokens to the mock DEX

  console.log("ERC20Swapper contract deployed to:", swap_contract.address);
  console.log("MockDEX contract deployed to:", dex.address);
  console.log("Token contract deployed to:", token.address);
  console.log("Balance of token contract:", await token.balanceOf(swap_contract.address));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
