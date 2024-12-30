const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying with:", deployer.address);

    const ENSRegistryAddress = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"; // Sepolia ENS Registry
    const Resolver = await ethers.getContractFactory("CustomResolver");
    const resolver = await Resolver.deploy(ENSRegistryAddress, deployer.address);

    console.log("CustomResolver deployed at:", resolver.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
