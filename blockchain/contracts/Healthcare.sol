// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Healthcare {

    // Struct to represent a Medicine
    struct Medicine {
        string name;
        string batchId;
        address supplier;
        address manufacturer;
        address distributor;
        address enduser;
        string qrCode;
        string status; // e.g., "inProduction", "shipped", "delivered", "sold"
    }

    // Mapping to store medicines by batchId
    mapping(string => Medicine) public medicines;

    // Events for logging changes in medicine status
    event MedicineAdded(string batchId, address supplier, address manufacturer, address distributor, string status);
    event StatusUpdated(string batchId, string status);
    event MedicineSold(string batchId, address enduser);

    // Modifiers to check if the sender is a valid role
    modifier onlySupplier() {
        require(msg.sender != address(0), "Invalid supplier address");
        _;
    }

    modifier onlyManufacturer() {
        require(msg.sender != address(0), "Invalid manufacturer address");
        _;
    }

    modifier onlyDistributor() {
        require(msg.sender != address(0), "Invalid distributor address");
        _;
    }

    modifier onlyEndUser() {
        require(msg.sender != address(0), "Invalid end user address");
        _;
    }

    // Function to add a new medicine (only accessible by admin)
    function addMedicine(
        string memory _name,
        string memory _batchId,
        address _supplier,
        address _manufacturer,
        address _distributor,
        string memory _qrCode
    ) public onlySupplier {
        // Check if medicine with the same batchId already exists
        require(bytes(medicines[_batchId].batchId).length == 0, "Medicine with this batchId already exists");

        // Create the new medicine
        medicines[_batchId] = Medicine({
            name: _name,
            batchId: _batchId,
            supplier: _supplier,
            manufacturer: _manufacturer,
            distributor: _distributor,
            enduser: address(0), // Initially no end user
            qrCode: _qrCode,
            status: "inProduction" // Medicine starts in production
        });

        emit MedicineAdded(_batchId, _supplier, _manufacturer, _distributor, "inProduction");
    }

    // Function to update the status of the medicine
    function updateStatus(string memory _batchId, string memory _status) public {
        Medicine storage medicine = medicines[_batchId];
        require(bytes(medicine.batchId).length > 0, "Medicine not found");

        // Only the supplier, manufacturer, or distributor can update the status
        if (msg.sender == medicine.supplier || msg.sender == medicine.manufacturer || msg.sender == medicine.distributor) {
            medicine.status = _status;
            emit StatusUpdated(_batchId, _status);
        } else {
            revert("Unauthorized: Only supplier, manufacturer, or distributor can update status");
        }
    }

    // Function to sell the medicine (only accessible by distributor)
    function sellMedicine(string memory _batchId, address _enduser) public onlyDistributor {
        Medicine storage medicine = medicines[_batchId];
        require(bytes(medicine.batchId).length > 0, "Medicine not found");
        require(medicine.enduser == address(0), "Medicine already sold");

        medicine.enduser = _enduser;
        medicine.status = "sold";
        emit MedicineSold(_batchId, _enduser);
    }

    // Function to get medicine details by batchId
    function getMedicineDetails(string memory _batchId) public view returns (Medicine memory) {
        return medicines[_batchId];
    }
}
