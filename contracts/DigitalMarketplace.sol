// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DigitalMarketplace
 * @dev A blockchain-powered digital marketplace for buying, selling, and transferring digital assets
 * @notice Products are stored on-chain with IPFS image references
 */
contract DigitalMarketplace {
    // ============ State Variables ============
    
    address public owner;
    uint256 public platformFee; // in basis points (500 = 5%)
    uint256 public productCount;
    
    struct Product {
        uint256 id;
        string name;
        string description;
        uint256 price;
        string imageHash; // IPFS hash
        address currentOwner;
        bool isForSale;
        bool exists;
    }
    
    mapping(uint256 => Product) public products;
    mapping(address => uint256[]) public ownerProducts;
    
    // ============ Events ============
    
    event ProductListed(uint256 indexed productId, string name, uint256 price, address indexed owner);
    event ProductPurchased(uint256 indexed productId, address indexed buyer, uint256 price);
    event OwnershipTransferred(uint256 indexed productId, address indexed from, address indexed to);
    event ProductDelisted(uint256 indexed productId);
    event FundsWithdrawn(address indexed owner, uint256 amount);
    event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);
    
    // ============ Modifiers ============
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only marketplace owner can call this");
        _;
    }
    
    modifier productExists(uint256 _productId) {
        require(products[_productId].exists, "Product does not exist");
        _;
    }
    
    modifier onlyProductOwner(uint256 _productId) {
        require(products[_productId].currentOwner == msg.sender, "Only product owner can call this");
        _;
    }
    
    // ============ Constructor ============
    
    constructor(uint256 _platformFee) {
        require(_platformFee <= 2500, "Fee cannot exceed 25%"); // Max 25%
        owner = msg.sender;
        platformFee = _platformFee;
    }
    
    // ============ Core Functions ============
    
    /**
     * @dev List a new product for sale
     * @param _name Product name
     * @param _description Product description
     * @param _price Price in wei
     * @param _imageHash IPFS hash of the product image
     */
    function listProduct(
        string memory _name,
        string memory _description,
        uint256 _price,
        string memory _imageHash
    ) external {
        require(_price > 0, "Price must be greater than 0");
        require(bytes(_name).length > 0, "Name cannot be empty");
        
        productCount++;
        
        products[productCount] = Product({
            id: productCount,
            name: _name,
            description: _description,
            price: _price,
            imageHash: _imageHash,
            currentOwner: msg.sender,
            isForSale: true,
            exists: true
        });
        
        ownerProducts[msg.sender].push(productCount);
        
        emit ProductListed(productCount, _name, _price, msg.sender);
    }
    
    /**
     * @dev Purchase a product by sending ETH
     * @param _productId ID of the product to purchase
     */
    function purchaseProduct(uint256 _productId) 
        external 
        payable 
        productExists(_productId) 
    {
        Product storage product = products[_productId];
        
        require(product.isForSale, "Product is not for sale");
        require(msg.value == product.price, "Incorrect ETH amount sent");
        require(msg.sender != product.currentOwner, "Cannot buy your own product");
        
        // Calculate platform fee
        uint256 fee = (product.price * platformFee) / 10000;
        uint256 ownerAmount = product.price - fee;
        
        // Update product ownership
        address previousOwner = product.currentOwner;
        product.currentOwner = msg.sender;
        product.isForSale = false;
        
        // Transfer funds
        (bool ownerSuccess, ) = previousOwner.call{value: ownerAmount}("");
        require(ownerSuccess, "Transfer to product owner failed");
        
        // Fee stays in contract for withdrawal
        
        emit ProductPurchased(_productId, msg.sender, product.price);
    }
    
    /**
     * @dev Transfer ownership of a product without payment
     * @param _productId ID of the product
     * @param _newOwner Address of the new owner
     */
    function transferOwnership(uint256 _productId, address _newOwner) 
        external 
        productExists(_productId) 
        onlyProductOwner(_productId) 
    {
        require(_newOwner != address(0), "Invalid recipient address");
        require(_newOwner != msg.sender, "Cannot transfer to yourself");
        
        Product storage product = products[_productId];
        product.currentOwner = _newOwner;
        product.isForSale = false;
        
        emit OwnershipTransferred(_productId, msg.sender, _newOwner);
    }
    
    /**
     * @dev List an owned product for sale at a new price
     * @param _productId ID of the product
     * @param _newPrice New price in wei
     */
    function listForSale(uint256 _productId, uint256 _newPrice) 
        external 
        productExists(_productId) 
        onlyProductOwner(_productId) 
    {
        require(_newPrice > 0, "Price must be greater than 0");
        
        products[_productId].price = _newPrice;
        products[_productId].isForSale = true;
        
        emit ProductListed(_productId, products[_productId].name, _newPrice, msg.sender);
    }
    
    /**
     * @dev Remove a product from sale
     * @param _productId ID of the product
     */
    function delistProduct(uint256 _productId) 
        external 
        productExists(_productId) 
        onlyProductOwner(_productId) 
    {
        products[_productId].isForSale = false;
        emit ProductDelisted(_productId);
    }
    
    // ============ Admin Functions ============
    
    /**
     * @dev Withdraw accumulated platform fees to the owner
     */
    function withdrawFunds() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Withdrawal failed");
        
        emit FundsWithdrawn(owner, balance);
    }
    
    /**
     * @dev Update the platform fee (only owner)
     * @param _newFee New fee in basis points (e.g., 500 = 5%)
     */
    function updatePlatformFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 2500, "Fee cannot exceed 25%");
        
        uint256 oldFee = platformFee;
        platformFee = _newFee;
        
        emit PlatformFeeUpdated(oldFee, _newFee);
    }
    
    // ============ View Functions ============
    
    /**
     * @dev Get product details
     * @param _productId ID of the product
     */
    function getProduct(uint256 _productId) 
        external 
        view 
        productExists(_productId) 
        returns (
            uint256 id,
            string memory name,
            string memory description,
            uint256 price,
            string memory imageHash,
            address currentOwner,
            bool isForSale
        ) 
    {
        Product storage product = products[_productId];
        return (
            product.id,
            product.name,
            product.description,
            product.price,
            product.imageHash,
            product.currentOwner,
            product.isForSale
        );
    }
    
    /**
     * @dev Get all products owned by an address
     * @param _owner Address to query
     */
    function getOwnerProducts(address _owner) external view returns (uint256[] memory) {
        return ownerProducts[_owner];
    }
    
    /**
     * @dev Get the contract balance (accumulated fees)
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Calculate the fee for a given price
     * @param _price Price in wei
     */
    function calculateFee(uint256 _price) external view returns (uint256) {
        return (_price * platformFee) / 10000;
    }
    
    // ============ Receive ETH ============
    
    receive() external payable {}
}
