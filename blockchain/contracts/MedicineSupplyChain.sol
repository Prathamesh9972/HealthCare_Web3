// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MedicineSupplyChain {
    enum MedicineStatus { InProduction, InTransit, Delivered, Sold }

    struct Medicine {
        string name;
        string batchId;
        string supplier;
        string manufacturer;
        string distributor;
        string qrCode;
        MedicineStatus status;
        string enduser;
        address owner;
        bool exists; // Existence check flag
    }

    mapping(string => Medicine) private medicines;

    event MedicineAdded(string indexed batchId, string name, address indexed owner);
    event MedicineStatusUpdated(string indexed batchId, MedicineStatus status, address indexed updatedBy);
    event MedicineSold(string indexed batchId, string enduser, address indexed soldBy);

    modifier onlyOwner(string memory batchId) {
        require(medicines[batchId].exists, "Medicine does not exist");
        require(medicines[batchId].owner == msg.sender, "Not authorized");
        _;
    }

    function addMedicine(
        string memory name,
        string memory batchId,
        string memory supplier,
        string memory manufacturer,
        string memory distributor,
        string memory qrCode
    ) public {
        require(!medicines[batchId].exists, "Medicine already exists");

        medicines[batchId] = Medicine({
            name: name,
            batchId: batchId,
            supplier: supplier,
            manufacturer: manufacturer,
            distributor: distributor,
            qrCode: qrCode,
            status: MedicineStatus.InProduction,
            enduser: "",
            owner: msg.sender,
            exists: true
        });

        emit MedicineAdded(batchId, name, msg.sender);
    }

    function updateStatus(string memory batchId, MedicineStatus status) public onlyOwner(batchId) {
        medicines[batchId].status = status;
        emit MedicineStatusUpdated(batchId, status, msg.sender);
    }

    function sellMedicine(string memory batchId, string memory enduser) public onlyOwner(batchId) {
        require(medicines[batchId].status != MedicineStatus.Sold, "Medicine already sold");

        medicines[batchId].enduser = enduser;
        medicines[batchId].status = MedicineStatus.Sold;

        emit MedicineSold(batchId, enduser, msg.sender);
    }

    function getMedicineDetails(string memory batchId)
        public
        view
        returns (
            string memory name,
            string memory batchIdOut,
            string memory supplier,
            string memory manufacturer,
            string memory distributor,
            string memory qrCode,
            MedicineStatus status,
            string memory enduser,
            address owner
        )
    {
        require(medicines[batchId].exists, "Medicine not found");

        Medicine memory med = medicines[batchId];
        return (
            med.name,
            med.batchId,
            med.supplier,
            med.manufacturer,
            med.distributor,
            med.qrCode,
            med.status,
            med.enduser,
            med.owner
        );
    }
}
