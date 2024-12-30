// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import "@ensdomains/ens-contracts/contracts/resolvers/Resolver.sol";

contract SubnameRegistrar is Ownable {
    // ENS registry contract
    ENS public ens;
    
    // Base domain information
    bytes32 public rootNode;
    
    // Mapping from subname to owner
    mapping(bytes32 => address) public subnameOwners;
    
    // Registration fee in ETH
    uint256 public registrationFee;
    
    // Events
    event SubnameRegistered(string indexed subname, address indexed owner);
    event RegistrationFeeChanged(uint256 newFee);
    
    constructor(
        address _ensRegistry,
        bytes32 _rootNode,
        uint256 _registrationFee
    ) {
        ens = ENS(_ensRegistry);
        rootNode = _rootNode;
        registrationFee = _registrationFee;
    }
    
    // Calculate node hash for a subname
    function getSubnameNode(string memory subname) public view returns (bytes32) {
        return keccak256(abi.encodePacked(rootNode, keccak256(bytes(subname))));
    }
    
    // Register a new subname
    function registerSubname(
        string memory subname,
        address owner,
        address resolver
    ) public payable {
        require(msg.value >= registrationFee, "Insufficient registration fee");
        
        bytes32 subnameNode = getSubnameNode(subname);
        require(subnameOwners[subnameNode] == address(0), "Subname already registered");
        
        // Set the resolver
        ens.setResolver(subnameNode, resolver);
        
        // Set the owner
        ens.setOwner(subnameNode, owner);
        
        // Record the subname owner
        subnameOwners[subnameNode] = owner;
        
        emit SubnameRegistered(subname, owner);
    }
    
    // Update registration fee
    function setRegistrationFee(uint256 newFee) public onlyOwner {
        registrationFee = newFee;
        emit RegistrationFeeChanged(newFee);
    }
    
    // Check if a subname is available
    function isSubnameAvailable(string memory subname) public view returns (bool) {
        bytes32 subnameNode = getSubnameNode(subname);
        return subnameOwners[subnameNode] == address(0);
    }
    
    // Get subname owner
    function getSubnameOwner(string memory subname) public view returns (address) {
        bytes32 subnameNode = getSubnameNode(subname);
        return subnameOwners[subnameNode];
    }
    
    // Withdraw collected fees
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }
    
    // Allow contract to receive ETH
    receive() external payable {}
}