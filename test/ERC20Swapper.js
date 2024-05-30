const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC20Swapper", function () {
  let ERC20Swapper, MockDEX, MyERC20, swapper, mockDEX, token;
  const maxGasLimit = 20000000;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    MockDEX = await ethers.getContractFactory("MockDEX");
    mockDEX = await MockDEX.deploy();
    await mockDEX.deployed();

    MyERC20 = await ethers.getContractFactory("ERC20Token");
    token = await MyERC20.deploy(
      "ERC20 Token",
      "CUTO",
      "1000000000000000000000000000",
      18
    ); // Initial supply
    await token.deployed();

    ERC20Swapper = await ethers.getContractFactory("ERC20Swapper");
  
    swapper = await upgrades.deployProxy(ERC20Swapper, [
      mockDEX.address,
      maxGasLimit,
    ]);
    await swapper.deployed();

    await token.transfer(swapper.address, "100000000000000000000000"); // Transfer tokens to the mock DEX
  });

  it("Should swap Ether to tokens", async function () {
    const ethAmount = ethers.utils.parseEther("1");
    const minAmount = 50;
    const expectedAmount = ethAmount.mul(100); // Mock exchange rate

    const initialBalance = await token.balanceOf(swapper.address);

    await expect(
      swapper
        .connect(addr1)
        .swapEtherToToken(
          token.address,
          ethers.utils.parseEther(minAmount.toString()),
          { value: ethAmount, gasLimit: maxGasLimit }
        )
    )
      .to.emit(swapper, "logTokenTransfer")
      .withArgs(swapper.address, addr1.address, expectedAmount);

    const finalBalance = await token.balanceOf(swapper.address);
    expect(initialBalance.sub(finalBalance)).to.equal(expectedAmount);
  });

  it("Should revert if gas limit is exceeded", async function () {
    const ethAmount = ethers.utils.parseEther("1");
    const minAmount = 50;
    const expectedAmount = ethAmount.mul(100); // Mock exchange rate

    await expect(
      swapper
        .connect(addr1)
        .swapEtherToToken(
          token.address,
          ethers.utils.parseEther(minAmount.toString()),
          { value: ethAmount, gasLimit: 30000000 }
        )
    ).to.be.revertedWith("Gas limit exceeded");
  });

  it("Should revert if token address is zero", async function () {
    const ethAmount = ethers.utils.parseEther("1");
    const minAmount = 50;
    const expectedAmount = ethAmount.mul(100); // Mock exchange rate

    await expect(
      swapper
        .connect(addr1)
        .swapEtherToToken(
          ethers.constants.AddressZero,
          ethers.utils.parseEther(minAmount.toString()),
          { value: ethAmount, gasLimit: maxGasLimit}
        )
    ).to.be.revertedWith("Token address cannot be zero");
  });

  it("Should revert if minimum amount is zero", async function () {
    const ethAmount = ethers.utils.parseEther("1");

    await expect(
      swapper
        .connect(addr1)
        .swapEtherToToken(token.address, 0, { value: ethAmount, gasLimit: maxGasLimit})
    ).to.be.revertedWith("Minimum amount should be greater than zero");
  });

  it("Should revert if minimum amount is too high", async function () {
    const ethAmount = ethers.utils.parseEther("1");
    const minAmount = 101; // Higher than mock exchange rate

    await expect(
      swapper
        .connect(addr1)
        .swapEtherToToken(
          token.address,
          ethers.utils.parseEther(minAmount.toString()),
          { value: ethAmount, gasLimit: maxGasLimit}
        )
    ).to.be.revertedWith("Minimum amount is too high");
  });

  it("Should pause and unpause the contract", async function () {
    await swapper.connect(owner).pause();
    expect(await swapper.paused()).to.be.true;

    await swapper.connect(owner).unpause();
    expect(await swapper.paused()).to.be.false;
  });
});
