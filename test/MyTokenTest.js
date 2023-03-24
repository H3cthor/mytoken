const { expect } = require("chai");

describe("MyToken", function() {
  let MyToken, myToken, owner, addr1, addr2;

  beforeEach(async function() {
    [owner, addr1, addr2] = await ethers.getSigners();

    MyToken = await ethers.getContractFactory("MyToken");
    myToken = await MyToken.connect(owner).deploy();
    await myToken.deployed();
  });

  it("should have a name and a symbol", async function() {
    expect(await myToken.name()).to.equal("ThorToken");
    expect(await myToken.symbol()).to.equal("THR");
  });

  it("should have an initial supply of 1000 tokens", async function() {
    const initialSupply = 1000000000000000000000n;// * 10 ** await myToken.decimals();
    expect(await myToken.totalSupply()).to.equal(initialSupply);
    expect(await myToken.balanceOf(owner.address)).to.equal(initialSupply);
  });

  it("should allow the owner to mint new tokens", async function() {
    const amount = 100000000000000000000n;
    await myToken.connect(owner).mint(addr1.address, amount);
    expect(await myToken.balanceOf(addr1.address)).to.equal(amount);
  });

  it("should not allow non-owners to mint new tokens", async function() {
    const amount = 100000000000000000000n;
    await expect(myToken.connect(addr1).mint(addr2.address, amount)).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("should allow anyone to burn their own tokens", async function() {
    const amount = 100000000000000000000n;
    await myToken.burn(amount);
    expect(await myToken.balanceOf(owner.address)).to.equal(900000000000000000000n);
  });

  it("should not allow burning more tokens than the balance", async function() {
    const amount = 1100000000000000000000n;
    await expect(myToken.burn(amount)).to.be.revertedWith("ERC20: burn amount exceeds balance");
  });
});
