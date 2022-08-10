async function main() {
    // Get contract instance
    const WavePortal = await ethers.getContractFactory("WavePortal");

    // Deploy contract
    const portal = await WavePortal.deploy({
        value: ethers.utils.parseEther("0.1"),
    });

    // Print for aesthetics
    console.log("Deploying, please wait...");

    // Wait for deployment to finish
    await portal.deployed();

    // More aesthetics
    console.log("portal deployed successfully!");
    console.log("portal Contract Address:", portal.address);

    let contractBalance = await ethers.provider.getBalance(portal.address);
    console.log("Contract Balance:", ethers.utils.formatEther(contractBalance));

    // Call getTotalWaves()
    let count;
    count = await portal.getTotalWaves();
    console.log("Total Waves:", count.toNumber());

    // Call wave() to send in a wave
    let wave = await portal.wave("This is Wave A!");
    await wave.wait();

    // Call wave() to send in a wave
    wave = await portal.wave("This is Wave B!");
    await wave.wait();

    contractBalance = await ethers.provider.getBalance(portal.address);
    console.log("Contract balance:", ethers.utils.formatEther(contractBalance));

    // Send more waves
    const [_, randomPerson] = await ethers.getSigners();
    wave = await portal.connect(randomPerson).wave("Another message!");
    await wave.wait();

    // Call allWaves()
    let allWaves = await portal.allWaves();
    console.log(allWaves);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
