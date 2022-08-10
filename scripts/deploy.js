async function main() {
    // Get signer and balance
    const [deployer] = await ethers.getSigners();
    const accountBalance = await deployer.getBalance();

    // Print for aesthetics
    console.log("Deploying contract with the account:", deployer.address);
    console.log("Account Balance:", accountBalance.toString());

    // Set a contract instance
    const WavePortal = await ethers.getContractFactory("WavePortal");
    const portal = await WavePortal.deploy({
        value: ethers.utils.parseEther("0.001"),
    });
    await portal.deployed();

    // More aesthetics
    console.log("portal Contract Address:", portal.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
