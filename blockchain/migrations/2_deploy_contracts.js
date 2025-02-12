const MedicineSupplyChain = artifacts.require("MedicineSupplyChain");

module.exports = async function (deployer) {
  await deployer.deploy(MedicineSupplyChain);
  const contractInstance = await MedicineSupplyChain.deployed();
  
  console.log("MedicineSupplyChain Contract Address:", contractInstance.address);
};
