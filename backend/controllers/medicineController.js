const Web3 = require('web3');
const { Medicine } = require('../models/Medicine'); // Assuming you have your existing Mongoose model

// Connect to Ethereum provider (e.g., Infura, Ganache, etc.)
const web3 = new Web3('<your_ethereum_provider>'); // Replace with your provider URL
const contractABI = [/* your contract ABI here */]; // ABI of the Healthcare contract
const contractAddress = '<your_contract_address>'; // Replace with your deployed contract address
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Function to add medicine (calls the smart contract addMedicine function)
exports.addMedicine = async (req, res) => {
    const { name, batchId, supplier, manufacturer, distributor, qrCode } = req.body;

    try {
        // Ensure that the medicine doesn't already exist
        const existingMedicine = await Medicine.findOne({ batchId });
        if (existingMedicine) {
            return res.status(400).json({ msg: 'Medicine with this batchId already exists' });
        }

        // Get the sender's Ethereum account (usually the supplier)
        const accounts = await web3.eth.getAccounts();
        const senderAddress = accounts[0]; // You can modify this based on your use case

        // Call the addMedicine function in the smart contract
        await contract.methods.addMedicine(
            name,
            batchId,
            supplier,
            manufacturer,
            distributor,
            qrCode
        ).send({ from: senderAddress });

        // If the transaction is successful, save to your MongoDB database
        const newMedicine = new Medicine({ name, batchId, supplier, manufacturer, distributor, qrCode, status: 'inProduction' });
        await newMedicine.save();

        res.status(201).json({ msg: 'Medicine added and transaction recorded on the blockchain' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error while adding medicine' });
    }
};

// Function to update medicine status (calls the smart contract updateStatus function)
exports.updateMedicineStatus = async (req, res) => {
    const { batchId, status } = req.body;

    try {
        // Ensure that the medicine exists
        const existingMedicine = await Medicine.findOne({ batchId });
        if (!existingMedicine) {
            return res.status(400).json({ msg: 'Medicine not found' });
        }

        // Get the sender's Ethereum account (supplier, manufacturer, or distributor)
        const accounts = await web3.eth.getAccounts();
        const senderAddress = accounts[0]; // Modify this based on who is updating the status

        // Call the updateStatus function in the smart contract
        await contract.methods.updateStatus(batchId, status).send({ from: senderAddress });

        // Update the status in the local database (optional)
        existingMedicine.status = status;
        await existingMedicine.save();

        res.status(200).json({ msg: `Status updated to ${status} on blockchain and in the database` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error while updating status' });
    }
};

// Function to sell medicine (calls the smart contract sellMedicine function)
exports.sellMedicine = async (req, res) => {
    const { batchId, enduser } = req.body;

    try {
        // Ensure that the medicine exists
        const existingMedicine = await Medicine.findOne({ batchId });
        if (!existingMedicine) {
            return res.status(400).json({ msg: 'Medicine not found' });
        }

        // Ensure that the medicine has not been sold yet
        if (existingMedicine.enduser) {
            return res.status(400).json({ msg: 'Medicine already sold' });
        }

        // Get the sender's Ethereum account (distributor)
        const accounts = await web3.eth.getAccounts();
        const senderAddress = accounts[0]; // Modify this based on who is selling the medicine

        // Call the sellMedicine function in the smart contract
        await contract.methods.sellMedicine(batchId, enduser).send({ from: senderAddress });

        // Update the enduser in the local database (optional)
        existingMedicine.enduser = enduser;
        existingMedicine.status = 'sold';
        await existingMedicine.save();

        res.status(200).json({ msg: 'Medicine sold and transaction recorded on blockchain' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error while selling medicine' });
    }
};

// Function to get medicine details by batchId
exports.getMedicineDetails = async (req, res) => {
    const { batchId } = req.params;

    try {
        // Fetch the medicine details from the smart contract
        const medicine = await contract.methods.getMedicineDetails(batchId).call();

        res.status(200).json({ medicine });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error fetching medicine details from blockchain' });
    }
};
